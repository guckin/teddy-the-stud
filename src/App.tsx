
import * as React from 'react'
import { useScroll, animated, useSpring } from '@react-spring/web'

import styles from './styles.module.scss'

const X_LINES = 40

const PAGE_COUNT = 5

const INITIAL_WIDTH = 20

export default function App() {
    const containerRef = React.useRef<HTMLDivElement>(null!)
    const barContainerRef = React.useRef<HTMLDivElement>(null!)

    const [textStyles1, textApi] = useSpring(() => ({
        y: '100%',
    }));

    const [textStyles2, textApi2] = useSpring(() => ({
        y: '100%',
    }));

    const { scrollYProgress } = useScroll({
        container: containerRef,
        onChange: ({ value: { scrollYProgress } }) => {
            console.log(scrollYProgress);
            if (scrollYProgress > 0.2) {
                textApi.start({ y: '0%' })
            } else {
                textApi.start({ y: '100%' })
            }

            if (scrollYProgress > 0.40) {
                textApi2.start({ y: '0%' })
            } else {
                textApi2.start({ y: '100%' })
            }
        },
        default: {
            immediate: true,
        },
    });


    return (
        <div ref={containerRef} className={styles.body}>
            <div className={styles.animated__layers}>
                {
                    [
                        styles.bar__container,
                        styles.bar__container__inverted
                    ].map(style => (
                        <animated.div ref={barContainerRef} className={style}>
                            {Array.from({ length: X_LINES }).map((_, i) => (
                                <animated.div
                                    key={i}
                                    className={styles.bar}
                                    style={{
                                        width: scrollYProgress.to(scrollP => {
                                            const percentilePosition = (i + 1) / X_LINES

                                            return INITIAL_WIDTH / 4 + 20 * Math.cos(((percentilePosition - scrollP) * Math.PI) / 1.5) ** 32
                                        }),
                                    }}
                                />
                            ))}
                        </animated.div>
                    ))
                }

                <animated.div
                    className={styles.dot}
                    // style={{
                    //     clipPath: scrollYProgress.to(val => `circle(${val * 100}%)`),
                    // }}
                >
                    <h1 className={styles.title}>
                        <span>
                          <animated.span style={textStyles1}>Teddy</animated.span>
                        </span>
                        <span>
                          <animated.span style={textStyles2}>Boy</animated.span>
                        </span>

                        <span>
                          <animated.span style={textStyles1}>Stud Service</animated.span>
                        </span>
                        <span>
                          <animated.span style={textStyles2}>Golden Doodle</animated.span>
                        </span>
                    </h1>
                </animated.div>
            </div>
            {new Array(PAGE_COUNT).fill(null).map((_, index) => (
                <div className={styles.full__page} key={index} />
            ))}
        </div>
    )
}

