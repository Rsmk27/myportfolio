
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Github } from 'lucide-react';
import { trackInteraction } from '../utils/analytics';

interface ProjectChipProps {
  project: Project;
  isPowered: boolean;
}

export const ProjectChip: React.FC<ProjectChipProps> = ({ project, isPowered }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isGithubProject = Boolean(project.link && project.link.includes('github.com'));
  const visibleTech = project.tech.slice(0, 4);
  const hiddenTechCount = Math.max(project.tech.length - visibleTech.length, 0);
  const awardTags = project.awards ?? (project.award ? [project.award] : []);
  const getAwardBadgeClasses = (awardTag: string) => {
    const tag = awardTag.toLowerCase();
    
    if (tag.includes('hackathon')) {
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-800 bg-blue-100 border border-blue-300';
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
      className="relative group h-full project-card"
      data-cursor="pointer"
      data-keywords={project.keywords}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <div className="flex-1 pr-2">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className={`text-[11px] font-mono uppercase tracking-widest ${isPowered ? 'text-gray-400' : 'text-gray-500'}`}>
                PROJECT_ID: {project.id}
              </span>
              {awardTags.map((awardTag) => (
                <span
                  key={awardTag}
                  className={`relative overflow-hidden shine-effect text-[11px] uppercase font-bold px-2 py-0.5 rounded whitespace-nowrap ${getAwardBadgeClasses(awardTag)}`}
                >
                  <span className="relative z-10">{awardTag}</span>
                </span>
              ))}
            </div>
            <h3 className={`text-lg md:text-xl font-bold leading-tight ${isPowered ? 'text-white' : 'text-gray-900'}`}>
              {project.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  trackInteraction('project_click', 'projects', `${project.title} (${isGithubProject ? 'GitHub' : 'Live'})`);
                }}
                className="p-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200 flex items-center justify-center shadow-[0_0_10px_rgba(0,242,255,0.15)]"
                title={`Open ${project.title} (${isGithubProject ? 'GitHub' : 'Live Website'})`}
                aria-label={`Open ${project.title}`}
              >
                {isGithubProject ? <Github size={15} /> : <ExternalLink size={15} />}
              </a>
            )}
            {isPowered && <Cpu size={18} className="text-gray-600 group-hover:text-cyan-400 transition-colors duration-300 hidden sm:block" />}
          </div>
        </div>

        {/* Image / Visual Area */}
        <div className="relative h-48 overflow-hidden bg-black">
          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} — ${project.description || 'Engineering project by Srinivasa Manikanta Rajapantula'}`}
              title={`${project.title} — Engineering Project by Srinivasa Manikanta`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
          )}

          {/* Hover Overlay Actions */}
          <div className={`absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-b from-black/80 via-black/65 to-black/85 backdrop-blur-sm transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono tracking-[0.2em] text-cyan-300 uppercase font-semibold">Live System Specs</span>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackInteraction('project_click', 'projects', `${project.title} (${isGithubProject ? 'GitHub' : 'Live'})`)}
                  className="w-8 h-8 rounded-full border border-cyan-500/40 bg-black/80 text-cyan-300 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-colors"
                  aria-label={`Open ${project.title} link`}
                >
                  {isGithubProject ? <Github size={14} /> : <ExternalLink size={14} />}
                </a>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{ y: isHovered ? 0 : 8, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="grid grid-cols-3 gap-2"
            >
              <div className="rounded-lg border border-cyan-500/30 bg-black/70 p-2 text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Tech</p>
                <p className="text-xs text-cyan-300 font-bold">{project.tech.length}</p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-black/70 p-2 text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Gallery</p>
                <p className="text-xs text-cyan-300 font-bold">{project.gallery?.length ?? 1}</p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-black/70 p-2 text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Features</p>
                <p className="text-xs text-cyan-300 font-bold">{project.features?.length ?? 0}</p>
              </div>
            </motion.div>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackInteraction('project_click', 'projects', project.title)}
                className="self-center flex items-center gap-2 px-5 py-2 bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)]"
              >
                <span>{isGithubProject ? 'View Repository' : 'Launch System'}</span>
                {isGithubProject ? <Github size={14} /> : <ExternalLink size={14} />}
              </a>
            ) : (
              <span className="self-center text-xs font-mono text-gray-400">Simulation / Prototype</span>
            )}
          </div>
        </div>

        {/* Specs / Tech Stack */}
        <div className={`p-4 flex-grow flex flex-col justify-between ${isPowered ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
          <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${isPowered ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description}
          </p>

          <motion.div
            className="flex flex-wrap gap-1.5 mt-auto"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0.9, y: isHovered ? 0 : 2 }}
            transition={{ duration: 0.2 }}
          >
            {visibleTech.map(t => (
              <span key={t} className={`text-[11px] px-2 py-0.5 rounded border font-mono uppercase font-medium
                 ${isPowered
                  ? 'border-cyan-900/40 text-cyan-300 bg-cyan-950/30'
                  : 'border-gray-200 text-gray-700 bg-gray-100'
                }`}
              >
                {t}
              </span>
            ))}
            {hiddenTechCount > 0 && (
              <span className={`text-[11px] px-2 py-0.5 rounded border font-mono uppercase ${isPowered ? 'border-gray-800 text-gray-400 bg-gray-900/50' : 'border-gray-200 text-gray-500 bg-gray-100'}`}>
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
