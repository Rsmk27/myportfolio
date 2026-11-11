# Project: Portfolio Comprehensive Audit & Remediation

## Architecture
- **Framework**: Vite + React 19 + TypeScript + Tailwind CSS v4.
- **Routing & SSG**: React Router v7 with custom Node.js static site pre-renderer (`scripts/prerender.js`).
- **Hosting & Infrastructure**: Vercel configuration (`vercel.json`).
- **Core Modules**:
  - `components/`: UI components (Navbar, ContactInterface, SkillBreadboard, TimelineSystem, CertificationsBlock, ProjectChip, Terminal, CustomCursor, etc.).
  - `pages/`: Route views (`Home.tsx`, `IndustrialPortfolio.tsx`, `Gallery.tsx`, `NotFound.tsx`).
  - `data/`: `constants.tsx`, `industrialProjects.ts`.
  - `public/`: Static media, certifications, assets, and icons.

## Feature Inventory
| # | Feature / Issue | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Dependency CVEs | Update packages via `npm audit fix` to remediate 11 vulnerabilities (9 High) in vite, react-router, postcss, nanoid | M1 (DONE) | Survey |
| 2 | Secret Exposure Hazard | Remove unused client-side `process.env.API_KEY` define in `vite.config.ts` | M1 (DONE) | Survey |
| 3 | MiniMarkdown XSS | Sanitize and validate markdown links in `ContactInterface.tsx` to prevent `javascript:` URIs | M1 (DONE) | Survey |
| 4 | Security Headers & CSP | Configure comprehensive security headers & CSP in `vercel.json` | M1 (DONE) | Survey |
| 5 | Chatbot Input & Rate Bounds | Align `MAX_MSGS = 20` and add `maxLength={500}` to prevent backend abuse | M1 (DONE) | Survey |
| 6 | Strict TypeScript & Dead Deps | Prune dead `postcss`/`autoprefixer` deps and enable `"strict": true` in `tsconfig.json` | M1 (DONE) | Survey |
| 7 | JSON-LD Script Escaping | Escape `<` in JSON-LD `<script>` tag in `SEO.tsx` to prevent breakout | M1 (DONE) | Survey |
| 8 | Certificate Previews Breakdown | Map 31 certificates in `CertificationsBlock.tsx` to available `.png` image previews | M2 (DONE) | Survey |
| 9 | Asset Masking & OpenGraph Card | Fix masqueraded WebP files, create true 1200x630 OG banner and correct metadata | M2 (DONE) | Survey |
| 10 | Favicon & Web Manifest | Generate missing `/public/favicon.ico` and `/public/manifest.json` | M2 (DONE) | Survey |
| 11 | Missing Project Listings & Images | Restore missing projects p2 & p4 in `constants.tsx`; correct SPDS image | M2 (DONE) | Survey |
| 12 | Orphaned Media & File Hygiene | Delete unreferenced 43.5 MB WhatsApp videos, backup files, and internal test pages | M2 (DONE) | Survey |
| 13 | SEO Canonical & Keywords | Canonicalize `/videos` to `/automation`, add missing keywords tag in `SEO.tsx` | M2 (DONE) | Survey |
| 14 | Standby Mode Contrast Failure | Fix `#111111` / `text-gray-900` on dark background in Standby mode across Home, Skills, Timeline, Certs | M3 (DONE) | Survey |
| 15 | Carousel Touch Gesture Support | Add touch event handling and mobile drag support to auto-scrolling projects carousel | M3 (DONE) | Survey |
| 16 | Viewport Negative Margin Breakout | Remove `-ml-[50vw] -mr-[50vw]` overflow causing horizontal scroll jitter on desktop | M3 (DONE) | Survey |
| 17 | Accessibility & Modal Keyboard Traps | Implement ARIA `role="dialog"`, focus traps, and `Escape` key handlers on modals; add `tabIndex` and keyboard triggers to cards | M3 (DONE) | Survey |
| 18 | Project Details Modal | Surface rich project writeups, feature lists, and gallery photos from `constants.tsx` via modal | M3 (DONE) | Survey |
| 19 | Font & Typography Polish | Import `JetBrains Mono` or normalize to `Space Mono`; upgrade muted text contrast to WCAG AA | M3 (DONE) | Survey |
| 20 | Dead Code & Anchor Jump Stabilization | Remove unrendered `heroIntro`/`statusText` timers; fix `contain-intrinsic-size` on `#certifications` | M3 (DONE) | Survey |
| 21 | Automated E2E & Regression Test Suite | Implement test runner (Vitest) with automated tests covering security, SEO, contrast, and interactions | M4 (DONE) | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Security & Tech Hardening | Dependencies, vite.config.ts, XSS sanitization, CSP/headers, tsconfig strict mode | none | DONE |
| M2 | Information Architecture & SEO | Certifications previews, favicon/manifest, OG dimensions, constants.tsx, asset pruning, SEO canonicals | none | DONE |
| M3 | UI & Interactions Remediation | Standby high-contrast theme, carousel touch, modal accessibility/Escape, project detail modal, typography | M1, M2 | DONE |
| M4 | E2E Testing & Verification | Comprehensive test harness (Vitest), unit & component tests, full build verification, adversarial hardening | M1, M2, M3 | DONE |

