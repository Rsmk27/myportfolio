import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PCBBackground } from '../components/PCBBackground';
import { ProjectChip } from '../components/ProjectChip';
import { SkillBreadboard } from '../components/SkillBreadboard';
import { CertificationsBlock } from '../components/CertificationsBlock';
import { TimelineSystem } from '../components/TimelineSystem';
import { ContactInterface } from '../components/ContactInterface';
import { LoadingScreen } from '../components/LoadingScreen';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '../constants';
import {
    Zap, Code, Globe, Terminal, Mail, Github, Linkedin, Twitter,
    Menu, X, ChevronDown, Activity, Cpu, Radio, BatteryMedium,
    ExternalLink, ArrowUpRight, MapPin, Briefcase, GraduationCap
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
            <div className={`h-px flex-grow ${isPowered
                ? 'bg-gradient-to-r from-cyan-500/60 via-cyan-300/20 to-transparent'
                : 'bg-gray-300'}`}
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
    const isFirstMount = useRef(true);

    /* Typing animation */
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
                if (i <= fullText.length) { setStatusText(fullText.slice(0, i)); i++; }
                else clearInterval(id);
            }, 45);
            return () => clearInterval(id);
        }
    }, [isPowered, reduced]);

    /* Navbar scroll shadow */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
            <Helmet>
                <title>{PROFILE.name} | Embedded Systems &amp; IoT Engineer</title>
                <meta name="description" content={PROFILE.tagline} />
                <meta property="og:title" content={`${PROFILE.name} | Portfolio`} />
                <meta property="og:description" content={PROFILE.bio} />
                <meta property="og:image" content={PROFILE.image} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${PROFILE.name} | Portfolio`} />
                <meta name="twitter:description" content={PROFILE.tagline} />
                <meta name="twitter:image" content={PROFILE.image} />
            </Helmet>

            {showLoading && (
                <LoadingScreen onComplete={() => { setIsPowered(true); setShowLoading(false); }} />
            )}

            <div id="main-content" className={`main-content ${!showLoading ? 'visible' : ''}`}>
                <PCBBackground isPowered={isPowered} />

                {/* ── Floating Navbar ─────────────────────────────────── */}
                <header
                    className={`fixed top-4 left-4 right-4 z-50 flex justify-between items-center px-5 py-3 rounded-xl
            transition-all duration-300 pointer-events-none
            ${scrolled
                            ? 'bg-black/80 backdrop-blur-xl border border-white/[0.06] shadow-[0_4px_32px_rgba(0,242,255,0.07)]'
                            : 'bg-transparent border border-transparent'
                        }`}
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
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={item === 'Gallery' ? '/gallery' : `#${item.toLowerCase()}`}
                                onClick={(e) => handleNavClick(e, item)}
                                className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded cursor-pointer"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="w-px h-6 bg-gray-800 mx-2" />
                        <a
                            href={PROFILE.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-4 py-1.5 border border-cyan-500/40 text-cyan-400 text-[11px] font-bold rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200 pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                            <span>RESUME</span>
                            <ArrowUpRight size={12} />
                        </a>
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
                            <motion.a
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                                href={PROFILE.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 flex items-center gap-2 px-6 py-3 border border-cyan-500/50 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                            >
                                <span>RESUME</span>
                                <ArrowUpRight size={16} />
                            </motion.a>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="container mx-auto px-4 md:px-6 pt-0 overflow-x-hidden max-w-7xl">

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
                                {/* Profile image */}
                                <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(0,242,255,0.18),inset_0_0_30px_rgba(0,242,255,0.05)] bg-black z-10 hover:border-cyan-400/60 transition-colors duration-500 group">
                                    <img
                                        src={PROFILE.image}
                                        alt={`Portrait of ${PROFILE.name}`}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
                                    {/* Scanline overlay */}
                                    <div
                                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                        style={{
                                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,242,255,1) 2px, rgba(0,242,255,1) 3px)',
                                        }}
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
                                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400">
                                            SRINIVASA
                                        </span>
                                        <span
                                            className="block text-cyan-400"
                                            style={{ textShadow: '0 0 40px rgba(34,211,238,0.4), 0 0 80px rgba(34,211,238,0.15)' }}
                                        >
                                            MANIKANTA
                                        </span>
                                    </h1>
                                </motion.div>

                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <h2 className="text-base md:text-xl text-gray-300 font-mono tracking-[0.25em] uppercase">
                                        Electrical &amp; Electronics Engineer
                                    </h2>
                                    {/* Typing line */}
                                    <p className="h-5 text-xs font-mono text-cyan-500/70">
                                        {statusText}<span className="animate-pulse opacity-80">▎</span>
                                    </p>
                                </motion.div>
                            </div>

                            {/* ── Bento Stats Row ── */}
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl"
                            >
                                <StatChip icon={<Cpu size={16} />} label="Specialty" value="Embedded / IoT" delay={0.55} />
                                <StatChip icon={<MapPin size={16} />} label="Location" value="Srikakulam, AP" delay={0.6} />
                                <StatChip icon={<Briefcase size={16} />} label="Experience" value="Industrial Intern" delay={0.65} />
                                <StatChip icon={<GraduationCap size={16} />} label="Degree" value="B.Tech EEE" delay={0.7} />
                            </motion.div>

                            {/* ── CTA Buttons ── */}
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.75, duration: 0.5 }}
                                className="flex flex-wrap gap-4 justify-center"
                            >
                                <a
                                    href="#projects"
                                    onClick={(e) => handleNavClick(e, 'Projects')}
                                    className="group flex items-center gap-2 px-7 py-3 bg-cyan-500 text-black text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-250 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                                >
                                    View Projects
                                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                </a>
                                <a
                                    href="#contact"
                                    onClick={(e) => handleNavClick(e, 'Contact')}
                                    className="flex items-center gap-2 px-7 py-3 border border-gray-700 text-gray-300 text-sm font-bold uppercase tracking-wider rounded-lg hover:border-cyan-500/60 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all duration-250 backdrop-blur-sm bg-black/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                >
                                    <Terminal size={15} />
                                    Initialize Comms
                                </a>
                            </motion.div>

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
                            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border overflow-hidden relative
                ${isPowered ? 'border-gray-800 bg-black/40 backdrop-blur-sm' : 'border-gray-200 bg-white/5'}`}
                            >
                                {/* Circuit texture bg */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415 1.415-.828.828z' fill='%2306b6d4' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                                />

                                {/* Left: Identity Card */}
                                <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col items-center gap-6">
                                    <span className="self-start text-[10px] font-mono text-cyan-500 tracking-widest">// IDENTITY_MODULE</span>

                                    <div className="relative">
                                        <div className="w-36 h-36 rounded-2xl overflow-hidden border border-gray-700 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
                                            <img
                                                src={PROFILE.image}
                                                className={`w-full h-full object-cover transition-all duration-500 ${isPowered ? 'opacity-90' : 'grayscale opacity-60'}`}
                                                alt={`${PROFILE.name} profile`}
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center">
                                            <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 font-mono text-sm">
                                        {[
                                            { label: 'NAME', value: PROFILE.name, color: 'text-white' },
                                            { label: 'ROLE', value: 'EEE Engineer', color: 'text-cyan-400' },
                                            { label: 'STATUS', value: isPowered ? 'OPERATIONAL' : 'STANDBY', color: isPowered ? 'text-emerald-400' : 'text-red-400' },
                                            { label: 'LOCATION', value: 'Srikakulam, AP', color: 'text-gray-300' },
                                        ].map(({ label, value, color }) => (
                                            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-800/60">
                                                <span className="text-gray-600 text-[10px] tracking-widest">{label}</span>
                                                <span className={`${color} font-semibold text-xs`}>{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full mt-2">
                                        <div className="flex justify-between text-[9px] font-mono text-gray-600 mb-1.5">
                                            <span>SYSTEM CAPACITY</span>
                                            <span className="text-cyan-600">100%</span>
                                        </div>
                                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 w-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Bio */}
                                <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-center">
                                    <span className="text-[10px] font-mono text-cyan-500 tracking-widest mb-6">// SYSTEM_BIO_LOGS</span>
                                    <div
                                        className="space-y-5 text-sm md:text-[15px] leading-relaxed text-gray-300"
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
                                        <div className="mt-4 p-4 rounded-xl border-l-2 border-cyan-500 bg-cyan-950/10 backdrop-blur-sm">
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
                                        <a
                                            key={s.platform}
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Visit ${PROFILE.name}'s ${s.platform}`}
                                            role="listitem"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-800 text-gray-500
                        hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-950/20
                        transition-all duration-250 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                        >
                                            {icons[s.platform] ?? <Globe size={17} />}
                                        </a>
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 border border-gray-800 rounded-full backdrop-blur-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                    <span className="text-[10px] text-gray-500 font-mono tracking-widest">
                                        SYSTEM_ONLINE // {new Date().getFullYear()}
                                    </span>
                                </div>
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
