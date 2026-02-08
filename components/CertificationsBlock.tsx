import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Fan, Box, Sparkles, LucideIcon, Wifi, Award, ExternalLink, X, ChevronRight } from 'lucide-react';

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
}

const CERTS: Certification[] = [
    {
        id: "CERT-001",
        title: "Embedded Systems Design",
        issuer: "Arm Education",
        year: "2023",
        icon: Cpu,
        image: '/assets/certifications/embedded-systems/certificate.jpg',
        gallery: ['/assets/certifications/embedded-systems/certificate.jpg']
    },
    {
        id: "CERT-002",
        title: "Electric Vehicle Technology",
        issuer: "NPTEL / IIT Madras",
        year: "2023",
        icon: Zap,
        image: '/assets/certifications/electric-vehicle/certificate.jpg',
        gallery: ['/assets/certifications/electric-vehicle/certificate.jpg']
    },
    {
        id: "CERT-003",
        title: "Drone Technology",
        issuer: "SkyFi Labs",
        year: "2022",
        icon: Fan,
        image: '/assets/certifications/drone-technology/certificate.png',
        gallery: [
            '/assets/certifications/drone-technology/certificate.png',
            '/assets/certifications/drone-technology/training-1.jpg',
            '/assets/certifications/drone-technology/training-2.jpg'
        ]
    },
    {
        id: "CERT-004",
        title: "3D Printing & Additive Mfg",
        issuer: "Coursera",
        year: "2022",
        icon: Box,
        image: '/assets/certifications/3d-printing/certificate.jpg',
        gallery: ['/assets/certifications/3d-printing/certificate.jpg']
    },
    {
        id: "CERT-005",
        title: "Prompt Engineering & AI",
        issuer: "DeepLearning.AI",
        year: "2024",
        icon: Sparkles
    },
    {
        id: "CERT-006",
        title: "IoT Architecture",
        issuer: "Cisco Networking",
        year: "2023",
        icon: Wifi
    }
];

export const CertificationsBlock: React.FC<CertificationsBlockProps> = ({ isPowered }) => {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="mb-16 text-center">
                <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 ${isPowered ? 'text-white' : 'text-gray-800'}`}>
                    Credentials
                </h3>
                <div className={`h-1 w-24 mx-auto rounded-full ${isPowered ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-300'}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {CERTS.map((cert, idx) => (
                    <CertificateCard
                        key={cert.id}
                        cert={cert}
                        idx={idx}
                        isPowered={isPowered}
                        onClick={() => setSelectedCert(cert)}
                    />
                ))}
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
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={onClick}
            className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
                ${isPowered
                    ? 'bg-[#0f0f0f] border-gray-800 hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(0,242,255,0.1)]'
                    : 'bg-white border-gray-200 hover:shadow-xl'
                }`}
        >
            {/* Decorative Top Border */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${isPowered ? 'bg-gray-800 group-hover:bg-cyan-500' : 'bg-gray-200 group-hover:bg-gray-800'}`} />

            <div className="flex justify-between items-start mb-6 pt-2">
                <div className={`p-3 rounded-lg border ${isPowered ? 'bg-black border-gray-800 text-cyan-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    <cert.icon size={24} strokeWidth={1.5} />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase
                    ${isPowered ? 'bg-cyan-950/30 text-cyan-300' : 'bg-gray-100 text-gray-600'}`}>
                    <Award size={12} />
                    <span>Verified</span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className={`text-lg font-bold leading-tight mb-2 line-clamp-2 ${isPowered ? 'text-white' : 'text-gray-900'}`}>
                    {cert.title}
                </h4>
                <div className="flex items-center justify-between">
                    <p className={`text-xs font-mono uppercase tracking-wide ${isPowered ? 'text-gray-500' : 'text-gray-500'}`}>
                        {cert.issuer}
                    </p>
                    <p className={`text-xs font-bold ${isPowered ? 'text-gray-600' : 'text-gray-400'}`}>
                        '{cert.year.slice(-2)}
                    </p>
                </div>

            </div>

            {/* View Credential Button - Appears on Hover */}
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300
                ${isPowered
                    ? 'text-cyan-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1'
                    : 'text-blue-600 opacity-60 group-hover:opacity-100'
                }`}
            >
                <span>View Credential</span>
                <ChevronRight size={14} />
            </div>

            {/* Watermark Icon */}
            <cert.icon className={`absolute -bottom-6 -right-6 w-32 h-32 opacity-5 pointer-events-none transition-transform duration-500 group-hover:rotate-12 ${isPowered ? 'text-white' : 'text-black'}`} />
        </motion.div>
    );
};

const GalleryModal: React.FC<{ cert: Certification; onClose: () => void; isPowered: boolean }> = ({ cert, onClose, isPowered }) => {
    // Determine image or video
    const mainSrc = cert.gallery ? cert.gallery[0] : cert.image;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-4xl rounded-2xl overflow-hidden border shadow-2xl flex flex-col max-h-[90vh]
                    ${isPowered ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-200'}`}
            >
                <div className={`p-4 border-b flex justify-between items-center ${isPowered ? 'border-gray-800 bg-[#111]' : 'border-gray-100 bg-gray-50'}`}>
                    <div>
                        <h3 className={`text-lg font-bold ${isPowered ? 'text-white' : 'text-gray-900'}`}>{cert.title}</h3>
                        <p className={`text-xs font-mono uppercase ${isPowered ? 'text-cyan-500' : 'text-blue-600'}`}>{cert.issuer} // {cert.year}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isPowered ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-black flex items-center justify-center">
                    {mainSrc ? (
                        <img src={mainSrc} alt={cert.title} className="max-w-full max-h-[60vh] object-contain rounded shadow-lg" />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <Box size={48} className="mb-2 opacity-50" />
                            <p>Certificate Preview Not Available</p>
                        </div>
                    )}
                </div>

                {cert.gallery && cert.gallery.length > 1 && (
                    <div className={`p-4 border-t flex gap-2 overflow-x-auto ${isPowered ? 'border-gray-800 bg-[#050505]' : 'border-gray-100 bg-gray-50'}`}>
                        {cert.gallery.map((src, i) => (
                            <div key={i} className="w-20 h-16 rounded overflow-hidden border border-gray-700 opacity-60 hover:opacity-100 cursor-pointer">
                                <img src={src} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
