import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Radar, Zap } from 'lucide-react';

const tracePaths = [
    'M30 210 H130 V165 H245',
    'M30 120 H90 V80 H210 V125 H265',
    'M470 95 H390 V150 H295',
    'M470 215 H405 V245 H285',
    'M70 40 V115 H150',
    'M430 40 V115 H350',
    'M250 265 V225',
];

const nodePoints = [
    { x: 30, y: 210 },
    { x: 130, y: 165 },
    { x: 245, y: 165 },
    { x: 30, y: 120 },
    { x: 210, y: 80 },
    { x: 470, y: 95 },
    { x: 390, y: 150 },
    { x: 470, y: 215 },
    { x: 285, y: 245 },
    { x: 250, y: 225 },
];

export const HeroEngineeringAnimation: React.FC = () => {
    return (
        <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] flex items-center justify-center">
            <motion.div
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute inset-[24px] rounded-full border border-dashed border-cyan-400/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            <div className="absolute inset-[36px] rounded-[28px] border border-cyan-500/30 bg-slate-950/70 shadow-[0_0_45px_rgba(6,182,212,0.28)] backdrop-blur-md overflow-hidden">
                <svg viewBox="0 0 500 300" className="w-full h-full">
                    <defs>
                        <linearGradient id="traceGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#164e63" />
                            <stop offset="45%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#0e7490" />
                        </linearGradient>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                            <stop offset="50%" stopColor="#67e8f9" stopOpacity="1" />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <rect x="0" y="0" width="500" height="300" fill="rgba(6, 182, 212, 0.03)" />

                    {tracePaths.map((path, index) => (
                        <g key={path}>
                            <path d={path} stroke="url(#traceGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <motion.path
                                d={path}
                                stroke="#a5f3fc"
                                strokeWidth="2.4"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="16 120"
                                animate={{ strokeDashoffset: [0, -136] }}
                                transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'linear' }}
                            />
                        </g>
                    ))}

                    {nodePoints.map((point, index) => (
                        <motion.circle
                            key={`${point.x}-${point.y}`}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#67e8f9"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.2, 0.9] }}
                            transition={{ duration: 2.2, delay: index * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}

                    <motion.path
                        d="M70 185 C120 155, 165 210, 220 185 C270 160, 315 215, 370 185 C405 168, 430 190, 470 178"
                        stroke="url(#waveGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        animate={{ opacity: [0.35, 1, 0.35], pathLength: [0.4, 1, 0.4] }}
                        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </svg>

                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(120deg, transparent 20%, rgba(103,232,249,0.16) 50%, transparent 78%)',
                    }}
                    animate={{ x: ['-120%', '140%'] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
                />

                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
            </div>

            <motion.div
                className="absolute z-20 w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-cyan-300/40 bg-slate-950/90 shadow-[0_0_30px_rgba(103,232,249,0.25)] flex flex-col items-center justify-center"
                animate={{ y: [0, -6, 0], boxShadow: ['0 0 25px rgba(34,211,238,0.25)', '0 0 42px rgba(34,211,238,0.45)', '0 0 25px rgba(34,211,238,0.25)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <Cpu size={34} className="text-cyan-300" />
                <span className="text-[10px] font-mono mt-2 text-cyan-100 tracking-[0.18em]">CORE MCU</span>
            </motion.div>

            <motion.div
                className="absolute top-10 right-8 z-20 p-2.5 rounded-md border border-cyan-500/30 bg-slate-950/80"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity }}
            >
                <Activity size={16} className="text-cyan-300" />
            </motion.div>

            <motion.div
                className="absolute bottom-12 left-6 z-20 p-2.5 rounded-md border border-cyan-500/30 bg-slate-950/80"
                animate={{ rotate: [0, 6, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3.4, repeat: Infinity }}
            >
                <Radar size={16} className="text-cyan-300" />
            </motion.div>

            <motion.div
                className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-5 z-20 p-2 rounded-full border border-cyan-400/40 bg-slate-950/85"
                animate={{ x: [0, 7, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.2, repeat: Infinity }}
            >
                <Zap size={14} className="text-cyan-300" />
            </motion.div>
        </div>
    );
};
