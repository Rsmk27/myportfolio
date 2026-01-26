
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PCBBackground } from '../components/PCBBackground';
import { PowerSwitch } from '../components/PowerSwitch';
import { ProjectChip } from '../components/ProjectChip';
import { SkillBreadboard } from '../components/SkillBreadboard';
import { CertificationsBlock } from '../components/CertificationsBlock';
import { ExperienceTimeline } from '../components/ExperienceTimeline';
import { EducationBlock } from '../components/EducationBlock';
import { ContactInterface } from '../components/ContactInterface';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '../constants';
import { Cpu, Terminal, Zap, Info, Briefcase, GraduationCap, Send, Menu, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
    const [isPowered, setIsPowered] = useState(() => {
        // Initialize from session storage to persist state during navigation
        const saved = sessionStorage.getItem('isPowered');
        return saved === 'true';
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isFirstMount = React.useRef(true);

    useEffect(() => {
        sessionStorage.setItem('isPowered', isPowered.toString());

        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }


    }, [isPowered]);

    const navItems = ['Projects', 'Skills', 'Experience', 'Education', 'Contact'];

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30">
            <Helmet>
                <title>{PROFILE.name} | Volt Engineer</title>
                <meta name="description" content={PROFILE.tagline} />
                <meta property="og:title" content={`${PROFILE.name} - Portfolio`} />
                <meta property="og:description" content={PROFILE.bio} />
                <meta property="og:image" content={PROFILE.image} />
            </Helmet>
            <PCBBackground isPowered={isPowered} />

            {/* Header Overlay */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <div className="flex flex-col">
                    <h1 className={`text-2xl font-black tracking-tighter transition-all duration-500 ${isPowered ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'text-gray-800'}`}>
                        {PROFILE.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-cyan-500 animate-ping' : 'bg-gray-800'}`} />
                        <span className={`text-[10px] font-mono ${isPowered ? 'text-cyan-600' : 'text-gray-800'}`}>
                            SYS_STATUS: {isPowered ? 'OPERATIONAL' : 'OFFLINE'}
                        </span>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-8 pointer-events-auto transition-all duration-500">
                    {navItems.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`text-[11px] font-bold uppercase tracking-widest transition-all hover:text-cyan-400 ${isPowered ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden pointer-events-auto p-2 text-gray-500 hover:text-cyan-400 transition-all duration-500 z-50"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Mobile Navigation Overlay */}
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
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-2xl font-black uppercase tracking-tighter ${isPowered ? 'text-white' : 'text-gray-400'} hover:text-cyan-500 transition-colors`}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-24 md:pb-32 overflow-x-hidden">
                {/* Hero Section */}
                <section className="min-h-[calc(100vh-8rem)] md:min-h-[85vh] flex flex-col items-center justify-center text-center mb-24 md:mb-32 relative">

                    {/* CPU Core Animation */}
                    <div className="relative mb-8 md:mb-12 group">
                        {/* Outer rotating rings - Only visible when powered */}
                        {isPowered && (
                            <>
                                <div className="absolute inset-[-30px] md:inset-[-40px] border border-cyan-500/20 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }} />
                                <div className="absolute inset-[-15px] md:inset-[-20px] border-2 border-dashed border-cyan-500/30 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                            </>
                        )}

                        {/* Main Profile Container */}
                        <div className={`relative z-10 w-40 h-40 md:w-64 md:h-64 rounded-full p-2 transition-all duration-700 ${isPowered ? 'bg-cyan-950/20' : 'bg-transparent'}`}>
                            {/* Inner Glowing Rim */}
                            <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${isPowered ? 'border-cyan-500 shadow-[0_0_50px_rgba(0,242,255,0.4)]' : 'border-[#1a1a1a]'}`} />

                            {/* The Image */}
                            <div className="w-full h-full rounded-full overflow-hidden relative z-20">
                                {PROFILE.image && (
                                    <img
                                        src={PROFILE.image}
                                        alt={PROFILE.name}
                                        className={`w-full h-full object-cover transition-all duration-700 ${isPowered ? 'grayscale-0 scale-100' : 'grayscale scale-110 opacity-50'}`}
                                    />
                                )}
                            </div>

                            {/* Tech overlays */}
                            {isPowered && (
                                <div className="absolute inset-0 z-30 pointer-events-none">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-black px-2 text-[10px] text-cyan-500 font-mono border border-cyan-900">SYS_CORE</div>
                                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-cyan-900/30 to-transparent rounded-full mix-blend-overlay" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Title Block */}
                    <div className="relative z-20 max-w-4xl min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
                        <AnimatePresence mode='wait'>
                            {isPowered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="mb-6 flex flex-col items-center">
                                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-2 relative">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                                                {PROFILE.name.split(' ')[0]}
                                            </span>
                                            <br />
                                            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                                                {PROFILE.name.split(' ')[1]}
                                            </span>
                                        </h1>
                                        <div className="h-1 w-24 md:w-32 mt-4 rounded-full bg-cyan-500 shadow-[0_0_10px_#00f2ff]" />
                                    </div>

                                    <p className="text-base md:text-xl font-mono mb-4 max-w-xs md:max-w-2xl mx-auto leading-relaxed text-gray-400">
                                        {PROFILE.tagline}
                                    </p>
                                    {PROFILE.heroSubtitle && (
                                        <p className="text-xs md:text-base font-mono mb-10 max-w-xs md:max-w-xl mx-auto leading-relaxed text-gray-500 px-4">
                                            {PROFILE.heroSubtitle}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>



                        {/* Stats Bar and CTAs - Only visible when powered */}
                        {isPowered && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center gap-8 mt-8 md:mt-12 w-full"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4">
                                    {[
                                        { label: "ROLE", val: "ENGINEER" },
                                        { label: "STACK", val: "FULL_CYCLE" },
                                        { label: "LOC", val: "INDIA" },
                                        { label: "MODE", val: "CREATIVE" }
                                    ].map((stat, i) => (
                                        <div key={i} className="px-2 md:px-4 py-2 border-l border-gray-800 text-left">
                                            <div className="text-[9px] text-gray-600 font-mono mb-1">{stat.label}</div>
                                            <div className="text-xs font-bold text-gray-300">{stat.val}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 w-full px-4">
                                    <a href="#projects" className="flex-1 md:flex-none px-6 md:px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-xs md:text-sm bg-cyan-500 text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all text-center">
                                        View Projects
                                    </a>
                                    <a href="#contact" className="flex-1 md:flex-none px-6 md:px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-xs md:text-sm border border-cyan-500 text-cyan-400 hover:bg-cyan-950/30 transition-all text-center">
                                        Contact Me
                                    </a>
                                    <a href="#" className="hidden md:flex items-center gap-2 px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-xs md:text-sm border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all text-center">
                                        <span>Resume</span>
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* About Me Section - TERMINAL_LOG_STYLE */}
                <section className="mb-24 md:mb-40 max-w-6xl mx-auto">
                    <SectionHeader title="MISSION_STATEMENT" subtitle="KERNEL_OBJECTIVE" isPowered={isPowered} flip />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                        {/* Left Column: Core Focus */}
                        <div className="lg:col-span-4 order-2 lg:order-1">
                            <div className={`h-full p-6 border-2 border-dashed transition-colors duration-500 ${isPowered ? 'border-gray-800 bg-[#080808]' : 'border-gray-900 bg-transparent'}`}>
                                <h3 className={`text-sm font-black uppercase tracking-widest mb-8 ${isPowered ? 'text-white' : 'text-gray-700'}`}>
                                     // CORE_FOCUS_AREAS
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        "Embedded Systems & IoT",
                                        "Smart Energy & Green Tech",
                                        "Intelligent Software Platforms",
                                        "Automation & AI Integration"
                                    ].map((focus, i) => (
                                        <div key={i} className="group cursor-default">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-1.5 h-1.5 transition-all duration-300 ${isPowered ? 'bg-cyan-500 group-hover:scale-150' : 'bg-gray-800'}`} />
                                                <span className={`text-xs md:text-sm font-bold uppercase transition-colors ${isPowered ? 'text-gray-300 group-hover:text-cyan-400' : 'text-gray-600'}`}>
                                                    {focus}
                                                </span>
                                            </div>
                                            {isPowered && <div className="h-[1px] w-0 group-hover:w-full bg-cyan-900/50 transition-all duration-700" />}
                                        </div>
                                    ))}
                                </div>

                                {/* Decorative Code Block */}
                                <div className="mt-12 pt-8 border-t border-gray-900 opacity-60">
                                    <div className="text-[10px] font-mono text-gray-600 space-y-1">
                                        <p>while(true) {`{`}</p>
                                        <p>&nbsp;&nbsp;learn();</p>
                                        <p>&nbsp;&nbsp;build();</p>
                                        <p>&nbsp;&nbsp;optimize();</p>
                                        <p>{`}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Narrative */}
                        <div className={`lg:col-span-8 order-1 lg:order-2 relative p-6 md:p-12 border-l-2 transition-all duration-700 ${isPowered ? 'border-cyan-500 bg-cyan-950/5' : 'border-gray-800 bg-transparent'}`}>
                            {/* Decorative scanline */}
                            {isPowered && (
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20"
                                    animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            )}

                            <div className="space-y-6 relative z-10">
                                <p className={`text-sm md:text-lg leading-relaxed font-mono transition-colors ${isPowered ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span className="text-cyan-600 font-bold mr-2">&gt;</span>
                                    I am an Electrical & Electronics Engineering student with a deep interest in designing <span className={isPowered ? "text-cyan-400" : ""}>intelligent, real-world systems</span> that integrate hardware, software, and energy infrastructure. My work focuses on building practical solutions across Embedded Systems, IoT, Smart Energy, and Green Technology.
                                </p>

                                <p className={`text-sm md:text-lg leading-relaxed font-mono transition-colors ${isPowered ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span className="text-cyan-600 font-bold mr-2">&gt;</span>
                                    From developing embedded controllers and IoT platforms to building full-stack software systems, I approach every project with a <span className={isPowered ? "text-cyan-400" : ""}>systems mindset</span> — understanding not just how components function, but how entire systems behave, evolve, and improve over time.
                                </p>

                                <p className={`text-sm md:text-lg leading-relaxed font-mono transition-colors ${isPowered ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span className="text-cyan-600 font-bold mr-2">&gt;</span>
                                    What drives me is the challenge of solving problems that matter: making energy systems smarter, automation more adaptive, and digital platforms more intelligent.
                                </p>

                                <div className={`mt-8 p-4 border rounded font-mono text-xs md:text-sm transition-all ${isPowered ? 'border-cyan-500/30 bg-black text-cyan-500' : 'border-gray-800 bg-[#050505] text-gray-700'}`}>
                                    <span className="block mb-2 text-xs opacity-50">// CURRENT_STATE.json</span>
                                    {`{`}
                                    <br />&nbsp;&nbsp;"focus": "Sustainable Engineering",
                                    <br />&nbsp;&nbsp;"passion": "Autonomous Energy Networks",
                                    <br />&nbsp;&nbsp;"goal": "Bridge Electrical Foundations with AI"
                                    <br />{`}`}
                                </div>
                            </div>

                            {/* Corner Accents */}
                            {isPowered && (
                                <>
                                    <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500" />
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="mb-24 md:mb-40">
                    <SectionHeader title="PROJ_MODULES" subtitle="ADDR: 0x4A - 0x7B" isPowered={isPowered} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                        {PROJECTS.map(proj => (
                            <ProjectChip key={proj.id} project={proj} isPowered={isPowered} />
                        ))}
                    </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="mb-24 md:mb-40">
                    <SkillBreadboard isPowered={isPowered} />
                </section>

                {/* Certifications Section */}
                <section id="certifications" className="mb-24 md:mb-40">
                    <CertificationsBlock isPowered={isPowered} />
                </section>

                {/* Experience Section */}
                <section id="experience" className="mb-24 md:mb-40">
                    <SectionHeader title="SYSTEM_LOG" subtitle="RUNTIME_HISTORY" isPowered={isPowered} />
                    <ExperienceTimeline experience={EXPERIENCE} isPowered={isPowered} />
                </section>

                {/* Education Section */}
                <section id="education" className="mb-24 md:mb-40">
                    <SectionHeader title="KNOWLEDGE_BANKS" subtitle="FIRMWARE_VER" isPowered={isPowered} flip />
                    <EducationBlock education={EDUCATION} isPowered={isPowered} />
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-20">
                    <SectionHeader title="UPLINK_TERMINAL" subtitle="SEND_PACKET" isPowered={isPowered} />
                    <ContactInterface profile={PROFILE} isPowered={isPowered} />
                </section>

                {/* Footer info */}
                {/* Footer info & Control Switch */}
                <section className="flex flex-col items-center gap-12 pt-20 pb-12 border-t border-[#111]">
                    {/* Control Module - MovesLayout from Center to Footer */}
                    <motion.div
                        layout
                        className={`flex flex-col items-center gap-8 transition-all duration-1000 ease-in-out z-[100] ${!isPowered
                            ? 'fixed inset-0 items-center justify-center bg-black/90 backdrop-blur-sm'
                            : 'relative scale-[0.6] origin-center bg-transparent pointer-events-auto'
                            }`}
                    >
                        <motion.div
                            layout
                            className={`relative rounded-xl flex items-center gap-6 transition-all duration-500 ${isPowered
                                ? 'p-0 bg-transparent border-none'
                                : 'p-4 scale-150 bg-black/50 border border-cyan-900/30'
                                }`}
                        >
                            {/* Attention Grabber when remote is off */}
                            {!isPowered && (
                                <motion.div
                                    className="absolute -inset-4 rounded-2xl border-2 border-cyan-500/30"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.3, 0.8, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}

                            <PowerSwitch isOn={isPowered} onToggle={() => setIsPowered(!isPowered)} />

                            {!isPowered && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-left hidden md:block"
                                >
                                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">System Control</div>
                                    <div className="text-xs font-bold text-gray-700">
                                        ○ STANDBY
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {!isPowered && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-cyan-500 font-mono text-xs tracking-[0.2em] animate-pulse"
                            >
                                INITIALIZE_SYSTEM // CLICK_TO_START
                            </motion.p>
                        )}
                    </motion.div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-full opacity-40 hover:opacity-100 transition-opacity">
                        <Info size={14} className="text-gray-500" />
                        <p className="text-[10px] text-gray-500 font-mono">
                            ENGINEERED BY {PROFILE.name} // v2.0
                        </p>
                    </div>
                </section>
            </main>



            <style>{`
        @keyframes signalFlow {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .signal-border {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
        </div>
    );
};

const SectionHeader: React.FC<{ title: string; subtitle: string; isPowered: boolean; flip?: boolean }> = ({ title, subtitle, isPowered, flip }) => (
    <div className={`flex items-center gap-4 mb-8 md:mb-16 ${flip ? 'flex-row-reverse' : ''}`}>
        <h2 className={`text-2xl font-black transition-colors ${isPowered ? 'text-white' : 'text-gray-900'}`}>
            {title}
        </h2>
        <div className={`h-[1px] flex-grow transition-colors ${isPowered ? 'bg-gray-800' : 'bg-transparent'}`} />
        <span className={`text-[10px] font-mono ${isPowered ? 'text-gray-500' : 'text-transparent'}`}>{subtitle}</span>
    </div>
);

export default Home;
