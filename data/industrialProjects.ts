// ─── Industrial Automation Portfolio Data ──────────────────────────────────
// Centralized data layer for the Industrial Automation Journey page.
// All claims are evidence-based and reflect actual tool usage / project status.

// ─── Types ──────────────────────────────────────────────────────────────────

export type ProjectStatus = 'Completed' | 'In Progress' | 'Planned' | 'Awaiting Documentation';
export type SkillLevel = 'Project Experience' | 'Practiced' | 'Familiar' | 'Exploring';
export type RoadmapStatus = 'Completed' | 'In Progress' | 'Exploring' | 'Planned' | 'Practicing' | 'Practiced';
export type ProtocolStatus = 'Project Experience' | 'Studied' | 'Exploring' | 'Planned';
export type DocCategory =
  | 'Electrical Design'
  | 'PLC Logic'
  | 'Factory Simulation'
  | 'HMI & SCADA'
  | 'System Architecture'
  | 'Technical Report';

export interface ProjectFile {
  label: string;
  description: string;
  available: boolean;
  url?: string;
}

export interface ProjectFeatureStatus {
  label: string;
  status: 'Implemented' | 'In Progress' | 'Planned';
}

export interface YouTubeVideo {
  id: string;          // YouTube video ID
  url: string;         // Full watch URL
  embedUrl: string;    // Embed URL
  thumbnailUrl: string;
  label: string;       // Short display label
}

export interface IndustrialProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  software: string[];
  protocol?: string[];
  status: ProjectStatus;
  statusNote: string;
  description: string;
  problemStatement: string;
  objectives: string[];
  architecture?: string;
  methodology?: string[];
  highlights: string[];
  challenges?: string[];
  futureWork?: string[];
  featureMatrix?: ProjectFeatureStatus[];
  files: ProjectFile[];
  videos?: YouTubeVideo[];   // All associated YouTube videos
  primaryVideoId?: string;   // Which video to show in the spotlight player
  thumbnailPlaceholder: string;
  featured?: boolean;
}

export interface EngineeringTool {
  id: string;
  name: string;
  vendor: string;
  category: string;
  level: SkillLevel;
  description: string;
  usedIn: string[];
  icon: string;
  logo?: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  tools: string[];
  projects: string[];
  skills: string[];
  status: RoadmapStatus;
  nextMilestone: string;
}

export interface IndustrialProtocol {
  id: string;
  name: string;
  shortName: string;
  purpose: string;
  useCase: string;
  model: string;
  relatedProject?: string;
  status: ProtocolStatus;
  logo?: string;
}

export interface SkillGroup {
  category: string;
  icon: string;
  skills: {
    name: string;
    level: SkillLevel;
    note?: string;
  }[];
}

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  category: DocCategory;
  available: boolean;
  previewNote: string;
  url?: string;
}

// ─── Projects ───────────────────────────────────────────────────────────────

