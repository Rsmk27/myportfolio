import React, { useMemo, useState, useEffect } from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight, Video, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from '../components/ui/Masonry';
import { PROFILE } from '../constants';
import { trackInteraction } from '../utils/analytics';

export interface GalleryItem {
  src: string;
  alt: string;
  category: '400/220kV GIS Substation' | 'A-Hacks Hackathon 🥈' | 'Projects & Hardware' | 'Workshops & Industry' | 'Campus Life';
}

const GALLERY_IMAGES: GalleryItem[] = [
  // ── 400/220 kV Gas Insulated Substation (GIS) Industrial Visit — APTRANSCO Thallayapalem ──
  {
    src: '/assets/gallery/gis-substation/gis-substation-manikanta-signboard.jpeg',
    alt: 'Srinivasa Manikanta Rajapantula at the APTRANSCO 400/220KV GIS Substation Thallayapalem industrial visit',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-substation-student-delegation.jpeg',
    alt: 'ALIET Electrical & Electronics Engineering student delegation and faculty with APTRANSCO engineers at 400/220kV GIS Substation, Thallayapalem',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-indoor-switchgear-hall-bays.jpeg',
    alt: 'Indoor Gas Insulated Switchgear (GIS) hall featuring 400kV SF6 encapsulated circuit breakers, Bay-24 Bus Reactor, and Bay-23 Tie Bay',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-scada-hmi-single-line-diagram.jpeg',
    alt: 'SIFANG Substation Automation System (SAS) SCADA monitor displaying real-time 400kV Single Line Diagram, telemetry, and breaker states',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-substation-sld-schematic-board.jpeg',
    alt: 'APTRANSCO 400/220kV Thallayapalem GIS Substation official Single Line Diagram (SLD) schematic wall display',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-crompton-greaves-autotransformer.jpeg',
    alt: '400/220 kV Crompton Greaves power autotransformer with extra-high-voltage (EHV) bushings and automatic water deluge fire protection system',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-students-transformer-inspection.jpeg',
    alt: 'Electrical engineering students inspecting a 400/220kV power transformer, discussing transformer protection and cooling with field engineers',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-switchyard-overview-400kv.jpeg',
    alt: '400/220 kV Gas Insulated Substation (GIS) outdoor switchyard showing 400kV gantries, transmission towers, and SF6 gas-insulated bus ducts at APTRANSCO Thallayapalem',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-bay-23-tie-bay-panel.jpeg',
    alt: 'GE Bay-23 Tie Bay control and protection panel with bus mimic diagram and breaker position indicators at APTRANSCO 400kV GIS Substation',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-numerical-protection-relays.jpeg',
    alt: 'Substation control room numerical protection relays and Intelligent Electronic Devices (IEDs) for 400kV feeder monitoring',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-sas-bcu-panel-gps-clock.jpeg',
    alt: 'SIFANG SAS Auxiliary Bay Control Unit (BCU) panel and GPS master time synchronization rack in the substation control center',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-sf6-busduct-air-bushings.jpeg',
    alt: 'SF6 gas-insulated bus (GIB) duct system transitioning to outdoor EHV bushings connected to 400kV overhead transmission towers',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-surge-arrester-corona-ring.jpeg',
    alt: '400kV surge arrester with grading corona ring and quad-bundle transmission line connecting to lattice tower',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-students-switchyard-walkthrough.jpeg',
    alt: 'Engineering students touring the 400kV outdoor switchyard beneath high-voltage transmission gantries and SF6 gas-insulated bus ducts',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-power-transformer-blast-wall.jpeg',
    alt: '400/220 kV Power Autotransformer yard with fire barrier blast wall, cooling radiators, and high-voltage bushings at APTRANSCO GIS Substation',
    category: '400/220kV GIS Substation'
  },
  {
    src: '/assets/gallery/gis-substation/gis-sf6-gas-cylinders-storage.jpeg',
    alt: 'Sulphur Hexafluoride (SF6) dielectric gas cylinder bank used for gas-insulated switchgear chambers and arc quenching',
    category: '400/220kV GIS Substation'
  },

  // ── A-Hacks 24hr Hackathon — 2nd Place 🥈 ──
  { src: '/assets/gallery/ahacks/ahacks-banner.jpg', alt: 'A-Hacks 24-hour hardware hackathon banner — Srinivasa Manikanta Rajapantula', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/prize-ceremony.jpg', alt: 'Srinivasa Manikanta receiving 2nd prize at A-Hacks 2026 hackathon for SFMD wearable hardware device', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/demo-presentation.jpg', alt: 'Live demo of SFMD Firefighter Safety IoT Wearable Device at A-Hacks hackathon by Manikanta Rajapantula', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/judge-evaluation.jpg', alt: 'Hackathon judges evaluating the firefighter IoT wearable project designed with ESP32 & sensors', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/coding-session-1.jpg', alt: 'Srinivasa Manikanta coding embedded firmware in C++ for ESP32 firefighter safety device during hackathon', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/coding-session-2.jpg', alt: 'Engineering team building IoT hardware prototype during 24-hour A-Hacks hackathon', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/hackathon-hall.jpg', alt: 'A-Hacks hackathon event hall with engineering teams developing hardware and embedded systems', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/device-strap-front.jpg', alt: 'Firefighter safety wearable device (SFMD) — front view showing sensors, display, and strap enclosure', category: 'A-Hacks Hackathon 🥈' },
  { src: '/assets/gallery/ahacks/device-strap-back.jpg', alt: 'Firefighter safety wearable device (SFMD) — back view showing ESP32 circuitry, wiring, and battery harness', category: 'A-Hacks Hackathon 🥈' },

  // ── Campus & Laboratory Moments ──
  { src: '/assets/gallery/img-20260128-104328.jpg', alt: 'Srinivasa Manikanta — campus life at Andhra Loyola Institute of Engineering and Technology (ALIET)', category: 'Campus Life' },
  { src: '/assets/gallery/img-20250311-WA0009.jpg', alt: 'Srinivasa Manikanta — EEE engineering team project collaboration at ALIET Vijayawada', category: 'Campus Life' },
  { src: '/assets/gallery/img-20251010-WA0001.jpg', alt: 'Srinivasa Manikanta — academic technical event and seminar at ALIET', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260107-WA0035.jpg', alt: 'Srinivasa Manikanta — Electrical and Electronics Engineering department event at ALIET', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260107-WA0033.jpg', alt: 'Srinivasa Manikanta — EEE departmental group photo at Andhra Loyola Institute of Engineering and Technology (ALIET)', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260107-WA0050.jpg', alt: 'Srinivasa Manikanta — college campus moment at ALIET Vijayawada', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260128-WA0010.jpg', alt: 'Srinivasa Manikanta — student technical activities and robotics projects at ALIET', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260130-WA0007.jpg', alt: 'Srinivasa Manikanta — engineering project showcase and demonstration at ALIET', category: 'Campus Life' },
  { src: '/assets/gallery/img-20260131-WA0011.jpg', alt: 'Srinivasa Manikanta — hands-on engineering lab learning experience at ALIET', category: 'Campus Life' },

  // ── Project builds & Hardware ──
  { src: '/assets/auto-exhaust-fan/image-1.jpg', alt: 'Automatic exhaust fan project — Arduino UNO with MQ-2 gas sensor hardware setup by Srinivasa Manikanta', category: 'Projects & Hardware' },
  { src: '/assets/auto-exhaust-fan/image-2.jpg', alt: 'Automatic exhaust fan — 5V relay module and industrial ventilation fan wiring interface', category: 'Projects & Hardware' },
  { src: '/assets/auto-exhaust-fan/image-3.jpg', alt: 'Automatic exhaust fan — completed hardware prototype with enclosure and status LEDs', category: 'Projects & Hardware' },
  { src: '/assets/gridforge/web-dashboard-interface.png', alt: 'GridForge smart grid web dashboard interface for real-time power monitoring by Srinivasa Manikanta', category: 'Projects & Hardware' },
  { src: '/assets/gridforge/matlab-simulation-model.png', alt: 'GridForge MATLAB Simulink power grid simulation model for industrial energy management', category: 'Projects & Hardware' },
  { src: '/assets/gridforge/simulation-results.png', alt: 'GridForge simulation results — voltage stability, frequency regulation, and power analysis graphs', category: 'Projects & Hardware' },
  { src: '/assets/gridforge/backend-api-code.png', alt: 'GridForge backend API code for smart grid data processing and telemetry analytics', category: 'Projects & Hardware' },

  // ── Industrial Training & Workshops ──
  { src: '/assets/experience/coromandel/single-line-diagram.jpg', alt: 'Industrial power distribution single line diagram (SLD) 11kV/440V — Coromandel International Limited', category: 'Workshops & Industry' },
  { src: '/assets/experience/coromandel/site-photo.jpg', alt: 'Coromandel International Limited industrial plant site — electrical engineering internship', category: 'Workshops & Industry' },
  { src: '/assets/experience/coromandel/training-site.jpg', alt: 'Industrial training site and substation at Coromandel International Limited', category: 'Workshops & Industry' },
  { src: '/assets/certifications/drone-technology/training-1.jpg', alt: 'Drone technology hands-on flight test and telemetry training session', category: 'Workshops & Industry' },
  { src: '/assets/certifications/drone-technology/training-2.jpg', alt: 'Drone assembly, motor calibration, and flight training workshop at ALIET', category: 'Workshops & Industry' },
  { src: '/assets/certifications/3d-printing/workshop-1.jpg', alt: '3D printing workshop — learning additive manufacturing and CAD modeling at ALIET', category: 'Workshops & Industry' },
  { src: '/assets/certifications/3d-printing/workshop-2.jpg', alt: '3D printing workshop — FDM 3D printer operation and calibration training', category: 'Workshops & Industry' },
  { src: '/assets/certifications/3d-printing/workshop-3.jpg', alt: '3D printing workshop — designing 3D mechanical models and enclosures', category: 'Workshops & Industry' },
  { src: '/assets/certifications/3d-printing/workshop-4.jpg', alt: '3D printing workshop — custom 3D printed prototype hardware output', category: 'Workshops & Industry' },
  { src: '/assets/certifications/3d-printing/workshop-5.jpg', alt: '3D printing workshop — team collaboration and prototyping session at ALIET', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/bms-battery-monitor-prototype.jpeg', alt: 'EV Battery Management System (BMS) prototype with 18650 Li-ion cells, telemetry LCD, and relay control', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/bms-over-temperature-protection.jpeg', alt: 'BMS thermal management cutoff test displaying over-temperature protection alert for EV safety', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/igk-brushless-motor-controller.jpeg', alt: '250W Sine wave brushless DC (BLDC) motor controller unit for electric vehicles', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/khetaan-smart-wireless-controller.jpeg', alt: 'Khetaan smart wireless BLDC EV motor controller with 48V-72V operational range', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/ev-workshop-seminar.webp', alt: 'Electric vehicle systems and battery development workshop seminar at ALIET Vijayawada', category: 'Workshops & Industry' },
  { src: '/assets/gallery/ev-battery/ev-technology-classroom.jpg', alt: 'Electric Vehicle Technology hands-on departmental workshop training session at ALIET', category: 'Workshops & Industry' }
];

const CATEGORIES = [
  'All',
  '400/220kV GIS Substation',
  'A-Hacks Hackathon 🥈',
  'Workshops & Industry',
  'Projects & Hardware',
  'Campus Life'
] as const;

type CategoryFilter = typeof CATEGORIES[number];

const GALLERY_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Srinivasa Manikanta Rajapantula — Engineering Portfolio Gallery",
    "description": "Photo and media gallery showcasing 400/220kV Gas Insulated Substation (GIS) industrial visit at APTRANSCO Thallayapalem, A-Hacks hackathon hardware builds, embedded systems prototypes, campus moments, industrial internship sites, EV battery systems, and engineering workshop activities of Srinivasa Manikanta Rajapantula at ALIET.",
    "url": "https://rsmk.tech/gallery",
    "author": {
      "@type": "Person",
      "name": "Srinivasa Manikanta Rajapantula",
      "alternateName": ["RSMK", "Srinivasa Manikanta", "Manikanta", "Rajapantula"],
      "url": "https://rsmk.tech"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": GALLERY_IMAGES.length,
      "itemListElement": GALLERY_IMAGES.map((img, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "ImageObject",
          "contentUrl": `https://rsmk.tech${img.src}`,
          "name": img.alt,
          "description": img.alt,
          "author": {
            "@type": "Person",
            "name": "Srinivasa Manikanta Rajapantula"
          }
        }
      }))
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Industrial Automation Learning on CODESYS — Srinivasa Manikanta Rajapantula",
    "description": "PLC ladder logic and 3D plant simulation walkthrough using CODESYS, Factory I/O, and Modbus TCP by Srinivasa Manikanta Rajapantula.",
    "thumbnailUrl": "https://rsmk.tech/assets/gallery/ahacks/prize-ceremony.jpg",
    "uploadDate": "2026-01-15T00:00:00+05:30",
    "embedUrl": "https://www.youtube.com/embed/2pnFLqmh6X4",
    "author": {
      "@type": "Person",
      "name": "Srinivasa Manikanta Rajapantula"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "1-Way Traffic Light Control using CCW and Optix Studio — Srinivasa Manikanta Rajapantula",
    "description": "1-Way Traffic Light PLC control logic simulation built with Connected Components Workbench (CCW) and FactoryTalk Optix Studio HMI by Srinivasa Manikanta Rajapantula.",
    "thumbnailUrl": "https://rsmk.tech/assets/gallery/ahacks/demo-presentation.jpg",
    "uploadDate": "2026-02-10T00:00:00+05:30",
    "embedUrl": "https://www.youtube.com/embed/qIJbTBcBfjE",
    "author": {
      "@type": "Person",
      "name": "Srinivasa Manikanta Rajapantula"
    }
  }
];

const Gallery: React.FC = () => {
  const heights = [450, 600, 750, 500, 650, 550, 700];

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GALLERY_IMAGES.length };
    GALLERY_IMAGES.forEach(img => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredImages = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter(img => img.category === activeCategory);
  }, [activeCategory]);

  const masonryItems = useMemo(() => {
    return filteredImages.map((img, idx) => ({
      id: `${activeCategory}-${idx + 1}`,
      img: img.src,
      alt: img.alt,
      url: img.src,
      height: heights[idx % heights.length]
    }));
  }, [filteredImages, activeCategory]);

  const openImage = (item: any) => {
    const idx = filteredImages.findIndex(img => img.src === item.img);
    if (idx !== -1) {
      setSelectedImg(item.img);
      setSelectedIdx(idx);
      trackInteraction('gallery_view_image', 'gallery', filteredImages[idx].alt || item.img);
    }
  };

  const closeImage = () => {
    setSelectedImg(null);
    setSelectedIdx(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    const nextIdx = (selectedIdx + 1) % filteredImages.length;
    setSelectedImg(filteredImages[nextIdx].src);
    setSelectedIdx(nextIdx);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    const prevIdx = (selectedIdx - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImg(filteredImages[prevIdx].src);
    setSelectedIdx(prevIdx);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') closeImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, filteredImages]);

  return (
    <div data-clarity-region="gallery-page" className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300 bg-black overflow-hidden">
      <SEO
        title={`Photo Gallery | ${PROFILE.name} — 400kV Substation, Industrial Automation & Hardware`}
        description="Explore Srinivasa Manikanta Rajapantula's engineering gallery: 400/220kV Gas Insulated Substation (GIS) industrial visit at APTRANSCO Thallayapalem, ALIET college projects, 2nd place A-Hacks Hardware Hackathon build, Industrial Automation & PLC simulations, and EV battery systems."
        url="/gallery"
        image="https://rsmk.tech/assets/gallery/gis-substation/gis-substation-manikanta-signboard.jpeg"
        schema={GALLERY_JSON_LD}
      />

      {/* Full-screen layout: header + masonry flows vertically */}
      <div className="relative z-10 flex flex-col" style={{ height: '100dvh', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div className="flex-shrink-0 pt-16 pb-2 px-4 sm:px-6 md:pt-20 md:pb-4 md:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between gap-4 mb-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-cyan-500 hover:text-cyan-400 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              to="/automation"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-cyan-300 transition-colors group px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-cyan-500/30 bg-zinc-900/60"
            >
              <Video size={14} className="text-cyan-400" />
              <span>Automation Videos</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-1 md:mb-2 uppercase tracking-tight flex items-center gap-3">
            <ImageIcon size={32} className="text-cyan-500 sm:w-10 sm:h-10 animate-pulse" />
            Gallery
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Click any tile to expand the image in a slideshow overlay. Filter by category below.
          </p>

          {/* ── Category Filter Pills ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    trackInteraction('gallery_filter_category', 'gallery', cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(0,242,255,0.25)]'
                      : 'bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {cat === '400/220kV GIS Substation' && <Zap size={12} className="text-cyan-400" />}
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Masonry Grid ── */}
        <div className="flex-1 relative min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full pb-16" data-lenis-prevent>
          {/* Substation Featured Highlight Banner */}
          {(activeCategory === 'All' || activeCategory === '400/220kV GIS Substation') && (
            <div className="mb-6 w-full rounded-2xl border border-cyan-500/30 bg-zinc-950/80 p-5 md:p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Industrial Technical Visit
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">// APTRANSCO — Amaravati</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    400/220 kV Gas Insulated Substation (GIS) — Thallayapalem
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5 max-w-2xl">
                    Field visit and technical study of SF6 gas-insulated switchgear, 400kV Crompton Greaves autotransformers, Bay-23 tie bay, SIFANG SCADA telemetry single line diagrams, and automated deluge fire protection systems.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
                  16 Photos Documented
                </span>
              </div>
            </div>
          )}

          {/* Dedicated Automation Videos Showcase Banner */}
          {activeCategory === 'All' && (
            <div className="mb-10 w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-cyan-400 shrink-0">
                  <Video size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Dedicated Page
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">// CODESYS &amp; Rockwell CCW</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                    Industrial Automation &amp; PLC Video Demos
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    High-definition walkthroughs of PLC ladder programming, Factory I/O 3D simulation, and Optix Studio HMI design.
                  </p>
                </div>
              </div>

              <Link
                to="/automation"
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all shrink-0 flex items-center gap-2"
              >
                <span>Watch Automation Demos</span>
                <ArrowLeft size={14} className="rotate-180" />
              </Link>
            </div>
          )}
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.03}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.97}
            blurToFocus={true}
            colorShiftOnHover={true}
            onItemClick={openImage}
          />
        </div>
      </div>

      {/* Lightbox / Popup Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeImage}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 md:p-10"
          >
            {/* Close Button */}
            <button
              onClick={closeImage}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer z-50 p-2 bg-zinc-900/60 border border-zinc-800/40 rounded-full"
              aria-label="Close image popup"
            >
              <X size={20} />
            </button>

            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer z-50 p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-full"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image Container with Title / Alt Text */}
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center select-none"
            >
              <img
                src={selectedImg}
                alt={selectedIdx !== null ? (filteredImages[selectedIdx]?.alt || 'Engineering photo preview') : 'Engineering photo preview'}
                title={selectedIdx !== null ? filteredImages[selectedIdx]?.alt : undefined}
                decoding="async"
                className="max-w-full max-h-[72vh] object-contain rounded-xl border border-zinc-800 shadow-2xl"
              />
              
              {/* Caption */}
              {selectedIdx !== null && filteredImages[selectedIdx] && (
                <div className="mt-4 flex flex-col items-center gap-2 max-w-2xl px-4 text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {filteredImages[selectedIdx].category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {selectedIdx + 1} / {filteredImages.length}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-300 font-mono">
                    {filteredImages[selectedIdx].alt}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer z-50 p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-full"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
