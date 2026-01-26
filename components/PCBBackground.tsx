
import React from 'react';
import { motion } from 'framer-motion';
import { PCB_COLORS } from '../constants';

interface PCBBackgroundProps {
  isPowered: boolean;
}

export const PCBBackground: React.FC<PCBBackgroundProps> = ({ isPowered }) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${PCB_COLORS.cyan} 1px, transparent 1px), linear-gradient(90deg, ${PCB_COLORS.cyan} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* SVG Traces */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <TracePath
          d="M 100,0 L 100,200 L 400,200 L 400,600 L 0,600"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={0}
        />
        <TracePath
          d="M 1200,800 L 800,800 L 800,1200 L 400,1200"
          color={PCB_COLORS.lime}
          isPowered={isPowered}
          delay={1}
        />
        <TracePath
          d="M 200,800 L 200,1000 L 600,1000"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={2}
        />
        <TracePath
          d="M 1000,100 L 1000,400 L 1400,400"
          color={PCB_COLORS.lime}
          isPowered={isPowered}
          delay={0.5}
        />
      </svg>
    </div>
  );
};

const TracePath: React.FC<{ d: string, color: string, isPowered: boolean, delay: number }> = ({ d, color, isPowered, delay }) => (
  <>
    {/* Permanent dim trace */}
    <path
      d={d}
      fill="none"
      stroke="#1a1a1a"
      strokeWidth="2"
    />
    {/* Pulse effect */}
    {isPowered && (
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="100, 1000"
        filter="url(#glow)"
        initial={{ strokeDashoffset: 1100 }}
        animate={{ strokeDashoffset: -1100 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        }}
      />
    )}
  </>
);
