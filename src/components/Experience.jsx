import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Experience = () => {
    return (
        <section id="experience" className="section" style={{ background: 'rgba(22, 27, 34, 0.5)' }}>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp}>
                    <span className="mono text-accent">04. JOURNEY</span>
                    <h2>Experience & Education</h2>
                </motion.div>

                <div className="timeline">
                    {/* Education Item */}
                    <motion.div className="timeline-item" variants={fadeInUp}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-date">2024 - Present</div>
                        <h3>B.Tech, Electrical & Electronics Engineering</h3>
                        <p>Deepening expertise in Advanced IoT, Machine Learning, and Grid Automation. Leading projects in
                            Smart Energy systems.</p>
                    </motion.div>

                    {/* Experience Item */}
                    <motion.div className="timeline-item" variants={fadeInUp}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-date">Nov 2023 - May 2024</div>
                        <h3>Electrical Engineering Intern</h3>
                        <h4
                            style={{ fontSize: '0.95rem', color: 'var(--text-accent)', marginBottom: '0.5rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                            Coromandel International Limited</h4>
                        <p
                            style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-map-marker-alt" style={{ fontSize: '0.8rem' }}></i> Vishakhapatnam, Andhra Pradesh
                        </p>
                        <ul
                            style={{ paddingLeft: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Analyzed thermodynamic cycles and turbine efficiency
                                parameters for steam turbine power generation.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Assisted in the diagnostic testing and preventive maintenance
                                of 11kV/440V transformers and industrial distribution networks.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Performed insulation resistance testing on three-phase
                                industrial induction motors to ensure operational reliability.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Adhered to rigorous industrial safety protocols and energy
                                management standards (ISO 50001) in high-risk plant environments.</li>
                        </ul>
                    </motion.div>

                    {/* Education Item */}
                    <motion.div className="timeline-item" variants={fadeInUp}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-date">2021 - 2024</div>
                        <h3>Diploma, Electrical & Electronics Engineering</h3>
                        <p>Built foundational knowledge in Circuit Design and Power Systems. Developed multiple embedded
                            system prototypes.</p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Experience;