export const INDUSTRIAL_PROJECTS: IndustrialProject[] = [
  {
    id: 'substation-design',
    title: '33/11 kV Substation Electrical Design',
    subtitle: 'EPLAN Electric P8 — Single-Line Diagram and Electrical Documentation',
    category: 'Electrical Design & Power Systems',
    tags: ['Electrical Design', 'Power Systems', 'Substation', 'EPLAN'],
    software: ['EPLAN Electric P8'],
    status: 'Completed',
    statusNote: 'Initial design completed in EPLAN Electric P8. Subject to refinement.',
    description:
      'A 33/11 kV substation electrical design created in EPLAN Electric P8. The project covers the single-line diagram layout, transformer representation, electrical equipment arrangement, terminal numbering, and standard documentation conventions.',
    problemStatement:
      'Developing a foundational understanding of substation electrical design by creating a complete set of EPLAN drawings for a 33/11 kV step-down substation — the kind found in industrial plant power distribution.',
    objectives: [
      'Create a single-line diagram (SLD) for a 33/11 kV substation using EPLAN Electric P8',
      'Represent 33 kV incoming feeders, power transformer, and 11 kV outgoing feeders',
      'Apply proper EPLAN symbol conventions and equipment numbering',
      'Document terminal assignments and protective relay arrangement',
      'Practice standard electrical drawing documentation practices',
    ],
    highlights: [
      'Single-line diagram showing 33 kV to 11 kV transformation path',
      'Electrical equipment representation including transformer, circuit breakers, and disconnectors',
      'EPLAN Electric P8 drawing environment and symbol library usage',
      'Terminal numbering conventions applied throughout the design',
      'Electrical documentation following industrial drawing standards',
    ],
    challenges: [
      'Learning EPLAN symbol conventions and project structure from scratch',
      'Understanding the correct representation of protective relaying in a single-line diagram',
      'Applying proper terminal numbering standards without prior formal training',
    ],
    futureWork: [
      'Add protection relay coordination settings to the design documentation',
      'Include busbar and switchgear layout drawings',
      'Develop an auxiliary control schematic for the substation equipment',
    ],
    files: [
      { label: 'Single-Line Diagram (SLD)', description: 'EPLAN-generated 33/11 kV substation SLD', available: false },
      { label: 'Electrical Equipment List', description: 'Bill of materials and equipment designations', available: false },
      { label: 'Terminal Assignment Drawing', description: 'Terminal numbering and connection documentation', available: false },
    ],
    thumbnailPlaceholder: 'Zap',
    featured: true,
  },

  {
    id: 'dol-motor-starter',
    title: 'DOL Motor Starter Electrical Design',
    subtitle: 'EPLAN Electric P8 — Power Circuit and Control Circuit Schematics',
    category: 'Motor Control & Electrical Design',
    tags: ['Electrical Design', 'Motor Control', 'Control Panel', 'EPLAN'],
    software: ['EPLAN Electric P8'],
    status: 'Completed',
    statusNote: 'Design files created in EPLAN Electric P8.',
    description:
      'A Direct-On-Line (DOL) motor starter electrical design created in EPLAN Electric P8, covering both the power circuit and the control circuit. Documents contactor, overload relay, push button, and indicator lamp wiring following industrial schematic standards.',
    problemStatement:
      'DOL motor starters form the foundation of industrial motor control. This project develops core schematic drawing skills and understanding of power and control circuit separation — essential for control panel design.',
    objectives: [
      'Design the power circuit for a DOL starter including contactor and overload relay',
      'Create the control circuit with start/stop push buttons and seal-in contact',
      'Document terminal connections for external wiring',
      'Apply EPLAN schematic standards and symbol conventions',
      'Demonstrate understanding of motor protection and control logic in schematic form',
    ],
    highlights: [
      'Power circuit: three-phase supply, main contactor, overload relay, and motor terminals',
      'Control circuit: start push button (NO), stop push button (NC), contactor auxiliary contact seal-in',
      'Overload relay trip contact integrated in the control circuit for motor protection',
      'Terminal block connections documented for external wiring',
      'Indicator lamp wiring for motor run status',
    ],
    challenges: [
      'Understanding the difference between power circuit and control circuit separation in EPLAN',
      'Correctly representing the contactor auxiliary contact seal-in (latching) logic in schematic form',
      'Applying correct component reference designations and terminal numbering',
    ],
    futureWork: [
      'Add a reversing starter variant to the design',
      'Create a wiring diagram view alongside the schematic view',
      'Develop a 3D control panel layout as a companion to the electrical design',
    ],
    files: [
      { label: 'Power Circuit Schematic', description: 'Three-phase power circuit for DOL starter', available: false },
      { label: 'Control Circuit Schematic', description: 'Start/stop control circuit with interlocking', available: false },
      { label: 'Terminal Connection Drawing', description: 'External wiring terminal documentation', available: false },
    ],
    thumbnailPlaceholder: 'CircuitBoard',
    featured: true,
  },

  {
    id: 'codesys-factory-io-sorting',
    title: 'CODESYS + Factory I/O Conveyor Sorting System',
    subtitle: 'PLC Ladder Logic and 3D Virtual Commissioning over Modbus TCP',
    category: 'PLC Programming & Factory Automation',
    tags: ['PLC', 'CODESYS', 'Factory I/O', 'Modbus TCP', 'Ladder Logic', 'IEC 61131-3'],
    software: ['CODESYS V3.5.22.30', 'Factory I/O'],
    protocol: ['Modbus TCP'],
    status: 'Completed',
    statusNote: 'Completed virtual commissioning simulation — not a physical industrial deployment.',
    description:
      'A complete conveyor sorting system simulation linking CODESYS V3.5 soft-PLC to a 3D industrial sorting facility in Factory I/O. Real-time sensor and actuator data is exchanged over Modbus TCP, with ladder logic controlling box classification, conveyor routing, and pusher actuation.',
    problemStatement:
      'Developing and validating PLC control logic for an industrial sorting conveyor without physical hardware, using virtual commissioning to simulate the full control sequence in a risk-free 3D environment.',
    objectives: [
      'Program an IEC 61131-3 compliant Ladder Diagram in CODESYS V3.5',
      'Configure Modbus TCP communication between CODESYS soft-PLC and Factory I/O',
      'Implement box sorting logic based on sensor inputs and pneumatic pusher actuation',
      'Include start/stop interlocking and emergency stop (E-Stop) handling',
      'Validate the control sequence through Factory I/O 3D simulation',
    ],
    highlights: [
      'Bidirectional Modbus TCP between CODESYS soft-PLC and Factory I/O 3D engine',
      'IEC 61131-3 Ladder Diagram implementing state-based sorting sequence',
      'Conveyor motor control, optical diffuse sensors, and pneumatic pusher actuators',
      'Small-box and large-box classification with separate discharge lanes',
      'Emergency stop with fail-safe zero-energy state and system reset',
      'Complete virtual commissioning workflow — no physical hardware required',
    ],
    challenges: [
      'Configuring Modbus TCP I/O mapping between CODESYS variable table and Factory I/O signals',
      'Managing conveyor timing to prevent box collision at the sorting diverter',
      'Implementing a reliable E-Stop with state preservation for safe restart',
    ],
    futureWork: [
      'Add a recipe-based sorting configuration for multiple product types',
      'Integrate an HMI screen in FactoryTalk Optix Studio for operator control',
      'Add a fault alarm log with diagnostic messaging',
    ],
    videos: [
      {
        id: '2pnFLqmh6X4',
        url: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
        embedUrl: 'https://www.youtube.com/embed/2pnFLqmh6X4',
        thumbnailUrl: 'https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg',
        label: 'Full Walkthrough — CODESYS + Factory I/O Sorting',
      },
      {
        id: 'pPgJaU0IWfU',
        url: 'https://www.youtube.com/watch?v=pPgJaU0IWfU',
        embedUrl: 'https://www.youtube.com/embed/pPgJaU0IWfU',
        thumbnailUrl: 'https://img.youtube.com/vi/pPgJaU0IWfU/maxresdefault.jpg',
        label: 'Box Sorting Conveyor — Multi-Lane PLC Routing',
      },
    ],
    primaryVideoId: '2pnFLqmh6X4',
    files: [
      {
        label: 'Demo Video (YouTube)',
        description: 'Full CODESYS + Factory I/O sorting simulation walkthrough',
        available: true,
        url: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
      },
      { label: 'CODESYS Project Screenshot', description: 'Ladder logic and variable mapping', available: false },
      { label: 'Modbus TCP I/O Mapping', description: 'Input/output register address map', available: false },
    ],
    thumbnailPlaceholder: 'Workflow',
    featured: true,
  },

  {
    id: 'pick-and-place',
    title: 'Pick and Place Automation using PLC',
    subtitle: 'Pneumatic Robotic Gantry Sequence with PLC Ladder Logic — Factory I/O',
    category: 'PLC Programming & Factory Automation',
    tags: ['PLC', 'Ladder Logic', 'Factory I/O', 'Pick & Place', 'Pneumatics', 'Sequencing'],
    software: ['CODESYS V3.5.22.30', 'Factory I/O'],
    protocol: ['Modbus TCP'],
    status: 'Completed',
    statusNote: 'Completed PLC simulation in Factory I/O.',
    description:
      'An industrial pick-and-place robotic gantry controlled via PLC ladder logic. Features precision multi-axis pneumatic positioning (X, Y, Z motion), vacuum suction gripper actuation, conveyor synchronization, part arrival detection, and fail-safe interlocking.',
    problemStatement:
      'Simulating a pick-and-place automation workcell to practice multi-axis sequential PLC programming — coordinating pneumatic actuators, conveyors, and sensors in a defined cycle without collision.',
    objectives: [
      'Program multi-axis pneumatic manipulator sequencing in PLC ladder logic',
      'Coordinate part detection, arm traverse, and gripper release in a timed sequence',
      'Implement cycle reset and fault recovery logic',
      'Validate the control sequence using Factory I/O 3D simulation',
    ],
    highlights: [
      'Multi-axis pneumatic manipulator (horizontal traverse, vertical stroke, vacuum pickup)',
      'Part presence detection via optical sensors with conveyor station latching',
      'IEC 61131-3 Ladder Diagram state machine coordinating transfer cycles',
      'Vacuum gripper release and place verification with safety boundary interlocks',
      'Cycle reset and fault recovery for uninterrupted automated workcell operation',
    ],
    challenges: [
      'Correctly sequencing multi-axis motion without overlapping actuator commands',
      'Implementing safe inter-axis interlocking so the arm never moves while the gripper is active in the wrong position',
    ],
    futureWork: [
      'Add vision-based part detection for flexible pick-point localization',
      'Extend to a dual-arm workcell with concurrent pick/place cycles',
    ],
    videos: [
      {
        id: 'dYKsfDnsj9A',
        url: 'https://www.youtube.com/watch?v=dYKsfDnsj9A',
        embedUrl: 'https://www.youtube.com/embed/dYKsfDnsj9A',
        thumbnailUrl: 'https://img.youtube.com/vi/dYKsfDnsj9A/maxresdefault.jpg',
        label: 'Pick & Place Gantry — PLC Simulation Demo',
      },
    ],
    primaryVideoId: 'dYKsfDnsj9A',
    files: [
      {
        label: 'Demo Video (YouTube)',
        description: 'Pick and place PLC simulation full walkthrough',
        available: true,
        url: 'https://www.youtube.com/watch?v=dYKsfDnsj9A',
      },
    ],
    thumbnailPlaceholder: 'Move',
    featured: true,
  },

  {
    id: 'traffic-light-hmi',
    title: 'PLC Traffic Light Control with HMI',
    subtitle: 'Connected Components Workbench + FactoryTalk Optix Studio',
    category: 'PLC Programming & HMI',
    tags: ['PLC', 'HMI', 'CCW', 'FactoryTalk Optix', 'Timer Logic', 'Sequencing'],
    software: ['Connected Components Workbench (CCW)', 'FactoryTalk Optix Studio'],
    protocol: ['CIP (Internal)'],
    status: 'Completed',
    statusNote: 'Completed simulation verified against video documentation.',
    description:
      'A traffic light sequencing system programmed in Connected Components Workbench (CCW) for the Rockwell Automation Micro800 platform, paired with a FactoryTalk Optix Studio HMI. Implements timer-based state sequencing, pedestrian crossing logic, and live HMI status indicators.',
    problemStatement:
      'Building a practical understanding of Rockwell Automation PLC programming and HMI development through a traffic light control simulation — demonstrating timer logic, state sequencing, and live tag binding.',
    objectives: [
      'Program a traffic light state machine in Connected Components Workbench (CCW)',
      'Implement timer-based red/amber/green signal sequencing',
      'Create a pedestrian crossing request with timed amber transition',
      'Design an HMI operator screen in FactoryTalk Optix Studio',
      'Bind PLC tags to HMI graphical elements for live status indication',
    ],
    highlights: [
      'Sequential state machine: red → green → amber → red timing cycle',
      'Pedestrian crossing interrupt with timed amber warning phase',
      'FactoryTalk Optix Studio vectorized HMI with real-time signal lamp animations',
      'Live PLC tag binding between CCW memory registers and HMI display elements',
      'Fault fallback: blinking amber mode for system error or maintenance state',
    ],
    challenges: [
      'Understanding CCW PLC simulator environment and tag naming conventions',
      'Binding FactoryTalk Optix Studio HMI tags to CCW PLC variables',
      'Implementing a clean pedestrian crossing interrupt without disrupting the main timing cycle',
    ],
    futureWork: [
      'Extend to a 4-way intersection control simulation',
      'Add cycle time adjustment via HMI input for operator flexibility',
    ],
    videos: [
      {
        id: 'qIJbTBcBfjE',
        url: 'https://www.youtube.com/watch?v=qIJbTBcBfjE',
        embedUrl: 'https://www.youtube.com/embed/qIJbTBcBfjE',
        thumbnailUrl: 'https://img.youtube.com/vi/qIJbTBcBfjE/maxresdefault.jpg',
        label: 'Traffic Light PLC + Optix HMI Demo',
      },
    ],
    primaryVideoId: 'qIJbTBcBfjE',
    files: [
      {
        label: 'Demo Video (YouTube)',
        description: 'Traffic light PLC + HMI walkthrough',
        available: true,
        url: 'https://www.youtube.com/watch?v=qIJbTBcBfjE',
      },
      { label: 'CCW Logic Screenshots', description: 'Ladder logic and timer configuration', available: false },
      { label: 'Optix Studio HMI Screen', description: 'HMI design and tag binding documentation', available: false },
    ],
    thumbnailPlaceholder: 'MonitorCheck',
  },

  {
    id: 'intelligent-conveyor-health',
    title: 'Intelligent Conveyor Belt Health Monitoring',
    subtitle: 'IIoT, Predictive Maintenance & Digital Twin — Flagship Evolving Project',
    category: 'Industrial IoT & Predictive Maintenance',
    tags: ['IIoT', 'Predictive Maintenance', 'Digital Twin', 'CODESYS', 'ESP32', 'MQTT'],
    software: ['CODESYS V3.5.22.30', 'Factory I/O', 'ESP32 Development Environment'],
    protocol: ['Modbus TCP', 'MQTT (Planned)'],
    status: 'In Progress',
    statusNote:
      'PLC simulation and Factory I/O digital twin are active. ESP32 integration and MQTT pipeline are in architecture/planning phase.',
    description:
      'A flagship evolving project combining PLC-based conveyor control, a Factory I/O digital twin, ESP32 sensor architecture, and a planned MQTT pipeline for conveyor health monitoring and predictive maintenance.',
    problemStatement:
      'Industrial conveyor belt failures cause significant downtime and production loss. This project explores how PLC simulation, real-time sensor data, and IIoT architectures can be combined to detect early signs of belt degradation.',
    objectives: [
      'Establish a PLC-based conveyor control foundation in CODESYS + Factory I/O',
      'Design an ESP32 sensor integration architecture for temperature and vibration monitoring',
      'Plan the MQTT communication pipeline for telemetry data flow',
      'Develop a dashboard concept for conveyor health visualization',
      'Document the roadmap for AI/ML-based anomaly detection as a future milestone',
    ],
    featureMatrix: [
      { label: 'CODESYS PLC conveyor control logic', status: 'Implemented' },
      { label: 'Factory I/O digital twin simulation', status: 'Implemented' },
      { label: 'Modbus TCP communication (CODESYS ↔ Factory I/O)', status: 'Implemented' },
      { label: 'ESP32 sensor node architecture design', status: 'In Progress' },
      { label: 'Temperature sensor integration', status: 'Planned' },
      { label: 'Vibration sensor (ADXL345/MPU6050) integration', status: 'Planned' },
      { label: 'MQTT telemetry pipeline', status: 'Planned' },
      { label: 'SCADA/dashboard monitoring interface', status: 'Planned' },
      { label: 'Fault detection threshold logic', status: 'Planned' },
      { label: 'AI/ML anomaly detection model', status: 'Planned' },
      { label: 'Computer vision belt inspection', status: 'Planned' },
    ],
    highlights: [
      'PLC conveyor control and Factory I/O 3D digital twin as the validated simulation layer',
      'Sensor integration architecture designed for ESP32 with temperature and vibration sensing',
      'MQTT selected as the target IIoT protocol for telemetry data',
      'Predictive maintenance strategy based on threshold anomaly detection and trend analysis',
      'Long-term roadmap includes AI/ML anomaly detection',
    ],
    challenges: [
      'Bridging the gap between simulation (Factory I/O) and real sensor hardware integration',
      'Designing a reliable MQTT topic structure for multi-sensor conveyor telemetry',
      'Planning for low-latency fault detection without false positives on vibration data',
    ],
    futureWork: [
      'Complete ESP32 sensor node hardware integration',
      'Implement MQTT broker setup and telemetry pipeline',
      'Deploy a monitoring dashboard for real-time conveyor health',
      'Develop threshold-based fault alerting logic',
      'Explore ML-based anomaly detection on collected sensor time-series data',
    ],
    // The sorting video demonstrates the conveyor PLC/digital-twin layer this project builds on
    videos: [
      {
        id: '2pnFLqmh6X4',
        url: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
        embedUrl: 'https://www.youtube.com/embed/2pnFLqmh6X4',
        thumbnailUrl: 'https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg',
        label: 'Conveyor PLC Simulation Foundation (CODESYS + Factory I/O)',
      },
    ],
    primaryVideoId: '2pnFLqmh6X4',
    files: [
      { label: 'System Architecture Diagram', description: 'End-to-end block diagram: PLC → sensor → MQTT → dashboard', available: false },
      { label: 'CODESYS Project Files', description: 'Conveyor PLC ladder logic', available: false },
      { label: 'ESP32 Sensor Architecture Document', description: 'Hardware and firmware design plan', available: false },
    ],
    thumbnailPlaceholder: 'Activity',
    featured: true,
  },

  {
    id: 'plc-panel-experiments',
    title: 'PLC Panel and Control Experiments',
    subtitle: 'CODESYS and EPLAN — Digital I/O, Interlocking, and Sequencing Experiments',
    category: 'Industrial Control & Panel Engineering',
    tags: ['PLC', 'CODESYS', 'EPLAN', 'Control Panel', 'Interlocking', 'Ladder Logic'],
    software: ['CODESYS V3.5.22.30', 'EPLAN Electric P8'],
    status: 'In Progress',
    statusNote: 'A growing collection of documented control experiments — ongoing.',
    description:
      'A collection of distinct PLC control experiments covering digital I/O mapping, indicator lamps, pushbutton control, interlocking logic, and basic sequencing. Each experiment is documented as a standalone control exercise.',
    problemStatement:
      'Building fundamental PLC programming competence through progressive control experiments — from simple ON/OFF control to interlocked sequences.',
    objectives: [
      'Demonstrate NO and NC pushbutton input mapping in CODESYS',
      'Control indicator lamps and digital outputs based on input conditions',
      'Implement basic interlocking logic between multiple inputs and outputs',
      'Program timer-based sequencing for simple process control scenarios',
      'Document each experiment with screenshots and control logic explanation',
    ],
    highlights: [
      'NO/NC pushbutton control — understanding normally open and normally closed contact logic',
      'Indicator lamp control with latching and seal-in contacts',
      'Motor control logic: start, stop, and overload interlock simulation',
      'Basic sequencing: step-by-step output activation with timer transitions',
      'Input/output mapping using CODESYS virtual I/O configuration',
    ],
    challenges: [
      'Understanding the difference between NO/NC in software vs. physical wiring',
      'Debugging ladder logic when multiple interlocks interact unexpectedly',
    ],
    futureWork: [
      'Document each experiment as a standalone technical mini-report',
      'Add EPLAN control panel schematics for relevant experiments',
      'Progress to more complex interlocking with multiple motors and safety relays',
    ],
    files: [
      { label: 'Experiment Screenshots', description: 'CODESYS ladder logic screenshots per experiment', available: false },
    ],
    thumbnailPlaceholder: 'ToggleRight',
  },
];

