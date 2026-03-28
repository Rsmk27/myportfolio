import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Zap, Database, type LucideIcon } from 'lucide-react';

interface SkillBreadboardProps {
  isPowered: boolean;
}

interface SkillMetric {
  name: string;
  level: number;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  label: string;
  lineColor: string;
  textColor: string;
  badgeClass: string;
  glowClass: string;
  trackClass: string;
  borderClass: string;
  skills: SkillMetric[];
}

export const SkillBreadboard: React.FC<SkillBreadboardProps> = ({ isPowered }) => {
  const categories: SkillCategory[] = [
    {
      id: 'electrical',
      title: 'Electrical Engineering',
      icon: Zap,
      label: 'Power Domain',
      lineColor: '#f59e0b',
      textColor: 'text-amber-400',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
      glowClass: 'shadow-[0_0_22px_rgba(245,158,11,0.35)]',
      trackClass: 'from-amber-500 to-orange-300',
      borderClass: 'hover:border-amber-400/45',
      skills: [
        { name: 'Circuit Analysis', level: 90 },
        { name: 'Power Systems', level: 85 },
        { name: 'PCB Design', level: 80 },
        { name: 'Matlab / Simulink', level: 75 }
      ]
    },
    {
      id: 'embedded',
      title: 'Embedded Systems',
      icon: Cpu,
      label: 'Real-Time Core',
      lineColor: '#22d3ee',
      textColor: 'text-cyan-400',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
      glowClass: 'shadow-[0_0_22px_rgba(34,211,238,0.35)]',
      trackClass: 'from-cyan-500 to-sky-300',
      borderClass: 'hover:border-cyan-400/45',
      skills: [
        { name: 'Arduino / C++', level: 95 },
        { name: 'ESP32 / IoT', level: 90 },
        { name: 'Microcontrollers', level: 85 },
        { name: 'Sensors & Actuators', level: 88 }
      ]
    },
    {
      id: 'software',
      title: 'Software & Web',
      icon: Terminal,
      label: 'Application Layer',
      lineColor: '#34d399',
      textColor: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
      glowClass: 'shadow-[0_0_22px_rgba(52,211,153,0.35)]',
      trackClass: 'from-emerald-500 to-lime-300',
      borderClass: 'hover:border-emerald-400/45',
      skills: [
        { name: 'React / TypeScript', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'Node.js', level: 70 },
        { name: 'Git / Version Control', level: 85 }
      ]
    },
    {
      id: 'tools',
      title: 'Tools & Platforms',
      icon: Database,
      label: 'Delivery Stack',
      lineColor: '#a78bfa',
      textColor: 'text-violet-400',
      badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
      glowClass: 'shadow-[0_0_22px_rgba(167,139,250,0.35)]',
      trackClass: 'from-violet-500 to-fuchsia-300',
      borderClass: 'hover:border-violet-400/45',
      skills: [
        { name: 'VS Code', level: 95 },
        { name: 'Proteus / Multisim', level: 85 },
        { name: 'Fusion 360', level: 75 },
        { name: 'Firebase', level: 80 }
      ]
    }
  ];

  const [activeId, setActiveId] = useState(categories[0].id);
  const activeCategory = categories.find((cat) => cat.id === activeId) ?? categories[0];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="absolute inset-x-0 top-12 pointer-events-none flex justify-center">
        <motion.div
          animate={isPowered ? { scale: [1, 1.08, 1], opacity: [0.22, 0.4, 0.22] } : { scale: 1, opacity: 0.12 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[88%] h-48 blur-3xl rounded-full"
          style={{
            background: `radial-gradient(circle, ${activeCategory.lineColor}55 0%, transparent 72%)`
          }}
        />
      </div>

      <div className="relative mb-14 md:mb-16 text-center">
        <p className={`text-xs md:text-sm uppercase tracking-[0.35em] mb-3 ${isPowered ? 'text-gray-500' : 'text-gray-500'}`}>
          Signal Constellation
        </p>
        <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tight mb-5 ${isPowered ? 'text-white' : 'text-gray-900'}`}>
          Skills Engine
        </h3>
        <p className={`text-sm md:text-base font-mono max-w-3xl mx-auto leading-relaxed ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>
          A live map of domain strengths, from hardware depth to software delivery.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((cat, idx) => (
          <TechPanel
            key={cat.id}
            cat={cat}
            idx={idx}
            isPowered={isPowered}
            isActive={cat.id === activeId}
            onActivate={() => setActiveId(cat.id)}
          />
        ))}
      </div>

      <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onMouseEnter={() => setActiveId(cat.id)}
            onFocus={() => setActiveId(cat.id)}
            onClick={() => setActiveId(cat.id)}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] border rounded-full transition-all duration-300 ${cat.id === activeId
              ? `${cat.badgeClass} ${cat.glowClass}`
              : isPowered
                ? 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
              }`}
            aria-label={`Highlight ${cat.title}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const TechPanel: React.FC<{
  cat: SkillCategory;
  idx: number;
  isPowered: boolean;
  isActive: boolean;
  onActivate: () => void;
}> = ({ cat, idx, isPowered, isActive, onActivate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={onActivate}
      transition={{ duration: 0.35, delay: idx * 0.08 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border overflow-hidden group transition-all duration-500
        ${isPowered
          ? `bg-black/45 border-gray-800 ${cat.borderClass}`
          : `bg-white border-gray-200 ${cat.borderClass}`
        }`}
    >
      {/* Layered board texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${isPowered ? '#f8fafc' : '#0f172a'} 1px, transparent 1px), linear-gradient(90deg, ${isPowered ? '#f8fafc' : '#0f172a'} 1px, transparent 1px)`,
          backgroundSize: '18px 18px'
        }}
      />
      <div
        className="absolute -right-16 -top-20 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${cat.lineColor}22` }}
      />

      <div className={`relative px-6 pt-6 pb-4 border-b ${isPowered ? 'border-gray-800/80' : 'border-gray-100'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border ${cat.badgeClass}`}>
              <cat.icon size={18} />
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-[0.22em] mb-1 ${isPowered ? 'text-gray-500' : 'text-gray-500'}`}>
                {cat.label}
              </p>
              <h4 className={`text-lg font-bold uppercase tracking-wide ${isPowered ? 'text-gray-100' : 'text-gray-900'}`}>
                {cat.title}
              </h4>
            </div>
          </div>

          <motion.div
            animate={isActive && isPowered ? { opacity: [0.45, 1, 0.45] } : { opacity: 0.5 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 pt-1"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.lineColor }} />
            <div className="w-5 h-px" style={{ backgroundColor: `${cat.lineColor}AA` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.lineColor }} />
          </motion.div>
        </div>
      </div>

      {/* Skills lattice */}
      <div className="p-6 relative z-10 space-y-4">
        {cat.skills.map((skill, sIdx) => (
          <div key={skill.name} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] md:text-xs font-mono font-semibold uppercase tracking-[0.12em] ${isPowered ? 'text-gray-300' : 'text-gray-700'}`}>
                {skill.name}
              </span>
              <span className={`text-[10px] font-mono ${cat.textColor}`}>
                {skill.level}%
              </span>
            </div>

            <div className={`relative h-2 rounded-full overflow-hidden ${isPowered ? 'bg-gray-900/80' : 'bg-gray-200/80'}`}>
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  backgroundImage: isPowered
                    ? 'repeating-linear-gradient(90deg, transparent 0, transparent 7px, rgba(148,163,184,0.2) 7px, rgba(148,163,184,0.2) 8px)'
                    : 'repeating-linear-gradient(90deg, transparent 0, transparent 7px, rgba(71,85,105,0.2) 7px, rgba(71,85,105,0.2) 8px)'
                }}
              />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 1.05, delay: 0.18 + sIdx * 0.11, ease: 'easeOut' }}
                viewport={{ once: true }}
                className={`relative h-full rounded-full bg-gradient-to-r ${cat.trackClass}`}
              >
                {isPowered && (
                  <motion.div
                    className="absolute inset-y-0 right-0 w-5 bg-white/40 blur-[2px]"
                    animate={isActive ? { x: [-20, 14, -20] } : { x: 0 }}
                    transition={{ duration: 2.1, repeat: Infinity, delay: sIdx * 0.2, ease: 'linear' }}
                  />
                )}
              </motion.div>
            </div>
          </div>
        ))}

        <div className="pt-1 flex items-center gap-3">
          <div className={`h-px flex-1 ${isPowered ? 'bg-gray-700/70' : 'bg-gray-300'}`} />
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isPowered ? 'text-gray-500' : 'text-gray-500'}`}>
            calibrated
          </span>
        </div>
      </div>

      {isPowered && isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.22, 0.38, 0.22] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`pointer-events-none absolute inset-0 ${cat.glowClass}`}
          style={{ boxShadow: `inset 0 0 65px ${cat.lineColor}18` }}
        />
      )}

      <div
        className="pointer-events-none absolute left-6 right-6 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${cat.lineColor}80, transparent)`
        }}
      />

      {isPowered && (
        <>
          <div className="absolute left-4 top-4 w-2 h-2 rounded-full" style={{ backgroundColor: cat.lineColor }} />
          <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full" style={{ backgroundColor: cat.lineColor }} />
        </>
      )}
    </motion.div>
  );
};

