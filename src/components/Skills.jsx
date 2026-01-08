import React from 'react';

const Skills = () => {
    return (
        <section id="skills" className="section" style={{ background: 'rgba(22, 27, 34, 0.5)' }}>
            <div className="container">
                <span className="mono text-accent">02. CAPABILITY</span>
                <h2>Technical Arsenal</h2>

                <div className="skills-container">
                    {/* Pillar 1 */}
                    <article className="skill-pillar pillar-core">
                        <h3><i className="fas fa-microchip"></i> Core Engineering</h3>
                        <div className="skill-list">
                            <span className="skill-tag">Electrical & Electronics Engineering</span>
                            <span className="skill-tag">Embedded Systems Design</span>
                            <span className="skill-tag">Power & Energy Systems</span>
                            <span className="skill-tag">Control Systems & Automation</span>
                            <span className="skill-tag">Internet of Things (IoT)</span>
                        </div>
                    </article>

                    {/* Pillar 2 */}
                    <article className="skill-pillar pillar-software">
                        <h3><i className="fas fa-terminal"></i> Software & Tools</h3>
                        <div className="skill-list">
                            <span className="skill-tag">C / C++ / Python</span>
                            <span className="skill-tag">Arduino / ESP8266</span>
                            <span className="skill-tag">Web (HTML/CSS/React)</span>
                            <span className="skill-tag">Firebase / APIs</span>
                            <span className="skill-tag">Git / Linux</span>
                        </div>
                    </article>

                    {/* Pillar 3 */}
                    <article className="skill-pillar pillar-domains">
                        <h3><i className="fas fa-globe-americas"></i> Applied Domains</h3>
                        <div className="skill-list">
                            <span className="skill-tag">Smart Energy Systems</span>
                            <span className="skill-tag">Green Technology</span>
                            <span className="skill-tag">Autonomous Grids</span>
                            <span className="skill-tag">FinTech Platforms</span>
                            <span className="skill-tag">AI-Driven Engineering</span>
                        </div>
                    </article>
                </div>

                {/* Engineering Strengths */}
                <div className="engineering-strengths">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                        Engineering Confidence
                    </h3>
                    <div className="strengths-grid">
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Systems Thinking</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Full-Stack Engineering</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Problem Decomposition</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Scalable Architecture</div>
                        <div className="strength-item"><i className="fas fa-check-circle"></i> Rapid Prototyping</div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Skills;
