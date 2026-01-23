import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, textContainer, textVariant } from '../utils/animations';
import { generateImageJsonLd } from '../data/imageSchema';
import useMobileDetect from '../utils/useMobileDetect';

const Hero = () => {
    const isMobile = useMobileDetect();
    const [powerState, setPowerState] = useState('initializing');
    const [systemStatus, setSystemStatus] = useState('OFFLINE');
    
    useEffect(() => {
        // Power-on sequence
        const sequence = [
            { delay: 500, state: 'voltage-check', status: 'CHECKING VOLTAGE...' },
            { delay: 1200, state: 'power-stabilizing', status: 'STABILIZING POWER...' },
            { delay: 2000, state: 'system-boot', status: 'BOOTING SYSTEM...' },
            { delay: 2800, state: 'online', status: 'ONLINE' }
        ];

        sequence.forEach(({ delay, state, status }) => {
            setTimeout(() => {
                setPowerState(state);
                setSystemStatus(status);
            }, delay);
        });
    }, []);
    
    return (
        <section className="hero system-power-section" id="hero" data-power-state={powerState}>
            <script type="application/ld+json" dangerouslySetInnerHTML={generateImageJsonLd('profileImage')} />
            
            {/* Power Supply Indicator */}
            <div className="power-supply-indicator">
                <div className="voltage-lines">
                    <span className="voltage-line" data-phase="L1"></span>
                    <span className="voltage-line" data-phase="L2"></span>
                    <span className="voltage-line" data-phase="L3"></span>
                </div>
                <div className="system-status-display">
                    <span className="status-label">SYSTEM STATUS:</span>
                    <span className={`status-value ${systemStatus === 'ONLINE' ? 'online' : ''}`}>{systemStatus}</span>
                </div>
            </div>

            <div className="tech-grid-bg"></div>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer(isMobile)}
            >
                <div className="hero-grid">
                    <div className="hero-text">
                        <motion.div className="hero-headline" variants={staggerContainer(isMobile)}>
                            {/* System Identifier Badge */}
                            <div className="system-identifier">
                                <span className="identifier-label">SYSTEM ID:</span>
                                <span className="identifier-value">EE-SYS-2026</span>
                            </div>
                            
                            <motion.h1
                                variants={textContainer(isMobile)}
                                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
                            >
                                {["Srinivasa", "Manikanta"].map((word, i) => (
                                    <span key={i} style={{ display: 'flex' }}>
                                        {Array.from(word).map((letter, index) => (
                                            <motion.span variants={textVariant(isMobile)} key={index}>
                                                {letter}
                                            </motion.span>
                                        ))}
                                    </span>
                                ))}
                            </motion.h1>
                            <motion.h2
                                variants={fadeInUp(isMobile)}
                                style={{ 
                                    fontSize: '1.5rem', 
                                    color: 'var(--electric-blue)', 
                                    marginBottom: 0,
                                    textShadow: '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
                                    fontWeight: 700,
                                    letterSpacing: '0.02em'
                                }}
                                className="system-designation"
                            >
                                Electrical & Electronics Engineer
                            </motion.h2>
                            <motion.span
                                className="mono"
                                variants={fadeInUp(isMobile)}
                                style={{ color: 'var(--text-secondary)', display: 'inline-block' }}
                            >
                                Embedded & Smart Energy Developer
                            </motion.span>
                        </motion.div>

                        <motion.p
                            className="hero-sub system-mission"
                            style={{ fontSize: '1.5rem', maxWidth: '600px', color: 'var(--text-primary)' }}
                            variants={fadeInUp(isMobile)}
                        >
                            Engineering intelligent systems for a sustainable, automated future.
                        </motion.p>

                        <motion.div className="hero-cta system-controls" variants={fadeInUp(isMobile)}>
                            <a href="#projects" className="btn btn-primary system-btn">
                                <i className="fas fa-cube"></i> View Modules
                            </a>
                            <a href="#contact" className="btn btn-outline system-btn">
                                <i className="fas fa-broadcast-tower"></i> Send Signal
                            </a>
                        </motion.div>
                    </div>
                    <motion.div className="hero-visual" variants={fadeInUp(isMobile)}>
                        <div className="profile-placeholder system-core">
                            <img src="/assets/srinivasa-manikanta-profile.webp" 
                                 alt="Srinivasa Manikanta - Electrical and Electronics Engineer specializing in embedded systems and smart energy solutions" 
                                 width="400" 
                                 height="400" />
                            {/* Circuit nodes around profile */}
                            <div className="circuit-nodes">
                                <span className="circuit-node" data-position="top"></span>
                                <span className="circuit-node" data-position="right"></span>
                                <span className="circuit-node" data-position="bottom"></span>
                                <span className="circuit-node" data-position="left"></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
