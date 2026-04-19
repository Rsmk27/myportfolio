# 🚀 RSMK's Portfolio

*An Electrical & Electronics Engineering Portfolio with a futuristic PCB-themed design*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

VoltEngineer Portfolio is a modern, interactive portfolio website showcasing electrical and electronics engineering projects, skills, and experience. The design features a unique PCB (Printed Circuit Board) aesthetic with animated components, creating an immersive electrical engineering theme.

**Live Demo:** [Portfolio Website](https://myportfolio-rsmk27.vercel.app)

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **React** (v18.3.1) - UI library for building component-based interfaces
- **TypeScript** (v5.8.2) - Type-safe JavaScript superset
- **React Router DOM** (v7.13.0) - Client-side routing and navigation

### **Styling & UI**
- **TailwindCSS** (v4.1.18) - Utility-first CSS framework
- **Framer Motion** (v12.28.2) - Animation library for smooth transitions
- **Lucide React** (v0.562.0) - Icon library with electrical/technical icons

### **Build Tools**
- **Vite** (v6.2.0) - Fast build tool and dev server
- **PostCSS** (v8.5.6) - CSS processing and transformations
- **Autoprefixer** (v10.4.23) - CSS vendor prefix automation

### **Additional Libraries**
- **React Helmet Async** (v2.0.5) - SEO and document head management

### **Development Tools**
- **@vitejs/plugin-react** - Vite React plugin
- **@types/react** & **@types/react-dom** - TypeScript type definitions
- **@types/node** - Node.js type definitions

---

## 📁 Project Structure

```
myportfolio/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   │   ├── DomeGallery.tsx      # 3D Dome Gallery for project images
│   │   ├── GlareHover.tsx       # Glare effect wrapper
│   │   ├── MediaLoader.tsx      # Media loading with fallback
│   │   └── electric-card.tsx    # Themed card component
│   ├── CertificationsBlock.tsx  # Certifications display
│   ├── ContactInterface.tsx     # Contact section with social links
│   ├── CustomCursor.tsx         # Custom animated cursor
│   ├── EasterEgg.tsx            # Hidden easter eggs and interactions
│   ├── EducationBlock.tsx       # Education timeline
│   ├── ExperienceTimeline.tsx   # Work experience timeline
│   ├── LoadingScreen.tsx        # Initial loading animation
│   ├── Oscilloscope.tsx         # Oscilloscope-style visualizer
│   ├── PCBBackground.tsx        # PCB trace background animation
│   ├── PortfolioChat.tsx        # AI-powered terminal chatbot
│   ├── PowerSwitch.tsx          # Interactive power switch
│   ├── ProjectChip.tsx          # Project card with chip design
│   ├── SkillBreadboard.tsx      # Skills visualization as breadboard
│   └── TimelineSystem.tsx       # Combined timeline component
│
├── pages/               # Route page components
│   ├── Home.tsx         # Main landing page
│   ├── Gallery.tsx      # Project gallery view
│   └── ProjectDetails.tsx # Individual project detail page
│
├── public/              # Static assets
│   └── assets/          # Images, videos, documents
│
├── App.tsx              # Root application component
├── index.tsx            # Application entry point
├── constants.tsx        # App constants (projects, profile, skills)
├── types.ts             # TypeScript type definitions
├── index.css            # Global styles and Tailwind imports
├── index.html           # HTML template
├── metadata.json        # App metadata
│
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # Vercel deployment configuration
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## 🧩 Components

### **Core Components**

| Component | Purpose |
|-----------|---------|
| `PCBBackground` | Animated PCB trace background with circuit patterns |
| `PowerSwitch` | Interactive power switch to activate the site |
| `LoadingScreen` | Initial boot-up loading animation |
| `Oscilloscope` | Oscilloscope-style wave visualization |
| `CustomCursor` | Custom animated cursor overlay |
| `EasterEgg` | Hidden interactions and shortcuts across the app |

### **Content Components**

| Component | Purpose |
|-----------|---------|
| `ProjectChip` | Displays projects in chip/IC package design |
| `SkillBreadboard` | Shows skills as components on a breadboard |
| `TimelineSystem` | Unified timeline for experience and education |
| `ExperienceTimeline` | Work experience with technical details |
| `EducationBlock` | Educational background display |
| `CertificationsBlock` | Certifications and achievements |
| `ContactInterface` | Contact section with social media links |
| `PortfolioChat` | AI-powered interactive terminal chatbot interface |

### **UI Components**

| Component | Purpose |
|-----------|---------|
| `electric-card` | Themed card component with electrical styling |
| `MediaLoader` | Smart media loader with fallback support |
| `DomeGallery` | 3D dome-style gallery for viewing project assets |
| `GlareHover` | Adds an interactive glare effect to elements |

### **Pages**

| Page | Route | Description |
|------|-------|-------------|
| `Home` | `/` | Main portfolio landing page |
| `Gallery` | `/gallery` | Project gallery with filtering |
| `ProjectDetails` | `/project/:id` | Detailed project view with images |

---

## ✨ Features

### **Design & UX**
- 🎨 **PCB-Themed Design** - Unique electrical engineering aesthetic
- ⚡ **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Mobile-first design approach
- 🌙 **Dark Mode** - Optimized for dark backgrounds
- 🔌 **Interactive Power Switch** - Boot-up sequence simulation
- 🤖 **AI Chatbot** - Integrated AI assistant mapped to Hugging Face API
- ✨ **Interactive Extras** - Custom cursor, 3D Dome Gallery, and hidden easter eggs

### **Technical Features**
- 🚀 **Fast Loading** - Optimized with Vite and lazy loading
- 📊 **Dynamic Content** - All content managed via constants
- 🔍 **SEO Optimized** - Meta tags with React Helmet Async
- 🎯 **Type Safe** - Full TypeScript implementation
- 📦 **Component Reusability** - Modular architecture

### **Portfolio Sections**
- 👤 **Hero Section** - Profile introduction with circuit animation
- 💼 **Experience** - Professional work history
- 🎓 **Education** - Academic background
- 🚀 **Projects** - Detailed project showcases
- 🛠️ **Skills** - Technical skills visualization
- 📜 **Certifications** - Achievements and certifications
- 📧 **Contact** - Social links and contact information

---

## 📄 License

This project is open source and available for personal and educational use.

---

## 👤 Author

**Srinivasa Manikanta**

- GitHub: [@Rsmk27](https://github.com/Rsmk27)
- LinkedIn: [rsmk27](https://linkedin.com/in/rsmk27)
- Email: srinivasmanikantarajapantula@gmail.com

---

<div align="center">
Made with ⚡ by RSMK
</div>
