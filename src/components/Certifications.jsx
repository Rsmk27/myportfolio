import React from 'react';

const Certifications = () => {
    return (
        <section id="certifications" className="section">
            <div className="container">
                <span className="mono text-accent">05. CREDENTIALS</span>
                <h2>Certifications</h2>

                <div className="cert-grid">
                    {/* Cert 1 */}
                    <div className="cert-card">
                        <div className="cert-icon">
                            <i className="fas fa-microchip"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Embedded Systems Design</h3>
                            <p className="cert-issuer">Specialized Training</p>
                            <p className="cert-desc">Comprehensive expertise in microcontroller architecture, interfacing
                                periperhals, and real-time systems programming.</p>
                        </div>
                    </div>

                    {/* Cert 2 */}
                    <div className="cert-card">
                        <div className="cert-icon">
                            <i className="fas fa-charging-station"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Electric Vehicle Technology</h3>
                            <p className="cert-issuer">Technical Certification</p>
                            <p className="cert-desc">Advanced training in EV powertrains, battery management systems (BMS), and
                                charging infrastructure architectures.</p>
                        </div>
                    </div>

                    {/* Cert 3 */}
                    <div className="cert-card">
                        <div className="cert-icon">
                            <i className="fas fa-helicopter"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Drone Technology</h3>
                            <p className="cert-issuer">Workshop Certification</p>
                            <p className="cert-desc">Hands-on experience with UAV dynamics, flight controllers, aerial sensor
                                integration, and calibration.</p>
                        </div>
                    </div>

                    {/* Cert 5 */}
                    <div className="cert-card">
                        <div className="cert-icon">
                            <i className="fas fa-cube"></i>
                        </div>
                        <div className="cert-content">
                            <h3>3D Printing</h3>
                            <p className="cert-issuer">Additive Manufacturing</p>
                            <p className="cert-desc">Expertise in layered manufacturing, CAD-to-print workflows, and rapid
                                prototyping materials.</p>
                        </div>
                    </div>

                    {/* Cert 6 */}
                    <div className="cert-card">
                        <div className="cert-icon">
                            <i className="fas fa-magic"></i>
                        </div>
                        <div className="cert-content">
                            <h3>Prompt to Prototype</h3>
                            <p className="cert-issuer">AI-Assisted Engineering</p>
                            <p className="cert-desc">Leveraging Generative AI and LLMs to accelerate the engineering design
                                lifecycle from concept to code.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certifications;
