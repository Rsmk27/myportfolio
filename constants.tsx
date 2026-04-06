import { Project, Skill, Profile, Experience, Education } from './types';
import { Zap, Cpu, Radio, BatteryMedium, Layers, ShieldCheck, Database, Code, Activity, Globe } from 'lucide-react';

export const PROFILE: Profile = {
  name: "Srinivasa Manikanta",
  title: "EEE Student | Embedded Systems | IoT | Smart Energy",
  tagline: "Electrical & Electronics Engineering Student focused on Embedded Systems, IoT, and Smart Energy Solutions",
  heroSubtitle: "Building intelligent systems with a practical engineering mindset and sustainability-driven problem solving.",
  bio: "Background in Electrical & Electronics Engineering with a hands-on interest in embedded systems and IoT. Focused on smart energy, automation, and real-world engineering applications. Motivated to build scalable, sustainable, and intelligent systems.",
  location: "Srikakulam, Andhra Pradesh, India",
  email: "srinivasmanikantarajapantula@gmail.com",
  socials: [
    { platform: 'github', url: 'https://github.com/Rsmk27' },
    { platform: 'linkedin', url: 'https://in.linkedin.com/in/rsmk27' },
    { platform: 'telegram', url: 'https://t.me/RSMK_27' },
    { platform: 'instagram', url: 'https://instagram.com/rsmk_27' },
    { platform: 'x', url: 'https://x.com/SrinivasManik20' },
    { platform: 'email', url: 'mailto:srinivasmanikantarajapantula@gmail.com' }
  ],
  image: '/assets/srinivasa-manikanta-profile.webp',
  resume: '/assets/resume.pdf'
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
    tech: ["Power Systems", "Transformers", "ISO 50001", "Thermodynamics"],
    gallery: [
      '/assets/experience/coromandel/single-line-diagram.jpg',
      '/assets/experience/coromandel/site-photo.jpg',
      '/assets/experience/coromandel/internship-certificate.jpg',
      '/assets/experience/coromandel/training-site.jpg'
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'edu1',
    degree: "B.Tech, Electrical & Electronics",
    institution: "College of Engineering",
    year: "2024 - PRESENT"
  },
  {
    id: 'edu2',
    degree: "Diploma, Electrical & Electronics",
    institution: "State Polytechnic College",
    year: "2021 - 2024"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Firefighter Safety Device',
    description: "An IoT-based wearable safety device that continuously monitors a firefighter's physical condition, movement, and location in real time, presenting data on a centralized web dashboard for commanders.",
    tech: ['ESP32', 'C++', 'Firebase RTDB', 'React', 'Vite', 'MPU-6050', 'DHT11', 'Neo-6M GPS'],
    image: '/assets/firefighter-monitoring-device.webp',
    link: 'https://sfmd.rsmk.co.in/',
    details: "The Firefighter Safety Device is a real-time IoT safety solution for firefighters. A wearable device worn by the firefighter collects sensor data (motion, temperature, GPS location) and transmits it over Wi-Fi to a Firebase backend. A web dashboard hosted by fire commanders provides instant situational awareness, showing the firefighter's current status, location on a live map, environmental data, and a history of all alerts and events. The firmware operates as a state machine handling STARTUP, NORMAL, WARNING, EMERGENCY, and SOS states based on sensor logic and time elapsed without movement.",
    features: [
      "Automatic Emergency Detection — no movement (man-down) & high temperature",
      "Manual SOS button for immediate distress signaling overriding other states",
      "Live GPS tracking on an interactive MapLibre GL map with trail history",
      "Color-coded status indicators with voice alerts on the dashboard",
      "Historical data and analytics (temperature trend, movement timeline, status distribution)",
      "Local alerts (Buzzer & LED) that continue functioning even when Wi-Fi is lost",
      "State-machine based firmware for robust alerting and movement detection logic",
      "Secure HTTPS data transmission to Firebase Realtime Database and Firestore"
    ],
    gallery: [
      '/assets/firefighter-monitoring-device.webp',
      '/assets/firefighter-monitoring-device/infographic-poster.jpg',
      '/assets/firefighter-monitoring-device/hand-drawn-poster.jpg',
      '/assets/firefighter-monitoring-device/device-demo-1.jpg',
      '/assets/firefighter-monitoring-device/device-demo-2.jpg',
      '/assets/firefighter-monitoring-device/dashboard.png',
      '/assets/firefighter-monitoring-device/departmental-first-1.jpg',
      '/assets/firefighter-monitoring-device/departmental-first-2.jpg',
      '/assets/firefighter-monitoring-device/departmental-first-3.jpg',
      '/assets/firefighter-monitoring-device/departmental-first-4.jpg',
      '/assets/firefighter-monitoring-device/departmental-first-5.jpg'
    ],
    award: '🥈 Hackathon Winning Project',
    awards: ['🥈 Hackathon Winning Project', '🏆 Departmental 1st Prize']
  },
  {
    id: 'p2',
    title: 'ColorOhm',
    description: 'A precision resistor color code calculator published as an Android app and web tool. Supports 4 & 5 band standards with zero latency decoding — a practical EEE utility.',
    tech: ['React Native', 'Expo', 'JavaScript', 'CSS3'],
    image: '/assets/color-ohm-resistor-calculator-tool.webp',
    link: 'https://colorohm.rsmk.me/',
    details: "ColorOhm is a precision resistor color band decoder available as both an Android app (published, GitHub v1.0.0) and a web tool. It supports 4-band and 5-band resistor standards, providing instant, zero-latency decoding with a clean visual interface. Built as a practical EEE utility for students and engineers on the workbench.",
    features: [
      "4-band & 5-band resistor color code decoding",
      "Published Android app — GitHub Release v1.0.0",
      "Zero latency — instant decode on every interaction",
      "Clean, visual color band selector UI",
      "Works offline — no backend required"
    ],
    award: '📱 Android App',
    awards: ['📱 Android App', '🌐 Website']
  },
  {
    id: 'p3',
    title: 'Automatic Exhaust Fan',
    description: 'Intelligent ventilation system that automatically detects harmful gases and smoke. Features an auto-off timer and manual override for flexible, safe operation.',
    tech: ['Arduino', 'MQ-2 Sensor', 'Relay Module', 'C++'],
    image: '/assets/smart-exhaust-gas-detection-system.webp',
    link: 'https://autoexhaustfan.rsmk.co.in/',
    details: "The Automatic Exhaust Fan is an intelligent safety system designed to prevent gas-related accidents and ensure fresh air circulation. Built around an Arduino UNO and MQ-2 Gas/Smoke sensor, it continuously monitors air quality. Upon detecting hazardous levels of smoke or gas, the system automatically triggers a 5V relay to switch on a high-power exhaust fan, effectively ventilating the space. Includes an auto-off timer and manual override switch for user control.",
    features: [
      "Automatic Detection of Smoke & Gas via MQ-2 sensor",
      "Instant Response via Relay Actuation",
      "Auto-off Timer — fan shuts off automatically after clearance",
      "Manual Override Switch for forced on/off control",
      "Energy Efficient Operation"
    ],
    gallery: [
      '/assets/auto-exhaust-fan/demo-video.mp4',
      '/assets/smart-exhaust-gas-detection-system.webp',
      '/assets/auto-exhaust-fan/image-1.jpg',
      '/assets/auto-exhaust-fan/image-2.jpg',
      '/assets/auto-exhaust-fan/image-3.jpg'
    ],
    award: '⚙️ Hardware Model',
    awards: ['⚙️ Hardware Model', '🌐 Web Demo']
  },
  {
    id: 'p4',
    title: 'Solar-Powered Dewatering System',
    description: 'SIH project replacing diesel-based agricultural dewatering with solar energy. Arduino-controlled system with soil moisture sensing and LDR-based solar tracking.',
    tech: ['Arduino', 'LDR', 'Soil Moisture Sensor', 'Solar PV', 'Relay', 'C++'],
    image: '/assets/ai-chatbot-interface-background.webp',
    link: 'https://spds.rsmk.me/',
    details: "The Solar-Powered Dewatering System (SPDS) is a college-level SIH prototype that replaces diesel-powered pump systems with a solar-driven alternative. An Arduino controller reads soil moisture to determine irrigation need and uses LDR sensors for basic solar panel orientation. A relay switches the pump on when both conditions are met: sufficient sunlight and dry soil. A working prototype was built and demonstrated at the college level.",
    features: [
      "Solar-powered pump — zero fuel cost operation",
      "Soil moisture sensing — pumps only when soil is dry",
      "LDR-based light detection for daytime operation logic",
      "Relay-controlled pump switching",
      "Prototype built and demonstrated at college level",
      "SIH (Smart India Hackathon) project"
    ],
    award: '📐 SIH Project',
    awards: ['📐 SIH Project — College Level', '⚙️ Prototype']
  },
  {
    id: 'p5',
    title: 'Single Axis Solar Tracker',
    description: 'A relay-logic solar panel tracker using LDR sensors to follow sunlight across a single axis with a gear motor. Achieves ~30% efficiency gain over fixed panels — no microcontroller required.',
    tech: ['LDR', 'Relay Logic', 'Gear Motor', 'Comparator Circuit'],
    image: '/assets/single-axis-solar-tracker.png',
    details: "The Single Axis Solar Tracker is a hardware-only project that uses a pure relay-logic comparator circuit to track the sun across a horizontal axis. Two LDR (Light Dependent Resistor) sensors are placed on either side of the solar panel. The differential resistance between the LDRs drives a relay circuit that activates a gear motor, rotating the panel toward the brighter side. No microcontroller is needed — the entire control loop is analog. Achieves approximately 30% better energy capture compared to a fixed-angle panel.",
    features: [
      "Pure relay logic — no microcontroller required",
      "Dual LDR differential sensing for sun position detection",
      "Gear motor actuation for smooth panel rotation",
      "~30% efficiency gain over fixed-panel installation",
      "Fully analog control circuit — low cost & robust"
    ],
    award: '⚡ Analog Control',
    awards: ['⚡ Analog Control', '⚙️ Hardware Prototype']
  },
  {
    id: 'p6',
    title: 'Automatic Streetlight System',
    description: 'A fully solar-powered automatic streetlight that switches on at dusk and off at dawn using IC 555 timer and LDR sensing. Built as a working mini-model prototype.',
    tech: ['IC 555', 'LDR', 'Solar Panel', 'Relay', 'LED'],
    image: '/assets/automated-street-light-system.webp',
    details: "The Automatic Streetlight System is a self-contained, fully solar-powered lighting solution. A 555 timer IC in monostable/bistable configuration reads the LDR output — at dusk when ambient light drops below a threshold, the circuit triggers a relay to switch on the street LED. At dawn, rising light levels restore the LDR resistance and cut the relay. The solar panel charges a battery during the day for night-time operation. Built as a working mini-model prototype.",
    features: [
      "Fully solar powered — charges battery during daylight",
      "IC 555 timer-based automatic switching circuit",
      "LDR threshold detection for dusk/dawn triggering",
      "Relay-controlled LED output",
      "Working mini-model prototype built and demonstrated",
      "Zero manual intervention once set up"
    ],
    award: '💡 Working Prototype',
    awards: ['💡 Working Prototype', '🔋 Clean Energy']
  }
];

