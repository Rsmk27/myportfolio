import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PCB_COLORS } from '../constants';

interface PCBBackgroundProps {
  isPowered: boolean;
}

export const PCBBackground: React.FC<PCBBackgroundProps> = ({ isPowered }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {isPowered && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(400px circle at 50% 50%, rgba(0,242,255,0.08), rgba(0,0,0,0))',
          }}
        />
      )}
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${PCB_COLORS.cyan} 1px, transparent 1px), linear-gradient(90deg, ${PCB_COLORS.cyan} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* SVG Traces */}
      <svg viewBox="0 0 1400 1200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <TracePath
          d="M 100,0 L 100,200 L 400,200 L 400,600 L 0,600"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={0}
          isMobile={isMobile}
        />
        <TracePath
          d="M 1200,800 L 800,800 L 800,1200 L 400,1200"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={1}
          isMobile={isMobile}
        />
        <TracePath
          d="M 200,800 L 200,1000 L 600,1000"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={2}
          isMobile={isMobile}
        />
        <TracePath
          d="M 1000,100 L 1000,400 L 1400,400"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={0.5}
          isMobile={isMobile}
        />
        {/* Mobile Friendly Traces */}
        <TracePath
          d="M 50,50 L 50,150 L 200,150"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={1.5}
          isMobile={isMobile}
        />
        <TracePath
          d="M 300,300 L 300,500 L 100,500"
          color={PCB_COLORS.cyan}
          isPowered={isPowered}
          delay={2.5}
          isMobile={isMobile}
        />
      </svg>
    </div>
  );
};

const TracePath: React.FC<{ d: string, color: string, isPowered: boolean, delay: number, isMobile: boolean }> = ({ d, color, isPowered, delay, isMobile }) => (
  <>
    {/* Permanent dim trace */}
    <path
      d={d}
      fill="none"
      stroke="#1a1a1a"
      strokeWidth="2"
    />
    {/* Pulse effect */}
    {isPowered && !isMobile && (
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="100, 1000"
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