// ─── Engineering Toolkit ─────────────────────────────────────────────────────

export const ENGINEERING_TOOLS: EngineeringTool[] = [
  {
    id: 'eplan',
    name: 'EPLAN Electric P8',
    vendor: 'EPLAN Software & Service',
    category: 'Electrical Design',
    level: 'Project Experience',
    description:
      'Used for industrial electrical schematics, single-line diagrams, terminal numbering, and electrical documentation. Applied in the 33/11 kV substation and DOL motor starter projects.',
    usedIn: ['substation-design', 'dol-motor-starter', 'plc-panel-experiments'],
    icon: 'FileText',
    logo: '/assets/logos/eplan.svg',
  },
  {
    id: 'codesys',
    name: 'CODESYS V3.5.22.30',
    vendor: '3S-Smart Software Solutions',
    category: 'PLC Programming & Simulation',
    level: 'Project Experience',
    description:
      'Primary PLC programming environment. Used for IEC 61131-3 Ladder Diagram development and soft-PLC simulation in the conveyor sorting system and control experiments.',
    usedIn: ['codesys-factory-io-sorting', 'pick-and-place', 'intelligent-conveyor-health', 'plc-panel-experiments'],
    icon: 'Cpu',
    logo: '/assets/logos/codesys.svg',
  },
  {
    id: 'ccw',
    name: 'Connected Components Workbench (CCW)',
    vendor: 'Rockwell Automation',
    category: 'PLC Programming & Simulation',
    level: 'Practiced',
    description:
      'Used for traffic light control sequencing and timer logic on the Rockwell Automation Micro800 PLC simulator, paired with FactoryTalk Optix Studio HMI.',
    usedIn: ['traffic-light-hmi'],
    icon: 'Settings',
    logo: '/assets/logos/ccw.svg',
  },
  {
    id: 'codesys-sim',
    name: 'CODESYS PLC Simulation',
    vendor: '3S-Smart Software Solutions',
    category: 'PLC Programming & Simulation',
    level: 'Project Experience',
    description:
      'CODESYS built-in soft-PLC simulation runtime used for testing ladder logic and control sequences without physical hardware.',
    usedIn: ['codesys-factory-io-sorting', 'plc-panel-experiments'],
    icon: 'Play',
    logo: '/assets/logos/codesys.svg',
  },
  {
    id: 'factory-io',
    name: 'Factory I/O',
    vendor: 'Real Games',
    category: 'Factory Simulation',
    level: 'Project Experience',
    description:
      'Virtual 3D factory simulation linked to CODESYS over Modbus TCP. Used for conveyor sorting, pick-and-place, and digital twin development.',
    usedIn: ['codesys-factory-io-sorting', 'pick-and-place', 'intelligent-conveyor-health'],
    icon: 'Factory',
    logo: '/assets/logos/factoryio.svg',
  },
  {
    id: 'optix-studio',
    name: 'FactoryTalk Optix Studio',
    vendor: 'Rockwell Automation',
    category: 'HMI & SCADA',
    level: 'Practiced',
    description:
      'HMI design platform used to create the traffic light operator interface — vectorized graphical elements with live PLC tag binding.',
    usedIn: ['traffic-light-hmi'],
    icon: 'Monitor',
    logo: '/assets/logos/optix-studio.svg',
  },
  {
    id: 'ignition',
    name: 'Ignition SCADA',
    vendor: 'Inductive Automation',
    category: 'HMI & SCADA',
    level: 'Exploring',
    description:
      'An area for future SCADA learning. Not yet applied in a completed project.',
    usedIn: [],
    icon: 'Radio',
    logo: '/assets/logos/ignition.svg',
  },
  {
    id: 'modbus-tcp',
    name: 'Modbus TCP',
    vendor: 'Open Standard',
    category: 'Industrial Communication',
    level: 'Project Experience',
    description:
      'Used as the live communication protocol between CODESYS soft-PLC and Factory I/O — with I/O register mapping for all digital inputs and outputs.',
    usedIn: ['codesys-factory-io-sorting', 'pick-and-place', 'intelligent-conveyor-health'],
    icon: 'Network',
    logo: '/assets/logos/modbus.svg',
  },
  {
    id: 'mqtt',
    name: 'MQTT',
    vendor: 'OASIS Standard',
    category: 'Industrial Communication',
    level: 'Exploring',
    description:
      'Target IIoT communication protocol for the intelligent conveyor health monitoring project. Architecture and topic design are in planning stage.',
    usedIn: ['intelligent-conveyor-health'],
    icon: 'MessageSquare',
    logo: '/assets/logos/mqtt.svg',
  },
  {
    id: 'opc-ua',
    name: 'OPC UA',
    vendor: 'OPC Foundation',
    category: 'Industrial Communication',
    level: 'Exploring',
    description:
      'Industrial interoperability standard being studied as part of the industrial networking learning journey. Not yet applied in a project.',
    usedIn: [],
    icon: 'Share2',
    logo: '/assets/logos/opcua.svg',
  },
];

