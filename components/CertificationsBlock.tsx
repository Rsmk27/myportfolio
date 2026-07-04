import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Fan, Box, Sparkles, LucideIcon, Wifi, Award, X, ChevronRight, ChevronLeft, ShieldCheck, Code, ExternalLink, FileText } from 'lucide-react';
import GlareHover from './ui/GlareHover';
import { CERTS, Certification } from '../pages/Certificates';

interface CertificationsBlockProps {
    isPowered: boolean;
}

export const CertificationsBlock: React.FC<CertificationsBlockProps> = ({ isPowered }) => {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);

    // Auto-scroll loop using requestAnimationFrame
    useEffect(() => {
        const container = scrollRef.current;
        if (!container || !isPowered) return;

        let animationFrameId: number;
        let lastTime = performance.now();
        const speed = 35; // pixels per second

        const step = (time: number) => {
            if (!isHovered && !isDragging) {
                const delta = (time - lastTime) / 1000;
                container.scrollLeft += speed * delta;

                // Infinite loop: if we scrolled past the first set of items, snap back
                const halfWidth = container.scrollWidth / 2;
                if (container.scrollLeft >= halfWidth) {
                    container.scrollLeft -= halfWidth;
                }
            }
            lastTime = time;
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, isDragging, isPowered]);

    // Manual navigation buttons scroll
    const scroll = (direction: 'left' | 'right') => {
        const container = scrollRef.current;
        if (container) {
            const { scrollLeft, clientWidth, scrollWidth } = container;
            const scrollAmount = clientWidth * 0.75;
            let target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

            // Handle boundary loops
            const halfWidth = scrollWidth / 2;
            if (target < 0) {
                container.scrollLeft = halfWidth + target;
                target = halfWidth + target - scrollAmount;
            } else if (target >= halfWidth) {
                container.scrollLeft = target - halfWidth;
                target = target - halfWidth + scrollAmount;
            }

            container.scrollTo({
                left: target,
                behavior: 'smooth'
            });
        }
    };

    // Drag-to-scroll handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        const container = scrollRef.current;
        if (!container) return;
        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeftState(container.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const container = scrollRef.current;
        if (!isDragging || !container) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll speed multiplier
        container.scrollLeft = scrollLeftState - walk;

        // Loop handling during active dragging
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
            setStartX(x);
            setScrollLeftState(container.scrollLeft);
        } else if (container.scrollLeft < 0) {
            container.scrollLeft += halfWidth;
            setStartX(x);
            setScrollLeftState(container.scrollLeft);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 overflow-hidden">
            
            {/* Header section matching mockup */}
            <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                    <h2 
                        className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        CREDENTIALS
                    </h2>
                </div>
                {/* Arrow buttons for manual scroll */}
                <div className="flex items-center gap-2 pb-1">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-2 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/15 text-zinc-400 hover:text-cyan-400 rounded-lg transition-all cursor-pointer"
                        title="Scroll Left"
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-2 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/15 text-zinc-400 hover:text-cyan-400 rounded-lg transition-all cursor-pointer"
                        title="Scroll Right"
                    >
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Carousel Container - Infinite Scrolling Marquee (Full Viewport Breakout) */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 mt-4 select-none">
                
                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing px-12 md:px-24"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        handleMouseLeaveOrUp();
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                >
                    {CERTS.map((cert, idx) => (
                        <div key={`${cert.id}-1`} className="w-[285px] md:w-[320px] flex-shrink-0">
                            <CertificateCard
                                cert={cert}
                                idx={idx}
                                isPowered={isPowered}
                                onClick={() => setSelectedCert(cert)}
                            />
                        </div>
                    ))}
                    {/* Duplicate for seamless infinite loop */}
                    {CERTS.map((cert, idx) => (
                        <div key={`${cert.id}-2`} className="w-[285px] md:w-[320px] flex-shrink-0">
                            <CertificateCard
                                cert={cert}
                                idx={idx}
                                isPowered={isPowered}
                                onClick={() => setSelectedCert(cert)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedCert && (
                    <GalleryModal cert={selectedCert} onClose={() => setSelectedCert(null)} isPowered={isPowered} />
                )}
            </AnimatePresence>
        </div>
    );
};

const CertificateCard: React.FC<{ cert: Certification; idx: number; isPowered: boolean; onClick: () => void }> = ({ cert, idx, isPowered, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset loaded state when active cert changes
    useEffect(() => {
        setIsLoaded(false);
    }, [cert.id]);

    const previewImage = cert.image?.endsWith('.pdf')
        ? cert.image.slice(0, -4) + '.png'
        : cert.image;

    return (
        <div
            className="group h-full transition-transform duration-300 hover:-translate-y-1.5"
            onClick={onClick}
        >
            <GlareHover
                width="100%"
                height="100%"
                background={isPowered ? '#070708' : '#121212'}
                borderRadius="0.75rem"
                borderColor={isPowered ? (cert.isVerifiedBadge ? 'rgba(6,182,212,0.3)' : '#18181b') : '#1e1e1e'}
                glareColor={isPowered ? '#00f2ff' : '#222222'}
                glareOpacity={isPowered ? 0.12 : 0.05}
                glareSize={240}
                className={`relative p-6 transition-all duration-300 overflow-hidden h-full flex flex-col justify-between cursor-pointer border min-h-[380px]
                    ${isPowered && cert.isVerifiedBadge ? 'shadow-[0_0_15px_rgba(6,182,212,0.03)] border-cyan-500/25' : ''}
                    ${!isPowered ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
                {/* Translucent Watermark Year */}
                <div 
                    className="absolute right-4 bottom-2 text-8xl font-black font-mono select-none tracking-tighter pointer-events-none opacity-[0.02] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.05]"
                    style={{ color: isPowered ? '#ffffff' : '#444444' }}
                >
                    {cert.year}
                </div>

                <div className="w-full relative z-10 flex flex-col h-full justify-between gap-4">
                    <div className="flex flex-col gap-4">
                        {/* Preview Container with fixed aspect ratio */}
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-zinc-900 bg-black flex items-center justify-center relative group-hover:border-cyan-500/30 transition-colors">
                            {/* Loading Shimmer / Spinner */}
                            {!isLoaded && previewImage && (
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/50 to-zinc-950 animate-pulse flex items-center justify-center z-10">
                                    <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                </div>
                            )}

                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt={cert.title}
                                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105
                                        ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    loading="lazy"
                                    onLoad={() => setIsLoaded(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-700">
                                    <Award size={24} className="opacity-30" />
                                    <span className="text-[9px] mt-1 font-mono">NO IMAGE PREVIEW</span>
                                </div>
                            )}
                        </div>

                        {/* Header Row: Glowing Icon and verified badge */}
                        <div className="flex justify-between items-center">
                            <div 
                                className={`p-2 rounded-lg border transition-all duration-300
                                    ${isPowered 
                                        ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.08)]' 
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                                    }`}
                            >
                                <cert.icon size={16} strokeWidth={1.5} />
                            </div>

                            {isPowered && cert.isVerifiedBadge ? (
                                <div className="flex items-center gap-1 text-[9px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded shadow-[0_0_6px_rgba(6,182,212,0.15)]">
                                    <ShieldCheck size={11} strokeWidth={2} />
                                    <span>VERIFIED</span>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border
                                    ${isPowered 
                                        ? 'bg-zinc-950/30 border-zinc-900/80 text-zinc-500' 
                                        : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                                    }`}
                                >
                                    <Award size={10} strokeWidth={2} />
                                    <span>SECURE</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border rounded uppercase mb-2 inline-block
                                ${isPowered
                                    ? 'text-amber-500/80 border-amber-500/20 bg-amber-950/10'
                                    : 'text-zinc-600 border-zinc-900 bg-zinc-950'
                                }`}
                            >
                                {cert.category || 'Engineering'}
                            </span>
                            <h4 className={`text-base font-black tracking-tight leading-snug mb-1 line-clamp-2 ${isPowered ? 'text-white' : 'text-zinc-500'}`}>
                                {cert.title}
                            </h4>
                            <p className={`text-xs font-mono uppercase tracking-wider ${isPowered ? 'text-zinc-500' : 'text-zinc-600'}`}>
                                {cert.issuer}
                            </p>
                        </div>
                    </div>

                    <div>
                        {/* Gained Skills Preview */}
                        <div className="mt-2 flex flex-wrap gap-1 relative z-10">
                            {cert.skills?.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-[9px] px-1.5 py-0.5 bg-black/40 border border-zinc-900 rounded text-zinc-500">
                                    {skill}
                                </span>
                            )) || (
                                <span className="text-[9px] px-1.5 py-0.5 bg-black/40 border border-zinc-900 rounded text-zinc-500">
                                    Engineering
                                </span>
                            )}
                            {cert.skills && cert.skills.length > 3 && (
                                <span className="text-[9px] px-1 py-0.5 text-zinc-600">
                                    +{cert.skills.length - 3} more
                                </span>
                            )}
                        </div>

                        {/* View Credential CTA Link */}
                        <div 
                            className={`flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-300 mt-4 relative z-10
                                ${isPowered
                                    ? 'text-cyan-500/80 group-hover:text-cyan-300 group-hover:translate-x-1'
                                    : 'text-zinc-700'
                                }`}
                        >
                            <span>View Credential</span>
                            <ChevronRight size={12} strokeWidth={3.5} />
                        </div>
                    </div>
                </div>
            </GlareHover>
        </div>
    );
};

const GalleryModal: React.FC<{ cert: Certification; onClose: () => void; isPowered: boolean }> = ({ cert, onClose, isPowered }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset when cert changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [cert]);

    const mainSrc = cert.gallery ? cert.gallery[activeImageIndex] : cert.image;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-4xl rounded-2xl overflow-hidden border shadow-2xl flex flex-col max-h-[90vh]
                    ${isPowered ? 'bg-[#09090b] border-cyan-950/60' : 'bg-white border-gray-200'}`}
            >
                <div className={`p-4 border-b flex justify-between items-center ${isPowered ? 'border-cyan-950/40 bg-black/40' : 'border-gray-100 bg-gray-50'}`}>
                    <div>
                        <h3 className={`text-lg font-black tracking-tight ${isPowered ? 'text-white' : 'text-gray-950'}`}>{cert.title}</h3>
                        <p className={`text-xs font-mono uppercase tracking-widest ${isPowered ? 'text-cyan-400' : 'text-blue-600'}`}>{cert.issuer} // {cert.year}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors cursor-pointer ${isPowered ? 'hover:bg-cyan-950/20 text-gray-500 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-black flex items-center justify-center min-h-[50vh]">
                    {mainSrc ? (
                        mainSrc.endsWith('.mp4') ? (
                            <video src={mainSrc} controls autoPlay muted loop className="max-w-full max-h-[60vh] object-contain rounded border border-cyan-950/40 shadow-[0_0_40px_rgba(0,242,255,0.05)]" />
                        ) : mainSrc.endsWith('.pdf') ? (
                            <iframe 
                                src={`${mainSrc}#toolbar=0&navpanes=0&scrollbar=0`} 
                                title={cert.title}
                                className="w-full h-full min-h-[44vh] lg:min-h-[54vh] rounded border border-cyan-950/30 bg-zinc-950"
                            />
                        ) : (
                            <img src={mainSrc} alt={cert.title} className="max-w-full max-h-[60vh] object-contain rounded border border-cyan-950/40 shadow-[0_0_40px_rgba(0,242,255,0.05)]" />
                        )
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center">
                            <Box size={44} className="mb-2 opacity-30" />
                            <p className="font-mono text-xs">Certificate Preview Not Available</p>
                        </div>
                    )}
                </div>

                {cert.gallery && cert.gallery.length > 1 && (
                    <div className={`p-4 border-t flex gap-3 overflow-x-auto justify-center ${isPowered ? 'border-cyan-950/40 bg-[#050506]' : 'border-gray-100 bg-gray-50'}`}>
                        {cert.gallery.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`w-20 h-14 rounded overflow-hidden border flex-shrink-0 transition-all duration-300 cursor-pointer
                                    ${activeImageIndex === i 
                                        ? 'border-cyan-500 scale-105 opacity-100 shadow-[0_0_8px_rgba(6,182,212,0.25)]' 
                                        : isPowered 
                                            ? 'border-cyan-950/60 opacity-60 hover:opacity-100' 
                                            : 'border-gray-300 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                {src.endsWith('.mp4') ? (
                                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-cyan-500 text-[10px] font-bold font-mono">
                                        VIDEO
                                    </div>
                                ) : src.endsWith('.pdf') ? (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-red-500 text-[10px] font-bold font-mono border border-red-950/20">
                                        PDF
                                    </div>
                                ) : (
                                    <img src={src} className="w-full h-full object-cover" alt="" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
