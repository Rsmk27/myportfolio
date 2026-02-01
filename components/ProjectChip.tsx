
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Info } from 'lucide-react';
import { ElectricCard } from './ui/electric-card';
import { Link } from 'react-router-dom';
import { SystemFlow } from './SystemFlow';

interface ProjectChipProps {
  project: Project;
  isPowered: boolean;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({ project, isPowered }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="relative group p-5 h-full"
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ scale: 1, zIndex: 0 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
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
      <div className="relative z-10 h-full">
        <div className="bg-black rounded-[1.5em] relative h-full overflow-hidden">
          {/* Connecting lines to pins */}
          <div className={`absolute top-0 bottom-0 -left-1 w-2 transition-colors ${isPowered ? 'bg-cyan-900/50' : 'bg-[#111]'}`} />
          <div className={`absolute top-0 bottom-0 -right-1 w-2 transition-colors ${isPowered ? 'bg-cyan-900/50' : 'bg-[#111]'}`} />

          <ElectricCard
            variant={isPowered ? "hue" : "swirl"}
            color={isPowered ? "#00f2ff" : "#333333"}
            badge={`PN: ${project.id}-REV_C`}
            title="" // Clearing internal title to use custom overlay
            description="" // Clearing internal description
            image={project.image}
            width="100%"
            aspectRatio="16/9"
            className="shadow-2xl h-full"
          />

          {/* System Flow Overlay - Only rendered when expanded/hovered for performance */}
          <AnimatePresence>
            {isPowered && isExpanded && (
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SystemFlow />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom Overlay for Basic Details */}
          <div className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 ${isExpanded ? 'bg-black/80' : 'bg-transparent'}`}>
            <div className="relative z-20 transform translate-y-4 transition-transform duration-500">
              {/* Title */}
              <h3 className={`text-xl font-bold mb-2 transition-all duration-500 ${isExpanded ? 'opacity-100 translate-y-0 text-white' : 'opacity-0 translate-y-4 text-transparent'}`}>
                {project.title}
              </h3>

              {/* Tech Tags (Optional, keeping for context but smaller) */}
              <div className={`flex flex-wrap gap-2 mb-4 transition-all duration-500 delay-75 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {project.tech.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] text-cyan-300 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              {/* View Details Button */}
              <div className={`transition-all duration-500 delay-100 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link
                  to={`/project/${project.id}`}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${isPowered
                    ? 'bg-cyan-500 text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,255,0.5)]'
                    : 'bg-gray-200 text-gray-800 hover:bg-white'
                    }`}
                >
                  View Details
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>

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
