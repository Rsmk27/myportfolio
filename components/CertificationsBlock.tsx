import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Fan, Box, Sparkles, LucideIcon, Wifi, Award, X, ChevronRight, ChevronLeft, ShieldCheck, Code, ExternalLink, FileText, Briefcase, BookOpen } from 'lucide-react';
import GlareHover from './ui/GlareHover';
export interface Certification {
    id: string;
    title: string;
    issuer: string;
    year: string;
    category: 'Embedded & IoT' | 'AI & Software' | 'Robotics & Hardware' | 'Power & Electrical';
    type?: 'Course' | 'Professional' | 'Internship';
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
        id: "CERT-002",
        title: "Electric Vehicle Technology",
        issuer: "ISTE Student Chapter",
        year: "2023",
        category: "Power & Electrical",
        icon: Zap,
        image: '/assets/certifications/EV technology.jpg',
        gallery: [
            '/assets/certifications/EV technology.jpg',
            '/assets/gallery/ev-battery/bms-battery-monitor-prototype.jpeg',
            '/assets/gallery/ev-battery/bms-over-temperature-protection.jpeg',
            '/assets/gallery/ev-battery/igk-brushless-motor-controller.jpeg',
            '/assets/gallery/ev-battery/khetaan-smart-wireless-controller.jpeg',
            '/assets/gallery/ev-battery/ev-workshop-seminar.webp',
            '/assets/gallery/ev-battery/ev-technology-classroom.jpg'
        ],
        credentialId: "NPTEL-EV-2023-M504",
        skills: ["Battery Pack Design", "BMS", "BLDC Motors", "Motor Controllers", "Thermal Management"],
        description: "Learned powertrain architecture, battery management systems (BMS), motor control circuits, and thermal management for electric vehicles.",
        verificationHash: "sha256-4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d"
    },
    {
        id: "CERT-003",
        title: "Drone Technology",
        issuer: "Aigen Labs",
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
        issuer: "ISTE Student Chapter",
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
        issuer: "Skill Dzire",
        year: "2023",
        category: "Power & Electrical",
        type: "Internship",
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
        type: "Professional",
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
        type: "Course",
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
        type: "Course",
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
        type: "Course",
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
        type: "Course",
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
        type: "Course",
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
        issuer: "DIY Guru",
        year: "2023",
        category: "Power & Electrical",
        type: "Course",
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
        issuer: "DIY Guru",
        year: "2023",
        category: "Power & Electrical",
        type: "Course",
        icon: Zap,
        image: '/assets/certifications/EV fundamentals.pdf',
        gallery: ['/assets/certifications/EV fundamentals.pdf'],
        credentialId: "LIL-EV-2023-F17",
        skills: ["EV Powertrain", "Braking Systems", "Hybrid Vehicles", "Electrical Motors", "EV Chargers"],
        description: "Overview of EV architecture, electric drive motors, regenerative braking, battery charging protocols, and hybrid configurations.",
        verificationHash: "sha256-c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2"
    },
    {
        id: "CERT-020",
        title: "Design Thinking for Innovators",
        issuer: "LinkedIn Learning",
        year: "2023",
        category: "AI & Software",
        type: "Course",
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
        type: "Course",
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
        issuer: "NPTEL",
        year: "2023",
        category: "Embedded & IoT",
        type: "Course",
        icon: Wifi,
        image: '/assets/certifications/Introduction to Internet of Things.pdf',
        gallery: ['/assets/certifications/Introduction to Internet of Things.pdf'],
        credentialId: "CSCO-IOT-2023-I22",
        skills: ["IoT Networks", "Gateway Routing", "Cybersecurity", "Arduino Interfacing", "Python Telemetry"],
        description: "Introduction to IoT frameworks, microcontroller interfacing, network setups, packet transmission, and data analytics.",
        verificationHash: "sha256-7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"
    },
    {
        id: "CERT-025",
        title: "Getting Started with Data",
        issuer: "IBM",
        year: "2023",
        category: "AI & Software",
        type: "Course",
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
        type: "Internship",
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
    },
    {
        id: "CERT-027",
        title: "Embedded Systems Internship",
        issuer: "Datavalley India",
        year: "2026",
        category: "Embedded & IoT",
        type: "Internship",
        icon: Cpu,
        image: '/assets/certifications/Datavalley  Embedded system intership.pdf',
        gallery: ['/assets/certifications/Datavalley  Embedded system intership.pdf'],
        isVerifiedBadge: true,
        credentialId: "DV-86d2fed3",
        skills: ["Embedded Systems", "C Programming", "Microcontrollers", "Firmware Development", "APSCHE"],
        description: "Completed an online short-term internship in Embedded Systems organized by Datavalley India in collaboration with APSCHE, focusing on microcontroller programming, firmware development, and hardware interfacing.",
        verificationHash: "sha256-3a5bdc5df77ab4a042b0e8398d5318403713e0ed523ce9af84147cf79e991e65"
    },
    {
        id: "CERT-028",
        title: "Basics of Robotics",
        issuer: "Siemens",
        year: "2026",
        category: "Robotics & Hardware",
        type: "Course",
        icon: Cpu,
        image: '/assets/certifications/Basics of Robotics.pdf',
        gallery: ['/assets/certifications/Basics of Robotics.pdf'],
        credentialId: "45YNRZT5FH95",
        skills: ["Robotics Fundamentals", "Kinematics", "Robot Programming", "Industrial Automation", "Siemens Software"],
        description: "Foundational course authorized by Siemens covering robotic structures, coordinate systems, kinematic designs, and robotic automation systems.",
        verificationHash: "sha256-75f23eb2544f7bc2dd65a52024f74be0de9fa2cdc070fe98122033b2630148ed"
    },
    {
        id: "CERT-029",
        title: "AI for Autonomous Vehicles and Robotics",
        issuer: "University of Michigan",
        year: "2026",
        category: "Robotics & Hardware",
        type: "Course",
        icon: Cpu,
        image: '/assets/certifications/AI for Autonomous Vehicles and Robotics.pdf',
        gallery: ['/assets/certifications/AI for Autonomous Vehicles and Robotics.pdf'],
        credentialId: "NCG7UCSW2CEO",
        skills: ["Autonomous Vehicles", "Computer Vision", "Sensor Fusion", "Robotics AI", "Path Planning"],
        description: "Specialized course authorized by the University of Michigan covering AI algorithms, perception, localization, and decision-making for self-driving vehicles and robotic agents.",
        verificationHash: "sha256-80c465457b39e4fee35ffbc01a7239ae51170dd76e4ac88e961b73ef7c05db3e"
    },
    {
        id: "CERT-030",
        title: "Powering the Future with Electrification",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Zap,
        image: '/assets/certifications/Powering the Future with Electrification.pdf',
        gallery: ['/assets/certifications/Powering the Future with Electrification.pdf'],
        credentialId: "SP7WDPFIC9EB",
        skills: ["Electrification", "Electric Vehicles", "Power Electronics", "Battery Systems", "MATLAB", "Simulink"],
        description: "Authorized by MathWorks, exploring electrification technologies, battery systems, power conversion, motor drives, and electrification grid modeling.",
        verificationHash: "sha256-c6df6e39a4953b8071833f9302c124d56bf3da3af43c3d9d1e467907c5eee473"
    },
    {
        id: "CERT-031",
        title: "Interfacing with the Arduino",
        issuer: "University of California, Irvine",
        year: "2026",
        category: "Embedded & IoT",
        type: "Course",
        icon: Cpu,
        image: '/assets/certifications/Interfacing with the Arduino.pdf',
        gallery: ['/assets/certifications/Interfacing with the Arduino.pdf'],
        credentialId: "BKTUOFUAW359",
        skills: ["Arduino", "Sensors Interfacing", "Actuators", "Hardware Prototyping", "C/C++ Programming"],
        description: "Authorized by University of California, Irvine, focusing on connecting sensors and actuators, signal conditioning, shield design, and software integration.",
        verificationHash: "sha256-19808c8f2702b431aed74b20b881c6264b826d1fc63c18cb85d1f6a302cbfd19"
    },
    {
        id: "CERT-032",
        title: "Modeling and Simulation with Simulink",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Cpu,
        image: '/assets/certifications/Modeling and Simulation with Simulink.pdf',
        gallery: ['/assets/certifications/Modeling and Simulation with Simulink.pdf'],
        credentialId: "2UBTY4UL2XJ3",
        skills: ["Simulink", "System Modeling", "Dynamic Simulation", "Control Systems", "MATLAB"],
        description: "Authorized by MathWorks, covering dynamic system design, block-diagram modeling, system simulation, and feedback control verification.",
        verificationHash: "sha256-1c1bb22bd9a5e105d03674ac6d858ced499dffd6fca4060c379517e8c67ec041"
    },
    {
        id: "CERT-033",
        title: "Learn PLC and HMI from Scratch (Basic)",
        issuer: "Coursera",
        year: "2026",
        category: "Embedded & IoT",
        type: "Professional",
        icon: Cpu,
        image: '/assets/certifications/PLC, HMI.pdf',
        gallery: ['/assets/certifications/PLC, HMI.pdf'],
        credentialId: "LWCPAV54265H",
        skills: ["Siemens PLC", "TIA Portal", "HMI Design", "SCADA", "Ladder Logic", "Industrial Automation"],
        description: "Comprehensive 3-course specialization covering Siemens PLC wiring, TIA Portal programming, HMI interface layouts, SCADA systems, and industrial control loops.",
        verificationHash: "sha256-2fbea33a0e68b8576c2b83447b56068de664ac78186bbbad4e08f766af516f8c"
    },
    {
        id: "CERT-034",
        title: "Designing and Simulating Physical Models",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Cpu,
        image: '/assets/certifications/Designing and Simulating Physical Models.pdf',
        gallery: ['/assets/certifications/Designing and Simulating Physical Models.pdf'],
        credentialId: "EFF3H17UVJM4",
        skills: ["Physical Modeling", "Simscape", "Simulink Simulation", "Multidomain Systems", "MATLAB"],
        description: "Authorized by MathWorks, covering physical model designs, multidomain fluid/thermal/mechanical simulations, and dynamic Simscape modeling.",
        verificationHash: "sha256-2e0bbb20aab3d4c2176dd453b2be69d8c10afc7675dbb68712c4c6b43bb45626"
    },
    {
        id: "CERT-035",
        title: "Battery Design and Management",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Zap,
        image: '/assets/certifications/Battery Design and Management.pdf',
        gallery: ['/assets/certifications/Battery Design and Management.pdf'],
        credentialId: "FZF15DP9FSHQ",
        skills: ["Battery Design", "BMS", "Battery Modeling", "Thermal Management", "State of Charge", "Simulink"],
        description: "Authorized by MathWorks, covering battery cell characterization, state estimation, thermal modeling, battery pack design, and BMS simulation.",
        verificationHash: "sha256-a98e6aa30ebd89d3be777a6e1b060f08dd033fe39b364701f76841b6fc7de3c7"
    },
    {
        id: "CERT-036",
        title: "Electric Motor Modeling and Control",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Fan,
        image: '/assets/certifications/Electric Motor Modeling and Control.pdf',
        gallery: ['/assets/certifications/Electric Motor Modeling and Control.pdf'],
        credentialId: "58JN1U27RASY",
        skills: ["Motor Control", "Electric Motors", "Field-Oriented Control", "MATLAB", "Simulink", "Parameter Estimation"],
        description: "Authorized by MathWorks, covering electric motor modeling, parameter estimation, speed and torque control design, and simulation of motor drives.",
        verificationHash: "sha256-9334a77e95e90d2afd57dbf7dd6318216746d28bad8ec87e36983521ca4ed8a9"
    },
    {
        id: "CERT-037",
        title: "Power Conversion for Electronic Devices",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Course",
        icon: Zap,
        image: '/assets/certifications/Power Conversion for Electronic Devices.pdf',
        gallery: ['/assets/certifications/Power Conversion for Electronic Devices.pdf'],
        credentialId: "RODEPZ0BL7HN",
        skills: ["Power Conversion", "DC-DC Converters", "Power Electronics", "Feedback Control", "MATLAB", "Simulink"],
        description: "Authorized by MathWorks, covering power electronic converter design, DC-DC converter modeling, feedback control loop design, and switching simulation.",
        verificationHash: "sha256-eec8d77c966834c5c73f445faf2a165cd8589a38c2e6e3b410e93988fdfb05d8"
    },
    {
        id: "CERT-038",
        title: "Electrified Systems Design Engineer",
        issuer: "MathWorks",
        year: "2026",
        category: "Power & Electrical",
        type: "Professional",
        icon: Award,
        image: '/assets/certifications/Electrified Systems Design Engineer.pdf',
        gallery: ['/assets/certifications/Electrified Systems Design Engineer.pdf'],
        isVerifiedBadge: true,
        credentialId: "ECURKPFR1H2Z",
        skills: ["System Modeling", "Simulink", "Power Electronics", "Electric Motors", "Battery Systems", "MATLAB", "Simscape"],
        description: "Authorized by MathWorks, covering system-level modeling, simulation, and design of electrified systems. Integrates power electronics, electric motors, and battery systems using MATLAB and Simulink.",
        verificationHash: "sha256-567ee5af12904d6b57f10847746fe37dc61b802d12755759e5fb7ad6219f0514"
    },
    {
        id: "CERT-039",
        title: "AI Fundamentals: Foundations for Understanding AI",
        issuer: "IBM SkillsBuild",
        year: "2026",
        category: "AI & Software",
        type: "Course",
        icon: Sparkles,
        image: '/assets/certifications/AIFundamentalsFoundationsforUnderstandingAI.pdf',
        gallery: ['/assets/certifications/AIFundamentalsFoundationsforUnderstandingAI.pdf'],
        isVerifiedBadge: true,
        credentialId: "IBM-AIF-2026",
        skills: ["AI Fundamentals", "Artificial Intelligence", "Machine Learning", "AI Ethics", "Generative AI"],
        description: "Authorized course by IBM SkillsBuild covering fundamental artificial intelligence principles, neural networks, machine learning models, AI ethics, and practical applications.",
        verificationHash: "sha256-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
    }
];

