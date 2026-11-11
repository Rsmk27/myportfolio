import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, X, ExternalLink, Play, ChevronDown, ChevronRight,
  Zap, Cpu, Monitor, Network, Activity, FileText, Settings, Radio,
  MessageSquare, Share2, Factory, ToggleRight, Move, MonitorCheck,
  CircuitBoard, Workflow, Check, Filter, BookOpen, Youtube,
  TriangleAlert, Clock, CheckCircle2, CircleDashed, Wrench, Info,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { trackInteraction } from '../utils/analytics';
import { PROFILE } from '../constants';
import {
  INDUSTRIAL_PROJECTS,
  ENGINEERING_TOOLS,
  AUTOMATION_ROADMAP,
  INDUSTRIAL_PROTOCOLS,
  SKILL_GROUPS,
  DOCUMENTATION_ITEMS,
  PROJECT_CATEGORIES,
  type IndustrialProject,
  type ProjectCategory,
  type YouTubeVideo,
  type RoadmapStatus,
} from '../data/industrialProjects';

// ─── Icon resolver ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap size={20} />, Cpu: <Cpu size={20} />, Monitor: <Monitor size={20} />,
  Network: <Network size={20} />, Activity: <Activity size={20} />, FileText: <FileText size={20} />,
  Settings: <Settings size={20} />, Radio: <Radio size={20} />, MessageSquare: <MessageSquare size={20} />,
  Share2: <Share2 size={20} />, Factory: <Factory size={20} />, ToggleRight: <ToggleRight size={20} />,
  Move: <Move size={20} />, MonitorCheck: <MonitorCheck size={20} />, CircuitBoard: <CircuitBoard size={20} />,
  Workflow: <Workflow size={20} />, Play: <Play size={20} />,
};

const getIcon = (name: string, size = 20) => {
  const icons: Record<string, React.ElementType> = {
    Zap, Cpu, Monitor, Network, Activity, FileText, Settings, Radio,
    MessageSquare, Share2, Factory, ToggleRight, Move, MonitorCheck,
    CircuitBoard, Workflow, Play,
  };
  const Icon = icons[name] || Activity;
  return <Icon size={size} />;
};

// ─── Real Logo Lookup for Software & Protocols ─────────────────────────────────
const TECH_LOGO_MAP: Record<string, string> = {
  'EPLAN Electric P8': '/assets/logos/eplan.svg',
  'EPLAN': '/assets/logos/eplan.svg',
  'CODESYS V3.5.22.30': '/assets/logos/codesys.svg',
  'CODESYS': '/assets/logos/codesys.svg',
  'CODESYS V3.5': '/assets/logos/codesys.svg',
  'CODESYS PLC Simulation': '/assets/logos/codesys.svg',
  'Connected Components Workbench (CCW)': '/assets/logos/ccw.svg',
  'Connected Components Workbench': '/assets/logos/ccw.svg',
  'CCW': '/assets/logos/ccw.svg',
  'Factory I/O': '/assets/logos/factoryio.svg',
  'FactoryTalk Optix Studio': '/assets/logos/optix-studio.svg',
  'Ignition SCADA': '/assets/logos/ignition.svg',
  'Modbus TCP': '/assets/logos/modbus.svg',
  'MQTT': '/assets/logos/mqtt.svg',
  'MQTT (Planned)': '/assets/logos/mqtt.svg',
  'OPC UA': '/assets/logos/opcua.svg',
  'PROFINET': '/assets/logos/profinet.svg',
  'PROFIBUS-DP': '/assets/logos/profibus.svg',
  'EtherNet/IP': '/assets/logos/ethernet-ip.svg',
  'EtherCAT': '/assets/logos/ethercat.svg',
  'CANopen': '/assets/logos/canopen.svg',
  'Industrial Ethernet': '/assets/logos/industrial-ethernet.svg',
  'Industrial Ethernet & TCP/IP': '/assets/logos/industrial-ethernet.svg',
  'ESP32 Development Environment': '/assets/logos/esp32.svg',
  'ESP32': '/assets/logos/esp32.svg',
  'CIP (Internal)': '/assets/logos/rockwell.svg',
};

