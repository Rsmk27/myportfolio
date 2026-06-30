import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Fan, Box, Sparkles, LucideIcon, Wifi, Award, X, ChevronRight, ShieldCheck, Code, ExternalLink } from 'lucide-react';
import GlareHover from './ui/GlareHover';

interface CertificationsBlockProps {
    isPowered: boolean;
}

interface Certification {
    title: string;
    issuer: string;
    year: string;
    id: string;
    icon: LucideIcon;
    image?: string;
    gallery?: string[];
    isVerifiedBadge?: boolean; // ARM gets verified shield check
}

const CERTS: Certification[] = [
    {
        id: "CERT-001",
        title: "Embedded Systems Design",
        issuer: "Arm Education",
        year: "2020",
        icon: Cpu,
        image: '/assets/certifications/Embedded systems certificate.png',
        gallery: ['/assets/certifications/Embedded systems certificate.png'],
        isVerifiedBadge: true
    },
    {
        id: "CERT-002",
        title: "Electric Vehicle Technology",
        issuer: "NPTEL / IIT Madras",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/EV technology.jpg',
        gallery: ['/assets/certifications/EV technology.jpg']
    },
    {
        id: "CERT-003",
        title: "Drone Technology",
        issuer: "SkyFi Labs",
        year: "2022",
        icon: Fan,
        image: '/assets/certifications/Drone technology certificate.png',
        gallery: [
            '/assets/certifications/Drone technology certificate.png',
            '/assets/certifications/drone-technology/training-1.jpg',
            '/assets/certifications/drone-technology/training-2.jpg',
            '/assets/certifications/drone-technology/flight-1.mp4',
            '/assets/certifications/drone-technology/flight-2.mp4',
            '/assets/certifications/drone-technology/flight-3.mp4'
        ]
    },
    {
        id: "CERT-004",
        title: "3D Printing & Additive Mfg",
        issuer: "Coursera",
        year: "2022",
        icon: Box,
        image: '/assets/certifications/3D Printing.jpg',
        gallery: [
            '/assets/certifications/3D Printing.jpg',
            '/assets/certifications/3d-printing/workshop-1.jpg',
            '/assets/certifications/3d-printing/workshop-2.jpg',
            '/assets/certifications/3d-printing/workshop-3.jpg',
            '/assets/certifications/3d-printing/workshop-4.jpg',
            '/assets/certifications/3d-printing/workshop-5.jpg'
        ]
    },
    {
        id: "CERT-005",
        title: "C Programming for Embedded Applications",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Code,
        image: '/assets/certifications/CertificateOfCompletion_C Programming for Embedded Applications.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_C Programming for Embedded Applications.pdf']
    },
    {
        id: "CERT-006",
        title: "Learning Arduino: Foundations",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Cpu,
        image: '/assets/certifications/CertificateOfCompletion_Learning Arduino Foundations.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Learning Arduino Foundations.pdf']
    },
    {
        id: "CERT-007",
        title: "IoT Foundations: Fundamentals",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Wifi,
        image: '/assets/certifications/CertificateOfCompletion_IoT Foundations Fundamentals.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_IoT Foundations Fundamentals.pdf']
    },
    {
        id: "CERT-008",
        title: "Become a PLC Developer",
        issuer: "LinkedIn Learning",
        year: "2024",
        icon: Cpu,
        image: '/assets/certifications/CertificateOfCompletion_Become a PLC Developer.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Become a PLC Developer.pdf']
    },
    {
        id: "CERT-009",
        title: "Solar PV Design & Installation",
        issuer: "NPTEL / SCGJ",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/Solar PV design certificate.pdf',
        gallery: ['/assets/certifications/Solar PV design certificate.pdf']
    },
    {
        id: "CERT-010",
        title: "Google AI Essentials",
        issuer: "Google / Coursera",
        year: "2024",
        icon: Sparkles,
        image: '/assets/certifications/Google AI.pdf',
        gallery: ['/assets/certifications/Google AI.pdf'],
        isVerifiedBadge: true
    },
    {
        id: "CERT-011",
        title: "Career Essentials in Generative AI",
        issuer: "Microsoft & LinkedIn",
        year: "2024",
        icon: Sparkles,
        image: '/assets/certifications/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn.pdf']
    },
    {
        id: "CERT-012",
        title: "Career Essentials in GitHub",
        issuer: "GitHub & LinkedIn",
        year: "2024",
        icon: Code,
        image: '/assets/certifications/CertificateOfCompletion_Career Essentials in GitHub Professional Certificate.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Career Essentials in GitHub Professional Certificate.pdf']
    },
    {
        id: "CERT-013",
        title: "Embedded Systems & PCB Designing",
        issuer: "Chefronics Technologies",
        year: "2022",
        icon: Cpu,
        image: '/assets/certifications/Chefronics certificate.jpg',
        gallery: ['/assets/certifications/Chefronics certificate.jpg']
    },
    {
        id: "CERT-014",
        title: "MATLAB Onramp",
        issuer: "MathWorks",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/MATLAB onramp.pdf',
        gallery: ['/assets/certifications/MATLAB onramp.pdf']
    },
    {
        id: "CERT-015",
        title: "Simulink Onramp",
        issuer: "MathWorks",
        year: "2023",
        icon: Cpu,
        image: '/assets/certifications/Simulink onramp.pdf',
        gallery: ['/assets/certifications/Simulink onramp.pdf']
    },
    {
        id: "CERT-016",
        title: "Battery Management Systems",
        issuer: "NPTEL / DIYBMS",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/BMS.pdf',
        gallery: ['/assets/certifications/BMS.pdf']
    },
    {
        id: "CERT-017",
        title: "EV Fundamentals",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/EV fundamentals.pdf',
        gallery: ['/assets/certifications/EV fundamentals.pdf']
    },
    {
        id: "CERT-018",
        title: "Fire Safety & Response",
        issuer: "National Safety Council",
        year: "2023",
        icon: ShieldCheck,
        image: '/assets/certifications/Firesafety Certificate.jpg',
        gallery: ['/assets/certifications/Firesafety Certificate.jpg']
    },
    {
        id: "CERT-019",
        title: "Amplify Communication Skills with GenAI",
        issuer: "Microsoft / LinkedIn",
        year: "2024",
        icon: Sparkles,
        image: '/assets/certifications/CertificateOfCompletion_Amplify Your Communication Skills with Generative AI.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Amplify Your Communication Skills with Generative AI.pdf']
    },
    {
        id: "CERT-020",
        title: "Design Thinking for Innovators",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Sparkles,
        image: '/assets/certifications/Design thinking for innovators.pdf',
        gallery: ['/assets/certifications/Design thinking for innovators.pdf']
    },
    {
        id: "CERT-021",
        title: "IoT & Digital Transformation",
        issuer: "Cisco Networking Academy",
        year: "2023",
        icon: Wifi,
        image: '/assets/certifications/Introduction to IoT and Digital Transformation.pdf',
        gallery: ['/assets/certifications/Introduction to IoT and Digital Transformation.pdf']
    },
    {
        id: "CERT-022",
        title: "Introduction to Internet of Things",
        issuer: "Cisco Networking Academy",
        year: "2023",
        icon: Wifi,
        image: '/assets/certifications/Introduction to Internet of Things.pdf',
        gallery: ['/assets/certifications/Introduction to Internet of Things.pdf']
    },
    {
        id: "CERT-023",
        title: "Statement of Accomplishment",
        issuer: "Coursera / Stanford",
        year: "2023",
        icon: Award,
        image: '/assets/certifications/STATEMENT OF ACCOMPLISHMENT.pdf',
        gallery: ['/assets/certifications/STATEMENT OF ACCOMPLISHMENT.pdf']
    },
    {
        id: "CERT-024",
        title: "ITP Engineering Certification",
        issuer: "Technical Board",
        year: "2024",
        icon: Award,
        image: '/assets/certifications/ITP0017198099584.png',
        gallery: ['/assets/certifications/ITP0017198099584.png']
    },
    {
        id: "CERT-025",
        title: "Getting Started with Data",
        issuer: "LinkedIn Learning",
        year: "2023",
        icon: Box,
        image: '/assets/certifications/Getting Started with Data.pdf',
        gallery: ['/assets/certifications/Getting Started with Data.pdf']
    },
    {
        id: "CERT-026",
        title: "Electrical Engineering Internship",
        issuer: "Coromandel International Limited",
        year: "2023",
        icon: Zap,
        image: '/assets/experience/coromandel/internship-certificate.jpg',
        gallery: [
            '/assets/experience/coromandel/internship-certificate.jpg',
            '/assets/experience/coromandel/single-line-diagram.jpg',
            '/assets/experience/coromandel/site-photo.jpg',
            '/assets/experience/coromandel/training-site.jpg'
        ],
        isVerifiedBadge: true
    }
];

