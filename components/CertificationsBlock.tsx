
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Fan, Box, Sparkles, LucideIcon, Wifi } from 'lucide-react';

interface CertificationsBlockProps {
    isPowered: boolean;
}

interface Certification {
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    image?: string;
    gallery?: string[];
}

const CERTS: Certification[] = [
    {
        title: "Embedded Systems Design",
        subtitle: "SPECIALIZED TRAINING",
        description: "Comprehensive expertise in microcontroller architecture, interfacing peripherals, and real-time systems programming.",
        icon: Cpu,
        image: '/assets/certifications/embedded-systems/certificate.jpg',
        gallery: [
            '/assets/certifications/embedded-systems/certificate.jpg'
        ]
    },
    {
        title: "Electric Vehicle Technology",
        subtitle: "TECHNICAL CERTIFICATION",
        description: "Advanced training in EV powertrains, battery management systems (BMS), and charging infrastructure architectures.",
        icon: Zap,
        image: '/assets/certifications/electric-vehicle/certificate.jpg',
        gallery: [
            '/assets/certifications/electric-vehicle/certificate.jpg'
        ]
    },
    {
        title: "Drone Technology",
        subtitle: "WORKSHOP CERTIFICATION",
        description: "Hands-on experience with UAV dynamics, flight controllers, aerial sensor integration, and calibration.",
        icon: Fan,
        image: '/assets/certifications/drone-technology/certificate.png',
        gallery: [
            '/assets/certifications/drone-technology/certificate.png',
            '/assets/certifications/drone-technology/training-1.jpg',
            '/assets/certifications/drone-technology/training-2.jpg',
            '/assets/certifications/drone-technology/flight-1.mp4',
            '/assets/certifications/drone-technology/flight-2.mp4',
            '/assets/certifications/drone-technology/flight-3.mp4'
        ]
    },
    {
        title: "3D Printing",
        subtitle: "ADDITIVE MANUFACTURING",
        description: "Expertise in layered manufacturing, CAD-to-print workflows, and rapid prototyping materials.",
        icon: Box,
        image: '/assets/certifications/3d-printing/certificate.jpg',
        gallery: [
            '/assets/certifications/3d-printing/certificate.jpg',
            '/assets/certifications/3d-printing/workshop-1.jpg',
            '/assets/certifications/3d-printing/workshop-2.jpg',
            '/assets/certifications/3d-printing/workshop-3.jpg',
            '/assets/certifications/3d-printing/workshop-4.jpg',
            '/assets/certifications/3d-printing/workshop-5.jpg'
        ]
    },
    {
        title: "Prompt to Prototype",
        subtitle: "AI-ASSISTED ENGINEERING",
        description: "Leveraging Generative AI and LLMs to accelerate the engineering design lifecycle from concept to code.",
        icon: Sparkles
    },
    {
        title: "IoT & Smart Systems",
        subtitle: "NETWORK INTERCONNECTIVITY",
        description: "Designing interconnected smart devices using ESP modules, MQTT protocols, and cloud-based data telemetry.",
        icon: Wifi
    }
];

export const CertificationsBlock: React.FC<CertificationsBlockProps> = ({ isPowered }) => {
    const [selectedCert, setSelectedCert] = React.useState<Certification | null>(null);
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    const openGallery = (cert: Certification) => {
        if (cert.gallery && cert.gallery.length > 0) {
            setSelectedCert(cert);
            setSelectedImage(cert.gallery[0]);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-12">
                <h3 className={`text-3xl md:text-6xl font-black uppercase tracking-tighter ${isPowered ? 'text-white' : 'text-gray-800'}`}>
                    Certifications
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CERTS.map((cert, idx) => (
                    <motion.div
                        key={cert.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: [0.95, 1],
                            boxShadow: isPowered ? ["0 0 0px rgba(0,0,0,0)", "0 0 20px rgba(6,182,212,0.2)", "0 0 0px rgba(0,0,0,0)"] : "none"
                        }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        onClick={() => openGallery(cert)}
                        className={`p-6 rounded-xl border transition-all duration-300 group relative overflow-hidden ${isPowered
                            ? 'bg-[#0f0f0f] border-gray-800 hover:border-cyan-500/30'
                            : 'bg-transparent border-gray-900'
                            } ${cert.gallery ? 'cursor-pointer hover:bg-gray-900/50' : ''}`}
                    >
                        {cert.gallery && (
                            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity z-10">
                                <Box size={16} className={isPowered ? "text-cyan-500" : "text-gray-500"} />
                            </div>
                        )}

                        {cert.image && (
                            <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden relative group-hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-all duration-500">
                                <div className={`absolute inset-0 z-10 transition-colors duration-300 ${isPowered ? 'bg-cyan-950/20 group-hover:bg-transparent' : 'bg-black/10'}`} />
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                />
                                {isPowered && <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10" />}
                            </div>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${isPowered ? 'bg-cyan-950/30 text-cyan-400' : 'bg-gray-800 text-gray-500'}`}>
                                <cert.icon size={24} />
                            </div>
                            <div>
                                <h4 className={`text-lg font-bold leading-tight mb-1 ${isPowered ? 'text-white' : 'text-gray-700'}`}>
                                    {cert.title}
                                </h4>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isPowered ? 'text-blue-400' : 'text-gray-500'}`}>
                                    {cert.subtitle}
                                </span>
                            </div>
                        </div>

                        <p className={`text-sm leading-relaxed ${isPowered ? 'text-gray-400' : 'text-gray-600'}`}>
                            {cert.description}
                        </p>

                        {cert.gallery && (
                            <div className={`mt-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 ${isPowered ? 'text-cyan-600' : 'text-gray-500'}`}>
                                <span>[ View Gallery ]</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Gallery Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setSelectedCert(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
                            <div>
                                <h3 className="text-white font-bold">{selectedCert.title}</h3>
                                <p className="text-xs text-cyan-500 font-mono">GALLERY_VIEW</p>
                            </div>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                            >
                                <Box size={20} className="rotate-45" />
                                {/* Using Box as a generic close icon rotated, or could import X */}
                            </button>
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-black overflow-hidden flex items-center justify-center relative p-4 min-h-[400px]">
                            {selectedImage && (
                                selectedImage.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video
                                        src={selectedImage}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-[60vh] object-contain rounded border border-gray-900"
                                    />
                                ) : (
                                    <img
                                        src={selectedImage}
                                        alt="Certification Gallery"
                                        className="max-w-full max-h-[60vh] object-contain rounded border border-gray-900"
                                    />
                                )
                            )}
                        </div>

                        {/* Thumbnails */}
                        {selectedCert.gallery && selectedCert.gallery.length > 1 && (
                            <div className="p-4 bg-black/50 border-t border-gray-800 overflow-x-auto">
                                <div className="flex gap-2 justify-center">
                                    {selectedCert.gallery.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-20 h-14 rounded overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-cyan-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                        >
                                            {img.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video src={img} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
