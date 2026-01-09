import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const About = () => {
    return (
        <section id="about" className="section">
            <motion.div
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="about-grid">
                    <motion.div className="about-text" variants={fadeInUp}>
                        <span className="mono text-accent">01. IDENTITY</span>
                        <h2>About Me</h2>
                        <p>I am an Electrical & Electronics Engineering student with a deep interest in designing
                            intelligent, real-world systems that integrate hardware, software, and energy infrastructure. My
                            work focuses on building practical solutions across Embedded Systems, IoT, Smart Energy, and
                            Green Technology, where efficiency, reliability, and scalability are non-negotiable.</p>
                        <p>From developing embedded controllers and IoT platforms to building full-stack software systems
                            and engineering analytics tools, I approach every project with a systems mindset — understanding
                            not just how components function, but how entire systems behave, evolve, and improve over time.
                        </p>
                        <p>What drives me is the challenge of solving problems that matter: making energy systems smarter,
                            automation more adaptive, and digital platforms more intelligent. I am particularly passionate
                            about sustainable engineering, autonomous energy networks, and applying AI-driven intelligence
                            to physical infrastructure.</p>
                        <p>I believe the future of engineering lies in engineers who can bridge classical electrical
                            foundations with modern computational intelligence. That is the engineer I am actively becoming.
                        </p>

                        <blockquote
                            style={{ borderLeft: '3px solid var(--text-accent)', paddingLeft: '1rem', marginTop: '2rem', fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                            “Build systems that are not only functional — but meaningful, efficient, and future-ready.”
                        </blockquote>
                    </motion.div>
                    {/* Core Focus Card Remains */}
                    <motion.div className="about-card" variants={fadeInUp}>
                        <h3 className="mono">Core Focus</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-microchip text-accent"></i> Embedded Systems & IoT
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-solar-panel text-accent"></i> Smart Energy & Green Tech
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-code text-accent"></i> Intelligent Software Platforms
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <i className="fas fa-robot text-accent"></i> Automation & AI Integration
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default About;
