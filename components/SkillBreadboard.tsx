import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Globe, Zap, Radio, Database, Layout, Server, Wifi } from 'lucide-react';

interface SkillBreadboardProps {
  isPowered: boolean;
}

export const SkillBreadboard: React.FC<SkillBreadboardProps> = ({ isPowered }) => {

  const categories = [
    {
      id: "electrical",
      title: "Electrical Engineering",
      icon: Zap,
      color: "text-amber-400",
      borderColor: "border-amber-500/50",
      bgGradient: "from-amber-500/20",
      skills: [
        { name: "Circuit Analysis", level: 90 },
        { name: "Power Systems", level: 85 },
        { name: "PCB Design", level: 80 },
        { name: "Matlab / Simulink", level: 75 }
      ]
    },
    {
      id: "embedded",
      title: "Embedded Systems",
      icon: Cpu,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/50",
      bgGradient: "from-cyan-500/20",
      skills: [
        { name: "Arduino / C++", level: 95 },
        { name: "ESP32 / IoT", level: 90 },
        { name: "Microcontrollers", level: 85 },
        { name: "Sensors & Actuators", level: 88 }
      ]
    },
    {
      id: "software",
      title: "Software & Web",
      icon: Terminal,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/50",
      bgGradient: "from-emerald-500/20",
      skills: [
        { name: "React / TypeScript", level: 85 },
        { name: "Python", level: 80 },
        { name: "Node.js", level: 70 },
        { name: "Git / Version Control", level: 85 }
      ]
    },
    {
      id: "tools",
      title: "Tools & Platforms",
      icon: Database,
      color: "text-purple-400",
      borderColor: "border-purple-500/50",
      bgGradient: "from-purple-500/20",
      skills: [
        { name: "VS Code", level: 95 },
        { name: "Proteus / Multisim", level: 85 },
        { name: "Fusion 360", level: 75 },
        { name: "Firebase", level: 80 }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="mb-16 text-center">
        <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 ${isPowered ? 'text-white' : 'text-gray-800'}`}>
          Tech Stack Matrix
        </h3>
        <p className={`text-sm md:text-base font-mono max-w-2xl mx-auto ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
          // SYSTEM_CAPABILITIES: LOADED
          <br />
          Overview of technical proficiency across hardware and software domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((cat, idx) => (
          <TechPanel key={cat.id} cat={cat} idx={idx} isPowered={isPowered} />
        ))}
      </div>
    </div>
  );
};

const TechPanel: React.FC<{ cat: any; idx: number; isPowered: boolean }> = ({ cat, idx, isPowered }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1 }}
      viewport={{ once: true }}
      className={`relative rounded-xl border-t border-b overflow-hidden group
        ${isPowered
          ? 'bg-black/40 border-gray-800 hover:border-gray-700'
          : 'bg-white border-gray-200'
        }`}
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${isPowered ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isPowered ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header Panel */}
      <div className={`relative px-6 py-4 flex items-center justify-between border-b ${isPowered ? 'border-gray-800 bg-[#0a0a0a]' : 'border-gray-100 bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-opacity-10 ${cat.color} bg-current`}>
            <cat.icon size={20} />
          </div>
          <h4 className={`text-lg font-bold tracking-wide uppercase ${isPowered ? 'text-gray-200' : 'text-gray-800'}`}>
            {cat.title}
          </h4>
        </div>
        {isPowered && (
          <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full ${cat.color.replace('text-', 'bg-')} animate-pulse`} />
            <div className={`w-1 h-1 rounded-full ${cat.color.replace('text-', 'bg-')} animate-pulse delay-75`} />
            <div className={`w-1 h-1 rounded-full ${cat.color.replace('text-', 'bg-')} animate-pulse delay-150`} />
          </div>
        )}
      </div>

      {/* Skills Grid */}
      <div className="p-6 grid grid-cols-1 gap-4 relative z-10">
        {cat.skills.map((skill: any, sIdx: number) => (
          <div key={skill.name} className="relative group/skill">
            <div className="flex justify-between items-center mb-1.5">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isPowered ? 'text-gray-400 group-hover/skill:text-white transition-colors' : 'text-gray-600'}`}>
                {skill.name}
              </span>
              <span className={`text-[10px] font-mono ${isPowered ? cat.color : 'text-gray-500'}`}>
                {skill.level}%
              </span>
            </div>

            {/* Energy Bar Container */}
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isPowered ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.2 + (sIdx * 0.1), ease: "easeOut" }}
                className={`h-full rounded-full relative ${cat.color.replace('text-', 'bg-')}`}
              >
                {/* Animated Glow on Bar */}
                {isPowered && (
                  <motion.div
                    className="absolute top-0 bottom-0 right-0 w-4 bg-white/50 blur-[2px]"
                    animate={{ x: [-20, 300] }} // simple sweep
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: Math.random() }}
                  />
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Nodes Decorative */}
      {isPowered && (
        <>
          <div className={`absolute top-1/2 -left-1 w-2 h-2 rounded-full ${cat.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
          <div className={`absolute top-1/2 -right-1 w-2 h-2 rounded-full ${cat.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
        </>
      )}
    </motion.div>
  );
};

