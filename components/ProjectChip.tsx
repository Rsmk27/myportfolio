
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu } from 'lucide-react';
import { ElectricCard } from './ui/electric-card';

interface ProjectChipProps {
  project: Project;
  isPowered: boolean;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({ project, isPowered }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="relative group p-5"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      initial={{ scale: 1, zIndex: 0 }}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      transition={{ duration: 0.3 }}
    >
      {/* IC Pins - Left */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-0">
        {[...Array(4)].map((_, i) => (
          <Pin key={`l-${i}`} active={isPowered} delay={i * 0.1} />
        ))}
      </div>

      {/* IC Pins - Right */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-0">
        {[...Array(4)].map((_, i) => (
          <Pin key={`r-${i}`} active={isPowered} delay={i * 0.1} />
        ))}
      </div>

      {/* Main Package / Electric Card */}
      <div className="relative z-10">
        <div className="bg-black rounded-[1.5em] relative">
          {/* Connecting lines to pins */}
          <div className={`absolute top-0 bottom-0 -left-1 w-2 transition-colors ${isPowered ? 'bg-cyan-900/50' : 'bg-[#111]'}`} />
          <div className={`absolute top-0 bottom-0 -right-1 w-2 transition-colors ${isPowered ? 'bg-cyan-900/50' : 'bg-[#111]'}`} />

          <ElectricCard
            variant={isPowered ? "hue" : "swirl"}
            color={isPowered ? "#00f2ff" : "#333333"}
            badge={`PN: ${project.id}-REV_C`}
            title={project.title}
            description={project.description}
            image={project.image}
            width="100%"
            aspectRatio="16/9"
            className="shadow-2xl"
          />

          {/* Tech Specs Overlay on Hover */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 left-6 right-6 z-50 flex flex-wrap gap-2 pointer-events-none"
              >
                {project.tech.map(t => (
                  <span key={t} className="px-2 py-1 text-[10px] uppercase font-bold bg-black/90 backdrop-blur border border-cyan-500/30 text-cyan-100 rounded shadow-lg">
                    {t}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* External Link Button */}
          <AnimatePresence>
            {project.link && isExpanded && (
              <motion.a
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                title="View Live Project"
                className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 ${isPowered ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,242,255,0.6)] hover:bg-white' : 'bg-white text-black'}`}
              >
                <ExternalLink size={18} />
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const Pin: React.FC<{ active: boolean; delay: number }> = ({ active, delay }) => (
  <motion.div
    className="w-3 h-1.5 bg-gradient-to-r from-gray-700 to-gray-500 rounded-sm relative"
    animate={active ? {
      boxShadow: ["0 0 0px #00f2ff", "0 0 8px #00f2ff", "0 0 0px #00f2ff"]
    } : {}}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay
    }}
  />
);
