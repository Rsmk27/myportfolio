
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Github } from 'lucide-react';

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
  const awardTags = project.awards ?? (project.award ? [project.award] : []);
  const getAwardBadgeClasses = (awardTag: string) => {
    const tag = awardTag.toLowerCase();
    
    if (tag.includes('hackathon')) {
      return isPowered ? 'text-lime-300 bg-lime-500/10 border border-lime-500/30' : 'text-lime-800 bg-lime-100 border border-lime-300';
    }
    if (tag.includes('app') || tag.includes('android')) {
      return isPowered ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30' : 'text-emerald-800 bg-emerald-100 border border-emerald-300';
    }
    if (tag.includes('web')) {
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-800 bg-blue-100 border border-blue-300';
    }
    if (tag.includes('sih')) {
      return isPowered ? 'text-orange-300 bg-orange-500/10 border border-orange-500/30' : 'text-orange-800 bg-orange-100 border border-orange-300';
    }
    if (tag.includes('analog')) {
      return isPowered ? 'text-violet-300 bg-violet-500/10 border border-violet-500/30' : 'text-violet-800 bg-violet-100 border border-violet-300';
    }
    if (tag.includes('hardware')) {
      return isPowered ? 'text-red-300 bg-red-500/10 border border-red-500/30' : 'text-red-800 bg-red-100 border border-red-300';
    }
    if (tag.includes('prototype') || tag.includes('model')) {
      return isPowered ? 'text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/30' : 'text-fuchsia-800 bg-fuchsia-100 border border-fuchsia-300';
    }
    if (tag.includes('energy') || tag.includes('clean') || tag.includes('solar')) {
      return isPowered ? 'text-teal-300 bg-teal-500/10 border border-teal-500/30' : 'text-teal-800 bg-teal-100 border border-teal-300';
    }
    if (tag.includes('departmental')) {
      return isPowered ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/30' : 'text-indigo-800 bg-indigo-100 border border-indigo-300';
    }
    if (tag.includes('iot') || tag.includes('robot')) {
      return isPowered ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30' : 'text-sky-800 bg-sky-100 border border-sky-300';
    }
    if (tag.includes('agriai') || tag.includes('agri') || tag.includes('ai')) {
      return isPowered ? 'text-green-300 bg-green-500/10 border border-green-500/30' : 'text-green-800 bg-green-100 border border-green-300';
    }
    if (tag.includes('dual') || tag.includes('esp32') || tag.includes('esp')) {
      return isPowered ? 'text-purple-300 bg-purple-500/10 border border-purple-500/30' : 'text-purple-800 bg-purple-100 border border-purple-300';
    }

    return isPowered ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-amber-700 bg-amber-100 border border-amber-300';
  };

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
            <div className="flex flex-col items-start gap-1 mb-1">
              <div className={`text-[10px] font-mono uppercase tracking-widest ${isPowered ? 'text-gray-500' : 'text-gray-400'}`}>
                PROJECT_ID: {project.id}
              </div>
              {awardTags.map((awardTag) => (
                <span
                  key={awardTag}
                  className={`relative overflow-hidden shine-effect text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap mt-0.5 ${getAwardBadgeClasses(awardTag)}`}
                >
                  <span className="relative z-10">{awardTag}</span>
                </span>
              ))}
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
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />
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

            <a
              href={project.link || '#'}
              target="_blank"
              rel="noreferrer"
              className="self-center flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              <span>View System</span>
              <ExternalLink size={16} />
            </a>
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
