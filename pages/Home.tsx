import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { PCBBackground } from '../components/PCBBackground';
import { ProjectChip } from '../components/ProjectChip';
import { SkillBreadboard } from '../components/SkillBreadboard';
import { CertificationsBlock } from '../components/CertificationsBlock';
import { TimelineSystem } from '../components/TimelineSystem';
import { ContactInterface } from '../components/ContactInterface';
import { LoadingScreen } from '../components/LoadingScreen';
import { EasterEgg } from '../components/EasterEgg';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '../constants';
import {
    Zap, Code, Globe, Terminal, Mail, Github, Linkedin, Twitter,
    Menu, X, ChevronDown, Activity, Cpu, Radio, BatteryMedium,
    ExternalLink, ArrowUpRight, MapPin, Briefcase, GraduationCap, Download, Eye
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

/* ─── Reduced-motion hook ───────────────────────────────────────── */
function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return reduced;
}

/* ─── Scroll-reveal wrapper ─────────────────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
    children, delay = 0, className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const reduced = usePrefersReducedMotion();

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={reduced ? false : { opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
};

/* ─── Section Header ────────────────────────────────────────────── */
const SectionHeader: React.FC<{
    title: string; subtitle: string; isPowered: boolean; flip?: boolean;
}> = ({ title, subtitle, isPowered, flip }) => (
    <Reveal>
        <div className={`flex items-center gap-4 mb-14 md:mb-20 max-w-7xl mx-auto px-4 ${flip ? 'flex-row-reverse' : ''}`}>
            <h2
                className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: isPowered ? '#ffffff' : '#111111',
                }}
            >
                {title}
            </h2>
            <motion.div
                className={`h-px flex-grow ${isPowered
                    ? 'bg-gradient-to-r from-cyan-500/60 via-cyan-300/20 to-transparent'
                    : 'bg-gray-300'}`}
                initial={{ scaleX: 0.3, opacity: 0.45 }}
                whileInView={{ scaleX: 1, opacity: [0.5, 1, 0.7] }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ transformOrigin: flip ? 'right center' : 'left center' }}
            />
            <span
                className="text-[10px] font-mono tracking-[0.25em] uppercase shrink-0"
                style={{ color: isPowered ? '#22d3ee' : '#6b7280' }}
            >
        // {subtitle}
            </span>
        </div>
    </Reveal>
);

/* ─── Stat Chip (hero bento stats) ─────────────────────────────── */
const StatChip: React.FC<{ icon: React.ReactNode; label: string; value: string; delay: number }> = ({
    icon, label, value, delay
}) => (
    <Reveal delay={delay}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/20 bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all duration-300 cursor-default group">
            <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">{icon}</span>
            <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
            </div>
        </div>
    </Reveal>
);

