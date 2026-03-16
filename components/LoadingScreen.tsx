import React, { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
    onComplete?: () => void;
}

const LOADING_STAGES = [
    { progress: 0, message: 'Initializing systems...' },
    { progress: 15, message: 'Loading circuit modules...' },
    { progress: 30, message: 'Establishing connections...' },
    { progress: 50, message: 'Compiling components...' },
    { progress: 70, message: 'Rendering interface...' },
    { progress: 85, message: 'Optimizing performance...' },
    { progress: 100, message: 'System ready!' }
];

/* ── Capacitor Progress Component ───────────────────────────────── */
interface CapacitorProgressProps {
    progress: number;
}

const CapacitorProgress: React.FC<CapacitorProgressProps> = ({ progress }) => {
    const capH = 80;
    const capW = 44;
    const fillH = (progress / 100) * capH;
    const sparkCount = 6;
    const [sparksState, setSparks] = useState<{ id: number; x: number; size: number }[]>([]);
    const prevProgress = useRef(progress);

    // Trigger sparks while filling
    useEffect(() => {
        if (progress > 0 && progress < 100 && progress > prevProgress.current) {
            const id = Date.now();
            const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
                id: id + i,
                x: Math.random() * capW,
                size: 2 + Math.random() * 3,
            }));
            setSparks(newSparks);
            const t = setTimeout(() => setSparks([]), 400);
            return () => clearTimeout(t);
        }
        prevProgress.current = progress;
    }, [progress]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            {/* Capacitor SVG */}
            <svg width={capW + 40} height={capH + 50} viewBox={`0 0 ${capW + 40} ${capH + 50}`} style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="capFill" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
                    </linearGradient>
                    <filter id="capGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <clipPath id="capClip">
                        <rect x={20} y={8} width={capW} height={capH} />
                    </clipPath>
                </defs>

                {/* Lead wires */}
                <line x1={20 + capW / 2} y1={0} x2={20 + capW / 2} y2={8} stroke="#00f2ff" strokeWidth="2" opacity="0.6" />
                <line x1={20 + capW / 2} y1={capH + 8} x2={20 + capW / 2} y2={capH + 16} stroke="#00f2ff" strokeWidth="2" opacity="0.6" />

                {/* Top plate */}
                <rect x={14} y={6} width={capW + 12} height={4} rx={1} fill="none" stroke="rgba(0,242,255,0.6)" strokeWidth="1.5" />
                {/* Bottom plate */}
                <rect x={14} y={capH + 8} width={capW + 12} height={4} rx={1} fill="none" stroke="rgba(0,242,255,0.6)" strokeWidth="1.5" />

                {/* Electrolyte container outline */}
                <rect x={20} y={8} width={capW} height={capH} rx={2} fill="rgba(0,242,255,0.03)" stroke="rgba(0,242,255,0.2)" strokeWidth="1" />

                {/* Liquid fill */}
                <rect
                    x={20} y={8 + capH - fillH} width={capW} height={fillH}
                    rx={2} fill="url(#capFill)"
                    clipPath="url(#capClip)"
                    filter="url(#capGlow)"
                    style={{ transition: 'height 0.2s ease, y 0.2s ease' }}
                />

                {/* Bubbles in electrolyte */}
                {[0.2, 0.5, 0.75].map((frac, i) => {
                    const bx = 20 + 8 + i * 14;
                    const by = 8 + capH - fillH * frac;
                    if (fillH < 4) return null;
                    return (
                        <circle key={i} cx={bx} cy={by} r={1.5}
                            fill="rgba(0,242,255,0.4)"
                            style={{ animation: `capBubble ${1.5 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                        />
                    );
                })}

                {/* Sparks at the top of fill */}
                {sparksState.map((s) => (
                    <g key={s.id}>
                        <rect
                            x={20 + s.x - s.size / 2}
                            y={8 + capH - fillH - s.size}
                            width={s.size} height={s.size}
                            fill="#fff"
                            opacity={0.9}
                            style={{ filter: 'drop-shadow(0 0 3px #00f2ff)', animation: 'capSpark 0.35s ease-out forwards' }}
                        />
                    </g>
                ))}

                {/* + / - polarity labels */}
                <text x={8} y={12} fill="rgba(0,242,255,0.5)" fontSize="8" fontFamily="monospace">+</text>
                <text x={8} y={capH + 16} fill="rgba(0,242,255,0.5)" fontSize="8" fontFamily="monospace">−</text>
            </svg>

            {/* Percentage and label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: '#00f2ff', textShadow: '0 0 10px rgba(0,242,255,0.6)', letterSpacing: '0.05em' }}>
                    {progress}%
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(0,242,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Charging Capacitor
                </span>
            </div>
        </div>
    );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(LOADING_STAGES[0].message);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        let currentStageIndex = 0;
        let currentProgress = 0;

        const updateProgress = () => {
            if (currentStageIndex >= LOADING_STAGES.length) return;

            const stage = LOADING_STAGES[currentStageIndex];
            setStatusMessage(stage.message);

            const interval = setInterval(() => {
                if (currentProgress < stage.progress) {
                    currentProgress++;
                    setProgress(currentProgress);
                } else {
                    clearInterval(interval);
                    currentStageIndex++;
                    if (currentStageIndex < LOADING_STAGES.length) {
                        setTimeout(updateProgress, 300); // Delay between stages
                    } else {
                        setTimeout(completeLoading, 500); // Complete loading
                    }
                }
            }, 20);
        };

        const completeLoading = () => {
            setIsFadingOut(true);
            setTimeout(() => {
                if (onComplete) onComplete();
                // If direct DOM manipulation is preferred as per request for main-content
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.classList.add('visible');
                }
            }, 500);
        };

        // Initial delay before starting
        const startTimeout = setTimeout(updateProgress, 500);

        return () => {
            clearTimeout(startTimeout);
        };
    }, [onComplete]);

    if (isFadingOut) {
        // We render it but with the fade-out class which handles opacity and visibility
    }

    return (
        <div id="loading-screen" className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="loading-content">
                <div className="circuit-logo">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* Central IC Chip */}
                        <rect className="chip" x="70" y="70" width="60" height="60" rx="4" />
                        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#0EA5E9" fontSize="14" fontWeight="bold" fontFamily="monospace" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease forwards 0.5s' }}>RSMK</text>

                        {/* Left Side Pins */}
                        {[...Array(5)].map((_, i) => (
                            <rect key={`l-${i}`} className={`pin pin-${i + 1}`} x="50" y={75 + i * 10} width="20" height="3" />
                        ))}

                        {/* Right Side Pins */}
                        {[...Array(5)].map((_, i) => (
                            <rect key={`r-${i}`} className={`pin pin-${i + 6}`} x="130" y={75 + i * 10} width="20" height="3" />
                        ))}

                        {/* Circuit Traces */}
                        {/* Circuit Traces */}
                        <path className="trace trace-1" d="M 50 76.5 L 30 76.5 L 30 50" />
                        <path className="trace trace-2" d="M 50 86.5 L 20 86.5 L 20 30" />
                        <path className="trace trace-3" d="M 50 96.5 L 10 96.5 L 10 150" />
                        <path className="trace trace-4" d="M 50 106.5 L 25 106.5 L 25 170" />
                        <path className="trace trace-5" d="M 50 116.5 L 35 116.5 L 35 140" />

                        <path className="trace trace-6" d="M 150 76.5 L 170 76.5 L 170 50" />
                        <path className="trace trace-7" d="M 150 86.5 L 180 86.5 L 180 30" />
                        <path className="trace trace-8" d="M 150 96.5 L 190 96.5 L 190 150" />
                        <path className="trace trace-9" d="M 150 106.5 L 175 106.5 L 175 170" />
                        <path className="trace trace-10" d="M 150 116.5 L 165 116.5 L 165 140" />

                        {/* Connection Nodes */}
                        <circle className="node node-1" cx="30" cy="50" r="3" />
                        <circle className="node node-2" cx="20" cy="30" r="3" />
                        <circle className="node node-3" cx="10" cy="150" r="3" />
                        <circle className="node node-4" cx="25" cy="170" r="3" />
                        <circle className="node node-5" cx="35" cy="140" r="3" />

                        <circle className="node node-6" cx="170" cy="50" r="3" />
                        <circle className="node node-7" cx="180" cy="30" r="3" />
                        <circle className="node node-8" cx="190" cy="150" r="3" />
                        <circle className="node node-9" cx="175" cy="170" r="3" />
                        <circle className="node node-10" cx="165" cy="140" r="3" />

                        {/* Signal Flow Dots */}
                        <circle className="signal-dot dot-1" cx="50" cy="76.5" r="2" />
                        <circle className="signal-dot dot-2" cx="50" cy="86.5" r="2" />
                        <circle className="signal-dot dot-3" cx="50" cy="96.5" r="2" />
                        <circle className="signal-dot dot-4" cx="50" cy="106.5" r="2" />
                        <circle className="signal-dot dot-5" cx="50" cy="116.5" r="2" />

                        <circle className="signal-dot dot-6" cx="150" cy="76.5" r="2" />
                        <circle className="signal-dot dot-7" cx="150" cy="86.5" r="2" />
                        <circle className="signal-dot dot-8" cx="150" cy="96.5" r="2" />
                        <circle className="signal-dot dot-9" cx="150" cy="106.5" r="2" />
                        <circle className="signal-dot dot-10" cx="150" cy="116.5" r="2" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-10 leading-none text-center">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">SRINIVASA</span>
                    <span className="block text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">MANIKANTA</span>
                </h1>

                {/* Capacitor charging indicator */}
                <CapacitorProgress progress={progress} />

                <div className="loading-text" id="loading-text">
                    <span className="terminal-prompt">&gt;</span>
                    <span id="status-text" className="relative">{statusMessage}</span>
                </div>
            </div>
        </div>
    );
};

