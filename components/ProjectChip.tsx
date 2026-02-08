
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
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className="relative group h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Resistor/Component Legs (Decorative) */}
      <div className="absolute -left-1 top-4 bottom-4 flex flex-col justify-between py-2 z-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-2 h-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-l ${isPowered ? 'group-hover:bg-cyan-600 transition-colors' : ''}`} />
        ))}
      </div>
      <div className="absolute -right-1 top-4 bottom-4 flex flex-col justify-between py-2 z-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`w-2 h-1 bg-gradient-to-l from-gray-600 to-gray-800 rounded-r ${isPowered ? 'group-hover:bg-cyan-600 transition-colors' : ''}`} />
        ))}
      </div>

      {/* Main Chip Body */}
      <div className={`relative z-10 h-full rounded-xl overflow-hidden border transition-all duration-500 flex flex-col
        ${isPowered
          ? 'bg-[#0a0a0a] border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_25px_rgba(0,242,255,0.15)]'
          : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        {/* Header / Label Area */}
        <div className={`p-4 border-b flex justify-between items-start
          ${isPowered ? 'bg-[#0f0f0f] border-gray-800' : 'bg-gray-50 border-gray-200'}`}
        >
          <div>
            <div className={`text-[10px] font-mono mb-1 uppercase tracking-widest ${isPowered ? 'text-gray-500' : 'text-gray-400'}`}>
              PROJECT_ID: {project.id}
            </div>
            <h3 className={`text-xl font-bold leading-tight ${isPowered ? 'text-white' : 'text-gray-900'}`}>
              {project.title}
            </h3>
          </div>
          {isPowered && <Cpu size={18} className={`text-gray-700 group-hover:text-cyan-400 transition-colors duration-300`} />}
        </div>

        {/* Image / Visual Area */}
        <div className="relative h-48 overflow-hidden bg-black">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          )}
          {/* Scanline Overlay */}
          {isPowered && (
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,242,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
          )}

          {/* Hover Overlay Actions */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Link
              to={`/project/${project.id}`}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              <span>View System</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* Specs / Tech Stack */}
        <div className={`p-4 flex-grow flex flex-col justify-between ${isPowered ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <p className={`text-sm mb-4 line-clamp-3 ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 4).map(t => (
              <span key={t} className={`text-[10px] px-2 py-1 rounded border font-mono uppercase
                 ${isPowered
                  ? 'border-gray-800 text-cyan-600 bg-cyan-950/10'
                  : 'border-gray-200 text-gray-600 bg-gray-100'
                }`}
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className={`text-[10px] px-2 py-1 rounded border font-mono uppercase ${isPowered ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className={`h-1 w-full transition-colors duration-500 ${isPowered ? 'bg-gray-800 group-hover:bg-cyan-500' : 'bg-gray-200'}`} />
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
