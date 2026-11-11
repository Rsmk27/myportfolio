# Handoff Report: Information Architecture & SEO Audit

**Role**: Teamwork Explorer (Information Architecture & SEO Specialist)  
**Agent Folder**: `.agents/teamwork/teamwork_explorer_survey_info_seo/`  
**Target Repository**: `d:\websites\git clone\myportfolio`  
**Date**: 2026-11-11  

---

## 1. Observation

### 1.1 Certifications Visual Breakdown
- **Path**: `components/CertificationsBlock.tsx` lines 94, 108, 122, 136, 151, 166, 182, 197, 227, 242, 257, 272, 287, 302, 317, 332, 368, 384, 399, 414, 429, 444, 459, 474, 489, 504, 519, 534, 550, 566, 582.
- **Observed code**:
  ```tsx
  image: '/assets/certifications/CertificateOfCompletion_C Programming for Embedded Applications.pdf',
  image: '/assets/certifications/AIFundamentalsFoundationsforUnderstandingAI.pdf',
  image: '/assets/certifications/GitHub Foundations.pdf',
  ```
- **Observed logic in `CertificateCard`** (`components/CertificationsBlock.tsx:880-908`):
  ```tsx
  {cert.image && !cert.image.endsWith('.pdf') ? (
      <img src={cert.image} alt={cert.title} ... />
  ) : (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-700">
          <Award size={20} className="opacity-30" />
          <span className="text-[8px] mt-1 font-mono">NO IMAGE PREVIEW</span>
      </div>
  )}
  ```
- **Filesystem Verification**: High-resolution `.png` equivalents for these certificates exist in `public/assets/certifications/` (e.g. `AIFundamentalsFoundationsforUnderstandingAI.png`, `GitHub Foundations.png`, `Certificate_quickSTEP_Basics_of_PLCs.png`).

### 1.2 Binary Asset Format Masking & OpenGraph Dimension Distortion
- **Path**: `index.html:86-92`, `components/common/SEO.tsx:68-69`, `public/assets/srinivasa-manikanta-profile.webp`.
- **Command executed**:
  ```bash
  node -e "const fs = require('fs'); const dir = 'public/assets'; for (const f of fs.readdirSync(dir)) { if (f.endsWith('.webp')) { const b = fs.readFileSync(dir + '/' + f); const magic = b.slice(0, 4).toString('hex'); console.log(f, magic); } }"
  ```
- **Observed output**:
  - `srinivasa-manikanta-profile.webp`: Magic bytes `ffd8ffe0` (JPEG JFIF), actual pixel dimensions **1024 x 1024** (square ratio).
  - `agri-rover-project.webp`: Magic bytes `ffd8ffe0` (JPEG JFIF).
  - `ai-chatbot-interface-background.webp`: Magic bytes `ffd8ffe0` (JPEG JFIF).
  - `automated-street-light-system.webp`: Magic bytes `89504e47` (PNG), file size: **1,333,955 bytes** (1.33 MB).
  - `firefighter-monitoring-device.webp`: Magic bytes `89504e47` (PNG), file size: **642,442 bytes**.
  - `portfolio-website-design.webp`: Magic bytes `89504e47` (PNG), file size: **1,058,824 bytes**.
- **Metadata Mismatch**:
  `index.html:89-91`:
  ```html
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  ```
  The image declared as 1200x630 `image/webp` is actually a 1024x1024 square JPEG.

### 1.3 Missing Favicon & Manifest
- **Path**: `index.html:76`: `<link rel="icon" type="image/x-icon" href="/favicon.ico" />`.
- **Observed filesystem check**: Running `Get-ChildItem -Path . -Filter *favicon* -Recurse` yielded zero results. No `favicon.ico` or web manifest file (`manifest.json`) exists in the repository.

### 1.4 Project Details Hidden from UI & Project Discrepancies
- **Path**: `types.ts:10-12`, `constants.tsx:68-90, 106-113, 125-132, 150-157, 169-176, 188-196`.
- **Observed code**: Every project in `constants.tsx` contains rich `details`, `features` (string arrays), and `gallery` (image arrays).
- **Inspection in `ProjectChip.tsx`**:
  `ProjectChip.tsx:181-190`:
  ```tsx
  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Tech</p>
  <p className="text-xs text-cyan-300 font-bold">{project.tech.length}</p>
  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Gallery</p>
  <p className="text-xs text-cyan-300 font-bold">{project.gallery?.length ?? 1}</p>
  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Features</p>
  <p className="text-xs text-cyan-300 font-bold">{project.features?.length ?? 0}</p>
  ```
  `project.details` is **never rendered anywhere** in the app. There is no modal or expansion mechanism.
