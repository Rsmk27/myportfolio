import React from 'react';
import { motion } from 'framer-motion';
import { blurIn, staggerContainer } from '../utils/animations';

const Contact = () => {
    return (
        <section id="contact" className="section" style={{ background: 'rgba(47, 129, 247, 0.03)' }}>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <motion.div variants={blurIn}>
                    <span className="mono text-accent">07. COLLABORATION</span>
                    <h2>Let's Build the Future</h2>
                </motion.div>

                <div className="contact-grid">
                    <motion.div variants={blurIn}>
                        <h3>Contact</h3>
                        <p>I am always open to discussing sustainable tech, embedded projects, or full-time engineering
                            roles.</p>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href="mailto:srinivasmanikantarajapantula@gmail.com"
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                <i className="fas fa-envelope text-accent"></i> srinivasmanikantarajapantula@gmail.com
                            </a>
                            <a href="tel:+916301165183"
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                <i className="fas fa-phone text-accent"></i> +91 63011 65183
                            </a>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <i className="fas fa-map-marker-alt text-accent"></i> Srikakulam, Andhra Pradesh, India
                            </div>
                        </div>

                        <a href="/Srinivasa_Manikanta_Resume.pdf" className="btn btn-primary" style={{ marginTop: '2rem' }}
                            target="_blank" download>
                            <i className="fas fa-download"></i> Download Resume
                        </a>
                    </motion.div>

                    <motion.div variants={blurIn}>
                        <h3>Connect</h3>
                        <div className="social-links" style={{ flexWrap: 'wrap' }}>
                            <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="social-icon"><i
                                className="fab fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/rsmk27" target="_blank" rel="noreferrer" className="social-icon"><i
                                className="fab fa-linkedin"></i></a>
                            <a href="https://twitter.com/SrinivasManik20" target="_blank" rel="noreferrer" className="social-icon"><i
                                className="fab fa-twitter"></i></a>
                            <a href="https://t.me/Rsmk_27" target="_blank" rel="noreferrer" className="social-icon"><i
                                className="fab fa-telegram"></i></a>
                            <a href="https://api.whatsapp.com/send?phone=916301165183&text=%F0%9F%98%8A%20Hey%2C%20I%20have%20recently%20saw%20your%20portfolio%2C%20lets%20get%20in%20touch%20%F0%9F%A4%9D"
                                target="_blank" rel="noreferrer" className="social-icon"><i className="fab fa-whatsapp"></i></a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