interface CertificationsBlockProps {
    isPowered: boolean;
}

interface CredentialRowProps {
    title: string;
    badgeLabel: string;
    badgeCount: number;
    certs: Certification[];
    isPowered: boolean;
    onSelectCert: (cert: Certification) => void;
    direction?: 'normal' | 'reverse';
}

const CredentialRow: React.FC<CredentialRowProps> = ({
    title,
    badgeLabel,
    badgeCount,
    certs,
    isPowered,
    onSelectCert,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    // Track whether the user actually dragged (vs just clicked)
    const hasDragged = useRef(false);
    const mouseDownX = useRef(0);

    const scroll = (dir: 'left' | 'right') => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.75;
            const target = dir === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
            container.scrollTo({ left: target, behavior: 'smooth' });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        setIsDragging(true);
        hasDragged.current = false;
        mouseDownX.current = e.pageX;
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeftState(container.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!isDragging || !container) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeftState - walk;
        // Mark as dragged if moved more than 5px horizontally
        if (Math.abs(e.pageX - mouseDownX.current) > 5) {
            hasDragged.current = true;
        }
    };

    // Guard: only open modal on a genuine click, not after a drag
    const handleCardClick = (cert: Certification) => {
        if (hasDragged.current) return;
        onSelectCert(cert);
    };

    return (
        <div className="w-full mb-10 last:mb-0">
            {/* Row Sub-header */}
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                        {badgeLabel}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {title}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                        {badgeCount}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-zinc-400 hover:text-cyan-400 rounded-lg transition-all cursor-pointer"
                        title="Scroll Left"
                    >
                        <ChevronLeft size={15} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-zinc-400 hover:text-cyan-400 rounded-lg transition-all cursor-pointer"
                        title="Scroll Right"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* Scroll/Drag Track */}
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing py-2 select-none -mx-4 px-4"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                {certs.map((cert, idx) => (
                    <div key={cert.id} className="w-[220px] md:w-[250px] flex-shrink-0">
                        <CertificateCard
                            cert={cert}
                            idx={idx}
                            isPowered={isPowered}
                            onClick={() => handleCardClick(cert)}
                        />
                    </div>
                ))}
                {/* Trailing spacer so last card doesn't flush to edge */}
                <div className="w-4 flex-shrink-0" />
            </div>
        </div>
    );
};

