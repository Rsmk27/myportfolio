## 2026-11-11T12:14:53Z
You are the Sub-Orchestrator for Milestone 2 (Information Architecture & SEO Remediation).
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m2_info_seo
Scope document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m2_info_seo\SCOPE.md
Project document: d:\websites\git clone\myportfolio\PROJECT.md
Original request file: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Parent conversation ID: b571eb47-18ed-4b8a-b0c8-4e2e070cdf60

Audit references:
- Explorer 2 handoff: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_info_seo\handoff.md
- Explorer 2 analysis: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_info_seo\analysis.md

Your mission:
1. Initialize your BRIEFING.md and progress.md in your state folder.
2. Read ORIGINAL_REQUEST.md, SCOPE.md, and the audit references.
3. Execute the iteration loop to implement all Milestone 2 fixes:
   - Map 31 certificates in `components/CertificationsBlock.tsx` from `.pdf` to corresponding `.png` preview images in `public/assets/certifications/`.
   - Restore missing projects `p2` (CODESYS Industrial Automation) and `p4` (GridForge) in `constants.tsx` to align with schema/noscript; fix `p7` (SPDS) image to a proper engineering visual.
   - Generate multi-size `/public/favicon.ico` and `/public/manifest.json`, and link them properly in `index.html`.
   - Create true 1200x630 OpenGraph preview banner (`og-preview.jpg`) and fix `index.html` and `SEO.tsx` OG metadata tags (dimensions 1200x630, MIME image/jpeg).
   - Delete 43.5 MB of unreferenced WhatsApp videos from `public/assets/gallery/` (`vid-2026010*.mp4`), `public/font_comparison.html`, and `public/assets/*.bak`.
   - Add `<meta name="keywords" content={finalKeywords} />` inside `<Helmet>` in `components/common/SEO.tsx`.
   - Canonicalize `/videos` to `/automation` in `App.tsx` and `scripts/prerender.js`.
   - Remove unused LinkedIn badge script tag from `index.html`.
4. Dispatch Worker (`teamwork_worker`) to implement the changes and verify builds and TypeScript strict check. Worker MUST receive the verbatim MANDATORY INTEGRITY WARNING.
5. Dispatch Reviewer (`teamwork_reviewer`) to objectively review and challenge the implementation.
6. Verify gate criteria: clean build, TypeScript clean (`npm run typecheck`), all 36 certificate previews render image tags, favicon exists, 0 unreferenced videos.
7. Record verdicts in GATE_STATUS.md and write your final handoff.md in your state folder.
8. Send a completion message back to parent orchestrator.
