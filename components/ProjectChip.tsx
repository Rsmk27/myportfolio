
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectChipProps {
  project: Project;
  isPowered: boolean;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({ project, isPowered }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showIntentHints, setShowIntentHints] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverDelayRef = useRef<number | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 26 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 26 });
  const springOffsetX = useSpring(offsetX, { stiffness: 220, damping: 24 });
  const springOffsetY = useSpring(offsetY, { stiffness: 220, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPowered || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 12);
    rotateY.set(dx * 12);
    offsetX.set(dx * 8);
    offsetY.set(dy * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    offsetX.set(0);
    offsetY.set(0);
    if (hoverDelayRef.current) window.clearTimeout(hoverDelayRef.current);
    setShowIntentHints(false);
    setIsHovered(false);
  };

  const isGithubProject = Boolean(project.link && project.link.includes('github.com'));
  const visibleTech = project.tech.slice(0, 4);
  const hiddenTechCount = Math.max(project.tech.length - visibleTech.length, 0);

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full project-card"
      data-cursor="pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        if (hoverDelayRef.current) window.clearTimeout(hoverDelayRef.current);
        hoverDelayRef.current = window.setTimeout(() => setShowIntentHints(true), 260);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        x: springOffsetX,
        y: springOffsetY,
        transformPerspective: 1000,
      }}
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
            <div className="flex items-center gap-2 mb-1">
              <div className={`text-[10px] font-mono uppercase tracking-widest ${isPowered ? 'text-gray-500' : 'text-gray-400'}`}>
                PROJECT_ID: {project.id}
              </div>
              {project.award && (
                <span className={`relative overflow-hidden shine-effect text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap
                  ${isPowered
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-amber-700 bg-amber-100 border border-amber-300'}`}>
                  <span className="relative z-10">{project.award}</span>
                </span>
              )}
            </div>
            <h3 className={`text-xl font-bold leading-tight pr-2 ${isPowered ? 'text-white' : 'text-gray-900'}`}>
              {project.title}
            </h3>
          </div>
          {isPowered && <Cpu size={18} className={`flex-shrink-0 mt-1 text-gray-700 group-hover:text-cyan-400 transition-colors duration-300`} />}
        </div>

        {/* Image / Visual Area */}
        <div className="relative h-48 overflow-hidden bg-black">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
          )}
          {/* Scanline Overlay */}
          {isPowered && (
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,242,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
          )}

          {/* Hover Overlay Actions */}
          <div className={`absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-b from-black/70 via-black/55 to-black/75 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-300 uppercase">Live Specs</span>
              <div className="flex items-center gap-2">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-cyan-500/40 bg-black/60 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-100 transition-colors"
                    aria-label={`Open ${project.title} ${isGithubProject ? 'GitHub' : 'live link'}`}
                  >
                    {isGithubProject ? <Github size={14} /> : <ExternalLink size={14} />}
                  </a>
                )}
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{ y: isHovered ? 0 : 12, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="grid grid-cols-3 gap-2"
            >
              <div className="rounded-lg border border-cyan-500/30 bg-black/60 p-2 text-center">
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Tech</p>
                <p className="text-xs text-cyan-300 font-bold">{project.tech.length}</p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-black/60 p-2 text-center">
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Gallery</p>
                <p className="text-xs text-cyan-300 font-bold">{project.gallery?.length ?? 1}</p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-black/60 p-2 text-center">
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Features</p>
                <p className="text-xs text-cyan-300 font-bold">{project.features?.length ?? 0}</p>
              </div>
            </motion.div>

            <Link
              to={`/project/${project.id}`}
              className="self-center flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
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

          <motion.div
            className="flex flex-wrap gap-2 mt-auto"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.86, y: isHovered ? 0 : 4 }}
            transition={{ duration: 0.22 }}
          >
            {visibleTech.map(t => (
              <span key={t} className={`text-[10px] px-2 py-1 rounded border font-mono uppercase
                 ${isPowered
                  ? 'border-gray-800 text-cyan-600 bg-cyan-950/10'
                  : 'border-gray-200 text-gray-600 bg-gray-100'
                }`}
              >
                {t}
              </span>
            ))}
            {hiddenTechCount > 0 && (
              <span className={`text-[10px] px-2 py-1 rounded border font-mono uppercase ${isPowered ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                +{hiddenTechCount}
              </span>
            )}
          </motion.div>
        </div>

        {/* Footer Status Bar */}
        <div className={`h-1 w-full transition-colors duration-500 ${isPowered ? 'bg-gray-800 group-hover:bg-cyan-500' : 'bg-gray-200'}`} />
      </div>
    </motion.div>
  );
};
