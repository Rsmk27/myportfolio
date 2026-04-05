import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Code2, Zap, BatteryCharging, Cog, Globe, type LucideIcon } from 'lucide-react';

interface SkillBreadboardProps {
  isPowered: boolean;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  label: string;
  accent: string;        // hex
  textClass: string;
  badgeClass: string;
  glowClass: string;
  borderClass: string;
  bgClass: string;
  skills: string[];
  note?: string;         // optional footnote e.g. "AI-assisted"
}

const CATEGORIES: SkillCategory[] = [
  {
    id: 'embedded',
    title: 'Embedded Systems & Hardware',
    icon: Cpu,
    label: 'Core Domain',
    accent: '#22d3ee',
    textClass: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/25 hover:bg-cyan-500/20 hover:border-cyan-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(34,211,238,0.22)]',
    borderClass: 'border-cyan-500/30',
    bgClass: 'from-cyan-950/20 to-transparent',
    skills: ['ESP32', 'ESP8266', 'Arduino', 'UART', 'I2C', 'SPI', 'MQTT', 'Sensors & Actuators'],
  },
  {
    id: 'iot',
    title: 'Internet of Things',
    icon: Wifi,
    label: 'Connectivity',
    accent: '#38bdf8',
    textClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-400/25 hover:bg-sky-500/20 hover:border-sky-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(56,189,248,0.22)]',
    borderClass: 'border-sky-500/30',
    bgClass: 'from-sky-950/20 to-transparent',
    skills: ['IoT System Design', 'Cloud Integration', 'Real-time Monitoring'],
  },
  {
    id: 'programming',
    title: 'Programming Languages',
    icon: Code2,
    label: 'Firmware & Scripting',
    accent: '#34d399',
    textClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/25 hover:bg-emerald-500/20 hover:border-emerald-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(52,211,153,0.22)]',
    borderClass: 'border-emerald-500/30',
    bgClass: 'from-emerald-950/20 to-transparent',
    skills: ['C', 'Embedded C', 'Assembly', 'Python', 'MATLAB'],
  },
  {
    id: 'power',
    title: 'Power Systems',
    icon: Zap,
    label: 'Power Domain',
    accent: '#f59e0b',
    textClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-400/25 hover:bg-amber-500/20 hover:border-amber-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(245,158,11,0.22)]',
    borderClass: 'border-amber-500/30',
    bgClass: 'from-amber-950/20 to-transparent',
    skills: ['Power Generation', 'Transmission & Distribution', 'Smart Grid Concepts', 'MATLAB Simulation'],
  },
  {
    id: 'electronics',
    title: 'Power Electronics',
    icon: BatteryCharging,
    label: 'Conversion & Control',
    accent: '#f97316',
    textClass: 'text-orange-400',
    badgeClass: 'bg-orange-500/10 text-orange-300 border-orange-400/25 hover:bg-orange-500/20 hover:border-orange-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(249,115,22,0.22)]',
    borderClass: 'border-orange-500/30',
    bgClass: 'from-orange-950/20 to-transparent',
    skills: ['Converters', 'Inverters', 'Motor Drives', 'Thyristors', 'Choppers', 'PWM Control'],
  },
  {
    id: 'machines',
    title: 'Electrical Machines',
    icon: Cog,
    label: 'Machines & Transformers',
    accent: '#a78bfa',
    textClass: 'text-violet-400',
    badgeClass: 'bg-violet-500/10 text-violet-300 border-violet-400/25 hover:bg-violet-500/20 hover:border-violet-400/50',
    glowClass: 'shadow-[0_0_28px_rgba(167,139,250,0.22)]',
    borderClass: 'border-violet-500/30',
    bgClass: 'from-violet-950/20 to-transparent',
    skills: ['DC & AC Machines', 'Transformers', 'Electrical Motors'],
  },
  {
    id: 'web',
    title: 'Additional Skills',
    icon: Globe,
    label: 'AI-Assisted',
    accent: '#6b7280',
    textClass: 'text-gray-400',
    badgeClass: 'bg-gray-700/30 text-gray-400 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50',
    glowClass: 'shadow-[0_0_28px_rgba(107,114,128,0.14)]',
    borderClass: 'border-gray-700/30',
    bgClass: 'from-gray-900/30 to-transparent',
    skills: ['React.js', 'Next.js', 'Firebase', 'Firestore', 'React Native', 'Expo'],
    note: 'Built with AI assistance — not primary expertise',
  },
];

/* ── Skill Chip ────────────────────────────────────────── */
const SkillChip: React.FC<{ label: string; badgeClass: string; delay: number; isPowered: boolean }> = ({
  label, badgeClass, delay, isPowered
}) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, delay }}
    className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[11px] md:text-xs font-mono
      tracking-wide cursor-default transition-all duration-200 select-none
      ${isPowered ? badgeClass : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}
  >
    {label}
  </motion.span>
);

