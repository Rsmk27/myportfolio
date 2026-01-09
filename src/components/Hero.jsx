import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Hero = () => {
    return (
        <section className="hero" id="hero">
            <div className="tech-grid-bg"></div>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="hero-grid">
                    <div className="hero-text">
                        <motion.div className="hero-headline" variants={fadeInUp}>
                            <h1>Srinivasa Manikanta</h1>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-accent)', marginBottom: 0 }}>
                                Electrical & Electronics Engineer
                            </h2>
                            <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                                Embedded & Smart Energy Developer
                            </span>
                        </motion.div>

                        <motion.p
                            className="hero-sub"
                            style={{ fontSize: '1.5rem', maxWidth: '600px', color: 'var(--text-primary)' }}
                            variants={fadeInUp}
                        >
                            Engineering intelligent systems for a sustainable, automated future.
                        </motion.p>

                        <motion.div className="hero-cta" variants={fadeInUp}>
                            <a href="#projects" className="btn btn-primary">View Projects <i className="fas fa-arrow-right"></i></a>
                            <a href="#contact" className="btn btn-outline">Contact Me</a>
                        </motion.div>
                    </div>
                    <motion.div className="hero-visual" variants={fadeInUp}>
                        <div className="profile-placeholder">
                            <img src="/assets/profile.jpg" alt="Srinivasa Manikanta" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
