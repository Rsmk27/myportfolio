# Technical Analysis Report: UI & Interactions Audit

**Target Codebase**: `d:\websites\git clone\myportfolio`  
**Auditor**: Teamwork Explorer Agent (UI & Interactions Specialist)  
**Date**: 2026-11-11  
**Project Tech Stack**: React 18, TypeScript 5.8, Tailwind CSS v4, Framer Motion 12, GSAP 3, Lenis 1.3, Vite 6, Lucide React

---

## Executive Summary

A comprehensive, read-only architectural and interface audit of the portfolio codebase was conducted, scrutinizing visual design, layout consistency, typography, color contrast, responsive breakpoints (mobile, tablet, desktop), CSS/Tailwind classes, theme support (power grid toggle ONLINE vs. STANDBY mode), visual polish, layout shifts, overflow hazards, animations, hover/focus/active states, accessibility (keyboard navigation, ARIA attributes, focus management, touch targets), modals, buttons, forms, and interactive widgets.

The portfolio demonstrates an exceptionally high caliber of creative frontend engineering, featuring custom PCB circuit visualizations, sci-fi HUD elements, multi-state custom cursors, smooth momentum scrolling, dynamic GSAP masonry layouts, interactive terminal emulators, and rich media galleries (PDFs, MP4s, YouTube embeds).

However, the audit identified **1 Critical contrast flaw** in the power grid toggle mechanism, **3 High-priority interaction/accessibility/overflow issues**, **4 Medium-priority accessibility/typography issues**, and **3 Low-priority visual refinement opportunities**.

---

## 1. Inventory of Pages, Components & Styles

### 1.1 Pages & Routes
| Route | Page Component | File Path | Primary UI & Interaction Features |
|---|---|---|---|
| `/` | `Home` | `pages/Home.tsx` | Hero avatar with orbital dashed rings, floating liquid glass navbar, interactive power grid toggle, infinite scrolling project carousel with drag/pause controls, skills bento grid, 3-tier credentials carousel, laser timeline, dual-panel contact/AI terminal, footer. |
| `/gallery` | `Gallery` | `pages/Gallery.tsx` | Full-screen responsive photo gallery, 6 category filter pills with badge counters, GSAP-powered dynamic masonry grid, interactive lightbox modal with keyboard navigation (Arrows/Escape), image index tracking, and rich captions. |
| `/automation`<br>`/videos` | `IndustrialPortfolio` | `pages/IndustrialPortfolio.tsx` | Engineering portfolio dashboard, interactive category filter + live search input, project cards with embedded YouTube players, software/protocol matrix with vendor SVG logos, expandable roadmap accordion, expandable protocol drawers, documentation library with status filters, project detail modal. |
| `*` | `NotFound` | `pages/NotFound.tsx` | Cyberpunk 404 page with scanline CRT overlay, duotone glowing gradient numbers, back navigation buttons, and simulated terminal readout with pulsing cursor. |

### 1.2 Core Components & Interactive Elements
| Component | File Path | UI & Interaction Role |
|---|---|---|
| `PCBBackground` | `components/PCBBackground.tsx` | Fixed background canvas with SVG PCB circuit traces, animated linear pulse lines, radial cyan ambient lighting, and subtle grid pattern. Responsive with mobile detection. |
| `ProjectChip` | `components/ProjectChip.tsx` | Hardware IC/resistor package design with copper lead aesthetics, dynamic color-coded award badges, live system specs overlay on hover, quick code/live links, and tech stack chips. |
| `SkillBreadboard` | `components/SkillBreadboard.tsx` | Bento grid of 5 engineering skill categories with real SVG/PNG logos, reactive ambient glow that morphs with active category, and bottom filter pills. |
| `CertificationsBlock`| `components/CertificationsBlock.tsx` | 3 credential rows (Professional, Internships, Coursework) with draggable horizontal tracks, issuer logos, verified badges, and `GalleryModal` supporting high-res images, embedded PDFs, and MP4 demo videos. |
| `TimelineSystem` | `components/TimelineSystem.tsx` | Vertical blue laser timeline with concentric spinning orbital nodes, horizontal connecting wires, highlighted technical keywords, and chronological sorting. |
| `ContactInterface` | `components/ContactInterface.tsx` | Dual-panel uplink terminal featuring direct social channels with brand-colored glowing hover effects, copy email utility, and full-featured AI Assistant interactive terminal powered by backend LLM with live markdown rendering and retry logic. |
| `CustomCursor` | `components/CustomCursor.tsx` | Context-aware multi-state custom cursor (default crosshair, pointer diamond, project viewer, zoom, text, and labeled states) with spring interpolation. |
| `EasterEgg` | `components/EasterEgg.tsx` | Hidden Konami-code (`↑↑↓↓←→←→ba`) terminal with retro CRT scanlines, ASCII grid banner, command processor (`help`, `status`, `overload`, `matrix`, `hack`, `theme`, `clear`, `exit`), and 4 color palettes. |
| `SEO` | `components/common/SEO.tsx` | Dynamic head management using `react-helmet-async` with OpenGraph, Twitter Cards, canonical tags, and JSON-LD structured schemas. |
| `GlareHover` | `components/ui/GlareHover.tsx` | Specular glare hover component for 3D glossy card reflections. |
| `Masonry` | `components/ui/Masonry.tsx` | Dynamic responsive masonry grid powered by GSAP with staggered entry animations, resize observers, image aspect ratio pre-calculation, and hover scaling. |