// ─── Automation Roadmap ───────────────────────────────────────────────────────

export const AUTOMATION_ROADMAP: RoadmapStage[] = [
  {
    id: 'stage-1', order: 1,
    title: 'Electrical Schematics & Motor Control',
    tools: ['EPLAN Electric P8'],
    projects: ['DOL Motor Starter Design', 'Control Panel Experiments'],
    skills: ['Schematic drawing', 'Power circuit design', 'Control circuit design', 'Terminal numbering'],
    status: 'Completed',
    nextMilestone: 'Advance to more complex motor control designs (Star-Delta, reversing)',
  },
  {
    id: 'stage-2', order: 2,
    title: 'EPLAN Electrical Design',
    tools: ['EPLAN Electric P8'],
    projects: ['33/11 kV Substation Design', 'DOL Motor Starter Design'],
    skills: ['Single-line diagrams', 'EPLAN project structure', 'Symbol conventions', 'Electrical documentation'],
    status: 'Completed',
    nextMilestone: 'Create multi-feeder distribution schematic and add protective relay documentation',
  },
  {
    id: 'stage-3', order: 3,
    title: 'PLC Programming & Ladder Logic',
    tools: ['CODESYS V3.5', 'Connected Components Workbench'],
    projects: ['Conveyor Sorting System', 'Traffic Light Control', 'Control Experiments'],
    skills: ['IEC 61131-3 Ladder Diagram', 'State machine programming', 'Timer and counter logic', 'Interlocking'],
    status: 'In Progress',
    nextMilestone: 'Progress to Structured Text (ST) and Function Block Diagram (FBD) in CODESYS',
  },
  {
    id: 'stage-4', order: 4,
    title: 'PLC Simulation with Factory I/O',
    tools: ['Factory I/O', 'CODESYS V3.5'],
    projects: ['Conveyor Sorting', 'Pick and Place', 'Intelligent Conveyor Health'],
    skills: ['Virtual commissioning', 'Modbus TCP I/O mapping', '3D simulation control', 'Sensor-actuator logic'],
    status: 'In Progress',
    nextMilestone: 'Build more complex multi-station automation scenarios in Factory I/O',
  },
  {
    id: 'stage-5', order: 5,
    title: 'HMI Development',
    tools: ['FactoryTalk Optix Studio'],
    projects: ['Traffic Light Control HMI'],
    skills: ['HMI screen design', 'Tag binding', 'Status indication', 'Operator interface layout'],
    status: 'Practiced',
    nextMilestone: 'Design a complete control panel HMI for the conveyor monitoring project',
  },
  {
    id: 'stage-6', order: 6,
    title: 'SCADA Systems',
    tools: ['Ignition SCADA (exploring)'],
    projects: ['Intelligent Conveyor Health (planned dashboard)'],
    skills: ['SCADA architecture understanding', 'Tag-based data model', 'Alarm management concepts'],
    status: 'Exploring',
    nextMilestone: 'Set up a local Ignition SCADA environment and build a test screen',
  },
  {
    id: 'stage-7', order: 7,
    title: 'Industrial Networking & Protocols',
    tools: ['Modbus TCP', 'MQTT', 'OPC UA (studying)'],
    projects: ['Conveyor Sorting System (Modbus TCP)', 'Intelligent Conveyor Health (MQTT planned)'],
    skills: ['Modbus TCP register mapping', 'Network protocol fundamentals', 'MQTT topic architecture'],
    status: 'In Progress',
    nextMilestone: 'Implement the MQTT pipeline for the intelligent conveyor health project',
  },
  {
    id: 'stage-8', order: 8,
    title: 'Control Panel Design',
    tools: ['EPLAN Electric P8'],
    projects: ['DOL Motor Starter Design', 'Control Panel Experiments'],
    skills: ['Panel layout concepts', 'Wiring documentation', 'Component selection basics'],
    status: 'Practicing',
    nextMilestone: 'Design a multi-motor control panel with interlocking and safety relays',
  },
  {
    id: 'stage-9', order: 9,
    title: 'DCS & Substation Automation',
    tools: ['EPLAN Electric P8'],
    projects: ['33/11 kV Substation Design'],
    skills: ['Substation SLD design', 'Transformer and switchgear representation', 'Power system basics'],
    status: 'Exploring',
    nextMilestone: 'Study IEC 61850 substation communication standard concepts',
  },
  {
    id: 'stage-10', order: 10,
    title: 'IIoT & Predictive Maintenance',
    tools: ['ESP32', 'MQTT', 'CODESYS', 'Factory I/O'],
    projects: ['Intelligent Conveyor Belt Health Monitoring'],
    skills: ['IIoT architecture design', 'Sensor integration planning', 'Telemetry pipeline design'],
    status: 'In Progress',
    nextMilestone: 'Complete ESP32 sensor node integration and MQTT telemetry pipeline',
  },
  {
    id: 'stage-11', order: 11,
    title: 'Digital Twins & Intelligent Automation',
    tools: ['Factory I/O', 'CODESYS', 'AI/ML tools (planned)'],
    projects: ['Intelligent Conveyor Belt Health Monitoring'],
    skills: ['Digital twin simulation', 'Factory I/O scene design', 'Synchronisation with physical sensor data'],
    status: 'Exploring',
    nextMilestone: 'Synchronise Factory I/O simulation state with real ESP32 sensor readings',
  },
];

