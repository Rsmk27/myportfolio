import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import DomeGallery from '../components/ui/DomeGallery';
import { PROFILE } from '../constants';

const GALLERY_IMAGES = [
  '/assets/gallery/img-20251003-102729.jpg',
  '/assets/gallery/img-20251003-102931.jpg',
  '/assets/gallery/img-20260128-104328.jpg',
  '/assets/gallery/img-20250311-WA0009.jpg',
  '/assets/gallery/img-20251010-WA0001.jpg',
  '/assets/gallery/img-20260107-WA0035.jpg',
  '/assets/gallery/img-20260107-WA0033.jpg',
  '/assets/gallery/img-20260107-WA0050.jpg',
  '/assets/gallery/img-20260128-WA0010.jpg',
  '/assets/gallery/img-20260130-WA0007.jpg',
  '/assets/gallery/img-20260131-WA0011.jpg',
  '/assets/auto-exhaust-fan/image-1.jpg',
  '/assets/auto-exhaust-fan/image-2.jpg',
  '/assets/auto-exhaust-fan/image-3.jpg',
  '/assets/gridforge/web-dashboard-interface.png',
  '/assets/gridforge/matlab-simulation-model.png',
  '/assets/gridforge/simulation-results.png',
  '/assets/gridforge/backend-api-code.png',
  '/assets/experience/coromandel/single-line-diagram.jpg',
  '/assets/experience/coromandel/site-photo.jpg',
  '/assets/experience/coromandel/internship-certificate.jpg',
  '/assets/experience/coromandel/training-site.jpg',
  '/assets/certifications/drone-technology/certificate.png',
  '/assets/certifications/drone-technology/training-1.jpg',
  '/assets/certifications/drone-technology/training-2.jpg',
  '/assets/certifications/3d-printing/certificate.jpg',
  '/assets/certifications/3d-printing/workshop-1.jpg',
  '/assets/certifications/3d-printing/workshop-2.jpg',
  '/assets/certifications/3d-printing/workshop-3.jpg',
  '/assets/certifications/3d-printing/workshop-4.jpg',
  '/assets/certifications/3d-printing/workshop-5.jpg',
  '/assets/certifications/embedded-systems/certificate.jpg',
  '/assets/certifications/electric-vehicle/certificate.jpg',
].map((src, index) => ({ src, alt: `Gallery image ${index + 1}` }));

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300 bg-black overflow-hidden">
      <Helmet>
        <title>Gallery | {PROFILE.name}</title>
        <meta name="description" content="An interactive dome gallery of project snapshots, workshop moments, and build visuals." />
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