---

## 2. Prioritized Findings & Technical Observations

### [CRITICAL] Issue 1: Catastrophic Color Contrast Failure in STANDBY Mode (`isPowered === false`)

- **Observation**:
  - `pages/Home.tsx:85`:
    ```tsx
    <h2
        className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none"
        style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: isPowered ? '#ffffff' : '#111111',
        }}
    >
        {title}
    </h2>
    ```
  - `index.css:33-36`: `html { background: var(--bg-depth); }` where `var(--bg-depth)` is `#080806` (near pitch black).
  - When the user clicks the power grid toggle button in the header (switching from `ONLINE` to `STANDBY`), `isPowered` becomes `false`.
  - Every `SectionHeader` ("About Me", "Projects", "Timeline", "Contact") turns `#111111` on `#080806`.
  - Contrast ratio between `#111111` and `#080806` is **1.05:1**, rendering headers completely invisible to sighted users.
  - Similar contrast breakdown occurs across all components in `isPowered === false` mode:
    - `components/SkillBreadboard.tsx:276`: `<h2 className="... ${isPowered ? 'text-white' : 'text-gray-900'}">Skills Engine</h2>` -> `#111827` on `#080806` (**1.15:1 contrast**).
    - `components/TimelineSystem.tsx:111`: `<h4 className="... ${isPowered ? 'text-white' : 'text-gray-900'}">` on `bg-white/5` (`#141413`) (**1.1:1 contrast**).
    - `components/TimelineSystem.tsx:114`: `${isPowered ? 'text-cyan-500/80' : 'text-blue-600'}` -> dark blue on dark card (**2.2:1 contrast**).
    - `components/TimelineSystem.tsx:157`: `${isPowered ? 'text-cyan-300 font-semibold' : 'text-gray-800'}` on dark card (**1.4:1 contrast**).
    - `components/CertificationsBlock.tsx:968`: `<h4 className="... ${isPowered ? 'text-white' : 'text-zinc-900'}">` on `#121212` card (**1.1:1 contrast**).
    - `components/CertificationsBlock.tsx:971`: `${isPowered ? 'text-zinc-400' : 'text-zinc-600'}` on `#121212` (**2.1:1 contrast**).
    - `components/ProjectChip.tsx:93, 210`: When `isPowered === false`, `ProjectChip` switches to `bg-white` and `bg-gray-50`, while the page background remains `#080806`, creating random glaring white rectangles on a dark page while headings are pitch black.
- **Root Cause**:
  The developer initially planned a light theme toggle or mixed up light-mode CSS classes with a standby/power-down state, but never changed the root `html` background color from `#080806`.
- **Recommendation**:
  Standardize `isPowered === false` as a thematic **Low-Power Telemetry / Amber Standby State**:
  - Keep the dark background `#080806`.
  - Instead of switching text to `#111111` or `text-gray-900`, switch to an amber/gray telemetry scheme: `color: isPowered ? '#ffffff' : '#9ca3af'` (gray-400, contrast 8.1:1) or `#fbbf24` (amber-400, contrast 10.5:1).
  - In `ProjectChip`, `SkillBreadboard`, and `TimelineSystem`, keep cards dark (`bg-[#0a0a0a]` or `bg-[#0e0e0c]`) with dimmed amber/zinc borders and muted text, rather than flipping to blinding white backgrounds.

