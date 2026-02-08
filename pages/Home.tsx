import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PCBBackground } from '../components/PCBBackground';
import { ProjectChip } from '../components/ProjectChip';
import { SkillBreadboard } from '../components/SkillBreadboard';
import { CertificationsBlock } from '../components/CertificationsBlock';
import { TimelineSystem } from '../components/TimelineSystem'; // New Component
import { ContactInterface } from '../components/ContactInterface';
import { LoadingScreen } from '../components/LoadingScreen';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '../constants';
import { Zap, Hexagon, Code, Database, Cpu, Globe, Terminal, Mail, Github, Linkedin, Twitter, ExternalLink, Menu, X, ChevronRight, Activity, Info, Server, Layers, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';



const Home: React.FC = () => {
    const [isPowered, setIsPowered] = useState(() => {
        // Initialize from session storage
        const saved = sessionStorage.getItem('isPowered');
        return saved === 'true';
    });

    const [showLoading, setShowLoading] = useState(() => {
        const saved = sessionStorage.getItem('isPowered');
        return saved !== 'true';
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isFirstMount = React.useRef(true);

    // Typing animation state for Hero
    const [statusText, setStatusText] = useState("");
    const fullText = "INITIALIZING SYSTEM PROFILER...";

    useEffect(() => {
        sessionStorage.setItem('isPowered', isPowered.toString());
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
    }, [isPowered]);



    // Typing effect logic
    useEffect(() => {
        if (isPowered) {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i <= fullText.length) {
                    setStatusText(fullText.slice(0, i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
            return () => clearInterval(typingInterval);
        }
    }, [isPowered]);

    const navItems = ['About', 'Projects', 'Skills', 'Gallery', 'Experience', 'Contact'];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
        if (item === 'Gallery') return;
        e.preventDefault();
        const id = item.toLowerCase();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `#${id}`);
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30">
            <Helmet>
                <title>{PROFILE.name} | System Architect</title>
                <meta name="description" content={PROFILE.tagline} />
            </Helmet>

            {showLoading && (
                <LoadingScreen onComplete={() => {
                    setIsPowered(true);
                    setShowLoading(false);
                }} />
            )}

            <div id="main-content" className={`main-content ${!showLoading ? 'visible' : ''}`}>

                <PCBBackground isPowered={isPowered} />

                {/* Header / Nav */}
                <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none mix-blend-difference text-white">
                    <div className="flex flex-col">
                        <h1 className={`text-2xl font-black tracking-tighter transition-all duration-500 ${isPowered ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'text-gray-500'}`}>
                            {PROFILE.name.split(' ')[0]}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-cyan-500 animate-ping' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-mono opacity-80">
                                SYS_STATUS: {isPowered ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 pointer-events-auto">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={item === 'Gallery' ? '/gallery' : `#${item.toLowerCase()}`}
                                onClick={(e) => handleNavClick(e, item)}
                                className={`text-[11px] font-bold uppercase tracking-widest transition-all hover:text-cyan-400 ${isPowered ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="w-px h-8 bg-gray-800 mx-4" />
                        <a href={PROFILE.resume} target="_blank" rel="noreferrer" className="px-4 py-2 border border-cyan-500/50 text-cyan-400 text-xs font-bold rounded hover:bg-cyan-500/10 transition-colors pointer-events-auto">
                            RESUME_V2.0
                        </a>
                    </nav>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden pointer-events-auto p-2 text-white hover:text-cyan-400 transition-all z-50"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="fixed inset-0 z-40 bg-black/90 md:hidden flex items-center justify-center"
                        >
                            <nav className="flex flex-col items-center gap-8 pointer-events-auto">
                                {navItems.map((item, i) => (
                                    <motion.a
                                        key={item}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        href={item === 'Gallery' ? '/gallery' : `#${item.toLowerCase()}`}
                                        onClick={(e) => handleNavClick(e, item)}
                                        className="text-2xl font-black uppercase tracking-tighter text-white hover:text-cyan-500"
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="container mx-auto px-4 md:px-6 pt-0 overflow-x-hidden">

                    {/* 1. HERO SECTION - CONTROL CENTER */}
                    <section className="min-h-[100dvh] flex flex-col items-center justify-center relative pt-20 pb-10 text-center">

                        {/* Background Elements */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-20">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
                            {/* Grid */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto px-4 w-full">

                            {/* Avatar Core */}
                            <div className="relative group z-10 mb-8">
                                {/* Rotating 'Stator' Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-60px] border-[2px] border-cyan-900/40 rounded-full w-[320px] h-[320px] md:w-[380px] md:h-[380px] pointer-events-none opacity-40 border-dashed"
                                />
                                {/* Inner 'Rotor' Field */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-30px] border border-cyan-500/30 rounded-full w-[260px] h-[260px] md:w-[320px] md:h-[320px] pointer-events-none"
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-cyan-500/50" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-cyan-500/50" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-cyan-500/50" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-cyan-500/50" />
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, type: "spring" }}
                                    className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-cyan-500/20 shadow-[0_0_50px_rgba(0,242,255,0.2)] bg-black z-20 group-hover:border-cyan-400/50 transition-colors duration-500"
                                >
                                    <img
                                        src={PROFILE.image}
                                        alt={PROFILE.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
                                </motion.div>

                                {/* Orbiting Icons */}
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-40px] pointer-events-none">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><Zap size={20} className="text-cyan-400 fill-cyan-400/20" /></div>
                                </motion.div>
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 hover:text-cyan-200 transition-colors duration-500">SRINIVASA</span>
                                    <span className="block text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">MANIKANTA</span>
                                </h1>
                                <div className="flex flex-col items-center gap-2">
                                    <h2 className="text-lg md:text-2xl text-gray-300 font-mono tracking-widest uppercase border-b border-cyan-500/30 pb-2">
                                        Electrical & Electronics Engineer
                                    </h2>
                                    <p className="h-6 text-sm font-mono text-cyan-600/80">
                                        {statusText}<span className="animate-pulse">_</span>
                                    </p>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-4 pt-8">
                                <a href="#projects" className="px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-wider rounded-sm hover:bg-white hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all clip-path-polygon">
                                    View Projects
                                </a>
                                <a href="#contact" className="px-8 py-3 border border-gray-700 text-gray-300 font-bold uppercase tracking-wider rounded-sm hover:border-cyan-500 hover:text-cyan-400 transition-all backdrop-blur-sm bg-black/50">
                                    Initialize Comms
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* 2. ABOUT ME - SYSTEM OVERVIEW */}
                    <section id="about" className="py-24 max-w-6xl mx-auto">
                        <SectionHeader title="SYSTEM OVERVIEW" subtitle="IDENTITY & MISSION" isPowered={isPowered} flip />

                        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 ${isPowered ? 'bg-black/40' : ''} rounded-2xl border border-gray-800 backdrop-blur-sm overflow-hidden relative`}>
                            {/* Background Circuits */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415 1.415-.828.828zM0 22.485l.828.83-1.415 1.415-.828-.828-.828.828L.828 22.485l.828-.828 1.415 1.415-.828.828zM0 54.627l.828.83-1.415 1.415-.828-.828-.828.828L.828 54.627l.828-.828 1.415 1.415-.828.828zM57.657 26.485l1.414-1.414 4.243 4.242-1.414 1.414-4.243-4.242zm-26-26l1.414-1.414 4.243 4.242-1.414 1.414-4.243-4.242z' fill='%2306b6d4' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

                            {/* Left Col: Identity Block */}
                            <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xs font-mono text-cyan-500 mb-6">// IDENTITY_MODULE</h3>
                                    <div className="relative aspect-square w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-700 p-2 mb-8">
                                        <img src={PROFILE.image} className="w-full h-full rounded-full object-cover grayscale opacity-80" alt="Profile" />
                                    </div>
                                    <div className="space-y-4 font-mono text-sm">
                                        <div className="flex justify-between border-b border-gray-800 pb-2">
                                            <span className="text-gray-500">NAME</span>
                                            <span className="text-white font-bold">{PROFILE.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-800 pb-2">
                                            <span className="text-gray-500">ROLE</span>
                                            <span className="text-cyan-400">Engineer</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-800 pb-2">
                                            <span className="text-gray-500">LOCATION</span>
                                            <span className="text-gray-300">India</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-xs font-bold text-gray-600 mb-3">SYSTEM STATUS</h4>
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 w-full animate-pulse" />
                                    </div>
                                    <p className="text-[10px] text-right mt-1 text-cyan-600">OPERATIONAL</p>
                                </div>
                            </div>

                            {/* Right Col: Mission & Focus */}
                            <div className="lg:col-span-7 p-8 flex flex-col justify-center md:p-12">
                                <h3 className="text-xs font-mono text-cyan-500 mb-6">// SYSTEM_BIO_LOGS</h3>
                                <div className="space-y-6 text-sm md:text-base text-gray-300 font-light leading-relaxed">
                                    <p>
                                        I am an <span className="text-white font-bold">Electrical and Electronics Engineering student</span> focused on Embedded Systems, IoT, Smart Energy Technologies, and Industrial Automation, with a clear goal: turning real-world engineering problems into reliable, scalable solutions.
                                    </p>
                                    <p>
                                        I work at the intersection of <span className="text-cyan-400">hardware, software, and energy systems</span>. My experience spans designing sensor-driven automation systems, building IoT-based control platforms, and developing renewable-energy solutions—including solar-powered dewatering systems for mining applications and automated exhaust and monitoring systems.
                                    </p>
                                    <p>
                                        Through hands-on projects and industrial training at <span className="text-white font-semibold">Coromandel International Limited</span>, I’ve developed a strong foundation in power systems, electrical machines, control systems, and industrial maintenance, along with the discipline required to work in real production environments.
                                    </p>
                                    <p>
                                        Beyond core electrical engineering, I actively build <span className="text-cyan-400">modern, web-based engineering tools</span> such as BudgetBuddy, ColorOhm, and AI-powered applications. This allows me to bridge the gap between physical systems and intelligent software, creating solutions that are not only functional but usable and scalable.
                                    </p>
                                    <p>
                                        I am deeply driven by sustainable engineering, smart grids, and intelligent energy systems, and I continuously seek opportunities where automation, embedded intelligence, and clean energy converge.
                                    </p>
                                    <div className="p-4 border-l-2 border-cyan-500 bg-cyan-950/10">
                                        <p className="text-white font-medium">
                                            I’m open to internships, entry-level roles, and collaborative projects where I can contribute to impactful engineering solutions while continuing to grow as a professional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. PROJECTS - PROCESSOR CARDS */}
                    <section id="projects" className="mb-24 md:mb-40">
                        <SectionHeader title="PROJECTS" subtitle="DEPLOYED MODULES" isPowered={isPowered} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 max-w-7xl mx-auto">
                            {PROJECTS.map(proj => (
                                <ProjectChip key={proj.id} project={proj} isPowered={isPowered} />
                            ))}
                        </div>
                    </section>

                    {/* 4. SKILLS - TECH MATRIX */}
                    <section id="skills" className="mb-24 md:mb-40">
                        <SkillBreadboard isPowered={isPowered} />
                    </section>

                    {/* 5. CERTIFICATIONS - ACHIEVEMENT CARDS */}
                    <section id="certifications" className="mb-24 md:mb-40">
                        <CertificationsBlock isPowered={isPowered} />
                    </section>

                    {/* 6. TIMELINE - EXPERIENCE & EDUCATION */}
                    <section id="experience" className="mb-24 md:mb-40">
                        <SectionHeader title="TIMELINE" subtitle="SYSTEM LOGS" isPowered={isPowered} flip />
                        <TimelineSystem experience={EXPERIENCE} education={EDUCATION} isPowered={isPowered} />
                    </section>

                    {/* 7. CONTACT - COMMUNICATION HUB */}
                    <section id="contact" className="mb-20 max-w-6xl mx-auto">
                        <SectionHeader title="COMMUNICATION" subtitle="ESTABLISH UPLINK" isPowered={isPowered} />
                        <ContactInterface profile={PROFILE} isPowered={isPowered} />
                    </section>

                    {/* Footer */}
                    <footer className="py-12 border-t border-gray-900 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-gray-800 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-gray-500 font-mono">SYSTEM_ONLINE // {new Date().getFullYear()}</span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

// Reusable Section Header
const SectionHeader: React.FC<{ title: string; subtitle: string; isPowered: boolean; flip?: boolean }> = ({ title, subtitle, isPowered, flip }) => (
    <div className={`flex items-center gap-4 mb-12 md:mb-20 max-w-7xl mx-auto px-4 ${flip ? 'flex-row-reverse' : ''}`}>
        <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter ${isPowered ? 'text-white' : 'text-gray-900'}`}>
            {title}
        </h2>
        <div className={`h-[1px] flex-grow ${isPowered ? 'bg-gradient-to-r from-cyan-500/50 to-transparent' : 'bg-gray-300'}`} />
        <span className={`text-xs font-mono tracking-[0.2em] uppercase ${isPowered ? 'text-cyan-500' : 'text-gray-500'}`}>{subtitle}</span>
    </div>
);

export default Home;
