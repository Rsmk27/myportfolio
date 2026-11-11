import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PCB_COLORS } from '../constants';

interface PCBBackgroundProps {
  isPowered: boolean;
}

interface TraceRoute {
  id: string;
  d: string;
  rail: 'signal' | 'power' | 'bus';
  delay: number;
  duration: number;
  width?: number;
  vias?: Array<[number, number]>;
}

// 45-degree chamfered PCB routes across 1400x1200 substrate
const DESKTOP_ROUTES: TraceRoute[] = [
  // Primary north-west SPI/telemetry bus pair
  {
    id: 'nw-bus-a',
    d: 'M 90,0 L 90,150 L 140,200 L 380,200 L 430,250 L 430,530 L 380,580 L 0,580',
    rail: 'signal',
    delay: 0,
    duration: 4.6,
    vias: [
      [140, 200],
      [430, 530],
    ],
  },
  {
    id: 'nw-bus-b',
    d: 'M 106,0 L 106,144 L 150,188 L 388,188 L 444,244 L 444,538 L 388,594 L 0,594',
    rail: 'bus',
    delay: 0.45,
    duration: 4.6,
    vias: [[388, 188]],
  },
  // South-east power distribution & Modbus telemetry rail
  {
    id: 'se-power',
    d: 'M 1400,760 L 1180,760 L 1120,820 L 840,820 L 790,870 L 790,1120 L 730,1180 L 420,1180',
    rail: 'power',
    delay: 0.9,
    duration: 5.8,
    width: 2.5,
    vias: [
      [1120, 820],
      [790, 870],
      [420, 1180],
    ],
  },
  // South-west sensor return trace
  {
    id: 'sw-sensor',
    d: 'M 190,780 L 190,940 L 240,990 L 560,990 L 610,1040 L 610,1200',
    rail: 'signal',
    delay: 2.1,
    duration: 4.9,
    vias: [
      [190, 780],
      [560, 990],
    ],
  },
  // North-east clock & Ethernet PHY lane
  {
    id: 'ne-clock',
    d: 'M 980,0 L 980,140 L 1030,190 L 1030,360 L 1080,410 L 1400,410',
    rail: 'signal',
    delay: 0.7,
    duration: 4.2,
    vias: [
      [1030, 190],
      [1080, 410],
    ],
  },
  {
    id: 'ne-clock-pair',
    d: 'M 996,0 L 996,134 L 1044,182 L 1044,352 L 1088,396 L 1400,396',
    rail: 'bus',
    delay: 1.15,
    duration: 4.2,
  },
  // Mid-board MCU cross-connect
  {
    id: 'mid-mcu-a',
    d: 'M 540,120 L 620,120 L 670,170 L 820,170 L 860,210',
    rail: 'power',
    delay: 1.6,
    duration: 5.2,
    vias: [
      [540, 120],
      [860, 210],
    ],
  },
  {
    id: 'mid-mcu-b',
    d: 'M 1240,560 L 1140,560 L 1090,610 L 920,610 L 870,660',
    rail: 'bus',
    delay: 2.8,
    duration: 5.0,
    vias: [
      [1240, 560],
      [870, 660],
    ],
  },
];

// Streamlined routes for mobile viewports to keep draw calls minimal
const MOBILE_ROUTES: TraceRoute[] = [
  {
    id: 'm-nw',
    d: 'M 60,0 L 60,130 L 100,170 L 240,170',
    rail: 'signal',
    delay: 0,
    duration: 5,
    vias: [[240, 170]],
  },
  {
    id: 'm-mid',
    d: 'M 320,320 L 320,460 L 270,510 L 90,510',
    rail: 'power',
    delay: 1.2,
    duration: 6,
    vias: [
      [320, 320],
      [90, 510],
    ],
  },
  {
    id: 'm-se',
    d: 'M 1050,820 L 880,820 L 830,870 L 830,1100',
    rail: 'bus',
    delay: 0.6,
    duration: 5.5,
    vias: [[1050, 820]],
  },
];

// Subtle SMD IC pad islands & decoupling outlines positioned in quiet board zones
const IC_FOOTPRINTS: Array<{ x: number; y: number; label: string; pins: number }> = [
  { x: 510, y: 92, label: 'U1 // MCU', pins: 4 },
  { x: 1236, y: 536, label: 'J3 // BUS', pins: 3 },
];

