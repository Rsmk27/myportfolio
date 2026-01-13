
export const projectsData = {
    "budget-buddy": {
        category: "FINTECH / WEB APPLICATION",
        title: "Budget Buddy",
        tagline: "A \"vibe coded\" expense tracker that transforms personal finance into an intuitive, real-time visual experience.",
        techStack: ["React Ecosystem", "Firebase", "Chart.js", "Google Auth"],
        actions: [
            { label: "Live Demo", link: "https://budgetbuddy.rsmk.co.in/", icon: "fas fa-external-link-alt" },
            { label: "GitHub Repo", link: "https://github.com/Rsmk27/BudgetBuddy", icon: "fab fa-github" }
        ],
        heroImage: "/assets/budget-buddy-expense-tracker-app.webp",
        sections: [
            {
                title: "01. The Problem",
                content: "Personal finance tracking is often viewed by students and young professionals as tedious, complex, or aesthetically unappealing. Traditional spreadsheet methods lack engagement (\"vibes\"), while complex banking apps can be overwhelming. This friction leads to poor financial habits and a lack of awareness regarding personal spending patterns."
            },
            {
                title: "02. The Solution",
                content: "Budget Buddy bridges the gap between financial utility and modern design. It is a secure, serverless web application that offers real-time expense tracking with instant visual feedback. By prioritizing user experience (UX) and data visualization, it encourages users to actively engage with their finances rather than avoiding them."
            },
            {
                title: "03. System Architecture",
                content: "The application follows a serverless architecture leveraging Firebase for backend services to ensure scalability and real-time performance.",
                type: "diagram",
                diagramItems: ["Client (React/JS)", "Firebase Auth", "Firestore DB", "Chart.js Renderer"],
                diagramCaption: "Figure 1: Data Flow & Component Interaction"
            },
            {
                title: "04. Implementation Details",
                type: "grid",
                gridItems: [
                    { title: "Authentication & Security", icon: "fas fa-shield-alt", desc: "Implemented <strong>Google OAuth</strong> via Firebase Authentication to provide secure, passwordless login and session management." },
                    { title: "Real-time Database", icon: "fas fa-database", desc: "Utilized <strong>Cloud Firestore</strong> for NoSQL document storage, enabling instant synchronization of expense data across devices without page reloads." },
                    { title: "Data Visualization", icon: "fas fa-chart-pie", desc: "Integrated <strong>Chart.js</strong> to dynamically parse expense arrays and render interactive doughnut and bar charts for category-wise analysis." }
                ]
            },
            {
                title: "05. Results & Impact",
                type: "stats",
                stats: [
                    { value: "100%", label: "Real-time Sync" },
                    { value: "Secure", label: "Google Auth" },
                    { value: "Mobile", label: "Responsive UI" }
                ],
                description: "The platform successfully simplifies the entry barrier for personal finance tracking, providing users with immediate insights into their economic behavior."
            },
            {
                title: "06. Challenges & Learnings",
                type: "challenges",
                challenges: [
                    { title: "Challenge: Asynchronous Data Handling", problem: "Rendering charts before data fetch completion caused empty states or errors.", solution: "Implemented async/await patterns with loading skeletons to ensure data integrity before rendering components." },
                    { title: "Challenge: Mobile Responsiveness", problem: "Complex data tables and charts were difficult to view on mobile screens.", solution: "Designed a mobile-first card layout for transactions and responsive canvas resizing for charts." }
                ]
            },
            {
                title: "07. Future Improvements",
                type: "list",
                items: [
                    "<strong>AI Insights:</strong> Integrate LLMs to analyze spending patterns and suggest budget improvements.",
                    "<strong>Export Functionality:</strong> Allow users to download monthly reports as PDF or CSV.",
                    "<strong>Budget Alerts:</strong> Implement push notifications when category limits are approached."
                ]
            },
            {
                title: "08. Resources",
                type: "actions",
                actions: [
                    { label: "View Source Code", link: "https://github.com/Rsmk27/BudgetBuddy", icon: "fab fa-github" },
                    { label: "Live Demo", link: "https://budgetbuddy.rsmk.co.in/", icon: "fas fa-external-link-alt" }
                ]
            }
        ],
        cta: {
            title: "Building a FinTech product?",
            text: "I specialize in building secure, interactive web applications. Let's discuss your project."
        }
    },
    "color-ohm": {
        category: "ENGINEERING TOOL / WEB UTILITY",
        title: "ColorOhm (OhmDecoder)",
        tagline: "An instant, visual resistor color code calculator that functions like a digital multimeter for your browser.",
        techStack: ["JavaScript (ES6+)", "DOM Manipulation", "CSS3 Variables", "Responsive Design"],
        actions: [
            { label: "Live Tool", link: "https://colorohm.rsmk.me/", icon: "fas fa-external-link-alt" },
            { label: "GitHub Repo", link: "#", icon: "fab fa-github" }
        ],
        heroImage: "/assets/color-ohm-resistor-calculator-tool.webp",
        sections: [
            {
                title: "01. The Problem",
                content: "Calculating resistor values manually from color bands is a foundational skill for electrical engineers, but during rapid prototyping or repair, it is slow, prone to human error, and disrupts the workflow. Existing online calculators often lack visual feedback or support for 5-band precision resistors, making them feel like static forms rather than engineering tools."
            },
            {
                title: "02. The Solution",
                content: "ColorOhm is designed to replace the physical reference chart. It provides a dynamic, visual interface where users interact with a virtual resistor. As you select colors, the resistor updates in real-time, effectively simulating the component you are holding. It supports both 4-band and 5-band standards, calculating resistance and tolerance instantly."
            },
            {
                title: "03. Logic Flow",
                content: "The application relies on a pure client-side architecture for zero-latency calculation.",
                type: "diagram",
                diagramItems: ["User Input (Color Click)", "State Manager", "Ohm's Calculation Engine", "DOM Update (Visuals + Text)"],
                diagramCaption: "Figure 1: Event-Driven Calculation Logic"
            },
            {
                title: "04. Implementation Details",
                type: "grid",
                gridItems: [
                    { title: "Dynamic DOM", icon: "fas fa-code", desc: "Heavy use of <strong>Vanilla JavaScript</strong> to listen for click events on color bands and immediately update the SVG/CSS representation of the resistor." },
                    { title: "CSS Variables", icon: "fas fa-palette", desc: "Utilized <strong>CSS Custom Properties</strong> to map color names to exact hex codes, allowing the \"painting\" of the resistor to be handled efficiently by the stylesheet." },
                    { title: "Calculation Logic", icon: "fas fa-calculator", desc: "Implemented robust math functions to handle floating-point precision regarding multipliers (kΩ, MΩ) and tolerance percentages." }
                ]
            },
            {
                title: "05. User Experience & Impact",
                type: "stats",
                stats: [
                    { value: "0ms", label: "Server Latency" },
                    { value: "2 Modes", label: "4 & 5 Band" },
                    { value: "100%", label: "Accuracy" }
                ],
                description: "Engineers can now double-check component values across standard E12/E24 series without breaking their flow state."
            },
            {
                title: "06. Challenges & Learnings",
                type: "challenges",
                challenges: [
                    { title: "Challenge: Floating Point Errors", problem: "JavaScript's floating point math occasionally returned values like 4.700000001 kΩ.", solution: "Implemented a precision formatting utility to round to significant figures appropriate for resistor marking standards." },
                    { title: "Challenge: Responsive Visualization", problem: "The resistor graphic looked distorted on smaller mobile screens.", solution: "Used scalable vector graphics (SVG) principles and fluid CSS typography to ensure the component looks realistic on any device." }
                ]
            },
            {
                title: "07. Future Improvements",
                type: "list",
                items: [
                    "<strong>Reverse Lookup:</strong> Enter a resistance value (e.g., \"10k\") and get the color code.",
                    "<strong>SMD Code Support:</strong> Add a calculator for Surface Mount Device 3/4 digit codes.",
                    "<strong>Inventory Check:</strong> Link standard values to a \"Buy\" or \"Check Inventory\" API."
                ]
            },
            {
                title: "08. Resources",
                type: "actions",
                actions: [
                    { label: "View Source Code", link: "#", icon: "fab fa-github" },
                    { label: "Live Tool", link: "https://colorohm.rsmk.me/", icon: "fas fa-external-link-alt" }
                ]
            }
        ],
        cta: {
            title: "Need a custom engineering tool?",
            text: "I build web utilities that solve real hardware problems. Let's connect."
        }
    },
    "smart-exhaust": {
        category: "IOT / SAFETY AUTOMATION",
        title: "Smart Exhaust System",
        tagline: "An intelligent safety system that detects hazardous gas leaks and automatically triggers active ventilation.",
        techStack: ["Arduino Uno", "C++ (Embedded)", "MQ-2 Gas Sensor", "Relay Logic"],
        actions: [
            { label: "Live Demo", link: "https://autoexhaustfan.rsmk.co.in/", icon: "fas fa-external-link-alt" },
            { label: "GitHub Repo", link: "#", icon: "fab fa-github" }
        ],
        heroImage: "/assets/smart-exhaust-gas-detection-system.webp",
        sections: [
            {
                title: "01. The Problem",
                content: "In domestic kitchens and industrial environments, gas leaks (LPG, smoke, carbon monoxide) pose silent but deadly risks. Passive ventilation is often insufficient to clear a room quickly during a leak, and manual intervention requires a human to enter a hazardous zone. There is a need for a reactive, autonomous system that mitigates the danger the moment it is detected."
            },
            {
                title: "02. The Solution",
                content: "The Smart Exhaust System acts as an active guardian. Using a sensitive MQ-2 gas sensor, it continuously monitors air quality. Upon detecting a threshold breach, it bypasses the need for human action and instantly triggers a high-power exhaust fan via a relay module. It also features a manual override, ensuring the user retains ultimate control over the system."
            },
            {
                title: "03. System Architecture",
                content: "The system operates on a closed-loop control cycle managed by the microcontroller.",
                type: "diagram",
                diagramItems: ["Environment", "MQ-2 Sensor", "Arduino (Decision)", "Relay -> Fan"],
                diagramCaption: "Figure 1: Hardware Control Loop"
            },
            {
                title: "04. Implementation Details",
                type: "grid",
                gridItems: [
                    { title: "Analog Sensing", icon: "fas fa-microchip", desc: "The <strong>MQ-2 Sensor</strong> provides variable analog voltage output based on gas concentration, which is read by the Arduino's ADC (Analog-to-Digital Converter)." },
                    { title: "Threshold Logic", icon: "fas fa-code-branch", desc: "Implemented a dynamic threshold in C++. If <code>sensorValue > safeLimit</code>, the system enters ALARM state, activating the relay and status LEDs." },
                    { title: "Electrical Isolation", icon: "fas fa-toggle-on", desc: "Used an opto-isolated <strong>Relay Module</strong> to safely control the high-voltage (AC 220V) exhaust fan from the low-voltage (5V) logic circuit." }
                ]
            },
            {
                title: "05. Results & Impact",
                type: "stats",
                stats: [
                    { value: "< 2s", label: "Response Time" },
                    { value: "Auto", label: "Safety Shutoff" },
                    { value: "Dual", label: "Hybrid Mode" }
                ],
                description: "The prototype successfully cleared smoke from a test chamber 3x faster than passive ventilation."
            },
            {
                title: "06. Challenges & Learnings",
                type: "challenges",
                challenges: [
                    { title: "Challenge: Sensor Calibration", problem: "The MQ-2 sensor requires pre-heating and is sensitive to temperature changes, causing false triggers.", solution: "Implemented a \"warm-up\" delay in the boot code and calibrated the threshold value in fresh air before deployment." },
                    { title: "Challenge: Relay Chattering", problem: "When gas levels were exactly at the threshold, the fan would rapidly switch on and off.", solution: "Added software hysteresis (a gap between the turn-on and turn-off values) to stabilize the control loop." }
                ]
            },
            {
                title: "07. Future Improvements",
                type: "list",
                items: [
                    "<strong>IoT Integration:</strong> Add an ESP8266 to send push notifications to a smartphone when a leak is detected.",
                    "<strong>Gas Shutoff Valve:</strong> Integrate a solenoid valve to physically cut off the gas supply, not just vent the room.",
                    "<strong>LCD Display:</strong> Show real-time PPM (Parts Per Million) levels."
                ]
            },
            {
                title: "08. Resources",
                type: "actions",
                actions: [
                    { label: "View Source Code", link: "#", icon: "fab fa-github" },
                    { label: "Project Demo", link: "https://autoexhaustfan.rsmk.co.in/", icon: "fas fa-external-link-alt" }
                ]
            }
        ],
        cta: {
            title: "Interested in home automation?",
            text: "I design embedded systems that enhance interactions with our physical environment. Let's talk."
        }
    },
    "solar-dewatering": {
        category: "GREEN TECH / EMBEDDED SYSTEMS",
        title: "Solar Dewatering System",
        tagline: "An autonomous, dual-axis solar tracking pump designed to maximize renewable energy value for off-grid irrigation.",
        techStack: ["Arduino", "Servo Motors", "LDR Sensors", "Solar PV"],
        actions: [
            { label: "Live Demo", link: "https://spds.rsmk.me", icon: "fas fa-external-link-alt" },
            { label: "GitHub Repo", link: "#", icon: "fab fa-github" }
        ],
        heroImage: "/assets/ai-chatbot-interface-background.webp",
        sections: [
            {
                title: "01. The Problem",
                content: "Remote agriculture and dewatering sites often lack reliable grid power. While solar pumps are a viable alternative, standard fixed-panel setups lose significant efficiency (up to 40%) because panels are not aligned with the sun throughout the day. Additionally, manual pump operation leads to water wastage or insufficient irrigation."
            },
            {
                title: "02. The Solution",
                content: "The Solar Power Dewatering System (SPDS) is a fully autonomous solution. It integrates a <strong>Dual-Axis Solar Tracker</strong> that actively follows the sun's position from East to West and adjusts elevation for seasonal changes. Coupled with standard soil moisture sensors, the system ensures water is pumped only when necessary, maximizing both energy capture and water conservation."
            },
            {
                title: "03. System Architecture",
                content: "The system fuses mechanical control (tracking) with environmental sensing (moisture).",
                type: "diagram",
                diagramItems: ["LDR Array (Eyes)", "Arduino (Brain)", "Servos (Muscles)", "+", "Pump Control"],
                diagramCaption: "Figure 1: Sensor-Actuator Control Flow"
            },
            {
                title: "04. Implementation Details",
                type: "grid",
                gridItems: [
                    { title: "Solar Tracking", icon: "fas fa-solar-panel", desc: "Designed a differential logic using 4 LDRs (Light Dependent Resistors). The Arduino compares light intensity values (Top vs. Bottom, Left vs. Right) to drive the servo motors toward the brightest point." },
                    { title: "Smart Irrigation", icon: "fas fa-tint", desc: "The pump subsystem is triggered only when soil moisture acts as a \"Gate\". Even if solar power is available, water is not wasted if the soil is already wet." },
                    { title: "Mechanical Design", icon: "fas fa-cogs", desc: "Built a custom dual-axis gimbal mechanism using high-torque servos to support the weight of the PV panel prototype." }
                ]
            },
            {
                title: "05. Results & Impact",
                type: "stats",
                stats: [
                    { value: "+35%", label: "Energy Gen" },
                    { value: "Auto", label: "Irrigation" },
                    { value: "100%", label: "Off-Grid" }
                ],
                description: "The tracking mechanism significantly extended the \"peak power\" window of the solar panel, allowing the pump to operate for more hours per day."
            },
            {
                title: "06. Challenges & Learnings",
                type: "challenges",
                challenges: [
                    { title: "Challenge: Jittery Movement", problem: "Cloud cover caused rapidly fluctuating LDR readings, making the servos jitter.", solution: "Implementation of a software \"deadband\" (tolerance range) so small changes in light do not trigger movement." },
                    { title: "Challenge: Power Consumption", problem: "The servos themselves consumed power, potentially negating the gain from tracking.", solution: "Optimized the code to update position only every few minutes rather than continuously, drastically reducing idle power draw." }
                ]
            },
            {
                title: "07. Future Improvements",
                type: "list",
                items: [
                    "<strong>MPPT Controller:</strong> Integrate Maximum Power Point Tracking for electrical efficiency.",
                    "<strong>Weather Protection:</strong> Add a \"stow\" mode to flatten panels during high winds.",
                    "<strong>Remote Dashboard:</strong> LoRaWAN integration for long-range monitoring."
                ]
            },
            {
                title: "08. Resources",
                type: "actions",
                actions: [
                    { label: "View Source Code", link: "#", icon: "fab fa-github" },
                    { label: "Live Demo", link: "https://spds.rsmk.me", icon: "fas fa-external-link-alt" }
                ]
            }
        ],
        cta: {
            title: "Building sustainable tech?",
            text: "I am passionate about green energy engineering. Let's collaborate on impactful solutions."
        }
    }
};
