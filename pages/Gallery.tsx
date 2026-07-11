import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from '../components/ui/Masonry';
import { PROFILE } from '../constants';

const GALLERY_IMAGES = [
  // A-Hacks 24hr Hackathon — 2nd Place 🥈
  { src: '/assets/gallery/ahacks/ahacks-banner.jpg', alt: 'A-Hacks 24-hour hardware hackathon banner — Srinivasa Manikanta' },
  { src: '/assets/gallery/ahacks/prize-ceremony.jpg', alt: 'Srinivasa Manikanta receiving 2nd prize at A-Hacks hackathon' },
  { src: '/assets/gallery/ahacks/certificate-2nd-place.jpg', alt: 'A-Hacks hackathon 2nd place certificate — Hardware category' },
  { src: '/assets/gallery/ahacks/demo-presentation.jpg', alt: 'Live demo of Firefighter Safety Device at A-Hacks hackathon' },
  { src: '/assets/gallery/ahacks/judge-evaluation.jpg', alt: 'Judges evaluating the firefighter IoT wearable project' },
  { src: '/assets/gallery/ahacks/coding-session-1.jpg', alt: 'Coding firmware for firefighter safety device during hackathon' },
  { src: '/assets/gallery/ahacks/coding-session-2.jpg', alt: 'Team building IoT device during 24-hour A-Hacks hackathon' },
  { src: '/assets/gallery/ahacks/hackathon-hall.jpg', alt: 'A-Hacks hackathon event hall with teams working' },
  { src: '/assets/gallery/ahacks/device-strap-front.jpg', alt: 'Firefighter safety wearable device — front view with sensors' },
  { src: '/assets/gallery/ahacks/device-strap-back.jpg', alt: 'Firefighter safety wearable device — back view with ESP32 wiring' },
  // General gallery
  { src: '/assets/certifications/Chefronics certificate.jpg', alt: 'Srinivasa Manikanta — college engineering lab session' },
  { src: '/assets/gallery/img-20260128-104328.jpg', alt: 'Srinivasa Manikanta — campus life at engineering college' },
  { src: '/assets/gallery/img-20250311-WA0009.jpg', alt: 'Srinivasa Manikanta — team project collaboration' },
  { src: '/assets/gallery/img-20251010-WA0001.jpg', alt: 'Srinivasa Manikanta — academic event participation' },
  { src: '/assets/gallery/img-20260107-WA0035.jpg', alt: 'Srinivasa Manikanta — engineering department event' },
  { src: '/assets/gallery/img-20260107-WA0033.jpg', alt: 'Srinivasa Manikanta — departmental group photo' },
  { src: '/assets/gallery/img-20260107-WA0050.jpg', alt: 'Srinivasa Manikanta — college campus moment' },
  { src: '/assets/gallery/img-20260128-WA0010.jpg', alt: 'Srinivasa Manikanta — student life and activities' },
  { src: '/assets/gallery/img-20260130-WA0007.jpg', alt: 'Srinivasa Manikanta — project showcase event' },
  { src: '/assets/gallery/img-20260131-WA0011.jpg', alt: 'Srinivasa Manikanta — engineering learning experience' },
  // Project builds
  { src: '/assets/auto-exhaust-fan/image-1.jpg', alt: 'Automatic exhaust fan project — Arduino with MQ-2 gas sensor setup' },
  { src: '/assets/auto-exhaust-fan/image-2.jpg', alt: 'Automatic exhaust fan — relay module and fan wiring' },
  { src: '/assets/auto-exhaust-fan/image-3.jpg', alt: 'Automatic exhaust fan — completed build with enclosure' },
  // GridForge
  { src: '/assets/gridforge/web-dashboard-interface.png', alt: 'GridForge smart grid web dashboard interface' },
  { src: '/assets/gridforge/matlab-simulation-model.png', alt: 'GridForge MATLAB Simulink power grid model' },
  { src: '/assets/gridforge/simulation-results.png', alt: 'GridForge simulation results — voltage and power analysis' },
  { src: '/assets/gridforge/backend-api-code.png', alt: 'GridForge backend API code for grid data processing' },
  // Coromandel Internship
  { src: '/assets/experience/coromandel/single-line-diagram.jpg', alt: 'Industrial power distribution single line diagram — Coromandel' },
  { src: '/assets/experience/coromandel/site-photo.jpg', alt: 'Coromandel International Ltd — industrial plant site' },
  { src: '/assets/experience/coromandel/internship-certificate.jpg', alt: 'Coromandel International electrical engineering internship certificate' },
  { src: '/assets/experience/coromandel/training-site.jpg', alt: 'Industrial training site at Coromandel International Ltd' },
  // Certifications
  { src: '/assets/certifications/Drone technology certificate.png', alt: 'Drone technology workshop completion certificate' },
  { src: '/assets/certifications/drone-technology/training-1.jpg', alt: 'Drone technology hands-on training session' },
  { src: '/assets/certifications/drone-technology/training-2.jpg', alt: 'Drone assembly and flight training workshop' },
  { src: '/assets/certifications/3D Printing.jpg', alt: '3D printing workshop completion certificate' },
  { src: '/assets/certifications/3d-printing/workshop-1.jpg', alt: '3D printing workshop — learning additive manufacturing' },
  { src: '/assets/certifications/3d-printing/workshop-2.jpg', alt: '3D printing workshop — printer operation training' },
  { src: '/assets/certifications/3d-printing/workshop-3.jpg', alt: '3D printing workshop — designing 3D models' },
  { src: '/assets/certifications/3d-printing/workshop-4.jpg', alt: '3D printing workshop — printed prototype output' },
  { src: '/assets/certifications/3d-printing/workshop-5.jpg', alt: '3D printing workshop — group activity session' },
  { src: '/assets/certifications/EV technology.jpg', alt: 'Electric vehicle technology program certificate' },
  { src: '/assets/certifications/Datavalley  Embedded system intership.png', alt: 'Datavalley Embedded Systems short-term internship certificate' },
  { src: '/assets/certifications/Basics of Robotics.png', alt: 'Siemens — Basics of Robotics course completion certificate' },
  { src: '/assets/certifications/AI for Autonomous Vehicles and Robotics.png', alt: 'University of Michigan — AI for Autonomous Vehicles and Robotics course completion certificate' },
  { src: '/assets/certifications/Powering the Future with Electrification.png', alt: 'MathWorks — Powering the Future with Electrification course completion certificate' },
  { src: '/assets/certifications/Interfacing with the Arduino.png', alt: 'University of California, Irvine — Interfacing with the Arduino course completion certificate' },
  { src: '/assets/certifications/Modeling and Simulation with Simulink.png', alt: 'MathWorks — Modeling and Simulation with Simulink course completion certificate' },
  { src: '/assets/certifications/PLC, HMI.png', alt: 'Siemens PLC and TIA Portal (Learn PLC and HMI from Scratch) specialization certificate' },
  { src: '/assets/certifications/Designing and Simulating Physical Models.png', alt: 'MathWorks — Designing and Simulating Physical Models course completion certificate' },
  { src: '/assets/certifications/Battery Design and Management.png', alt: 'MathWorks — Battery Design and Management course completion certificate' },
  { src: '/assets/certifications/Electric Motor Modeling and Control.png', alt: 'MathWorks — Electric Motor Modeling and Control course completion certificate' },
  { src: '/assets/certifications/Power Conversion for Electronic Devices.png', alt: 'MathWorks — Power Conversion for Electronic Devices course completion certificate' },
  { src: '/assets/certifications/Electrified Systems Design Engineer.png', alt: 'MathWorks — Electrified Systems Design Engineer professional certificate' },
];

