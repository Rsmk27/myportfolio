import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Github, X, ChevronRight } from 'lucide-react';
import { trackInteraction } from '../utils/analytics';

interface ProjectChipProps {
  project: Project;
  isPowered: boolean;
  onOpenDetails?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<{
  project: Project;
  isPowered: boolean;
  onClose: () => void;
}> = ({ project, isPowered, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard navigation: Escape to close and Tab focus containment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isGithubProject = Boolean(project.link && project.link.includes('github.com'));
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const activeMedia = gallery[activeGalleryIndex] || project.image;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 md:p-6"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden
          ${isPowered ? 'bg-[#09090b] border-zinc-800' : 'bg-[#09090b] border-zinc-800'}
        `}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-zinc-800 bg-zinc-950/80 shrink-0">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                PROJECT_ID: {project.id}
              </span>
              {project.awards?.map((award) => (
                <span
                  key={award}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 uppercase"
                >
                  {award}
                </span>
              ))}
            </div>
            <h2 className={`text-lg md:text-xl font-bold tracking-tight ${isPowered ? 'text-white' : 'text-zinc-200'}`}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close project details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal content body */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-6 flex-1">
          {/* Main Visual / Gallery media */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
            {activeMedia && activeMedia.endsWith('.mp4') ? (
              <video
                src={activeMedia}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={activeMedia}
                alt={`${project.title} preview`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Gallery thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                    activeGalleryIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                      : 'border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View gallery item ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Project Details */}
          {project.details && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Detailed Technical Specification
              </h3>
              <p className="text-sm font-sans leading-relaxed text-zinc-300">
                {project.details}
              </p>
            </div>
          )}

          {/* Project Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Core Engineering Features
              </h3>
              <ul className="space-y-1.5 pl-1">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-zinc-300 leading-relaxed">
                    <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
              Technologies & Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded border border-cyan-900/40 bg-cyan-950/30 text-cyan-300 font-mono text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-zinc-500">
            {project.keywords ? `Keywords: ${project.keywords.slice(0, 50)}...` : 'RSMK Engineering'}
          </span>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackInteraction('project_click', 'projects', project.title)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase transition-all shadow-[0_0_12px_rgba(0,242,255,0.3)]"
            >
              <span>{isGithubProject ? 'View Repository' : 'Launch System'}</span>
              {isGithubProject ? <Github size={14} /> : <ExternalLink size={14} />}
            </a>
          ) : (
            <span className="text-xs font-mono text-zinc-400">Simulation / Prototype</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ProjectChip: React.FC<ProjectChipProps> = ({ project, isPowered, onOpenDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isGithubProject = Boolean(project.link && project.link.includes('github.com'));
  const visibleTech = project.tech.slice(0, 4);
  const hiddenTechCount = Math.max(project.tech.length - visibleTech.length, 0);
  const awardTags = project.awards ?? (project.award ? [project.award] : []);

  const handleOpen = () => {
    if (onOpenDetails) {
      onOpenDetails(project);
    } else {
      setIsDetailOpen(true);
    }
    trackInteraction('project_chip_click', 'projects', project.title);
  };

  const getAwardBadgeClasses = (awardTag: string) => {
    const tag = awardTag.toLowerCase();
    
    if (tag.includes('hackathon')) {
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-300 bg-blue-950/30 border border-blue-500/20';
    }
    if (tag.includes('app') || tag.includes('android')) {
      return isPowered ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30' : 'text-emerald-300 bg-emerald-950/30 border border-emerald-500/20';
    }
    if (tag.includes('web')) {
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-300 bg-blue-950/30 border border-blue-500/20';
    }
    if (tag.includes('sih')) {
      return isPowered ? 'text-orange-300 bg-orange-500/10 border border-orange-500/30' : 'text-orange-300 bg-orange-950/30 border border-orange-500/20';
    }
    if (tag.includes('analog')) {
      return isPowered ? 'text-violet-300 bg-violet-500/10 border border-violet-500/30' : 'text-violet-300 bg-violet-950/30 border border-violet-500/20';
    }
    if (tag.includes('hardware')) {
      return isPowered ? 'text-red-300 bg-red-500/10 border border-red-500/30' : 'text-red-300 bg-red-950/30 border border-red-500/20';
    }
    if (tag.includes('prototype') || tag.includes('model')) {
      return isPowered ? 'text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/30' : 'text-fuchsia-300 bg-fuchsia-950/30 border border-fuchsia-500/20';
    }
    if (tag.includes('energy') || tag.includes('clean') || tag.includes('solar')) {
      return isPowered ? 'text-teal-300 bg-teal-500/10 border border-teal-500/30' : 'text-teal-300 bg-teal-950/30 border border-teal-500/20';
    }
    if (tag.includes('departmental')) {
      return isPowered ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/30' : 'text-indigo-300 bg-indigo-950/30 border border-indigo-500/20';
    }
    if (tag.includes('iot') || tag.includes('robot')) {
      return isPowered ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30' : 'text-sky-300 bg-sky-950/30 border border-sky-500/20';
    }
    if (tag.includes('agriai') || tag.includes('agri') || tag.includes('ai')) {
      return isPowered ? 'text-green-300 bg-green-500/10 border border-green-500/30' : 'text-green-300 bg-green-950/30 border border-green-500/20';
    }
    if (tag.includes('dual') || tag.includes('esp32') || tag.includes('esp')) {
      return isPowered ? 'text-purple-300 bg-purple-500/10 border border-purple-500/30' : 'text-purple-300 bg-purple-950/30 border border-purple-500/20';
    }

    return isPowered ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' : 'text-amber-400/90 bg-amber-950/20 border border-amber-500/20';
  };

  return (
    <>
      <motion.div
        className="relative group h-full project-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
        data-cursor="pointer"
        data-keywords={project.keywords}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Resistor/Component Legs (Decorative) */}
        <div 
          className="absolute -left-1 top-4 bottom-4 w-2 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #4b5563 4px, transparent 4px)',
            backgroundSize: '100% 16px',
          }}
        />
        <div 
          className="absolute -right-1 top-4 bottom-4 w-2 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #4b5563 4px, transparent 4px)',
            backgroundSize: '100% 16px',
          }}
        />

        {/* Main Chip Body */}
        <div className={`relative z-10 h-full rounded-xl overflow-hidden border transition-all duration-500 flex flex-col
          ${isPowered
            ? 'bg-[#0a0a0a] border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-cyan-500/50 group-hover:shadow-[0_0_25px_rgba(0,242,255,0.15)]'
            : 'bg-[#0a0a0a] border-zinc-800 shadow-sm'
          }`}
        >
          {/* Header / Label Area */}
          <div className={`p-4 border-b flex justify-between items-start
            ${isPowered ? 'bg-[#0f0f0f] border-gray-800' : 'bg-[#0f0f0f] border-zinc-800'}`}
          >
            <div className="flex-1 pr-2">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className={`text-[11px] font-mono uppercase tracking-widest ${isPowered ? 'text-gray-400' : 'text-zinc-400'}`}>
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
              <h3 className={`text-lg md:text-xl font-bold leading-tight ${isPowered ? 'text-white' : 'text-zinc-300'}`}>
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
                  className="px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-200 flex items-center gap-1.5 justify-center shadow-[0_0_10px_rgba(0,242,255,0.15)] text-[11px] font-mono font-bold uppercase tracking-wider"
                  title={`Open ${project.title} (${isGithubProject ? 'GitHub Repository' : 'Live Application'})`}
                  aria-label={`Open ${project.title} ${isGithubProject ? 'GitHub Repository' : 'Live Application'}`}
                >
                  {isGithubProject ? <Github size={13} /> : <ExternalLink size={13} />}
                  <span>{isGithubProject ? 'Code' : 'Live'}</span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      trackInteraction('project_click', 'projects', `${project.title} (${isGithubProject ? 'GitHub' : 'Live'})`);
                    }}
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                  className="self-center flex items-center gap-2 px-5 py-2 bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)] cursor-pointer"
                >
                  <span>Explore System</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <span className="self-center text-xs font-mono text-gray-400">Simulation / Prototype</span>
              )}
            </div>
          </div>

          {/* Specs / Tech Stack */}
          <div className="p-4 flex-grow flex flex-col justify-between bg-[#0a0a0a]">
            <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${isPowered ? 'text-gray-300' : 'text-zinc-400'}`}>
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
                    : 'border-zinc-800 text-zinc-400 bg-zinc-900/60'
                  }`}
                >
                  {t}
                </span>
              ))}
              {hiddenTechCount > 0 && (
                <span className={`text-[11px] px-2 py-0.5 rounded border font-mono uppercase ${isPowered ? 'border-gray-800 text-gray-400 bg-gray-900/50' : 'border-zinc-800 text-zinc-400 bg-zinc-900/60'}`}>
                  +{hiddenTechCount}
                </span>
              )}
            </motion.div>
          </div>

          {/* Footer Status Bar */}
          <div className={`h-1 w-full transition-colors duration-500 ${isPowered ? 'bg-gray-800 group-hover:bg-cyan-500' : 'bg-zinc-800'}`} />
        </div>
      </motion.div>

      <AnimatePresence>
        {isDetailOpen && (
          <ProjectDetailModal
            project={project}
            isPowered={isPowered}
            onClose={() => setIsDetailOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