// ─── Status badge helpers ─────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  'Completed':       'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
  'In Progress':     'bg-amber-950/60  text-amber-300  border-amber-500/30',
  'Planned':         'bg-zinc-800/60   text-zinc-400   border-zinc-600/30',
  'Awaiting Documentation': 'bg-blue-950/60 text-blue-300 border-blue-500/30',
};
const STATUS_DOT: Record<string, string> = {
  'Completed':   'bg-emerald-400',
  'In Progress': 'bg-amber-400 animate-pulse',
  'Planned':     'bg-zinc-500',
  'Awaiting Documentation': 'bg-blue-400',
};

const ROADMAP_PALETTE: Record<RoadmapStatus, { dot: string; label: string; bar: string }> = {
  'Completed':   { dot: 'bg-emerald-400', label: 'text-emerald-300', bar: 'bg-emerald-500' },
  'In Progress': { dot: 'bg-amber-400 animate-pulse', label: 'text-amber-300', bar: 'bg-amber-500' },
  'Practiced':   { dot: 'bg-cyan-400', label: 'text-cyan-300', bar: 'bg-cyan-500' },
  'Practicing':  { dot: 'bg-cyan-400', label: 'text-cyan-300', bar: 'bg-cyan-500' },
  'Exploring':   { dot: 'bg-violet-400', label: 'text-violet-300', bar: 'bg-violet-500' },
  'Planned':     { dot: 'bg-zinc-500', label: 'text-zinc-400', bar: 'bg-zinc-600' },
};

const LEVEL_STYLES: Record<string, string> = {
  'Project Experience': 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
  'Practiced':          'bg-cyan-950/60    text-cyan-300    border-cyan-500/30',
  'Familiar':           'bg-amber-950/60   text-amber-300   border-amber-500/30',
  'Exploring':          'bg-violet-950/60  text-violet-300  border-violet-500/30',
};

const PROTOCOL_STYLES: Record<string, string> = {
  'Project Experience': 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
  'Studied':            'bg-cyan-950/60    text-cyan-300    border-cyan-500/30',
  'Exploring':          'bg-violet-950/60  text-violet-300  border-violet-500/30',
  'Planned':            'bg-zinc-800/60    text-zinc-400    border-zinc-600/40',
};

const FEATURE_STYLES: Record<string, string> = {
  'Implemented': 'text-emerald-400',
  'In Progress': 'text-amber-400',
  'Planned':     'text-zinc-500',
};
const FEATURE_ICONS: Record<string, React.ElementType> = {
  'Implemented': CheckCircle2,
  'In Progress': Clock,
  'Planned':     CircleDashed,
};

