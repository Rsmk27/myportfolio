import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: Identity */}
                    <div className="footer-col footer-identity">
                        <h3>Srinivasa Manikanta</h3>
                        <p>Electrical & Electronics Engineer</p>
                        <p className="footer-tagline">Building intelligent, sustainable engineering systems for a smarter
                            tomorrow.</p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-col">
                        <h4>Navigation</h4>
                        <nav className="footer-nav">
                            <a href="#about">About</a>
                            <a href="#skills">Skills</a>
                            <a href="#projects">Projects</a>
                            <a href="#experience">Experience</a>
                            <a href="#vision">Vision</a>
                            <a href="#contact">Contact</a>
                        </nav>
                    </div>

                    {/* Column 3: Connect */}
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <nav className="footer-nav">
                            <a href="mailto:srinivasmanikantarajapantula@gmail.com">Email</a>
                            <a href="https://www.linkedin.com/in/rsmk27" target="_blank" rel="noreferrer">LinkedIn</a>
                            <a href="https://github.com/Rsmk27" target="_blank" rel="noreferrer">GitHub</a>
                            <a href="/Srinivasa_Manikanta_Resume.pdf" target="_blank" download>Resume</a>
                        </nav>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>&copy; <span id="year">{new Date().getFullYear()}</span> Srinivasa Manikanta. Engineered with purpose.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
