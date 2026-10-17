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
const VideoThumbnail: React.FC<{ video: YouTubeVideo; compact?: boolean }> = ({ video, compact }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`relative rounded-xl overflow-hidden bg-black border border-zinc-800 ${compact ? 'aspect-video' : 'aspect-video'}`}>
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
          onClick={() => setPlaying(true)}
          className="w-full h-full relative group cursor-pointer"
          aria-label={`Play ${video.label}`}
        >
          <img
            src={video.thumbnailUrl}
            alt={video.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
              <Play size={22} className="fill-white text-white ml-1" />
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-xs font-mono text-zinc-200 line-clamp-1">{video.label}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-1 inline-flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-mono"
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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  const videos = project.videos ?? [];
  const primaryIdx = videos.findIndex(v => v.id === project.primaryVideoId);
  const sortedVideos = primaryIdx > 0 ? [videos[primaryIdx], ...videos.filter((_, i) => i !== primaryIdx)] : videos;

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-[#0d0d0b] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800 bg-zinc-950/80">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[project.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
                {project.status}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-zinc-800">
                {project.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{project.title}</h2>
            <p className="text-xs text-cyan-300/80 font-mono">{project.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[75vh]">

          {/* ── Video Player(s) ── */}
          {sortedVideos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Youtube size={14} /> Demo Videos
              </h3>
              <VideoThumbnail video={sortedVideos[activeVideoIdx]} />
              {sortedVideos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sortedVideos.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideoIdx(i)}
                      className={`shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${i === activeVideoIdx ? 'border-cyan-400 ring-1 ring-cyan-400/40' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <div className="relative w-32 aspect-video">
                        <img src={v.thumbnailUrl} alt={v.label} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play size={14} className="fill-white text-white" />
                        </div>
                      </div>
                      <p className="px-2 py-1 text-[9px] font-mono text-zinc-400 line-clamp-1 w-32">{v.label}</p>
                    </button>
                  ))}
                </div>
              )}
              {/* All YouTube links */}
              <div className="flex flex-wrap gap-2">
                {sortedVideos.map(v => (
                  <a
                    key={v.id}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 text-[11px] font-mono transition-colors"
                  >
                    <Youtube size={12} /> {v.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Software & protocols ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Software & Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {project.software.map(s => {
                  const logo = TECH_LOGO_MAP[s];
                  return (
                    <span key={s} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {logo && <img src={logo} alt={s} className="w-3.5 h-3.5 object-contain" />}
                      <span>{s}</span>
                    </span>
                  );
                })}
              </div>
            </div>
            {project.protocol && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Protocols</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.protocol.map(p => {
                    const logo = TECH_LOGO_MAP[p];
                    return (
                      <span key={p} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
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
          <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <Info size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 font-sans">{project.statusNote}</p>
          </div>

          {/* ── Problem statement ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Problem Statement</p>
            <p className="text-sm text-zinc-300 font-sans leading-relaxed">{project.problemStatement}</p>
          </div>

          {/* ── Objectives ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Objectives</p>
            <ul className="space-y-1.5">
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                  <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Highlights ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Technical Highlights</p>
            <ul className="space-y-1.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Feature matrix (for in-progress projects) ── */}
          {project.featureMatrix && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Implementation Status</p>
              <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 overflow-hidden">
                {project.featureMatrix.map((f, i) => {
                  const Icon = FEATURE_ICONS[f.status];
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-zinc-950/40">
                      <Icon size={14} className={FEATURE_STYLES[f.status]} />
                      <span className="text-xs text-zinc-300 font-sans flex-1">{f.label}</span>
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
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Challenges & Lessons Learned</p>
              <ul className="space-y-1.5">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-sans">
                    <TriangleAlert size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Future work ── */}
          {project.futureWork && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Future Improvements</p>
              <ul className="space-y-1.5">
                {project.futureWork.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-sans">
                    <CircleDashed size={13} className="text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Files & documentation ── */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Project Files & Documentation</p>
            <div className="space-y-2">
              {project.files.map((file, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${file.available ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-zinc-900/40 border-zinc-800/60'}`}>
                  <div>
                    <p className="text-xs font-mono text-zinc-200">{file.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{file.description}</p>
                  </div>
                  {file.available && file.url ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition-colors shrink-0"
                    >
                      <ExternalLink size={11} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-600 px-2">Pending</span>
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
const ProjectCard: React.FC<{ project: IndustrialProject; onClick: () => void }> = ({ project, onClick }) => {
  const primaryVideo = project.videos?.find(v => v.id === project.primaryVideoId) ?? project.videos?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="group rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 backdrop-blur-sm flex flex-col overflow-hidden transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] cursor-pointer"
      onClick={() => { onClick(); trackInteraction('open_project', 'industrial', project.title); }}
    >
      {/* Thumbnail / video preview */}
      <div className="relative aspect-video bg-zinc-900 overflow-hidden" onClick={e => e.stopPropagation()}>
        {primaryVideo ? (
          <VideoThumbnail video={primaryVideo} compact />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
            <div className="text-zinc-700 opacity-40 scale-150">
              {getIcon(project.thumbnailPlaceholder, 48)}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/75 border border-zinc-700/50 text-zinc-300 backdrop-blur-sm">
            {project.category.split('&')[0].trim()}
          </span>
        </div>
        {/* Video count badge */}
        {(project.videos?.length ?? 0) > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono bg-black/75 border border-red-500/30 text-red-300 backdrop-blur-sm">
              <Youtube size={9} /> {project.videos!.length} {project.videos!.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Status */}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[project.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
            {project.status}
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">{project.description}</p>
          {/* Software tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.software.slice(0, 3).map(s => {
              const logo = TECH_LOGO_MAP[s];
              return (
                <span key={s} className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {logo && <img src={logo} alt={s} className="w-3 h-3 object-contain" />}
                  <span>{s}</span>
                </span>
              );
            })}
            {project.software.length > 3 && (
              <span className="text-[10px] font-mono text-zinc-600">+{project.software.length - 3}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <button className="text-xs font-mono text-zinc-400 hover:text-cyan-300 uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer">
            <BookOpen size={12} /> View Details
          </button>
          {primaryVideo && (
            <a
              href={primaryVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors"
            >
              <Youtube size={11} /> YouTube
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      {/* ── Background grid ── */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* ── Top Nav ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/"
              onClick={() => trackInteraction('nav_home_from_industrial', 'navigation', 'Home')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors group px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/60"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              <span>Home</span>
            </Link>
            <Link
              to="/gallery"
              onClick={() => trackInteraction('nav_gallery_from_industrial', 'navigation', 'Gallery')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/60"
            >
              Gallery
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-800/60 hover:bg-cyan-500/10 border border-zinc-700/60 rounded-md transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
              Engineering Lab // Active
            </span>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="pt-10 pb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
            <Workflow size={16} />
            <span>Industrial Automation & Control Engineering</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6">
            My Industrial<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
              Automation Journey
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 font-sans leading-relaxed mb-8">
            From electrical schematics and PLC programming to industrial networking, SCADA, and predictive maintenance — documenting my hands-on engineering journey through designs, simulations, and practical automation projects.
          </p>

          {/* Quick nav CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: 'Explore Projects', id: SECTION.projects, icon: <Workflow size={13} /> },
              { label: 'Engineering Toolkit', id: SECTION.toolkit, icon: <Wrench size={13} /> },
              { label: 'Automation Roadmap', id: SECTION.roadmap, icon: <Activity size={13} /> },
              { label: 'Protocols', id: SECTION.protocols, icon: <Network size={13} /> },
              { label: 'Documentation', id: SECTION.docs, icon: <BookOpen size={13} /> },
            ].map(cta => (
              <button
                key={cta.id}
                onClick={() => scrollTo(cta.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-900/60 hover:border-cyan-500/40 hover:text-cyan-300 text-zinc-300 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                {cta.icon} {cta.label}
              </button>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Completed Projects', value: INDUSTRIAL_PROJECTS.filter(p => p.status === 'Completed').length, color: 'text-emerald-400' },
              { label: 'In Progress', value: INDUSTRIAL_PROJECTS.filter(p => p.status === 'In Progress').length, color: 'text-amber-400' },
              { label: 'Video Demos', value: INDUSTRIAL_PROJECTS.reduce((n, p) => n + (p.videos?.length ?? 0), 0), color: 'text-red-400' },
              { label: 'Protocols Studied', value: INDUSTRIAL_PROTOCOLS.length, color: 'text-violet-400' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 1 — Project Gallery
        ══════════════════════════════════════════════ */}
        <section id={SECTION.projects} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Workflow size={14} /> Project Portfolio
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
            Engineering Projects
          </h2>

          {/* Filter + Search */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none flex-wrap">
              {PROJECT_CATEGORIES.map(cat => {
                const count = cat === 'All' ? INDUSTRIAL_PROJECTS.length : INDUSTRIAL_PROJECTS.filter(p => p.category === cat).length;
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); trackInteraction('filter_industrial', 'industrial', cat); }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,242,255,0.25)]'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.split('&')[0].trim()}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? 'bg-cyan-400/30 text-cyan-200' : 'bg-zinc-800 text-zinc-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative min-w-[260px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search CODESYS, EPLAN, Modbus..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-mono text-zinc-200 placeholder-zinc-600 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-950/60">
              <Filter size={28} className="mx-auto text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400 font-mono">No projects match the current filters.</p>
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-4 px-4 py-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} onClick={() => setActiveProject(p)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            SECTION 2 — Engineering Toolkit
        ══════════════════════════════════════════════ */}
        <section id={SECTION.toolkit} className="scroll-mt-8 mb-24">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Wrench size={14} /> Engineering Toolkit
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Software & Tools</h2>
          <p className="text-sm text-zinc-400 font-sans mb-8">
            Tools are labelled by actual experience level — not aspirational claims.
          </p>

          {/* Level legend */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(LEVEL_STYLES).map(([level, cls]) => (
              <span key={level} className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${cls}`}>{level}</span>
            ))}
          </div>

          {/* Group tools by category */}
          {['Electrical Design', 'PLC Programming & Simulation', 'Factory Simulation', 'HMI & SCADA', 'Industrial Communication'].map(cat => {
            const tools = ENGINEERING_TOOLS.filter(t => t.category === cat);
            return (
              <div key={cat} className="mb-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-zinc-800" />
                  {cat}
                  <span className="flex-1 h-px bg-zinc-800" />
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map(tool => {
                    const logoSrc = tool.logo || TECH_LOGO_MAP[tool.name];
                    return (
                      <div key={tool.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 flex items-center justify-center shrink-0">
                              {logoSrc ? (
                                <img src={logoSrc} alt={tool.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-cyan-400">{getIcon(tool.icon, 18)}</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white leading-tight">{tool.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{tool.vendor}</p>
                            </div>
                          </div>
                          <span className={`shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full border ${LEVEL_STYLES[tool.level]}`}>{tool.level}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">{tool.description}</p>
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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Activity size={14} /> Learning Progression
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
            Automation Roadmap
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-zinc-800 hidden sm:block" />

            <div className="space-y-4">
              {AUTOMATION_ROADMAP.map(stage => {
                const palette = ROADMAP_PALETTE[stage.status];
                const isOpen = expandedRoadmapId === stage.id;
                return (
                  <div key={stage.id} className="relative sm:pl-14">
                    {/* Stage dot */}
                    <div className={`hidden sm:flex absolute left-2.5 top-4 w-5 h-5 rounded-full border-2 border-zinc-900 ${palette.dot.replace('animate-pulse', '')} items-center justify-center`}>
                      <span className="text-[8px] font-black text-zinc-900">{stage.order}</span>
                    </div>

                    <button
                      onClick={() => setExpandedRoadmapId(isOpen ? null : stage.id)}
                      className="w-full text-left rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 p-4 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`hidden sm:inline text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${LEVEL_STYLES[stage.status === 'Completed' ? 'Project Experience' : stage.status === 'In Progress' || stage.status === 'Practiced' || stage.status === 'Practicing' ? 'Practiced' : stage.status === 'Exploring' ? 'Exploring' : 'Familiar'] ?? ''} ${palette.label}`}>
                            {stage.status}
                          </span>
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">{stage.title}</span>
                        </div>
                        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
                          <div className="mt-2 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 space-y-4 text-xs font-sans">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Tools</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {stage.tools.map(t => (
                                    <span key={t} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono">{t}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Related Projects</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {stage.projects.map(pr => (
                                    <span key={pr} className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-900/60 text-cyan-300/80 text-[10px] font-mono">{pr}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Skills Practiced</p>
                                <ul className="space-y-0.5">
                                  {stage.skills.map(sk => (
                                    <li key={sk} className="text-[11px] text-zinc-400 flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${palette.dot.split(' ')[0]}`} />
                                      {sk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-zinc-800 flex items-start gap-2 text-zinc-400">
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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Network size={14} /> Industrial Networking
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Communication Protocols
          </h2>
          <p className="text-sm text-zinc-400 font-sans mb-8">
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
                    onClick={() => setExpandedProtocolId(isOpen ? null : proto.id)}
                    className="w-full text-left rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 p-4 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${PROTOCOL_STYLES[proto.status]}`}>{proto.status}</span>
                        {logoSrc && (
                          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                            <img src={logoSrc} alt={proto.shortName} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">{proto.shortName}</span>
                          <span className="text-zinc-500 text-xs ml-2 hidden sm:inline">— {proto.purpose.substring(0, 60)}…</span>
                        </div>
                      </div>
                      <ChevronDown size={15} className={`text-zinc-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
                        <div className="mt-2 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Full Name</p>
                            <p className="text-zinc-300">{proto.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Communication Model</p>
                            <p className="text-zinc-300">{proto.model}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Purpose</p>
                            <p className="text-zinc-300 font-sans leading-relaxed">{proto.purpose}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Typical Use Case</p>
                            <p className="text-zinc-300 font-sans leading-relaxed">{proto.useCase}</p>
                          </div>
                          {proto.relatedProject && (
                            <div className="sm:col-span-2">
                              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Related Project</p>
                              <span className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-900/60 text-cyan-300 text-[11px] font-mono">{proto.relatedProject}</span>
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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <Cpu size={14} /> Technical Competencies
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
            Skills Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SKILL_GROUPS.map(group => (
              <div key={group.category} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-cyan-400">{getIcon(group.icon, 16)}</span>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">{group.category}</p>
                </div>
                <div className="space-y-2">
                  {group.skills.map(skill => {
                    const logoSrc = TECH_LOGO_MAP[skill.name];
                    return (
                      <div key={skill.name} className="flex items-center justify-between gap-2 py-1 border-b border-zinc-900/60 last:border-0">
                        <div className="flex items-center gap-2">
                          {logoSrc ? (
                            <img src={logoSrc} alt={skill.name} className="w-4 h-4 object-contain shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs text-zinc-300 font-mono">{skill.name}</p>
                            {skill.note && <p className="text-[10px] text-zinc-600">{skill.note}</p>}
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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
            <BookOpen size={14} /> Engineering Docs
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
            Documentation Library
          </h2>
          <p className="text-sm text-zinc-400 font-sans mb-8">
            Available documents open directly. Pending items will be added as files are prepared and uploaded.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {docCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveDocCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeDocCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
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
                    ? 'border-emerald-800/40 bg-emerald-950/10'
                    : 'border-zinc-800 bg-zinc-950/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${doc.available ? 'text-emerald-300 border-emerald-700/50 bg-emerald-950/40' : 'text-zinc-500 border-zinc-700 bg-zinc-900/40'}`}>
                      {doc.available ? 'Available' : 'Pending'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">{doc.category}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200">{doc.title}</p>
                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">{doc.description}</p>
                  <p className="text-[10px] font-mono text-zinc-600 italic">{doc.previewNote}</p>
                </div>
                {doc.available && doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition-colors self-start"
                  >
                    {doc.url.includes('youtube') ? <><Youtube size={11} /> Watch Video</> : <><ExternalLink size={11} /> View</>}
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-700 self-start px-3 py-1.5 rounded-lg border border-zinc-800">Awaiting upload</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom cross-nav ── */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Zap size={16} className="text-cyan-400" /> Explore More
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-md">
              Embedded IoT hardware prototypes, hackathon build photos, and academic certifications in the photo gallery.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/gallery" className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2">
              Photo Gallery
            </Link>
            <Link to="/#projects" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2">
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