export const CertificationsBlock: React.FC<CertificationsBlockProps> = ({ isPowered }) => {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    // Limit to curated list of 6-7 high impact items for the home page section preview
    const highlightCerts = CERTS.filter(c => 
        ["CERT-001", "CERT-002", "CERT-003", "CERT-004", "CERT-010", "CERT-013", "CERT-026"].includes(c.id)
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            
            {/* Header section matching mockup */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-900 pb-4">
                <div className="flex items-center gap-3">
                    <h2 
                        className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        CREDENTIALS
                    </h2>
                </div>
                <span className="text-xs font-mono tracking-[0.25em] text-cyan-500 uppercase select-none pb-1">
                    VERIFIED MODULES
                </span>
            </div>

            {/* Layout with right-side tech slider */}
            <div className="flex items-stretch gap-6">
                
                {/* Cards Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {highlightCerts.map((cert, idx) => (
                        <CertificateCard
                            key={cert.id}
                            cert={cert}
                            idx={idx}
                            isPowered={isPowered}
                            onClick={() => setSelectedCert(cert)}
                        />
                    ))}
                </div>

                {/* Right-side Vertical Tech Slider Scrollbar (matching mockup) */}
                <div className="hidden lg:flex flex-col items-center justify-between w-7 py-3 px-1.5 border border-cyan-950/80 bg-black/40 rounded-lg flex-shrink-0 select-none shadow-[0_0_15px_rgba(6,182,212,0.02)]">
                    <button className="text-cyan-500/60 hover:text-cyan-400 text-xs font-black font-mono transition-colors">▲</button>
                    
                    {/* Slider body and active indicator */}
                    <div className="flex-1 w-[2px] bg-cyan-950/30 relative my-4 rounded-full">
                        <motion.div 
                            className="absolute left-1/2 -translate-x-1/2 w-2 h-16 bg-cyan-400 shadow-[0_0_10px_#00f2ff] rounded-sm"
                            animate={{ y: [0, 180, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {/* Decorative track ticks */}
                        {[...Array(6)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-900/30"
                                style={{ top: `${20 + i * 15}%` }}
                            />
                        ))}
                    </div>

                    <button className="text-cyan-500/60 hover:text-cyan-400 text-xs font-black font-mono transition-colors">▼</button>
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="group h-full"
        >
            <GlareHover
                width="100%"
                height="100%"
                background={isPowered ? '#070708' : '#ffffff'}
                borderRadius="0.75rem"
                borderColor={isPowered ? (cert.isVerifiedBadge ? 'rgba(6,182,212,0.4)' : '#111827') : '#e5e7eb'}
                glareColor={isPowered ? '#00f2ff' : '#ffffff'}
                glareOpacity={isPowered ? 0.18 : 0.3}
                glareSize={240}
                transitionDuration={600}
                className={`relative p-6 transition-all duration-300 overflow-hidden h-full flex flex-col justify-between cursor-pointer
                    ${isPowered && cert.isVerifiedBadge ? 'shadow-[0_0_15px_rgba(6,182,212,0.06)]' : ''}`}
                onClick={onClick}
            >
                {/* Translucent Watermark Year (mockup bg) */}
                <div 
                    className="absolute right-4 bottom-2 text-8xl font-black font-mono select-none tracking-tighter pointer-events-none opacity-[0.03] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.06]"
                    style={{ color: isPowered ? '#ffffff' : '#000000' }}
                >
                    {cert.year}
                </div>

                <div className="w-full relative z-10">
                    
                    {/* Header Row: Glowing Icon and verified badge */}
                    <div className="flex justify-between items-start mb-6">
                        <div 
                            className={`p-3 rounded-lg border transition-all duration-300
                                ${isPowered 
                                    ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.1)]' 
                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                }`}
                        >
                            <cert.icon size={22} strokeWidth={1.5} />
                        </div>

                        {/* Verified badge (mockup badge style) */}
                        {isPowered && cert.isVerifiedBadge ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                                <ShieldCheck size={12} strokeWidth={2} />
                                <span>VERIFIED</span>
                            </div>
                        ) : (
                            <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border
                                ${isPowered 
                                    ? 'bg-gray-950/30 border-gray-900 text-gray-500' 
                                    : 'bg-gray-100 border-gray-200 text-gray-400'
                                }`}
                            >
                                <Award size={11} strokeWidth={2} />
                                <span>SECURE</span>
                            </div>
                        )}
                    </div>

                    {/* Cert Title & Issuer */}
                    <div className="mb-4">
                        <h4 className={`text-base font-black tracking-tight leading-snug mb-1 line-clamp-2 ${isPowered ? 'text-white' : 'text-gray-950'}`}>
                            {cert.title}
                        </h4>
                        <p className={`text-xs font-mono uppercase tracking-wider ${isPowered ? 'text-gray-500' : 'text-gray-400'}`}>
                            {cert.issuer}
                        </p>
                    </div>

                </div>

                {/* View Credential CTA Link */}
                <div 
                    className={`flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-300 mt-4 relative z-10
                        ${isPowered
                            ? 'text-cyan-500/80 group-hover:text-cyan-300 group-hover:translate-x-1'
                            : 'text-blue-600'
                        }`}
                >
                    <span>View Credential</span>
                    <ChevronRight size={12} strokeWidth={3.5} />
                </div>

            </GlareHover>
        </motion.div>
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