// ─── Industrial Protocols ─────────────────────────────────────────────────────

export const INDUSTRIAL_PROTOCOLS: IndustrialProtocol[] = [
  {
    id: 'modbus-tcp',
    name: 'Modbus TCP',
    shortName: 'Modbus TCP',
    purpose: 'Simple, open, master-slave register-based communication over TCP/IP',
    useCase: 'PLC-to-SCADA communication, sensor polling, HMI data exchange',
    model: 'Master-Slave (Client-Server over TCP/IP, port 502)',
    relatedProject: 'CODESYS + Factory I/O Conveyor Sorting System',
    status: 'Project Experience',
    logo: '/assets/logos/modbus.svg',
  },
  {
    id: 'mqtt',
    name: 'Message Queuing Telemetry Transport',
    shortName: 'MQTT',
    purpose: 'Lightweight publish-subscribe messaging for IIoT and telemetry',
    useCase: 'Sensor-to-cloud data streaming, predictive maintenance telemetry',
    model: 'Publish-Subscribe via MQTT Broker',
    relatedProject: 'Intelligent Conveyor Health Monitoring (Planned)',
    status: 'Exploring',
    logo: '/assets/logos/mqtt.svg',
  },
  {
    id: 'opc-ua',
    name: 'OPC Unified Architecture',
    shortName: 'OPC UA',
    purpose: 'Secure, platform-independent industrial data exchange and interoperability',
    useCase: 'PLC-to-SCADA integration, cross-vendor data sharing, Industry 4.0 connectivity',
    model: 'Client-Server with publish-subscribe extension',
    status: 'Exploring',
    logo: '/assets/logos/opcua.svg',
  },
  {
    id: 'profinet',
    name: 'PROFINET',
    shortName: 'PROFINET',
    purpose: 'High-speed, real-time Industrial Ethernet for Siemens PLC systems',
    useCase: 'Siemens TIA Portal PLC networks, distributed I/O (ET 200), motion control',
    model: 'Cyclic real-time communication over Ethernet',
    status: 'Studied',
    logo: '/assets/logos/profinet.svg',
  },
  {
    id: 'profibus',
    name: 'PROFIBUS-DP',
    shortName: 'PROFIBUS-DP',
    purpose: 'RS-485 fieldbus for distributed process I/O in industrial automation',
    useCase: 'Legacy PLC-to-field device communication, distributed I/O modules',
    model: 'Master-Slave over RS-485 (up to 12 Mbit/s)',
    status: 'Studied',
    logo: '/assets/logos/profibus.svg',
  },
  {
    id: 'ethernet-ip',
    name: 'EtherNet/IP',
    shortName: 'EtherNet/IP',
    purpose: 'Rockwell Automation CIP over standard Ethernet',
    useCase: 'Rockwell PLC networks, Allen-Bradley I/O, ControlLogix communication',
    model: 'CIP over Ethernet (TCP for messaging, UDP for I/O)',
    status: 'Studied',
    logo: '/assets/logos/ethernet-ip.svg',
  },
  {
    id: 'ethercat',
    name: 'EtherCAT',
    shortName: 'EtherCAT',
    purpose: 'Ultra-fast Ethernet-based fieldbus for motion control and synchronization',
    useCase: 'Servo drives, CNC machines, robotics requiring sub-millisecond cycle times',
    model: 'Master-Slave with on-the-fly frame processing',
    status: 'Studied',
    logo: '/assets/logos/ethercat.svg',
  },
  {
    id: 'canopen',
    name: 'CANopen',
    shortName: 'CANopen',
    purpose: 'Higher-layer protocol on CAN bus for embedded and motion control systems',
    useCase: 'Drive systems, robotic joints, agricultural machinery, vehicle networks',
    model: 'Master-Slave / Producer-Consumer over CAN bus',
    status: 'Studied',
    logo: '/assets/logos/canopen.svg',
  },
  {
    id: 'industrial-ethernet',
    name: 'Industrial Ethernet & TCP/IP',
    shortName: 'Industrial Ethernet',
    purpose: 'Foundation network layer for modern industrial communication protocols',
    useCase: 'All modern industrial networks (PROFINET, EtherNet/IP, EtherCAT, Modbus TCP)',
    model: 'Standard IEEE 802.3 Ethernet with industrial hardening',
    status: 'Studied',
    logo: '/assets/logos/industrial-ethernet.svg',
  },
];