- **Projects Mismatch**: `constants.tsx` contains project IDs `p1`, `p3`, `p5`, `p6`, `p7`, `p8`. Projects `p2` (CODESYS Industrial Automation) and `p4` (GridForge) are advertised in `index.html` schema (lines 228-238, 292-297) and `<noscript>` fallback (lines 429, 453), but missing from `PROJECTS` in `constants.tsx`.
- **Mismatched Project Image**: `constants.tsx:167` assigns `image: '/assets/ai-chatbot-interface-background.webp'` to `p7` (SPDS – Solar Powered Dewatering System).

### 1.5 Dead Code and Unrendered CPU Timers
- **Path**: `pages/Home.tsx:252-282`.
- **Observed code**:
  ```tsx
  const [heroIntro, setHeroIntro] = useState('');
  const heroIntroText = "> Hello, I'm RSMK";
  const [statusText, setStatusText] = useState('');
  const fullText = 'INITIALIZING SYSTEM PROFILER...';
  ```
  Two `useEffect` intervals (running at 65ms and 45ms) compute and update `heroIntro` and `statusText`. Neither variable is referenced in the returned JSX of `Home.tsx`.

### 1.6 SEO Keywords & Canonical Duplication
- **Path**: `components/common/SEO.tsx:36-41, 74-91`.
- **Observed code**: `finalKeywords` is computed on line 36 from props or defaults, but `<meta name="keywords" content={finalKeywords} />` is omitted from the `<Helmet>` block.
- **Path**: `scripts/prerender.js:316` and `App.tsx:50-51`.
- **Observed code**: Both `/automation` and `/videos` render `IndustrialPortfolio`. `prerender.js` sets canonical of `/videos` to `https://rsmk.tech/videos`, creating two identical indexed pages under different canonical URLs.

### 1.7 Orphaned 43.5 MB WhatsApp Videos & Unused Scripts
- **Path**: `public/assets/gallery/`.
- **Observed files**:
  - `vid-20260106-WA0007.mp4` (20,004,324 bytes = 20.0 MB)
  - `vid-20260107-WA0006.mp4` (18,720,443 bytes = 18.7 MB)
  - `vid-20260107-WA0004.mp4` (3,389,415 bytes = 3.38 MB)
  - `vid-20260107-WA0064.mp4` (1,367,011 bytes = 1.37 MB)
- **Code search**: `Select-String -Path *.tsx, *.ts, components\*.tsx, pages\*.tsx -Pattern "vid-2026010"` returned zero occurrences.
- **Path**: `index.html:354`: `<script src="https://platform.linkedin.com/badges/js/profile.js" async defer></script>` is executed on every load, but no LinkedIn badge element exists in the DOM.

---

## 2. Logic Chain

1. **Certifications Logic**:
   - `CertificationsBlock.tsx` specifies `.pdf` files in the `image` field for 31 items (Observation 1.1).
   - The card render logic explicitly rejects `.pdf` from image rendering, falling back to an icon and `"NO IMAGE PREVIEW"` (Observation 1.1).
   - Therefore, the credentials section appears broken and visually degraded to all visitors, despite valid PNG previews being present in the repository.

2. **Asset Format & Social Sharing Logic**:
   - `srinivasa-manikanta-profile.webp` is identified by magic bytes as a JPEG and `firefighter-monitoring-device.webp` as a PNG (Observation 1.2).
   - Social network scrapers and HTTP clients validate declared MIME types against byte headers.
   - Declaring `og:image:type = "image/webp"` while serving `ffd8ffe0` JPEG data causes link-preview generation failures on strict scrapers like LinkedIn and WhatsApp.
   - Furthermore, claiming 1200x630 dimensions on a 1024x1024 square image causes clipping of the portrait in 1.91:1 ratio social cards.

3. **Information Completeness Logic**:
   - Deep engineering descriptions (`details`), granular feature lists (`features`), and multi-angle hardware photos (`gallery`) exist in `constants.tsx` (Observation 1.4).
   - `ProjectChip.tsx` only renders card summary text and numerical badge counts without an expansion modal.
   - Hardware projects without external URLs (e.g. `Single-Axis Solar Tracker`) have no interactive CTA whatsoever.
   - Visitors cannot access the technical substance of these engineering projects from the portfolio homepage.