---

### [HIGH] Issue 2: Projects Carousel Fights Mobile Touch Gestures & Lacks Touch Event Handlers

- **Observation**:
  - `pages/Home.tsx:156-192`:
    ```tsx
    const step = (time: number) => {
        if (!isHoveredProjects && !isDraggingProjects && !isProjectsPaused) {
            const delta = (time - lastTime) / 1000;
            container.scrollLeft += speed * delta;
            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft -= halfWidth;
            }
        }
        lastTime = time;
        animationFrameId = requestAnimationFrame(step);
    };
    ```
  - `pages/Home.tsx:958-967`:
    ```tsx
    onMouseEnter={() => setIsHoveredProjects(true)}
    onMouseLeave={() => { setIsHoveredProjects(false); handleMouseLeaveOrUpProjects(); }}
    onMouseDown={handleMouseDownProjects}
    onMouseUp={handleMouseLeaveOrUpProjects}
    onMouseMove={handleMouseMoveProjects}
    ```
  - On mobile touch devices, `hover` does not occur. Mouse events (`onMouseDown`, `onMouseMove`, `onMouseUp`) do not fire during native touch swiping.
  - There are NO `onTouchStart`, `onTouchMove`, or `onTouchEnd` event listeners attached to `projectsScrollRef`.
  - Consequently, while a user attempts to swipe through projects on mobile with their finger, the `requestAnimationFrame` loop continues forcing `container.scrollLeft += speed * delta`, causing severe visual jitter, stutter, and scroll conflict.
- **Recommendation**:
  1. Add touch lifecycle handlers:
     ```tsx
     onTouchStart={() => setIsHoveredProjects(true)}
     onTouchEnd={() => setIsHoveredProjects(false)}
     ```
  2. Or disable auto-scroll on mobile devices when `isMobile` is true (`const isMobile = useIsMobile();`), allowing standard, frictionless native swipe momentum on touch devices.

---

### [HIGH] Issue 3: Horizontal Viewport Breakout (`w-screen -ml-[50vw] -mr-[50vw]`) Causes Layout Instability

- **Observation**:
  - `pages/Home.tsx:955`:
    ```tsx
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 mt-4 select-none">
    ```
  - On Windows browsers where vertical scrollbars occupy 15-17px of client viewport width, `100vw` exceeds `100%` of `document.documentElement.clientWidth`.
  - Negative margins calculated via `-ml-[50vw] -mr-[50vw]` force the element to exceed the body boundary by half the scrollbar width on each side.
  - While `body { overflow-x: hidden; }` masks the horizontal scrollbar, this layout hack causes horizontal wobble on mobile browsers, pinch-to-zoom glitches on touch devices, and subpixel jitter when Lenis synchronizes scroll transforms.
- **Recommendation**:
  Replace `w-screen -ml-[50vw] -mr-[50vw]` with a clean container breakout:
  ```tsx
  <div className="relative w-full overflow-hidden py-4 mt-4 select-none">
  ```
  And adjust the carousel's parent `<section id="projects">` to span the full width of the container, or place the carousel container outside the `max-w-7xl` container constraint.

---

### [HIGH] Issue 4: Keyboard Navigation & ARIA Focus Gaps in Modals & Interactive Cards