// ─── Section anchor ids ───────────────────────────────────────────────────────
const SECTION = { projects: 'projects', toolkit: 'toolkit', roadmap: 'roadmap', protocols: 'protocols', docs: 'docs', skills: 'skills' };

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Small YouTube embed thumbnail that plays inline on click */
const VideoThumbnail: React.FC<{ video: YouTubeVideo; compact?: boolean }> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#070706] border border-zinc-800/90 aspect-video">
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
          title={video.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="w-full h-full relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label={`Play ${video.label}`}
        >
          <img
            src={video.thumbnailUrl}
            alt={video.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />
          {/* Play reticle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 border border-white/25 flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.55)] transition-transform group-hover:scale-110">
              <Play size={22} className="fill-white text-white ml-1" />
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
            <p className="text-xs font-mono text-zinc-100 line-clamp-1">{video.label}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-red-300 hover:text-red-200 font-mono"
            >
              <Youtube size={11} /> Watch on YouTube
            </a>
          </div>
        </button>
      )}
    </div>
  );
};

/** Project detail modal */
const ProjectModal: React.FC<{ project: IndustrialProject; onClose: () => void }> = ({ project, onClose }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll & restore focus on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      requestAnimationFrame(() => {
        previousFocusRef.current?.focus();
      });
    };
  }, []);

  // Escape key handler & focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalBoxRef.current) {
        const focusableElements = modalBoxRef.current.querySelectorAll<HTMLElement>(
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

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const videos = project.videos ?? [];
  const primaryIdx = videos.findIndex(v => v.id === project.primaryVideoId);
  const sortedVideos = primaryIdx > 0 ? [videos[primaryIdx], ...videos.filter((_, i) => i !== primaryIdx)] : videos;

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md overflow-y-auto py-6 sm:py-10 px-3 sm:px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        ref={modalBoxRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative w-full max-w-4xl bg-[#0d0d0b] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
        initial={{ y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 36, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top HMI power rail */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-amber-400/70 to-transparent" />

        {/* Header */}
        <div className="relative flex items-start justify-between p-5 sm:p-6 border-b border-zinc-800/90 bg-[#111110]">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                HMI MODULE //
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[project.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
                {project.status}
              </span>
              <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-zinc-700/80 bg-zinc-900/60">
                {project.category}
              </span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {project.title}
            </h2>
            <p className="text-xs text-cyan-300 font-mono">{project.subtitle}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close project modal"
            className="shrink-0 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-zinc-700/70 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-cyan-400/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-7 overflow-y-auto max-h-[76vh]">

          {/* ── Video Player(s) ── */}
          {sortedVideos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Youtube size={14} /> 01 // Simulation &amp; Demo Telemetry
              </h3>
              <VideoThumbnail video={sortedVideos[activeVideoIdx]} />
              {sortedVideos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sortedVideos.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVideoIdx(i)}
                      className={`shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${i === activeVideoIdx ? 'border-cyan-400 ring-1 ring-cyan-400/40' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <div className="relative w-32 aspect-video">
                        <img src={v.thumbnailUrl} alt={v.label} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play size={14} className="fill-white text-white" />
                        </div>
                      </div>
                      <p className="px-2 py-1 text-[9px] font-mono text-zinc-300 line-clamp-1 w-32">{v.label}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {sortedVideos.map(v => (
                  <a
                    key={v.id}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/35 text-red-200 text-[11px] font-mono transition-colors"
                  >
                    <Youtube size={12} /> {v.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Software & protocols ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#111110] border border-zinc-800/90 space-y-2.5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Software &amp; Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {project.software.map(s => {
                  const logo = TECH_LOGO_MAP[s];
                  return (
                    <span key={s} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#080806] border border-zinc-800 text-zinc-200">
                      {logo && <img src={logo} alt={s} className="w-3.5 h-3.5 object-contain" />}
                      <span>{s}</span>
                    </span>
                  );
                })}
              </div>
            </div>
            {project.protocol && (
              <div className="p-4 rounded-xl bg-[#111110] border border-zinc-800/90 space-y-2.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Fieldbus &amp; Protocols</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.protocol.map(p => {
                    const logo = TECH_LOGO_MAP[p];
                    return (
                      <span key={p} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/35 text-cyan-200">
                        {logo && <img src={logo} alt={p} className="w-3.5 h-3.5 object-contain" />}
                        <span>{p}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Status note ── */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#111110] border border-amber-500/25">
            <Info size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">{project.statusNote}</p>
          </div>

          {/* ── Problem statement ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Problem Statement</p>
            <p className="text-sm text-zinc-200 font-sans leading-relaxed">{project.problemStatement}</p>
          </div>

          {/* ── Objectives ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Engineering Objectives</p>
            <ul className="space-y-2">
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300 font-sans">
                  <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-1" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Highlights ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Technical Highlights</p>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300 font-sans">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-1" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Feature matrix (for in-progress projects) ── */}
          {project.featureMatrix && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Implementation Status</p>
              <div className="divide-y divide-zinc-800/70 rounded-xl border border-zinc-800 overflow-hidden">
                {project.featureMatrix.map((f, i) => {
                  const Icon = FEATURE_ICONS[f.status];
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-[#111110]">
                      <Icon size={14} className={FEATURE_STYLES[f.status]} />
                      <span className="text-xs text-zinc-200 font-sans flex-1">{f.label}</span>
                      <span className={`text-[10px] font-mono ${FEATURE_STYLES[f.status]}`}>{f.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Challenges ── */}
          {project.challenges && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Challenges &amp; Lessons Learned</p>
              <ul className="space-y-2">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                    <TriangleAlert size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Future work ── */}
          {project.futureWork && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-violet-300">Future Improvements</p>
              <ul className="space-y-2">
                {project.futureWork.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                    <CircleDashed size={13} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Files & documentation ── */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Project Files &amp; Documentation</p>
            <div className="space-y-2">
              {project.files.map((file, i) => (
                <div key={i} className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${file.available ? 'bg-emerald-950/20 border-emerald-700/40' : 'bg-[#111110] border-zinc-800/80'}`}>
                  <div>
                    <p className="text-xs font-mono text-zinc-200">{file.label}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{file.description}</p>
                  </div>
                  {file.available && file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono transition-colors shrink-0"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 bg-[#080806] shrink-0">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = React.forwardRef<
  HTMLDivElement,
  { project: IndustrialProject; index: number; onClick: () => void }
>(({ project, index, onClick }, ref) => {
  const primaryVideo = project.videos?.find(v => v.id === project.primaryVideoId) ?? project.videos?.[0];
  const moduleCode = `MOD-${String(index + 1).padStart(2, '0')}`;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      tabIndex={0}
      role="button"
      aria-label={`View project details for ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
          trackInteraction('open_project', 'industrial', project.title);
        }
      }}
      className="group relative rounded-2xl border border-zinc-800 hover:border-cyan-500/50 bg-[#0d0d0b]/95 backdrop-blur-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_24px_rgba(0,242,255,0.08)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      onClick={() => { onClick(); trackInteraction('open_project', 'industrial', project.title); }}
    >
      {/* Top HMI bezel strip */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/60 via-amber-400/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-[#111110] text-[10px] font-mono">
        <span className="text-zinc-300 font-bold tracking-wider">{moduleCode}</span>
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[project.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
          {project.status}
        </span>
      </div>

      {/* Thumbnail / video preview */}
      <div className="relative aspect-video bg-[#070706] overflow-hidden border-b border-zinc-800/70" onClick={e => e.stopPropagation()}>
        {primaryVideo ? (
          <VideoThumbnail video={primaryVideo} compact />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111110] via-[#0b0b09] to-[#060605]">
            <div className="text-cyan-500/25 group-hover:text-cyan-400/45 transition-colors scale-150">
              {getIcon(project.thumbnailPlaceholder, 48)}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e16_1px,transparent_1px),linear-gradient(to_bottom,#1e1e16_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/80 border border-zinc-700/70 text-zinc-200 backdrop-blur-sm">
            {project.category.split('&')[0].trim()}
          </span>
        </div>
        {/* Video count badge */}
        {(project.videos?.length ?? 0) > 0 && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono bg-black/80 border border-red-500/40 text-red-300 backdrop-blur-sm">
              <Youtube size={9} /> {project.videos!.length} {project.videos!.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          <h3
            className="text-base font-bold text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors leading-snug"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {project.title}
          </h3>
          <p className="text-xs text-zinc-300 font-sans line-clamp-2 leading-relaxed">{project.description}</p>
          {/* Software tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.software.slice(0, 3).map(s => {
              const logo = TECH_LOGO_MAP[s];
              return (
                <span key={s} className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#111110] border border-zinc-800 text-zinc-300">
                  {logo && <img src={logo} alt={s} className="w-3 h-3 object-contain" />}
                  <span>{s}</span>
                </span>
              );
            })}
            {project.software.length > 3 && (
              <span className="text-[10px] font-mono text-zinc-400 self-center">+{project.software.length - 3}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label={`View Project: ${project.title}`}
            className="text-xs font-mono text-cyan-300 hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen size={12} /> View Project
          </button>
          {primaryVideo && (
            <a
              href={primaryVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-red-300 hover:text-red-200 transition-colors"
            >
              <Youtube size={11} /> YouTube
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = 'ProjectCard';

// ─── Main Page ────────────────────────────────────────────────────────────────
const IndustrialPortfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState<IndustrialProject | null>(null);
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(null);
  const [expandedProtocolId, setExpandedProtocolId] = useState<string | null>(null);
  const [activeDocCategory, setActiveDocCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredProjects = useMemo(() => {
    return INDUSTRIAL_PROJECTS.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.software.some(s => s.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (p.protocol ?? []).some(pr => pr.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const docCategories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(DOCUMENTATION_ITEMS.map(d => d.category)))];
    return cats;
  }, []);

  const filteredDocs = useMemo(() =>
    DOCUMENTATION_ITEMS.filter(d => activeDocCategory === 'All' || d.category === activeDocCategory),
    [activeDocCategory]
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/automation`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Industrial Automation Engineering Portfolio — ${PROFILE.name}`,
    description: 'Centralized industrial automation portfolio covering PLC programming, EPLAN electrical design, Factory I/O simulation, HMI/SCADA, industrial networking, and predictive maintenance.',
    url: 'https://rsmk.tech/automation',
    author: { '@type': 'Person', name: PROFILE.name },
  };

  // Scroll-to-section helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      data-clarity-region="industrial-portfolio"
      className="min-h-screen bg-[#080806] text-zinc-300 font-mono selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden"
    >
      <SEO
        title={`Industrial Automation Journey | ${PROFILE.name} — PLC, EPLAN & IIoT Portfolio`}
        description="Hands-on industrial automation engineering portfolio by Srinivasa Manikanta Rajapantula — EPLAN electrical design, CODESYS PLC programming, Factory I/O virtual commissioning, HMI development, Modbus TCP, and IIoT predictive maintenance."
        url="/automation"
        image={`https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg`}
        schema={jsonLd}
      />

      {/* ── Background blueprint grid & ambient field ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e16_1px,transparent_1px),linear-gradient(to_bottom,#1e1e16_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">

        {/* ── Top HMI Nav Rack ── */}
        <nav
          aria-label="Industrial portfolio navigation"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/"
              onClick={() => trackInteraction('nav_home_from_industrial', 'navigation', 'Home')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-300 hover:text-cyan-300 transition-colors group px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform text-cyan-400" />
              <span>Home</span>
            </Link>
            <Link
              to="/gallery"
              onClick={() => trackInteraction('nav_gallery_from_industrial', 'navigation', 'Gallery')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-300 hover:text-cyan-300 transition-colors px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]"
            >
              Gallery
            </Link>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-zinc-300 hover:text-cyan-300 bg-[#0d0d0b] hover:bg-cyan-500/10 border border-zinc-700/70 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase text-cyan-300 bg-cyan-950/60 border border-cyan-500/35">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              PLC_BUS // RUN · 24VDC
            </span>
          </div>
        </nav>

        {/* ── Hero Control Cabinet Panel ── */}
        <section className="pt-8 pb-12">
          <div className="relative rounded-2xl border border-zinc-800 bg-[#0d0d0b]/90 p-6 sm:p-8 md:p-10 backdrop-blur-md overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
            {/* Top copper/cyan power rail */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400/70 to-transparent" />
            {/* Corner fiducials */}
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-cyan-500/50" />
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-cyan-500/50" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-amber-500/50" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-amber-500/50" />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                <Workflow size={16} />
                <span>SYS.01 // Industrial Automation &amp; Control Engineering</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded uppercase tracking-widest">
                HMI-CABINET // CODESYS · EPLAN · CCW
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              My Industrial<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
                Automation Journey
              </span>
            </h1>
            <p className="max-w-3xl text-sm sm:text-base text-zinc-300 font-sans leading-relaxed mb-7">
              From electrical schematics and PLC programming to industrial networking, SCADA, and predictive maintenance — documenting my hands-on engineering journey through designs, simulations, and practical automation projects.
            </p>

            {/* Quick nav HMI softkeys */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {[
                { key: '01', label: 'Featured Systems', id: SECTION.projects, icon: <Workflow size={13} /> },
                { key: '02', label: 'Engineering Toolkit', id: SECTION.toolkit, icon: <Wrench size={13} /> },
                { key: '03', label: 'Automation Roadmap', id: SECTION.roadmap, icon: <Activity size={13} /> },
                { key: '04', label: 'Protocols', id: SECTION.protocols, icon: <Network size={13} /> },
                { key: '05', label: 'Documentation', id: SECTION.docs, icon: <BookOpen size={13} /> },
              ].map(cta => (
                <button
                  key={cta.id}
                  type="button"
                  onClick={() => scrollTo(cta.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-700/80 bg-[#111110] hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:text-cyan-200 text-zinc-200 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span className="text-[10px] text-amber-400">{cta.key}</span>
                  {cta.icon}
                  <span>{cta.label}</span>
                </button>
              ))}
            </div>

            {/* DIN-rail Telemetry Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { tag: 'SYS_DONE', label: 'Completed Projects', value: INDUSTRIAL_PROJECTS.filter(p => p.status === 'Completed').length, color: 'text-emerald-400', dot: 'bg-emerald-400' },
                { tag: 'SYS_RUN', label: 'In Progress', value: INDUSTRIAL_PROJECTS.filter(p => p.status === 'In Progress').length, color: 'text-amber-400', dot: 'bg-amber-400 animate-pulse' },
                { tag: 'VID_SIM', label: 'Video Demos', value: INDUSTRIAL_PROJECTS.reduce((n, p) => n + (p.videos?.length ?? 0), 0), color: 'text-red-400', dot: 'bg-red-400' },
                { tag: 'BUS_NET', label: 'Protocols Studied', value: INDUSTRIAL_PROTOCOLS.length, color: 'text-cyan-400', dot: 'bg-cyan-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-zinc-800 bg-[#111110] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase">{s.tag}</span>
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  </div>
                  <p className={`text-2xl sm:text-3xl font-black leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 1 — Project Gallery
        ══════════════════════════════════════════════ */}
        <section id={SECTION.projects} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <Workflow size={14} /> 01 // Project Portfolio
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Engineering Projects
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-cyan-500/40 via-amber-500/20 to-transparent" />
          </div>

          {/* Filter + Search */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none flex-wrap">
              {PROJECT_CATEGORIES.map(cat => {
                const count = cat === 'All' ? INDUSTRIAL_PROJECTS.length : INDUSTRIAL_PROJECTS.filter(p => p.category === cat).length;
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); trackInteraction('filter_industrial', 'industrial', cat); }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-[0_0_12px_rgba(0,242,255,0.22)]'
                        : 'bg-[#0d0d0b] text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.split('&')[0].trim()}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? 'bg-cyan-400/30 text-cyan-100' : 'bg-zinc-800 text-zinc-300'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative min-w-[260px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search automation projects"
                placeholder="Search CODESYS, EPLAN, Modbus..."
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-[#0d0d0b] border border-zinc-800 focus:border-cyan-400/70 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-mono text-zinc-200 placeholder-zinc-400 transition-all"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-[#0d0d0b]">
              <Filter size={28} className="mx-auto text-zinc-400 mb-3" />
              <p className="text-sm text-zinc-300 font-mono">No projects match the current filters.</p>
              <button type="button" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-4 px-4 py-1.5 text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/40 rounded-lg hover:bg-cyan-500/15 transition-colors cursor-pointer">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((p, idx) => (
                  <ProjectCard key={p.id} project={p} index={idx} onClick={() => setActiveProject(p)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 2 — Engineering Toolkit
        ══════════════════════════════════════════════ */}
        <section id={SECTION.toolkit} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <Wrench size={14} /> 02 // Engineering Toolkit
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Software &amp; Tools
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-amber-500/40 via-cyan-500/20 to-transparent" />
          </div>
          <p className="text-sm text-zinc-300 font-sans mb-6">
            Tools are labelled by actual experience level — not aspirational claims.
          </p>

          {/* Level legend */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(LEVEL_STYLES).map(([level, cls]) => (
              <span key={level} className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${cls}`}>{level}</span>
            ))}
          </div>

          {/* Group tools by category */}
          {['Electrical Design', 'PLC Programming & Simulation', 'Factory Simulation', 'HMI & SCADA', 'Industrial Communication'].map(cat => {
            const tools = ENGINEERING_TOOLS.filter(t => t.category === cat);
            return (
              <div key={cat} className="mb-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-zinc-800" />
                  {cat}
                  <span className="flex-1 h-px bg-zinc-800" />
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map(tool => {
                    const logoSrc = tool.logo || TECH_LOGO_MAP[tool.name];
                    return (
                      <div key={tool.id} className="rounded-xl border border-zinc-800 bg-[#0d0d0b]/90 p-4 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#111110] border border-zinc-800 p-1.5 flex items-center justify-center shrink-0">
                              {logoSrc ? (
                                <img src={logoSrc} alt={tool.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-cyan-400">{getIcon(tool.icon, 18)}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white leading-tight">{tool.name}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{tool.vendor}</p>
                            </div>
                          </div>
                          <span className={`shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full border ${LEVEL_STYLES[tool.level]}`}>{tool.level}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">{tool.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 3 — Automation Roadmap
        ══════════════════════════════════════════════ */}
        <section id={SECTION.roadmap} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <Activity size={14} /> 03 // Learning Progression
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Automation Roadmap
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-cyan-500/40 via-emerald-500/20 to-transparent" />
          </div>

          <div className="relative">
            {/* Vertical bus conduit */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-zinc-700 to-zinc-800 hidden sm:block" />

            <div className="space-y-4">
              {AUTOMATION_ROADMAP.map(stage => {
                const palette = ROADMAP_PALETTE[stage.status];
                const isOpen = expandedRoadmapId === stage.id;
                return (
                  <div key={stage.id} className="relative sm:pl-14">
                    {/* Stage bus node */}
                    <div className={`hidden sm:flex absolute left-2.5 top-4 w-5 h-5 rounded-full border-2 border-[#080806] ${palette.dot.replace('animate-pulse', '')} items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.6)]`}>
                      <span className="text-[8px] font-black text-zinc-950">{stage.order}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedRoadmapId(isOpen ? null : stage.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left rounded-xl border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]/90 p-4 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`hidden sm:inline text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${LEVEL_STYLES[stage.status === 'Completed' ? 'Project Experience' : stage.status === 'In Progress' || stage.status === 'Practiced' || stage.status === 'Practicing' ? 'Practiced' : stage.status === 'Exploring' ? 'Exploring' : 'Familiar'] ?? 'border-zinc-700 bg-zinc-900'} ${palette.label}`}>
                            {stage.status}
                          </span>
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">{stage.title}</span>
                        </div>
                        <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-4 rounded-xl border border-zinc-800 bg-[#111110] space-y-4 text-xs font-sans">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Tools</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {stage.tools.map(t => (
                                    <span key={t} className="px-2 py-0.5 rounded bg-[#080806] border border-zinc-700 text-zinc-200 text-[10px] font-mono">{t}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Related Projects</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {stage.projects.map(pr => (
                                    <span key={pr} className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/35 text-cyan-200 text-[10px] font-mono">{pr}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Skills Practiced</p>
                                <ul className="space-y-1">
                                  {stage.skills.map(sk => (
                                    <li key={sk} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${palette.dot.split(' ')[0]}`} />
                                      {sk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="pt-2.5 border-t border-zinc-800 flex items-start gap-2 text-zinc-300">
                              <ChevronRight size={13} className="text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-[11px]"><span className="text-amber-300 font-mono">Next milestone:</span> {stage.nextMilestone}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 4 — Industrial Communication Protocols
        ══════════════════════════════════════════════ */}
        <section id={SECTION.protocols} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <Network size={14} /> 04 // Industrial Networking
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Communication Protocols
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-cyan-500/40 via-amber-500/20 to-transparent" />
          </div>
          <p className="text-sm text-zinc-300 font-sans mb-6">
            Protocols used in working projects are clearly distinguished from those studied theoretically or planned for future implementation.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['Project Experience', 'Exploring', 'Studied', 'Planned'] as const).map(s => (
              <span key={s} className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${PROTOCOL_STYLES[s]}`}>{s}</span>
            ))}
          </div>

          <div className="space-y-3">
            {INDUSTRIAL_PROTOCOLS.map(proto => {
              const isOpen = expandedProtocolId === proto.id;
              const logoSrc = proto.logo || TECH_LOGO_MAP[proto.shortName] || TECH_LOGO_MAP[proto.name];
              return (
                <div key={proto.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedProtocolId(isOpen ? null : proto.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left rounded-xl border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]/90 p-4 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${PROTOCOL_STYLES[proto.status]}`}>{proto.status}</span>
                        {logoSrc && (
                          <div className="w-7 h-7 rounded-md bg-[#111110] border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                            <img src={logoSrc} alt={proto.shortName} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">{proto.shortName}</span>
                          <span className="text-zinc-400 text-xs ml-2 hidden sm:inline">— {proto.purpose.substring(0, 60)}…</span>
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-4 rounded-xl border border-zinc-800 bg-[#111110] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Full Name</p>
                            <p className="text-zinc-200">{proto.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Communication Model</p>
                            <p className="text-zinc-200">{proto.model}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Purpose</p>
                            <p className="text-zinc-300 font-sans leading-relaxed">{proto.purpose}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Typical Use Case</p>
                            <p className="text-zinc-300 font-sans leading-relaxed">{proto.useCase}</p>
                          </div>
                          {proto.relatedProject && (
                            <div className="sm:col-span-2">
                              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Related Project</p>
                              <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/35 text-cyan-200 text-[11px] font-mono">{proto.relatedProject}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 5 — Skills Dashboard
        ══════════════════════════════════════════════ */}
        <section id={SECTION.skills} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <Cpu size={14} /> 05 // Technical Competencies
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Skills Dashboard
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-cyan-500/40 via-amber-500/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SKILL_GROUPS.map(group => (
              <div key={group.category} className="rounded-xl border border-zinc-800 bg-[#0d0d0b]/90 p-5">
                <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-zinc-800/80">
                  <span className="text-cyan-400">{getIcon(group.icon, 16)}</span>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">{group.category}</p>
                </div>
                <div className="space-y-2">
                  {group.skills.map(skill => {
                    const logoSrc = TECH_LOGO_MAP[skill.name];
                    return (
                      <div key={skill.name} className="flex items-center justify-between gap-2 py-1.5 border-b border-zinc-800/60 last:border-0">
                        <div className="flex items-center gap-2">
                          {logoSrc ? (
                            <img src={logoSrc} alt={skill.name} className="w-4 h-4 object-contain shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs text-zinc-200 font-mono">{skill.name}</p>
                            {skill.note && <p className="text-[10px] text-zinc-400">{skill.note}</p>}
                          </div>
                        </div>
                        <span className={`shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full border ${LEVEL_STYLES[skill.level]}`}>
                          {skill.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 6 — Documentation Library
        ══════════════════════════════════════════════ */}
        <section id={SECTION.docs} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1.5">
                <BookOpen size={14} /> 06 // Engineering Docs
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Documentation Library
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-amber-500/40 via-cyan-500/20 to-transparent" />
          </div>
          <p className="text-sm text-zinc-300 font-sans mb-6">
            Available documents open directly. Pending items will be added as files are prepared and uploaded.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {docCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveDocCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeDocCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400'
                    : 'bg-[#0d0d0b] text-zinc-300 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                  doc.available
                    ? 'border-emerald-700/45 bg-emerald-950/15'
                    : 'border-zinc-800 bg-[#0d0d0b]/85'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${doc.available ? 'text-emerald-300 border-emerald-700/50 bg-emerald-950/40' : 'text-zinc-300 border-zinc-700 bg-zinc-900/60'}`}>
                      {doc.available ? 'Available' : 'Pending'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase">{doc.category}</span>
                  </div>
                  <p className="text-xs font-bold text-white">{doc.title}</p>
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{doc.description}</p>
                  <p className="text-[10px] font-mono text-zinc-400 italic">{doc.previewNote}</p>
                </div>
                {doc.available && doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono transition-colors self-start"
                  >
                    {doc.url.includes('youtube') ? <><Youtube size={11} /> Watch Video</> : <><ExternalLink size={11} /> View</>}
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 self-start px-3 py-1.5 rounded-lg border border-zinc-800 bg-[#111110]">Awaiting upload</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom cross-nav ── */}
        <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#0d0d0b] via-[#111110] to-[#0d0d0b] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400/70 via-amber-400/50 to-transparent" />
          <div className="space-y-1 text-center md:text-left">
            <h3
              className="text-base font-bold text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Zap size={16} className="text-cyan-400" /> Explore More
            </h3>
            <p className="text-xs text-zinc-300 font-sans max-w-md">
              Embedded IoT hardware prototypes, hackathon build photos, and academic certifications in the photo gallery.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/gallery" className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/45 text-cyan-200 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2">
              Photo Gallery
            </Link>
            <Link to="/#projects" className="px-4 py-2 rounded-xl bg-[#111110] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2">
              <Cpu size={13} /> All Projects
            </Link>
          </div>
        </div>

      </div>

      {/* ── Project Detail Modal ── */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndustrialPortfolio;
