import React from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
    return (
        <section id="projects" className="section">
            <div className="container">
                <span className="mono text-accent">03. PROOF OF WORK</span>
                <h2>Featured Projects</h2>

                <div className="projects-grid">

                    {/* Project 1: BudgetBuddy */}
                    <article className="project-card">
                        <div className="project-image-container">
                            <img src="/assets/budgetbuddy.png" alt="Budget Buddy Interface" />
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
                    </article>

                    {/* Project 2: AI Chatbot */}
                    <article className="project-card">
                        <div className="project-image-container">
                            <img src="/assets/Bgimage.webp" alt="AI Chatbot Concept" />
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
                    </article>

                    {/* Project 3: ColorOhm */}
                    <article className="project-card">
                        <div className="project-image-container">
                            <img src="/assets/colorohm.png" alt="ColorOhm Interface" />
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
                    </article>

                    {/* Project 4: Embedded IoT Monitoring */}
                    <article className="project-card">
                        <div className="project-image-container">
                            <img src="/assets/autoexhaustfan.png" alt="IoT Monitoring System" />
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
                    </article>

                </div>
            </div>
        </section>
    );
};

export default Projects;
