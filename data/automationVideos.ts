export interface VideoTechnicalSpecs {
  controlPlatform: string;
  softwareTools: string[];
  communicationProtocols: string[];
  ioInterfacing: string[];
  controlPhilosophy: string;
}

export interface AutomationVideoItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'PLC & 3D Simulation' | 'HMI & SCADA' | 'Hardware & IoT' | 'Robotics & Control';
  type: 'youtube' | 'local';
  videoUrl: string;
  embedUrl: string;
  youtubeId?: string;
  thumbnailUrl: string;
  durationBadge: string;
  date: string;
  featured?: boolean;
  description: string;
  highlights: string[];
  techStack: string[];
  specs: VideoTechnicalSpecs;
  relatedProjectUrl?: string;
  githubUrl?: string;
}

export const AUTOMATION_CATEGORIES = [
  'All',
  'PLC & 3D Simulation',
  'HMI & SCADA',
  'Hardware & IoT',
  'Robotics & Control',
] as const;

export type AutomationCategory = (typeof AUTOMATION_CATEGORIES)[number];

export const AUTOMATION_VIDEOS: AutomationVideoItem[] = [
  {
    id: 'codesys-factory-io',
    title: 'Industrial Automation Simulation — CODESYS V3.5 & Factory I/O',
    subtitle: 'PLC Ladder Logic and 3D Virtual Plant Sorting System over Modbus TCP',
    category: 'PLC & 3D Simulation',
    type: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
    embedUrl: 'https://www.youtube.com/embed/2pnFLqmh6X4',
    youtubeId: '2pnFLqmh6X4',
    thumbnailUrl: 'https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg',
    durationBadge: 'Featured Walkthrough',
    date: 'Jan 2026',
    featured: true,
    description:
      'A complete virtual commissioning and control simulation linking CODESYS V3.5 soft-PLC to a 3D industrial sorting facility modeled in Factory I/O. The system exchanges real-time sensor and actuator telemetry via Modbus TCP client/server protocol, demonstrating rigorous industrial ladder programming without physical risk.',
    highlights: [
      'Bidirectional Modbus TCP communication driver between CODESYS soft-PLC and Factory I/O 3D environment',
      'IEC 61131-3 compliant Ladder Diagram (LD) implementing start/stop latching, state sequences, and interlocks',
      'Conveyor motor control, optical diffuse item sorting sensors, and pneumatic pusher actuators',
      'Emergency stop routine with fail-safe zero-energy state handling and system reset recovery',
      'Zero physical hardware risk — complete virtual commissioning workflow ready for industrial deployment'
    ],
    techStack: ['CODESYS V3.5', 'Factory I/O', 'Modbus TCP', 'Ladder Logic (LD)', 'IEC 61131-3', 'Virtual Commissioning'],
    specs: {
      controlPlatform: 'CODESYS Soft-PLC Runtime (Windows)',
      softwareTools: ['CODESYS Development System V3.5', 'Factory I/O 3D Engine', 'Modbus Poll/Driver'],
      communicationProtocols: ['Modbus TCP (Ethernet / Port 502)'],
      ioInterfacing: ['Digital Inputs (Opto-electric Sensors, E-Stop)', 'Digital Outputs (Conveyor Motor, Diverters)'],
      controlPhilosophy: 'State-based sequential machine with fail-safe stop interlocks and automatic pallet diverting'
    },
    githubUrl: 'https://github.com/Rsmk27'
  },
  {
    id: 'ccw-optix-traffic-light',
    title: '1-Way Traffic Light Control — CCW & FactoryTalk Optix Studio',
    subtitle: 'Rockwell Automation Micro800 PLC Logic with Modern Vectorized HMI Interface',
    category: 'HMI & SCADA',
    type: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=qIJbTBcBfjE',
    embedUrl: 'https://www.youtube.com/embed/qIJbTBcBfjE',
    youtubeId: 'qIJbTBcBfjE',
    thumbnailUrl: 'https://img.youtube.com/vi/qIJbTBcBfjE/maxresdefault.jpg',
    durationBadge: 'HMI & Logic Demo',
    date: 'Feb 2026',
    featured: true,
    description:
      'Industrial traffic flow management system programmed in Rockwell Automation Connected Components Workbench (CCW) paired with modern FactoryTalk Optix Studio HMI. Features precision timer cycles, pedestrian crossing overrides, animated graphic indicators, and diagnostic state monitoring.',
    highlights: [
      'Sequential state machine timing logic programmed in Connected Components Workbench (CCW)',
      'FactoryTalk Optix Studio vectorized HMI screen with real-time signal lamp state animations',
      'Pedestrian crosswalk request button logic with timed transitional amber warning phase',
      'Live tag binding and status diagnostics between PLC memory registers and the HMI dashboard',
      'Fail-safe blinking amber alert mode for maintenance or grid error conditions'
    ],
    techStack: ['Connected Components Workbench (CCW)', 'FactoryTalk Optix Studio', 'Rockwell Automation', 'HMI Tag Mapping', 'Timer Logic'],
    specs: {
      controlPlatform: 'Rockwell Automation Micro800 Simulator',
      softwareTools: ['Connected Components Workbench (CCW)', 'FactoryTalk Optix Studio'],
      communicationProtocols: ['CIP (Common Industrial Protocol)', 'Internal Optix Native Driver'],
      ioInterfacing: ['Red/Amber/Green Lamp Tags', 'Pedestrian Call Inputs', 'Timer Accumulators (TON/TOF)'],
      controlPhilosophy: 'Time-delayed finite state machine with prioritized pedestrian crossing interrupt and fault fallback'
    },
    githubUrl: 'https://github.com/Rsmk27'
  },
  {
    id: 'auto-exhaust-fan',
    title: 'Automatic Exhaust Fan — Smart Toxic Gas Extraction Prototype',
    subtitle: 'Arduino UNO with MQ-2 Gas Sensor & 5V Optocoupler Relay Actuation',
    category: 'Hardware & IoT',
    type: 'local',
    videoUrl: '/assets/auto-exhaust-fan/demo-video.mp4',
    embedUrl: '/assets/auto-exhaust-fan/demo-video.mp4',
    thumbnailUrl: '/assets/auto-exhaust-fan/image-1.jpg',
    durationBadge: 'Hardware Prototype',
    date: '2025',
    description:
      'Working laboratory demonstration of an automated environmental safety control prototype. An Arduino UNO samples continuous air quality readings from an MQ-2 smoke/flammable gas sensor, automatically energizing high-current exhaust ventilation via isolated relay logic when threshold limits are breached.',
    highlights: [
      'Real-time smoke and LPG gas concentration threshold detection using calibrated MQ-2 sensor',
      'Optically isolated 5V relay module safely triggering 230V industrial ventilation exhaust',
      'Configurable automatic post-hazard clearance delay timer ensuring air quality restoration',
      'Hardware manual override switch for forced ventilation during maintenance',
      'Integrated status indicator LEDs for active monitoring, warning, and fault states'
    ],
    techStack: ['Arduino UNO', 'MQ-2 Gas Sensor', '5V Optocoupler Relay', 'Embedded C++', 'Power Switching'],
    specs: {
      controlPlatform: 'Atmega328P (Arduino UNO)',
      softwareTools: ['Arduino IDE', 'Embedded C++ Firmware', 'Analog Threshold Calibration'],
      communicationProtocols: ['Analog ADC Voltage Sampling', 'GPIO Actuation'],
      ioInterfacing: ['MQ-2 Analog In (A0)', 'Optocoupler Relay Digital Out (D7)', 'Status LEDs (D12/D13)'],
      controlPhilosophy: 'Hysteresis threshold filtering to prevent relay chatter, coupled with delayed fan shutdown'
    },
    relatedProjectUrl: 'https://autoexhaustfan.rsmk.co.in/'
  },
  {
    id: 'drone-flight-stabilization',
    title: 'Quadcopter Flight Testing & PID Motor Calibration',
    subtitle: 'Electronic Speed Controller (ESC) Calibration & Real-Time Flight Dynamics',
    category: 'Robotics & Control',
    type: 'local',
    videoUrl: '/assets/certifications/drone-technology/flight-1.mp4',
    embedUrl: '/assets/certifications/drone-technology/flight-1.mp4',
    thumbnailUrl: '/assets/certifications/drone-technology/training-1.jpg',
    durationBadge: 'Field Flight Test',
    date: '2025',
    description:
      'Hands-on quadcopter flight testing conducted during the Drone Technology Certification Workshop at Andhra Loyola Institute of Engineering and Technology (ALIET). Highlights throttle response tuning, electronic speed controller (ESC) calibration, and attitude stabilization.',
    highlights: [
      'Attitude flight stability testing examining roll, pitch, and yaw damping response',
      'Multi-rotor BLDC motor synchronization and Electronic Speed Controller (ESC) signal calibration',
      '2.4GHz radio frequency receiver telemetry binding and fail-safe return verification',
      'Pre-flight physical rotor balancing and structural vibrational resonance analysis'
    ],
    techStack: ['Flight Controller', 'BLDC Motors', 'ESC Calibration', 'PID Stabilization', 'Radio Telemetry'],
    specs: {
      controlPlatform: 'Multi-Rotor Flight Controller',
      softwareTools: ['Flight Configurator', 'Radio Transmitter Firmware', 'ESC Calibration Suite'],
      communicationProtocols: ['PWM / DShot ESC Protocol', '2.4GHz RF Telemetry'],
      ioInterfacing: ['6-Axis IMU (Gyro + Accel)', '4x BLDC Motor PWM Outputs', 'Radio Receiver Channels'],
      controlPhilosophy: 'High-frequency closed-loop PID control maintaining level attitude across varying aerodynamic disturbances'
    }
  },
  {
    id: 'drone-maneuver-stability',
    title: 'Quadcopter Maneuvering & Dynamic Yaw Stability Test',
    subtitle: 'Hover Stabilization and Translational Aerodynamic Flight Testing at ALIET',
    category: 'Robotics & Control',
    type: 'local',
    videoUrl: '/assets/certifications/drone-technology/flight-2.mp4',
    embedUrl: '/assets/certifications/drone-technology/flight-2.mp4',
    thumbnailUrl: '/assets/certifications/drone-technology/training-2.jpg',
    durationBadge: 'Maneuvering Test',
    date: '2025',
    description:
      'Dynamic aerial testing of the assembled quadcopter at the ALIET campus, demonstrating rotational yaw control, altitude hold consistency, and smooth translational flight maneuvers.',
    highlights: [
      'In-flight hover precision and drift compensation assessment',
      'Smooth rotational yaw transition under manual transmitter stick input',
      'Ground effect management during low-altitude takeoff and landing cycles',
      'Team flight logging and telemetry data monitoring'
    ],
    techStack: ['Flight Dynamics', 'Yaw Rate Control', 'IMU Calibration', 'ALIET Workshop'],
    specs: {
      controlPlatform: 'Multi-Rotor Flight Controller',
      softwareTools: ['Ground Station Telemetry', 'Flight Telemetry Monitor'],
      communicationProtocols: ['2.4GHz Spread Spectrum Radio'],
      ioInterfacing: ['Throttle / Pitch / Roll / Yaw RC Channels'],
      controlPhilosophy: 'Rate and angle mode flight control loops for balanced agility and pilot safety'
    }
  },
  {
    id: 'drone-preflight-inspection',
    title: 'Drone Assembly, Telemetry & Pre-Flight System Check',
    subtitle: 'Hardware Enclosure Inspection, Rotor Balancing & Motor Spin-Up Verification',
    category: 'Robotics & Control',
    type: 'local',
    videoUrl: '/assets/certifications/drone-technology/flight-3.mp4',
    embedUrl: '/assets/certifications/drone-technology/flight-3.mp4',
    thumbnailUrl: '/assets/certifications/drone-technology/training-1.jpg',
    durationBadge: 'System Check',
    date: '2025',
    description:
      'Pre-flight safety inspection protocol covering rotor direction verification, telemetry signal link reliability, battery voltage sag analysis, and motor spin-up stability checks prior to aerial launch.',
    highlights: [
      'Rotor spin direction (CW vs CCW) matching and propeller security check',
      'Battery voltage cutoff and power distribution board (PDB) load checks',
      'Radio telemetry connection latching and receiver antenna orientation',
      'Emergency motor cut safety switch testing'
    ],
    techStack: ['Safety Protocols', 'PDB Wiring', 'Telemetry Check', 'UAV Systems'],
    specs: {
      controlPlatform: 'Quadcopter Airframe & Power Board',
      softwareTools: ['Telemetry Health Monitor'],
      communicationProtocols: ['Telemetry Serial Link'],
      ioInterfacing: ['Battery Voltage Sensor', 'Buzzer Indicator', 'Arming Switch'],
      controlPhilosophy: 'Standardized aerospace pre-flight safety checklist before armed flight status'
    }
  }
];
