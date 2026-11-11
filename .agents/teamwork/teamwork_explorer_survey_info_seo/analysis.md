# Information Architecture & SEO Audit Report

**Target Codebase**: `d:\websites\git clone\myportfolio`  
**Auditor**: Teamwork Explorer (Information Architecture & SEO Specialist)  
**Date**: November 11, 2026  
**Status**: Comprehensive Technical Investigation Completed  

---

## Executive Summary

A rigorous audit of the portfolio codebase was conducted across two core domains: **Information Architecture & Content Quality** and **Search Engine Optimization (SEO) & Technical Metadata**.

The portfolio showcases strong technical achievements, comprehensive project descriptions, and deep industrial automation documentation. However, the investigation identified several critical bugs and architectural gaps that impair search visibility, social card rendering, visual completeness, user engagement, and performance.

### Key Urgent Findings:
1. **Visual Content Breakdown**: 31 out of 36 certificates in `CertificationsBlock.tsx` render as blank grey cards displaying `"NO IMAGE PREVIEW"` because their `image` property points to `.pdf` files, despite high-resolution `.png` previews already existing in `public/assets/certifications/`.
2. **Asset Format Masking**: Several critical static assets in `public/assets/` named `.webp` (including the primary LCP hero image and OpenGraph image `srinivasa-manikanta-profile.webp`, `firefighter-monitoring-device.webp`, and `agri-rover-project.webp`) are actually raw JPEG or PNG files that were renamed without format transcoding. This causes header/MIME conflicts, social media preview failures on WhatsApp/LinkedIn, and uncompressed byte bloat.
3. **Missing Critical Assets**: `/favicon.ico` does not exist in `public/`, generating continuous 404 HTTP errors. No web app manifest (`manifest.json` or `site.webmanifest`) exists.
4. **Information Architecture Gaps**: Rich engineering project data in `constants.tsx` (including full system specifications, feature lists, circuit details, and hardware photo galleries) is completely unreachable from the homepage UI because `ProjectChip.tsx` lacks a detail modal or expander. Projects `p2` (Industrial Automation) and `p4` (GridForge) are defined in `index.html` schema and noscript, but missing from `PROJECTS` in `constants.tsx`.
5. **SEO & Social Tag Inconsistencies**: OpenGraph image dimensions are hardcoded as 1200x630, but the profile image is 1024x1024 square, causing improper cropping on social platforms. Keywords meta tag is omitted in `SEO.tsx`. Canonical duplicate content exists between `/videos` and `/automation`.
6. **Performance & Build Bloat**: 43.5 MB of unreferenced WhatsApp videos reside in `public/assets/gallery/` and are packaged into every production build. Unused LinkedIn badge script runs on every page. Two unmounted interval timers in `Home.tsx` execute continuous state updates with zero UI output.

---

## 1. Information Architecture & Content Audit

### 1.1 Content Quality, Accuracy & Completeness by Section

