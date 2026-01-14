import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { popIn, staggerContainer } from '../utils/animations';
import { generateAllImagesJsonLd } from '../data/imageSchema';
import useMobileDetect from '../utils/useMobileDetect';

const Projects = () => {
    const isMobile = useMobileDetect();
    
    return (
        <section id="projects" className="section">
            <script type="application/ld+json" dangerouslySetInnerHTML={generateAllImagesJsonLd()} />
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={staggerContainer(isMobile)}
            >
                <motion.div variants={popIn(isMobile)}>
                    <span className="mono text-accent">03. PROOF OF WORK</span>
                    <h2>Featured Projects</h2>
                </motion.div>

                <div className="projects-grid">

                    {/* Project 1: BudgetBuddy */}
                    <motion.article className="project-card" variants={popIn(isMobile)}>
                        <div className="project-image-container">
                            <img src="/assets/budget-buddy-expense-tracker-app.webp" 
                                 alt="Budget Buddy expense tracking application interface showing real-time financial analytics and budget management dashboard" 
                                 width="2560" 
                                 height="1792" 
                                 loading="lazy" />
                        </div>
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">BudgetBuddy</h3>
                            </div>

                            <div className="project-case-block">
                                <span className="case-label">Problem</span>
                                <p className="case-text">Personal finance tracking is fragmented and intuitive.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Solution</span>
                                <p className="case-text">Designed a full-stack budgeting platform with real-time analytics.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Impact</span>
                                <p className="case-text">Helps users understand spending and improve financial discipline.</p>
                            </div>

                            <div className="project-tech-stack">
                                <span className="tech-pill">React</span>
                                <span className="tech-pill">Firebase</span>
                                <span className="tech-pill">APIs</span>
                            </div>

                            <div className="project-actions">
                                <Link to="/projects/budget-buddy" className="action-btn"><i
                                    className="fas fa-external-link-alt"></i> Details</Link>
                                <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="action-btn"><i
                                    className="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    </motion.article>

                    {/* Project 2: AI Chatbot */}
                    <motion.article className="project-card" variants={popIn(isMobile)}>
                        <div className="project-image-container">
                            <img src="/assets/ai-chatbot-interface-background.webp" 
                                 alt="AI-powered chatbot interface with GPT integration showing conversational AI capabilities and real-time response system" 
                                 width="1600" 
                                 height="896" 
                                 loading="lazy" />
                        </div>
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">AI Chatbot with GPT</h3>
                            </div>

                            <div className="project-case-block">
                                <span className="case-label">Problem</span>
                                <p className="case-text">Need for intelligent conversational systems.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Solution</span>
                                <p className="case-text">Built an AI-powered web chatbot with real-time responses.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Impact</span>
                                <p className="case-text">Demonstrates applied AI & full-stack system design.</p>
                            </div>

                            <div className="project-tech-stack">
                                <span className="tech-pill">Next.js</span>
                                <span className="tech-pill">GPT APIs</span>
                                <span className="tech-pill">Vercel</span>
                            </div>

                            <div className="project-actions">
                                <a href="#" className="action-btn"><i className="fas fa-external-link-alt"></i> Live Demo</a>
                                <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="action-btn"><i
                                    className="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    </motion.article>

                    {/* Project 3: ColorOhm */}
                    <motion.article className="project-card" variants={popIn(isMobile)}>
                        <div className="project-image-container">
                            <img src="/assets/color-ohm-resistor-calculator-tool.webp" 
                                 alt="ColorOhm resistor color code calculator tool interface for electrical engineers showing 4-band and 5-band resistance calculation" 
                                 width="2560" 
                                 height="1792" 
                                 loading="lazy" />
                        </div>
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">ColorOhm</h3>
                            </div>

                            <div className="project-case-block">
                                <span className="case-label">Problem</span>
                                <p className="case-text">Manual resistor decoding is inefficient.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Solution</span>
                                <p className="case-text">Created an interactive engineering calculator tool.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Impact</span>
                                <p className="case-text">Simplifies electronics workflow for engineers.</p>
                            </div>

                            <div className="project-tech-stack">
                                <span className="tech-pill">JavaScript</span>
                                <span className="tech-pill">UI Design</span>
                            </div>

                            <div className="project-actions">
                                <Link to="/projects/color-ohm" className="action-btn"><i
                                    className="fas fa-external-link-alt"></i> Details</Link>
                                <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="action-btn"><i
                                    className="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    </motion.article>

                    {/* Project 4: Embedded IoT Monitoring */}
                    <motion.article className="project-card" variants={popIn(isMobile)}>
                        <div className="project-image-container">
                            <img src="/assets/smart-exhaust-gas-detection-system.webp" 
                                 alt="Smart exhaust fan system with MQ-2 gas sensor for automatic hazardous gas detection and ventilation control using Arduino" 
                                 width="2560" 
                                 height="1792" 
                                 loading="lazy" />
                        </div>
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">Embedded IoT Monitor</h3>
                            </div>

                            <div className="project-case-block">
                                <span className="case-label">Problem</span>
                                <p className="case-text">Real-time environmental monitoring is complex.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Solution</span>
                                <p className="case-text">Built sensor-based IoT system with live dashboard.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Impact</span>
                                <p className="case-text">Demonstrates hardware–software integration.</p>
                            </div>

                            <div className="project-tech-stack">
                                <span className="tech-pill">ESP8266</span>
                                <span className="tech-pill">Sensors</span>
                                <span className="tech-pill">Web Interface</span>
                            </div>

                            <div className="project-actions">
                                <Link to="/projects/smart-exhaust" className="action-btn"><i
                                    className="fas fa-external-link-alt"></i> Details</Link>
                                <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="action-btn"><i
                                    className="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    </motion.article>

                    {/* Project 5: GridForge */}
                    <motion.article className="project-card" variants={popIn(isMobile)}>
                        <div className="project-image-container">
                            <img src="/assets/gridforge-power-system-simulation.webp" 
                                 alt="GridForge web-based power system simulation platform showing MATLAB-Python-React integration for real-time electrical grid analysis" 
                                 width="2560" 
                                 height="1792" 
                                 loading="lazy" />
                        </div>
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">GridForge</h3>
                            </div>

                            <div className="project-case-block">
                                <span className="case-label">Problem</span>
                                <p className="case-text">MATLAB power simulations lack web accessibility.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Solution</span>
                                <p className="case-text">Built full-stack platform with MATLAB, Python, and React.</p>
                            </div>
                            <div className="project-case-block">
                                <span className="case-label">Impact</span>
                                <p className="case-text">Creates interactive digital laboratory for power systems.</p>
                            </div>

                            <div className="project-tech-stack">
                                <span className="tech-pill">MATLAB</span>
                                <span className="tech-pill">Python (Flask)</span>
                                <span className="tech-pill">React (Vite)</span>
                                <span className="tech-pill">Full-Stack</span>
                            </div>

                            <div className="project-actions">
                                <Link to="/projects/gridforge" className="action-btn"><i
                                    className="fas fa-external-link-alt"></i> Details</Link>
                                <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer" className="action-btn"><i
                                    className="fab fa-github"></i> GitHub</a>
                            </div>
                        </div>
                    </motion.article>

                </div>
            </motion.div>
        </section>
    );
};

export default Projects;