export const CertificationsBlock: React.FC<CertificationsBlockProps> = ({ isPowered }) => {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    const professionalCerts = React.useMemo(() => CERTS.filter(c => c.type === 'Professional'), []);
    const internshipCerts = React.useMemo(() => CERTS.filter(c => c.type === 'Internship'), []);
    const courseCerts = React.useMemo(() => CERTS.filter(c => (c.type || 'Course') === 'Course'), []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Main Section Header */}
            <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-6">
                <div>
                    <h2
                        className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        CREDENTIALS & VERIFICATIONS
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base font-mono">
                        Industry Recognized Specializations, Industrial Internships & Technical Certifications
                    </p>
                </div>
            </div>

            {/* Subsection 1: Professional Certifications */}
            <CredentialRow
                title="Professional Certifications"
                badgeLabel="Specialization"
                badgeCount={professionalCerts.length}
                certs={professionalCerts}
                isPowered={isPowered}
                onSelectCert={setSelectedCert}
                direction="normal"
            />

            {/* Subsection 2: Industrial Internships */}
            <CredentialRow
                title="Industrial Internships"
                badgeLabel="Hands-on Industry"
                badgeCount={internshipCerts.length}
                certs={internshipCerts}
                isPowered={isPowered}
                onSelectCert={setSelectedCert}
                direction="reverse"
            />

            {/* Subsection 3: Technical Course Certifications */}
            <CredentialRow
                title="Technical Course Certifications"
                badgeLabel="Coursework"
                badgeCount={courseCerts.length}
                certs={courseCerts}
                isPowered={isPowered}
                onSelectCert={setSelectedCert}
                direction="normal"
            />

            <AnimatePresence>
                {selectedCert && (
                    <GalleryModal cert={selectedCert} onClose={() => setSelectedCert(null)} isPowered={isPowered} />
                )}
            </AnimatePresence>
        </div>
    );
};

