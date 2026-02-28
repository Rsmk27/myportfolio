import React from 'react';
import { motion } from 'framer-motion';

interface HeroCircuitProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    isPowered: boolean;
}

const traces = [
    { id: 'left-bus', d: 'M20 220 L160 220 L220 160 L360 160', delay: 0 },
    { id: 'right-bus', d: 'M980 220 L840 220 L780 280 L640 280', delay: 0.25 },
    { id: 'top-feed', d: 'M500 20 L500 110 L430 180', delay: 0.4 },
    { id: 'bottom-feed', d: 'M500 420 L500 330 L570 260', delay: 0.55 },
    { id: 'diag-left', d: 'M120 60 L240 60 L340 140', delay: 0.7 },
    { id: 'diag-right', d: 'M880 380 L760 380 L660 300', delay: 0.85 }
];

export const HeroCircuit: React.FC<HeroCircuitProps> = ({ title, subtitle, imageUrl, isPowered }) => {
    const [firstName, ...restName] = title.split(' ');
    const lastName = restName.join(' ');

    return (
        <div className="relative w-full max-w-6xl h-[420px] md:h-[480px] rounded-3xl border border-cyan-900/60 bg-black/60 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16)_0%,rgba(0,0,0,0.8)_62%)]" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden>
                <defs>
                    <linearGradient id="trace-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {traces.map((trace) => (
                    <g key={trace.id}>
                        <motion.path
                            d={trace.d}
                            fill="none"
                            stroke="url(#trace-gradient)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0.2 }}
                            animate={isPowered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.2 }}
                            transition={{ duration: 1.8, delay: trace.delay, ease: 'easeInOut' }}
                        />
                        <motion.circle
                            r="4"
                            fill="#22d3ee"
                            initial={{ opacity: 0 }}
                            animate={isPowered
                                ? {
                                    opacity: [0, 1, 0],
                                    cx: trace.id.includes('left') ? [20, 360] : trace.id.includes('right') ? [980, 640] : [500, trace.id.includes('top') ? 430 : 570],
                                    cy: trace.id.includes('left') ? [220, 160] : trace.id.includes('right') ? [220, 280] : [trace.id.includes('top') ? 20 : 420, trace.id.includes('top') ? 180 : 260]
                                }
                                : { opacity: 0 }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: trace.delay + 0.6, ease: 'easeInOut' }}
                        />
                    </g>
                ))}

                <motion.path
                    d="M120 340 C220 280, 300 400, 410 340 S620 280, 720 340 S860 400, 920 320"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    strokeDasharray="5 10"
                    initial={{ opacity: 0.3 }}
                    animate={isPowered ? { opacity: [0.3, 0.95, 0.3], pathLength: [0.6, 1, 0.6] } : { opacity: 0.2 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.path
                    d="M160 110 L220 110 L240 90 L280 130 L320 90 L360 130 L400 110 L460 110"
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="2.2"
                    initial={{ opacity: 0.2 }}
                    animate={isPowered ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.15 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                />
                <line x1="610" y1="110" x2="610" y2="150" stroke="#67e8f9" strokeWidth="2" />
                <line x1="635" y1="105" x2="635" y2="155" stroke="#67e8f9" strokeWidth="2" />
                <line x1="575" y1="130" x2="610" y2="130" stroke="#67e8f9" strokeWidth="2" />
                <line x1="635" y1="130" x2="685" y2="130" stroke="#67e8f9" strokeWidth="2" />
            </svg>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    className="relative mb-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={isPowered ? { scale: 1, opacity: 1 } : { scale: 0.94, opacity: 0.5 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className="absolute inset-[-22px] rounded-[2rem] border border-cyan-400/50"
                        animate={isPowered ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-[-12px] rounded-[1.3rem] border border-cyan-500/40 border-dashed"
                        animate={isPowered ? { rotate: -360 } : { rotate: 0 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-cyan-300/60 bg-slate-950/90 p-2 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        <img src={imageUrl} alt={title} className="w-full h-full rounded-xl object-cover" />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none"
                    initial={{ opacity: 0, y: 12 }}
                    animate={isPowered ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 8 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    <span className="block text-white">{firstName}</span>
                    <span className="block text-cyan-400 drop-shadow-[0_0_22px_rgba(34,211,238,0.55)]">{lastName}</span>
                </motion.h1>

                <motion.p
                    className="mt-3 text-xs md:text-sm font-mono tracking-[0.2em] text-cyan-200/90 uppercase"
                    initial={{ opacity: 0 }}
                    animate={isPowered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {subtitle}
                </motion.p>
            </div>
        </div>
    );
};
