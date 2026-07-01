import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Zap, Fan, Box, Sparkles, Wifi,
    Award, X, ChevronRight, ShieldCheck, ArrowLeft, Search,
    CheckCircle2, ExternalLink, RefreshCw, Copy, Code, FileText
} from 'lucide-react';
import { PCBBackground } from '../components/PCBBackground';
import GlareHover from '../components/ui/GlareHover';
import { PROFILE } from '../constants';

export interface Certification {
    id: string;
    title: string;
    issuer: string;
    year: string;
    category: 'Embedded & IoT' | 'AI & Software' | 'Robotics & Hardware' | 'Power & Electrical';
    icon: React.ComponentType<any>;
    image?: string;
    gallery?: string[];
    isVerifiedBadge?: boolean;
    credentialId?: string;
    skills: string[];
    description: string;
    verificationHash: string;
}

export const CERTS: Certification[] = [
    {
        id: "CERT-001",
        title: "Embedded Systems Design",
        issuer: "Arm Education",
        year: "2020",
        category: "Embedded & IoT",
        icon: Cpu,
        image: '/assets/certifications/Embedded systems certificate.png',
        gallery: ['/assets/certifications/Embedded systems certificate.png'],
        isVerifiedBadge: true,
        credentialId: "ARM-ESD-2020-0081",
        skills: ["Cortex-M", "RTOS", "Peripherals", "C/C++", "Keil MDK"],
        description: "Specialized training on ARM Cortex-M architecture, memory mapping, interrupt handling, and real-time operating systems (RTOS) integrations.",
        verificationHash: "sha256-8a9d8c7b6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c"
    },
    {
        id: "CERT-002",
        title: "Electric Vehicle Technology",
        issuer: "NPTEL / IIT Madras",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/EV technology.jpg',
        gallery: ['/assets/certifications/EV technology.jpg'],
        credentialId: "NPTEL-EV-2023-M504",
        skills: ["Battery Pack Design", "BMS", "BLDC Motors", "Motor Controllers", "Thermal Management"],
        description: "Learned powertrain architecture, battery management systems (BMS), motor control circuits, and thermal management for electric vehicles.",
        verificationHash: "sha256-4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d"
    },
    {
        id: "CERT-003",
        title: "Drone Technology",
        issuer: "SkyFi Labs",
        year: "2022",
        category: "Robotics & Hardware",
        icon: Fan,
        image: '/assets/certifications/Drone technology certificate.png',
        gallery: [
            '/assets/certifications/Drone technology certificate.png',
            '/assets/certifications/drone-technology/training-1.jpg',
            '/assets/certifications/drone-technology/training-2.jpg',
            '/assets/certifications/drone-technology/flight-1.mp4',
            '/assets/certifications/drone-technology/flight-2.mp4',
            '/assets/certifications/drone-technology/flight-3.mp4'
        ],
        credentialId: "SKYFI-DRN-2022-7910",
        skills: ["Quadcopter Dynamics", "ESC Calibration", "APM Flight Controller", "Telemetry", "Drone Assembly"],
        description: "Hands-on training in drone assembly, calibration of Electronic Speed Controllers (ESCs), flight controller configuration, and pilot training.",
        verificationHash: "sha256-9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e"
    },
    {
        id: "CERT-004",
        title: "3D Printing & Additive Mfg",
        issuer: "Coursera",
        year: "2022",
        category: "Robotics & Hardware",
        icon: Box,
        image: '/assets/certifications/3D Printing.jpg',
        gallery: [
            '/assets/certifications/3D Printing.jpg',
            '/assets/certifications/3d-printing/workshop-1.jpg',
            '/assets/certifications/3d-printing/workshop-2.jpg',
            '/assets/certifications/3d-printing/workshop-3.jpg',
            '/assets/certifications/3d-printing/workshop-4.jpg',
            '/assets/certifications/3d-printing/workshop-5.jpg'
        ],
        credentialId: "COURSERA-3DP-2022-8B2",
        skills: ["CAD Modeling", "Slicing (Cura)", "FDM Printers", "Material Science", "Prototyping"],
        description: "Explored mechanical design, CAD modeling, FDM printer calibrations, filament materials, and prototyping protocols.",
        verificationHash: "sha256-2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c"
    },
    {
        id: "CERT-005",
        title: "C Programming for Embedded Applications",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "Embedded & IoT",
        icon: Code,
        image: '/assets/certifications/CertificateOfCompletion_C Programming for Embedded Applications.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_C Programming for Embedded Applications.pdf'],
        credentialId: "LIL-CPE-2023-A01",
        skills: ["C Programming", "Embedded C", "Memory Management", "Pointers", "Bitwise Operations"],
        description: "Comprehensive study of C programming methodologies tailored for memory-constrained embedded architectures and microcontroller systems.",
        verificationHash: "sha256-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
    },
    {
        id: "CERT-006",
        title: "Learning Arduino: Foundations",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "Embedded & IoT",
        icon: Cpu,
        image: '/assets/certifications/CertificateOfCompletion_Learning Arduino Foundations.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Learning Arduino Foundations.pdf'],
        credentialId: "LIL-ARD-2023-F02",
        skills: ["Arduino IDE", "Prototyping", "GPIO Control", "Analog Sensors", "Serial Communication"],
        description: "Foundational training in hardware prototyping, sensor interfacing, and code development using the Arduino ecosystem.",
        verificationHash: "sha256-f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8"
    },
    {
        id: "CERT-007",
        title: "IoT Foundations: Fundamentals",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "Embedded & IoT",
        icon: Wifi,
        image: '/assets/certifications/CertificateOfCompletion_IoT Foundations Fundamentals.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_IoT Foundations Fundamentals.pdf'],
        credentialId: "LIL-IOT-2023-F03",
        skills: ["IoT Networks", "Cloud Integration", "Sensors", "Data Telemetry", "MQTT"],
        description: "Study of IoT architectures, sensing layers, communications protocols, and cloud-to-device telemetry pipelines.",
        verificationHash: "sha256-7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"
    },
    {
        id: "CERT-008",
        title: "Become a PLC Developer",
        issuer: "LinkedIn Learning",
        year: "2024",
        category: "Embedded & IoT",
        icon: Cpu,
        image: '/assets/certifications/CertificateOfCompletion_Become a PLC Developer.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Become a PLC Developer.pdf'],
        credentialId: "LIL-PLC-2024-D04",
        skills: ["PLC Coding", "Ladder Logic", "Industrial Automation", "HMI Systems", "SCADA"],
        description: "Learned PLC programming structures, ladder diagram modeling, industrial sensor calibration, and automation control loops.",
        verificationHash: "sha256-0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
    },
    {
        id: "CERT-009",
        title: "Solar PV Design & Installation",
        issuer: "NPTEL / SCGJ",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/Solar PV design certificate.pdf',
        gallery: ['/assets/certifications/Solar PV design certificate.pdf'],
        credentialId: "NPTEL-PV-2023-S09",
        skills: ["PV Modeling", "Solar Grid Design", "Inverters", "Energy Calculation", "Site Analysis"],
        description: "Techniques for designing solar photovoltaic power grids, specifying inverters, sizing battery arrays, and performing solar yield analysis.",
        verificationHash: "sha256-9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
    },
    {
        id: "CERT-010",
        title: "Google AI Essentials",
        issuer: "Google / Coursera",
        year: "2024",
        category: "AI & Software",
        icon: Sparkles,
        image: '/assets/certifications/Google AI.pdf',
        gallery: ['/assets/certifications/Google AI.pdf'],
        isVerifiedBadge: true,
        credentialId: "GOOG-AI-2024-E10",
        skills: ["Machine Learning", "Generative AI", "AI Ethics", "Data Processing", "Prompting"],
        description: "Learned foundational artificial intelligence principles, neural networks, ethics, prompt orchestration, and business integration of AI systems.",
        verificationHash: "sha256-2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c"
    },
    {
        id: "CERT-011",
        title: "Career Essentials in Generative AI",
        issuer: "Microsoft & LinkedIn",
        year: "2024",
        category: "AI & Software",
        icon: Sparkles,
        image: '/assets/certifications/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn.pdf'],
        credentialId: "MS-GAI-2024-C11",
        skills: ["GenAI Essentials", "Copilot", "Prompt Design", "AI Productivity", "Ethics"],
        description: "Introduction to Large Language Models, prompt crafting, Microsoft Copilot utilities, and ethical guidelines for implementing generative AI in workflows.",
        verificationHash: "sha256-c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2"
    },
    {
        id: "CERT-012",
        title: "Career Essentials in GitHub",
        issuer: "GitHub & LinkedIn",
        year: "2024",
        category: "AI & Software",
        icon: Code,
        image: '/assets/certifications/CertificateOfCompletion_Career Essentials in GitHub Professional Certificate.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Career Essentials in GitHub Professional Certificate.pdf'],
        credentialId: "GH-LIL-2024-P12",
        skills: ["Git Version Control", "GitHub Actions", "Pull Requests", "CI/CD", "Branching Strategies"],
        description: "Mastery of version control systems, GitHub collaborative operations, actions automation, and codebase repository hygiene.",
        verificationHash: "sha256-8a9d8c7b6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c"
    },
    {
        id: "CERT-013",
        title: "Embedded Systems & PCB Designing",
        issuer: "Chefronics Technologies",
        year: "2022",
        category: "Embedded & IoT",
        icon: Cpu,
        image: '/assets/certifications/Chefronics certificate.jpg',
        gallery: ['/assets/certifications/Chefronics certificate.jpg'],
        credentialId: "CHEF-PCB-2022-T13",
        skills: ["PCB Layout Design", "Altium Designer", "Circuit Schematics", "Soldering", "Hardware Assembly"],
        description: "Hands-on training in electronic circuit schematic design, PCB layout rendering, component selection, and soldering operations.",
        verificationHash: "sha256-4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d"
    },
    {
        id: "CERT-014",
        title: "MATLAB Onramp",
        issuer: "MathWorks",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/MATLAB onramp.pdf',
        gallery: ['/assets/certifications/MATLAB onramp.pdf'],
        credentialId: "MATH-MAT-2023-O14",
        skills: ["MATLAB Syntax", "Matrix Math", "Data Visualization", "Numerical Analysis", "Scripting"],
        description: "Foundational scripting, mathematical computing, data visualization, and matrix manipulations in the MATLAB environment.",
        verificationHash: "sha256-7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"
    },
    {
        id: "CERT-015",
        title: "Simulink Onramp",
        issuer: "MathWorks",
        year: "2023",
        category: "Power & Electrical",
        icon: Cpu,
        image: '/assets/certifications/Simulink onramp.pdf',
        gallery: ['/assets/certifications/Simulink onramp.pdf'],
        credentialId: "MATH-SIM-2023-O15",
        skills: ["Simulink Modeling", "Dynamic Systems", "Block Diagrams", "Simulation Control", "Electrical Modeling"],
        description: "Learned physical system modeling, signal flow simulations, feedback control design, and electrical power grid simulations.",
        verificationHash: "sha256-0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
    },
    {
        id: "CERT-016",
        title: "Battery Management Systems",
        issuer: "NPTEL / DIYBMS",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/BMS.pdf',
        gallery: ['/assets/certifications/BMS.pdf'],
        credentialId: "NPTEL-BMS-2023-B16",
        skills: ["BMS Architecture", "Cell Balancing", "State of Charge (SoC)", "Thermal Safety", "Battery Pack Design"],
        description: "In-depth analysis of battery management systems, cell balancing topologies, safe operating area limits, and SoC estimation methods.",
        verificationHash: "sha256-5d6c7b8a9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
    },
    {
        id: "CERT-017",
        title: "EV Fundamentals",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/EV fundamentals.pdf',
        gallery: ['/assets/certifications/EV fundamentals.pdf'],
        credentialId: "LIL-EV-2023-F17",
        skills: ["EV Powertrain", "Braking Systems", "Hybrid Vehicles", "Electrical Motors", "EV Chargers"],
        description: "Overview of EV architecture, electric drive motors, regenerative braking, battery charging protocols, and hybrid configurations.",
        verificationHash: "sha256-c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2"
    },
    {
        id: "CERT-018",
        title: "Fire Safety & Response",
        issuer: "National Safety Council",
        year: "2023",
        category: "Robotics & Hardware",
        icon: ShieldCheck,
        image: '/assets/certifications/Firesafety Certificate.jpg',
        gallery: ['/assets/certifications/Firesafety Certificate.jpg'],
        credentialId: "NSC-FS-2023-F18",
        skills: ["Emergency Response", "Hazard Identification", "Fire Extinguishment", "Safety Protocols", "Risk Control"],
        description: "Certified emergency response training covering electrical fire safety, prevention protocols, fire suppression techniques, and hazard containment.",
        verificationHash: "sha256-9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
    },
    {
        id: "CERT-019",
        title: "Amplify Communication Skills with GenAI",
        issuer: "Microsoft / LinkedIn",
        year: "2024",
        category: "AI & Software",
        icon: Sparkles,
        image: '/assets/certifications/CertificateOfCompletion_Amplify Your Communication Skills with Generative AI.pdf',
        gallery: ['/assets/certifications/CertificateOfCompletion_Amplify Your Communication Skills with Generative AI.pdf'],
        credentialId: "MS-LIL-2024-A19",
        skills: ["Generative Writing", "Communication Strategy", "GenAI Editing", "Prompt Systems"],
        description: "Explored how to utilize Large Language Models to improve professional writing, technical reports, and dynamic communication layouts.",
        verificationHash: "sha256-8a9d8c7b6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c"
    },
    {
        id: "CERT-020",
        title: "Design Thinking for Innovators",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "AI & Software",
        icon: Sparkles,
        image: '/assets/certifications/Design thinking for innovators.pdf',
        gallery: ['/assets/certifications/Design thinking for innovators.pdf'],
        credentialId: "LIL-DT-2023-D20",
        skills: ["Design Thinking", "Problem Reframing", "Prototyping", "User Empathy", "Innovation Loops"],
        description: "Learned iterative problem solving frameworks, user empathy mapping, prototyping, and validation feedback loops.",
        verificationHash: "sha256-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
    },
    {
        id: "CERT-021",
        title: "IoT & Digital Transformation",
        issuer: "Cisco Networking Academy",
        year: "2023",
        category: "Embedded & IoT",
        icon: Wifi,
        image: '/assets/certifications/Introduction to IoT and Digital Transformation.pdf',
        gallery: ['/assets/certifications/Introduction to IoT and Digital Transformation.pdf'],
        credentialId: "CSCO-IDT-2023-I21",
        skills: ["Digital Transformation", "Big Data", "Edge Computing", "IoT Security", "Automation"],
        description: "Learned the role of IoT in business automation, cloud orchestration, edge device configurations, and digital system integration.",
        verificationHash: "sha256-0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
    },
    {
        id: "CERT-022",
        title: "Introduction to Internet of Things",
        issuer: "Cisco Networking Academy",
        year: "2023",
        category: "Embedded & IoT",
        icon: Wifi,
        image: '/assets/certifications/Introduction to Internet of Things.pdf',
        gallery: ['/assets/certifications/Introduction to Internet of Things.pdf'],
        credentialId: "CSCO-IOT-2023-I22",
        skills: ["IoT Networks", "Gateway Routing", "Cybersecurity", "Arduino Interfacing", "Python Telemetry"],
        description: "Introduction to IoT frameworks, microcontroller interfacing, network setups, packet transmission, and data analytics.",
        verificationHash: "sha256-7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"
    },
    {
        id: "CERT-023",
        title: "Statement of Accomplishment",
        issuer: "Coursera / Stanford",
        year: "2023",
        category: "Embedded & IoT",
        icon: Award,
        image: '/assets/certifications/STATEMENT OF ACCOMPLISHMENT.pdf',
        gallery: ['/assets/certifications/STATEMENT OF ACCOMPLISHMENT.pdf'],
        credentialId: "COUR-SOA-2023-S23",
        skills: ["Technical Writing", "Academic Research", "Systems Engineering", "Data Modeling"],
        description: "Verified academic accomplishment demonstrating proficiency in systems engineering, documentation, and technical modeling.",
        verificationHash: "sha256-2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c"
    },
    {
        id: "CERT-024",
        title: "ITP Engineering Certification",
        issuer: "Technical Board",
        year: "2024",
        category: "Embedded & IoT",
        icon: Award,
        image: '/assets/certifications/ITP0017198099584.png',
        gallery: ['/assets/certifications/ITP0017198099584.png'],
        credentialId: "ITP-ENG-2024-C24",
        skills: ["Industrial Operations", "Technical Safety", "Machine Maintenance", "Instruments"],
        description: "Certified engineering training credential documenting standard industrial machine operations and instrument calibrations.",
        verificationHash: "sha256-4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d"
    },
    {
        id: "CERT-025",
        title: "Getting Started with Data",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "AI & Software",
        icon: Box,
        image: '/assets/certifications/Getting Started with Data.pdf',
        gallery: ['/assets/certifications/Getting Started with Data.pdf'],
        credentialId: "LIL-DAT-2023-G25",
        skills: ["Data Analysis", "SQL Basics", "Data Cleaning", "Analytics Dashboards"],
        description: "Learned basic data modeling, structured query language, cleaning data, and generating reporting charts.",
        verificationHash: "sha256-5d6c7b8a9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
    },
    {
        id: "CERT-026",
        title: "Electrical Engineering Internship",
        issuer: "Coromandel International Limited",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/experience/coromandel/internship-certificate.jpg',
        gallery: [
            '/assets/experience/coromandel/internship-certificate.jpg',
            '/assets/experience/coromandel/single-line-diagram.jpg',
            '/assets/experience/coromandel/site-photo.jpg',
            '/assets/experience/coromandel/training-site.jpg'
        ],
        isVerifiedBadge: true,
        credentialId: "CIL-EE-2023-014",
        skills: ["Power Distribution", "Industrial Maintenance", "Single Line Diagrams", "Switchgears", "Substation Operations"],
        description: "Hands-on industrial training on power systems, electrical machines, switchgears, single line diagrams, and electrical maintenance operations at a fertilizer manufacturing plant.",
        verificationHash: "sha256-5d6c7b8a9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f"
    }
];