const getIssuerLogos = (issuer: string): string[] => {
    const logos: string[] = [];
    if (issuer.includes('MathWorks')) logos.push('/assets/issuers/mathworks.png');
    if (issuer.includes('Google')) logos.push('/assets/issuers/google.png');
    if (issuer.includes('Microsoft')) logos.push('/assets/issuers/microsoft.png');
    if (issuer.includes('GitHub')) logos.push('/assets/issuers/github.png');
    if (issuer.includes('Coursera')) logos.push('/assets/issuers/coursera.png');
    if (issuer.includes('LinkedIn')) logos.push('/assets/issuers/linkedin.png');
    if (issuer.includes('Cisco')) logos.push('/assets/issuers/cisco.png');
    if (issuer.includes('Coromandel')) logos.push('/assets/issuers/coromandel.png');
    if (issuer.includes('Siemens')) logos.push('/assets/issuers/siemens.png');
    if (issuer.includes('IBM')) logos.push('/assets/issuers/ibm.png');
    if (issuer.includes('NPTEL')) logos.push('/assets/issuers/nptel.png');
    if (issuer.includes('DIY') || issuer.includes('DIYguru') || issuer.includes('DIY Guru')) logos.push('/assets/issuers/diyguru.png');
    if (issuer.includes('Aigen') || issuer.includes('Aigen Labs')) logos.push('/assets/issuers/aigenlabs.png');
    if (issuer.includes('Skill Dzire') || issuer.includes('SkillDzire')) logos.push('/assets/issuers/skilldzire.png');
    if (issuer.includes('ISTE')) logos.push('/assets/issuers/iste.png');
    if (issuer.includes('Datavalley')) logos.push('/assets/issuers/datavalley.png');
    if (issuer.includes('Chefronics')) logos.push('/assets/issuers/chefronics.png');
    if (issuer.includes('Michigan')) logos.push('/assets/issuers/umichigan.png');
    if (issuer.includes('Irvine') || issuer.includes('UC Irvine')) logos.push('/assets/issuers/ucirvine.png');
    return logos;
};

