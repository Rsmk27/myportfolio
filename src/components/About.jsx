import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import useMobileDetect from '../utils/useMobileDetect';

const About = () => {
    const isMobile = useMobileDetect();
    
    return (
        <section id="about" className="section control-unit-section">
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer(isMobile)}
            >
                <motion.div variants={fadeInUp(isMobile)}>
                    <span className="mono text-accent system-label">CONTROL UNIT // MICROCONTROLLER BLOCK</span>
                    <h2>System Architecture</h2>
                </motion.div>

                <div className="control-unit-diagram">
                    {/* Input Block */}
                    <motion.div className="block-diagram-section input-block" variants={fadeInUp(isMobile)}>
                        <div className="block-header">
                            <i className="fas fa-download"></i>
                            <span>INPUT</span>
                        </div>
                        <div className="block-content">
                            <h3>Background & Interests</h3>
                            <p>Electrical & Electronics Engineering student specializing in intelligent systems that integrate hardware, software, and energy infrastructure.</p>
                            <div className="input-signals">
                                <span className="signal-tag"><i className="fas fa-bolt"></i> Embedded Systems</span>
                                <span className="signal-tag"><i className="fas fa-solar-panel"></i> Smart Energy</span>
                                <span className="signal-tag"><i className="fas fa-network-wired"></i> IoT</span>
                                <span className="signal-tag"><i className="fas fa-leaf"></i> Green Tech</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Signal Flow Connector */}
                    <div className="signal-flow-connector">
                        <div className="flow-line"></div>
                        <i className="fas fa-chevron-right flow-arrow"></i>
                    </div>

                    {/* Logic/Processing Block */}
                    <motion.div className="block-diagram-section logic-block" variants={fadeInUp(isMobile)}>
                        <div className="block-header">
                            <i className="fas fa-microchip"></i>
                            <span>LOGIC / PROCESSING</span>
                        </div>
                        <div className="block-content">
                            <h3>Thinking Process</h3>
                            <p>Systems mindset: understanding not just how components function, but how entire systems behave, evolve, and improve over time.</p>
                            <ul className="logic-operations">
                                <li><i className="fas fa-check-circle"></i> Problem Decomposition</li>
                                <li><i className="fas fa-check-circle"></i> System Integration</li>
                                <li><i className="fas fa-check-circle"></i> Optimization Loop</li>
                                <li><i className="fas fa-check-circle"></i> Real-world Validation</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Signal Flow Connector */}
                    <div className="signal-flow-connector">
                        <div className="flow-line"></div>
                        <i className="fas fa-chevron-right flow-arrow"></i>
                    </div>

                    {/* Output Block */}
                    <motion.div className="block-diagram-section output-block" variants={fadeInUp(isMobile)}>
                        <div className="block-header">
                            <i className="fas fa-upload"></i>
                            <span>OUTPUT</span>
                        </div>
                        <div className="block-content">
                            <h3>Goals & Impact</h3>
                            <p>Design and deploy intelligent engineering systems that make energy infrastructure more efficient, autonomous, and sustainable.</p>
                            <div className="output-metrics">
                                <div className="metric-item">
                                    <span className="metric-label">Target</span>
                                    <span className="metric-value">Sustainable Future</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Method</span>
                                    <span className="metric-value">Smart Systems</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feedback Loop */}
                    <motion.div className="feedback-loop" variants={fadeInUp(isMobile)}>
                        <div className="feedback-arrow">
                            <i className="fas fa-undo"></i>
                            <span>CONTINUOUS LEARNING & IMPROVEMENT</span>
                        </div>
                    </motion.div>
                </div>

                {/* System Philosophy */}
                <motion.div className="system-philosophy" variants={fadeInUp(isMobile)}>
                    <blockquote className="system-motto">
                        <i className="fas fa-quote-left"></i>
                        <p>"Build systems that are not only functional — but meaningful, efficient, and future-ready."</p>
                        <i className="fas fa-quote-right"></i>
                    </blockquote>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default About;