/* ════════════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
    const [isPowered, setIsPowered] = useState(() => sessionStorage.getItem('isPowered') === 'true');
    const [showLoading, setShowLoading] = useState(() => sessionStorage.getItem('isPowered') !== 'true');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [clockTime, setClockTime] = useState('');
    const [statusTickerIndex, setStatusTickerIndex] = useState(0);
    const [navHoverIndex, setNavHoverIndex] = useState(-1);
    const [navDirection, setNavDirection] = useState<1 | -1>(1);
    const isFirstMount = useRef(true);
    const { scrollYProgress } = useScroll();
    const scrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });
    const ringOffset = useTransform(scrollProgress, [0, 1], [88, 0]);

    /* Typing animations */
    const [heroIntro, setHeroIntro] = useState('');
    const heroIntroText = "> Hello, I'm RSMK";
    const [statusText, setStatusText] = useState('');
    const fullText = 'INITIALIZING SYSTEM PROFILER...';
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        sessionStorage.setItem('isPowered', isPowered.toString());
        if (isFirstMount.current) { isFirstMount.current = false; return; }
    }, [isPowered]);

    useEffect(() => {
        if (isPowered && !reduced) {
            let i = 0;
            const id = setInterval(() => {
                if (i <= heroIntroText.length) { setHeroIntro(heroIntroText.slice(0, i)); i++; }
                else clearInterval(id);
            }, 65);
            return () => clearInterval(id);
        }
        if (isPowered) setHeroIntro(heroIntroText);
    }, [isPowered, reduced]);

    useEffect(() => {
        if (isPowered && !reduced) {
            let i = 0;
            const id = setInterval(() => {
                if (i <= fullText.length) { setStatusText(fullText.slice(0, i)); i++; }
                else clearInterval(id);
            }, 45);
            return () => clearInterval(id);
        }
        if (isPowered) setStatusText(fullText);
    }, [isPowered, reduced]);

    /* Navbar scroll — trigger liquid glass past hero (80vh) */
    useEffect(() => {
        const threshold = window.innerHeight * 0.8;
        const onScroll = () => setScrolled(window.scrollY > threshold);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Active section via IntersectionObserver */
    useEffect(() => {
        const sectionIds = ['about', 'projects', 'skills', 'certifications', 'experience', 'contact'];
        const observers: IntersectionObserver[] = [];
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: '-20% 0px -60% 0px' }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    /* Live clock */
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setClockTime(now.toTimeString().slice(0, 8));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const tickerId = setInterval(() => {
            setStatusTickerIndex((prev) => (prev + 1) % 4);
        }, 4200);
        return () => clearInterval(tickerId);
    }, []);

    const statusTicker = [
        'ONLINE | BUILDING SMART ENERGY SYSTEMS',
        'SYNC | EMBEDDED + IOT WORKFLOWS',
        'FOCUS | AUTOMATION & POWER SYSTEMS',
        'MODE | SHIPPING REAL-WORLD SOLUTIONS',
    ];

    const navItems = ['About', 'Projects', 'Skills', 'Certifications', 'Gallery', 'Experience', 'Contact'];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
        if (item === 'Gallery') return;
        e.preventDefault();
        const id = item.toLowerCase();
        const el = document.getElementById(id);
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); window.history.pushState(null, '', `#${id}`); }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
            <EasterEgg />
            <Helmet>
                {/* Title */}
                <title>{PROFILE.name} | Embedded Systems &amp; IoT Engineer</title>

                {/* Primary SEO */}
                <meta name="description" content={`${PROFILE.name} (RSMK) — EEE student at Andhra Loyola Institute of Engineering and Technology (ALIET). Specialized in Embedded Systems & IoT. Projects: Firefighter Safety Device, Agri Rover, ColorOhm.`} />
                <meta name="keywords" content="Srinivasa Manikanta, Srinivasa Manikanta Rajapantula, RSMK, rsmk27, Andhra Loyola Institute of Engineering and Technology, ALIET, ALIET Vijayawada, Government Polytechnic Srikakulam, Srikakulam Engineering, Firefighter Safety Device, ColorOhm, Agri Rover, Embedded Systems, IoT, EEE Engineer" />
                <meta name="author" content={PROFILE.name} />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
                <link rel="canonical" href="https://rsmk.me/" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://rsmk.me/" />
                <meta property="og:site_name" content={`${PROFILE.name} (RSMK) Portfolio`} />
                <meta property="og:title" content={`${PROFILE.name} | Embedded Systems & IoT Engineer`} />
                <meta property="og:description" content="Explore innovative engineering projects by RSMK: Firefighter Safety Device, Agri Rover, ColorOhm, and Smart Energy systems. Specialist in Embedded Systems and IoT." />
                <meta property="og:image" content="https://rsmk.me/assets/srinivasa-manikanta-profile.webp" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={`Portrait of ${PROFILE.name}, EEE Engineer`} />
                <meta property="og:locale" content="en_IN" />

                {/* Twitter / X */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SrinivasManik20" />
                <meta name="twitter:creator" content="@SrinivasManik20" />
                <meta name="twitter:title" content={`${PROFILE.name} | Embedded Systems & IoT Engineer`} />
                <meta name="twitter:description" content="EEE student specializing in Embedded Systems, IoT, Smart Energy and Industrial Automation portfolio." />
                <meta name="twitter:image" content="https://rsmk.me/assets/srinivasa-manikanta-profile.webp" />
                <meta name="twitter:image:alt" content={`Portrait of ${PROFILE.name}, EEE Engineer`} />

                {/* JSON-LD: WebSite */}
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": `${PROFILE.name} Portfolio`,
                    "url": "https://rsmk.me",
                    "description": "Portfolio of Srinivasa Manikanta, an Electrical & Electronics Engineering student specializing in Embedded Systems, IoT, and Smart Energy.",
                    "author": {
                        "@type": "Person",
                        "name": PROFILE.name,
                        "url": "https://rsmk.me"
                    }
                })}</script>
            </Helmet>

            {showLoading && (
                <LoadingScreen onComplete={() => { setIsPowered(true); setShowLoading(false); }} />
            )}

            <div id="main-content" className={`main-content ${!showLoading ? 'visible' : ''}`}>
                <PCBBackground isPowered={isPowered} />

                {!reduced && (
                    <div className="fixed right-4 bottom-10 z-40 hidden md:flex items-center gap-2 pointer-events-none">
                        <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-600/70 uppercase [writing-mode:vertical-rl]">
                            scroll
                        </span>
                        <div className="h-28 w-1 rounded-full bg-cyan-950/70 border border-cyan-900/60 overflow-hidden origin-bottom">
                            <motion.div
                                className="w-full h-full bg-gradient-to-t from-cyan-400 via-cyan-300 to-white origin-bottom"
                                style={{ scaleY: scrollProgress }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Floating Navbar ─────────────────────────────────── */}
                <header
                    className={`fixed top-4 left-4 right-4 z-50 flex justify-between items-center px-5 py-3 rounded-xl
            pointer-events-none
            ${scrolled
                            ? 'liquid-glass-header'
                            : 'bg-transparent border border-transparent'
                        }`}
                    style={scrolled ? {
                        transition: 'background 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s cubic-bezier(0.22,1,0.36,1), backdrop-filter 0.5s cubic-bezier(0.22,1,0.36,1)'
                    } : {
                        transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)'
                    }}
                >
                    {/* Brand */}
                    <div className="flex flex-col pointer-events-auto">
                        <span
                            className={`text-xl font-black tracking-tighter transition-all duration-500 ${isPowered ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.7)]' : 'text-gray-600'}`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            RSMK
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[9px] font-mono text-gray-500 tracking-widest">
                                {isPowered ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-7 pointer-events-auto" aria-label="Main navigation">
                        {navItems.map((item) => {
                            const sectionId = item.toLowerCase();
                            const isActive = activeSection === sectionId;
                            return (
                                <a
                                    key={item}
                                    href={item === 'Gallery' ? '/gallery' : `#${sectionId}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    onMouseEnter={() => {
                                        const currentIndex = navItems.indexOf(item);
                                        if (navHoverIndex !== -1) {
                                            setNavDirection(currentIndex >= navHoverIndex ? 1 : -1);
                                        }
                                        setNavHoverIndex(currentIndex);
                                    }}
                                    className={`relative text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded cursor-pointer pb-0.5 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`}
                                >
                                    {item}
                                    <motion.span
                                        className="absolute bottom-0 left-0 h-px bg-cyan-400"
                                        animate={{
                                            width: isActive ? '100%' : '0%',
                                            left: navDirection === 1 ? '0%' : 'auto',
                                            right: navDirection === -1 ? '0%' : 'auto',
                                        }}
                                        transition={{ duration: 0.24, ease: 'easeOut' }}
                                    />
                                </a>
                            );
                        })}
                        <div className="w-px h-6 bg-gray-800 mx-2" />
                        <div className="flex items-center gap-1.5 pointer-events-auto">
                            <a
                                href={PROFILE.resume}
                                target="_blank"
                                rel="noreferrer"
                                title="View Resume"
                                className="flex items-center gap-1 px-3 py-1.5 border border-cyan-500/40 text-cyan-400 text-[11px] font-bold rounded-l-lg hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                            >
                                <Eye size={11} />
                                <span>RESUME</span>
                            </a>
                            <a
                                href={PROFILE.resume}
                                download="Srinivasa_Manikanta_Resume.pdf"
                                title="Download Resume"
                                className="flex items-center gap-1 px-2.5 py-1.5 border border-l-0 border-cyan-500/40 text-cyan-400 text-[11px] font-bold rounded-r-lg hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                            >
                                <Download size={11} />
                            </a>
                        </div>
                    </nav>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        className="md:hidden pointer-events-auto p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                {/* ── Mobile Menu ──────────────────────────────────────── */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-2"
                        >
                            {navItems.map((item, i) => (
                                <motion.a
                                    key={item}
                                    initial={reduced ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                    href={item === 'Gallery' ? '/gallery' : `#${item.toLowerCase()}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className="text-3xl font-black uppercase tracking-tight text-white hover:text-cyan-400 transition-colors duration-200 py-3 cursor-pointer focus:outline-none focus-visible:text-cyan-400"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                                className="mt-4 flex items-center gap-3"
                            >
                                <a
                                    href={PROFILE.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 border border-cyan-500/50 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                                >
                                    <Eye size={16} />
                                    <span>VIEW RESUME</span>
                                </a>
                                <a
                                    href={PROFILE.resume}
                                    download="Srinivasa_Manikanta_Resume.pdf"
                                    className="flex items-center gap-2 px-4 py-3 border border-cyan-500/30 text-cyan-500 font-bold rounded-xl hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                                    title="Download Resume"
                                >
                                    <Download size={16} />
                                </a>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="container mx-auto px-4 md:px-6 pt-0 overflow-x-hidden max-w-7xl">

                    <AnimatePresence>
                        {!reduced && scrolled && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 14 }}
                                transition={{ duration: 0.2 }}
                                className="fixed bottom-8 left-6 z-40 w-11 h-11 rounded-full border border-cyan-700/60 bg-black/70 backdrop-blur-sm flex items-center justify-center text-cyan-300 hover:text-cyan-100 hover:border-cyan-400 transition-colors"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                aria-label="Scroll to top"
                                type="button"
                                data-cursor-label="BACK"
                            >
                                <svg width="38" height="38" className="absolute -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
                                    <circle cx="16" cy="16" r="14" stroke="rgba(34,211,238,0.15)" strokeWidth="2" fill="none" />
                                    <motion.circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="#22d3ee"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="88"
                                        style={{ strokeDashoffset: ringOffset }}
                                    />
                                </svg>
                                <ArrowUpRight size={15} className="rotate-[-45deg]" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* ══ 1. HERO ════════════════════════════════════════════ */}
                    <section className="min-h-[100dvh] flex flex-col items-center justify-center relative pt-24 pb-16 text-center">

                        {/* Background radial glow */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(6,182,212,0.10)_0%,transparent_70%)]" />
                            <div
                                className="absolute inset-0 opacity-[0.025]"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
                                    backgroundSize: '60px 60px'
                                }}
                            />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl mx-auto w-full px-4">

                            {/* ── Avatar ── */}
                            <motion.div
                                initial={reduced ? false : { scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="relative flex items-center justify-center"
                                style={{ width: 200, height: 200 }}
                            >
                                {/* Outer dashed ring */}
                                {!reduced && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                                        className="absolute rounded-full border-2 border-dashed border-cyan-500/20 pointer-events-none"
                                        style={{ width: 260, height: 260 }}
                                    />
                                )}
                                {/* Inner ring with ticks */}
                                {!reduced && (
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                                        className="absolute rounded-full border border-cyan-500/30 pointer-events-none"
                                        style={{ width: 226, height: 226 }}
                                    >
                                        {[0, 90, 180, 270].map((deg) => (
                                            <div
                                                key={deg}
                                                className="absolute bg-cyan-400/60"
                                                style={{
                                                    width: deg % 180 === 0 ? 2 : 10,
                                                    height: deg % 180 === 0 ? 10 : 2,
                                                    top: deg === 0 ? 0 : deg === 180 ? 'auto' : '50%',
                                                    bottom: deg === 180 ? 0 : 'auto',
                                                    left: deg === 270 ? 0 : deg === 90 ? 'auto' : '50%',
                                                    right: deg === 90 ? 0 : 'auto',
                                                    transform: deg % 180 === 0 ? 'translateX(-50%)' : 'translateY(-50%)',
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                                {/* Orbiting zap */}
                                {!reduced && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                                        className="absolute pointer-events-none"
                                        style={{ width: 240, height: 240 }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <Zap size={18} className="text-cyan-400 fill-cyan-400/30 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Floating tech orbit icons */}
                                {!reduced && isPowered && (
                                    <>
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                                            className="absolute pointer-events-none"
                                            style={{ width: 290, height: 290 }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
                                                <Cpu size={14} className="text-cyan-300" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ rotate: 72 }}
                                            animate={{ rotate: 432 }}
                                            transition={{ duration: 17, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                                            className="absolute pointer-events-none"
                                            style={{ width: 310, height: 310 }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60">
                                                <Radio size={13} className="text-purple-400" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ rotate: 144 }}
                                            animate={{ rotate: 504 }}
                                            transition={{ duration: 25, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                                            className="absolute pointer-events-none"
                                            style={{ width: 330, height: 330 }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65">
                                                <BatteryMedium size={13} className="text-emerald-400" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ rotate: 216 }}
                                            animate={{ rotate: 576 }}
                                            transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                                            className="absolute pointer-events-none"
                                            style={{ width: 280, height: 280 }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
                                                <Code size={13} className="text-amber-400" />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ rotate: 288 }}
                                            animate={{ rotate: 648 }}
                                            transition={{ duration: 19, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                                            className="absolute pointer-events-none"
                                            style={{ width: 350, height: 350 }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60">
                                                <Activity size={14} className="text-cyan-500" />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                                {/* Profile image */}
                                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(0,242,255,0.18),inset_0_0_30px_rgba(0,242,255,0.05)] bg-black z-10 hover:border-cyan-400/60 transition-colors duration-500 group">
                                    <img
                                        src={PROFILE.image}
                                        alt={`Srinivasa Manikanta Rajapantula (RSMK) — Embedded Systems & IoT Engineer Portfolio Image`}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="sync"
                                        width="192"
                                        height="192"
                                    />
                                </div>
                            </motion.div>

                            {/* ── Name & Role ── */}
                            <div className="space-y-3">
                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <h1
                                        className="w-fit text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] flex flex-col items-center justify-center mx-auto cursor-none"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        data-cursor-label="HELLO!"
                                    >
                                        <div className="flex flex-wrap justify-center pb-2 text-white">
                                            {"SRINIVASA".split('').map((char, i) => (
                                                <motion.span
                                                    key={`s-${i}`}
                                                    className="inline-block"
                                                    whileHover={{
                                                        y: -16,
                                                        scale: 1.4,
                                                        rotate: i % 2 === 0 ? 8 : -8,
                                                        color: '#00f2ff', // Cyan flare
                                                        textShadow: '0px 10px 20px rgba(0, 242, 255, 0.6)'
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 450, damping: 10 }}
                                                    style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div 
                                            className="flex flex-wrap justify-center pt-1 text-cyan-400"
                                            style={{ textShadow: '0 0 40px rgba(34,211,238,0.2)' }}
                                        >
                                            {"MANIKANTA".split('').map((char, i) => (
                                                <motion.span
                                                    key={`m-${i}`}
                                                    className="inline-block"
                                                    whileHover={{
                                                        y: 16,
                                                        scale: 1.4,
                                                        rotate: i % 2 === 0 ? -8 : 8,
                                                        color: '#ffffff', // White flare
                                                        textShadow: '0px -10px 20px rgba(255, 255, 255, 0.6)'
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 450, damping: 10 }}
                                                    style={{ display: 'inline-block', transformOrigin: 'top center' }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div 
                                            className="flex flex-wrap justify-center pt-2 text-white/90 text-4xl md:text-6xl lg:text-7xl opacity-80"
                                            style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}
                                        >
                                            {"RAJAPANTULA".split('').map((char, i) => (
                                                <motion.span
                                                    key={`r-${i}`}
                                                    className="inline-block"
                                                    whileHover={{
                                                        y: -8,
                                                        scale: 1.2,
                                                        color: '#00f2ff',
                                                        textShadow: '0px 10px 20px rgba(0, 242, 255, 0.4)'
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 450, damping: 10 }}
                                                    style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </h1>
                                </motion.div>

                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <h2 className="text-base md:text-xl text-gray-300 font-mono tracking-[0.25em] uppercase">
                                        RSMK | Electrical &amp; Electronics Engineer
                                    </h2>
                                    <motion.p
                                        key={statusTickerIndex}
                                        initial={reduced ? false : { opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="text-[10px] md:text-xs font-mono tracking-[0.16em] uppercase text-cyan-500/65"
                                    >
                                        {statusTicker[statusTickerIndex]}
                                    </motion.p>
                                </motion.div>
                            </div>

                            {/* ── Scroll indicator ── */}
                            {!reduced && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, y: [0, 8, 0] }}
                                    transition={{ opacity: { delay: 1.2, duration: 0.4 }, y: { delay: 1.5, duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                                    className="flex flex-col items-center gap-2 mt-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
                                    aria-label="Scroll to about section"
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    type="button"
                                    data-cursor-label="SCROLL"
                                >
                                    <span className="text-[9px] font-mono text-cyan-500/50 tracking-[0.25em] uppercase">Scroll</span>
                                    <div className="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                                    <ChevronDown size={14} className="text-cyan-500/50" />
                                </motion.button>
                            )}
                        </div>
                    </section>

                    {/* ══ 2. ABOUT ═══════════════════════════════════════════ */}
                    <section id="about" className="py-24 max-w-6xl mx-auto">
                        <SectionHeader title="System Overview" subtitle="Identity &amp; Mission" isPowered={isPowered} flip />

                        <Reveal>
                            <div className={`flex flex-col items-center justify-center max-w-4xl mx-auto gap-0 rounded-2xl border overflow-hidden relative text-center
                ${isPowered ? 'border-gray-800 bg-black/40 backdrop-blur-sm' : 'border-gray-200 bg-white/5'}`}
                            >
                                {/* Circuit texture bg */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415 1.415-.828.828z' fill='%2306b6d4' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                                />

                                {/* Bio Section Centered */}
                                <div className="p-8 md:p-12 flex flex-col items-center justify-center w-full">
                                    <span className="text-[10px] font-mono text-cyan-500 tracking-widest mb-6">// SYSTEM_BIO_LOGS</span>
                                    <motion.div
                                        initial={reduced ? false : { opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, ease: 'easeOut' }}
                                        className="mb-8 space-y-4 flex flex-col items-center"
                                    >
                                        <p className="min-h-6 w-fit mx-auto px-3 py-1 rounded border border-cyan-500/30 bg-black/40 text-xs md:text-sm font-mono text-cyan-300 tracking-[0.14em]">
                                            {heroIntro}<span className="animate-pulse opacity-80">▎</span>
                                        </p>
                                        <p className="h-5 text-xs font-mono text-cyan-500/70">
                                            {statusText}<span className="animate-pulse opacity-80">▎</span>
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mx-auto">
                                            <StatChip icon={<Cpu size={16} />} label="Specialty" value="Embedded / IoT" delay={0.05} />
                                            <StatChip icon={<MapPin size={16} />} label="Location" value="Srikakulam, AP" delay={0.1} />
                                            <StatChip icon={<Briefcase size={16} />} label="Experience" value="Industrial Intern" delay={0.15} />
                                            <StatChip icon={<GraduationCap size={16} />} label="Degree" value="B.Tech EEE" delay={0.2} />
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-3 pt-1">
                                            <a
                                                href="#projects"
                                                onClick={(e) => handleNavClick(e, 'Projects')}
                                                className="btn-ripple group flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-250 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                                            >
                                                View Projects
                                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                            </a>
                                            <a
                                                href={PROFILE.resume}
                                                download="Srinivasa_Manikanta_Resume.pdf"
                                                className="btn-ripple group flex items-center gap-2 px-5 py-2.5 border border-cyan-500/50 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-250 backdrop-blur-sm bg-black/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                            >
                                                <Download size={13} className="group-hover:translate-y-0.5 transition-transform duration-200" />
                                                Download CV
                                            </a>
                                            <a
                                                href="#contact"
                                                onClick={(e) => handleNavClick(e, 'Contact')}
                                                className="flex items-center gap-2 px-5 py-2.5 border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:border-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all duration-250 backdrop-blur-sm bg-black/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                            >
                                                <Terminal size={13} />
                                                Initialize Comms
                                            </a>
                                        </div>
                                    </motion.div>
                                    <div
                                        className="space-y-5 text-sm md:text-[15px] leading-relaxed text-gray-300 max-w-3xl"
                                        style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
                                    >
                                        <p>
                                            I am an <span className="text-white font-semibold">Electrical and Electronics Engineering student</span> focused on Embedded Systems, IoT, Smart Energy Technologies, and Industrial Automation — turning real-world engineering problems into reliable, scalable solutions.
                                        </p>
                                        <p>
                                            I work at the intersection of <span className="text-cyan-400 font-medium">hardware, software, and energy systems</span>. My experience spans designing sensor-driven automation systems, building IoT-based control platforms, and developing renewable-energy solutions including solar-powered dewatering systems and automated monitoring platforms.
                                        </p>
                                        <p>
                                            Through industrial training at <span className="text-white font-medium">Coromandel International Limited</span>, I built a strong foundation in power systems, electrical machines, control systems, and industrial maintenance — with the discipline for real production environments.
                                        </p>
                                        <p>
                                            Beyond core EEE, I actively build <span className="text-cyan-400 font-medium">modern, web-based engineering tools</span> — bridging the gap between physical systems and intelligent software with scalable, usable solutions.
                                        </p>
                                        <div className="mt-4 p-4 rounded-xl border-l-2 border-cyan-500 bg-cyan-950/10 backdrop-blur-sm text-left inline-block">
                                            <p className="text-white font-medium text-sm">
                                                Open to internships, entry-level roles, and collaborative projects where engineering meets impact. Let's build something meaningful.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>

                    {/* ══ 3. PROJECTS ════════════════════════════════════════ */}
                    <section id="projects" className="mb-24 md:mb-40">
                        <SectionHeader title="Projects" subtitle="Deployed Modules" isPowered={isPowered} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-7">
                            {PROJECTS.map((proj, i) => (
                                <Reveal key={proj.id} delay={i * 0.07}>
                                    <ProjectChip project={proj} isPowered={isPowered} />
                                </Reveal>
                            ))}
                        </div>
                    </section>

                    {/* ══ 4. SKILLS ══════════════════════════════════════════ */}
                    <section id="skills" className="mb-24 md:mb-40">
                        <SkillBreadboard isPowered={isPowered} />
                    </section>

                    {/* ══ 5. CERTIFICATIONS ══════════════════════════════════ */}
                    <section id="certifications" className="mb-24 md:mb-40">
                        <CertificationsBlock isPowered={isPowered} />
                    </section>

                    {/* ══ 6. EXPERIENCE / TIMELINE ═══════════════════════════ */}
                    <section id="experience" className="mb-24 md:mb-40">
                        <SectionHeader title="Timeline" subtitle="System Logs" isPowered={isPowered} flip />
                        <TimelineSystem experience={EXPERIENCE} education={EDUCATION} isPowered={isPowered} />
                    </section>

                    {/* ══ 7. CONTACT ══════════════════════════════════════════ */}
                    <section id="contact" className="mb-20 max-w-6xl mx-auto">
                        <SectionHeader title="Contact" subtitle="Establish Uplink" isPowered={isPowered} />
                        <ContactInterface profile={PROFILE} isPowered={isPowered} />
                    </section>

                    {/* ══ FOOTER ═══════════════════════════════════════════════ */}
                    <footer className="py-14 border-t border-gray-900/80">
                        <div className="flex flex-col items-center gap-8">

                            {/* Brand mark */}
                            <div className="flex flex-col items-center gap-1">
                                <span
                                    className="text-2xl font-black tracking-tighter text-cyan-400"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 20px rgba(34,211,238,0.4)' }}
                                >
                                    RSMK
                                </span>
                                <span className="text-[10px] font-mono text-gray-600 tracking-[0.2em]">
                                    SRINIVASA MANIKANTA // ENGINEER
                                </span>
                            </div>

                            {/* Social icons */}
                            <div className="flex items-center gap-3" role="list" aria-label="Social links">
                                {PROFILE.socials.map((s) => {
                                    const icons: Record<string, React.ReactNode> = {
                                        github: <Github size={17} />,
                                        linkedin: <Linkedin size={17} />,
                                        x: <Twitter size={17} />,
                                        instagram: <Mail size={17} />,
                                        telegram: <Terminal size={17} />,
                                        email: <Mail size={17} />,
                                    };
                                    return (
                                        <motion.a
                                            key={s.platform}
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Visit ${PROFILE.name}'s ${s.platform}`}
                                            role="listitem"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-800 text-gray-500
                        hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-950/20
                        cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                            whileHover={{ rotate: 360, scale: 1.2 }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        >
                                            {icons[s.platform] ?? <Globe size={17} />}
                                        </motion.a>
                                    );
                                })}
                            </div>

                            {/* Nav links */}
                            <nav className="flex items-center gap-5 flex-wrap justify-center" aria-label="Footer navigation">
                                {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={(e) => handleNavClick(e, item)}
                                        className="text-[10px] font-mono text-gray-600 hover:text-cyan-500 transition-colors duration-200 tracking-widest uppercase cursor-pointer focus:outline-none focus-visible:text-cyan-400"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            {/* Status pill */}
                            <div className="flex flex-col items-center gap-2">
                                {/* Live clock */}
                                {isPowered && clockTime && (
                                    <div className="font-mono text-[11px] text-cyan-500/60 tracking-[0.15em]">
                                        {clockTime}
                                    </div>
                                )}
                                {/* Energy pulse */}
                                {isPowered && (
                                    <motion.div
                                        animate={{ scale: [1, 1.08, 1] }}
                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span
                                            className="text-yellow-400"
                                            style={{ filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.7))' }}
                                        >⚡</span>
                                        <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">
                                            Energy Active
                                        </span>
                                    </motion.div>
                                )}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 border border-gray-800 rounded-full backdrop-blur-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                    <span className="text-[10px] text-gray-500 font-mono tracking-widest">
                                        SYSTEM_ONLINE // {new Date().getFullYear()}
                                    </span>
                                </div>
                                {isPowered && (
                                    <div className="flex items-end gap-1 h-4">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 rounded-sm bg-cyan-500/70"
                                                animate={{ height: [3, 8 + i * 2, 4] }}
                                                transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, repeatType: 'mirror' }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-700 font-mono">
                                    Built with precision &mdash; {PROFILE.location}
                                </p>
                            </div>
                        </div>
                    </footer>

                </main>
            </div>
        </div>
    );
};

export default Home;
