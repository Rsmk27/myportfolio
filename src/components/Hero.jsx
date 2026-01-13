import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, textContainer, textVariant } from '../utils/animations';
import { generateImageJsonLd } from '../data/imageSchema';

const Hero = () => {
    return (
        <section className="hero" id="hero">
            <script type="application/ld+json" dangerouslySetInnerHTML={generateImageJsonLd('profileImage')} />
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
                        <motion.div className="hero-headline" variants={staggerContainer}>
                            <motion.h1
                                variants={textContainer}
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
                            >
                                {["Srinivasa", "Manikanta"].map((word, i) => (
                                    <span key={i} style={{ display: 'flex' }}>
                                        {Array.from(word).map((letter, index) => (
                                            <motion.span variants={textVariant} key={index}>
                                                {letter}
                                            </motion.span>
                                        ))}
                                    </span>
                                ))}
                            </motion.h1>
                            <motion.h2
                                variants={fadeInUp}
                                style={{ fontSize: '1.5rem', color: 'var(--text-accent)', marginBottom: 0 }}
                            >
                                Electrical & Electronics Engineer
                            </motion.h2>
                            <motion.span
                                className="mono"
                                variants={fadeInUp}
                                style={{ color: 'var(--text-secondary)', display: 'inline-block' }}
                            >
                                Embedded & Smart Energy Developer
                            </motion.span>
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
                            <img src="/assets/srinivasa-manikanta-profile.jpg" 
                                 alt="Srinivasa Manikanta - Electrical and Electronics Engineer specializing in embedded systems and smart energy solutions" 
                                 width="400" 
                                 height="400" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
