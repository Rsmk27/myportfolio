import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Skills = () => {
    return (
        <section id="skills" className="section" style={{ background: 'rgba(22, 27, 34, 0.5)' }}>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp}>
                    <span className="mono text-accent">02. CAPABILITY</span>
                    <h2>Technical Arsenal</h2>
                </motion.div>

                <motion.div className="skills-container" variants={staggerContainer}>
                    {/* Pillar 1 */}
                    <motion.article className="skill-pillar pillar-core" variants={fadeInUp}>
                        <h3><i className="fas fa-microchip"></i> Core Engineering</h3>
                        <div className="skill-list">
                            <span className="skill-tag">Electrical & Electronics Engineering</span>
                            <span className="skill-tag">Embedded Systems Design</span>
                            <span className="skill-tag">Power & Energy Systems</span>
                            <span className="skill-tag">Control Systems & Automation</span>
                            <span className="skill-tag">Internet of Things (IoT)</span>
                        </div>
                    </motion.article>

                    {/* Pillar 2 */}
                    <motion.article className="skill-pillar pillar-software" variants={fadeInUp}>
                        <h3><i className="fas fa-terminal"></i> Software & Tools</h3>
                        <div className="skill-list">
                            <span className="skill-tag">C / C++ / Python</span>
                            <span className="skill-tag">Arduino / ESP8266</span>
                            <span className="skill-tag">Web (HTML/CSS/React)</span>
                            <span className="skill-tag">Firebase / APIs</span>
                            <span className="skill-tag">Git / Linux</span>
                        </div>
                    </motion.article>

                    {/* Pillar 3 */}
                    <motion.article className="skill-pillar pillar-domains" variants={fadeInUp}>
                        <h3><i className="fas fa-globe-americas"></i> Applied Domains</h3>
                        <div className="skill-list">
                            <span className="skill-tag">Smart Energy Systems</span>
                            <span className="skill-tag">Green Technology</span>
                            <span className="skill-tag">Autonomous Grids</span>
                            <span className="skill-tag">FinTech Platforms</span>
                            <span className="skill-tag">AI-Driven Engineering</span>
                        </div>
                    </motion.article>
                </motion.div>

                {/* Engineering Strengths */}
                <motion.div className="engineering-strengths" variants={fadeInUp}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Engineering Confidence
                    </h3>
                    <div className="strengths-grid">
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Systems Thinking</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Full-Stack Engineering</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Problem Decomposition</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Scalable Architecture</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Rapid Prototyping</div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default Skills;
