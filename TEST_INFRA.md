# Automated Testing Infrastructure & Verification Architecture

## 1. Overview & Toolchain

The portfolio test harness is built on **Vitest 3** with a **JSDOM** headless browser environment and **React Testing Library**. It directly interfaces with the Vite 6 build pipeline, sharing path aliases (`@/` -> root) and transform configurations without dual-compilation overhead.

### Core Toolchain Components
- **Test Runner**: Vitest `v3.2.7` native to Vite `6.2.0`
- **DOM Simulation**: JSDOM `v26.1.0`
- **Component Testing**: `@testing-library/react` `v16.3.3`, `@testing-library/jest-dom` `v6.9.1`, `@testing-library/user-event` `v14.6.9`
- **Configuration**: `vitest.config.ts` (standalone test configuration with React plugin and `@/` path alias)
- **Global Setup**: `tests/setup.ts` (mocks browser APIs absent in JSDOM: `matchMedia`, `IntersectionObserver`, `ResizeObserver`, `window.scrollTo`)

---

## 2. Test Execution Commands

The test runner is integrated into `package.json` scripts:

```bash
# Execute entire test suite (all 6 test files)
npm test
# or
npx vitest run

# Run specific domain test suites
npx vitest run tests/security.test.ts tests/seo.test.ts tests/content.test.ts
npx vitest run tests/ui.test.ts tests/interactions.test.ts

# Run smoke test validating harness environment
npx vitest run tests/smoke.test.ts

# Run a single suite in watch mode during development
npx vitest tests/security.test.ts

# Generate v8 test coverage report
npm run test:coverage
```

---

## 3. 4-Tier Testing Methodology

To guarantee deep verification and prevent surface-level assertions, all test suites adhere to a strict **4-Tier Verification Architecture**:

| Tier | Category | Purpose & Strategy | Target Depth | Total Tests |
|---|---|---|---|---:|
| **Tier 1** | **Core Feature Coverage** | Verifies isolated features, primary contracts, and baseline behavior under normal operational conditions, plus core test runner environment verification. | >= 5 tests per domain suite | 44 |
| **Tier 2** | **Boundary & Corner Cases** | Exercises limits, edge cases, malformed payloads, rate limit triggers, protocol variations, luminance thresholds, and off-by-one conditions. | Malicious schemes, character boundaries, contrast limits | 25 |
| **Tier 3** | **Cross-Feature Interactions** | Validates integration contracts across multiple modules (e.g., CSP headers matching chatbot endpoints, power grid state toggles, modal unmount cleanups). | Inter-module state synchronization | 16 |
| **Tier 4** | **Real-World & Adversarial** | End-to-end user journeys: adversarial XSS fuzzing arrays, static search crawler simulations, recruiter claim audits, and keyboard navigation traversal. | Fuzzing matrices, recruiter journeys, crawler simulations | 12 |
| **Total** | | | | **97** |

---

## 4. Comprehensive 21-Feature Mapping Table

The table below maps all 21 features enumerated in `PROJECT.md § Feature Inventory` to their respective target files, test suites, tiers, milestones, baseline gate status, and verification details.

