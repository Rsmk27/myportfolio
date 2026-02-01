import { Project, Skill, Profile, Experience, Education } from './types';
import { Zap, Cpu, Radio, BatteryMedium, Layers, ShieldCheck, Database, Code, Activity, Globe } from 'lucide-react';

export const PROFILE: Profile = {
  name: "Srinivasa Manikanta",
  title: "EEE Student | Embedded Systems | IoT | Smart Energy",
  tagline: "Electrical & Electronics Engineering Student focused on Embedded Systems, IoT, and Smart Energy Solutions",
  heroSubtitle: "Building intelligent systems with a practical engineering mindset and sustainability-driven problem solving.",
  bio: "Background in Electrical & Electronics Engineering with a hands-on interest in embedded systems and IoT. Focused on smart energy, automation, and real-world engineering applications. Motivated to build scalable, sustainable, and intelligent systems.",
  location: "Vishakhapatnam, IN_NODE",
  email: "srinivasmanikantarajapantula@gmail.com",
  socials: [
    { platform: 'github', url: 'https://github.com/Rsmk27' },
    { platform: 'linkedin', url: 'https://in.linkedin.com/in/rsmk27' },
    { platform: 'telegram', url: 'https://t.me/RSMK_27' },
    { platform: 'instagram', url: 'https://instagram.com/rsmk_27' },
    { platform: 'x', url: 'https://x.com/SrinivasManik20' },
    { platform: 'email', url: 'mailto:srinivasmanikantarajapantula@gmail.com' }
  ],
  image: '/assets/srinivasa-manikanta-profile.webp'
};

export const EXPERIENCE: Experience[] = [
  {
    id: 'exp1',
    role: "Electrical Engineering Intern",
    company: "Coromandel Int. Ltd",
    duration: "NOV 2023 - MAY 2024",
    description: [
      "Analyzed thermodynamic cycles and turbine efficiency for steam power generation.",
      "Maintained 11kV/440V transformers and industrial distribution networks.",
      "Performed insulation resistance testing on three-phase induction motors.",
      "Implemented ISO 50001 energy management protocols in high-risk environments."
    ],
    tech: ["Power Systems", "Transformers", "ISO 50001", "Thermodynamics"]
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'edu1',
    degree: "B.Tech, Electrical & Electronics",
    institution: "Institute_of_Technology", // Placeholder as college wasn't explicitly found
    year: "2024 - PRESENT"
  },
  {
    id: 'edu2',
    degree: "Diploma, Electrical & Electronics",
    institution: "Polytechnic_College",
    year: "2021 - 2024"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'ColorOhm - Resistor Calculator',
    description: 'A precision tool for decoding resistor color bands. Visual resistor color code calculator supporting 4 & 5 band standards with zero latency.',
    tech: ['JavaScript', 'CSS3 Variables', 'DOM Manipulation', 'Practical EEE utility'],
    image: '/assets/color-ohm-resistor-calculator-tool.webp',
    link: 'https://colorohm.rsmk.me'
  },
  {
    id: 'p2',
    title: 'Solar Squad (SPDS)',
    description: 'Solar-Powered Dewatering System. Concept project replacing diesel-based dewatering with solar energy.',
    tech: ['Solar PV', 'Arduino', 'Power Electronics', 'Sensors'],
    image: '/assets/ai-chatbot-interface-background.webp',
    link: 'https://spds.rsmk.me'
  },
  {
    id: 'p3',
    title: 'Embedded & IoT Projects',
    description: 'Collection of Arduino, sensor-based, and automation projects. Focus on Control systems, monitoring, and smart applications.',
    tech: ['Arduino', 'C++', 'IoT', 'Automation', 'Sensors'],
    image: '/assets/smart-exhaust-gas-detection-system.webp', // Using existing matching image
    link: 'https://its.rsmk.me'
  },
  {
    id: 'p4',
    title: 'GridForge',
    description: 'Full-stack power system simulation platform. Bridges MATLAB computation with web interactivity.',
    tech: ['MATLAB API', 'Python (Flask)', 'React', 'Power Systems'],
    image: '/assets/gridforge-power-system-simulation.webp',
    details: "GridForge is a comprehensive power system simulation platform that bridges the gap between complex MATLAB computations and accessible web interfaces. It allows engineers and students to simulate power grids, analyze load flow, and visualize results in real-time without needing local MATLAB installations. The system uses a Python Flask backend to interface with the MATLAB engine, processing simulation requests and returning data to a modern React frontend.",
    features: [
      "Real-time Power Flow Analysis via Web Interface",
      "MATLAB Integration for High-Precision Computation",
      "Interactive Graph & Network Visualizations",
      "Scenario Management & Historical Data Tracking"
    ],
    gallery: [
      '/assets/gridforge/web-dashboard-interface.png',
      '/assets/gridforge/matlab-simulation-model.png',
      '/assets/gridforge/simulation-results.png',
      '/assets/gridforge/backend-api-code.png'
    ]
  },
  {
    id: 'p5',
    title: 'Budget Buddy',
    description: 'Fintech expense tracker with real-time visualization and Google Auth integration.',
    tech: ['React', 'Firebase', 'Chart.js', 'Google OAuth'],
    image: '/assets/budget-buddy-expense-tracker-app.webp'
  }
];

export const SKILLS: Skill[] = [
  { name: 'Embedded Systems', type: 'ic', level: 90 },
  { name: 'Power Systems', type: 'capacitor', level: 85 },
  { name: 'IoT / ESP8266', type: 'ic', level: 88 },
  { name: 'React / JS', type: 'resistor', level: 80 },
  { name: 'C / C++', type: 'diode', level: 85 },
  { name: 'MATLAB / Python', type: 'ic', level: 82 },
  { name: 'PLC / SCADA', type: 'capacitor', level: 75 },
  { name: 'PCB Design', type: 'resistor', level: 78 }
];

export const PCB_COLORS = {
  bg: '#0a0a0a',
  cyan: '#00f2ff',
  lime: '#39ff14',
  trace: '#1a1a1a',
  dim: '#0d2b2d'
};
