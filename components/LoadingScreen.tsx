import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onComplete?: () => void;
}

const LOADING_STAGES = [
    { progress: 0, message: 'Booting system kernel...' },
    { progress: 15, message: 'Initializing energy nodes...' },
    { progress: 30, message: 'Connecting smart grid...' },
    { progress: 50, message: 'Loading circuit modules...' },
    { progress: 70, message: 'Calibrating sensors...' },
    { progress: 85, message: 'Establishing uplink...' },
    { progress: 100, message: 'System ready!' },
];

const BOOT_LOGS = [
    'SYS://RSMK_PORTFOLIO',
    '// BUILD 3.7.2+',
    'NET: [0.189234] IPv4: 192.158.1.100 assigned',
    'PWR: [0.229481] Battery: 98% - charging via solar',
    'SYS: [0.245180] All systems nominal. Launching UI...',
    'SYS: [0.245180] All systems nominal. Launching UI...',
    '// SYSTEM READY!_'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(LOADING_STAGES[0].message);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
    
    // Stable ref for onComplete
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    // Drip logs synced roughly with progress
    useEffect(() => {
        let idx = 0;
        let cancelled = false;
        const dripLog = () => {
            if (cancelled || idx >= BOOT_LOGS.length) return;
            setVisibleLogs(prev => [...prev, BOOT_LOGS[idx]]);
            idx++;
            setTimeout(dripLog, 150 + Math.random() * 80);
        };
        const t = setTimeout(dripLog, 100);
        return () => { cancelled = true; clearTimeout(t); };
    }, []);

    // Progress animation
    useEffect(() => {
        const DURATION = 2000; // ms
        let startTime: number | null = null;
        let rafId: number;
        let cancelled = false;
        const stageThresholds = LOADING_STAGES.map(s => s.progress);
        let lastStageIdx = 0;

        const completeLoading = () => {
            if (cancelled) return;
            setIsFadingOut(true);
            setTimeout(() => {
                if (cancelled) return;
                onCompleteRef.current?.();
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.classList.add('visible');
            }, 600);
        };

        const tick = (timestamp: number) => {
            if (cancelled) return;
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / DURATION, 1);
            
            // Ease-in-out curve
            const eased = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const p = Math.round(eased * 100);
            setProgress(p);

            for (let i = lastStageIdx; i < stageThresholds.length; i++) {
                if (p >= stageThresholds[i]) {
                    setStatusMessage(LOADING_STAGES[i].message);
                    lastStageIdx = i + 1;
                }
            }

            if (t < 1) {
                rafId = requestAnimationFrame(tick);
            } else {
                setProgress(100);
                setTimeout(completeLoading, 200);
            }
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelled = true;
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className={`fixed inset-0 z-[9999] bg-[#030712] flex items-center justify-center overflow-hidden transition-all duration-700 ${isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            {/* Tech grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Corner Tech Brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40" />

            {/* Corner Telemetry labels */}
            <div className="absolute top-6 left-16 text-[10px] font-mono tracking-widest text-cyan-500/50 uppercase select-none">
                SYS://RSMK_PORTFOLIO
            </div>
            <div className="absolute top-6 right-16 text-[10px] font-mono tracking-widest text-cyan-500/50 uppercase select-none">
                BUILD 3.7.2+
            </div>
            <div className="absolute bottom-6 left-16 text-[10px] font-mono tracking-widest text-cyan-500/50 uppercase select-none">
                EEE • IOT • EMBEDDED
            </div>
            <div className="absolute bottom-6 right-16 text-[10px] font-mono tracking-widest text-cyan-500/50 uppercase select-none">
                LAT: 18.29°N • LON: 83.89°E
            </div>

            {/* Center Area (Grid Layout) */}
            <div className="w-full max-w-6xl px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Column 1: Vertical Stacked Name (Desktop left 3 columns) */}
                <div className="hidden md:flex md:col-span-3 gap-6 select-none">
                    <div className="flex flex-col text-white font-black text-6xl xl:text-7xl leading-[1.05] tracking-tighter">
                        {"SRINIVASA".split("").map((char, idx) => (
                            <span key={idx} className="block text-center">{char}</span>
                        ))}
                    </div>
                    <div className="flex flex-col text-white font-black text-6xl xl:text-7xl leading-[1.05] tracking-tighter">
                        {"MANIKANTA".split("").map((char, idx) => (
                            <span key={idx} className="block text-center">{char}</span>
                        ))}
                    </div>
                </div>

                {/* Mobile top stacked text */}
                <div className="flex md:hidden flex-col items-center select-none text-center mb-4">
                    <h1 className="text-white font-black text-4xl tracking-widest">SRINIVASA</h1>
                    <h1 className="text-cyan-400 font-black text-4xl tracking-widest mt-1">MANIKANTA</h1>
                </div>

                {/* Column 2: Sonar Radar & Progress Bar (Center 6 columns) */}
                <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center">
                    
                    {/* Sonar sweep HUD */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-cyan-500/20 bg-black/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.05),inset_0_0_20px_rgba(6,182,212,0.05)]">
                        {/* Concentric rings */}
                        <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/15" />
                        <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-500/10" />
                        <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-500/5" />
                        <div className="absolute w-[20%] h-[20%] rounded-full border border-cyan-500/5" />
                        
                        {/* Crosshairs */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-cyan-500/10" />
                        <div className="absolute left-0 right-0 top-1/2 h-[0.5px] bg-cyan-500/10" />
                        
                        {/* Radar dial ticks */}
                        {[...Array(12)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute top-0 bottom-0 left-1/2 w-0.5" 
                                style={{ transform: `rotate(${i * 30}deg)` }}
                            >
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-500/40" />
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-500/40" />
                            </div>
                        ))}

                        {/* Sonar sweep line & cone */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 origin-center pointer-events-none"
                        >
                            {/* Sweeper arm line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1/2 bg-cyan-400 opacity-80 shadow-[0_0_8px_#06b6d4]" />
                            {/* Conic sweep trail */}
                            <div 
                                className="absolute top-0 left-0 w-full h-full origin-center"
                                style={{
                                    background: 'conic-gradient(from 180deg at 50% 50%, rgba(6,182,212,0.15) 0deg, transparent 90deg)',
                                    transform: 'rotate(270deg)',
                                    borderRadius: '50%'
                                }}
                            />
                        </motion.div>

                        {/* Radar targets / blips */}
                        <div className="absolute top-[30%] left-[35%] w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-60" />
                        <div className="absolute top-[58%] right-[28%] w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse opacity-75" />
                        <div className="absolute bottom-[25%] left-[45%] w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse opacity-50" />
                        
                        {/* Center dot */}
                        <div className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2ff]" />
                    </div>

                    {/* Progress Bar & Stage Status */}
                    <div className="w-full max-w-md mt-8 px-4 flex flex-col gap-2">
                        {/* Progress line */}
                        <div className="h-[2px] w-full bg-cyan-950/40 relative rounded overflow-hidden">
                            <motion.div 
                                className="h-full bg-cyan-400 shadow-[0_0_10px_#00f2ff]"
                                style={{ width: `${progress}%` }}
                                transition={{ type: 'tween', ease: 'easeOut' }}
                            />
                        </div>
                        {/* Progress text */}
                        <div className="flex justify-between items-center text-[11px] font-mono tracking-widest text-cyan-400/80">
                            <span className="flex items-center gap-1.5">
                                <span className="animate-pulse">▶</span> {statusMessage.toUpperCase()}
                            </span>
                            <span className="font-bold text-white">{progress}%</span>
                        </div>
                    </div>
                </div>

                {/* Column 3: Drip Logs Terminal Box (Desktop right 3 columns) */}
                <div className="col-span-1 md:col-span-3 flex justify-center md:justify-end">
                    <div className="w-full max-w-sm rounded-xl border border-cyan-500/20 bg-black/60 backdrop-blur-md p-5 flex flex-col gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_40px_rgba(6,182,212,0.02)] h-44 overflow-y-auto">
                        <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/10">
                            <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                                Console Logs
                            </span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/20" />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col font-mono text-[10px] text-cyan-500/70 leading-relaxed justify-end overflow-hidden">
                            <AnimatePresence>
                                {visibleLogs.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className={`${i === visibleLogs.length - 1 ? 'text-cyan-300 font-semibold' : ''}`}
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
