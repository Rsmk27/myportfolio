import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, Activity, Radio, Terminal, Workflow } from 'lucide-react';
import { PCBBackground } from '../components/PCBBackground';
import SEO from '../components/common/SEO';

const NotFound: React.FC = () => {
    const location = useLocation();
    const attemptedPath = location.pathname || '/unknown';

    return (
        <div
            data-clarity-region="not-found-page"
            className="min-h-screen bg-[#080806] relative selection:bg-cyan-500/30 selection:text-white font-mono text-zinc-300 overflow-x-hidden"
        >
            <SEO
                title="404 — Page Not Found"
                description="The requested page could not be found."
                noindex={true}
            />

            <PCBBackground isPowered={true} />

            {/* Subtle blueprint grid & ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e16_1px,transparent_1px),linear-gradient(to_bottom,#1e1e16_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_55%,transparent_100%)]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-cyan-500/8 rounded-full blur-3xl" />
            </div>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
                {/* Oscilloscope Diagnostic Frame */}
                <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0d0d0b]/95 backdrop-blur-md shadow-[0_20px_70px_rgba(0,0,0,0.75)] overflow-hidden">
                    {/* Top copper/cyan/red power rail */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400" />

                    {/* Corner fiducials */}
                    <span className="pointer-events-none absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-cyan-500/50" />
                    <span className="pointer-events-none absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-cyan-500/50" />
                    <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-amber-500/50" />
                    <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-amber-500/50" />

                    {/* Instrument Header Bezel */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-800/90 bg-[#111110]">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)] animate-pulse" />
                            <span className="text-[11px] uppercase tracking-[0.2em] text-red-400 font-bold">
                                SIGNAL LOST // FAULT 404
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 uppercase tracking-widest">
                            <span className="inline-flex items-center gap-1.5">
                                <Radio size={11} className="text-amber-400" />
                                CH1: NO CARRIER
                            </span>
                            <span className="hidden sm:inline text-zinc-600">|</span>
                            <span className="hidden sm:inline text-cyan-400">TRIG: TIMEOUT</span>
                        </div>
                    </div>

                    {/* Oscilloscope Viewport */}
                    <div className="p-6 sm:p-8 text-center">
                        <div className="relative mx-auto mb-6 rounded-xl border border-zinc-800 bg-[#070909] p-4 sm:p-5 overflow-hidden">
                            {/* Graticule grid */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.07)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"
                            />
                            {/* Center crosshair axis */}
                            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/15 pointer-events-none" />
                            <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/15 pointer-events-none" />

                            {/* Top telemetry strip inside scope */}
                            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
                                <span>500 mV/div</span>
                                <span className="text-amber-400">Vpp: 0.00 V</span>
                                <span>200 ns/div</span>
                            </div>

                            {/* Fault 404 Number + Waveform */}
                            <div className="relative z-10 py-2">
                                <svg
                                    viewBox="0 0 600 84"
                                    className="w-full h-16 sm:h-20 mb-2 overflow-visible"
                                    aria-hidden="true"
                                >
                                    <defs>
                                        <linearGradient id="faultTraceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                                            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.95" />
                                            <stop offset="65%" stopColor="#ef4444" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.35" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 0 42 L 70 42 L 85 16 L 100 68 L 115 24 L 130 58 L 145 42 L 220 42 L 235 12 L 246 72 L 258 34 L 268 48 L 278 42 L 600 42"
                                        fill="none"
                                        stroke="url(#faultTraceGrad)"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle cx="278" cy="42" r="4" fill="#ef4444" />
                                </svg>

                                <div
                                    className="text-7xl sm:text-8xl md:text-9xl font-black leading-none tracking-tight select-none"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    <span className="text-zinc-200">4</span>
                                    <span className="text-cyan-400 drop-shadow-[0_0_24px_rgba(34,211,238,0.45)]">0</span>
                                    <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]">4</span>
                                </div>
                            </div>

                            {/* Bottom scope strip */}
                            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-wider mt-2 pt-2 border-t border-zinc-800/70">
                                <span className="inline-flex items-center gap-1.5 text-red-400">
                                    <Activity size={11} /> LINK DOWN
                                </span>
                                <span>ERR_CODE: MODULE_NOT_FOUND</span>
                            </div>
                        </div>

                        <h1
                            className="text-2xl sm:text-3xl font-black text-white mb-3 uppercase tracking-tight"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Signal Lost — Route Unreachable
                        </h1>
                        <p className="text-zinc-400 mb-8 max-w-lg mx-auto text-xs sm:text-sm font-sans leading-relaxed">
                            The requested address or hardware module could not be resolved on this bus. It may have been relocated, decommissioned, or entered with a mismatched path.
                        </p>

                        {/* Return Navigation */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,242,255,0.45)] transition-all"
                            >
                                <ArrowLeft size={14} />
                                <span>Return Home</span>
                            </Link>
                            <Link
                                to="/#projects"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-[#111110] text-zinc-200 font-bold text-xs uppercase tracking-wider hover:border-cyan-400/60 hover:text-cyan-300 transition-all"
                            >
                                <Cpu size={14} />
                                <span>View Projects</span>
                            </Link>
                            <Link
                                to="/automation"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-[#111110] text-zinc-200 font-bold text-xs uppercase tracking-wider hover:border-amber-400/60 hover:text-amber-300 transition-all"
                            >
                                <Workflow size={14} />
                                <span>Automation Lab</span>
                            </Link>
                        </div>

                        {/* Diagnostic UART Console Readout */}
                        <div className="text-left bg-[#080806] border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 pb-2 mb-2 border-b border-zinc-800/80 uppercase tracking-widest">
                                <span className="inline-flex items-center gap-1.5">
                                    <Terminal size={11} className="text-cyan-400" />
                                    DIAGNOSTIC TRACE
                                </span>
                                <span>UART0 @ 115200</span>
                            </div>
                            <div className="text-zinc-400 break-all">
                                <span className="text-cyan-400">$</span> bus.resolve(<span className="text-amber-300">"{attemptedPath}"</span>)
                            </div>
                            <div className="text-red-400">
                                ! FAULT 404: No active endpoint bound to path
                            </div>
                            <div className="text-zinc-300 flex items-center gap-1.5 pt-1">
                                <span className="text-emerald-400">➜</span>
                                <span>
                                    Valid buses: <span className="text-cyan-300">/</span>,{' '}
                                    <span className="text-cyan-300">/automation</span>,{' '}
                                    <span className="text-cyan-300">/gallery</span>
                                </span>
                                <span className="w-2 h-3.5 bg-cyan-400 animate-pulse inline-block ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
