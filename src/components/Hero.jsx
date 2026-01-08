import React from 'react';

const Hero = () => {
    return (
        <section className="hero" id="hero">
            <div className="tech-grid-bg"></div>
            <div className="container">
                <div className="hero-grid">
                    <div className="hero-text">
                        <div className="hero-headline">
                            <h1>Srinivasa Manikanta</h1>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-accent)', marginBottom: 0 }}>
                                Electrical & Electronics Engineer
                            </h2>
                            <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                                Embedded & Smart Energy Developer
                            </span>
                        </div>

                        <p className="hero-sub" style={{ fontSize: '1.5rem', maxWidth: '600px', color: 'var(--text-primary)' }}>
                            Engineering intelligent systems for a sustainable, automated future.
                        </p>

                        <div className="hero-cta">
                            <a href="#projects" className="btn btn-primary">View Projects <i className="fas fa-arrow-right"></i></a>
                            <a href="#contact" className="btn btn-outline">Contact Me</a>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="profile-placeholder">
                            <img src="/assets/profile.jpg" alt="Srinivasa Manikanta" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
