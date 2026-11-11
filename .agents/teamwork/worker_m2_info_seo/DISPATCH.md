## 2026-11-11T12:18:15Z
[Message] timestamp=2026-11-11T12:18:15Z sender=ec08e424-3468-4318-b912-a1d061f1737c priority=MESSAGE_PRIORITY_HIGH content=You are a teamwork_worker implementing Milestone 2: Information Architecture & SEO Remediation.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\worker_m2_info_seo

First, read the following mandatory files:
1. ORIGINAL_REQUEST.md: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
2. PROJECT.md: d:\websites\git clone\myportfolio\PROJECT.md
3. SCOPE.md: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m2_info_seo\SCOPE.md
4. Explorer 2 Handoff: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_info_seo\handoff.md
5. Explorer 2 Analysis: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_info_seo\analysis.md

Your exclusive write boundaries:
- `components/CertificationsBlock.tsx`
- `constants.tsx`
- `components/common/SEO.tsx`
- `index.html`
- `App.tsx`
- `scripts/prerender.js`
- `public/favicon.ico`
- `public/manifest.json`
- `public/assets/og-preview.jpg`
- `public/assets/gallery/` (deletion of unreferenced MP4s)
- `public/font_comparison.html` (deletion)
- `public/assets/*.bak` (deletion)
DO NOT touch any other files outside your exclusive ownership.

Tasks to implement:
1. Certifications Visual Breakdown (`components/CertificationsBlock.tsx`):
   - Currently 31 certificates have `image: '/assets/certifications/<name>.pdf'`.
   - Check `public/assets/certifications/` for the corresponding `.png` images.
   - Update every `image:` in `CERTIFICATIONS` that points to a `.pdf` to its corresponding `.png` preview image (e.g., `/assets/certifications/AIFundamentalsFoundationsforUnderstandingAI.png`, `/assets/certifications/GitHub Foundations.png`, etc.).
   - Retain `.pdf` in `gallery:` (or include both `.png` and `.pdf` in `gallery:`) so users can still open or download the PDF if desired.
   - Fix typo in CERT-028: `"Intership"` -> `"Internship"` (`"Embedded System Intership"` -> `"Embedded Systems Internship"`).
   - Ensure all 36 certificates in `CERTIFICATIONS` have an `image:` that points to an actual image (not `.pdf`), eliminating `"NO IMAGE PREVIEW"` cards.

2. Restore Missing Projects & Fix SPDS Image (`constants.tsx`):
   - Add missing projects `p2` and `p4` into `PROJECTS` in `constants.tsx` so the list has all 8 projects (`p1` through `p8`) matching `index.html` schema and `<noscript>` fallback:
     - `p2`: "Industrial Automation & Control – CODESYS & Factory I/O Simulation", tech: `['CODESYS', 'PLC Ladder Logic', 'Factory I/O', 'Modbus TCP', 'HMI', 'Structured Text']`, link: `/automation`, image: `/assets/gallery/ahacks/prize-ceremony.jpg`, with rich `details`, `features` (5+ items), `gallery`, `award: '🏭 Industrial Automation'`, `awards: ['🏭 Industrial Automation', '⚡ PLC Simulation']`, and `keywords`.
     - `p4`: "GridForge – Smart Energy Management System", tech: `['MATLAB', 'Simulink', 'Power Systems', 'ISO 50001', 'Data Analytics']`, link: `https://github.com/Rsmk27`, image: `/assets/gridforge/web-dashboard-interface.png`, with rich `details`, `features` (5+ items), `gallery`, `award: '⚡ Smart Grid'`, `awards: ['⚡ Smart Grid', '📊 ISO 50001']`, and `keywords`.
     - `p7` (SPDS): replace the mismatched image `/assets/ai-chatbot-interface-background.webp` with a proper engineering image (check `public/assets/` or `public/assets/gallery/` or create/use an appropriate solar/dewatering visual).
   - Ensure all `Project` objects strictly conform to `types.ts`.

3. Generate `/public/favicon.ico` and `/public/manifest.json`, and link in `index.html`:
   - Generate a valid multi-size `/public/favicon.ico` (standard ICO containing 16x16, 32x32, 48x48 icon frames).
   - Create `/public/manifest.json` with standard PWA fields: name, short_name, start_url, display: "standalone", theme_color, background_color, icons.
   - In `index.html`: ensure `<link rel="icon" type="image/x-icon" href="/favicon.ico" />` and `<link rel="manifest" href="/manifest.json" />` are present.

4. Create True 1200x630 OpenGraph Preview Banner (`public/assets/og-preview.jpg`) and Fix Metadata:
   - Generate a true 1200x630 JPEG image at `public/assets/og-preview.jpg` with high visual quality (e.g. using Node script with sharp/canvas/pure jpeg generator with dark background `#080806`, cyan `#00f2ff` accents, title "Srinivasa Manikanta Rajapantula (RSMK) | Embedded Systems, Industrial Automation & IoT").
   - Update `index.html` lines 86-92:
     - `og:image`: `https://rsmk.tech/assets/og-preview.jpg`
     - `og:image:url`: `https://rsmk.tech/assets/og-preview.jpg`
     - `og:image:secure_url`: `https://rsmk.tech/assets/og-preview.jpg`
     - `og:image:type`: `image/jpeg`
     - `og:image:width`: `1200`
     - `og:image:height`: `630`
     - `twitter:image`: `https://rsmk.tech/assets/og-preview.jpg`
   - In `components/common/SEO.tsx`:
     - Update default image to `https://rsmk.tech/assets/og-preview.jpg`.
     - In Helmet, add `<meta name="keywords" content={finalKeywords} />`.

5. Delete 43.5 MB of Unreferenced WhatsApp Videos & Artifacts:
   - In `public/assets/gallery/`, delete:
     - `vid-20260106-WA0007.mp4`
     - `vid-20260107-WA0006.mp4`
     - `vid-20260107-WA0004.mp4`
     - `vid-20260107-WA0064.mp4`
   - Delete `public/font_comparison.html`
   - Delete `public/assets/srinivasa-manikanta-profile.webp.bak` (and any other `*.bak` files in `public/assets/`)

6. Canonicalize `/videos` to `/automation` in `App.tsx` and `scripts/prerender.js`:
   - In `App.tsx`: redirect `/videos` to `/automation` using `<Navigate to="/automation" replace />` (import `Navigate` from `react-router-dom`).
   - In `scripts/prerender.js`: ensure `/videos` config canonical points to `https://rsmk.tech/automation`.

7. Remove Unused LinkedIn Script from `index.html`:
   - Remove `<script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>` from `index.html`.

8. Verification:
   - Run `npm run typecheck` (verify 0 TypeScript errors).
   - Run `npm run build` (verify clean Vite build and SSG prerender of `/gallery`, `/automation`, `/videos`).
   - Verify all 36 certificates in `CertificationsBlock.tsx` have valid `.png` preview paths.
   - Verify `Test-Path public/favicon.ico` returns `True`.
   - Verify `public/assets/gallery/` has 0 unreferenced WhatsApp videos.

When finished, write a comprehensive `handoff.md` and `progress.md` in your state folder (`d:\websites\git clone\myportfolio\.agents\teamwork\worker_m2_info_seo/`), documenting all modified/deleted/created files and verification command results, then send a message back to me with your completion summary.
