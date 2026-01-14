import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import useMobileDetect from '../utils/useMobileDetect';

const Certifications = () => {
    const isMobile = useMobileDetect();
    
    return (
        <section id="certifications" className="section">
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={staggerContainer(isMobile)}
            >
                <motion.div variants={fadeInUp(isMobile)}>
                    <span className="mono text-accent">05. CREDENTIALS</span>
                    <h2>Certifications</h2>
                </motion.div>

                <div className="cert-grid">
                    {/* Cert 1 */}
                    <motion.div className="cert-card" variants={fadeInUp(isMobile)}>
                        <div className="cert-icon">
                            <i className="fas fa-microchip"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Embedded Systems Design</h3>
                            <p className="cert-issuer">Specialized Training</p>
                            <p className="cert-desc">Comprehensive expertise in microcontroller architecture, interfacing
                                periperhals, and real-time systems programming.</p>
                        </div>
                    </motion.div>

                    {/* Cert 2 */}
                    <motion.div className="cert-card" variants={fadeInUp(isMobile)}>
                        <div className="cert-icon">
                            <i className="fas fa-charging-station"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Electric Vehicle Technology</h3>
                            <p className="cert-issuer">Technical Certification</p>
                            <p className="cert-desc">Advanced training in EV powertrains, battery management systems (BMS), and
                                charging infrastructure architectures.</p>
                        </div>
                    </motion.div>

                    {/* Cert 3 */}
                    <motion.div className="cert-card" variants={fadeInUp(isMobile)}>
                        <div className="cert-icon">
                            <i className="fas fa-helicopter"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Drone Technology</h3>
                            <p className="cert-issuer">Workshop Certification</p>
                            <p className="cert-desc">Hands-on experience with UAV dynamics, flight controllers, aerial sensor
                                integration, and calibration.</p>
                        </div>
                    </motion.div>

                    {/* Cert 5 */}
                    <motion.div className="cert-card" variants={fadeInUp(isMobile)}>
                        <div className="cert-icon">
                            <i className="fas fa-cube"></i>
                        </div>
                        <div className="cert-content">
                            <h3>3D Printing</h3>
                            <p className="cert-issuer">Additive Manufacturing</p>
                            <p className="cert-desc">Expertise in layered manufacturing, CAD-to-print workflows, and rapid
                                prototyping materials.</p>
                        </div>
                    </motion.div>

                    {/* Cert 6 */}
                    <motion.div className="cert-card" variants={fadeInUp(isMobile)}>
                        <div className="cert-icon">
                            <i className="fas fa-magic"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Prompt to Prototype</h3>
                            <p className="cert-issuer">AI-Assisted Engineering</p>
                            <p className="cert-desc">Leveraging Generative AI and LLMs to accelerate the engineering design
                                lifecycle from concept to code.</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Certifications;
