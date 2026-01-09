import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Vision = () => {
    return (
        <section id="vision" className="section">
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp}>
                    <span className="mono text-accent">06. VISION & FUTURE DIRECTION</span>
                    <h2>The Roadmap</h2>
                </motion.div>

                <div className="vision-content">
                    {/* Main Vision Statement */}
                    <motion.div className="vision-statement" variants={fadeInUp}>
                        <p>
                            I am working toward building <strong>intelligent engineering systems</strong> that make energy
                            infrastructure more efficient, autonomous, and sustainable.
                        </p>
                        <p style={{ marginTop: '1.5rem' }}>
                            My long-term goal is to design and deploy technologies that combine electrical foundations,
                            embedded intelligence, and AI-driven software into scalable real-world systems.
                        </p>
                        <p style={{ marginTop: '1.5rem' }}>
                            I believe the next era of engineering will be defined by <strong>smart energy networks,
                                autonomous control systems, and software-defined infrastructure</strong> — and I am
                            preparing myself to contribute meaningfully to that future.
                        </p>
                    </motion.div>

                    {/* Focus Areas */}
                    <motion.div className="focus-grid" variants={staggerContainer}>
                        <motion.div className="focus-card" variants={fadeInUp}>
                            <span className="focus-icon">🌱</span>
                            <h4>Sustainable & Smart Energy</h4>
                            <p>Designing cleaner, more adaptive power systems and energy management platforms.</p>
                        </motion.div>
                        <motion.div className="focus-card" variants={fadeInUp}>
                            <span className="focus-icon">🧠</span>
                            <h4>Intelligent & Autonomous Infrastructure</h4>
                            <p>Developing self-regulating systems using embedded control, IoT, and AI.</p>
                        </motion.div>
                        <motion.div className="focus-card" variants={fadeInUp}>
                            <span className="focus-icon">⚙️</span>
                            <h4>Full-Stack Physical Systems</h4>
                            <p>Building platforms where hardware, data, and software operate as one.</p>
                        </motion.div>
                        <motion.div className="focus-card" variants={fadeInUp}>
                            <span className="focus-icon">🔬</span>
                            <h4>Continuous Learning & Innovation</h4>
                            <p>Pursuing advanced knowledge in emerging engineering technologies.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Vision;