const CertificateCard: React.FC<{ cert: Certification; idx: number; isPowered: boolean; onClick: () => void }> = ({ cert, idx, isPowered, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchMoved = useRef(false);

    // Reset loaded state when active cert changes
    useEffect(() => {
        setIsLoaded(false);
    }, [cert.id]);

    const previewImage = cert.image?.endsWith('.pdf')
        ? cert.image.slice(0, -4) + '.png'
        : cert.image;

    const issuerLogos = getIssuerLogos(cert.issuer);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchMoved.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
        const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
        if (dx > 8 || dy > 8) touchMoved.current = true;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchMoved.current) {
            e.preventDefault(); // suppress synthetic click after scroll
            return;
        }
        onClick();
    };

    return (
        <div
            className="group h-full transition-transform duration-300 hover:-translate-y-1.5"
            onClick={onClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <GlareHover
                width="100%"
                height="100%"
                background={isPowered ? '#070708' : '#121212'}
                borderRadius="0.75rem"
                borderColor={isPowered ? (cert.isVerifiedBadge ? 'rgba(6,182,212,0.3)' : '#18181b') : '#1e1e1e'}
                glareColor={isPowered ? '#00f2ff' : '#222222'}
                glareOpacity={isPowered ? 0.12 : 0.05}
                glareSize={200}
                className={`relative p-4 transition-all duration-300 overflow-hidden h-full flex flex-col justify-between cursor-pointer border min-h-[290px]
                    ${isPowered && cert.isVerifiedBadge ? 'shadow-[0_0_15px_rgba(6,182,212,0.03)] border-cyan-500/25' : ''}
                    ${!isPowered ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
            >
                {/* Translucent Watermark Year */}
                <div
                    className="absolute right-3 bottom-1 text-7xl font-black font-mono select-none tracking-tighter pointer-events-none opacity-[0.02] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.05]"
                    style={{ color: isPowered ? '#ffffff' : '#444444' }}
                >
                    {cert.year}
                </div>

                <div className="w-full relative z-10 flex flex-col h-full justify-between gap-3">
                    <div className="flex flex-col gap-3">
                        {/* Preview Container with compact aspect ratio */}
                        <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-zinc-900 bg-black flex items-center justify-center relative group-hover:border-cyan-500/30 transition-colors">
                            {/* Loading Shimmer / Spinner */}
                            {!isLoaded && previewImage && (
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/50 to-zinc-950 animate-pulse flex items-center justify-center z-10">
                                    <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
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
                                    <Award size={20} className="opacity-30" />
                                    <span className="text-[8px] mt-1 font-mono">NO IMAGE PREVIEW</span>
                                </div>
                            )}
                        </div>

                        {/* Header Row: Issuer Logos and verified badge */}
                        <div className="flex justify-between items-center gap-2 min-h-[30px]">
                            <div className="flex items-center gap-2">
                                {issuerLogos.length > 0 ? (
                                    <div className="flex items-center gap-2 h-7 px-0.5">
                                        {issuerLogos.map((logo, i) => (
                                            <img
                                                key={i}
                                                src={logo}
                                                alt={cert.issuer}
                                                className="h-5 md:h-6 w-auto max-w-[90px] object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        className={`p-1.5 rounded-lg border transition-all duration-300
                                            ${isPowered
                                                ? 'bg-cyan-950/20 border-cyan-900/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.08)]'
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                                            }`}
                                    >
                                        <cert.icon size={16} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>

                            {isPowered && cert.isVerifiedBadge ? (
                                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                                    <ShieldCheck size={12} strokeWidth={2} className="text-cyan-400" />
                                    <span>VERIFIED</span>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded border
                                    ${isPowered
                                        ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                                        : 'bg-zinc-100 border-zinc-300 text-zinc-700'
                                    }`}
                                >
                                    <Award size={12} strokeWidth={2} className="text-zinc-400" />
                                    <span>CREDENTIAL</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div>
                            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 border rounded uppercase mb-1 inline-block
                                ${isPowered
                                    ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
                                    : 'text-zinc-700 border-zinc-300 bg-zinc-100'
                                }`}
                            >
                                {cert.category || 'Engineering'}
                            </span>
                            <h4 className={`text-sm md:text-base font-bold tracking-tight leading-snug mb-0.5 line-clamp-2 ${isPowered ? 'text-white' : 'text-zinc-900'}`}>
                                {cert.title}
                            </h4>
                            <p className={`text-xs font-mono uppercase tracking-wider ${isPowered ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                {cert.issuer}
                            </p>
                        </div>
                    </div>

                    <div>
                        {/* Gained Skills Preview */}
                        <div className="mt-1.5 flex flex-wrap gap-1 relative z-10">
                            {cert.skills?.slice(0, 2).map((skill, index) => (
                                <span key={index} className="text-[11px] px-2 py-0.5 bg-black/60 border border-zinc-800 rounded text-zinc-300 font-mono">
                                    {skill}
                                </span>
                            )) || (
                                    <span className="text-[11px] px-2 py-0.5 bg-black/60 border border-zinc-800 rounded text-zinc-300 font-mono">
                                        Engineering
                                    </span>
                                )}
                            {cert.skills && cert.skills.length > 2 && (
                                <span className="text-[11px] px-1.5 py-0.5 text-cyan-400/80 font-mono font-semibold">
                                    +{cert.skills.length - 2} more
                                </span>
                            )}
                        </div>

                        {/* View Credential CTA Link */}
                        <div
                            className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 mt-2.5 relative z-10
                                ${isPowered
                                    ? 'text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1'
                                    : 'text-zinc-700'
                                }`}
                        >
                            <span>View Credential</span>
                            <ChevronRight size={13} strokeWidth={3} />
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

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const mainSrc = cert.gallery ? cert.gallery[activeImageIndex] : cert.image;
    const modalIssuerLogos = getIssuerLogos(cert.issuer);
    const hasMultiple = cert.gallery && cert.gallery.length > 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 md:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-6xl rounded-2xl border shadow-2xl flex flex-col
                    overflow-y-auto max-h-[95vh]
                    md:overflow-hidden md:h-[min(95vh,900px)]
                    ${isPowered ? 'bg-[#09090b] border-zinc-800' : 'bg-white border-gray-200'}
                `}
            >
                {/* ── Header bar ── */}
                <div className={`flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b
                    ${isPowered ? 'border-zinc-800 bg-zinc-950/80' : 'border-gray-100 bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {modalIssuerLogos.length > 0 && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {modalIssuerLogos.map((logo, i) => (
                                    <img
                                        key={i}
                                        src={logo}
                                        alt={cert.issuer}
                                        className="h-7 w-auto max-w-[90px] object-contain opacity-95 drop-shadow"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className={`text-sm md:text-base font-black tracking-tight truncate ${isPowered ? 'text-white' : 'text-gray-900'}`}>
                                {cert.title}
                            </h3>
                            <p className={`text-[11px] font-mono uppercase tracking-widest truncate ${isPowered ? 'text-cyan-400' : 'text-blue-600'}`}>
                                {cert.issuer} · {cert.year}
                                {cert.credentialId && <span className="ml-2 opacity-60">#{cert.credentialId}</span>}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {mainSrc && mainSrc.endsWith('.pdf') && (
                            <a
                                href={mainSrc}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-mono font-bold transition-all shadow-[0_0_8px_rgba(0,242,255,0.15)]"
                                title="Open / Download Full PDF Document"
                            >
                                <FileText size={13} />
                                <span className="hidden sm:inline">FULL PDF</span>
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className={`flex-shrink-0 p-2 rounded-full transition-colors cursor-pointer
                                ${isPowered ? 'hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* ── Main certificate display ── */}
                {/* Mobile: content height, capped so it doesn't overflow */}
                {/* Desktop: flex-1 fills all remaining space */}
                <div className={`flex items-center justify-center overflow-hidden
                    ${isPowered ? 'bg-black' : 'bg-gray-100'}
                    md:flex-1 md:min-h-0
                `}
                >
                    {mainSrc ? (
                        mainSrc.endsWith('.mp4') ? (
                            <video
                                src={mainSrc}
                                title={`${cert.title} video demonstration — Srinivasa Manikanta Rajapantula`}
                                aria-label={`${cert.title} video demonstration by Srinivasa Manikanta`}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="max-w-full max-h-[70vw] md:w-full md:h-full md:max-h-none object-contain"
                            />
                        ) : mainSrc.endsWith('.pdf') ? (
                            <iframe
                                src={`${mainSrc}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                title={`${cert.title} - Official Verification PDF — Srinivasa Manikanta`}
                                className="w-full border-0"
                                style={{ height: 'clamp(260px, 65vw, 100%)' }}
                            />
                        ) : (
                            <img
                                src={mainSrc}
                                alt={`${cert.title} - ${cert.issuer} Engineering Certificate — Srinivasa Manikanta`}
                                title={`${cert.title} (${cert.issuer})`}
                                loading="lazy"
                                decoding="async"
                                className="max-w-full max-h-[70vw] md:w-full md:h-full md:max-h-none object-contain"
                            />
                        )
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center gap-2">
                            <Box size={44} className="opacity-30" />
                            <p className="font-mono text-xs">Certificate Preview Not Available</p>
                        </div>
                    )}
                </div>

                {/* ── Thumbnail strip — only shown when multiple gallery items ── */}
                {hasMultiple && (
                    <div className={`flex-shrink-0 flex gap-2 px-4 py-2.5 border-t overflow-x-auto
                        ${isPowered ? 'border-zinc-800 bg-zinc-950/80' : 'border-gray-100 bg-gray-50'}`}
                    >
                        {cert.gallery!.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`w-16 h-11 rounded overflow-hidden border flex-shrink-0 transition-all duration-200 cursor-pointer
                                    ${activeImageIndex === i
                                        ? 'border-cyan-500 scale-105 opacity-100 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                                        : isPowered
                                            ? 'border-zinc-800 opacity-50 hover:opacity-80 hover:border-zinc-600'
                                            : 'border-gray-300 opacity-60 hover:opacity-100'
                                    }`}
                            >
                                {src.endsWith('.mp4') ? (
                                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-cyan-500 text-[9px] font-bold font-mono">▶ VID</div>
                                ) : src.endsWith('.pdf') ? (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-red-400 text-[9px] font-bold font-mono">PDF</div>
                                ) : (
                                    <img
                                        src={src}
                                        className="w-full h-full object-cover"
                                        alt={`${cert.title} gallery thumbnail ${i + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

