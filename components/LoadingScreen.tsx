import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    const [text, setText] = useState("INITIALIZING KERNEL");

    useEffect(() => {
        const texts = [
            "INITIALIZING KERNEL...",
            "LOADING MODULES...",
            "VERIFYING INTEGRITY...",
            "SYSTEM READY"
        ];
        let i = 0;
        const interval = setInterval(() => {
            i++;
            if (i < texts.length) {
                setText(texts[i]);
            }
        }, 700);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(#083344 1px, transparent 1px), linear-gradient(90deg, #083344 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Central Animation */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Spinning Rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full border-2 border-cyan-500/20 border-b-cyan-500"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Core */}
                    <div className="relative z-20 w-16 h-16 bg-black/50 backdrop-blur-sm rounded-lg border border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        <Cpu className="w-8 h-8 text-cyan-400" />
                        <motion.div
                            className="absolute inset-0 bg-cyan-400/20 rounded-lg"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </div>

                {/* Text Scramble/Status */}
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-widest text-cyan-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {text}
                    </h2>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* System Stats */}
                    <div className="flex gap-6 mt-2">
                        <div className="text-[10px] font-mono text-cyan-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            CPU: 100%
                        </div>
                        <div className="text-[10px] font-mono text-cyan-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-75"></span>
                            MEM: OK
                        </div>
                        <div className="text-[10px] font-mono text-cyan-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-150"></span>
                            NET: SECURE
                        </div>
                    </div>
                </div>
            </div>

            {/* Top/Bottom Decorative Bars */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
        </div>
    );
};