const GALLERY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Srinivasa Manikanta — Engineering Portfolio Gallery",
  "description": "Photo gallery showcasing hackathon wins, project builds, certifications, internship experiences, and engineering activities of Srinivasa Manikanta Rajapantula.",
  "url": "https://rsmk.me/gallery",
  "author": {
    "@type": "Person",
    "name": "Srinivasa Manikanta Rajapantula",
    "url": "https://rsmk.me"
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": GALLERY_IMAGES.length,
    "itemListElement": GALLERY_IMAGES.map((img, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "ImageObject",
        "contentUrl": `https://rsmk.me${img.src}`,
        "name": img.alt,
        "description": img.alt,
        "author": {
          "@type": "Person",
          "name": "Srinivasa Manikanta Rajapantula"
        }
      }
    }))
  }
};

const Gallery: React.FC = () => {
  const heights = [450, 600, 750, 500, 650, 550, 700];

  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const masonryItems = useMemo(() => {
    return GALLERY_IMAGES.map((img, idx) => ({
      id: String(idx + 1),
      img: img.src,
      url: img.src,
      height: heights[idx % heights.length]
    }));
  }, []);

  const openImage = (item: any) => {
    const idx = GALLERY_IMAGES.findIndex(img => img.src === item.img);
    if (idx !== -1) {
      setSelectedImg(item.img);
      setSelectedIdx(idx);
    }
  };

  const closeImage = () => {
    setSelectedImg(null);
    setSelectedIdx(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    const nextIdx = (selectedIdx + 1) % GALLERY_IMAGES.length;
    setSelectedImg(GALLERY_IMAGES[nextIdx].src);
    setSelectedIdx(nextIdx);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    const prevIdx = (selectedIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    setSelectedImg(GALLERY_IMAGES[prevIdx].src);
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
  }, [selectedIdx]);

  return (
    <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300 bg-black overflow-hidden">
      <Helmet>
        <title>Photo Gallery | {PROFILE.name} — Engineering Projects &amp; Hackathon Wins</title>
        <meta name="description" content="Explore Srinivasa Manikanta's engineering gallery: 2nd place A-Hacks Hackathon hardware build, Coromandel industrial internship, and 3D printing workshops." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://rsmk.me/gallery" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rsmk.me/gallery" />
        <meta property="og:title" content={`Photo Gallery | ${PROFILE.name}`} />
        <meta property="og:description" content="Hackathon wins, project builds, certifications, and engineering experiences." />
        <meta property="og:image" content="https://rsmk.me/assets/gallery/ahacks/prize-ceremony.jpg" />
        <meta property="og:locale" content="en_IN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Photo Gallery | ${PROFILE.name}`} />
        <meta name="twitter:image" content="https://rsmk.me/assets/gallery/ahacks/prize-ceremony.jpg" />

        <script type="application/ld+json">{JSON.stringify(GALLERY_JSON_LD)}</script>
      </Helmet>

      {/* Full-screen layout: header + masonry flows vertically */}
      <div className="relative z-10 flex flex-col" style={{ height: '100dvh', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div className="flex-shrink-0 pt-16 pb-3 px-4 sm:px-6 md:pt-20 md:pb-6 md:px-8 max-w-7xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-3 text-sm text-cyan-500 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-1 md:mb-2 uppercase tracking-tight flex items-center gap-3">
            <ImageIcon size={32} className="text-cyan-500 sm:w-10 sm:h-10 animate-pulse" />
            Gallery
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Click any tile to expand the image in a slideshow overlay.
          </p>
        </div>

        {/* ── Masonry Grid ── */}
        <div className="flex-1 relative min-h-0 overflow-y-auto px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full pb-16" data-lenis-prevent>
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
                alt={selectedIdx !== null ? GALLERY_IMAGES[selectedIdx].alt : ''}
                className="max-w-full max-h-[72vh] object-contain rounded-xl border border-zinc-800 shadow-2xl"
              />
              
              {/* Caption */}
              {selectedIdx !== null && (
                <p className="mt-4 text-xs md:text-sm text-zinc-400 font-mono text-center max-w-2xl px-4">
                  {GALLERY_IMAGES[selectedIdx].alt}
                </p>
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