export const SKILLS: Skill[] = [
  // Embedded Systems & Hardware
  { name: 'ESP32', type: 'ic', level: 0 },
  { name: 'ESP8266', type: 'ic', level: 0 },
  { name: 'Arduino', type: 'ic', level: 0 },
  { name: 'UART / I2C / SPI', type: 'ic', level: 0 },
  { name: 'MQTT', type: 'ic', level: 0 },
  { name: 'Sensors & Actuators', type: 'ic', level: 0 },
  // IoT
  { name: 'IoT System Design', type: 'ic', level: 0 },
  { name: 'Cloud Integration', type: 'ic', level: 0 },
  { name: 'Real-time Monitoring', type: 'ic', level: 0 },
  // Programming
  { name: 'C / Embedded C', type: 'diode', level: 0 },
  { name: 'Assembly', type: 'diode', level: 0 },
  { name: 'Python', type: 'diode', level: 0 },
  { name: 'MATLAB', type: 'diode', level: 0 },
  // Power Systems
  { name: 'Power Generation', type: 'capacitor', level: 0 },
  { name: 'T&D Systems', type: 'capacitor', level: 0 },
  { name: 'Smart Grid', type: 'capacitor', level: 0 },
  // Power Electronics
  { name: 'Converters / Inverters', type: 'capacitor', level: 0 },
  { name: 'PWM Control', type: 'capacitor', level: 0 },
  { name: 'Motor Drives', type: 'capacitor', level: 0 },
  // Electrical Machines
  { name: 'DC & AC Machines', type: 'resistor', level: 0 },
  { name: 'Transformers', type: 'resistor', level: 0 },
];

export const PCB_COLORS = {
  bg: '#0a0a0a',
  cyan: '#00f2ff',
  lime: '#39ff14',
  trace: '#1a1a1a',
  dim: '#0d2b2d'
};
