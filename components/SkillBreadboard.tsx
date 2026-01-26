
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Globe, Code, Zap, Radio } from 'lucide-react';

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
          <div
            key={cat.title}
            className={`relative p-8 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 ${isPowered ? 'bg-[#0a0a0a] border-gray-800' : 'bg-transparent border-gray-900'}`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-900">
              <cat.icon size={24} className={isPowered ? 'text-cyan-400' : 'text-gray-700'} />
              <h4 className={`text-xl font-bold uppercase tracking-wider ${isPowered ? 'text-gray-200' : 'text-gray-600'}`}>
                {cat.title}
              </h4>
            </div>

            {/* Skill Pills */}
            <div className="bg-[#111]/50 rounded-xl p-2 space-y-3">
              {cat.skills.map((skill, sIdx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + sIdx * 0.05 }}
                  className={`relative px-4 py-3 rounded-lg border text-sm font-mono font-bold tracking-wide transition-all
                                        ${isPowered
                      ? 'bg-[#151515] border-gray-800 text-gray-400 hover:border-cyan-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(0,242,255,0.1)]'
                      : 'bg-black border-gray-900 text-gray-700'
                    }`}
                >
                  {isPowered && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  {skill}
                </motion.div>
              ))}
            </div>

            {/* Decorative Background Icon (Faded) */}
            <div className="absolute top-4 right-4 opacity-[0.03] pointer-events-none">
              <cat.icon size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
