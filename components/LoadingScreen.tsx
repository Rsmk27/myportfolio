import React, { useEffect, useState } from 'react';

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

                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" id="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-percentage" id="progress-percentage">{progress}%</div>
                </div>

                <div className="loading-text" id="loading-text">
                    <span className="terminal-prompt">&gt;</span>
                    <span id="status-text" className="relative">{statusMessage}</span>
                </div>
            </div>
        </div>
    );
};

