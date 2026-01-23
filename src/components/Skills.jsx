import React from 'react';
import { motion } from 'framer-motion';
import { zoomIn, staggerContainer } from '../utils/animations';
import useMobileDetect from '../utils/useMobileDetect';

const Skills = () => {
    const isMobile = useMobileDetect();
    
    const signalPaths = [
        {
            category: 'ANALOG',
            icon: 'fa-wave-square',
            strength: 'strong',
            skills: ['Electrical & Electronics Engineering', 'Power & Energy Systems', 'Control Systems & Automation']
        },
        {
            category: 'DIGITAL',
            icon: 'fa-microchip',
            strength: 'strong',
            skills: ['Embedded Systems Design', 'Internet of Things (IoT)', 'Arduino / ESP8266']
        },
        {
            category: 'EMBEDDED',
            icon: 'fa-memory',
            strength: 'strong',
            skills: ['C / C++ / Python', 'Firmware Development', 'Real-time Systems']
        },
        {
            category: 'SOFTWARE',
            icon: 'fa-code',
            strength: 'developing',
            skills: ['Web (HTML/CSS/React)', 'Firebase / APIs', 'Git / Linux']
        },
        {
            category: 'APPLIED DOMAINS',
            icon: 'fa-project-diagram',
            strength: 'strong',
            skills: ['Smart Energy Systems', 'Green Technology', 'Autonomous Grids', 'AI-Driven Engineering']
        }
    ];
    
    return (
        <section id="skills" className="section signal-processing-section" style={{ background: 'rgba(22, 27, 34, 0.5)' }}>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer(isMobile)}
            >
                <motion.div variants={zoomIn(isMobile)}>
                    <span className="mono text-accent system-label">SIGNAL PROCESSING // CAPABILITY MATRIX</span>
                    <h2>Technical Signal Paths</h2>
                </motion.div>

                <motion.div className="signal-paths-container" variants={staggerContainer(isMobile)}>
                    {signalPaths.map((path, index) => (
                        <motion.div 
                            key={index}
                            className={`signal-path-block signal-${path.strength}`} 
                            variants={zoomIn(isMobile)}
                        >
                            <div className="signal-path-header">
                                <div className="signal-indicator">
                                    <i className={`fas ${path.icon}`}></i>
                                    <span className="path-category">{path.category}</span>
                                </div>
                                <div className={`signal-strength signal-${path.strength}`}>
                                    <div className="strength-bars">
                                        <span className="bar"></span>
                                        <span className="bar"></span>
                                        <span className="bar"></span>
                                        <span className="bar"></span>
                                        <span className="bar"></span>
                                    </div>
                                    <span className="strength-label">
                                        {path.strength === 'strong' ? 'CLEAN SIGNAL' : 'DEVELOPING'}
                                    </span>
                                </div>
                            </div>
                            <div className="signal-path-waveform">
                                <svg viewBox="0 0 200 40" className="waveform-svg">
                                    {path.strength === 'strong' ? (
                                        <path d="M 0 20 L 20 20 L 25 5 L 30 35 L 35 5 L 40 35 L 45 5 L 50 35 L 55 20 L 200 20" 
                                              stroke="var(--electric-blue)" 
                                              strokeWidth="2" 
                                              fill="none" />
                                    ) : (
                                        <path d="M 0 20 Q 25 15, 50 20 T 100 20 T 150 20 L 200 20" 
                                              stroke="var(--electric-blue)" 
                                              strokeWidth="2" 
                                              fill="none" 
                                              opacity="0.6" />
                                    )}
                                </svg>
                            </div>
                            <div className="signal-components">
                                {path.skills.map((skill, idx) => (
                                    <span key={idx} className="component-tag">
                                        <span className="component-pin"></span>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* System Reliability Indicators */}
                <motion.div className="system-reliability" variants={zoomIn(isMobile)}>
                    <h3 className="reliability-title">
                        <i className="fas fa-shield-alt"></i>
                        SYSTEM RELIABILITY METRICS
                    </h3>
                    <div className="reliability-grid">
                        <div className="reliability-item">
                            <i className="fas fa-check-double"></i>
                            <span>Systems Thinking</span>
                        </div>
                        <div className="reliability-item">
                            <i className="fas fa-check-double"></i>
                            <span>Full-Stack Engineering</span>
                        </div>
                        <div className="reliability-item">
                            <i className="fas fa-check-double"></i>
                            <span>Problem Decomposition</span>
                        </div>
                        <div className="reliability-item">
                            <i className="fas fa-check-double"></i>
                            <span>Scalable Architecture</span>
                        </div>
                        <div className="reliability-item">
                            <i className="fas fa-check-double"></i>
                            <span>Rapid Prototyping</span>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default Skills;
