import React from 'react';
import { motion } from 'framer-motion';

export const SystemFlow: React.FC = () => {
    return (
        <svg className="w-full h-full absolute inset-0 pointer-events-none z-0 opacity-30" viewBox="0 0 400 225" preserveAspectRatio="none">
            {/* Simple node network */}
            <circle cx="50" cy="112" r="4" fill="#0891b2" />
            <circle cx="200" cy="112" r="6" fill="#0891b2" />
            <circle cx="350" cy="112" r="4" fill="#0891b2" />

            {/* Connecting Lines */}
            <line x1="50" y1="112" x2="350" y2="112" stroke="#155e75" strokeWidth="2" strokeDasharray="5,5" />

            {/* Moving Packets */}
            <motion.circle
                r="3"
                fill="#22d3ee"
                initial={{ cx: 50, cy: 112, opacity: 0 }}
                animate={{
                    cx: [50, 200, 350],
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Pulse at center node */}
            <motion.circle
                cx="200"
                cy="112"
                r="10"
                stroke="#22d3ee"
                strokeWidth="1"
                fill="transparent"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </svg>
    );
};
