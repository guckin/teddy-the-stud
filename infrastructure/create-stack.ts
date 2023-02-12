#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TestAppStack } from './app-stack';

const app = new cdk.App();
new TestAppStack(app, 'TestAppStack', {
  env: { account: process.env['CDK_DEFAULT_ACCOUNT'], region: process.env['CDK_DEFAULT_REGION']},
  domainName: 'example.com'
});