# Scope: Milestone 2 — Information Architecture & SEO Remediation

## Architecture
- Components: `components/CertificationsBlock.tsx`, `components/common/SEO.tsx`.
- Data: `constants.tsx`.
- Root & Routing: `index.html`, `App.tsx`, `scripts/prerender.js`, `vercel.json`.
- Public Assets: `public/assets/certifications/`, `public/assets/`, `public/favicon.ico`, `public/manifest.json`.

## Feature Inventory & Tasks
| # | Feature / Issue | Description | File Ownership | Status |
|---|-----------------|-------------|----------------|--------|
| 1 | Certificate Previews | Map 31 certificates in `CertificationsBlock.tsx` from `.pdf` to corresponding high-res `.png` previews in `public/assets/certifications/` | `components/CertificationsBlock.tsx` | DONE |
| 2 | Missing Project Listings & Images | Restore missing projects p2 & p4 in `constants.tsx` to match schema/noscript; correct p7 (SPDS) image path | `constants.tsx` | DONE |
| 3 | Favicon & Web Manifest | Create standard multi-size `/public/favicon.ico` and `/public/manifest.json`; link in `index.html` | `public/favicon.ico`, `public/manifest.json`, `index.html` | DONE |
| 4 | Asset Masking & OpenGraph Dimensions | Create true 1200x630 OG preview banner (`og-preview.jpg`); fix `index.html` and `SEO.tsx` OG metadata | `public/assets/og-preview.jpg`, `index.html`, `SEO.tsx` | DONE |
| 5 | Orphaned Media & Artifact Cleanup | Remove 43.5 MB unreferenced WhatsApp videos in `public/assets/gallery/`, `font_comparison.html`, and `*.bak` files | `public/assets/gallery/`, `public/` | DONE |
| 6 | Keywords Meta Tag | Add `<meta name="keywords" content={finalKeywords} />` inside `<Helmet>` in `components/common/SEO.tsx` | `components/common/SEO.tsx` | DONE |
| 7 | Canonical Routing Consolidation | Canonicalize `/videos` to `/automation` in `App.tsx` and `scripts/prerender.js` | `App.tsx`, `scripts/prerender.js` | DONE |
| 8 | Remove Dead LinkedIn Badge Script | Delete unused `<script src="https://platform.linkedin.com/badges/js/profile.js">` from `index.html` | `index.html` | DONE |

## Exclusive Write Ownership
This milestone exclusively owns:
- `components/CertificationsBlock.tsx` (certificate image mappings)
- `constants.tsx`
- `components/common/SEO.tsx`
- `index.html`
- `App.tsx`
- `scripts/prerender.js`
- `public/favicon.ico`, `public/manifest.json`, `public/assets/og-preview.jpg`
- `public/assets/gallery/` (deletion of unreferenced MP4s)

## Verification Methods
1. Verify `components/CertificationsBlock.tsx` contains 0 `.pdf` references in `image:` properties.
2. Verify `Test-Path public/favicon.ico` and `public/manifest.json` return `True`.
3. Verify `npm run build`: builds and prerenders SSG pages cleanly.
4. Verify `constants.tsx` contains projects p1 through p8.
5. Verify `public/assets/gallery/` contains 0 unreferenced WhatsApp videos.
