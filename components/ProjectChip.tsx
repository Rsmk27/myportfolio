import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Cpu, Github, X, ChevronRight, Layers, Film, Sparkles, ArrowUpRight } from 'lucide-react';
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

  // Reset gallery index when switching projects and focus dialog for keyboard navigation
  useEffect(() => {
    setActiveGalleryIndex(0);
    modalRef.current?.focus();
  }, [project.id]);

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
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
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
  const awardTags = project.awards ?? (project.award ? [project.award] : []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 md:p-6"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden focus:outline-none
          ${isPowered
            ? 'bg-[#09090b] border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,255,0.12)]'
            : 'bg-[#09090b] border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.08)]'
          }
        `}
      >
        {/* Top metallic rim hairline */}
        <div
          className={`h-0.5 w-full shrink-0 ${
            isPowered
              ? 'bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent'
              : 'bg-gradient-to-r from-transparent via-amber-400/70 to-transparent'
          }`}
        />

        {/* Datasheet Header Bar */}
        <div className="flex items-start justify-between gap-4 p-4 md:p-5 border-b border-zinc-800/90 bg-zinc-950/95 shrink-0">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-800 bg-black/70 text-zinc-300">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPowered ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-amber-400'
                  }`}
                />
                <span className={isPowered ? 'text-cyan-300' : 'text-amber-300'}>
                  DATASHEET // PROJECT_ID: {project.id}
                </span>
              </span>

              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-300">
                {project.link ? 'DEPLOYED_UNIT' : 'HARDWARE_PROTOTYPE'}
              </span>

              {awardTags.map((award) => (
                <span
                  key={award}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                    isPowered
                      ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                      : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {award}
                </span>
              ))}
            </div>

            <h2
              className={`text-lg md:text-2xl font-bold tracking-tight leading-snug ${
                isPowered ? 'text-white' : 'text-zinc-200'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close project details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal content body */}
        <div className="overflow-y-auto p-4 md:p-6 space-y-6 flex-1">
          {/* Main Visual / Oscilloscope Viewport */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center group/viewport">
            {/* Corner Calibration Reticles */}
            <span className={`pointer-events-none absolute top-2.5 left-2.5 w-3 h-3 border-t border-l z-10 ${isPowered ? 'border-cyan-400/60' : 'border-amber-400/60'}`} />
            <span className={`pointer-events-none absolute top-2.5 right-2.5 w-3 h-3 border-t border-r z-10 ${isPowered ? 'border-cyan-400/60' : 'border-amber-400/60'}`} />
            <span className={`pointer-events-none absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l z-10 ${isPowered ? 'border-cyan-400/60' : 'border-amber-400/60'}`} />
            <span className={`pointer-events-none absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r z-10 ${isPowered ? 'border-cyan-400/60' : 'border-amber-400/60'}`} />

            {/* Frame Telemetry Pill */}
            <div className="pointer-events-none absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-zinc-800 text-[10px] font-mono tracking-widest text-zinc-300">
              CH_{String(activeGalleryIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
            </div>

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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                <span>VISUAL_CHANNELS ({gallery.length})</span>
                <span>SELECT CHANNEL TO INSPECT</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                {gallery.map((img, idx) => {
                  const isVideo = img.endsWith('.mp4');
                  const isActive = activeGalleryIndex === idx;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer bg-black ${
                        isActive
                          ? isPowered
                            ? 'border-cyan-400 ring-2 ring-cyan-400/35'
                            : 'border-amber-400 ring-2 ring-amber-400/35'
                          : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View gallery item ${idx + 1}`}
                    >
                      {isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-300 gap-1">
                          <Film size={16} className={isPowered ? 'text-cyan-400' : 'text-amber-400'} />
                          <span className="text-[9px] font-mono uppercase">VIDEO</span>
                        </div>
                      ) : (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-zinc-200">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Project Details */}
          {project.details && (
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/60 p-4 md:p-5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-3.5 rounded-sm ${isPowered ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>
                  Detailed Technical Specification
                </h3>
              </div>
              <p className="text-sm md:text-[15px] font-sans leading-relaxed text-zinc-200">
                {project.details}
              </p>
            </div>
          )}

          {/* Project Features */}
          {project.features && project.features.length > 0 && (
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/60 p-4 md:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-3.5 rounded-sm ${isPowered ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                  <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>
                    Core Engineering Features
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  {project.features.length} SUBSYSTEMS
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {project.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-zinc-800/80 bg-black/50 text-xs md:text-sm text-zinc-200 leading-relaxed"
                  >
                    <span className={`text-[10px] font-mono font-bold mt-0.5 shrink-0 ${isPowered ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
              Technologies &amp; Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={`px-2.5 py-1 rounded-md border font-mono text-xs ${
                    isPowered
                      ? 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/95 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400">
            {project.keywords ? `SPEC_TAGS: ${project.keywords.slice(0, 56)}${project.keywords.length > 56 ? '...' : ''}` : 'RSMK Engineering'}
          </span>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackInteraction('project_click', 'projects', project.title)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-black text-xs font-mono font-bold uppercase transition-all ${
                isPowered
                  ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_14px_rgba(0,242,255,0.3)]'
                  : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
              }`}
            >
              <span>{isGithubProject ? 'View Repository' : 'Launch System'}</span>
              {isGithubProject ? <Github size={14} /> : <ExternalLink size={14} />}
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/70 text-xs font-mono text-zinc-300">
              Hardware Simulation / Prototype
            </span>
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
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-300 bg-blue-950/30 border border-blue-500/25';
    }
    if (tag.includes('app') || tag.includes('android')) {
      return isPowered ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30' : 'text-emerald-300 bg-emerald-950/30 border border-emerald-500/25';
    }
    if (tag.includes('web')) {
      return isPowered ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30' : 'text-blue-300 bg-blue-950/30 border border-blue-500/25';
    }
    if (tag.includes('sih')) {
      return isPowered ? 'text-orange-300 bg-orange-500/10 border border-orange-500/30' : 'text-orange-300 bg-orange-950/30 border border-orange-500/25';
    }
    if (tag.includes('analog')) {
      return isPowered ? 'text-violet-300 bg-violet-500/10 border border-violet-500/30' : 'text-violet-300 bg-violet-950/30 border border-violet-500/25';
    }
    if (tag.includes('hardware')) {
      return isPowered ? 'text-red-300 bg-red-500/10 border border-red-500/30' : 'text-red-300 bg-red-950/30 border border-red-500/25';
    }
    if (tag.includes('prototype') || tag.includes('model')) {
      return isPowered ? 'text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/30' : 'text-fuchsia-300 bg-fuchsia-950/30 border border-fuchsia-500/25';
    }
    if (tag.includes('energy') || tag.includes('clean') || tag.includes('solar')) {
      return isPowered ? 'text-teal-300 bg-teal-500/10 border border-teal-500/30' : 'text-teal-300 bg-teal-950/30 border border-teal-500/25';
    }
    if (tag.includes('departmental')) {
      return isPowered ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/30' : 'text-indigo-300 bg-indigo-950/30 border border-indigo-500/25';
    }
    if (tag.includes('iot') || tag.includes('robot')) {
      return isPowered ? 'text-sky-300 bg-sky-500/10 border border-sky-500/30' : 'text-sky-300 bg-sky-950/30 border border-sky-500/25';
    }
    if (tag.includes('agriai') || tag.includes('agri') || tag.includes('ai')) {
      return isPowered ? 'text-green-300 bg-green-500/10 border border-green-500/30' : 'text-green-300 bg-green-950/30 border border-green-500/25';
    }
    if (tag.includes('dual') || tag.includes('esp32') || tag.includes('esp')) {
      return isPowered ? 'text-purple-300 bg-purple-500/10 border border-purple-500/30' : 'text-purple-300 bg-purple-950/30 border border-purple-500/25';
    }

    return isPowered ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30' : 'text-amber-300 bg-amber-950/30 border border-amber-500/25';
  };

  return (
    <>
      <motion.div
        className="relative group h-full project-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl px-1.5"
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
        {/* Precision DIP IC Metallic Pins (Left & Right Rails) */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-6 bottom-6 w-2 pointer-events-none z-0 transition-opacity duration-300 opacity-75 group-hover:opacity-100"
          style={{
            backgroundImage: isPowered
              ? 'linear-gradient(to bottom, #94a3b8 4px, transparent 4px)'
              : 'linear-gradient(to bottom, #71717a 4px, transparent 4px)',
            backgroundSize: '100% 14px',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-6 bottom-6 w-2 pointer-events-none z-0 transition-opacity duration-300 opacity-75 group-hover:opacity-100"
          style={{
            backgroundImage: isPowered
              ? 'linear-gradient(to bottom, #94a3b8 4px, transparent 4px)'
              : 'linear-gradient(to bottom, #71717a 4px, transparent 4px)',
            backgroundSize: '100% 14px',
          }}
        />

        {/* Main IC Package Body */}
        <div
          className={`relative z-10 h-full rounded-xl overflow-hidden border transition-all duration-400 flex flex-col
          ${isPowered
            ? 'bg-[#0a0b0d] border-zinc-800/90 shadow-[0_8px_28px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group-hover:border-cyan-400/55 group-hover:shadow-[0_0_28px_rgba(0,242,255,0.16),inset_0_1px_0_rgba(34,211,238,0.18)]'
            : 'bg-[#0a0a09] border-zinc-800 shadow-[0_6px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] group-hover:border-amber-400/45'
          }`}
        >
          {/* Subtle top metallic bevel sheen */}
          <div
            aria-hidden="true"
            className={`h-px w-full ${
              isPowered
                ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent'
                : 'bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'
            }`}
          />

          {/* IC Header / Silkscreen Label Area */}
          <div className="p-4 border-b border-zinc-800/90 bg-zinc-950/90 flex justify-between items-start gap-2 relative">
            {/* Corner Mounting Holes */}
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full border border-zinc-700 bg-black"
            />
            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-zinc-700 bg-black"
            />

            <div className="flex-1 min-w-0 pl-1.5">
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {/* Pin-1 orientation dot + ID */}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPowered
                        ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span>PROJECT_ID: {project.id}</span>
                </span>

                {awardTags.slice(0, 2).map((awardTag) => (
                  <span
                    key={awardTag}
                    className={`relative overflow-hidden shine-effect text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded whitespace-nowrap ${getAwardBadgeClasses(awardTag)}`}
                  >
                    <span className="relative z-10">{awardTag}</span>
                  </span>
                ))}
              </div>

              <h3
                className={`text-base md:text-lg font-bold leading-snug line-clamp-2 ${
                  isPowered ? 'text-white' : 'text-zinc-200'
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {project.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 pt-0.5 pr-1">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackInteraction('project_click', 'projects', `${project.title} (${isGithubProject ? 'GitHub' : 'Live'})`);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 justify-center text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isPowered
                      ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(0,242,255,0.12)]'
                      : 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-400 hover:text-black'
                  }`}
                  title={`Open ${project.title} (${isGithubProject ? 'GitHub Repository' : 'Live Application'})`}
                  aria-label={`Open ${project.title} ${isGithubProject ? 'GitHub Repository' : 'Live Application'}`}
                >
                  {isGithubProject ? <Github size={13} /> : <ExternalLink size={13} />}
                  <span>{isGithubProject ? 'Code' : 'Live'}</span>
                </a>
              )}
              <Cpu
                size={17}
                className={`hidden sm:block transition-colors duration-300 ${
                  isPowered ? 'text-zinc-500 group-hover:text-cyan-400' : 'text-zinc-500 group-hover:text-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Image / Hardware Viewport Area */}
          <div className="relative h-48 overflow-hidden bg-black border-b border-zinc-800/80">
            {project.image && (
              <img
                src={project.image}
                alt={`${project.title} — ${project.description || 'Engineering project by Srinivasa Manikanta Rajapantula'}`}
                title={`${project.title} — Engineering Project by Srinivasa Manikanta`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Subtle inner lens vignette & corner marks */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            <div className="pointer-events-none absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/75 border border-zinc-800/90 text-[10px] font-mono text-zinc-300 tracking-wider opacity-90 group-hover:opacity-0 transition-opacity duration-200">
              {project.gallery && project.gallery.length > 1 ? `${project.gallery.length} MEDIA` : 'DATASHEET'}
            </div>

            {/* Hover Telemetry Overlay */}
            <div
              className={`absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-b from-black/85 via-black/75 to-black/90 backdrop-blur-sm transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[11px] font-mono tracking-[0.2em] uppercase font-semibold ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>
                  Live System Specs
                </span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackInteraction('project_click', 'projects', `${project.title} (${isGithubProject ? 'GitHub' : 'Live'})`);
                    }}
                    className={`w-8 h-8 rounded-full border bg-black/80 flex items-center justify-center transition-colors ${
                      isPowered
                        ? 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-400 hover:text-black'
                        : 'border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-black'
                    }`}
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
                <div className={`rounded-lg border bg-black/80 p-2 text-center ${isPowered ? 'border-cyan-500/30' : 'border-amber-500/30'}`}>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Layers size={10} /> Tech
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>{project.tech.length}</p>
                </div>
                <div className={`rounded-lg border bg-black/80 p-2 text-center ${isPowered ? 'border-cyan-500/30' : 'border-amber-500/30'}`}>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Film size={10} /> Media
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>{project.gallery?.length ?? 1}</p>
                </div>
                <div className={`rounded-lg border bg-black/80 p-2 text-center ${isPowered ? 'border-cyan-500/30' : 'border-amber-500/30'}`}>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Sparkles size={10} /> Specs
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${isPowered ? 'text-cyan-300' : 'text-amber-300'}`}>{project.features?.length ?? 0}</p>
                </div>
              </motion.div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className={`self-center flex items-center gap-1.5 px-4 py-2 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all cursor-pointer ${
                  isPowered
                    ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_16px_rgba(0,242,255,0.4)]'
                    : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.3)]'
                }`}
              >
                <span>{project.link ? 'Explore System' : 'Inspect Datasheet'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Specs / Tech Stack Body */}
          <div className="p-4 flex-grow flex flex-col justify-between bg-[#0a0b0d]">
            <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${isPowered ? 'text-zinc-300' : 'text-zinc-300'}`}>
              {project.description}
            </p>

            <div className="space-y-3 mt-auto">
              <motion.div
                className="flex flex-wrap gap-1.5"
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0.92, y: isHovered ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {visibleTech.map((t) => (
                  <span
                    key={t}
                    className={`text-[11px] px-2 py-0.5 rounded border font-mono uppercase font-medium ${
                      isPowered
                        ? 'border-cyan-500/25 text-cyan-300 bg-cyan-950/30'
                        : 'border-amber-500/25 text-amber-300 bg-amber-950/20'
                    }`}
                  >
                    {t}
                  </span>
                ))}
                {hiddenTechCount > 0 && (
                  <span
                    className="text-[11px] px-2 py-0.5 rounded border font-mono uppercase border-zinc-700 text-zinc-300 bg-zinc-900/70"
                  >
                    +{hiddenTechCount}
                  </span>
                )}
              </motion.div>

              {/* Micro datasheet hint row */}
              <div className="pt-2 border-t border-zinc-800/70 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <span>OPEN DATASHEET</span>
                <ArrowUpRight
                  size={12}
                  className={`transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isPowered ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Edge-Connector Gold-Finger / Signal Bus Bar */}
          <div className="h-1.5 w-full bg-zinc-950 border-t border-zinc-800/80 flex items-center px-3 gap-1">
            {[0, 1, 2, 3, 4, 5].map((pad) => (
              <span
                key={pad}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  isPowered
                    ? 'bg-zinc-800 group-hover:bg-cyan-400/80'
                    : 'bg-zinc-800 group-hover:bg-amber-400/75'
                }`}
              />
            ))}
          </div>
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