/* ── Category Card ─────────────────────────────────────── */
const CategoryCard: React.FC<{
  cat: SkillCategory;
  idx: number;
  isActive: boolean;
  isPowered: boolean;
  onActivate: () => void;
}> = ({ cat, idx, isActive, isPowered, onActivate }) => {
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      onClick={onActivate}
      className={`relative rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-400
        ${isPowered
          ? `bg-black/50 backdrop-blur-sm ${isActive ? `border-[${cat.accent}]/40 ${cat.glowClass}` : 'border-gray-800 hover:border-gray-600'}`
          : `bg-white border-gray-200 hover:border-gray-400 ${isActive ? 'shadow-md' : ''}`
        }`}
      style={isPowered && isActive ? { borderColor: `${cat.accent}50` } : {}}
    >
      {/* BG glow blob */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
        style={{ background: `${cat.accent}18`, opacity: isActive ? 1 : 0.4 }}
      />

      {/* Active scan line at bottom */}
      {isPowered && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          animate={isActive ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)` }}
        />
      )}

      {/* Header */}
      <div className={`relative px-5 pt-5 pb-4 border-b ${isPowered ? 'border-gray-800/70' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border transition-all duration-300
                ${isPowered
                  ? `border-[${cat.accent}]/20 bg-[${cat.accent}]/10` 
                  : 'border-gray-200 bg-gray-50'
                }`}
              style={isPowered ? { borderColor: `${cat.accent}30`, background: `${cat.accent}12` } : {}}
            >
              <Icon size={16} style={{ color: isPowered ? cat.accent : '#374151' }} />
            </div>
            <div>
              <p className={`text-[9px] uppercase tracking-[0.25em] mb-0.5 font-mono ${isPowered ? 'text-gray-500' : 'text-gray-400'}`}>
                {cat.label}
              </p>
              <h4 className={`text-sm font-bold tracking-tight leading-tight ${isPowered ? 'text-gray-100' : 'text-gray-800'}`}>
                {cat.title}
              </h4>
            </div>
          </div>
          {/* Pulse indicator */}
          {isPowered && (
            <motion.div
              animate={isActive ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.25 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="flex-shrink-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.accent }}
            />
          )}
        </div>
      </div>

      {/* Skills Chips */}
      <div className="relative p-5">
        <div className="flex flex-wrap gap-2">
          {cat.skills.map((skill, si) => (
            <SkillChip
              key={skill}
              label={skill}
              badgeClass={cat.badgeClass}
              delay={si * 0.04}
              isPowered={isPowered}
            />
          ))}
        </div>
        {cat.note && (
          <p className={`mt-3 text-[10px] font-mono tracking-wide italic ${isPowered ? 'text-gray-600' : 'text-gray-400'}`}>
            ※ {cat.note}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ══ Main Component ══════════════════════════════════════ */
export const SkillBreadboard: React.FC<SkillBreadboardProps> = ({ isPowered }) => {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const activeCategory = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  const coreCategories = CATEGORIES.filter((c) => c.id !== 'web');
  const additionalCategory = CATEGORIES.find((c) => c.id === 'web')!;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">

      {/* Background glow blob that follows active accent */}
      <div className="absolute inset-x-0 top-0 pointer-events-none flex justify-center overflow-hidden">
        <motion.div
          animate={isPowered ? { opacity: [0.15, 0.28, 0.15] } : { opacity: 0.08 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[70%] h-64 blur-3xl rounded-full"
          style={{ background: `radial-gradient(circle, ${activeCategory.accent}60 0%, transparent 70%)` }}
        />
      </div>

      {/* Section heading */}
      <div className="relative mb-14 text-center">
        <p className={`text-[10px] uppercase tracking-[0.35em] mb-3 font-mono ${isPowered ? 'text-gray-500' : 'text-gray-500'}`}>
          // domain_map.json
        </p>
        <h3
          className={`text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 ${isPowered ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Skills Engine
        </h3>
        <p className={`text-sm font-mono max-w-xl mx-auto ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
          Domain expertise across hardware, firmware, power systems &amp; more.
        </p>
      </div>

      {/* Core 6 categories — 2-col grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-4">
        {coreCategories.map((cat, idx) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            idx={idx}
            isActive={cat.id === activeId}
            isPowered={isPowered}
            onActivate={() => setActiveId(cat.id)}
          />
        ))}
      </div>

      {/* Additional / AI-Assisted — full width, visually distinct */}
      <div className="relative">
        <CategoryCard
          cat={additionalCategory}
          idx={6}
          isActive={additionalCategory.id === activeId}
          isPowered={isPowered}
          onActivate={() => setActiveId(additionalCategory.id)}
        />
      </div>

      {/* Domain filter pills at bottom */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] border rounded-full
                transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                ${isActive
                  ? ''
                  : isPowered
                    ? 'border-gray-700/60 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                }`}
              style={isActive && isPowered
                ? { borderColor: `${cat.accent}60`, color: cat.accent, background: `${cat.accent}12` }
                : isActive
                  ? { borderColor: '#374151', color: '#111827', background: '#f3f4f6' }
                  : {}
              }
              aria-label={`Filter to ${cat.title}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