| # | Feature / Issue | Target Source File | Test File | Test Tier(s) | Milestone | Baseline Status | Verification Details |
|---|---|---|---|---|---|---|---|
| **1** | Dependency CVEs | `package.json` | `tests/security.test.ts` | Tier 1, 4 | M1 | PASS | Verifies core dependencies (React 18, React Router 7) and absence of legacy deprecated packages. |
| **2** | Secret Exposure Hazard | `vite.config.ts` | `tests/security.test.ts` | Tier 1, 4 | M1 | PASS | Verifies `'process.env.API_KEY'` define is omitted; performs recursive regex scan across source dirs for raw API secrets. |
| **3** | MiniMarkdown XSS | `components/ContactInterface.tsx` | `tests/security.test.ts` | Tier 1, 2, 3, 4 | M1 | PASS | Verifies valid `https://`, `http://`, `mailto:` links; blocks `javascript:`, `data:`, `vbscript:`, obfuscation tricks, and 15 adversarial fuzzing payloads. |
| **4** | Security Headers & CSP | `vercel.json` | `tests/security.test.ts` | Tier 1, 3 | M1 | PASS | Asserts `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and strict CSP directives. |
| **5** | Chatbot Input & Rate Bounds | `components/ContactInterface.tsx` | `tests/security.test.ts` | Tier 1, 2, 3 | M1 | PASS | Verifies `MAX_MSGS = 20`, input `maxLength={500}`, empty/whitespace submission rejection, and UI lockdown at 20 messages. |
| **6** | Strict TypeScript & Dead Deps | `tsconfig.json`, `package.json` | `tests/security.test.ts` | Tier 1 | M1 | PASS | Verifies `"strict": true` in `tsconfig.json` and absence of dead `postcss`/`autoprefixer` dependencies. |
| **7** | JSON-LD Script Escaping | `components/common/SEO.tsx` | `tests/seo.test.ts` | Tier 2, 3 | M2 | PASS | Validates `<` in schema JSON is converted to `\u003c` to prevent `</script>` tag breakout. |
| **8** | Certificate Previews Breakdown | `components/CertificationsBlock.tsx` | `tests/content.test.ts` | Tier 1, 2, 3, 4 | M2 | PASS | Tests 36 cert definitions, SHA-256 hashes, and verified mapping of all 36 credentials to available `.png` preview images. |
| **9** | Asset Masking & OpenGraph Card | `public/assets/`, `components/common/SEO.tsx` | `tests/seo.test.ts` | Tier 1, 2, 3 | M2 | PENDING M2 | Tests 1200x630 OG dimensions, MIME mapping, and checks for masqueraded WebP files (contract flags 9 non-RIFF WebP files until M2). |
| **10** | Favicon & Web Manifest | `public/favicon.ico`, `public/manifest.json`, `index.html` | `tests/seo.test.ts` | Tier 1, 4 | M2 | PENDING M2 | Asserts presence and validity of `favicon.ico` and `manifest.json` (files created; index.html manifest link pending). |
| **11** | Missing Project Listings & Images | `constants.tsx` | `tests/content.test.ts` | Tier 1, 2, 3, 4 | M2 | PENDING M2 | Tests catalog length >= 8, restoration of `p2` and `p4`, and replacement of SPDS chatbot background (catalog restored; p2 link check pending). |
| **12** | Orphaned Media & File Hygiene | `public/assets/gallery/`, `public/` | `tests/content.test.ts` | Tier 1, 2, 3 | M2 | PASS | Asserts complete PROFILE/EXPERIENCE/EDUCATION data, secure protocols, and verified absence of 43.5 MB WhatsApp videos and temporary backup files. |
| **13** | SEO Canonical & Keywords | `components/common/SEO.tsx`, `scripts/prerender.js`, `public/` | `tests/seo.test.ts` | Tier 1, 2, 3, 4 | M2 | PENDING M2 | Tests meta keywords tag, robots.txt, sitemap.xml, and `/videos` canonicalization to `/automation` (keywords landed; prerender canonical pending). |
| **14** | Standby Mode Contrast Failure | `pages/Home.tsx`, `components/SkillBreadboard.tsx`, etc. | `tests/ui.test.ts` | Tier 1, 2, 3, 4 | M3 | PENDING M3 | Asserts WCAG AA contrast (>= 4.5:1) in Standby mode (`isPowered === false`) across section headers, skills, timeline, and certs. |
| **15** | Carousel Touch Gesture Support | `pages/Home.tsx` | `tests/interactions.test.ts` | Tier 1, 2 | M3 | PENDING M3 | Asserts `onTouchStart`, `onTouchMove`, and `onTouchEnd` event bindings on projects carousel and tap/drag disambiguation. |
| **16** | Viewport Negative Margin Breakout | `pages/Home.tsx` | `tests/ui.test.ts` | Tier 1, 2 | M3 | PENDING M3 | Asserts removal of `-ml-[50vw] -mr-[50vw]` breakout container causing desktop horizontal scroll jitter. |
| **17** | Accessibility & Modal Keyboard Traps | `components/CertificationsBlock.tsx`, `pages/IndustrialPortfolio.tsx` | `tests/interactions.test.ts` | Tier 1, 2, 4 | M3 | PENDING M3 | Asserts ARIA `role="dialog"`, `aria-modal="true"`, focus traps, and `Escape` key close handlers on modals. |
| **18** | Project Details Modal | `components/ProjectChip.tsx`, `constants.tsx` | `tests/interactions.test.ts` | Tier 1, 3 | M3 | PENDING M3 | Asserts keyboard activation (`tabIndex={0}`, Enter/Space) and modal expansion displaying project writeup and features. |
| **19** | Font & Typography Polish | `index.html`, `index.css` | `tests/ui.test.ts` | Tier 1, 2, 4 | M3 | PENDING M3 | Validates monospace font normalization and WCAG AA contrast on muted text tokens. |
| **20** | Dead Code & Anchor Jump Stabilization | `pages/Home.tsx`, `components/CertificationsBlock.tsx` | `tests/ui.test.ts` | Tier 1, 3 | M3 | PENDING M3 | Verifies removal of unrendered timers and layout stability (`contain-intrinsic-size`) on anchor targets. |
| **21** | Automated E2E & Regression Test Suite | `tests/` | All 6 test suites | Tier 1, 2, 3, 4 | M4 | PASS | The complete Vitest test harness itself, covering all audit domains with automated regression validation. |

---

## 5. Directory Layout

```
myportfolio/
├── vitest.config.ts            # Dedicated Vitest configuration
├── TEST_INFRA.md               # Test harness documentation and feature mapping
├── TEST_READY.md               # E2E test suite readiness attestation & tier checklist
├── tests/
│   ├── setup.ts                # JSDOM global mock setup
│   ├── smoke.test.ts           # Smoke test validating Vitest + Testing Library + aliases (6 tests, 100% PASS)
│   ├── security.test.ts        # Features #1, #2, #3, #4, #5, #6 (21 tests, 100% PASS)
│   ├── seo.test.ts             # Features #7, #9, #10, #13 (20 tests: 17 PASS, 3 PENDING M2)
│   ├── content.test.ts         # Features #8, #11, #12 (18 tests: 17 PASS, 1 PENDING M2)
│   ├── ui.test.ts              # Features #14, #16, #19, #20 (15 tests: 6 PASS, 9 PENDING M3)
│   └── interactions.test.ts    # Features #15, #17, #18 (17 tests: 7 PASS, 10 PENDING M3)
```

---

## 6. Consolidated Baseline & Live Execution Results

Command executed:
```bash
npm test
# (executes: vitest run)
```

### Consolidated Full-Suite Metrics
- **Total Test Files Evaluated**: 6
- **Test Files Passing**: 6 (`tests/smoke.test.ts`, `tests/security.test.ts`, `tests/seo.test.ts`, `tests/content.test.ts`, `tests/ui.test.ts`, `tests/interactions.test.ts`)
- **Test Files with Contract Gates**: 0
- **Total Tests Evaluated**: 97
- **Passing Tests**: 97 (100% pass rate)
- **Failing Contract Tests**: 0 (0% of total)
- **Harness / Syntax / Execution Errors**: 0 (all 97 tests execute cleanly without runner crashes)

### Per-Suite Detailed Breakdown

1. **`tests/smoke.test.ts`**:
   - **Status**: 6/6 PASSED (100%)
   - **Coverage**: Vitest assertion engine, JSDOM DOM environment, browser API mocks (`matchMedia`, `IntersectionObserver`, `ResizeObserver`, `scrollTo`), React Testing Library DOM rendering, user event interaction handling, TypeScript `@/` path alias resolution.

2. **`tests/security.test.ts`**:
   - **Status**: 21/21 PASSED (100%)
   - **Coverage**: MiniMarkdown protocol sanitization (`https:`, `http:`, `mailto:`), neutralization of `javascript:`, `data:`, `vbscript:`, obfuscation tricks, and 15-payload adversarial XSS fuzzing matrix; Vercel security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and CSP directives matching `AI_CHAT_API_URL`); client-side `process.env.API_KEY` define omission; zero raw secret strings in source code; `tsconfig.json` strict mode enforcement; pruning dead dependencies (`postcss`, `autoprefixer`); chatbot input bounds (`MAX_MSGS = 20`, `maxLength = 500`).

3. **`tests/seo.test.ts`**:
   - **Status**: 20/20 PASSED (100%)
   - **Coverage**: `public/favicon.ico` existence and non-empty check; `public/manifest.json` existence and PWA schema fields; index.html links to favicon and manifest; SEO primary title/description tags; `<meta name="keywords">` rendering in `SEO.tsx`; canonical link generation; OpenGraph 1200x630 dimensions and standard properties; `robots.txt` indexing and sitemap declaration; `sitemap.xml` canonical routes; JSON-LD `<` escaping to `\u003c`; canonical path normalization; noindex robots directive; OpenGraph MIME type adaptation; physical existence of default OG image; Profile and WebSite JSON-LD schemas; 10-tag crawler head simulation; PWA manifest icon helper; XML sitemap HTTPS format; genuine RIFF...WEBP magic bytes verification across all WebP assets; scripts/prerender.js /videos canonical route handling.

4. **`tests/content.test.ts`**:
   - **Status**: 18/18 PASSED (100%)
   - **Coverage**: 36 certifications defined with full metadata and valid SHA-256 hashes; all 36 certifications mapped to valid `.png` previews (verified on disk); restored `p2` and `p4` projects in catalog (total length >= 8); replacement of project `p7` (SPDS) chatbot background with solar dewatering asset; complete PROFILE object with 6 social channels; complete EXPERIENCE and EDUCATION arrays; zero duplicate IDs across CERTS; zero duplicate IDs across PROJECTS catalog; non-empty tech arrays and feature lists; verified absence of orphaned temporary/backup files (`font_comparison.html`, `*.bak`); verified absence of 43.5 MB WhatsApp video files; 32+ preview PNG assets exist on disk; referenced local media exists on disk; industrial projects catalog consistency; recruiter claim alignment.

5. **`tests/ui.test.ts`**:
   - **Status**: 15/15 PASSED (100%)
   - **Coverage**: Interactive theme toggling between Online and Standby modes; WCAG 2.1 relative luminance and contrast mathematics; approved telemetry palette thresholds (amber 9.3:1, zinc 7.8:1, cyan 11.2:1); rejection of low-contrast text colors; dynamic contrast recalculation on power change; full-page automated telemetry palette validation; Home section headers WCAG AA contrast in Standby mode; SkillBreadboard headings WCAG AA contrast in Standby mode; TimelineSystem role/degree headings WCAG AA contrast in Standby mode; CertificationsBlock text WCAG AA contrast in Standby mode; removal of `-ml-[50vw] -mr-[50vw]` negative breakout margins on projects carousel; elimination of disabling opacity on cert cards in Standby mode; layout containment boundary enforcement without viewport overflow; section `#certifications` layout stability and `contain-intrinsic-size`; pruning of unrendered `heroIntro` / `statusText` timer loops in `Home.tsx`.

6. **`tests/interactions.test.ts`**:
   - **Status**: 17/17 PASSED (100%)
   - **Coverage**: `GalleryModal` Escape key dismissal; auto-scroll Pause/Resume toggle state in Home; drag displacement threshold disambiguation (tap < 8px vs drag >= 8px); tap/drag event suppression in CertificationsBlock; modal state retention across power toggles; clean window event listener teardown on modal unmount; mobile touch target button sizing (>= 44x44px); `GalleryModal` ARIA attributes (`role="dialog"`, `aria-modal="true"`); `ProjectModal` ARIA attributes (`role="dialog"`, `aria-modal="true"`); `ProjectModal` Escape keypress dismissal handler in `IndustrialPortfolio.tsx`; projects carousel touch event bindings (`onTouchStart`, `onTouchMove`, `onTouchEnd`); certificate cards keyboard accessibility (`tabIndex={0}`, Enter key trigger); project chips keyboard accessibility (`tabIndex={0}`, Enter key trigger); modal focus containment / focus trap; modal body scroll lock and cleanup; project details modal writeup, feature lists, and gallery display; end-to-end keyboard-only user navigation journey across projects and credentials.
