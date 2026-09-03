import { Project, Profile, Experience, Education } from './types';

export const PROFILE: Profile = {
  name: "Srinivasa Manikanta Rajapantula",
  title: "Electrical & Electronics Engineering Student at ALIET | Embedded Systems | Industrial Automation | IoT | Smart Energy",
  tagline: "EEE Student at ALIET focused on Embedded Systems, Industrial Automation, IoT, and Smart Energy Solutions",
  heroSubtitle: "Building intelligent physical systems, embedded firmware, and industrial control simulations with a rigorous engineering mindset.",
  bio: "I am Srinivasa Manikanta Rajapantula (RSMK), an Electrical & Electronics Engineering (EEE) student at Andhra Loyola Institute of Engineering and Technology (ALIET), Vijayawada. I specialize in Embedded Systems, Industrial Automation, Microcontrollers, IoT (Internet of Things), and Smart Energy Systems. My engineering work spans designing custom ESP32 state-machine firmware, simulating PLC control sequences in CODESYS and Factory I/O over Modbus TCP, modeling power distribution in MATLAB/Simulink, and maintaining 11kV distribution networks during industrial internship training at Coromandel International Limited. I utilize Web Development as a supporting engineering tool to build real-time monitoring dashboards, control interfaces, and calculation software for hardware systems.",
  location: "Vijayawada, Andhra Pradesh, India",
  email: "srinivasmanikantarajapantula@gmail.com",
  socials: [
    { platform: 'github', url: 'https://github.com/Rsmk27' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/srinivasamanikanta/' },
    { platform: 'telegram', url: 'https://t.me/RSMK_27' },
    { platform: 'instagram', url: 'https://www.instagram.com/rsmk.me/' },
    { platform: 'x', url: 'https://x.com/SrinivasManik20' },
    { platform: 'email', url: 'mailto:srinivasmanikantarajapantula@gmail.com' }
  ],
  image: '/assets/srinivasa-manikanta-profile.webp',
  resume: '/assets/Srinivasa_Manikanta_Resume.pdf'
};

export const EXPERIENCE: Experience[] = [
  {
    id: 'exp1',
    role: "Electrical Engineering Intern",
    company: "Coromandel Int. Ltd",
    duration: "NOV 2023 - MAY 2024",
    description: [
      "Analyzed thermodynamic cycles and turbine efficiency for industrial steam power generation.",
      "Maintained 11kV/440V transformers and industrial plant power distribution networks.",
      "Performed insulation resistance testing and diagnostic checks on three-phase induction motors.",
      "Supported implementation of ISO 50001 energy management and industrial safety protocols."
    ],
    tech: ["Power Systems", "Transformers", "Industrial Distribution", "ISO 50001", "Thermodynamics"],
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
    degree: "B.Tech, Electrical & Electronics Engineering",
    institution: "Andhra Loyola Institute of Engineering and Technology",
    year: "2024 – Present"
  },
  {
    id: 'edu2',
    degree: "Diploma, Electrical & Electronics Engineering",
    institution: "Government Polytechnic Srikakulam",
    year: "2021 – 2024"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'SFMD – Sustainable Firefighter Monitoring Device',
    description: "An ESP32-based wearable IoT safety device for firefighters featuring gas/air-quality sensing, MPU6050 fall detection, Neo-6M GPS tracking, and a real-time web dashboard.",
    tech: ['ESP32', 'Embedded C++', 'Firebase RTDB', 'React', 'MapLibre GL', 'MPU-6050', 'DHT11', 'Neo-6M GPS'],
    image: '/assets/firefighter-monitoring-device.webp',
    link: 'https://sfmd.rsmk.co.in/',
    details: "The Sustainable Firefighter Monitoring Device (SFMD) is a high-reliability wearable IoT system engineered to protect emergency response personnel in hazardous thermal environments. Built around an ESP32 microcontroller running state-machine firmware, the unit integrates an MPU-6050 6-axis motion sensor to detect firefighter collapse (man-down condition), a DHT11 sensor for ambient temperature/humidity monitoring, gas sensors for hazardous atmosphere detection, and a Neo-6M GPS module for real-time location tracking. Critical alerts trigger local buzzer/LED distress alarms while pushing low-latency telemetry to a live Firebase Realtime Database dashboard with MapLibre GL mapping. Recognitions include 2nd Place in the A-HACKS 2026 Hardware Category, Departmental 1st Prize, and technical paper presentation recognition at the IEI Student Chapter.",
    features: [
      "Automatic man-down & fall detection using MPU6050 accelerometer/gyroscope algorithms",
      "Real-time gas and ambient temperature threshold monitoring for thermal hazard alerts",
      "High-precision GPS tracking with trail history rendered on an interactive web map",
      "Manual SOS distress button providing instant override for critical emergencies",
      "Fail-safe local alarms (Buzzer & LED array) operating independently of cloud connectivity",
      "Low-latency data pipeline pushing telemetry to Firebase Realtime Database",
      "Departmental 1st Prize & IEI Student Chapter technical paper presentation recognition",
      "Winner (2nd Place), A-HACKS 2026 Hardware Category"
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
      '/assets/firefighter-monitoring-device/departmental-first-4.jpg'
    ],
    award: '🥈 Hackathon Winner',
    awards: [
      '🥈 Winner, A-HACKS 2026 Hardware Category',
      '🏆 Departmental 1st Prize',
      '📜 IEI Student Chapter Technical Paper Recognition'
    ],
    keywords: 'firefighter monitoring system india, esp32 wearable safety device, mpu6050 fall detection, iot firefighter telemetry'
  },
  {
    id: 'p3',
    title: 'ColorOhm – Resistor Color Code Calculator App',
    description: 'A precision resistor color band decoder available as a published Android app (v1.0.0) and web utility, supporting 4-band, 5-band, and SMD resistor standards for engineering students.',
    tech: ['React Native', 'Expo', 'JavaScript', 'CSS3', 'Android SDK'],
    image: '/assets/color-ohm-resistor-calculator-tool.webp',
    link: 'https://colorohm.rsmk.me/',
    details: "ColorOhm is a dedicated electrical engineering utility designed for lab work and circuit prototyping. Built as both an Android application (published v1.0.0 release) and an instant web tool, it decodes 4-band and 5-band color codes, calculates component tolerances, and converts SMD resistor markings. Engineered for zero latency and offline availability to assist EEE students and technicians on the workbench.",
    features: [
      "Instant 4-band & 5-band resistor color code decoding",
      "SMD resistor code calculator with standard EIA-96 lookup support",
      "Published Android application (GitHub v1.0.0 release)",
      "Zero-latency calculation with responsive visual color selector",
      "100% offline functionality for workbench accessibility"
    ],
    award: '📱 Android App',
    awards: ['📱 Android App', '🌐 Web Utility'],
    keywords: 'resistor color code calculator, 4 band resistor calculator, color ohm app india, smd resistor calculator'
  },
  {
    id: 'p5',
    title: 'Automatic Exhaust Fan – Smart Ventilation System',
    description: 'An Arduino-based safety system utilizing MQ-2 gas sensors to automatically trigger high-power exhaust ventilation upon detecting hazardous smoke or gas concentrations.',
    tech: ['Arduino UNO', 'MQ-2 Gas Sensor', 'Relay Module', 'Embedded C++'],
    image: '/assets/smart-exhaust-gas-detection-system.webp',
    link: 'https://autoexhaustfan.rsmk.co.in/',
    details: "The Automatic Exhaust Fan is an automated environmental safety control system designed to prevent toxic gas accumulation in enclosed spaces. Controlled by an Arduino UNO running custom Embedded C++ code, the system continuously samples air quality via an MQ-2 gas/smoke sensor. When gas levels breach configurable threshold limits, a 5V optocoupler relay switches on an industrial ventilation fan. Includes auto-off timer logic and manual override switches.",
    features: [
      "Real-time smoke and flammable gas detection via calibrated MQ-2 sensor",
      "Optocoupler relay actuation for high-current exhaust fan switching",
      "Automatic off-delay timer to ensure thorough air clearance post-hazard",
      "Manual override switch for forced ventilation control",
      "Low standby power consumption and hardware safety interlocks"
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
    keywords: 'automatic exhaust fan arduino, mq-2 gas sensor ventilation, smart safety control system'
  },
  {
    id: 'p6',
    title: 'Single-Axis Solar Tracker – Comparator Controlled System',
    description: 'A microcontroller-free single axis solar panel tracker utilizing dual LDR sensors and a transistor-driven dual-relay comparator network to achieve ~30% efficiency gain.',
    tech: ['Dual LDR Bridge', 'Relay Comparator', 'Transistor Drivers', 'Gear Motor', 'Analog Electronics'],
    image: '/assets/single-axis-solar-tracker.png',
    details: "An efficient, analog-controlled Single Axis Solar Tracker operating without a digital microcontroller to eliminate standby software overhead. Utilizing two light-dependent resistors (LDRs) arranged in a differential bridge circuit, the system senses angular light variations. A transistor comparator circuit drives a dual-relay network configured as an analog H-bridge, driving a 12V gear motor toward the angle of highest solar irradiance for up to a ~30% energy yield increase over fixed panels.",
    features: [
      "Pure analog comparator control loop — zero microcontroller standby power",
      "Differential dual LDR bridge for precise solar alignment tracking",
      "Dual-relay H-bridge configuration driving high-torque 12V DC gear motor",
      "Demonstrated ~30% solar photovoltaic output gain compared to fixed tilt",
      "Low-cost, robust hardware architecture built for renewable energy application"
    ],
    award: '⚡ Analog Control',
    awards: ['⚡ Analog Control', '⚙️ Hardware Prototype'],
    keywords: 'single axis solar tracker, ldr solar tracking circuit, comparator relay solar tracker'
  },
  {
    id: 'p7',
    title: 'SPDS – Solar Powered Dewatering System',
    description: 'A PM-KUSUM aligned solar-powered agricultural dewatering system replacing diesel pumps with solar PV power, soil moisture sensing, and light-driven pump switching.',
    tech: ['Arduino UNO', 'Solar PV', 'Soil Moisture Sensor', 'LDR', 'Relay Switching', 'C++'],
    image: '/assets/ai-chatbot-interface-background.webp',
    link: 'https://spds.rsmk.me/',
    details: "The Solar-Powered Dewatering System (SPDS) is an engineering prototype designed for grid-independent agricultural irrigation aligned with India's PM-KUSUM initiative. Built around an Arduino controller, the system integrates soil moisture probes and ambient LDR sensing to control a DC water pump via relay logic, activating irrigation only when daylight conditions and soil dryness coincide.",
    features: [
      "100% solar PV driven water pumping — zero fossil fuel dependency",
      "Automated soil moisture threshold sensing for smart irrigation control",
      "LDR daylight detection ensuring daytime-only pump operation",
      "Relay switching interface for high-efficiency DC motor control",
      "Smart India Hackathon (SIH) college-level prototype presentation"
    ],
    award: '📐 SIH Prototype',
    awards: ['📐 SIH Project', '⚙️ Renewable Energy'],
    keywords: 'solar dewatering system india, pm-kusum solar pump prototype, smart solar irrigation'
  },
  {
    id: 'p8',
    title: 'AgriRover – Multi-Functional ESP32 Agricultural Robot',
    description: 'A full-stack IoT agricultural robot driven by dual ESP32 microcontrollers, featuring live MJPEG video streaming, GPS tracking, soil sensors, relay pumping, and an AI advisory chatbot.',
    tech: ['ESP32', 'ESP32-CAM', 'React', 'Firebase RTDB', 'Groq Llama 3.3', 'Leaflet', 'Embedded C++'],
    image: '/assets/agri-rover-project.webp',
    link: 'https://github.com/Rsmk27/multi-rover',
    details: "AgriRover is an integrated hardware and software agricultural robot system. A dual ESP32 architecture separates high-speed video streaming from motor control: the main ESP32 DevKit handles locomotion (L298N driver), relay-driven water spraying, Neo-6M GPS telemetry, and soil sensing; while an ESP32-CAM streams live MJPEG video. Telemetry streams via Firebase RTDB to a custom React web interface with Leaflet mapping and an AI AgriChatbot (powered by Groq Llama 3.3) for plant health diagnostics.",
    features: [
      "Dual ESP32 hardware design (dedicated motor control + dedicated CAM module)",
      "Real-time MJPEG video stream broadcast from onboard ESP32-CAM",
      "GPS tracking and waypointing on an interactive Leaflet map interface",
      "Soil moisture monitoring with automated relay pump trigger for precision spraying",
      "Remote manual drive controls with emergency stop safety routines",
      "AI AgriChatbot integration (Groq Llama 3.3) for automated crop advisory"
    ],
    gallery: [
      '/assets/agri-rover-project.webp'
    ],
    award: '🤖 IoT Robot',
    awards: ['🤖 IoT Robot', '🌿 AgriTech', '📡 Dual ESP32'],
    keywords: 'agri rover esp32, iot agricultural robot india, dual esp32 farming robot'
  }
];

export const PCB_COLORS = {
  bg: '#0a0a0a',
  cyan: '#00f2ff',
  trace: '#1a1a1a',
  dim: '#0d2b2d'
};

