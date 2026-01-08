import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isNavOpen && !e.target.closest('.nav-links') && !e.target.closest('.mobile-nav-toggle')) {
                closeNav();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isNavOpen]);

    return (
        <header>
            <div className="container">
                <a href="#" className="logo-container">
                    <span className="logo-name">RSMK</span>
                </a>
                <nav className={`nav-links ${isNavOpen ? 'active' : ''}`}>
                    <a href="#about" onClick={closeNav}>About</a>
                    <a href="#skills" onClick={closeNav}>Skills</a>
                    <a href="#projects" onClick={closeNav}>Projects</a>
                    <a href="#experience" onClick={closeNav}>Experience</a>
                    <a href="#vision" onClick={closeNav}>Vision</a>
                    <a href="#contact" onClick={closeNav}>Contact</a>
                    <a href="/Srinivasa_Manikanta_Resume.pdf" className="btn btn-primary"
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }} target="_blank" download>Resume</a>
                </nav>
                <button className="mobile-nav-toggle" onClick={toggleNav}>
                    <i className={`fas ${isNavOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