| Section | Status | Observation / Issue | Severity | File Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Hero & Bio** | Degraded | `PROFILE.bio` in `constants.tsx` is decoupled from the homepage; `Home.tsx` hardcodes its own bio text. Two continuous `setInterval` loops run on mount for `heroIntro` and `statusText` but their state values are **never rendered** anywhere in the JSX. | High | `pages/Home.tsx:252-282`, `constants.tsx:8` |
| **Projects** | Critical | 1) Project IDs jump from `p1` to `p3`, `p5`, `p6`, `p7`, `p8`. Projects `p2` and `p4` are missing on the homepage but advertised in `index.html` JSON-LD schema and noscript fallback.<br>2) Solar-Powered Dewatering System (`p7`) uses an AI chatbot background (`ai-chatbot-interface-background.webp`) as its project image.<br>3) Project `p6` (Solar Tracker) has no clickable link or modal, leaving its rich specifications inaccessible. | Critical | `constants.tsx:60-204`, `index.html:207-312` |
| **Project Details** | High | `project.details`, `project.features` (full text), and `project.gallery` arrays are fully written in `constants.tsx`, but `ProjectChip.tsx` only renders their numerical lengths (`Features: 5`, `Gallery: 10`) without any modal or way to read the content. | High | `components/ProjectChip.tsx:181-190`, `constants.tsx:68-90` |
| **Certifications** | Critical | 31 of 36 certificates point to `.pdf` files in their `image` field. `CertificateCard` checks `!cert.image.endsWith('.pdf')` and falls back to rendering `"NO IMAGE PREVIEW"`, despite matching `.png` images existing on disk. | Critical | `components/CertificationsBlock.tsx:94-582, 903-908` |
| **Certifications Data** | Medium | Certificate IDs skip 001, 018, 019, 023, 024. Every certificate has a mock hash string (`verificationHash`) that is never utilized or displayed. "Internship" is misspelled as "Intership" in certificate title CERT-028. | Medium | `components/CertificationsBlock.tsx:24-590` |
| **Contact & Chatbot** | Medium | `ContactInterface.tsx` displays error text *"You've reached the 20-message session limit"* when `isLimitReached` triggers, but `MAX_MSGS` is configured as `999999`. Contact links show `instagram.com/rsmk.me/` whereas `index.html` noscript references `instagram.com/rsmk_27`. | Medium | `components/ContactInterface.tsx:12, 638`, `index.html:498` |
| **Industrial Journey** | Medium | In `data/industrialProjects.ts`, 5 documentation items are marked `available: false` with notes like *"EPLAN drawing to be uploaded"* and *"Technical document to be uploaded"*. | Low | `data/industrialProjects.ts:923-1008` |

### 1.2 Typographic Hierarchy & Readability

1. **Heading Skips in `SkillBreadboard.tsx`**:
   - `SkillBreadboard.tsx:275`: Section title is rendered as `<h2>SKILL MATRIX</h2>`.
   - `SkillBreadboard.tsx:215`: Category headers inside cards are rendered directly as `<h4 className="text-base font-bold ...">{cat.title}</h4>`.
   - **Violation**: Heading level `<h3>` is completely skipped, violating semantic hierarchy and WCAG 2.1 SC 1.3.1 (Info and Relationships).
2. **Heading Skips in `TimelineSystem.tsx`**:
   - `Home.tsx:996`: Renders `<h2>Timeline</h2>` via `SectionHeader`.
   - `TimelineSystem.tsx:110`: Renders degree/role directly as `<h4 className="text-lg font-black ...">`.
   - **Violation**: Direct jump from `<h2>` to `<h4>` with no intervening `<h3>`.
3. **Contrast & Readability**:
   - Body font is `DM Sans` at `15px` / `line-height: 1.75` on dark backgrounds (`#080806`), providing excellent contrast and reading comfort.
   - Micro-labels in status ticker and breadboard (`text-[10px]` with opacity `text-cyan-500/65` and `text-gray-600`) fall slightly below recommended 4.5:1 contrast ratios on low-brightness displays.

### 1.3 Call-to-Actions (CTAs) & Conversion Funnel

1. **Hero Viewport CTA Absence**:
   - In `Home.tsx` (lines 637-830), the Hero section contains only the avatar, animated name, subtitle, status ticker, and bouncing "Scroll" arrow.
   - The primary action buttons (*"View Projects"*, *"View Resume"*, *"Initialize Comms"*) are hidden below the fold in the About section (lines 861-887).
   - First-time visitors on desktop or mobile cannot take immediate action without scrolling past the fold.
2. **Project Card CTAs**:
   - In `ProjectChip.tsx`, projects with links only show a small pill button (`Live` or `Code`) and an overlay button on hover. For mobile touch screens where `:hover` is not persistent, interacting with the card can be ambiguous.
   - For hardware projects without live web URLs (like `Single-Axis Solar Tracker`), there is no CTA to inspect schematics, test data, or gallery photos.

---

## 2. Search Engine Optimization (SEO) & Technical Metadata Audit

### 2.1 Meta Tags & Header Directives