// ─── Skills Dashboard ─────────────────────────────────────────────────────────

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Electrical Design',
    icon: 'Zap',
    skills: [
      { name: 'EPLAN Electric P8', level: 'Project Experience', note: 'SLD and motor control schematics' },
      { name: 'Single-line diagrams', level: 'Project Experience' },
      { name: 'Electrical schematics', level: 'Project Experience' },
      { name: 'Terminal numbering', level: 'Practiced' },
      { name: 'Motor control circuits', level: 'Project Experience' },
    ],
  },
  {
    category: 'PLC & Control',
    icon: 'Cpu',
    skills: [
      { name: 'CODESYS V3.5', level: 'Project Experience', note: 'Sorting, pick-and-place, experiments' },
      { name: 'Connected Components Workbench', level: 'Practiced', note: 'Traffic light project' },
      { name: 'Ladder Logic (LD)', level: 'Project Experience' },
      { name: 'PLC Simulation (Soft-PLC)', level: 'Project Experience' },
      { name: 'Digital I/O Mapping', level: 'Practiced' },
      { name: 'Timers & Sequence Control', level: 'Practiced' },
      { name: 'IEC 61131-3 Concepts', level: 'Familiar' },
    ],
  },
  {
    category: 'Factory Simulation',
    icon: 'Factory',
    skills: [
      { name: 'Factory I/O', level: 'Project Experience', note: 'Sorting, pick-and-place scenes' },
      { name: 'Conveyor Automation', level: 'Project Experience' },
      { name: 'Sensor & Actuator Interaction', level: 'Practiced' },
      { name: 'Sorting & Routing Sequences', level: 'Project Experience' },
      { name: 'Virtual Commissioning', level: 'Practiced' },
    ],
  },
  {
    category: 'HMI & SCADA',
    icon: 'Monitor',
    skills: [
      { name: 'FactoryTalk Optix Studio', level: 'Practiced', note: 'Traffic light HMI project' },
      { name: 'HMI Screen Design', level: 'Practiced' },
      { name: 'Tag Binding', level: 'Practiced' },
      { name: 'SCADA Concepts', level: 'Familiar' },
      { name: 'Ignition SCADA', level: 'Exploring' },
    ],
  },
  {
    category: 'Industrial Communication',
    icon: 'Network',
    skills: [
      { name: 'Modbus TCP', level: 'Project Experience', note: 'CODESYS ↔ Factory I/O' },
      { name: 'MQTT', level: 'Exploring', note: 'Planned for conveyor health project' },
      { name: 'OPC UA', level: 'Exploring' },
      { name: 'PROFINET', level: 'Familiar', note: 'Studied' },
      { name: 'PROFIBUS-DP', level: 'Familiar', note: 'Studied' },
      { name: 'EtherNet/IP', level: 'Familiar', note: 'Studied' },
      { name: 'EtherCAT', level: 'Familiar', note: 'Studied' },
      { name: 'CANopen', level: 'Familiar', note: 'Studied' },
    ],
  },
  {
    category: 'Advanced Automation',
    icon: 'Activity',
    skills: [
      { name: 'DCS Fundamentals', level: 'Familiar' },
      { name: 'Substation Automation', level: 'Familiar', note: '33/11 kV design project' },
      { name: 'Industrial IoT Architecture', level: 'Exploring' },
      { name: 'Predictive Maintenance Concepts', level: 'Exploring' },
      { name: 'Digital Twins', level: 'Exploring', note: 'Factory I/O as digital twin layer' },
    ],
  },
];

