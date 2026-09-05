import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  ExternalLink,
  Cpu,
  Sliders,
  Search,
  X,
  Share2,
  Check,
  Maximize2,
  Minimize2,
  Layers,
  Terminal,
  Activity,
  Image as ImageIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Radio,
  Workflow
} from 'lucide-react';
import SEO from '../components/common/SEO';
import {
  AUTOMATION_VIDEOS,
  AUTOMATION_CATEGORIES,
  AutomationCategory,
  AutomationVideoItem
} from '../data/automationVideos';
import { PROFILE } from '../constants';
import { trackInteraction } from '../utils/analytics';

const Automation: React.FC = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<AutomationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useState<string>(AUTOMATION_VIDEOS[0].id);
  const [expandedSpecsId, setExpandedSpecsId] = useState<string | null>(AUTOMATION_VIDEOS[0].id);
  const [theaterMode, setTheaterMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const spotlightRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Read URL hash or query if user linked directly to a video
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = AUTOMATION_VIDEOS.find(v => v.id === hash);
      if (match) {
        setActiveVideoId(match.id);
        setExpandedSpecsId(match.id);
      }
    }
  }, [location]);

  // Current active spotlight video
  const activeVideo = useMemo(() => {
    return AUTOMATION_VIDEOS.find(v => v.id === activeVideoId) || AUTOMATION_VIDEOS[0];
  }, [activeVideoId]);

  // Filtered videos based on category and search query
  const filteredVideos = useMemo(() => {
    return AUTOMATION_VIDEOS.filter(video => {
      const matchesCategory =
        selectedCategory === 'All' || video.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        video.title.toLowerCase().includes(q) ||
        video.subtitle.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.techStack.some(t => t.toLowerCase().includes(q)) ||
        video.specs.communicationProtocols.some(p => p.toLowerCase().includes(q)) ||
        video.specs.softwareTools.some(s => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectVideo = (video: AutomationVideoItem) => {
    setActiveVideoId(video.id);
    setExpandedSpecsId(video.id);
    trackInteraction('select_automation_video', 'automation', video.title);

    // Smooth scroll to spotlight player
    if (spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/automation#${activeVideo.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    trackInteraction('copy_video_link', 'automation', activeVideo.id);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Structured Schema for SEO
  const jsonLdSchema = useMemo(() => {
    const videoObjects = AUTOMATION_VIDEOS.map(v => ({
      '@type': 'VideoObject',
      name: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl.startsWith('http') ? v.thumbnailUrl : `https://rsmk.tech${v.thumbnailUrl}`,
      embedUrl: v.type === 'youtube' ? v.embedUrl : `https://rsmk.tech${v.videoUrl}`,
      contentUrl: v.type === 'youtube' ? v.videoUrl : `https://rsmk.tech${v.videoUrl}`,
      uploadDate: v.date === 'Jan 2026' ? '2026-01-15T00:00:00+05:30' : '2026-02-10T00:00:00+05:30',
      author: {
        '@type': 'Person',
        name: PROFILE.name,
        url: 'https://rsmk.tech'
      }
    }));

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Industrial Automation & Control Systems Video Showcase — ${PROFILE.name}`,
        description:
          'Hands-on video demonstrations of PLC programming in CODESYS, Factory I/O 3D simulation, Modbus TCP communication, Connected Components Workbench, Optix Studio HMI, and hardware actuation systems.',
        url: 'https://rsmk.tech/automation',
        author: {
          '@type': 'Person',
          name: PROFILE.name
        },
        hasPart: videoObjects
      },
      ...videoObjects
    ];
  }, []);

  return (
    <div
      data-clarity-region="automation-page"
      className="min-h-screen bg-[#080806] text-zinc-300 font-mono selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden"
    >
      <SEO
        title={`Industrial Automation & PLC Videos | ${PROFILE.name} — CODESYS & HMI Walkthroughs`}
        description="Watch industrial automation, PLC ladder logic, and control system video demonstrations by Srinivasa Manikanta: CODESYS V3.5 3D virtual commissioning with Factory I/O over Modbus TCP, CCW traffic light control with Optix Studio HMI, and embedded hardware safety systems."
        keywords="industrial automation videos, PLC simulation video, CODESYS Factory IO demonstration, Modbus TCP ladder logic, Connected Components Workbench traffic light, FactoryTalk Optix Studio HMI, Srinivasa Manikanta automation, EEE projects video, Arduino ventilation automation, ALIET drone flight test"
        url="/automation"
        image="https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg"
        schema={jsonLdSchema}
      />

      {/* Cyber Grid Background Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => trackInteraction('nav_home_from_automation', 'navigation', 'Dashboard')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors group px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/60"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/gallery"
              onClick={() => trackInteraction('nav_gallery_from_automation', 'navigation', 'Gallery')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors group px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/60"
            >
              <ImageIcon size={14} />
              <span>Photo Gallery</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
              SIMULATION LAB // ONLINE
            </span>
          </div>
        </div>

        {/* Hero Header Section */}
        <div className="pt-8 pb-10">
          <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
            <Workflow size={16} className="text-cyan-400" />
            <span>Control Engineering &amp; Hardware Lab</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight flex flex-wrap items-center gap-3">
            <span>Automation &amp;</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
              PLC Video Demos
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            In-depth walkthroughs of PLC ladder programming, Factory I/O 3D virtual commissioning,
            Modbus TCP network communication, FactoryTalk Optix Studio HMI integration, and
            physical hardware safety actuation.
          </p>
        </div>

        {/* ── Active Video Spotlight Player ── */}
        <div ref={spotlightRef} className="scroll-mt-24 mb-16">
          <div
            className={`rounded-2xl border border-cyan-500/40 bg-zinc-950/90 shadow-[0_0_50px_rgba(0,242,255,0.12)] overflow-hidden transition-all duration-300 ${
              theaterMode ? 'ring-2 ring-cyan-400/80 shadow-[0_0_80px_rgba(0,242,255,0.2)]' : ''
            }`}
          >
            {/* Player Frame Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 bg-zinc-900/80 border-b border-zinc-800 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest pl-2 border-l border-zinc-800">
                  SPOTLIGHT // {activeVideo.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Theater Mode Toggle */}
                <button
                  onClick={() => setTheaterMode(!theaterMode)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-800/60 hover:bg-cyan-500/10 border border-zinc-700/60 rounded-md transition-colors cursor-pointer"
                  title={theaterMode ? 'Exit Theater Mode' : 'Enter Theater Mode'}
                >
                  {theaterMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  <span className="hidden sm:inline">{theaterMode ? 'Standard' : 'Theater'}</span>
                </button>

                {/* Share / Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-800/60 hover:bg-cyan-500/10 border border-zinc-700/60 rounded-md transition-colors cursor-pointer"
                  title="Copy direct link to this video demo"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {activeVideo.type === 'youtube' ? (
                <iframe
                  key={activeVideo.id}
                  className="w-full h-full"
                  src={`${activeVideo.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeVideo.id}
                  ref={localVideoRef}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  poster={activeVideo.thumbnailUrl}
                  preload="metadata"
                >
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Active Video Info Bar */}
            <div className="p-4 sm:p-6 md:p-8 bg-zinc-950">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                      {activeVideo.category}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      {activeVideo.durationBadge}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      // {activeVideo.date}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                    {activeVideo.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-cyan-300/80 font-mono">
                    {activeVideo.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed pt-1">
                    {activeVideo.description}
                  </p>
                </div>

                {/* External Action Links */}
                <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 self-start">
                  {activeVideo.type === 'youtube' && (
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Watch on YouTube</span>
                    </a>
                  )}

                  {activeVideo.relatedProjectUrl && (
                    <a
                      href={activeVideo.relatedProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Live Project Site</span>
                    </a>
                  )}

                  {activeVideo.githubUrl && (
                    <a
                      href={activeVideo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>View GitHub</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="mt-5 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mr-2 flex items-center gap-1">
                  <Terminal size={12} /> Tech Stack:
                </span>
                {activeVideo.techStack.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Detailed Technical Specs Accordion for the Spotlight Video */}
              <div className="mt-6 pt-6 border-t border-zinc-800/80">
                <button
                  onClick={() =>
                    setExpandedSpecsId(expandedSpecsId === activeVideo.id ? null : activeVideo.id)
                  }
                  className="flex items-center justify-between w-full p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                      Engineering Architecture &amp; Control Specs
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 group-hover:text-cyan-400 transition-transform duration-300 ${
                      expandedSpecsId === activeVideo.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedSpecsId === activeVideo.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 sm:p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-4 text-xs font-mono">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                              Control Platform:
                            </span>
                            <p className="text-zinc-200 font-semibold">{activeVideo.specs.controlPlatform}</p>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                              Communication Protocols:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeVideo.specs.communicationProtocols.map(proto => (
                                <span
                                  key={proto}
                                  className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px]"
                                >
                                  {proto}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                              Software &amp; Toolchain:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeVideo.specs.softwareTools.map(tool => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                              I/O &amp; Signal Channels:
                            </span>
                            <div className="space-y-1">
                              {activeVideo.specs.ioInterfacing.map((io, idx) => (
                                <div key={idx} className="text-zinc-300 text-[11px] flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                                  <span>{io}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80">
                          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                            Control Philosophy &amp; Interlocks:
                          </span>
                          <p className="text-zinc-300 text-[11px] font-sans leading-relaxed mt-1">
                            {activeVideo.specs.controlPhilosophy}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80">
                          <span className="text-zinc-500 uppercase tracking-widest text-[10px] mb-2 block">
                            Key Technical Highlights:
                          </span>
                          <ul className="space-y-1.5">
                            {activeVideo.highlights.map((point, index) => (
                              <li key={index} className="flex items-start gap-2 text-zinc-300 text-[11px] font-sans">
                                <ShieldCheck size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Filter & Search Bar ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {AUTOMATION_CATEGORIES.map(category => {
              const count =
                category === 'All'
                  ? AUTOMATION_VIDEOS.length
                  : AUTOMATION_VIDEOS.filter(v => v.category === category).length;
              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    trackInteraction('filter_automation_category', 'automation', category);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.3)]'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-cyan-400/30 text-cyan-200' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ladder logic, tools, protocols..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500/60 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 text-xs font-mono text-zinc-200 placeholder-zinc-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Video Grid ── */}
        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-zinc-800/80 bg-zinc-950/60 my-10">
            <Radio size={32} className="mx-auto text-zinc-600 mb-3 animate-pulse" />
            <p className="text-sm text-zinc-400 font-mono">
              No automation videos match the current search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredVideos.map(video => {
              const isSelected = video.id === activeVideoId;

              return (
                <div
                  key={video.id}
                  className={`group rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden bg-zinc-950/80 backdrop-blur-sm ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-[0_0_30px_rgba(0,242,255,0.15)]'
                      : 'border-zinc-800 hover:border-zinc-700 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => handleSelectVideo(video)}
                    className="relative aspect-video w-full overflow-hidden bg-zinc-900 cursor-pointer"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => {
                        // Fallback image if youtube maxresdefault isn't available
                        (e.target as HTMLImageElement).src = '/assets/gallery/ahacks/prize-ceremony.jpg';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category & Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/75 border border-cyan-500/30 text-cyan-300 backdrop-blur-sm">
                        {video.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-black/75 border border-amber-500/30 text-amber-300 backdrop-blur-sm">
                        {video.durationBadge}
                      </span>
                    </div>

                    {/* Play Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                          isSelected
                            ? 'bg-cyan-400 text-black scale-110 shadow-[0_0_20px_rgba(0,242,255,0.8)]'
                            : 'bg-black/70 border border-zinc-600 text-white group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-black group-hover:scale-110'
                        }`}
                      >
                        <Play size={18} className="fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Status bar on thumb */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-zinc-300 font-mono">
                      <span>{video.date}</span>
                      {isSelected && (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          NOW PLAYING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => handleSelectVideo(video)}
                        className="text-base font-bold text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2"
                      >
                        {video.title}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-400 font-sans line-clamp-2">
                        {video.subtitle}
                      </p>

                      {/* Tech stack tags */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {video.techStack.slice(0, 3).map(tech => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {video.techStack.length > 3 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 text-zinc-500">
                            +{video.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <button
                        onClick={() => handleSelectVideo(video)}
                        className={`text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isSelected ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-cyan-300'
                        }`}
                      >
                        <Play size={12} className="fill-current" />
                        <span>{isSelected ? 'Loaded in Player' : 'Play Video'}</span>
                      </button>

                      {video.type === 'youtube' && (
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open on YouTube"
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Cross Navigation & Lab Insights Banner ── */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={18} className="text-cyan-400" />
              <span>Explore More Engineering Work</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
              Inspect hardware hackathon build photos, EV battery management system prototypes,
              and academic certifications in the photo gallery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/gallery"
              onClick={() => trackInteraction('cta_gallery_from_automation', 'cta', 'Gallery')}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <ImageIcon size={14} />
              <span>View Photo Gallery</span>
            </Link>

            <Link
              to="/#projects"
              onClick={() => trackInteraction('cta_projects_from_automation', 'cta', 'Projects')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <Cpu size={14} />
              <span>View All Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;