export const PCBBackground: React.FC<PCBBackgroundProps> = ({ isPowered }) => {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const routes = isMobile ? MOBILE_ROUTES : DESKTOP_ROUTES;
  const gridColor = isPowered ? 'rgba(0, 242, 255, 0.045)' : 'rgba(245, 158, 11, 0.032)';
  const subGridColor = isPowered ? 'rgba(255, 255, 255, 0.022)' : 'rgba(161, 161, 170, 0.018)';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-[#050607]"
    >
      {/* Solder-Mask Obsidian Ambient Field */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isPowered
            ? 'radial-gradient(620px circle at 24% 22%, rgba(0, 242, 255, 0.085), transparent 70%), radial-gradient(540px circle at 78% 76%, rgba(255, 174, 0, 0.045), transparent 72%), radial-gradient(900px circle at 50% 50%, rgba(12, 20, 24, 0.55), rgba(5, 6, 7, 0.95))'
            : 'radial-gradient(580px circle at 26% 24%, rgba(245, 158, 11, 0.055), transparent 70%), radial-gradient(620px circle at 74% 78%, rgba(161, 161, 170, 0.035), transparent 72%), radial-gradient(900px circle at 50% 50%, rgba(15, 14, 12, 0.55), rgba(5, 6, 7, 0.96))',
        }}
      />

      {/* Dual-Pitch CAD Silkscreen & Reference Grid */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px),
            linear-gradient(${subGridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${subGridColor} 1px, transparent 1px)
          `,
          backgroundSize: '160px 160px, 160px 160px, 32px 32px, 32px 32px',
        }}
      />

      {/* Solder-Mask Micro-Texture & Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 48%, rgba(3, 4, 5, 0.72) 100%)',
        }}
      />

      {/* Vector Copper Traces, Annular Vias & Signal Telemetry Pulses */}
      <svg
        viewBox="0 0 1400 1200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {/* Fiducial registration targets & micro-silkscreen board metadata */}
        <g opacity={isPowered ? 0.22 : 0.14} className="transition-opacity duration-700">
          <FiducialMark x={34} y={34} isPowered={isPowered} />
          <FiducialMark x={1366} y={34} isPowered={isPowered} />
          <FiducialMark x={34} y={1166} isPowered={isPowered} />
          <FiducialMark x={1366} y={1166} isPowered={isPowered} />
          <text
            x="56"
            y="1170"
            fill={isPowered ? '#94a3b8' : '#71717a'}
            fontSize="9"
            fontFamily="'Space Mono', monospace"
            letterSpacing="2.4"
          >
            PCB-REV3.0 // FR4-OBSIDIAN // {isPowered ? 'RAIL: 5V0_ONLINE' : 'RAIL: STANDBY_LP'}
          </text>
        </g>

        {/* Subtle IC Silkscreen Pads */}
        {!isMobile &&
          IC_FOOTPRINTS.map((ic) => (
            <ICFootprint
              key={ic.label}
              x={ic.x}
              y={ic.y}
              label={ic.label}
              pins={ic.pins}
              isPowered={isPowered}
            />
          ))}

        {/* Copper Under-Traces + Animated Telemetry Pulses */}
        {routes.map((route) => (
          <TracePath
            key={route.id}
            route={route}
            isPowered={isPowered}
            isMobile={isMobile}
            reducedMotion={prefersReducedMotion}
          />
        ))}
      </svg>
    </div>
  );
};

const FiducialMark: React.FC<{ x: number; y: number; isPowered: boolean }> = ({
  x,
  y,
  isPowered,
}) => {
  const stroke = isPowered ? '#00f2ff' : '#f59e0b';
  const pad = isPowered ? '#e5b869' : '#71717a';
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="8" fill="none" stroke={stroke} strokeWidth="0.75" />
      <circle cx="0" cy="0" r="2.2" fill={pad} />
      <line x1="-13" y1="0" x2="-5" y2="0" stroke={stroke} strokeWidth="0.75" />
      <line x1="5" y1="0" x2="13" y2="0" stroke={stroke} strokeWidth="0.75" />
      <line x1="0" y1="-13" x2="0" y2="-5" stroke={stroke} strokeWidth="0.75" />
      <line x1="0" y1="5" x2="0" y2="13" stroke={stroke} strokeWidth="0.75" />
    </g>
  );
};

const ICFootprint: React.FC<{
  x: number;
  y: number;
  label: string;
  pins: number;
  isPowered: boolean;
}> = ({ x, y, label, pins, isPowered }) => {
  const padFill = isPowered ? 'rgba(200, 138, 75, 0.22)' : 'rgba(161, 161, 170, 0.14)';
  const outlineStroke = isPowered ? 'rgba(0, 242, 255, 0.16)' : 'rgba(245, 158, 11, 0.12)';
  const width = pins * 12 + 12;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x="0"
        y="0"
        width={width}
        height="34"
        rx="2"
        fill="rgba(10, 12, 14, 0.55)"
        stroke={outlineStroke}
        strokeWidth="0.9"
        strokeDasharray="4 3"
      />
      <circle cx="6" cy="6" r="1.5" fill={outlineStroke} />
      {Array.from({ length: pins }).map((_, idx) => {
        const px = 8 + idx * 12;
        return (
          <React.Fragment key={idx}>
            <rect x={px} y="-4" width="6" height="4" rx="0.8" fill={padFill} />
            <rect x={px} y="34" width="6" height="4" rx="0.8" fill={padFill} />
          </React.Fragment>
        );
      })}
      <text
        x={width / 2}
        y="20"
        textAnchor="middle"
        fill={isPowered ? 'rgba(0, 242, 255, 0.24)' : 'rgba(245, 158, 11, 0.20)'}
        fontSize="7.5"
        fontFamily="'Space Mono', monospace"
        letterSpacing="1"
      >
        {label}
      </text>
    </g>
  );
};

const TracePath: React.FC<{
  route: TraceRoute;
  isPowered: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}> = ({ route, isPowered, isMobile, reducedMotion }) => {
  const strokeWidth = route.width ?? 1.8;

  // Copper-under-solder-mask base color
  const baseTraceColor = isPowered
    ? route.rail === 'power'
      ? '#261e14'
      : '#132428'
    : '#1a1815';

  // Energized vs Standby pulse color
  const pulseColor = isPowered
    ? route.rail === 'power'
      ? '#ffae00'
      : route.rail === 'bus'
        ? '#38bdf8'
        : PCB_COLORS.cyan
    : '#f59e0b';

  const shouldAnimateOnline = isPowered && !isMobile && !reducedMotion;
  const shouldAnimateStandby = !isPowered && !isMobile && !reducedMotion && route.rail === 'power';

  const viaRingStroke = isPowered
    ? route.rail === 'power'
      ? 'rgba(255, 174, 0, 0.45)'
      : 'rgba(0, 242, 255, 0.36)'
    : 'rgba(245, 158, 11, 0.22)';

  const viaCopperRing = isPowered
    ? 'rgba(229, 184, 105, 0.38)'
    : 'rgba(161, 161, 170, 0.20)';

  return (
    <g>
      {/* Solder-mask copper trace bed */}
      <path
        d={route.d}
        fill="none"
        stroke={baseTraceColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Fine metallic core trace for crisp hardware depth */}
      <path
        d={route.d}
        fill="none"
        stroke={isPowered ? 'rgba(0, 242, 255, 0.08)' : 'rgba(245, 158, 11, 0.05)'}
        strokeWidth={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ONLINE telemetry signal pulse + lightweight soft halo (no SVG blur filter) */}
      {shouldAnimateOnline && (
        <>
          <motion.path
            d={route.d}
            fill="none"
            stroke={pulseColor}
            strokeOpacity={0.18}
            strokeWidth={strokeWidth + 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="110, 1100"
            initial={{ strokeDashoffset: 1210 }}
            animate={{ strokeDashoffset: -1210 }}
            transition={{
              duration: route.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: route.delay,
            }}
          />
          <motion.path
            d={route.d}
            fill="none"
            stroke={pulseColor}
            strokeOpacity={0.9}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="95, 1115"
            initial={{ strokeDashoffset: 1210 }}
            animate={{ strokeDashoffset: -1210 }}
            transition={{
              duration: route.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: route.delay,
            }}
          />
        </>
      )}

      {/* STANDBY low-power trickle heartbeat on power rail */}
      {shouldAnimateStandby && (
        <motion.path
          d={route.d}
          fill="none"
          stroke={pulseColor}
          strokeOpacity={0.34}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="55, 1155"
          initial={{ strokeDashoffset: 1210 }}
          animate={{ strokeDashoffset: -1210 }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: 'linear',
            delay: route.delay,
          }}
        />
      )}

      {/* Plated-Through-Hole (PTH) Annular Vias */}
      {route.vias?.map(([vx, vy], idx) => (
        <g key={`${route.id}-via-${idx}`} transform={`translate(${vx}, ${vy})`}>
          <circle cx="0" cy="0" r="6" fill="none" stroke={viaRingStroke} strokeWidth="0.9" />
          <circle cx="0" cy="0" r="3.6" fill="#060708" stroke={viaCopperRing} strokeWidth="1.4" />
          <circle cx="0" cy="0" r="1.4" fill="#040506" />
        </g>
      ))}
    </g>
  );
};