// ─── Documentation Library ────────────────────────────────────────────────────

export const DOCUMENTATION_ITEMS: DocumentationItem[] = [
  {
    id: 'sld-substation',
    title: '33/11 kV Substation Single-Line Diagram',
    description: 'EPLAN-generated SLD showing 33 kV feeders, power transformer, and 11 kV outgoing feeders.',
    category: 'Electrical Design',
    available: false,
    previewNote: 'EPLAN drawing to be uploaded',
  },
  {
    id: 'dol-power',
    title: 'DOL Starter Power Circuit Schematic',
    description: 'Three-phase power circuit with main contactor, overload relay, and motor terminals.',
    category: 'Electrical Design',
    available: false,
    previewNote: 'EPLAN schematic to be uploaded',
  },
  {
    id: 'dol-control',
    title: 'DOL Starter Control Circuit Schematic',
    description: 'Start/stop pushbutton control circuit with contactor seal-in and overload trip.',
    category: 'Electrical Design',
    available: false,
    previewNote: 'EPLAN schematic to be uploaded',
  },
  {
    id: 'codesys-sorting-logic',
    title: 'CODESYS Conveyor Sorting Ladder Logic',
    description: 'IEC 61131-3 Ladder Diagram screenshots — state machine, sensor inputs, conveyor motor, pusher actuation.',
    category: 'PLC Logic',
    available: true,
    previewNote: 'Available via YouTube video',
    url: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
  },
  {
    id: 'codesys-pick-place',
    title: 'Pick and Place PLC Ladder Logic',
    description: 'Multi-axis pneumatic gantry sequencing ladder logic — X/Y/Z motion and vacuum gripper actuation.',
    category: 'PLC Logic',
    available: true,
    previewNote: 'Available via YouTube video',
    url: 'https://www.youtube.com/watch?v=dYKsfDnsj9A',
  },
  {
    id: 'factory-io-sorting',
    title: 'Factory I/O Conveyor Sorting Scene',
    description: 'Factory I/O 3D simulation — conveyor, sensors, pneumatic diverters, and discharge lanes.',
    category: 'Factory Simulation',
    available: true,
    previewNote: 'Available via YouTube video',
    url: 'https://www.youtube.com/watch?v=2pnFLqmh6X4',
  },
  {
    id: 'factory-io-box-sorting',
    title: 'Factory I/O Box Sorting Multi-Lane Scene',
    description: 'Multi-lane PLC-controlled box classification and routing via pneumatic pusher gates.',
    category: 'Factory Simulation',
    available: true,
    previewNote: 'Available via YouTube video',
    url: 'https://www.youtube.com/watch?v=pPgJaU0IWfU',
  },
  {
    id: 'traffic-light-hmi-screen',
    title: 'FactoryTalk Optix HMI — Traffic Light',
    description: 'HMI operator interface: traffic signal states, pedestrian crossing button, status indicators.',
    category: 'HMI & SCADA',
    available: true,
    previewNote: 'Available via YouTube video',
    url: 'https://www.youtube.com/watch?v=qIJbTBcBfjE',
  },
  {
    id: 'conveyor-health-architecture',
    title: 'Intelligent Conveyor Health System Architecture',
    description: 'End-to-end block diagram: PLC → Factory I/O → ESP32 → MQTT → Dashboard.',
    category: 'System Architecture',
    available: false,
    previewNote: 'Architecture diagram to be created',
  },
  {
    id: 'modbus-io-map',
    title: 'Modbus TCP I/O Register Map',
    description: 'Input/output register address mapping between CODESYS variable table and Factory I/O signal interface.',
    category: 'System Architecture',
    available: false,
    previewNote: 'Technical document to be uploaded',
  },
];

// ─── Project Category Filters ─────────────────────────────────────────────────

export const PROJECT_CATEGORIES = [
  'All',
  'Electrical Design & Power Systems',
  'Motor Control & Electrical Design',
  'PLC Programming & Factory Automation',
  'PLC Programming & HMI',
  'Industrial IoT & Predictive Maintenance',
  'Industrial Control & Panel Engineering',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
