
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
}

const CERTS: Certification[] = [
    {
        title: "Embedded Systems Design",
        subtitle: "SPECIALIZED TRAINING",
        description: "Comprehensive expertise in microcontroller architecture, interfacing peripherals, and real-time systems programming.",
        icon: Cpu
    },
    {
        title: "Electric Vehicle Technology",
        subtitle: "TECHNICAL CERTIFICATION",
        description: "Advanced training in EV powertrains, battery management systems (BMS), and charging infrastructure architectures.",
        icon: Zap
    },
    {
        title: "Drone Technology",
        subtitle: "WORKSHOP CERTIFICATION",
        description: "Hands-on experience with UAV dynamics, flight controllers, aerial sensor integration, and calibration.",
        icon: Fan
    },
    {
        title: "3D Printing",
        subtitle: "ADDITIVE MANUFACTURING",
        description: "Expertise in layered manufacturing, CAD-to-print workflows, and rapid prototyping materials.",
        icon: Box
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
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-xl border transition-all duration-300 group ${isPowered
                            ? 'bg-[#0f0f0f] border-gray-800 hover:border-cyan-500/30'
                            : 'bg-transparent border-gray-900'
                            }`}
                    >
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
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
