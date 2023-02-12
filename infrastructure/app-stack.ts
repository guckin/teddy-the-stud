import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CachePolicy, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export type TestAppConfig = StackProps & {domainName: string, recordName: string};

export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: TestAppConfig) {
    super(scope, id, props);
    const {domainName, recordName} = props;

    const bucket = new Bucket(this, 'SPABucket', {
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html'
    });

    new BucketDeployment(this, "SPADeployment", {
        sources: [
            Source.asset('./dist/ui')
        ],
        destinationBucket: bucket
    });

    const hostedZone = HostedZone.fromLookup(this, 'HostedZone', { domainName });

    const certificate = new DnsValidatedCertificate(this, 'Cert', {
        domainName,
        hostedZone,
        region: 'us-east-1'
    });

    const distribution = new Distribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        domainNames: [domainName],
        certificate: certificate,
        defaultBehavior: {
            cachePolicy: new CachePolicy(this, 'Cacheing', {
                defaultTtl: Duration.minutes(1)
            }),
            origin: new S3Origin(bucket),
        },
    });

    new ARecord(this, 'ARecord', {
        zone: hostedZone,
        recordName,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        ttl: Duration.minutes(1),
    });

    
  }
}