import React, { useEffect, useState, useRef } from 'react';

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
    'SYS:  [0.000000] Linux version 6.1.0-rsmk-embedded',
    'SYS:  [0.001024] BIOS-e820: [mem 0x000000-0x09efff] usable',
    'NET:  [0.032150] esp32-wifi: driver loaded',
    'GPIO: [0.045231] Digital pins initialized (D0-D39)',
    'I2C:  [0.078412] Bus 0 at 400kHz — scanning...',
    'SPI:  [0.091832] SPI Flash: detected 4MB NOR',
    'MQTT: [0.112567] Broker connected @ broker.rsmk.me:1883',
    'ADC:  [0.134021] 12-bit ADC channels armed',
    'FW:   [0.156899] Firmware v3.7.2 verified ✓',
    'NET:  [0.189234] IPv4: 192.168.1.100 assigned',
    'PWR:  [0.220481] Battery: 98% — charging via solar',
    'SYS:  [0.245100] All systems nominal. Launching UI...',
];

// Particle data
const NUM_PARTICLES = 30;

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(LOADING_STAGES[0].message);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
    const [glitchActive, setGlitchActive] = useState(false);
    const [particles] = useState(() =>
        Array.from({ length: NUM_PARTICLES }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 4,
            duration: 3 + Math.random() * 4,
            size: Math.random() > 0.7 ? 3 : 2,
            char: ['0', '1', '⚡', '◆', '◇', '+', '×'][Math.floor(Math.random() * 7)],
        }))
    );
    const logsRef = useRef<HTMLDivElement>(null);

    // Keep a stable ref to onComplete so the animation effect never restarts
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    // Drip boot logs
    useEffect(() => {
        let idx = 0;
        let cancelled = false;
        const dripLog = () => {
            if (cancelled || idx >= BOOT_LOGS.length) return;
            setVisibleLogs(prev => [...prev, BOOT_LOGS[idx]]);
            idx++;
            setTimeout(dripLog, 100 + Math.random() * 60);
        };
        const t = setTimeout(dripLog, 200);
        return () => { cancelled = true; clearTimeout(t); };
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    // Glitch effect on name
    useEffect(() => {
        const triggerGlitch = () => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        };
        const id = setInterval(triggerGlitch, 2800);
        return () => clearInterval(id);
    }, []);

    // Progress animation — smooth rAF-driven fill over ~1.8 s
    useEffect(() => {
        const DURATION = 1800; // ms to go 0 → 100
        let startTime: number | null = null;
        let rafId: number;
        let cancelled = false;

        // Stage message thresholds (synced to LOADING_STAGES progress values)
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
            }, 700);
        };

        const tick = (timestamp: number) => {
            if (cancelled) return;
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / DURATION, 1);

            // Ease-in-out curve: fast start, slight deceleration near end
            const eased = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const p = Math.round(eased * 100);
            setProgress(p);

            // Update status message when crossing stage thresholds
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

        // Small initial delay so the screen appears before animating
        const startTimeout = setTimeout(() => {
            if (cancelled) return;
            rafId = requestAnimationFrame(tick);
        }, 180);

        return () => {
            cancelled = true;
            clearTimeout(startTimeout);
            cancelAnimationFrame(rafId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id="loading-screen" className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Scanline overlay */}
            <div className="ls-scanlines" />

            {/* Grid background */}
            <div className="ls-grid" />

            {/* Falling particles */}
            <div className="ls-particles">
                {particles.map(p => (
                    <span
                        key={p.id}
                        className="ls-particle"
                        style={{
                            left: `${p.x}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                            fontSize: `${p.size + 8}px`,
                        }}
                    >
                        {p.char}
                    </span>
                ))}
            </div>

            {/* Corner brackets */}
            <div className="ls-corner ls-corner-tl" />
            <div className="ls-corner ls-corner-tr" />
            <div className="ls-corner ls-corner-bl" />
            <div className="ls-corner ls-corner-br" />

            {/* HUD top bar */}
            <div className="ls-hud-bar ls-hud-top">
                <span className="ls-hud-label">SYS://RSMK_PORTFOLIO</span>
                <span className="ls-hud-label">BUILD 3.7.2</span>
                <span className="ls-hud-label ls-blink">● LIVE</span>
            </div>
            <div className="ls-hud-bar ls-hud-bottom">
                <span className="ls-hud-label">EEE · IoT · EMBEDDED</span>
                <span className="ls-hud-label">LAT: 18.29°N · LON: 83.89°E</span>
            </div>

            {/* Main content */}
            <div className="loading-content">

                {/* Circuit logo with rings */}
                <div className="ls-logo-wrapper">
                    {/* Outer rotating ring */}
                    <div className="ls-ring ls-ring-outer" />
                    {/* Middle dashed ring */}
                    <div className="ls-ring ls-ring-mid" />
                    {/* Inner glow disc */}
                    <div className="ls-ring ls-ring-inner" />

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
                </div>

                {/* Glitchy name */}
                <h1 className={`ls-name ${glitchActive ? 'ls-glitch' : ''}`} data-text="SRINIVASA MANIKANTA">
                    <span className="ls-name-line1">SRINIVASA</span>
                    <span className="ls-name-line2">MANIKANTA</span>
                </h1>

                {/* Subtitle tag */}
                <div className="ls-subtitle">
                    <span className="ls-tag">⚡ Embedded Systems</span>
                    <span className="ls-tag-sep">·</span>
                    <span className="ls-tag">IoT</span>
                    <span className="ls-tag-sep">·</span>
                    <span className="ls-tag">Smart Energy</span>
                </div>

                {/* Progress */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" id="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="ls-progress-meta">
                        <span className="loading-text">
                            <span className="terminal-prompt">›</span>
                            <span id="status-text">{statusMessage}</span>
                        </span>
                        <span className="progress-percentage">{progress}%</span>
                    </div>
                </div>

                {/* Boot log terminal */}
                <div className="ls-terminal" ref={logsRef}>
                    {visibleLogs.map((log, i) => (
                        <div key={i} className="ls-log-line">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
