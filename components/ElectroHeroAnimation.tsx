import React from 'react';
import { motion } from 'framer-motion';

const circuitPaths = [
  'M20 70 H190 V30 H320 V110 H460 V60 H620',
  'M30 170 H160 V220 H280 V150 H430 V240 H610',
  'M40 280 H210 V330 H360 V260 H520 V320 H640',
  'M60 370 H250 V420 H410 V360 H560 V430 H650',
];

const pulseDurations = [3.8, 4.6, 5.4, 4.2];

export const ElectroHeroAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14)_0%,rgba(8,12,24,0.4)_45%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,255,255,0.08)_0%,transparent_55%)]" />

      <svg
        viewBox="0 0 680 460"
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-75"
        role="presentation"
      >
        <defs>
          <linearGradient id="traceGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0.14)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.65)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.2)" />
          </linearGradient>
          <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {circuitPaths.map((path, index) => (
          <g key={path}>
            <path d={path} stroke="url(#traceGradient)" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="4 10" />
            <motion.circle
              r="4"
              fill="rgba(34,211,238,0.95)"
              filter="url(#pulseGlow)"
              animate={{ offsetDistance: ['0%', '100%'] }}
              transition={{ duration: pulseDurations[index], repeat: Infinity, ease: 'linear', delay: index * 0.35 }}
              style={{
                offsetPath: `path('${path}')`,
                offsetRotate: '0deg',
              }}
            />
          </g>
        ))}

        {[120, 250, 340].map((y, index) => (
          <motion.path
            key={`wave-${y}`}
            d={`M10 ${y} C 70 ${y - 16}, 110 ${y + 16}, 170 ${y} S 270 ${y - 16}, 330 ${y}  S 430 ${y + 16}, 490 ${y}  S 590 ${y - 16}, 670 ${y}`}
            stroke="rgba(16,185,129,0.42)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="12 12"
            animate={{ x: [0, 26, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          transform="translate(560 110)"
        >
          <circle cx="0" cy="0" r="32" stroke="rgba(34,211,238,0.4)" strokeWidth="2" fill="none" />
          <path d="M-10 -8 L0 -20 L10 -8 M-10 8 L0 20 L10 8" stroke="rgba(167,243,208,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="0" r="4" fill="rgba(34,211,238,0.85)" />
        </motion.g>

        <g>
          <rect x="120" y="330" width="74" height="30" rx="3" stroke="rgba(34,211,238,0.55)" strokeWidth="2" fill="rgba(7,16,32,0.35)" />
          <line x1="194" y1="345" x2="250" y2="345" stroke="rgba(34,211,238,0.45)" strokeWidth="2" />
          <line x1="120" y1="345" x2="86" y2="345" stroke="rgba(34,211,238,0.45)" strokeWidth="2" />
          <motion.circle
            cx="86"
            cy="345"
            r="3"
            fill="rgba(16,185,129,0.8)"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyan-500/15 to-transparent"
        animate={{ opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};