- **Observation**:
  - **Certificate Cards & Gallery Items are not keyboard focusable**:
    - `components/CertificationsBlock.tsx:854`: `<div className="group h-full..." onClick={onClick}>`. Missing `role="button"`, `tabIndex={0}`, and `onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}`. A keyboard-only user cannot navigate to or open certificates.
    - `components/ui/Masonry.tsx:255-272`: Items have `onClick` on the wrapper, but no `tabIndex={0}` or keyboard event handlers.
    - `pages/IndustrialPortfolio.tsx:440`: `<motion.div ... onClick={...}>` on `ProjectCard` is not keyboard focusable.
  - **Modals lack ARIA semantics and focus trapping**:
    - `components/CertificationsBlock.tsx:1034`: `GalleryModal` lacks `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. Tabbing inside the modal allows focus to escape behind the modal into the obscured page.
    - `pages/Gallery.tsx:446`: Lightbox modal lacks `role="dialog"` and `aria-modal="true"`.
    - `pages/IndustrialPortfolio.tsx:202`: `ProjectModal` lacks `role="dialog"`, `aria-modal="true"`, and notably **lacks an `Escape` key listener** (`GalleryModal` and `Gallery.tsx` both have Escape key handlers, but `ProjectModal` was overlooked).
  - **Mobile Menu Accessibility**:
    - `pages/Home.tsx:529-600`: The full-screen mobile menu overlay lacks `role="dialog"`, `aria-modal="true"`, and does not lock body scrolling when open (`document.body.style.overflow = 'hidden'`), permitting background page scroll while menu is open.
- **Recommendation**:
  1. Add `tabIndex={0}`, `role="button"`, and `onKeyDown` handlers to `CertificateCard`, `ProjectCard`, and gallery masonry items.
  2. Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to `GalleryModal`, `ProjectModal`, `Lightbox`, and mobile nav.
  3. Add an `Escape` key listener in `ProjectModal` (`pages/IndustrialPortfolio.tsx`).
  4. Lock `document.body.style.overflow = 'hidden'` when `mobileMenuOpen` is true in `pages/Home.tsx`.

---

### [MEDIUM] Issue 5: Missing Font `JetBrains Mono` and Inconsistent Monospace Rendering

- **Observation**:
  - `components/CustomCursor.tsx:304`:
    ```tsx
    style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        fontWeight: 700,
        ...
    }}
    ```
  - In `index.html:75`, Google Fonts imports:
    `family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@300..700&family=Space+Mono:wght@400;700`
  - `JetBrains Mono` is NOT imported in `index.html` or in `index.css`.
  - As a result, cursor micro-labels ("VIEW", "VISIT", "BACK", "SCROLL") fall back to generic system monospace (`Courier New` on Windows, `Courier` on macOS), conflicting with the portfolio's intentional `Space Mono` typography.
- **Recommendation**:
  Replace `'JetBrains Mono', monospace` in `CustomCursor.tsx:304` with `'Space Mono', monospace` or `var(--font-mono)`.

---

### [MEDIUM] Issue 6: Low-Contrast Subtitles and Metadata Violating WCAG 2.1 AA (< 4.5:1)

- **Observation**:
  - `pages/Home.tsx:120`: `<p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</p>` on `#080806` has a contrast ratio of **3.8:1** (fails WCAG AA 4.5:1 for small text).
  - `pages/Home.tsx:805`: `<motion.p ... className="text-[10px] md:text-xs font-mono tracking-[0.16em] uppercase text-cyan-500/65">` on black has **~3.5:1** contrast.
  - `pages/Home.tsx:1021`: `<span className="text-[10px] font-mono text-gray-600 tracking-[0.2em]">` on `#080806` has **2.4:1** contrast.
  - `pages/Home.tsx:1031`: Footer navigation links `<a ... className="text-[10px] font-mono text-gray-600 hover:text-cyan-500">` have **2.4:1** inactive contrast.
  - `pages/Home.tsx:1092`: `<p className="text-[10px] text-gray-700 font-mono">` has **1.6:1** contrast (virtually invisible).
  - `components/ContactInterface.tsx:578`: `<span className="opacity-30 text-[10px]">{timeLabel()}</span>` has **1.8:1** contrast.
  - `pages/IndustrialPortfolio.tsx:423, 501`: `<span className="text-[10px] font-mono text-zinc-600">Pending</span>` has **2.2:1** contrast.
  - `components/CertificationsBlock.tsx:681, 688`: Chevron scroll buttons lack `aria-label`, only providing tooltip `title`.
