import { Project, Profile, Experience, Education } from './types';

export const PROFILE: Profile = {
  name: "Srinivasa Manikanta Rajapantula",
  title: "EEE Student | Embedded Systems | IoT | Smart Energy",
  tagline: "Electrical & Electronics Engineering Student focused on Embedded Systems, IoT, and Smart Energy Solutions",
  heroSubtitle: "Building intelligent systems with a practical engineering mindset and sustainability-driven problem solving.",
  bio: "Electrical & Electronics Engineer focused on the intersection of physical circuitry and cloud infrastructure. I design and build real-time embedded firmware, low-latency IoT systems, and smart grid simulators. From programming ESP32 state-machines for hazard safety devices to maintaining 11kV distribution networks at industrial chemical plants, I convert rigorous hardware engineering into reliable, deployed software systems. Explore my work across hardware, firmware, and Web-based [engineering tool models](#projects).",
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
    institution: "Andhra Loyola Institute of Engineering and Technology",
    year: "2024 – Present"
  },
  {
    id: 'edu2',
    degree: "Diploma, Electrical & Electronics",
    institution: "Government Polytechnic Srikakulam",
    year: "2021 – 2024"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'SFMD – Firefighter Safety Monitoring Wearable IoT Device',
    description: "An ESP32-based wearable IoT device for firefighter safety monitoring with gas detection, fall detection, GPS tracking, and a real-time Firebase dashboard. Winner, A-HACKS 2026 Hardware Category.",
    tech: ['ESP32', 'C++', 'Firebase RTDB', 'React', 'Vite', 'MPU-6050', 'DHT11', 'Neo-6M GPS'],
    image: '/assets/firefighter-monitoring-device.webp',
    link: 'https://sfmd.rsmk.co.in/',
    details: "Designed for harsh thermal and physical environments, this wearable safety system runs custom C++ state-machine firmware on an ESP32. By reading real-time telemetry from an MPU-6050 accelerometer (detecting man-down state) and a DHT11 sensor (monitoring heat thresholds), the module automatically logs GPS coordinates and pushes alerts via secure WebSocket routes to a Firebase RTDB dashboard. Developed for emergency incident commanders to track personnel positioning and vital safety alerts without latency. You can view the live assembly layout and team presentation photos in the [Gallery Dome](/gallery).",
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
    award: '🥈 Hackathon Winner',
    awards: ['🥈 Winner, A-HACKS 2026 Hardware Category', '🏆 Departmental 1st Prize'],
    keywords: 'firefighter monitoring system india, iot wearable for safety, esp32 wearable device'
  },
  {
    id: 'p2',
    title: 'ColorOhm – Resistor Color Code Calculator App',
    description: 'A free Android resistor color code calculator supporting 4-band and 5-band resistors, SMD codes, history, and favorites. The easiest color ohm app for electronics students in India.',
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
    awards: ['📱 Android App', '🌐 Website'],
    keywords: 'resistor color code calculator, 4 band resistor calculator, color ohm app india'
  },
  {
    id: 'p3',
    title: 'Automatic Exhaust Fan – Smart Ventilation with MQ-2 Gas Sensor',
    description: 'An Arduino-based smart ventilation system using MQ-2 gas sensor for automatic exhaust fan control. Detects harmful gas concentrations and activates ventilation automatically.',
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
    awards: ['⚙️ Hardware Model', '🌐 Web Demo'],
    keywords: 'automatic exhaust fan arduino, smart ventilation system india, mq-2 gas sensor project'
  },
  {
    id: 'p4',
    title: 'SPDS – Solar Powered Dewatering System India',
    description: 'A PM-KUSUM aligned solar-powered dewatering system for solar irrigation in India, eliminating grid dependency for agricultural water pumping.',
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
    awards: ['📐 SIH Project — College Level', '⚙️ Prototype'],
    keywords: 'solar dewatering system india, solar irrigation india, pm-kusum solar pump'
  },
  {
    id: 'p5',
    title: 'Single-Axis Solar Tracker – LDR Solar Tracker with Arduino',
    description: 'An LDR-based single axis solar tracker built with Arduino that maximizes solar panel efficiency by auto-aligning with sunlight. Includes efficiency comparison data.',
    tech: ['LDR', 'Relay Logic', 'Gear Motor', 'Comparator Circuit'],
    image: '/assets/single-axis-solar-tracker.png',
    details: "An elegant, microcontroller-free Single Axis Solar Tracker driven entirely by a custom-designed analog comparator loop. Utilizing two light-dependent resistors (LDRs) in a differential divider bridge, the circuit detects shifts in solar angle. A transistor-driven dual-relay comparator network operates as a hardware H-bridge, reversing polarities to actuate a 12V high-torque gear motor toward the maximum luminous intensity. By bypassing a power-hungry digital microcontroller, this robust system achieves a ~30% increase in PV energy yield while minimizing standby power consumption.",
    features: [
      "Pure relay logic — no microcontroller required",
      "Dual LDR differential sensing for sun position detection",
      "Gear motor actuation for smooth panel rotation",
      "~30% efficiency gain over fixed-panel installation",
      "Fully analog control circuit — low cost & robust"
    ],
    award: '⚡ Analog Control',
    awards: ['⚡ Analog Control', '⚙️ Hardware Prototype'],
    keywords: 'single axis solar tracker, solar panel tracking system, ldr solar tracker arduino'
  },
  {
    id: 'p6',
    title: 'GridForge – Smart Energy Management System',
    description: 'A MATLAB-based smart grid simulation platform for industrial energy monitoring and ISO 50001 energy management — targeted at EEE smart energy systems research.',
    tech: ['MATLAB', 'Simulink', 'Smart Grid', 'ISO 50001'],
    image: '/assets/automated-street-light-system.webp',
    details: "A MATLAB-based smart grid simulation platform for industrial energy monitoring and ISO 50001 energy management. Built to simulate high-voltage power networks, load shedding dynamics, and smart energy optimization algorithms, supporting advanced research into renewable energy integration.",
    features: [
      "MATLAB-based load-flow and power system simulation",
      "ISO 50001 industrial energy management logic integration",
      "Real-time load-shedding and distribution grid scenarios",
      "Designed for EEE smart energy systems research"
    ],
    award: '📊 MATLAB Model',
    awards: ['📊 Simulation Model', '🔋 Smart Grid'],
    keywords: 'smart energy management, industrial energy monitoring india, smart energy systems eee'
  },
  {
    id: 'p7',
    title: 'AgriRover – Agricultural Robot with ESP32',
    description: 'A web-controlled IoT farming robot built on ESP32 with live video streaming, soil sensors, GPS, and Firebase real-time control. Designed for precision agriculture in India.',
    tech: ['ESP32', 'ESP32-CAM', 'React 19', 'Vite', 'Firebase RTDB', 'Groq API (Llama 3.3)', 'Leaflet Maps', 'Recharts', 'C++'],
    image: '/assets/agri-rover-project.webp',
    link: 'https://github.com/Rsmk27/multi-rover',
    details: 'Agro-Rover is a full-stack IoT agricultural robot system. A dual ESP32 setup handles all hardware — the main ESP32 DevKit v1 manages rover movement (L298N motor driver), a relay-controlled water/fertilizer pump, a Neo-6M GPS module for real-time location, a soil moisture sensor, and two servos for camera pan and sensor arm actuation. A separate AI-Thinker ESP32-CAM streams a live MJPEG video feed. All data flows through Firebase Realtime Database to a React 19 + Vite web dashboard with Leaflet map integration and Recharts sensor graphs. An integrated AgriChatbot powered by Groq\'s Llama 3.3 model provides crop advice and plant disease identification from images.',
    features: [
      'Remote rover control via web UI or Arrow Keys with Space to stop',
      'Live MJPEG video streaming from onboard ESP32-CAM',
      'Real-time GPS tracking on an interactive Leaflet map',
      'Soil moisture sensing with auto-pump trigger at configurable threshold',
      'Automated water/fertilizer spraying via relay-controlled pump',
      'AI-powered AgriChatbot (Groq Llama 3.3) for crop advice & disease ID',
      'Return-to-Base autonomous navigation via Home command',
      'Dual ESP32 architecture — main logic + dedicated CAM module'
    ],
    gallery: [
      '/assets/agri-rover-project.webp'
    ],
    award: '🤖 IoT Robot',
    awards: ['🤖 IoT Robot', '🌿 AgriAI', '📡 Dual ESP32'],
    keywords: 'iot farming robot, agri rover esp32, agricultural robot india'
  }
];

export const PCB_COLORS = {
  bg: '#0a0a0a',
  cyan: '#00f2ff',
  trace: '#1a1a1a',
  dim: '#0d2b2d'
};
