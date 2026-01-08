import React from 'react';

const Vision = () => {
    return (
        <section id="vision" className="section">
            <div className="container">
                <span className="mono text-accent">06. VISION & FUTURE DIRECTION</span>
                <h2>The Roadmap</h2>

                <div className="vision-content">
                    {/* Main Vision Statement */}
                    <div className="vision-statement">
                        <p>
                            I am working toward building <strong>intelligent engineering systems</strong> that make energy
                            infrastructure more efficient, autonomous, and sustainable.
                        </p>
                        <p style={{ marginTop: '1.5rem' }}>
                            My long-term goal is to design and deploy technologies that combine electrical foundations,
                            embedded intelligence, and AI-driven software into scalable real-world systems.
                        </p>
                        <p style={{ marginTop: '1.5rem' }}>
                            I believe the next era of engineering will be defined by <strong>smart energy networks,
                                autonomous control systems, and software-defined infrastructure</strong> — and I am
                            preparing myself to contribute meaningfully to that future.
                        </p>
                    </div>

                    {/* Focus Areas */}
                    <div className="focus-grid">
                        <div className="focus-card">
                            <span className="focus-icon">🌱</span>
                            <h4>Sustainable & Smart Energy</h4>
                            <p>Designing cleaner, more adaptive power systems and energy management platforms.</p>
                        </div>
                        <div className="focus-card">
                            <span className="focus-icon">🧠</span>
                            <h4>Intelligent & Autonomous Infrastructure</h4>
                            <p>Developing self-regulating systems using embedded control, IoT, and AI.</p>
                        </div>
                        <div className="focus-card">
                            <span className="focus-icon">⚙️</span>
                            <h4>Full-Stack Physical Systems</h4>
                            <p>Building platforms where hardware, data, and software operate as one.</p>
                        </div>
                        <div className="focus-card">
                            <span className="focus-icon">🔬</span>
                            <h4>Continuous Learning & Innovation</h4>
                            <p>Pursuing advanced knowledge in emerging engineering technologies.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Vision;