| Tag / Feature | Current Implementation | Issues Identified | Severity | File Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Title Tag** | Dynamic via `SEO.tsx` & static in `index.html` | In `index.html`: 85 chars (`Srinivasa Manikanta Rajapantula (RSMK) – Portfolio \| Embedded Systems, Industrial Automation & IoT`). Recommended SERP display length is 55-60 chars before truncation. | Low | `index.html:61`, `components/common/SEO.tsx:28` |
| **Description** | Dynamic via `SEO.tsx` & static in `index.html` | In `index.html`: 290 characters long. Recommended meta description is 150-160 characters. Search engines will truncate ~50% of this copy in snippets. | Medium | `index.html:64`, `components/common/SEO.tsx:29` |
| **Keywords Meta** | Omitted | `components/common/SEO.tsx` calculates `finalKeywords` on line 36, but **never renders** `<meta name="keywords" content={finalKeywords} />` in the Helmet block. `index.html` also lacks keywords meta. | Medium | `components/common/SEO.tsx:36-41` |
| **Canonical URLs** | Canonical set on all routes | 1) `index.html:67` specifies `https://rsmk.tech` (no trailing slash), while JSON-LD schema lines 129 & 142 specify `https://rsmk.tech/`.<br>2) `/videos` and `/automation` render identical content. In `prerender.js`, `/videos` sets its canonical to `https://rsmk.tech/videos` instead of pointing to `/automation`, risking duplicate content penalties. | High | `index.html:67`, `scripts/prerender.js:316` |
| **Verification Tags** | Present in `<head>` | `<meta name="google-site-verification" content="" />` and `<meta name="msvalidate.01" content="" />` have empty string values. | Low | `index.html:69-70` |
| **Favicon & Icons** | `<link rel="icon" href="/favicon.ico" />` | **`/favicon.ico` does not exist on disk in `public/`**, returning a 404 error for standard browser favicon probes. | Critical | `index.html:76` |
| **Web App Manifest** | None | No `manifest.json` or `site.webmanifest` exists, preventing PWA installation and mobile bookmark styling. | Medium | `index.html:76-79` |

### 2.2 OpenGraph & Twitter Card Metadata

1. **Asset Format Masking & Magic Byte Violation**:
   - `index.html:86`: `<meta property="og:image" content="https://rsmk.tech/assets/srinivasa-manikanta-profile.webp" />`
   - `index.html:89`: `<meta property="og:image:type" content="image/webp" />`
   - **Direct Observation**: Binary inspection of `public/assets/srinivasa-manikanta-profile.webp` reveals magic bytes `FF D8 FF E0` (`JFIF` JPEG format).
   - **Impact**: Strict social media scrapers (LinkedIn Post Inspector, WhatsApp link unfurling, Facebook Graph API) validate that declared MIME type (`image/webp`) matches binary content. A mismatch can result in broken link preview cards.
