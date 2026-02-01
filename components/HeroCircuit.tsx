import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HeroCircuitProps {
    title: string;
    subtitle: string;
    isPowered: boolean;
}

export const HeroCircuit: React.FC<HeroCircuitProps> = ({ title, subtitle, isPowered }) => {
    const controls = useAnimation();
    const [revealName, setRevealName] = useState(false);

    useEffect(() => {
        if (isPowered) {
            controls.start("visible");
            const timer = setTimeout(() => setRevealName(true), 1500); // Delay name reveal until traces are partly done
            return () => clearTimeout(timer);
        } else {
            controls.start("hidden");
            setRevealName(false);
        }
    }, [isPowered, controls]);

    // Split name for effect
    const [firstName, lastName] = title.split(' ');

    const traceVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" }
        }
    };

    return (
        <div className="relative w-full h-[400px] flex flex-col items-center justify-center p-4">

            {/* SVG Interactive Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Circuit Traces coming from edges */}
                {/* Left Trace */}
                <motion.path
                    d="M 0 200 L 100 200 L 150 150 L 250 150"
                    fill="transparent"
                    stroke={isPowered ? "#06b6d4" : "#333"}
                    strokeWidth="2"
                    variants={traceVariants}
                    initial="hidden"
                    animate={controls}
                />
                <motion.circle cx="250" cy="150" r="4" fill={isPowered ? "#06b6d4" : "#333"} initial={{ opacity: 0 }} animate={isPowered ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.5 }} />

                {/* Right Trace */}
                <motion.path
                    d="M 800 200 L 700 200 L 650 250 L 550 250"
                    fill="transparent"
                    stroke={isPowered ? "#06b6d4" : "#333"}
                    strokeWidth="2"
                    variants={traceVariants}
                    initial="hidden"
                    animate={controls}
                />
                <motion.circle cx="550" cy="250" r="4" fill={isPowered ? "#06b6d4" : "#333"} initial={{ opacity: 0 }} animate={isPowered ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.5 }} />

                {/* Top Trace */}
                <motion.path
                    d="M 400 0 L 400 50 L 350 100"
                    fill="transparent"
                    stroke={isPowered ? "#06b6d4" : "#333"}
                    strokeWidth="2"
                    variants={traceVariants}
                    initial="hidden"
                    animate={controls}
                />
                <motion.circle cx="350" cy="100" r="4" fill={isPowered ? "#06b6d4" : "#333"} initial={{ opacity: 0 }} animate={isPowered ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.5 }} />

            </svg>

            {/* Title Morphing / Signal Wave */}
            <div className="relative z-10 text-center">
                {/* Name Reveal with Glitch Effect */}
                <div className="relative mb-4">
                    <motion.div
                        className="text-4xl md:text-7xl font-black tracking-tighter"
                        initial={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
                        animate={revealName ? {
                            opacity: 1,
                            clipPath: "inset(0% 0 0% 0)",
                        } : {
                            opacity: 0,
                            clipPath: "inset(50% 0 50% 0)"
                        }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] block md:inline mr-4">{firstName}</span>
                        <span className="text-cyan-500 block md:inline">{lastName}</span>
                    </motion.div>

                    {/* Signal Wave Overlay - only shows briefly during reveal */}
                    {revealName && (
                        <motion.div
                            className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: [0, 1.5, 0] }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                </div>

                {/* Morphing Subtitle */}
                <div className="h-8 md:h-12 relative flex items-center justify-center overflow-hidden">
                    {!revealName ? (
                        // Waveform
                        <motion.svg width="200" height="40" viewBox="0 0 200 40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <motion.path
                                d="M0 20 Q 25 40, 50 20 T 100 20 T 150 20 T 200 20"
                                fill="transparent"
                                stroke="#22d3ee"
                                strokeWidth="2"
                                animate={{
                                    d: [
                                        "M0 20 Q 25 40, 50 20 T 100 20 T 150 20 T 200 20",
                                        "M0 20 Q 25 0, 50 20 T 100 20 T 150 20 T 200 20"
                                    ]
                                }}
                                transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
                            />
                        </motion.svg>
                    ) : (
                        <motion.p
                            className="text-sm md:text-xl font-mono text-cyan-400 font-bold tracking-widest"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </div>
        </div>
    );
};
