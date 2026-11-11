import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { PCBBackground } from '../components/PCBBackground';
import { ProjectChip, ProjectDetailModal } from '../components/ProjectChip';
import { SkillBreadboard } from '../components/SkillBreadboard';
import { CertificationsBlock } from '../components/CertificationsBlock';
import { TimelineSystem } from '../components/TimelineSystem';
import { ContactInterface } from '../components/ContactInterface';
import { EasterEgg } from '../components/EasterEgg';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '../constants';
import { Project } from '../types';
import {
    Zap, Code, Terminal, Menu, X, ChevronDown, Activity, Cpu, Radio,
    BatteryMedium, ArrowUpRight, MapPin, Briefcase, GraduationCap, Eye,
    ChevronLeft, ChevronRight, Pause, Play, Power
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { useSectionObserver, useScrollDepthTracking } from '../hooks/useAnalytics';
import { trackInteraction } from '../utils/analytics';
import { triggerChatbotWarmup } from '../utils/chatbotWarmup';

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

/* ─── Mobile detection hook ─────────────────────────────────────── */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

/* ─── Scroll-reveal wrapper ─────────────────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
    children, delay = 0, className = ''
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-45px' });
    const reduced = usePrefersReducedMotion();
    const isMobile = useIsMobile();

    if (isMobile) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.38, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    );
};

/* ─── Silkscreen Section Header ─────────────────────────────────── */
const SectionHeader: React.FC<{
    title: string; subtitle: string; isPowered: boolean; flip?: boolean; code?: string;
}> = ({ title, subtitle, isPowered, flip, code }) => (
    <Reveal>
        <div className={`flex items-center gap-3 md:gap-4 mb-12 md:mb-16 max-w-7xl mx-auto px-4 ${flip ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 shrink-0 ${flip ? 'flex-row-reverse' : ''}`}>
                <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-sm rotate-45 border shrink-0 transition-colors duration-300 ${
                        isPowered
                            ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                            : 'border-amber-400 bg-amber-400/20'
                    }`}
                />
                <div className={`flex flex-col ${flip ? 'items-end' : 'items-start'}`}>
                    {code && (
                        <span
                            className={`text-[10px] font-mono tracking-[0.25em] uppercase mb-1 ${
                                isPowered ? 'text-cyan-400' : 'text-amber-400'
                            }`}
                        >
                            {code}
                        </span>
                    )}
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none"
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: isPowered ? '#ffffff' : '#d4d4d8',
                        }}
                    >
                        {title}
                    </h2>
                </div>
            </div>

            <div className={`flex items-center flex-grow gap-1.5 ${flip ? 'flex-row-reverse' : ''}`}>
                <span
                    aria-hidden="true"
                    className={`w-2 h-2 rounded-full border shrink-0 ${
                        isPowered ? 'border-cyan-400/70 bg-cyan-950' : 'border-amber-400/70 bg-amber-950'
                    }`}
                />
                <motion.div
                    className={`h-px flex-grow ${
                        isPowered
                            ? 'bg-gradient-to-r from-cyan-400/60 via-amber-400/35 to-transparent'
                            : 'bg-gradient-to-r from-amber-400/60 via-zinc-500/35 to-transparent'
                    }`}
                    initial={{ scaleX: 0.3, opacity: 0.45 }}
                    whileInView={{ scaleX: 1, opacity: [0.5, 1, 0.8] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    style={{ transformOrigin: flip ? 'right center' : 'left center' }}
                />
            </div>

            {subtitle && (
                <span
                    className="text-[10px] font-mono tracking-[0.22em] uppercase shrink-0 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950/80"
                    style={{ color: isPowered ? '#22d3ee' : '#fbbf24' }}
                >
                    // {subtitle}
                </span>
            )}
        </div>
    </Reveal>
);

/* ─── Stat Chip (hero/about hardware readout) ───────────────────── */
const StatChip: React.FC<{
    icon: React.ReactNode; label: string; value: string; delay: number; isPowered: boolean;
}> = ({ icon, label, value, delay, isPowered }) => (
    <Reveal delay={delay}>
        <div
            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300 cursor-default group text-left ${
                isPowered
                    ? 'border-cyan-500/20 bg-black/55 hover:border-cyan-400/50 hover:bg-cyan-950/20'
                    : 'border-amber-500/25 bg-black/60 hover:border-amber-400/50 hover:bg-amber-950/20'
            }`}
        >
            <span
                className={`p-2 rounded-md border shrink-0 transition-colors duration-200 ${
                    isPowered
                        ? 'border-cyan-500/25 bg-cyan-950/30 text-cyan-300 group-hover:text-cyan-200'
                        : 'border-amber-500/25 bg-amber-950/30 text-amber-400 group-hover:text-amber-300'
                }`}
            >
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest truncate">{label}</p>
                <p
                    className={`text-sm font-semibold truncate ${isPowered ? 'text-white' : 'text-zinc-200'}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {value}
                </p>
            </div>
        </div>
    </Reveal>
);

/* ════════════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
    const isMobile = useIsMobile();
    const [isPowered, setIsPowered] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('');
    const [clockTime, setClockTime] = useState('');
    const [statusTickerIndex, setStatusTickerIndex] = useState(0);
    const [navHoverIndex, setNavHoverIndex] = useState(-1);
    const [navDirection, setNavDirection] = useState<1 | -1>(1);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { scrollYProgress } = useScroll();
    const scrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });
    const ringOffset = useTransform(scrollProgress, [0, 1], [88, 0]);

    // Projects Carousel States and Refs
    const projectsSectionRef = useRef<HTMLElement>(null);
    const projectsScrollRef = useRef<HTMLDivElement>(null);
    const projectsInView = useInView(projectsSectionRef, { margin: '200px' });
    const [isHoveredProjects, setIsHoveredProjects] = useState(false);
    const [isProjectsPaused, setIsProjectsPaused] = useState(false);
    const [isDraggingProjects, setIsDraggingProjects] = useState(false);
    const [startXProjects, setStartXProjects] = useState(0);
    const [scrollLeftProjectsState, setScrollLeftProjectsState] = useState(0);

    // Auto-scroll loop using requestAnimationFrame for Projects
    useEffect(() => {
        const container = projectsScrollRef.current;
        if (!container || !isPowered || !projectsInView || isProjectsPaused) return;

        let animationFrameId: number;
        let lastTime = performance.now();
        const speed = 35; // pixels per second
        let halfWidth = container.scrollWidth > 0 ? container.scrollWidth / 2 : 2400;

        const updateHalfWidth = () => {
            if (container && container.scrollWidth > 0) {
                halfWidth = container.scrollWidth / 2;
            }
        };

        window.addEventListener('resize', updateHalfWidth, { passive: true });

        const step = (time: number) => {
            if (!isHoveredProjects && !isDraggingProjects && !isProjectsPaused) {
                const delta = (time - lastTime) / 1000;
                container.scrollLeft += speed * delta;

                // Infinite loop: snap back when scrolled past first set of items
                if (container.scrollLeft >= halfWidth) {
                    container.scrollLeft -= halfWidth;
                }
            }
            lastTime = time;
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', updateHalfWidth);
        };
    }, [isHoveredProjects, isDraggingProjects, isPowered, projectsInView, isProjectsPaused]);

    // Manual navigation buttons scroll for Projects
    const scrollProjects = (direction: 'left' | 'right') => {
        const container = projectsScrollRef.current;
        if (container) {
            const { scrollLeft, clientWidth, scrollWidth } = container;
            const scrollAmount = clientWidth * 0.75;
            let target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

            const halfWidth = scrollWidth / 2;
            if (target < 0) {
                container.scrollLeft = halfWidth + target;
                target = halfWidth + target - scrollAmount;
            } else if (target >= halfWidth) {
                container.scrollLeft = target - halfWidth;
                target = target - halfWidth + scrollAmount;
            }

            container.scrollTo({
                left: target,
                behavior: 'smooth'
            });
        }
    };

    // Drag-to-scroll handlers for Projects
    const handleMouseDownProjects = (e: React.MouseEvent) => {
        const container = projectsScrollRef.current;
        if (!container) return;
        setIsDraggingProjects(true);
        setStartXProjects(e.pageX - container.offsetLeft);
        setScrollLeftProjectsState(container.scrollLeft);
    };

    const handleMouseLeaveOrUpProjects = () => {
        setIsDraggingProjects(false);
    };

    const handleMouseMoveProjects = (e: React.MouseEvent) => {
        const container = projectsScrollRef.current;
        if (!isDraggingProjects || !container) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startXProjects) * 1.5;
        container.scrollLeft = scrollLeftProjectsState - walk;

        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
            setStartXProjects(x);
            setScrollLeftProjectsState(container.scrollLeft);
        } else if (container.scrollLeft < 0) {
            container.scrollLeft += halfWidth;
            setStartXProjects(x);
            setScrollLeftProjectsState(container.scrollLeft);
        }
    };

    // Touch-to-scroll handlers for Projects
    const touchStartXProjects = useRef(0);
    const touchScrollLeftProjects = useRef(0);

    const handleTouchStartProjects = (e: React.TouchEvent) => {
        setIsHoveredProjects(true);
        const container = projectsScrollRef.current;
        if (!container) return;
        touchStartXProjects.current = e.touches[0].clientX;
        touchScrollLeftProjects.current = container.scrollLeft;
    };

    const handleTouchMoveProjects = (e: React.TouchEvent) => {
        const container = projectsScrollRef.current;
        if (!container) return;
        const currentX = e.touches[0].clientX;
        const delta = touchStartXProjects.current - currentX;
        container.scrollLeft = touchScrollLeftProjects.current + delta;

        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
            touchStartXProjects.current = currentX;
            touchScrollLeftProjects.current = container.scrollLeft;
        } else if (container.scrollLeft < 0) {
            container.scrollLeft += halfWidth;
            touchStartXProjects.current = currentX;
            touchScrollLeftProjects.current = container.scrollLeft;
        }
    };

    const handleTouchEndProjects = () => {
        setIsHoveredProjects(false);
    };

    const reduced = usePrefersReducedMotion();

    /* Navbar scroll handling */
    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentY = window.scrollY;
                    const diff = currentY - lastY;
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

                    setScrolled(currentY > 60);
                    setShowBackToTop(currentY > window.innerHeight * 0.7);

                    if (currentY <= 60 || mobileMenuOpen) {
                        setIsNavVisible(true);
                    } else if (currentY > 0 && currentY < maxScroll) {
                        if (diff > 10) {
                            setIsNavVisible(false);
                        } else if (diff < -5) {
                            setIsNavVisible(true);
                        }
                    }

                    lastY = currentY <= 0 ? 0 : currentY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [mobileMenuOpen]);

    useSectionObserver();
    useScrollDepthTracking();

    /* Active section via IntersectionObserver */
    useEffect(() => {
        const sectionIds = ['hero', 'about', 'projects', 'skills', 'certifications', 'experience', 'contact'];
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
        'ONLINE | EMBEDDED SYSTEMS & INDUSTRIAL AUTOMATION',
        'FOCUS | PLC, CODESYS & CONTROL SYSTEMS',
        'SYNC | ESP32, IOT & SMART ENERGY',
        'MODE | SHIPPING REAL-WORLD ENGINEERING PROJECTS',
    ];

    const navItems = ['About', 'Projects', 'Skills', 'Certifications', 'Experience', 'Contact'];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
        e.preventDefault();
        const id = item.toLowerCase();
        if (id === 'contact') {
            triggerChatbotWarmup({ source: 'nav_contact_click' });
        }
        trackInteraction('nav_click', 'navigation', item);
        const el = document.getElementById(id);
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); window.history.pushState(null, '', `#${id}`); }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
            <EasterEgg />
            <SEO
                title="Srinivasa Manikanta Rajapantula (RSMK) – Portfolio | Embedded Systems, Industrial Automation & IoT"
                description="Portfolio of Srinivasa Manikanta Rajapantula (RSMK) — Electrical & Electronics Engineering Student at ALIET (Andhra Loyola Institute of Engineering and Technology) specializing in Embedded Systems, Industrial Automation (PLC, CODESYS, Factory I/O, Modbus TCP), IoT, and Smart Energy in Vijayawada, India."
                url="/"
            />

            <div id="main-content" className="main-content visible">
                <PCBBackground isPowered={isPowered} />

                {/* Right-rail Oscilloscope Scroll Depth Gauge */}
                {!reduced && !isMobile && (
                    <div className="fixed right-4 bottom-10 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-none">
                        <span className={`text-[9px] font-mono tracking-[0.22em] uppercase [writing-mode:vertical-rl] ${isPowered ? 'text-cyan-400/80' : 'text-amber-400/80'}`}>
                            depth
                        </span>
                        <div className={`h-28 w-1 rounded-full overflow-hidden origin-bottom border ${isPowered ? 'bg-cyan-950/70 border-cyan-900/60' : 'bg-amber-950/60 border-amber-900/50'}`}>
                            <motion.div
                                className={`w-full h-full origin-bottom ${
                                    isPowered
                                        ? 'bg-gradient-to-t from-cyan-400 via-cyan-300 to-white'
                                        : 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-200'
                                }`}
                                style={{ scaleY: scrollYProgress }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Floating Telemetry Navbar ─────────────────────────── */}
                <header
                    className={`!fixed fixed top-3 md:top-4 left-3 right-3 md:left-4 md:right-4 z-50 flex justify-between items-center px-4 md:px-5 py-2.5 md:py-3 rounded-xl
                        ${isNavVisible || mobileMenuOpen
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-28 opacity-0 pointer-events-none'
                        }
                        ${scrolled
                            ? 'liquid-glass-header pointer-events-none'
                            : 'bg-black/45 backdrop-blur-md border border-zinc-800/80 pointer-events-none'
                        }`}
                    style={{
                        transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
                    }}
                >
                    {/* Brand & Power-Rail Toggle Switch */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xl font-black tracking-tighter transition-all duration-500 ${
                                        isPowered
                                            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.65)]'
                                            : 'text-amber-400'
                                    }`}
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    RSMK
                                </span>
                                <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded border border-zinc-800 bg-black/70 text-zinc-400">
                                    EEE-SYS
                                </span>
                            </div>

                            <button
                                type="button"
                                aria-pressed={isPowered}
                                onClick={() => {
                                    setIsPowered(!isPowered);
                                    trackInteraction('toggle_power_grid', 'header', isPowered ? 'OFFLINE' : 'ONLINE');
                                }}
                                className={`flex items-center gap-1.5 mt-0.5 px-2 py-0.5 -ml-1 rounded border transition-colors cursor-pointer group ${
                                    isPowered
                                        ? 'border-cyan-500/25 bg-cyan-950/30 hover:border-cyan-400/50 hover:bg-cyan-950/50'
                                        : 'border-amber-500/35 bg-amber-950/30 hover:border-amber-400/60 hover:bg-amber-950/50'
                                }`}
                                title={`Click to switch power grid (Currently: ${isPowered ? 'ONLINE' : 'STANDBY'})`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        isPowered
                                            ? 'bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.9)]'
                                            : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]'
                                    }`}
                                />
                                <Power size={10} className={isPowered ? 'text-cyan-300' : 'text-amber-300'} />
                                <span
                                    className={`text-[10px] font-mono tracking-widest transition-colors ${
                                        isPowered ? 'text-cyan-300' : 'text-amber-300'
                                    }`}
                                >
                                    {isPowered ? 'ONLINE' : 'STANDBY'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-6 pointer-events-auto" aria-label="Main navigation">
                        {navItems.map((item) => {
                            const sectionId = item.toLowerCase();
                            const isActive = activeSection === sectionId;

                            return (
                                <a
                                    key={item}
                                    href={`#${sectionId}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    onMouseEnter={() => {
                                        const currentIndex = navItems.indexOf(item);
                                        if (navHoverIndex !== -1) {
                                            setNavDirection(currentIndex >= navHoverIndex ? 1 : -1);
                                        }
                                        setNavHoverIndex(currentIndex);
                                    }}
                                    className={`relative text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded cursor-pointer pb-1 ${
                                        isActive
                                            ? isPowered
                                                ? 'text-cyan-300'
                                                : 'text-amber-300'
                                            : 'text-zinc-300 hover:text-white'
                                    }`}
                                >
                                    {item}
                                    <motion.span
                                        className={`absolute bottom-0 left-0 h-px ${isPowered ? 'bg-cyan-400' : 'bg-amber-400'}`}
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
                        <Link
                            to="/gallery"
                            className="relative text-[11px] font-semibold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded cursor-pointer pb-1"
                        >
                            Gallery
                        </Link>
                        <Link
                            to="/automation"
                            className="relative text-[11px] font-semibold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded cursor-pointer pb-1 flex items-center gap-1.5"
                        >
                            <span>Automation</span>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPowered ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                        </Link>
                        <div className="w-px h-5 bg-zinc-800 mx-1" />
                        <div className="flex items-center gap-2.5 pointer-events-auto">
                            {clockTime && (
                                <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-black/60 text-[10px] font-mono text-zinc-300 tracking-wider">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                    {clockTime}
                                </span>
                            )}
                            <a
                                href={PROFILE.resume}
                                target="_blank"
                                rel="noreferrer"
                                title="View Resume"
                                onClick={() => trackInteraction('view_resume', 'resume', 'Header')}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/45 bg-amber-950/20 text-amber-300 text-[11px] font-mono font-bold rounded-lg hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            >
                                <Eye size={12} />
                                <span>RESUME</span>
                            </a>
                        </div>
                    </nav>

                    {/* Mobile burger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        className="lg:hidden pointer-events-auto p-2 text-zinc-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
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
                            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-2"
                        >
                            {navItems.map((item, i) => (
                                <motion.a
                                    key={item}
                                    initial={reduced ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className="text-3xl font-black uppercase tracking-tight text-white hover:text-amber-400 transition-colors duration-200 py-3 cursor-pointer focus:outline-none focus-visible:text-amber-400"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                            >
                                <Link
                                    to="/gallery"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-3xl font-black uppercase tracking-tight text-white hover:text-amber-400 transition-colors duration-200 py-3 cursor-pointer focus:outline-none focus-visible:text-amber-400 block"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    Gallery
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (navItems.length + 1) * 0.06, duration: 0.3 }}
                            >
                                <Link
                                    to="/automation"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-3xl font-black uppercase tracking-tight text-white hover:text-cyan-400 transition-colors duration-200 py-3 cursor-pointer focus:outline-none focus-visible:text-cyan-400 block"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    Automation Videos
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (navItems.length + 2) * 0.06, duration: 0.3 }}
                                className="mt-4 flex items-center gap-3"
                            >
                                <a
                                    href={PROFILE.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackInteraction('view_resume', 'resume', 'MobileMenu')}
                                    className="flex items-center gap-2 px-6 py-3 border border-amber-500/50 text-amber-300 font-bold rounded-xl hover:bg-amber-500/10 transition-all duration-200 cursor-pointer"
                                >
                                    <Eye size={16} />
                                    <span>VIEW RESUME</span>
                                </a>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="container mx-auto px-4 md:px-6 pt-0 overflow-x-hidden max-w-7xl">

                    <AnimatePresence>
                        {!reduced && showBackToTop && !isMobile && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 14 }}
                                transition={{ duration: 0.2 }}
                                className="fixed bottom-8 left-6 z-40 w-11 h-11 rounded-full border border-amber-600/60 bg-black/80 backdrop-blur-sm flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-400 transition-colors cursor-pointer"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                aria-label="Scroll to top"
                                type="button"
                                data-cursor-label="BACK"
                            >
                                <svg width="38" height="38" className="absolute -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
                                    <circle cx="16" cy="16" r="14" stroke="rgba(0,242,255,0.15)" strokeWidth="2" fill="none" />
                                    <motion.circle
                                        cx="16"
                                        cy="16"
                                        r="14"
                                        stroke="#ffae00"
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
                    <section id="hero" data-clarity-region="hero" className="min-h-[100dvh] flex flex-col items-center justify-center relative pt-24 pb-14 text-center">
                        {/* Precision Hardware Fiducial Frame (Desktop) */}
                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 md:inset-x-6 top-24 bottom-10 hidden md:block">
                            <div className={`absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 ${isPowered ? 'border-cyan-500/40' : 'border-amber-500/40'}`} />
                            <div className={`absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 ${isPowered ? 'border-cyan-500/40' : 'border-amber-500/40'}`} />
                            <div className={`absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 ${isPowered ? 'border-cyan-500/40' : 'border-amber-500/40'}`} />
                            <div className={`absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 ${isPowered ? 'border-cyan-500/40' : 'border-amber-500/40'}`} />
                            <span className="absolute top-1.5 left-9 text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                                SYS.CORE // ALIET_EEE
                            </span>
                            <span className="absolute top-1.5 right-9 text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                                {isPowered ? 'V_BUS: 24.0V DC' : 'V_BUS: 3.3V STBY'}
                            </span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-7 max-w-4xl mx-auto w-full px-4">

                            {/* Live Instrument Telemetry Strip */}
                            <motion.div
                                initial={reduced ? false : { opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[10px] md:text-[11px] font-mono tracking-[0.18em] uppercase ${
                                    isPowered
                                        ? 'border-cyan-500/30 bg-black/65 text-cyan-300 shadow-[0_0_20px_rgba(0,242,255,0.1)]'
                                        : 'border-amber-500/35 bg-black/75 text-amber-300'
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isPowered
                                            ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.9)]'
                                            : 'bg-amber-400'
                                    }`}
                                />
                                <span>{isPowered ? statusTicker[statusTickerIndex] : 'STANDBY | LOW-POWER TELEMETRY RAIL'}</span>
                            </motion.div>

                            {/* ── Avatar Oscilloscope Assembly ── */}
                            <motion.div
                                initial={reduced ? false : { scale: 0.84, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                className="relative flex items-center justify-center my-1"
                                style={{ width: 204, height: 204 }}
                            >
                                {/* Outer dashed ring */}
                                {!reduced && !isMobile && (
                                    <div
                                        className={`absolute rounded-full border-2 border-dashed pointer-events-none hidden md:block animate-[spin_28s_linear_infinite] ${
                                            isPowered ? 'border-cyan-500/25' : 'border-amber-500/25'
                                        }`}
                                        style={{ width: 264, height: 264 }}
                                    />
                                )}
                                {/* Inner ring with calibrated cardinal ticks */}
                                {!reduced && !isMobile && (
                                    <div
                                        className={`absolute rounded-full border pointer-events-none hidden md:block animate-spin-reverse ${
                                            isPowered ? 'border-cyan-500/35' : 'border-amber-500/35'
                                        }`}
                                        style={{ width: 230, height: 230, animationDuration: '14s' }}
                                    >
                                        {[0, 90, 180, 270].map((deg) => (
                                            <div
                                                key={deg}
                                                className={`absolute ${isPowered ? 'bg-cyan-400/75' : 'bg-amber-400/75'}`}
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
                                    </div>
                                )}
                                {/* Orbiting zap */}
                                {!reduced && !isMobile && (
                                    <div
                                        className="absolute pointer-events-none hidden md:block animate-[spin_9s_linear_infinite]"
                                        style={{ width: 244, height: 244 }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <Zap
                                                size={18}
                                                className={
                                                    isPowered
                                                        ? 'text-cyan-400 fill-cyan-400/30 drop-shadow-[0_0_6px_rgba(0,242,255,0.8)]'
                                                        : 'text-amber-400 fill-amber-400/30'
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Floating tech orbit icons */}
                                {!reduced && !isMobile && isPowered && (
                                    <>
                                        <div
                                            className="absolute pointer-events-none hidden md:block animate-[spin_22s_linear_infinite]"
                                            style={{ width: 294, height: 294 }}
                                        >
                                            <div className="w-full h-full relative">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-75">
                                                    <Cpu size={14} className="text-cyan-300" />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute pointer-events-none hidden md:block animate-[spin_17s_linear_infinite]"
                                            style={{ width: 314, height: 314 }}
                                        >
                                            <div className="w-full h-full relative" style={{ transform: 'rotate(72deg)' }}>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65">
                                                    <Radio size={13} className="text-purple-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute pointer-events-none hidden md:block animate-[spin_25s_linear_infinite]"
                                            style={{ width: 334, height: 334 }}
                                        >
                                            <div className="w-full h-full relative" style={{ transform: 'rotate(144deg)' }}>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70">
                                                    <BatteryMedium size={13} className="text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute pointer-events-none hidden md:block animate-[spin_14s_linear_infinite]"
                                            style={{ width: 284, height: 284 }}
                                        >
                                            <div className="w-full h-full relative" style={{ transform: 'rotate(216deg)' }}>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-75">
                                                    <Code size={13} className="text-amber-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute pointer-events-none hidden md:block animate-[spin_19s_linear_infinite]"
                                            style={{ width: 354, height: 354 }}
                                        >
                                            <div className="w-full h-full relative" style={{ transform: 'rotate(288deg)' }}>
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65">
                                                    <Activity size={14} className="text-cyan-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* Profile image */}
                                <div
                                    className={`relative w-48 h-48 rounded-full overflow-hidden border-2 bg-black z-10 transition-colors duration-500 group ${
                                        isPowered
                                            ? 'border-cyan-400/45 shadow-[0_0_60px_rgba(0,242,255,0.2),inset_0_0_30px_rgba(0,242,255,0.08)] hover:border-cyan-300'
                                            : 'border-amber-400/45 shadow-[0_0_40px_rgba(251,191,36,0.14)] hover:border-amber-300'
                                    }`}
                                >
                                    <img
                                        src={PROFILE.image}
                                        alt="Srinivasa Manikanta Rajapantula (RSMK) — Electrical & Electronics Engineering Student at ALIET, Embedded Systems, Industrial Automation & IoT"
                                        title="Srinivasa Manikanta Rajapantula (RSMK) — Electrical & Electronics Engineering Student at ALIET"
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
                            <div className="space-y-3.5">
                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <h1
                                        className="w-fit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] flex flex-col items-center justify-center mx-auto max-w-full px-2"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                        data-cursor-label="HELLO!"
                                    >
                                        <span className="pb-1 sm:pb-2 text-white select-none">
                                            SRINIVASA
                                        </span>
                                        <span
                                            className={`pt-1 select-none transition-colors duration-500 ${
                                                isPowered ? 'text-cyan-400' : 'text-amber-400'
                                            }`}
                                            style={{
                                                textShadow: isPowered
                                                    ? '0 0 40px rgba(0,242,255,0.22)'
                                                    : '0 0 32px rgba(251,191,36,0.2)',
                                            }}
                                        >
                                            MANIKANTA
                                        </span>
                                        <span
                                            className="pt-1.5 sm:pt-2 text-zinc-200 text-3xl sm:text-5xl md:text-6xl lg:text-7xl select-none"
                                            style={{ textShadow: '0 0 36px rgba(255,255,255,0.08)' }}
                                        >
                                            RAJAPANTULA
                                        </span>
                                    </h1>
                                </motion.div>

                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col items-center gap-2.5"
                                >
                                    <h2 className="text-sm sm:text-base md:text-xl text-zinc-200 font-mono tracking-[0.22em] uppercase">
                                        RSMK | Electrical &amp; Electronics Engineer
                                    </h2>
                                    <p className="text-xs md:text-sm text-zinc-400 max-w-xl leading-relaxed">
                                        {PROFILE.heroSubtitle}
                                    </p>
                                </motion.div>

                                {/* Hero Quick Actions */}
                                <motion.div
                                    initial={reduced ? false : { opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.42, duration: 0.45 }}
                                    className="flex flex-wrap items-center justify-center gap-3 pt-2"
                                >
                                    <a
                                        href="#projects"
                                        onClick={(e) => handleNavClick(e, 'Projects')}
                                        className={`group flex items-center gap-2 px-5 py-2.5 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 ${
                                            isPowered
                                                ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_24px_rgba(0,242,255,0.3)] focus-visible:ring-cyan-300'
                                                : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)] focus-visible:ring-amber-300'
                                        }`}
                                    >
                                        <span>Inspect Hardware</span>
                                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </a>
                                    <a
                                        href="#contact"
                                        onClick={(e) => handleNavClick(e, 'Contact')}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 bg-black/50 backdrop-blur-sm text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:border-amber-400/60 hover:text-amber-300 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                    >
                                        <Terminal size={13} />
                                        <span>Open Comms</span>
                                    </a>
                                </motion.div>
                            </div>

                            {/* ── Scroll indicator ── */}
                            {!reduced && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, y: [0, 8, 0] }}
                                    transition={{ opacity: { delay: 1.0, duration: 0.4 }, y: { delay: 1.3, duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                                    className="flex flex-col items-center gap-1.5 mt-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
                                    aria-label="Scroll to about section"
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    type="button"
                                    data-cursor-label="SCROLL"
                                >
                                    <span className="text-[9px] font-mono text-amber-400/80 tracking-[0.25em] uppercase">Scroll // CH_01</span>
                                    <div className="w-px h-7 bg-gradient-to-b from-amber-400/70 to-transparent" />
                                    <ChevronDown size={14} className="text-amber-400/80" />
                                </motion.button>
                            )}
                        </div>
                    </section>

                    {/* ══ 2. ABOUT ═══════════════════════════════════════════ */}
                    <section id="about" data-clarity-region="about" className="py-20 md:py-24 max-w-6xl mx-auto">
                        <SectionHeader title="About Me" subtitle="Engineer Dossier" code="SEC_01 // PROFILE" isPowered={isPowered} />

                        <Reveal>
                            <div
                                className={`flex flex-col max-w-4xl mx-auto rounded-2xl border overflow-hidden relative backdrop-blur-md transition-colors duration-300 ${
                                    isPowered
                                        ? 'border-zinc-800 bg-[#0a0b0d]/85 shadow-[0_12px_40px_rgba(0,0,0,0.55)]'
                                        : 'border-amber-500/25 bg-[#0a0a09]/90 shadow-[0_12px_36px_rgba(0,0,0,0.5)]'
                                }`}
                            >
                                {/* Circuit texture bg */}
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415 1.415-.828.828z' fill='%2306b6d4' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                                />

                                {/* Chassis Header Strip with Mounting Pads */}
                                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-5 md:px-8 py-3 border-b border-zinc-800/90 bg-zinc-950/90 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full border border-zinc-700 bg-zinc-900" aria-hidden="true" />
                                        <span className={isPowered ? 'text-cyan-300' : 'text-amber-300'}>
                                            MODULE: ENGINEER_PROFILE
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span>LOC: VIJAYAWADA_IN</span>
                                        <span className="w-2 h-2 rounded-full border border-zinc-700 bg-zinc-900" aria-hidden="true" />
                                    </div>
                                </div>

                                {/* Bio Content */}
                                <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col items-center w-full space-y-8">
                                    <motion.div
                                        initial={reduced ? false : { opacity: 0, y: 18 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, ease: 'easeOut' }}
                                        className="space-y-6 flex flex-col items-center w-full"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                                            <StatChip icon={<Cpu size={16} />} label="Specialty" value="Embedded / Automation" delay={0.05} isPowered={isPowered} />
                                            <StatChip icon={<MapPin size={16} />} label="Location" value="Vijayawada, AP" delay={0.1} isPowered={isPowered} />
                                            <StatChip icon={<Briefcase size={16} />} label="Experience" value="Industrial Intern" delay={0.15} isPowered={isPowered} />
                                            <StatChip icon={<GraduationCap size={16} />} label="Degree" value="B.Tech EEE" delay={0.2} isPowered={isPowered} />
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-3">
                                            <a
                                                href="#projects"
                                                onClick={(e) => handleNavClick(e, 'Projects')}
                                                className="btn-ripple group flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:bg-amber-300 hover:shadow-[0_0_26px_rgba(255,174,0,0.45)] transition-all duration-250 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                            >
                                                <span>View Projects</span>
                                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                            </a>
                                            <a
                                                href={PROFILE.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() => trackInteraction('view_resume', 'resume', 'Hero')}
                                                className={`btn-ripple group flex items-center gap-2 px-5 py-2.5 border text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-250 backdrop-blur-sm bg-black/40 cursor-pointer focus:outline-none focus-visible:ring-2 ${
                                                    isPowered
                                                        ? 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 focus-visible:ring-cyan-400'
                                                        : 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 focus-visible:ring-amber-400'
                                                }`}
                                            >
                                                <Eye size={13} className="group-hover:scale-110 transition-transform duration-200" />
                                                <span>View Resume</span>
                                            </a>
                                            <a
                                                href="#contact"
                                                onClick={(e) => handleNavClick(e, 'Contact')}
                                                className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider rounded-lg hover:border-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-950/20 transition-all duration-250 backdrop-blur-sm bg-black/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                            >
                                                <Terminal size={13} />
                                                <span>Initialize Comms</span>
                                            </a>
                                        </div>
                                    </motion.div>

                                    <div
                                        className={`space-y-4 text-sm md:text-[15px] leading-relaxed text-zinc-200 max-w-3xl text-left pl-4 md:pl-5 border-l-2 ${
                                            isPowered ? 'border-cyan-500/45' : 'border-amber-500/45'
                                        }`}
                                        style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
                                    >
                                        <p>
                                            I’m <span className="text-white font-semibold">Srinivasa Manikanta Rajapantula (RSMK)</span>, an Electrical &amp; Electronics Engineering student based in{' '}
                                            <span className={isPowered ? 'text-cyan-300 font-medium' : 'text-amber-300 font-medium'}>
                                                Vijayawada, Andhra Pradesh, India
                                            </span>{' '}
                                            (with diploma education background from Government Polytechnic Srikakulam). My core engineering work focuses on{' '}
                                            <span className={isPowered ? 'text-cyan-300 font-medium' : 'text-amber-300 font-medium'}>
                                                Electrical Engineering, Embedded Systems, Industrial Automation (PLC Programming, CODESYS, Factory I/O, Modbus TCP), IoT, Smart Energy Systems, and Control Engineering
                                            </span>.
                                        </p>
                                        <p>
                                            Over the years, I have built real-world engineering hardware prototypes and control simulations ranging from wearable safety devices (SFMD) and 3D industrial sorting lines to solar trackers and agricultural robotics. I utilize Web Development as a supporting skill to create low-latency telemetry dashboards, responsive operator control interfaces, and calculation software for hardware systems.
                                        </p>
                                        <p>
                                            Through my industrial internship at Coromandel International Limited, I gained hands-on field experience with 11kV distribution networks, steam turbine thermodynamic analysis, induction motor diagnostics, and ISO 50001 energy management. I also leverage AI tools and modern workflows to accelerate system design, rapidly prototype software interfaces, and automate repetitive tasks while maintaining strict engineering rigor.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>

                    {/* ══ 3. PROJECTS ════════════════════════════════════════ */}
                    <section id="projects" ref={projectsSectionRef} data-clarity-region="projects" className="mb-24 md:mb-36 relative">
                        <SectionHeader title="Projects" subtitle="IC Module Showcase" code="SEC_02 // HARDWARE & SIM" isPowered={isPowered} />

                        {/* Instrument Controls Bar (Telemetry + Pause/Play + Arrows) */}
                        <div className="flex flex-wrap justify-between items-center gap-3 max-w-7xl mx-auto px-4 -mt-6 md:-mt-8 mb-6 relative z-30">
                            <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        !isPowered
                                            ? 'bg-amber-400'
                                            : isProjectsPaused
                                                ? 'bg-amber-400'
                                                : 'bg-cyan-400 animate-pulse'
                                    }`}
                                />
                                <span>MODULES: {PROJECTS.length} UNITS</span>
                                <span className="hidden sm:inline text-zinc-400">
                                    // {!isPowered ? 'STANDBY_HOLD' : isProjectsPaused ? 'SCAN_PAUSED' : 'AUTO_SCAN_ACTIVE'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setIsProjectsPaused(!isProjectsPaused)}
                                    className={`px-3 py-2 border rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
                                        isProjectsPaused
                                            ? 'border-amber-500/50 bg-amber-950/30 text-amber-300 hover:border-amber-400'
                                            : 'border-zinc-800 bg-black/60 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-zinc-300 hover:text-cyan-300'
                                    }`}
                                    title={isProjectsPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                                    aria-label={isProjectsPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                                >
                                    {isProjectsPaused ? (
                                        <>
                                            <Play size={14} strokeWidth={2.5} />
                                            <span className="hidden sm:inline">RESUME</span>
                                        </>
                                    ) : (
                                        <>
                                            <Pause size={14} strokeWidth={2.5} />
                                            <span className="hidden sm:inline">PAUSE</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollProjects('left')}
                                    className="p-2 border border-zinc-800 bg-black/60 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-zinc-300 hover:text-cyan-300 rounded-lg transition-all cursor-pointer"
                                    title="Scroll Left"
                                    aria-label="Scroll projects left"
                                >
                                    <ChevronLeft size={16} strokeWidth={2.5} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollProjects('right')}
                                    className="p-2 border border-zinc-800 bg-black/60 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-zinc-300 hover:text-cyan-300 rounded-lg transition-all cursor-pointer"
                                    title="Scroll Right"
                                    aria-label="Scroll projects right"
                                >
                                    <ChevronRight size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Carousel Container - Infinite Scrolling Marquee */}
                        <div className="relative w-full overflow-hidden py-4 select-none">
                            {/* Subtle Edge Vignettes */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-14 bg-gradient-to-r from-[#080806] to-transparent z-20" />
                            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-14 bg-gradient-to-l from-[#080806] to-transparent z-20" />

                            <div
                                ref={projectsScrollRef}
                                onTouchStart={handleTouchStartProjects}
                                onTouchMove={handleTouchMoveProjects}
                                onTouchEnd={handleTouchEndProjects}
                                className="flex gap-6 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing px-4 md:px-8"
                                onMouseEnter={() => setIsHoveredProjects(true)}
                                onMouseLeave={() => {
                                    setIsHoveredProjects(false);
                                    handleMouseLeaveOrUpProjects();
                                }}
                                onMouseDown={handleMouseDownProjects}
                                onMouseUp={handleMouseLeaveOrUpProjects}
                                onMouseMove={handleMouseMoveProjects}
                            >
                                {PROJECTS.map((proj) => (
                                    <div key={`${proj.id}-1`} className="w-[310px] md:w-[380px] flex-shrink-0">
                                        <ProjectChip project={proj} isPowered={isPowered} onOpenDetails={setSelectedProject} />
                                    </div>
                                ))}
                                {/* Duplicate for seamless infinite loop */}
                                {PROJECTS.map((proj) => (
                                    <div key={`${proj.id}-2`} className="w-[310px] md:w-[380px] flex-shrink-0">
                                        <ProjectChip project={proj} isPowered={isPowered} onOpenDetails={setSelectedProject} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ══ 4. SKILLS ══════════════════════════════════════════ */}
                    <section id="skills" data-clarity-region="skills" className="mb-24 md:mb-36">
                        <SkillBreadboard isPowered={isPowered} />
                    </section>

                    {/* ══ 5. CERTIFICATIONS ══════════════════════════════════ */}
                    <section id="certifications" data-clarity-region="certifications" className="mb-24 md:mb-36 contain-paint" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1200px' /* content-visibility contain-intrinsic-size */ }}>
                        <CertificationsBlock isPowered={isPowered} />
                    </section>

                    {/* ══ 6. EXPERIENCE / TIMELINE ═══════════════════════════ */}
                    <section id="experience" data-clarity-region="experience" className="mb-24 md:mb-36">
                        <SectionHeader title="Timeline" subtitle="Engineering Trajectory" code="SEC_05 // LOG" isPowered={isPowered} flip />
                        <TimelineSystem experience={EXPERIENCE} education={EDUCATION} isPowered={isPowered} />
                    </section>

                    {/* ══ 7. CONTACT ══════════════════════════════════════════ */}
                    <section id="contact" data-clarity-region="contact" className="mb-20 max-w-6xl mx-auto">
                        <SectionHeader title="Contact" subtitle="Establish Uplink" code="SEC_06 // UART" isPowered={isPowered} />
                        <ContactInterface profile={PROFILE} isPowered={isPowered} />
                    </section>

                    {/* ══ FOOTER ═══════════════════════════════════════════════ */}
                    <footer className="py-14 border-t border-zinc-800/80 relative">
                        {/* Gold-finger bus termination accent strip */}
                        <div aria-hidden="true" className="flex justify-center gap-1.5 -mt-14 mb-10">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((pin) => (
                                <span
                                    key={pin}
                                    className={`w-4 h-1 rounded-b ${isPowered ? 'bg-amber-400/50' : 'bg-amber-500/35'}`}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-8">
                            {/* Brand mark */}
                            <div className="flex flex-col items-center gap-1">
                                <span
                                    className={`text-2xl font-black tracking-tighter ${isPowered ? 'text-cyan-400' : 'text-amber-400'}`}
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        textShadow: isPowered ? '0 0 20px rgba(0,242,255,0.4)' : '0 0 16px rgba(251,191,36,0.25)',
                                    }}
                                >
                                    RSMK
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400 tracking-[0.2em]">
                                    SRINIVASA MANIKANTA // ENGINEER
                                </span>
                            </div>

                            {/* Nav links */}
                            <nav className="flex items-center gap-5 flex-wrap justify-center" aria-label="Footer navigation">
                                {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={(e) => handleNavClick(e, item)}
                                        className="text-[10px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors duration-200 tracking-widest uppercase cursor-pointer focus:outline-none focus-visible:text-cyan-400"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <Link
                                    to="/gallery"
                                    className="text-[10px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors duration-200 tracking-widest uppercase cursor-pointer focus:outline-none focus-visible:text-cyan-400"
                                >
                                    Gallery
                                </Link>
                                <Link
                                    to="/automation"
                                    className="text-[10px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors duration-200 tracking-widest uppercase cursor-pointer focus:outline-none focus-visible:text-cyan-400"
                                >
                                    Automation
                                </Link>
                            </nav>

                            {/* Status pill */}
                            <div className="flex flex-col items-center gap-2.5">
                                {isPowered && clockTime && (
                                    <div className="font-mono text-[11px] text-cyan-300/80 tracking-[0.15em]">
                                        {clockTime}
                                    </div>
                                )}
                                {isPowered && (
                                    <motion.div
                                        animate={{ scale: [1, 1.06, 1] }}
                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                        className="flex items-center gap-1.5"
                                    >
                                        <span
                                            className="text-amber-400"
                                            style={{ filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.7))' }}
                                        >
                                            ⚡
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-300 tracking-widest uppercase">
                                            Energy Active
                                        </span>
                                    </motion.div>
                                )}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-zinc-800 rounded-full backdrop-blur-sm">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            isPowered
                                                ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                                : 'bg-amber-400'
                                        }`}
                                    />
                                    <span className="text-[10px] text-zinc-300 font-mono tracking-widest">
                                        {isPowered ? 'SYSTEM_ONLINE' : 'SYSTEM_STANDBY'} // {new Date().getFullYear()}
                                    </span>
                                </div>
                                {isPowered && (
                                    <div className="flex items-end gap-1 h-4">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 rounded-sm bg-cyan-400/75"
                                                animate={{ height: [3, 8 + i * 2, 4] }}
                                                transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, repeatType: 'mirror' }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <p className="text-[10px] text-zinc-400 font-mono">
                                    Built with precision &mdash; {PROFILE.location}
                                </p>
                            </div>
                        </div>
                    </footer>

                </main>
            </div>

            {/* Project Datasheet Modal Host */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal
                        project={selectedProject}
                        isPowered={isPowered}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
