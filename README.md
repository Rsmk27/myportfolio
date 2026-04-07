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
│   │   ├── MediaLoader.tsx      # Media loading with fallback
│   │   └── electric-card.tsx    # Themed card component
│   ├── CertificationsBlock.tsx  # Certifications display
│   ├── ContactInterface.tsx     # Contact section with social links
│   ├── EducationBlock.tsx       # Education timeline
│   ├── ExperienceTimeline.tsx   # Work experience timeline
│   ├── HeroCircuit.tsx          # Animated hero circuit background
│   ├── LoadingScreen.tsx        # Initial loading animation
│   ├── Oscilloscope.tsx         # Oscilloscope-style visualizer
│   ├── PCBBackground.tsx        # PCB trace background animation
│   ├── PowerSwitch.tsx          # Interactive power switch
│   ├── ProjectChip.tsx          # Project card with chip design
│   ├── SkillBreadboard.tsx      # Skills visualization as breadboard
│   ├── SystemFlow.tsx           # System flow diagram
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
| `HeroCircuit` | Hero section with animated circuit board design |
| `PowerSwitch` | Interactive power switch to activate the site |
| `LoadingScreen` | Initial boot-up loading animation |
| `Oscilloscope` | Oscilloscope-style wave visualization |

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

### **UI Components**

| Component | Purpose |
|-----------|---------|
| `electric-card` | Themed card component with electrical styling |
| `MediaLoader` | Smart media loader with fallback support |

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

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rsmk27/myportfolio.git
   cd myportfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env.local` file if needed:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000` (configured in `vite.config.ts`)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 (customized in vite.config.ts) |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |

---

## 🌐 Deployment

This project is configured for deployment on **Vercel** with zero configuration.

### **Deploy to Vercel**

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and deploy

### **Deploy to Other Platforms**

Build the application:
```bash
npm run build
```

The production files will be in the `dist/` directory. Deploy this folder to any static hosting service.

---

## 🎨 Customization

### **Update Personal Information**

Edit `constants.tsx` to customize:
- Profile information (`PROFILE`)
- Projects (`PROJECTS`)
- Skills (`SKILLS`)
- Experience (`EXPERIENCE`)
- Education (`EDUCATION`)

### **Styling**

- Global styles: `index.css`
- Tailwind configuration: Inline in components
- Theme colors: `PCB_COLORS` in `constants.tsx`

---

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
Made with ⚡ by RSMK| Powered by React + TypeScript + Vite
</div>
