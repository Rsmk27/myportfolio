import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, X, Image as ImageIcon } from 'lucide-react';
import { PCBBackground } from '../components/PCBBackground';
import { PROFILE } from '../constants';

const GALLERY_ITEMS = [
    // Profile
    '/assets/srinivasa-manikanta-profile.webp',

    // New Gallery Additions
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
    '/assets/gallery/vid-20260106-WA0007.mp4',
    '/assets/gallery/vid-20260107-WA0004.mp4',
    '/assets/gallery/vid-20260107-WA0006.mp4',
    '/assets/gallery/vid-20260107-WA0064.mp4',

    // Projects - Auto Exhaust Fan
    '/assets/auto-exhaust-fan/demo-video.mp4',
    '/assets/smart-exhaust-gas-detection-system.webp',
    '/assets/auto-exhaust-fan/image-1.jpg',
    '/assets/auto-exhaust-fan/image-2.jpg',
    '/assets/auto-exhaust-fan/image-3.jpg',

    // Projects - GridForge
    '/assets/gridforge-power-system-simulation.webp',
    '/assets/gridforge/web-dashboard-interface.png',
    '/assets/gridforge/matlab-simulation-model.png',
    '/assets/gridforge/simulation-results.png',
    '/assets/gridforge/backend-api-code.png',

    // Projects - Other
    '/assets/color-ohm-resistor-calculator-tool.webp',
    '/assets/ai-chatbot-interface-background.webp',
    '/assets/budget-buddy-expense-tracker-app.webp',

    // Experience - Coromandel
    '/assets/experience/coromandel/single-line-diagram.jpg',
    '/assets/experience/coromandel/site-photo.jpg',
    '/assets/experience/coromandel/internship-certificate.jpg',
    '/assets/experience/coromandel/training-site.jpg',

    // Certifications - Drone Tech
    '/assets/certifications/drone-technology/certificate.png',
    '/assets/certifications/drone-technology/training-1.jpg',
    '/assets/certifications/drone-technology/training-2.jpg',
    '/assets/certifications/drone-technology/flight-1.mp4',
    '/assets/certifications/drone-technology/flight-2.mp4',
    '/assets/certifications/drone-technology/flight-3.mp4',

    // Certifications - 3D Printing
    '/assets/certifications/3d-printing/certificate.jpg',
    '/assets/certifications/3d-printing/workshop-1.jpg',
    '/assets/certifications/3d-printing/workshop-2.jpg',
    '/assets/certifications/3d-printing/workshop-3.jpg',
    '/assets/certifications/3d-printing/workshop-4.jpg',
    '/assets/certifications/3d-printing/workshop-5.jpg',

    // Certifications - Embedded & EV
    '/assets/certifications/embedded-systems/certificate.jpg',
    '/assets/certifications/electric-vehicle/certificate.jpg'
];

import { MediaLoader } from '../components/ui/MediaLoader';

// ... (previous imports and GALLERY_ITEMS remain the same)

// Extracted Component for Grid Items to handle individual loading states
const GalleryItem: React.FC<{ item: string; idx: number; onClick: () => void; getSpanClass: (i: number) => string }> = ({ item, idx, onClick, getSpanClass }) => {
    const [isLoading, setIsLoading] = useState(true);
    const isVideoItem = item.match(/\.(mp4|webm|ogg)$/i);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 10) * 0.05 }}
            onClick={onClick}
            className={`relative bg-black border border-gray-800 rounded-xl overflow-hidden cursor-pointer group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all ${getSpanClass(idx)}`}
        >
            {isLoading && <MediaLoader />}

            {isVideoItem ? (
                <div className="w-full h-full relative">
                    <video
                        src={item}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-70 group-hover:opacity-100'}`}
                        muted
                        playsInline
                        onLoadedData={() => setIsLoading(false)}
                        onMouseOver={e => e.currentTarget.play()}
                        onMouseOut={e => e.currentTarget.pause()}
                    />
                    {!isLoading && (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20">
                                    <Play size={24} className="text-white fill-white" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-cyan-500 font-bold border border-gray-800">
                                VID
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="w-full h-full relative">
                    <img
                        src={item}
                        alt={`Gallery Item ${idx}`}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-70 group-hover:opacity-100'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoading(false)}
                    />
                    {!isLoading && (
                        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-gray-500 font-bold border border-gray-800 group-hover:text-cyan-500 transition-colors">
                            IMG
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

const Gallery: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [modalLoading, setModalLoading] = useState(true);
    const isPowered = true;

    const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg)$/i);

    // Reset loading state when selected item changes
    React.useEffect(() => {
        if (selectedItem) setModalLoading(true);
    }, [selectedItem]);

    const getSpanClass = (idx: number) => {
        const mod = idx % 18;
        if (mod === 0) return "col-span-1 md:col-span-2 md:row-span-2";
        if (mod === 4 || mod === 9 || mod === 15) return "col-span-1 md:col-span-2";
        if (mod === 7 || mod === 12) return "col-span-1 md:row-span-2";
        return "col-span-1";
    };

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300">
            <Helmet>
                <title>Gallery | {PROFILE.name}</title>
                <meta name="description" content="A visual collection of my work and experiences." />
            </Helmet>

            <PCBBackground isPowered={isPowered} />

            <div className="relative z-10 pt-24 pb-20 container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm text-cyan-500 hover:text-cyan-400 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
                        <ImageIcon size={48} className="text-cyan-500" />
                        GALLERY
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        A collection of snapshots, videos, and visual data from my projects and workshops.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4 grid-flow-dense">
                    {GALLERY_ITEMS.map((item, idx) => (
                        <GalleryItem
                            key={idx}
                            item={item}
                            idx={idx}
                            onClick={() => setSelectedItem(item)}
                            getSpanClass={getSpanClass}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-black/50 rounded-full border border-gray-800 transition-colors z-50"
                        >
                            <X size={24} />
                        </motion.button>

                        <div className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center p-2 min-h-[300px]" onClick={e => e.stopPropagation()}>
                            {modalLoading && <MediaLoader />}

                            {isVideo(selectedItem) ? (
                                <motion.video
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    src={selectedItem}
                                    controls
                                    autoPlay
                                    onLoadedData={() => setModalLoading(false)}
                                    className={`max-w-full max-h-[85vh] object-contain rounded-lg border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black transition-opacity duration-300 ${modalLoading ? 'opacity-0' : 'opacity-100'}`}
                                />
                            ) : (
                                <motion.img
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    src={selectedItem}
                                    alt="Full View"
                                    onLoad={() => setModalLoading(false)}
                                    className={`max-w-full max-h-[85vh] object-contain rounded-lg border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${modalLoading ? 'opacity-0' : 'opacity-100'}`}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