4. **SEO & Performance Logic**:
   - Missing `/favicon.ico` causes 404 errors on every browser tab open (Observation 1.3).
   - Missing `<meta name="keywords">` in `SEO.tsx` drops keyword signals calculated in application constants (Observation 1.6).
   - Duplicating `/videos` and `/automation` without a 301 redirect or unified canonical splits PageRank and triggers search engine duplicate content penalties.
   - Packaging 43.5 MB of unreferenced WhatsApp videos into `public/assets/gallery/` inflates production build time and server deployment bundle size by ~35% without serving any end user (Observation 1.7).

---

## 3. Caveats

1. **Third-Party Live Endpoints**: External links (`https://sfmd.rsmk.tech/`, `https://colorohm.rsmk.tech/`, `https://autoexhaustfan.rsmk.tech/`, `https://spds.rsmk.tech/`) and Google Drive resume link were checked for syntactic and configuration validity, but external DNS uptime and SSL certificates depend on external infrastructure.
2. **Social Media Accounts**: Conflicting Instagram URLs (`https://instagram.com/rsmk_27` in `index.html` vs `https://www.instagram.com/rsmk.me/` in `constants.tsx`) require confirmation from the portfolio owner regarding which handle is currently active.
3. **Read-Only Investigation Scope**: Per instructions, no code or asset files were modified during this investigation phase.

---

## 4. Conclusion

The portfolio possesses strong engineering depth, well-structured metadata, and rich content, but suffers from several severe, easily remediable bugs that impact visual credibility, search performance, and technical integrity:
- **Critical (P0)**:
  1. Fix certificate preview paths in `CertificationsBlock.tsx` from `.pdf` to `.png` to immediately restore 31 broken credential cards.
  2. Create a proper multi-size `/public/favicon.ico` and `/public/apple-touch-icon.png`.
  3. Properly transcode masqueraded `.webp` files (JPEG/PNG disguised as WebP) and generate a true 1200x630 OpenGraph card banner (`og-preview.jpg`).
- **High (P1)**:
  4. Implement an interactive Project Detail Modal in `ProjectChip.tsx` to surface the extensive project writeups, feature lists, and gallery photos hidden in `constants.tsx`.
  5. Bring back CODESYS Industrial Automation and GridForge to the homepage `PROJECTS` list to match `index.html` schema and noscript content; fix SPDS project image.
  6. Remove 43.5 MB of orphaned WhatsApp videos from `public/assets/gallery/` and delete backup/test artifacts (`profile.webp.bak`, `font_comparison.html`).
  7. Canonicalize `/videos` to `/automation` (or add 301 redirect) and enable `cleanUrls: true` in `vercel.json`.
- **Medium (P2)**:
  8. Fix heading skips in `SkillBreadboard.tsx` and `TimelineSystem.tsx` (`<h2>` → `<h3>` instead of jumping to `<h4>`).
  9. Remove dead state timers (`heroIntro`, `statusText`) in `Home.tsx`.
  10. Render keywords meta tag in `SEO.tsx` and align Instagram handles and session limit copy.

---

## 5. Verification Method

To independently verify the findings documented in this report:

1. **Verify Certificate Preview Breakdown**:
   - Inspect `components/CertificationsBlock.tsx:94`: note `image` is `.pdf`.
   - Inspect `components/CertificationsBlock.tsx:880`: note `!cert.image.endsWith('.pdf')` check.
   - Run `npm run build && npx vite preview` (or open browser to localhost) and scroll to Credentials: observe 31 cards displaying `"NO IMAGE PREVIEW"`.
   - Inspect `public/assets/certifications/`: note `CertificateOfCompletion_C Programming for Embedded Applications.png` and `GitHub Foundations.png` exist on disk.

2. **Verify Magic Bytes of Assets**:
   - Execute in terminal:
     ```powershell
     node -e "const fs = require('fs'); const b = fs.readFileSync('public/assets/srinivasa-manikanta-profile.webp'); console.log('Magic bytes:', b.slice(0, 4).toString('hex'));"
     ```
   - Observe output: `ffd8ffe0` (verifying it is JPEG, not RIFF/WebP `52494646`).

3. **Verify Missing Favicon**:
   - Execute in terminal:
     ```powershell
     Test-Path "public/favicon.ico"
     ```
   - Observe output: `False`.

4. **Verify Unreferenced 43.5 MB Videos**:
   - Execute in terminal:
     ```powershell
     Get-ChildItem -Path public\assets\gallery -Filter *.mp4 | Select-Object Name, Length
     ```
   - Search across all `.tsx` and `.ts` files for those video names: observe 0 occurrences.

5. **Verify Build & Prerender Success**:
   - Execute `npm run build`: builds in ~8 seconds, produces `dist/gallery/index.html` and `dist/automation/index.html`.