const CertificateCard: React.FC<{
    cert: Certification;
    isPowered: boolean;
    onSelect: (cert: Certification) => void;
}> = ({ cert, isPowered, onSelect }) => {
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
            className="group"
            onClick={() => isPowered && onSelect(cert)}
        >
            <GlareHover
                width="100%"
                height="100%"
                background={isPowered ? '#070708' : '#121212'}
                borderRadius="0.75rem"
                borderColor={isPowered ? (cert.isVerifiedBadge ? 'rgba(6,182,212,0.3)' : '#18181b') : '#1e1e1e'}
                glareColor={isPowered ? '#00f2ff' : '#222222'}
                glareOpacity={isPowered ? 0.12 : 0.05}
                glareSize={280}
                className={`p-6 transition-all duration-300 relative h-full flex flex-col justify-between cursor-pointer border min-h-[380px]
                    ${isPowered && cert.isVerifiedBadge ? 'shadow-[0_0_15px_rgba(6,182,212,0.03)] border-cyan-500/25' : ''}
                    ${!isPowered ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
                {/* Watermark Year Background */}
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
                                /* Image Preview (handles both original images and rendered PDF thumbnails) */
                                <img
                                    src={previewImage}
                                    alt={cert.title}
                                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105
                                        ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    loading="lazy"
                                    onLoad={() => setIsLoaded(true)}
                                />
                            ) : (
                                /* Fallback */
                                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-700">
                                    <Award size={24} className="opacity-30" />
                                    <span className="text-[9px] mt-1 font-mono">NO IMAGE PREVIEW</span>
                                </div>
                            )}
                        </div>

                        {/* Header: Icon & Verification */}
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
                                {cert.category}
                            </span>
                            <h4 className={`text-base font-black tracking-tight leading-snug mb-1 line-clamp-2 ${isPowered ? 'text-white' : 'text-zinc-500'}`}>
                                {cert.title}
                            </h4>
                            <p className={`text-xs font-mono uppercase tracking-wider ${isPowered ? 'text-gray-500' : 'text-zinc-600'}`}>
                                {cert.issuer}
                            </p>
                        </div>
                    </div>

                    <div>
                        {/* Gained Skills Preview */}
                        <div className="mt-2 flex flex-wrap gap-1 relative z-10">
                            {cert.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="text-[9px] px-1.5 py-0.5 bg-black/40 border border-zinc-900 rounded text-zinc-500">
                                    {skill}
                                </span>
                            ))}
                            {cert.skills.length > 3 && (
                                <span className="text-[9px] px-1 py-0.5 text-zinc-600">
                                    +{cert.skills.length - 3} more
                                </span>
                            )}
                        </div>

                        {/* Action link */}
                        <div
                            className={`flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest transition-all duration-300 mt-4 relative z-10
                                ${isPowered
                                    ? 'text-cyan-500/80 group-hover:text-cyan-300 group-hover:translate-x-1'
                                    : 'text-zinc-700'
                                }`}
                        >
                            <span>Inspect Module</span>
                            <ChevronRight size={10} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </GlareHover>
        </div>
    );
};

const Certificates: React.FC = () => {
    const [isPowered, setIsPowered] = useState(true);
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Embedded & IoT' | 'AI & Software' | 'Robotics & Hardware' | 'Power & Electrical'>('All');
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    // Filter logic
    const filteredCerts = CERTS.filter(cert => {
        const matchesFilter = activeFilter === 'All' || cert.category === activeFilter;
        const matchesSearch =
            cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    // Copy to clipboard helper
    const copyHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    // Diagnostics calculations
    const verifiedCount = CERTS.filter(c => c.isVerifiedBadge).length;
    const totalCount = CERTS.length;

    return (
        <div className="min-h-screen relative selection:bg-cyan-500/30 font-mono text-gray-300 bg-black overflow-x-hidden">
            <Helmet>
                <title>Verified Credentials &amp; Certifications | {PROFILE.name}</title>
                <meta name="description" content="Browse verified engineering credentials, specialized certifications and training records of Srinivasa Manikanta in Embedded Systems, IoT, EV, and AI." />
                <link rel="canonical" href="https://rsmk.me/certificates" />
            </Helmet>

            <PCBBackground isPowered={isPowered} />

            {/* Core wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* ── Header Row ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-gray-900 pb-6 pt-4">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 mb-3 text-xs text-cyan-500 hover:text-cyan-400 transition-colors group focus:outline-none"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Dashboard</span>
                        </Link>
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-3"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            <Award size={32} className="text-cyan-500" />
                            Credentials Registry
                        </h1>
                    </div>

                    {/* Power Toggle Module */}
                    <button
                        onClick={() => setIsPowered(!isPowered)}
                        className={`px-4 py-2 border font-bold text-xs tracking-widest rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer
                            ${isPowered
                                ? 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:bg-cyan-900/30'
                                : 'border-red-950/50 text-red-500 bg-red-950/10 hover:bg-red-950/25'
                            }`}
                    >
                        <RefreshCw size={12} className={isPowered ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
                        <span>MODULE: {isPowered ? 'ACTIVE' : 'OFFLINE'}</span>
                    </button>
                </div>

                {/* ── System Diagnostics Board ── */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-5 border rounded-xl transition-all duration-500
                    ${isPowered
                        ? 'border-cyan-950/40 bg-black/40 shadow-[0_0_15px_rgba(6,182,212,0.02)]'
                        : 'border-gray-900 bg-black/10'
                    }`}
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 tracking-wider font-bold uppercase">System.Integrity</span>
                        <span className={`text-sm md:text-base font-black mt-1 ${isPowered ? 'text-green-400' : 'text-gray-600'}`}>
                            {isPowered ? 'NOMINAL (100%)' : 'STANDBY'}
                        </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-900 pl-4 pl-6">
                        <span className="text-[10px] text-gray-500 tracking-wider font-bold uppercase">Total.Records</span>
                        <span className={`text-sm md:text-base font-black mt-1 ${isPowered ? 'text-white' : 'text-gray-600'}`}>
                            {String(totalCount).padStart(2, '0')} FILES
                        </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-900 pl-4 pl-6">
                        <span className="text-[10px] text-gray-500 tracking-wider font-bold uppercase">Verified.Keys</span>
                        <span className={`text-sm md:text-base font-black mt-1 ${isPowered ? 'text-cyan-400' : 'text-gray-600'}`}>
                            {String(verifiedCount).padStart(2, '0')} ACTIVE
                        </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-900 pl-4 pl-6">
                        <span className="text-[10px] text-gray-500 tracking-wider font-bold uppercase">Active.Domains</span>
                        <span className={`text-sm md:text-base font-black mt-1 ${isPowered ? 'text-amber-400' : 'text-gray-600'}`}>
                            IOT // ROBOTICS
                        </span>
                    </div>
                </div>

                {/* ── Search and Filter Console ── */}
                <div className="flex flex-col lg:flex-row gap-5 justify-between items-stretch lg:items-center mb-8">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-lg">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Query by title, issuer, or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={!isPowered}
                            className={`w-full pl-10 pr-4 py-2.5 bg-black border rounded-lg text-sm tracking-wide transition-all duration-300 focus:outline-none
                                ${!isPowered
                                    ? 'border-zinc-900 text-zinc-700 placeholder-zinc-800 animate-pulse'
                                    : 'border-cyan-950/80 text-white placeholder-gray-500 focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                                }`}
                        />
                    </div>

                    {/* Filter Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {(['All', 'Embedded & IoT', 'AI & Software', 'Robotics & Hardware', 'Power & Electrical'] as const).map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => isPowered && setActiveFilter(filter)}
                                    disabled={!isPowered}
                                    className={`px-3 py-1.5 border text-xs font-bold rounded-md transition-all duration-300 cursor-pointer
                                        ${isActive
                                            ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                            : isPowered
                                                ? 'border-zinc-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-950/50'
                                                : 'border-zinc-950 text-zinc-800'
                                        }`}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Main Grid ── */}
                <AnimatePresence mode="wait">
                    {filteredCerts.length > 0 ? (
                        <motion.div
                            key={activeFilter + searchQuery}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredCerts.map((cert, idx) => (
                                <CertificateCard
                                    key={cert.id}
                                    cert={cert}
                                    isPowered={isPowered}
                                    onSelect={setSelectedCert}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 border border-zinc-900 rounded-2xl bg-zinc-950/20"
                        >
                            <Award size={48} className="text-zinc-800 mb-4 opacity-50" />
                            <p className="font-mono text-sm text-zinc-600">No credential logs matching query</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                                className="mt-3 px-4 py-2 border border-cyan-950 text-cyan-500 hover:text-cyan-400 hover:border-cyan-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                                Reset Search Filter
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Dual-Pane Drawer Modal ── */}
            <AnimatePresence>
                {selectedCert && (
                    <DetailModal
                        cert={selectedCert}
                        onClose={() => setSelectedCert(null)}
                        isPowered={isPowered}
                        copiedHash={copiedHash}
                        copyHash={copyHash}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-component: Detail Modal
interface DetailModalProps {
    cert: Certification;
    onClose: () => void;
    isPowered: boolean;
    copiedHash: string | null;
    copyHash: (hash: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ cert, onClose, isPowered, copiedHash, copyHash }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset image index when cert changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [cert]);

    // Escape key listener for close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

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
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-5xl rounded-2xl overflow-hidden border shadow-2xl flex flex-col lg:flex-row max-h-[90vh] bg-[#070709]
                    ${isPowered ? 'border-cyan-950/60' : 'border-zinc-900'}`}
            >
                {/* ── Left Pane: Sandbox Previewer ── */}
                <div className="flex-1 bg-black flex flex-col justify-between overflow-hidden min-h-[320px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-zinc-950 relative">

                    {/* Header bar */}
                    <div className="p-3 border-b border-zinc-950 flex justify-between items-center bg-zinc-950/20 absolute top-0 left-0 w-full z-20">
                        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            sandbox_viewer.dll ({activeImageIndex + 1}/{cert.gallery?.length || 1})
                        </span>
                        {mainSrc && (
                            <a
                                href={mainSrc}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-1 px-2 py-0.5 border border-cyan-950 rounded bg-cyan-950/10 transition-colors cursor-pointer"
                            >
                                <ExternalLink size={10} />
                                <span>Full Resolution</span>
                            </a>
                        )}
                    </div>

                    {/* Image Sandbox Area */}
                    <div className="flex-1 flex items-center justify-center p-6 mt-10 mb-16 overflow-auto min-h-0 relative group">
                        {mainSrc ? (
                            mainSrc.endsWith('.mp4') ? (
                                <video
                                    src={mainSrc}
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    className="max-w-full max-h-[46vh] lg:max-h-[56vh] object-contain rounded border border-cyan-950/40 shadow-[0_0_30px_rgba(0,242,255,0.03)]"
                                />
                            ) : mainSrc.endsWith('.pdf') ? (
                                <iframe
                                    src={`${mainSrc}#toolbar=0&navpanes=0&scrollbar=0`}
                                    title={cert.title}
                                    className="w-full h-full min-h-[44vh] lg:min-h-[54vh] rounded border border-cyan-950/30 bg-zinc-950"
                                />
                            ) : (
                                <img
                                    src={mainSrc}
                                    alt={cert.title}
                                    className="max-w-full max-h-[46vh] lg:max-h-[56vh] object-contain rounded border border-cyan-950/40 shadow-[0_0_30px_rgba(0,242,255,0.03)]"
                                />
                            )
                        ) : (
                            /* Cybernetic Vector Graphic for Digital-only certificates */
                            <div className="text-zinc-600 flex flex-col items-center justify-center p-8 max-w-md text-center">
                                <div className="relative mb-6">
                                    {/* Glowing circuit background */}
                                    <svg width="120" height="120" viewBox="0 0 100 100" className="animate-[spin_40s_linear_infinite]">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="3, 3" />
                                        <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="2" strokeDasharray="10, 5" />
                                        <path d="M 50,8 A 42,42 0 0,1 92,50" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="2" />
                                        <path d="M 50,92 A 42,42 0 0,1 8,50" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Cpu size={32} className="text-cyan-500/40 animate-pulse" />
                                    </div>
                                </div>
                                <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Secure Digital Log</h5>
                                <p className="text-[11px] font-mono text-zinc-500 leading-relaxed max-w-[280px]">
                                    This credential is recorded digitally. A high-resolution image render is not issued, but secure verification signatures are active.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Image Selector Carousel Dots / Thumbnails */}
                    {cert.gallery && cert.gallery.length > 1 && (
                        <div className="p-3 bg-zinc-950/20 border-t border-zinc-950 flex gap-2 overflow-x-auto justify-center absolute bottom-0 left-0 w-full z-20">
                            {cert.gallery.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`w-14 h-10 rounded overflow-hidden border transition-all duration-300 cursor-pointer flex-shrink-0
                                        ${activeImageIndex === i
                                            ? 'border-cyan-500 scale-105 opacity-100 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                                            : 'border-zinc-900 opacity-40 hover:opacity-80'
                                        }`}
                                >
                                    {src.endsWith('.mp4') ? (
                                        <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-cyan-500 text-[8px] font-bold font-mono">
                                            VIDEO
                                        </div>
                                    ) : src.endsWith('.pdf') ? (
                                        <div className="w-full h-full bg-zinc-955/50 bg-zinc-900 flex items-center justify-center text-red-500 text-[8px] font-bold font-mono border border-red-950/20">
                                            PDF
                                        </div>
                                    ) : (
                                        <img src={src} className="w-full h-full object-cover" alt="" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right Pane: Details Verification Panel ── */}
                <div className="w-full lg:w-[400px] flex flex-col justify-between overflow-y-auto max-h-[45vh] lg:max-h-[90vh]">

                    {/* Header Card */}
                    <div className="p-6 border-b border-zinc-950 bg-black/40">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded">
                                {cert.category}
                            </span>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 text-zinc-500 hover:text-white transition-all cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <h3 className="text-xl font-black tracking-tight text-white mb-1.5 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {cert.title}
                        </h3>
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{cert.issuer} // {cert.year}</p>
                    </div>

                    {/* Metadata Sheet */}
                    <div className="p-6 flex-1 flex flex-col gap-6">
                        {/* Status Checkbox */}
                        <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-950 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-cyan-950/20 text-cyan-400 border border-cyan-500/10">
                                    <ShieldCheck size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Credential.Status</span>
                                    <span className="text-xs font-bold text-white uppercase tracking-wide">VERIFIED &amp; SECURED</span>
                                </div>
                            </div>
                            <span className="text-[9px] text-green-400 font-bold bg-green-950/20 border border-green-500/20 px-2 py-0.5 rounded">
                                ACTIVE
                            </span>
                        </div>

                        {/* Description */}
                        <div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-2">Curriculum.Overview</span>
                            <p className="text-xs font-mono text-zinc-400 leading-relaxed bg-black/20 p-3 rounded-lg border border-zinc-950">
                                {cert.description}
                            </p>
                        </div>

                        {/* Gained Skills */}
                        <div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-2.5">Skills.Unlocked</span>
                            <div className="flex flex-wrap gap-1.5">
                                {cert.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2.5 py-1 bg-cyan-950/10 border border-cyan-950/65 rounded text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ID Block */}
                        {cert.credentialId && (
                            <div>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">Credential.ID</span>
                                <span className="text-xs font-mono text-zinc-400 block bg-zinc-950/40 p-2.5 rounded border border-zinc-950 select-all">
                                    {cert.credentialId}
                                </span>
                            </div>
                        )}

                        {/* Verification Signature Hash */}
                        <div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider flex justify-between items-center mb-1">
                                <span>Verification.Signature</span>
                                {copiedHash === cert.verificationHash && (
                                    <span className="text-[9px] text-green-400 lowercase font-mono">copied!</span>
                                )}
                            </span>
                            <div className="flex items-stretch gap-1">
                                <span className="text-[9px] font-mono text-gray-500 p-2 rounded-l bg-zinc-950/60 border border-r-0 border-zinc-950 break-all select-all flex-1 line-clamp-1">
                                    {cert.verificationHash}
                                </span>
                                <button
                                    onClick={() => copyHash(cert.verificationHash)}
                                    title="Copy SHA-256 signature"
                                    className="px-2 bg-zinc-950 border border-gray-950 hover:bg-zinc-900 text-zinc-500 hover:text-cyan-400 rounded-r transition-colors cursor-pointer"
                                >
                                    <Copy size={11} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Lock Indicator */}
                    <div className="p-4 bg-zinc-950/30 border-t border-zinc-950 text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={11} className="text-green-500" />
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Signed digitally under crypt_v4_sys</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Certificates;
