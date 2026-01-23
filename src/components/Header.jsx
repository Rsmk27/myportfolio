import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const location = useLocation();

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

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else if (location.pathname === '/') {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <header>
            <div className="container">
                <Link to="/" className="logo-container">
                    <span className="logo-name">RSMK</span>
                </Link>
                <nav className={`nav-links ${isNavOpen ? 'active' : ''}`}>
                    <Link to="/#about" onClick={closeNav} className="system-nav-link" data-system="CONTROL">
                        <span className="nav-label-main">Control Unit</span>
                        <span className="nav-label-sub">About</span>
                    </Link>
                    <Link to="/#skills" onClick={closeNav} className="system-nav-link" data-system="SIGNAL">
                        <span className="nav-label-main">Signal Processing</span>
                        <span className="nav-label-sub">Skills</span>
                    </Link>
                    <Link to="/#projects" onClick={closeNav} className="system-nav-link" data-system="MODULES">
                        <span className="nav-label-main">Functional Modules</span>
                        <span className="nav-label-sub">Projects</span>
                    </Link>
                    <Link to="/#experience" onClick={closeNav} className="system-nav-link" data-system="TIMELINE">
                        <span className="nav-label-main">System Log</span>
                        <span className="nav-label-sub">Experience</span>
                    </Link>
                    <Link to="/#vision" onClick={closeNav} className="system-nav-link" data-system="GRID">
                        <span className="nav-label-main">Power Grid</span>
                        <span className="nav-label-sub">Vision</span>
                    </Link>
                    <Link to="/#contact" onClick={closeNav} className="system-nav-link" data-system="INTERFACE">
                        <span className="nav-label-main">Output Interface</span>
                        <span className="nav-label-sub">Contact</span>
                    </Link>
                    <a href="/Srinivasa_Manikanta_Resume.pdf" className="btn btn-primary"
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }} target="_blank" download>
                        <i className="fas fa-download"></i> System Spec
                    </a>
                </nav>
                <button className="mobile-nav-toggle" onClick={toggleNav}>
                    <i className={`fas ${isNavOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
