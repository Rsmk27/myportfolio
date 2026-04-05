import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import DomeGallery from '../components/ui/DomeGallery';
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
  { src: '/assets/gallery/img-20251003-102729.jpg', alt: 'Srinivasa Manikanta — college engineering lab session' },
  { src: '/assets/gallery/img-20251003-102931.jpg', alt: 'Srinivasa Manikanta — engineering workshop activity' },
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
  { src: '/assets/certifications/drone-technology/certificate.png', alt: 'Drone technology workshop completion certificate' },
  { src: '/assets/certifications/drone-technology/training-1.jpg', alt: 'Drone technology hands-on training session' },
  { src: '/assets/certifications/drone-technology/training-2.jpg', alt: 'Drone assembly and flight training workshop' },
  { src: '/assets/certifications/3d-printing/certificate.jpg', alt: '3D printing workshop completion certificate' },
  { src: '/assets/certifications/3d-printing/workshop-1.jpg', alt: '3D printing workshop — learning additive manufacturing' },
  { src: '/assets/certifications/3d-printing/workshop-2.jpg', alt: '3D printing workshop — printer operation training' },
  { src: '/assets/certifications/3d-printing/workshop-3.jpg', alt: '3D printing workshop — designing 3D models' },
  { src: '/assets/certifications/3d-printing/workshop-4.jpg', alt: '3D printing workshop — printed prototype output' },
  { src: '/assets/certifications/3d-printing/workshop-5.jpg', alt: '3D printing workshop — group activity session' },
  { src: '/assets/certifications/embedded-systems/certificate.jpg', alt: 'Embedded systems course completion certificate' },
  { src: '/assets/certifications/electric-vehicle/certificate.jpg', alt: 'Electric vehicle technology program certificate' },
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
  return (
    <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300 bg-black overflow-hidden">
      <Helmet>
        <title>Photo Gallery | {PROFILE.name} — Engineering Projects &amp; Hackathon Wins</title>
        <meta name="description" content="Photo gallery of Srinivasa Manikanta Rajapantula — A-Hacks hackathon 2nd prize, firefighter safety device builds, drone and 3D printing workshops, Coromandel internship, and engineering projects." />
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

      {/* Full-screen layout: header + dome fills remaining height */}
      <div className="relative z-10 flex flex-col" style={{ height: '100dvh', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div className="flex-shrink-0 pt-16 pb-3 px-4 sm:px-6 md:pt-20 md:pb-4 md:px-8 max-w-7xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-3 text-sm text-cyan-500 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-1 md:mb-2 uppercase tracking-tight flex items-center gap-3">
            <ImageIcon size={32} className="text-cyan-500 sm:w-10 sm:h-10" />
            Gallery Dome
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Drag to rotate the dome.{' '}
            <span className="hidden sm:inline">Tap</span>
            <span className="sm:hidden">Touch</span>
            {' '}any tile to expand it.
          </p>
        </div>

        {/* ── Dome (fills remaining viewport height) ── */}
        <div className="flex-1 relative min-h-0">
          <DomeGallery
            images={GALLERY_IMAGES}
            quality="auto"
            fit={0.48}
            fitBasis="auto"
            minRadius={280}
            maxRadius={760}
            padFactor={0.12}
            overlayBlurColor="#05070d"
            maxVerticalRotationDeg={6}
            dragSensitivity={20}
            enlargeTransitionMs={220}
            segments={22}
            dragDampening={0.8}
            openedImageWidth="min(420px, 90vw)"
            openedImageHeight="min(420px, 80vh)"
            imageBorderRadius="18px"
            openedImageBorderRadius="18px"
            grayscale={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