## Interface Contracts
### Security & App Settings Contract
- `vite.config.ts`: Clean configuration without injecting secrets into client bundle (VERIFIED).
- `tsconfig.json`: `"strict": true` enforced (VERIFIED: 0 errors).
- `ContactInterface.tsx`: `MiniMarkdown` guarantees link URLs match `/^(https?:\/\/|mailto:)/i` (VERIFIED).
- `vercel.json`: Global security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy`) (VERIFIED).

### Information & SEO Contract
- `CertificationsBlock.tsx`: Every certificate must provide a valid `.png` preview URL from `public/assets/certifications/` (VERIFIED: 36/36 valid previews).
- `constants.tsx`: `PROJECTS` includes complete catalog (including p2 & p4) with valid details, features, and gallery references (VERIFIED: p1-p8 present).
- `public/`: Contains valid `favicon.ico`, `manifest.json`, and proper image binaries (VERIFIED).
- `SEO.tsx`: Emits complete OpenGraph, Twitter, canonical, and keywords tags with properly escaped JSON-LD schema (VERIFIED).

### UI & Interaction Theme Contract
- `Home.tsx`, `SkillBreadboard.tsx`, `TimelineSystem.tsx`, `CertificationsBlock.tsx`: When `isPowered === false` (STANDBY mode), text must use high-contrast telemetry colors (e.g., `#f59e0b` amber / `#a1a1aa` zinc), never dark `#111111` or `#18181b` on `#080806`. Contrast ratio must exceed 4.5:1 (VERIFIED: 7.5:1 to 12.3:1).
- Modals (`ProjectModal`, `GalleryModal`, `ProjectDetailModal`): Must support `Escape` key close, focus containment, and ARIA attributes (`role="dialog"`, `aria-modal="true"`) (VERIFIED).

## Code Layout
- `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `vercel.json`: Root configurations.
- `components/`:
  - `ContactInterface.tsx`: Chat & contact terminal.
  - `CertificationsBlock.tsx`: Certification credentials grid and preview modal.
  - `ProjectChip.tsx`: Project card item and expansion trigger.
  - `SkillBreadboard.tsx`: Skills matrix.
  - `TimelineSystem.tsx`: Career and education trajectory.
  - `CustomCursor.tsx`: Custom HUD cursor.
  - `common/SEO.tsx`: Meta tags and JSON-LD schema.
- `pages/`:
  - `Home.tsx`: Primary single-page portfolio view.
  - `IndustrialPortfolio.tsx`: Automation projects and video modal view.
  - `Gallery.tsx`: Hardware visual gallery.
- `scripts/`:
  - `prerender.js`: Node.js SSG build generator.
- `public/`:
  - `assets/`: Images, certifications, project photos.
- `tests/`:
  - Automated test files for security, SEO, contrast, and interactions.
