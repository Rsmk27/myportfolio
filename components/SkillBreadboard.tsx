
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Globe, Code, Zap, Radio } from 'lucide-react';
import { Oscilloscope } from './Oscilloscope';
import { useState } from 'react';

interface SkillBreadboardProps {
  isPowered: boolean;
}

export const SkillBreadboard: React.FC<SkillBreadboardProps> = ({ isPowered }) => {

  // Categorized Skills Data based on user requirement
  const categories = [
    {
      title: "Core Engineering",
      icon: Zap, // Electrical
      skills: [
        "Electrical & Electronics Engineering",
        "Circuit Analysis",
        "Sensors & Actuators",
        "Power Systems"
      ]
    },
    {
      title: "Embedded Systems",
      icon: Cpu,
      skills: [
        "Arduino",
        "Microcontrollers",
        "Motor Drivers",
        "Servo Systems",
        "Firmware"
      ]
    },
    {
      title: "IoT & Automation",
      icon: Radio,
      skills: [
        "Sensors Integration",
        "Wireless Communication",
        "Smart Monitoring Systems",
        "ESP8266 / ESP32"
      ]
    },
    {
      title: "Software & Tools",
      icon: Terminal,
      skills: [
        "Web-based tools",
        "APIs",
        "Basic AI integration",
        "C / C++ / Python",
        "Git"
      ]
    },
    {
      title: "Domains",
      icon: Globe,
      skills: [
        "Smart Energy",
        "Green Tech",
        "Automation",
        "Sustainable Systems"
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-12">

        <h3 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${isPowered ? 'text-white' : 'text-gray-800'}`}>
          Technical Arsenal
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <SkillCard key={cat.title} cat={cat} idx={idx} isPowered={isPowered} />
        ))}
      </div>
    </div>
  );
};

const SkillCard: React.FC<{ cat: any; idx: number; isPowered: boolean }> = ({ cat, idx, isPowered }) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Dynamic Frequency based on hover
  const frequency = hoveredSkill ? 0.2 : 0.05;
  const amplitude = hoveredSkill ? 0.45 : 0.35;

  return (
    <div
      className={`relative p-8 rounded-2xl border transition-all duration-300 group overflow-hidden ${isPowered ? 'bg-[#0a0a0a] border-gray-800' : 'bg-transparent border-gray-900'}`}
    >
      {/* Oscilloscope Background Header */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-30 pointer-events-none">
        <Oscilloscope isPowered={isPowered} color={isPowered ? "#22d3ee" : "#333"} frequency={frequency} amplitude={amplitude} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-8 pb-4 border-b border-gray-900 mt-16">
        <cat.icon size={24} className={isPowered ? 'text-cyan-400' : 'text-gray-700'} />
        <h4 className={`text-xl font-bold uppercase tracking-wider ${isPowered ? 'text-gray-200' : 'text-gray-600'}`}>
          {cat.title}
        </h4>
      </div>

      {/* Skill Pills */}
      <div className="relative z-10 bg-[#111]/50 rounded-xl p-2 space-y-3">
        {cat.skills.map((skill: string, sIdx: number) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 + sIdx * 0.05 }}
            onHoverStart={() => setHoveredSkill(skill)}
            onHoverEnd={() => setHoveredSkill(null)}
            className={`relative px-4 py-3 rounded-lg border text-sm font-mono font-bold tracking-wide transition-all cursor-crosshair
                          ${isPowered
                ? 'bg-[#151515] border-gray-800 text-gray-400 hover:border-cyan-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                : 'bg-black border-gray-900 text-gray-700'
              }`}
          >
            {isPowered && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            <div className="flex justify-between items-center">
              <span>{skill}</span>
              {/* Visual indicator of "frequency" per skill, just a small bit */}
              {hoveredSkill === skill && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-500"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

