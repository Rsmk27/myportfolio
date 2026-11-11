import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight,
  Video, Zap, Maximize2, Crosshair, Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const CATEGORY_SHORT_TAG: Record<GalleryItem['category'], string> = {
  '400/220kV GIS Substation': 'HV-GIS',
  'A-Hacks Hackathon 🥈': 'HACK-02',
  'Projects & Hardware': 'HW-LAB',
  'Workshops & Industry': 'IND-OPS',
  'Campus Life': 'ALIET',
};

const GalleryModal: React.FC<{
  items: GalleryItem[];
  selectedIdx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ items, selectedIdx, onClose, onPrev, onNext }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const activeItem = items[selectedIdx];

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        onNext();
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!activeItem) return null;

  const frameCode = `FRM-${String(selectedIdx + 1).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-3 sm:p-6 md:p-10"
    >
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Gallery inspection: ${activeItem.alt}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-2xl border border-zinc-800 bg-[#0d0d0b] shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top optical calibration rail */}
        <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-amber-400/70 to-transparent" />

        {/* Header telemetry bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-zinc-800/90 bg-[#111110]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-300 tracking-widest uppercase">
              <Crosshair size={13} className="text-cyan-400" />
              {frameCode}
            </span>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-[11px] font-mono text-zinc-300">
              {selectedIdx + 1} OF {items.length}
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              {activeItem.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] font-mono text-zinc-400 tracking-wider uppercase mr-2">
              ESC // ← → NAV
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-700/70 text-zinc-300 hover:text-white hover:border-cyan-400/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close image popup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewport stage */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-[#070706] p-4 sm:p-6">
          {/* Calibration grid background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e16_1px,transparent_1px),linear-gradient(to_bottom,#1e1e16_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none"
          />

          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 sm:left-4 z-20 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full bg-[#111110]/90 border border-zinc-700/80 text-zinc-200 hover:text-cyan-300 hover:border-cyan-400/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="relative z-10 flex items-center justify-center max-w-full max-h-[64vh] p-2 rounded-xl border border-zinc-800/80 bg-[#0b0b09]">
            {/* Corner fiducials */}
            <span className="pointer-events-none absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
            <span className="pointer-events-none absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
            <span className="pointer-events-none absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/60" />
            <span className="pointer-events-none absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400/60" />

            <img
              src={encodeURI(activeItem.src)}
              alt={activeItem.alt || 'Engineering photo preview'}
              title={activeItem.alt}
              decoding="async"
              className="max-w-full max-h-[60vh] object-contain rounded-lg select-none"
            />
          </div>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 sm:right-4 z-20 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-full bg-[#111110]/90 border border-zinc-700/80 text-zinc-200 hover:text-cyan-300 hover:border-cyan-400/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Bottom metadata caption bar */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-zinc-800/90 bg-[#111110] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="sm:hidden inline-flex text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              {activeItem.category}
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed">
              {activeItem.alt}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
            TAG // {CATEGORY_SHORT_TAG[activeItem.category]}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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

  const openImage = useCallback((idx: number, triggerEl?: HTMLElement | null) => {
    const item = filteredImages[idx];
    if (!item) return;
    lastFocusedRef.current = triggerEl ?? (document.activeElement as HTMLElement | null);
    setSelectedIdx(idx);
    trackInteraction('gallery_view_image', 'gallery', item.alt || item.src);
  }, [filteredImages]);

  const closeImage = useCallback(() => {
    setSelectedIdx(null);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
  }, []);

  const nextImage = useCallback(() => {
    setSelectedIdx(prev => (prev === null ? null : (prev + 1) % filteredImages.length));
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIdx(prev => (prev === null ? null : (prev - 1 + filteredImages.length) % filteredImages.length));
  }, [filteredImages.length]);

  return (
    <div
      data-clarity-region="gallery-page"
      className="min-h-screen bg-[#080806] text-zinc-300 font-mono selection:bg-cyan-500/30 selection:text-white relative overflow-x-hidden"
    >
      <SEO
        title={`Photo Gallery | ${PROFILE.name} — 400kV Substation, Industrial Automation & Hardware`}
        description="Explore Srinivasa Manikanta Rajapantula's engineering gallery: 400/220kV Gas Insulated Substation (GIS) industrial visit at APTRANSCO Thallayapalem, ALIET college projects, 2nd place A-Hacks Hardware Hackathon build, Industrial Automation & PLC simulations, and EV battery systems."
        url="/gallery"
        image="https://rsmk.tech/assets/gallery/gis-substation/gis-substation-manikanta-signboard.jpeg"
        schema={GALLERY_JSON_LD}
      />

      {/* Background blueprint grid & subtle copper/cyan ambient field */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e16_1px,transparent_1px),linear-gradient(to_bottom,#1e1e16_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">

        {/* ── Top Navigation Rack ── */}
        <nav
          aria-label="Gallery navigation"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-300 hover:text-cyan-300 transition-colors group px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-cyan-400" />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              to="/automation"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-cyan-300 transition-colors px-3.5 py-2 rounded-lg border border-zinc-800 hover:border-cyan-500/40 bg-[#0d0d0b]"
            >
              <Video size={14} className="text-amber-400" />
              <span>Automation Journey</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
            <Camera size={12} />
            <span>Optical Archive // {GALLERY_IMAGES.length} Frames</span>
          </div>
        </nav>

        {/* ── Header & Filter Rack ── */}
        <header className="pt-8 pb-8">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
            <ImageIcon size={15} />
            <span>SYS.02 // Hardware &amp; Substation Field Log</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 uppercase tracking-tight leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Engineering{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
              Lab Gallery
            </span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-sans max-w-3xl mb-6 leading-relaxed">
            Calibrated field documentation spanning 400/220kV GIS substation inspections, hackathon hardware builds, EV battery telemetry, and industrial automation trials. Select any frame to inspect in high detail.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIdx(null);
                    trackInteraction('gallery_filter_category', 'gallery', cat);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_16px_rgba(0,242,255,0.2)]'
                      : 'bg-[#0d0d0b] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {cat === '400/220kV GIS Substation' && <Zap size={12} className="text-cyan-400" />}
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-cyan-400/30 text-cyan-100' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {/* ── Substation Featured Highlight Banner ── */}
        {(activeCategory === 'All' || activeCategory === '400/220kV GIS Substation') && (
          <section
            aria-label="Featured substation visit"
            className="relative mb-6 w-full rounded-2xl border border-cyan-500/35 bg-[#0d0d0b]/95 p-5 md:p-6 backdrop-blur-md shadow-[0_0_32px_rgba(0,242,255,0.08)] overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400/60 to-transparent" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/35 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Industrial Technical Visit
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">// APTRANSCO — Amaravati</span>
                  </div>
                  <h2
                    className="text-base sm:text-xl font-bold text-white uppercase tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    400/220 kV Gas Insulated Substation (GIS) — Thallayapalem
                  </h2>
                  <p className="text-xs text-zinc-300 font-sans mt-1 max-w-2xl leading-relaxed">
                    Field visit and technical study of SF6 gas-insulated switchgear, 400kV Crompton Greaves autotransformers, Bay-23 tie bay, SIFANG SCADA telemetry single line diagrams, and automated deluge fire protection systems.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg">
                  {categoryCounts['400/220kV GIS Substation']} Frames Logged
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Dedicated Automation Showcase Cross-Link ── */}
        {activeCategory === 'All' && (
          <section
            aria-label="Automation portfolio link"
            className="mb-10 w-full rounded-2xl border border-zinc-800 bg-[#0d0d0b]/85 p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3 rounded-xl bg-[#111110] border border-amber-500/30 text-amber-400 shrink-0">
                <Video size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Dedicated Showcase
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">// CODESYS &amp; Rockwell CCW</span>
                </div>
                <h2
                  className="text-base sm:text-xl font-bold text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Industrial Automation Journey
                </h2>
                <p className="text-xs text-zinc-300 font-sans mt-1 leading-relaxed">
                  Engineering journey from electrical schematics and PLC ladder programming to 3D virtual commissioning, HMI, and predictive maintenance.
                </p>
              </div>
            </div>

            <Link
              to="/automation"
              className="px-5 py-2.5 rounded-xl bg-[#111110] hover:bg-cyan-500/15 border border-zinc-700 hover:border-cyan-400/60 text-zinc-200 hover:text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all shrink-0 flex items-center gap-2"
            >
              <span>Explore Automation Journey</span>
              <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </section>
        )}

        {/* ── Precision Calibration-Frame Masonry Grid ── */}
        <section aria-label="Calibration photo frames" className="pb-16">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {filteredImages.map((item, idx) => {
              const frameId = `FRM-${String(idx + 1).padStart(2, '0')}`;
              const shortTag = CATEGORY_SHORT_TAG[item.category];
              return (
                <article
                  key={`${activeCategory}-${item.src}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${frameId}: ${item.alt}`}
                  onClick={(e) => openImage(idx, e.currentTarget)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openImage(idx, e.currentTarget);
                    }
                  }}
                  className="group relative break-inside-avoid rounded-xl border border-zinc-800/90 hover:border-cyan-400/60 bg-[#0d0d0b] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(0,242,255,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  {/* Top Calibration Bar */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-[#111110] text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                      <span className="text-zinc-200 font-bold tracking-wider">{frameId}</span>
                    </div>
                    <span className="text-amber-300/90 tracking-widest uppercase">{shortTag}</span>
                  </div>

                  {/* Image Container with Corner Calibration Reticles */}
                  <div className="relative overflow-hidden bg-[#070706]">
                    <img
                      src={encodeURI(item.src)}
                      alt={item.alt}
                      title={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    {/* Calibration corner brackets on hover/focus */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                    />

                    {/* Inspect pill */}
                    <div className="pointer-events-none absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/80 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono uppercase tracking-wider backdrop-blur-sm">
                        <Maximize2 size={10} /> Inspect
                      </span>
                    </div>

                    {/* Clean metadata scrim overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-8 pb-3 px-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <p className="text-[11px] text-zinc-200 font-sans leading-snug line-clamp-2">
                        {item.alt}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Lightbox / Calibration Inspection Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <GalleryModal
            items={filteredImages}
            selectedIdx={selectedIdx}
            onClose={closeImage}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