- **Recommendation**:
  - Elevate muted text colors:
    - Replace `text-gray-600` and `text-zinc-600` with `text-gray-400` (#9ca3af, contrast **8.1:1**) or `text-zinc-400`.
    - Replace `text-gray-700` with `text-gray-500` (#6b7280) or `text-zinc-400`.
    - Ensure opacity on cyan accents does not drop below 85% (`text-cyan-500/85` rather than `65%`).
  - Add explicit `aria-label="Scroll credentials left"` and `aria-label="Scroll credentials right"` to buttons in `CertificationsBlock.tsx:681, 688`.

---

### [MEDIUM] Issue 7: Mobile Touch Target Sizes Under WCAG 2.5.5 Guidelines (< 44x44px)

- **Observation**:
  - `components/ContactInterface.tsx:490`: Copy button is `px-2.5 py-1 text-xs`, rendering at ~26px height.
  - `components/CertificationsBlock.tsx:1084`: Full PDF link in `GalleryModal` on small screens displays only an icon (`<FileText size={13} />`) with ~28px touch height.
  - `components/CertificationsBlock.tsx:680, 687`: Carousel arrow buttons `p-1` render at ~28x28px.
  - `pages/IndustrialPortfolio.tsx:734`: Search clear `X` button has ~20x20px hit area.
  - `pages/Home.tsx:441`: Power grid toggle button in header is `px-1 py-0.5`, height ~22px.
- **Recommendation**:
  Enlarge touch targets on mobile viewports using min-height / min-width utilities or pseudo-element expansion (`after:absolute after:inset-[-8px] after:content-['']`) to satisfy the 44x44px touch target requirement without disturbing desktop layout density.

---

### [MEDIUM] Issue 8: Anchor Position Drift from `content-visibility: auto`

- **Observation**:
  - `index.css:166-173`:
    ```css
    #skills,
    #certifications,
    #experience,
    #contact {
        content-visibility: auto;
        contain-intrinsic-size: 1px 900px;
    }
    ```
  - `contain-intrinsic-size: 1px 900px` assigns an estimated height of 900px to all four major sections.
  - `#certifications` contains three horizontal scrolling credential tracks plus headers and descriptions, with an actual rendered height of ~1400px–1600px.
  - When a user clicks `#experience` or `#contact` in the navbar, the browser navigates based on the 900px estimate. When `#certifications` approaches the viewport and renders its true DOM content, the page height shifts by ~500–700px, resulting in an inaccurate landing scroll position.
- **Recommendation**:
  Update to modern `contain-intrinsic-size: auto 1200px` (which retains the actual rendered height once measured) or remove `content-visibility: auto` from `#certifications` so anchor navigation remains deterministic.

---

### [LOW] Issue 9: Dual Pointer / Cursor Clutter on Desktop

- **Observation**:
  - `CustomCursor.tsx:215`: Renders a 5px snapping cyan dot directly at the mouse coordinates, accompanied by a trailing spring ring.
  - `index.css` does NOT define `cursor: none` on `body` or `html`.
  - On desktop, the OS mouse pointer (Windows arrow or link hand) is visible simultaneously with the cyan dot and spring ring, creating visual overlap.
- **Recommendation**:
  Either hide the OS cursor on desktop (`@media (pointer: fine) { html, body, a, button { cursor: none; } }`) to let the sci-fi HUD cursor take full prominence, or remove the center cyan dot from `CustomCursor` and let the ring serve purely as an ambient lagging halo around the system cursor.

---

### [LOW] Issue 10: Smooth Scrolling Coordination Between Native `scrollIntoView` and Lenis

- **Observation**:
  - `pages/Home.tsx:386-388`:
    ```tsx
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); ... }
    ```
  - `App.tsx:81`: `<ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1.0, syncTouch: false }}>`
  - Calling browser-native `scrollIntoView({ behavior: 'smooth' })` while Lenis is actively handling momentum scrolling can occasionally cause micro-stutters during anchor navigation.
- **Recommendation**:
  Use Lenis's `useLenis` hook to trigger `lenis.scrollTo(`#${id}`)`, ensuring a single unified scroll driver.

---

## 3. Responsive Breakpoint Matrix

| Viewport | Tested Range | Status | Key Observations & Findings |
|---|---|---|---|
| **Mobile** | 360px – 480px | ⚠️ Mixed | - Hero typography scales well (`text-4xl sm:text-6xl`).<br>- Orbital dashed rings are disabled on mobile (`!isMobile`), preventing overflow.<br>- **Issue**: Projects carousel auto-scroll lacks touch event handlers and fights finger swiping.<br>- **Issue**: Sub-44px touch targets on copy buttons and PDF buttons.<br>- **Issue**: Mobile menu lacks scroll locking and focus trap. |
| **Tablet** | 768px – 1023px | ✅ Good | - Bento cards adapt to 2 columns smoothly.<br>- Section headers and stat chips scale gracefully.<br>- Timeline adapts with responsive left margins (`pl-8 md:pl-16`). |
| **Desktop** | 1024px – 1440px | ✅ Good | - Floating liquid glass navbar renders crisply with specular highlights and shimmer animation.<br>- Skills engine renders 5-column balanced bento grid.<br>- Industrial portfolio search and category filters align cleanly. |
| **Ultra-wide** | > 1536px | ✅ Good | - `max-w-7xl` container restricts page sprawl.<br>- PCB background SVG scales with `preserveAspectRatio="xMidYMid slice"`.<br>- Masonry grid expands to 5 columns cleanly. |

---

## 4. Animation & Interaction Polish Assessment

1. **Liquid Glass Header**:
   - High visual polish with GPU-accelerated transform shimmer (`translate3d(-150%, 0, 0)`).
   - Crisp specular highlight border and backdrop saturation boost (`saturate(180%)`).
   - Smooth slide-up/down hide-on-scroll-down, show-on-scroll-up behavior.
2. **Custom Cursor**:
   - Rich state transitions (`default`, `pointer`, `project`, `text`, `zoom`, `label`).
   - Counter-rotated label wrapper keeps text level even when outer ring tilts 45°.
   - Spring damping (stiffness 400, damping 28) creates a tactile trailing feel.
3. **Easter Egg Terminal**:
   - Konami code listener with buffer slice matching.
   - Glitch effect CSS simulation during system overload command.
   - Clean command processor and theme color switcher.
4. **AI Assistant Terminal**:
   - Real-time markdown parser supporting headers, bold, italics, code blocks, bullet/numbered lists, and links.
   - Built-in retry handler for cold-start wakeups.
   - Smooth auto-scroll to bottom on message receive.

---

## 5. Summary of Recommended Actions

| Priority | Area | File | Line(s) | Recommended Action |
|---|---|---|---|---|
| **Critical** | Contrast / Themes | `pages/Home.tsx` | 85 | Fix `color: isPowered ? '#ffffff' : '#111111'` to amber/zinc `#9ca3af` or `#fbbf24` in `SectionHeader` |
| **Critical** | Contrast / Themes | `components/SkillBreadboard.tsx` | 276 | Change `text-gray-900` to `#9ca3af` on dark background |
| **Critical** | Contrast / Themes | `components/TimelineSystem.tsx` | 111, 114, 157 | Harmonize dark standby colors instead of unreadable gray-900 on dark background |
| **Critical** | Contrast / Themes | `components/CertificationsBlock.tsx`| 968, 971 | Fix `text-zinc-900` to `#e4e4e7` / `#a1a1aa` in credential cards |
| **High** | Mobile Touch | `pages/Home.tsx` | 156-192, 958 | Add `onTouchStart`/`onTouchEnd` or pause auto-scroll on mobile devices to prevent touch conflict |
| **High** | Responsive Layout | `pages/Home.tsx` | 955 | Remove `w-screen -ml-[50vw] -mr-[50vw]` to eliminate horizontal overflow risks on desktop scrollbar viewports |
| **High** | Accessibility | `components/CertificationsBlock.tsx`| 816, 1034 | Add keyboard support (`tabIndex={0}`, Enter/Space key) to cards, add `role="dialog"`, `aria-modal="true"` to modal |
| **High** | Accessibility | `pages/IndustrialPortfolio.tsx` | 202, 440 | Add `Escape` key listener and dialog attributes to `ProjectModal`; add keyboard focus to `ProjectCard` |
| **High** | Accessibility | `pages/Home.tsx` | 529-600 | Lock body scroll (`overflow: hidden`) and trap focus when mobile menu is active |
| **Medium** | Typography | `components/CustomCursor.tsx` | 304 | Replace missing `'JetBrains Mono'` font with `'Space Mono', monospace` |
| **Medium** | Accessibility | `pages/Home.tsx`, `IndustrialPortfolio.tsx` | Various | Increase muted text contrast (`text-gray-600` → `text-gray-400`) to meet WCAG AA 4.5:1 |
| **Medium** | Accessibility | `components/ContactInterface.tsx`, etc. | 490, 1084 | Enlarge touch targets to meet 44x44px mobile touch standards |
| **Medium** | Layout / Performance | `index.css` | 166-173 | Update `contain-intrinsic-size: auto 1200px` to prevent anchor jump from `content-visibility: auto` |
| **Low** | Interactions | `components/CustomCursor.tsx`, `index.css` | Global | Coordinate OS mouse cursor with custom cursor to eliminate visual overlap |
| **Low** | Smooth Scroll | `pages/Home.tsx` | 386 | Integrate Lenis `scrollTo` for unified anchor scrolling |