2. **Dimension Distortion**:
   - `index.html:90-91` & `SEO.tsx:68-69`: Declares `og:image:width = 1200` and `og:image:height = 630`.
   - **Direct Observation**: `srinivasa-manikanta-profile.webp` has actual pixel dimensions of **1024 x 1024** (1:1 square ratio).
   - **Impact**: When platforms render `summary_large_image` (1.91:1 ratio), a square image will either be cropped aggressively (clipping the engineer's face) or displayed with unsightly letterbox borders. A dedicated 1200x630 banner card is required.
3. **Static Image Types in Public Folder**:
   Binary analysis of all `.webp` files in `public/assets/` revealed:
   - `agri-rover-project.webp`: Actually JPEG (`FF D8`)
   - `ai-chatbot-interface-background.webp`: Actually JPEG (`FF D8`)
   - `srinivasa-manikanta-profile.webp`: Actually JPEG (`FF D8`)
   - `automated-street-light-system.webp`: Actually PNG (`89 50 4E 47`), size: 1.33 MB
   - `firefighter-monitoring-device.webp`: Actually PNG (`89 50 4E 47`), size: 642 KB
   - `news-hub-aggregator-app.webp`: Actually PNG (`89 50 4E 47`), size: 1.02 MB
   - `playzone-interactive-platform.webp`: Actually PNG (`89 50 4E 47`), size: 1.15 MB
   - `portfolio-website-design.webp`: Actually PNG (`89 50 4E 47`), size: 1.05 MB
   - `technical-blog-platform.webp`: Actually PNG (`89 50 4E 47`), size: 1.14 MB

### 2.3 Structured Data (JSON-LD Schema)

1. **Homepage Schema Graph**:
   - `index.html:107-352` implements a comprehensive `@graph` including `WebSite`, `ProfilePage`, `Person`, `ItemList` (Projects), and 4 `VideoObject` nodes.
   - **Discrepancy**: The schema lists 8 projects, including `Industrial Automation & Control – CODESYS` and `GridForge`. In the client-side React app, `constants.tsx` only lists 6 projects (omitting CODESYS and GridForge).
2. **Missing Client Schema Injection in `Home.tsx`**:
   - `Home.tsx:394` calls `<SEO ... />` without passing the `schema` prop.
   - When users navigate to `/gallery` or `/automation` and navigate back to `/`, `react-helmet-async` does not re-apply the full `@graph` schema.
3. **Gallery & Automation Schema**:
   - `Gallery.tsx:160` implements `ImageGallery` schema correctly.
   - `IndustrialPortfolio.tsx:570` implements `CollectionPage` schema correctly.
   - `scripts/prerender.js` injects dedicated route schema into static pre-rendered HTML for `/gallery` and `/automation`.

### 2.4 Robots.txt & Sitemap.xml

1. **`robots.txt`**:
   - Clean and standard: allows `/`, specifies sitemap location.
   - Disallows `/admin` (a non-existent route).
   - Does not block `/font_comparison.html` (an internal dev experiment in `public/`).
2. **`sitemap.xml`**:
   - Valid XML syntax covering `/`, `/gallery`, `/automation`.
   - Verified that all 117 image and video asset URLs referenced in `sitemap.xml` exist on disk.
   - Missing `/videos` (which should be a 301 redirect to `/automation` rather than a standalone sitemap URL).
   - Hardcoded `lastmod` date: `2026-09-14`.

### 2.5 Performance & Core Web Vitals (CWV)

1. **Largest Contentful Paint (LCP)**:
   - Profile image is preloaded via `<link rel="preload" as="image" href="/assets/srinivasa-manikanta-profile.webp" fetchpriority="high" />` in `index.html:60`.
   - However, since the image is an uncompressed 1024x1024 JPEG (75.8 KB) displayed at 192x192, serving a true 192px / 384px WebP/AVIF (~12-18 KB) would improve mobile LCP.
2. **Render-Blocking Third-Party Assets**:
   - `index.html:75`: Synchronous Google Fonts stylesheet loading 4 font families (`Bebas Neue`, `DM Sans`, `Space Grotesk`, `Space Mono`).
   - `index.html:354`: External script `<script src="https://platform.linkedin.com/badges/js/profile.js" async defer></script>` is downloaded and executed on every page load, but no LinkedIn badge exists anywhere in the codebase.
3. **Production Build & Asset Bloat**:
   - **43.5 MB of unreferenced WhatsApp videos** in `public/assets/gallery/`:
     - `vid-20260106-WA0007.mp4` (20.0 MB)
     - `vid-20260107-WA0006.mp4` (18.7 MB)
     - `vid-20260107-WA0004.mp4` (3.38 MB)
     - `vid-20260107-WA0064.mp4` (1.37 MB)
   - These files are completely absent from `Gallery.tsx` and all other code, but are copied into `dist/assets/gallery/` on every build, inflating deployment artifacts.
   - Backup file `public/assets/srinivasa-manikanta-profile.webp.bak` (44.7 KB) is publicly exposed.
4. **Main Thread CPU Usage in `Home.tsx`**:
   - Unrendered typing state timers for `heroIntro` and `statusText` continuously run `setInterval` callbacks every 45-65ms on initial load.
   - Continuous `requestAnimationFrame` loop in `Home.tsx` (lines 156-192) auto-scrolls the projects container whenever the section is within 200px of the viewport.

---

## 3. Prioritized Recommendations

### Priority: Critical (P0)

1. **Fix Certificate Preview Breakdown**:
   - Update `components/CertificationsBlock.tsx` so all certificates use their available `.png` previews in `image` (e.g. `/assets/certifications/AIFundamentalsFoundationsforUnderstandingAI.png`, `/assets/certifications/GitHub Foundations.png`, etc.) while retaining `.pdf` references in `gallery` for downloading.
   - This instantly restores visual previews for 31 credentials currently showing `"NO IMAGE PREVIEW"`.
2. **Resolve Missing Favicon**:
   - Generate and place a proper multi-size `/public/favicon.ico` (16x16, 32x32, 48x48) and an Apple Touch Icon PNG (`/public/apple-touch-icon.png`, 180x180) to eliminate 404 HTTP errors.
3. **Transcode and Normalize Masqueraded Assets**:
   - Truly transcode `srinivasa-manikanta-profile.webp` and other project images to authentic WebP files using proper compression rather than keeping JPEGs and PNGs disguised with a `.webp` extension.
   - Create a dedicated 1200x630 OpenGraph social preview banner (`/public/assets/og-preview.jpg`) to replace the 1024x1024 square profile image in `og:image`.

### Priority: High (P1)

4. **Surface Hidden Project Details via Modal**:
   - Connect the rich engineering writeups, feature lists, and hardware photo galleries already written in `constants.tsx` (`details`, `features`, `gallery`) to a click-to-expand Project Modal in `ProjectChip.tsx` (similar to `GalleryModal` in `CertificationsBlock.tsx`).
5. **Harmonize Projects List**:
   - Align `PROJECTS` in `constants.tsx` with the 8 featured projects in `index.html` schema and noscript fallback (bringing back CODESYS Industrial Automation and GridForge into the main portfolio display).
   - Fix the project image for SPDS (`p7`), replacing the mismatched `ai-chatbot-interface-background.webp` with an authentic solar/dewatering graphic.
6. **Eliminate 43.5 MB Orphaned Video Bloat**:
   - Delete or relocate the 4 unreferenced WhatsApp videos from `public/assets/gallery/` (`vid-20260106-WA0007.mp4`, etc.) so production builds don't package 43 MB of unused media.
   - Delete `public/assets/srinivasa-manikanta-profile.webp.bak` and remove `public/font_comparison.html`.
7. **Fix Duplicate Canonical & Route Handling**:
   - In `scripts/prerender.js` and `vercel.json`, configure `/videos` to issue a 301 redirect to `/automation` (or set its canonical explicitly to `https://rsmk.tech/automation`).
   - Add `"cleanUrls": true` and `"trailingSlash": false` in `vercel.json`.

### Priority: Medium (P2)

8. **Fix Typographic Heading Hierarchy**:
   - Change category headers in `SkillBreadboard.tsx` from `<h4>` to `<h3>` to prevent skipping heading levels after `<h2>SKILL MATRIX</h2>`.
   - Change timeline card headers in `TimelineSystem.tsx` from `<h4>` to `<h3>`.
9. **Clean Up Unrendered State & CPU Timers in `Home.tsx`**:
   - Remove the unrendered `heroIntro` and `statusText` state hooks and their associated `setInterval` loops from `Home.tsx`.
10. **Render Keywords Meta & Correct Social Links**:
    - Update `components/common/SEO.tsx` to render `<meta name="keywords" content={finalKeywords} />` inside `<Helmet>`.
    - Align Instagram handles between `index.html` (`rsmk_27`) and `constants.tsx` (`rsmk.me`).
    - Correct outdated copy in `ContactInterface.tsx` regarding the 20-message session limit.
11. **Remove Unused Third-Party Scripts**:
    - Remove `<script src="https://platform.linkedin.com/badges/js/profile.js">` from `index.html` since no LinkedIn profile badge widget exists in the UI.
12. **Add Web App Manifest & Modern Security Headers**:
    - Create `public/manifest.json` with app name, icons, and theme color.
    - Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin` to `vercel.json`.

### Priority: Low (P3)

13. **Spelling & Minor Polish**:
    - Fix typo `"Intership"` in CERT-028 in `CertificationsBlock.tsx` (`"Embedded System Intership"` → `"Embedded Systems Internship"`).
    - Remove placeholder hashes (`verificationHash`) or document their planned cryptographic verification usage.
    - Remove empty verification tags from `index.html` until real search console keys are supplied.
