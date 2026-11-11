# Task Assignment: Review Milestone 2 Implementation

## Assigned Agent: teamwork_reviewer
## Milestone: M2 (Information Architecture & SEO Remediation)
## Working Directory: d:\websites\git clone\myportfolio
## State Folder: d:\websites\git clone\myportfolio\.agents\teamwork\reviewer_m2_info_seo
## Parent Sub-Orchestrator: sub_orch_m2_info_seo

### Mandatory Documents to Read First:
1. `ORIGINAL_REQUEST.md`: `d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
2. `PROJECT.md`: `d:\websites\git clone\myportfolio\PROJECT.md`
3. `SCOPE.md`: `d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m2_info_seo\SCOPE.md`
4. Worker Handoff: `d:\websites\git clone\myportfolio\.agents\teamwork\worker_m2_info_seo\handoff.md`


## 2026-11-11T12:44:16Z
You are a teamwork_reviewer reviewing Milestone 2: Information Architecture & SEO Remediation.

Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\reviewer_m2_info_seo

First, read the following mandatory files:
1. ORIGINAL_REQUEST.md: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
2. PROJECT.md: d:\websites\git clone\myportfolio\PROJECT.md
3. SCOPE.md: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m2_info_seo\SCOPE.md
4. Worker Handoff: d:\websites\git clone\myportfolio\.agents\teamwork\worker_m2_info_seo\handoff.md

Your mission:
Objectively review and adversarially challenge all Milestone 2 changes against requirements and interface contracts:
1. Certifications Visual Breakdown (`components/CertificationsBlock.tsx`):
   - Check all 36 certificates in `CERTIFICATIONS`.
   - Verify that NO certificate has an `image:` ending in `.pdf`.
   - Verify that all referenced image paths exist in `public/assets/certifications/`.
   - Verify that PDF certificates are still available for viewing/download in `gallery` or modal.
2. Restored Projects (`constants.tsx`):
   - Verify projects `p1` through `p8` are all present in `PROJECTS`.
   - Verify `p2` (CODESYS) and `p4` (GridForge) have full details, 5+ features, tech stack, and valid links.
   - Verify `p7` (SPDS) has an authentic engineering visual (not `ai-chatbot-interface-background.webp`).
   - Verify strict TypeScript compliance with `types.ts`.
3. Favicon & Web Manifest (`public/favicon.ico`, `public/manifest.json`, `index.html`):
   - Verify `public/favicon.ico` exists and is a valid multi-size ICO.
   - Verify `public/manifest.json` exists, is valid JSON, and is linked via `<link rel="manifest" href="/manifest.json" />` in `index.html`.
4. OpenGraph 1200x630 Banner & Meta (`public/assets/og-preview.jpg`, `components/common/SEO.tsx`, `index.html`):
   - Verify `public/assets/og-preview.jpg` exists with dimensions 1200x630 and JPEG format.
   - Verify `index.html` specifies `og:image` as `https://rsmk.tech/assets/og-preview.jpg` with `image/jpeg` and dimensions 1200x630.
   - Verify `components/common/SEO.tsx` renders `<meta name="keywords" content={finalKeywords} />`.
5. Clean Assets & Deleted Media:
   - Verify that `public/assets/gallery/` contains 0 WhatsApp videos (`vid-2026010*.mp4`).
   - Verify `font_comparison.html` and `.bak` files are deleted.
6. Canonicalization:
   - Verify `/videos` redirects to `/automation` in `App.tsx`.
   - Verify `scripts/prerender.js` sets canonical to `https://rsmk.tech/automation` for `/videos`.
7. LinkedIn Script:
   - Verify dead script tag `https://platform.linkedin.com/badges/js/profile.js` is removed from `index.html`.
8. Execution & Verification:
   - Run `npm run typecheck` (or `npx tsc --noEmit`).
   - Run `npm run build` to verify clean Vite build + SSG prerender.
   - Run any existing vitest tests (e.g. `npx vitest run tests/content.test.ts`).

Write your review report and clear verdict (`APPROVE` or `REQUEST_CHANGES`) in `handoff.md` in your state folder (`d:\websites\git clone\myportfolio\.agents\teamwork\reviewer_m2_info_seo\handoff.md`).
Then send a completion message back to me with your verdict and findings summary.
