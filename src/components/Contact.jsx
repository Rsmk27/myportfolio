import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { blurIn, staggerContainer } from '../utils/animations';
import useMobileDetect from '../utils/useMobileDetect';

const Contact = () => {
    const isMobile = useMobileDetect();
    const [transmissionState, setTransmissionState] = useState('ready');
    
    const handleContactClick = (channel) => {
        setTransmissionState('transmitting');
        setTimeout(() => setTransmissionState('ready'), 2000);
    };
    
    return (
        <section id="contact" className="section output-interface-section" style={{ background: 'rgba(0, 217, 255, 0.03)' }}>
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer(isMobile)}
            >
                <motion.div variants={blurIn(isMobile)}>
                    <span className="mono text-accent system-label">OUTPUT INTERFACE // COMMUNICATION CONSOLE</span>
                    <h2>Signal Transmission</h2>
                </motion.div>

                <div className="interface-terminal">
                    {/* Transmission Status */}
                    <motion.div className="transmission-status" variants={blurIn(isMobile)}>
                        <div className="status-indicator">
                            <span className={`status-led ${transmissionState}`}></span>
                            <span className="status-text">
                                {transmissionState === 'ready' ? 'READY TO TRANSMIT' : 'TRANSMITTING...'}
                            </span>
                        </div>
                    </motion.div>

                    <div className="interface-grid">
                        {/* Communication Channels */}
                        <motion.div className="channel-panel" variants={blurIn(isMobile)}>
                            <h3>
                                <i className="fas fa-satellite-dish"></i>
                                Communication Channels
                            </h3>
                            <p className="channel-description">Select a transmission protocol to initiate signal transfer.</p>

                            <div className="channel-list">
                                <a 
                                    href="mailto:srinivasmanikantarajapantula@gmail.com"
                                    className="channel-item"
                                    onClick={() => handleContactClick('email')}
                                >
                                    <div className="channel-icon">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="channel-info">
                                        <span className="channel-name">Email Protocol</span>
                                        <span className="channel-address">srinivasmanikantarajapantula@gmail.com</span>
                                    </div>
                                    <i className="fas fa-arrow-right channel-arrow"></i>
                                </a>

                                <a 
                                    href="tel:+916301165183"
                                    className="channel-item"
                                    onClick={() => handleContactClick('phone')}
                                >
                                    <div className="channel-icon">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <div className="channel-info">
                                        <span className="channel-name">Voice Channel</span>
                                        <span className="channel-address">+91 63011 65183</span>
                                    </div>
                                    <i className="fas fa-arrow-right channel-arrow"></i>
                                </a>

                                <div className="channel-item location-display">
                                    <div className="channel-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="channel-info">
                                        <span className="channel-name">Physical Location</span>
                                        <span className="channel-address">Srikakulam, Andhra Pradesh, India</span>
                                    </div>
                                </div>
                            </div>

                            <a 
                                href="/Srinivasa_Manikanta_Resume.pdf" 
                                className="btn btn-primary system-spec-download" 
                                target="_blank" 
                                download
                            >
                                <i className="fas fa-file-download"></i> Download System Specification
                            </a>
                        </motion.div>

                        {/* Network Connections */}
                        <motion.div className="network-panel" variants={blurIn(isMobile)}>
                            <h3>
                                <i className="fas fa-network-wired"></i>
                                Network Endpoints
                            </h3>
                            <p className="channel-description">Connect through distributed network protocols.</p>

                            <div className="network-grid">
                                <a 
                                    href="https://github.com/Rsmk27" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="network-node"
                                    onClick={() => handleContactClick('github')}
                                >
                                    <i className="fab fa-github"></i>
                                    <span>GitHub</span>
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/rsmk27" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="network-node"
                                    onClick={() => handleContactClick('linkedin')}
                                >
                                    <i className="fab fa-linkedin"></i>
                                    <span>LinkedIn</span>
                                </a>
                                <a 
                                    href="https://twitter.com/SrinivasManik20" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="network-node"
                                    onClick={() => handleContactClick('twitter')}
                                >
                                    <i className="fab fa-twitter"></i>
                                    <span>Twitter</span>
                                </a>
                                <a 
                                    href="https://t.me/Rsmk_27" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="network-node"
                                    onClick={() => handleContactClick('telegram')}
                                >
                                    <i className="fab fa-telegram"></i>
                                    <span>Telegram</span>
                                </a>
                                <a 
                                    href="https://api.whatsapp.com/send?phone=916301165183&text=%F0%9F%98%8A%20Hey%2C%20I%20have%20recently%20saw%20your%20portfolio%2C%20lets%20get%20in%20touch%20%F0%9F%A4%9D"
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="network-node"
                                    onClick={() => handleContactClick('whatsapp')}
                                >
                                    <i className="fab fa-whatsapp"></i>
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Signal Quality Indicator */}
                    <motion.div className="signal-quality" variants={blurIn(isMobile)}>
                        <div className="quality-bars">
                            <span className="quality-bar active"></span>
                            <span className="quality-bar active"></span>
                            <span className="quality-bar active"></span>
                            <span className="quality-bar active"></span>
                            <span className="quality-bar active"></span>
                        </div>
                        <span className="quality-label">SIGNAL QUALITY: OPTIMAL</span>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
