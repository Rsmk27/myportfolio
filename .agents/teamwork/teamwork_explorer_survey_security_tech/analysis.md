# Comprehensive Security and Tech Stack/Architecture Audit Report

**Project**: Srinivasa Manikanta Rajapantula (RSMK) – Engineering Portfolio  
**Audit Date**: 2026-11-11  
**Auditor**: Teamwork Explorer (Security & Tech Stack Specialist)  
**Status**: Investigation Complete  

---

## Executive Summary

A comprehensive, read-only technical audit of the portfolio codebase was conducted across security postures and architectural foundations. The project is a client-side Single Page Application (SPA) built with **React 18**, **TypeScript 5.8**, **Vite 6.2/6.4**, **Tailwind CSS v4**, and **Framer Motion**, hosted on **Vercel** with a companion AI chatbot backend hosted on **Render**.

### Key Findings Summary
| Area | Critical | High | Medium | Low | Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Security** | 0 | 4 | 2 | 3 | 9 |
| **Tech Stack & Architecture** | 0 | 1 | 3 | 2 | 6 |
| **Total** | **0** | **5** | **5** | **5** | **15** |

1. **Security Highlights**:
   - **11 package vulnerabilities (9 High)** flagged by `npm audit` across `vite`, `react-router`, `postcss`, `nanoid`, and `browserslist`.
   - **Secret leak hazard in `vite.config.ts`**: `process.env.API_KEY` and `process.env.GEMINI_API_KEY` are mapped to `env.GEMINI_API_KEY` via Vite's compile-time `define`, risking unintended client-side baking of private keys.
   - **XSS Vector via Unsanitized Markdown Links in `MiniMarkdown`**: `href={url}` directly accepts `javascript:` URLs without scheme validation.
   - **Missing Security Headers**: `vercel.json` lacks CSP, `X-Frame-Options` (Clickjacking), `X-Content-Type-Options`, and `Permissions-Policy`.
   - **Unrestricted Chat Terminal Form**: Client rate limit set to `999999` despite UI claiming 20; input length unconstrained.
2. **Architecture Highlights**:
   - **Strict TypeScript typechecking passes with zero errors** (`tsc --noEmit --strict`), but `"strict": true` is missing from `tsconfig.json`.
   - **Zero automated test infrastructure**: No Vitest/Jest, component tests, or E2E tests exist.
   - **Orphaned `src/` directory**: An empty `src/pages` folder exists while active source files reside in root.
   - **Dead devDependencies**: `postcss` and `autoprefixer` are unreferenced in Tailwind v4 and introduce vulnerable dependencies.

---

## 1. Security Audit Findings

### 1.1 Dependency Vulnerabilities (High)
- **Files**: `package.json`, `package-lock.json`
- **Observation**:
  Running `npm audit --json` identified **11 vulnerabilities (9 High, 1 Moderate, 1 Low)**:
  - **`vite` (High & Moderate)**: Direct devDependency (`vite@6.2.0` / `6.4.1` lockfile).
    - *GHSA-p9ff-h696-f583* (High, CVSS 7.5): Arbitrary file read via Vite Dev Server WebSocket.
    - *GHSA-587h-7wmj-h5pm* (High, CVSS 7.7): `launch-editor` `fs.existsSync()` existence check bypass on Windows.
    - *GHSA-4w7w-66w2-5vf9* (Moderate): Path traversal in optimized deps `.map` handling.
    - *GHSA-v6wh-96g9-6wx3* (Moderate): NTLMv2 hash disclosure via UNC path on Windows.
    - *GHSA-698v-4r3x-3vcv* (Moderate): `escapeCmdArgs()` omits `%` escaping on Windows.
    - *GHSA-r825-w8mm-5pxw* (Moderate): CLI flag misinterpretation causing arbitrary command execution.
    - *GHSA-rq7h-c2jc-7f22* (Moderate): Files outside `server.fs.allow` served on system path matches.
    - *GHSA-fx2h-pf6j-xcff* (Moderate): `server.fs.deny` bypass on Windows alternate paths.
  - **`react-router` / `react-router-dom` (High)**: Direct dependency (`react-router-dom@7.13.0`).
    - *GHSA-49rj-9fvp-4h2h* (High): Vendored turbo-stream v2 unauthenticated RCE via `TYPE_ERROR` deserialization.
    - *GHSA-wrjc-x8rr-h8h6* (High): Open redirect via backslash in `<Link>` and `useNavigate`.
    - *GHSA-84g9-w2xq-vcv6* (High): Potential CSRF via document requests.
    - *GHSA-8646-j5j9-6r62* (High): XSS in unstable redirect handling via `javascript:` targets.
    - *GHSA-8x6r-g9mw-2r78* (High): DoS via unbounded path expansion in `__manifest`.
  - **`nanoid` (High)**: Transitive dependency via `postcss@8.5.6`.
    - *GHSA-28wg-ghj8-5hjv*, *GHSA-2v37-7h3g-55p8*, *GHSA-xwg4-73v4-xw9w*: Infinite loop and integer overflow in non-secure and custom generators.
  - **`browserslist` (High)**: Transitive dependency via `autoprefixer@10.4.23`.
    - *GHSA-c83g-rgw3-j3cx* (High): Unbounded memory growth (no cache eviction) leading to OOM.
    - *GHSA-73wf-gq98-2v4g* (High): Prototype pollution / crash via untrusted stats.
- **Verification**: `npm audit fix --dry-run` successfully upgraded 35 packages resolving all 11 advisories (`vite` to 6.4.6, `react-router` to 7.18.5, `nanoid` to 3.3.20, `postcss` to 8.5.32).
- **Recommendation**:
  1. Execute `npm audit fix` to bump `vite` and `react-router-dom` to patched releases.
  2. Prune unneeded packages `postcss` and `autoprefixer` (see Section 2.3).

---

### 1.2 Secret Exposure Hazard in Vite Build Configuration (High)
- **File**: `vite.config.ts`, lines 14–17
- **Observation**:
  ```ts
  14: define: {
  15:   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  16:   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  17: },
  ```
- **Risk Analysis**:
  - Vite's `define` performs static string replacement at build time. Any client code referencing `process.env.API_KEY` or `process.env.GEMINI_API_KEY` will have the actual secret value hardcoded directly into public `.js` bundles.
  - Currently, no client code imports or uses `process.env.GEMINI_API_KEY` (the AI chat uses Render backend proxy `https://project-mani-c0t3.onrender.com/api/chat`).
  - However, retaining this config is a major latent security hazard: if an engineer or build pipeline populates `GEMINI_API_KEY` in environment variables and references it client-side, the secret is immediately compromised.
- **Recommendation**:
  - Delete lines 14–17 (`define` block) in `vite.config.ts`. All AI queries should continue going exclusively through the backend proxy.

---

### 1.3 Client-Side XSS in Custom Markdown Parser (`MiniMarkdown`) (High)
- **File**: `components/ContactInterface.tsx`, lines 80–99
- **Observation**:
  ```tsx
  80: // Link [label](url)
  81: if (text[j] === '[') {
  82:     const labelEnd = text.indexOf(']', j);
  83:     if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
  84:         const urlEnd = text.indexOf(')', labelEnd + 2);
  85:         if (urlEnd !== -1) {
  86:             flush();
  87:             const label = text.slice(j + 1, labelEnd);
  88:             const url = text.slice(labelEnd + 2, urlEnd);
  89:             push(
  90:                 <a key={`${key}-l${j}`} href={url} target="_blank" rel="noopener noreferrer"
  91:                     className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
  92:                     {label}
  93:                 </a>
  94:             );
  95:             j = urlEnd + 1;
  96:             continue;
  97:         }
  98:     }
  99: }
  ```
- **Risk Analysis**:
  - The `url` extracted between `(` and `)` is placed directly into `<a href={url}>` without protocol scheme validation.
  - If an AI prompt injection or compromised backend returns `[Click here](javascript:alert(document.cookie))`, clicking the link will execute attacker-controlled JavaScript in the user's browser context.
- **Recommendation**:
  - Validate the `url` scheme before pushing the `<a>` tag:
    ```tsx
    const isSafeUrl = /^(https?:\/\/|mailto:)/i.test(url.trim());
    if (isSafeUrl) {
        push(<a key={`${key}-l${j}`} href={url.trim()} target="_blank" rel="noopener noreferrer"...>{label}</a>);
    } else {
        push(<span>{label} ({url})</span>);
    }
    ```

---

### 1.4 Missing HTTP Security Headers & Content Security Policy (High)
- **File**: `vercel.json`, lines 8–54
- **Observation**:
  `vercel.json` provides caching headers for static assets (`.pdf`, `.mp4`, images, etc.) but provides **zero security headers** for root and SPA routes (`/(.*)`).
  Missing headers:
  1. `Content-Security-Policy`: Not configured anywhere.
  2. `X-Frame-Options`: Missing (`DENY` or `SAMEORIGIN`), exposing the site to Clickjacking attacks.
  3. `X-Content-Type-Options`: Missing (`nosniff`), allowing MIME-confusion attacks.
  4. `Referrer-Policy`: Missing (should be `strict-origin-when-cross-origin`).
  5. `Permissions-Policy`: Missing (should restrict camera, microphone, geolocation).
  6. `Strict-Transport-Security`: Missing (`max-age=63072000; includeSubDomains; preload`).
- **Recommendation**:
  Add a global header rule in `vercel.json`:
  ```json
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://platform.linkedin.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://project-mani-c0t3.onrender.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms; frame-src https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self';" }
    ]
  }
  ```

---

### 1.5 Chatbot Uplink: Rate Limiting & Input Validation Deficiencies (Medium)
- **File**: `components/ContactInterface.tsx`, lines 11–13, 335–370, 638
- **Observation**:
  - Line 12: `const MAX_MSGS = 999999;` (previously set to `20`).
  - Line 638: UI renders `"You've reached the 20-message session limit..."`, but `isLimitReached` will never trigger until 999,999 messages!
  - Lines 336, 401: Input `consoleInput` has no maximum length restraint (`maxLength` missing).
  - Lines 366–370: Direct JSON POST to `https://project-mani-c0t3.onrender.com/api/chat` with unbounded user text and history.
- **Risk Analysis**:
  - Malicious users or bots can flood the backend Render container with massive text queries, degrading performance or exhausting free-tier dyno limits.
- **Recommendation**:
  - Restore `MAX_MSGS = 20`.
  - Add `maxLength={500}` on the console input field and trim input to 500 characters in `sendToAI`.
  - Enforce a 1-second cooldown between transmissions to prevent automated spamming.

---

### 1.6 Inconsistent External Link Security (`target="_blank"`) (Medium)
- **Observation**:
  Multiple anchor tags opening in new tabs use `rel="noreferrer"` or `rel="noopener"` rather than the unified standard `rel="noopener noreferrer"`.
  - `pages/Home.tsx`: Lines 506, 590, 872 (`rel="noreferrer"` missing `noopener`)
  - `components/ProjectChip.tsx`: Lines 124, 162, 196 (`rel="noreferrer"` missing `noopener`)
  - `components/CertificationsBlock.tsx`: Line 1087 (`rel="noreferrer"` missing `noopener`)
  - `scripts/prerender.js`: Lines 291, 295, 299, 303 (`rel="noopener"` missing `noreferrer` — leaks HTTP Referer to external YouTube servers)
- **Recommendation**:
  Standardize all external `target="_blank"` links across all files to `rel="noopener noreferrer"`.

---

### 1.7 JSON-LD Injection Safety in SEO Component (Low)
- **File**: `components/common/SEO.tsx`, lines 86–90
- **Observation**:
  ```tsx
  {schema && (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  )}
  ```
- **Risk Analysis**:
  If dynamic content injected into `schema` contains the string `</script>`, the HTML parser exits the script block prematurely and interprets trailing characters as HTML.
- **Recommendation**:
  Safely sanitize `JSON.stringify(schema).replace(/</g, '\\u003c')`.

---

### 1.8 Static Asset Safety & Repository Hygiene (Low)
- **Files**:
  - `public/font_comparison.html` (93 lines): An internal developer font comparison page left inside `public/`. Because it is in `public/`, Vite copies it to `dist/`, exposing it publicly at `https://rsmk.tech/font_comparison.html`.
  - `public/assets/srinivasa-manikanta-profile.webp.bak` (44.7 kB): Unneeded backup image file deployed to production.
  - `SECURITY.md`: Unfilled placeholder template with boilerplate instructions.
- **Recommendation**:
  - Delete `public/font_comparison.html` or move to a dev notes folder.
  - Delete `public/assets/srinivasa-manikanta-profile.webp.bak`.
  - Update `SECURITY.md` with active contact info (`srinivasmanikantarajapantula@gmail.com`) and supported version policy.

---

## 2. Tech Stack & Architecture Findings

### 2.1 Orphaned `src/` Directory & Root Organization (Medium)
- **Observation**:
  - The repository has all source folders in the project root: `components/`, `pages/`, `data/`, `hooks/`, `utils/`, `scripts/`, `App.tsx`, `index.tsx`, `constants.tsx`, `types.ts`, `index.css`.
  - There is an empty directory `src/pages` (0 files).
  - `tsconfig.json` (line 23) and `vite.config.ts` (line 20) set `@/*` alias to `./*`.
- **Architectural Assessment**:
  - While functional, placing all code at the root alongside tooling files (`vite.config.ts`, `vercel.json`, `package.json`, etc.) creates project sprawl and causes accidental commits of non-source files.
  - The abandoned `src/pages` folder causes confusion for new contributors.
- **Recommendation**:
  - Remove the empty `src/` directory to eliminate dead folders, or consolidate all frontend source files under `src/` in a future reorganization milestone.

---

### 2.2 TypeScript Configuration & Strictness (Medium)
- **File**: `tsconfig.json`
- **Observation**:
  - Missing `"strict": true`. Strict null checks and implicit any checks are disabled.
  - **Empirical Test**: Executed `npx tsc --noEmit --strict`. The entire codebase passed with **zero errors**!
- **Architectural Assessment**:
  - Because the codebase already adheres to strict typing, omitting `"strict": true` leaves the codebase vulnerable to silent future type degradations without any benefit.
- **Recommendation**:
  - Add `"strict": true` to `compilerOptions` in `tsconfig.json`.

---

### 2.3 Dead / Extraneous Dependencies in package.json (Low)
- **File**: `package.json`, lines 28–30
- **Observation**:
  - `devDependencies` lists `autoprefixer: ^10.4.23` and `postcss: ^8.5.6`.
  - Tailwind CSS v4 is used with `@tailwindcss/vite: ^4.3.0` and `@import "tailwindcss";` in `index.css`.
  - There is no `postcss.config.js` or `postcss.config.mjs`.
  - As verified in Section 1.1, `postcss` and `autoprefixer` pull in vulnerable packages (`nanoid@3.3.11`, `browserslist@4.28.1`).
- **Recommendation**:
  - Uninstall `autoprefixer` and `postcss` (`npm uninstall -D autoprefixer postcss`).

---

### 2.4 Missing Quality & Automation Scripts (Medium)
- **File**: `package.json`, lines 6–10
- **Observation**:
  Only three scripts are defined:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/prerender.js",
    "preview": "vite preview"
  }
  ```
  - Missing scripts:
    - `"typecheck": "tsc --noEmit"`
    - `"lint": "eslint ."`
    - `"test": "vitest"`
  - No ESLint configuration (`eslint.config.js` or `.eslintrc`) exists.
  - No GitHub Actions workflows (`.github/workflows`) exist for CI validation.
- **Recommendation**:
  - Add `"typecheck": "tsc --noEmit"` to `package.json`.
  - Setup ESLint 9+ flat config with `@typescript-eslint` and `eslint-plugin-react-hooks`.
  - Add a GitHub Actions CI workflow to run `npm run typecheck`, `npm audit`, and `npm run build` on PRs.

---

### 2.5 Test Infrastructure Absence (Medium)
- **Observation**:
  There are zero unit tests, component tests, or integration tests in the repository.
  Crucial utility modules with stateful behavior:
  - `utils/chatbotWarmup.ts` (storage cooldown, abort timeout, singleton listener dispatch)
  - `utils/analytics.ts` (event logging, Clarity tags, scroll depth calculations)
  - `components/ContactInterface.tsx` (`MiniMarkdown` parser)
  - `scripts/prerender.js` (regex route metadata replacement)
- **Recommendation**:
  - Install `vitest` and `@testing-library/react`.
  - Add unit test coverage for `chatbotWarmup.ts`, `MiniMarkdown`, and `prerender.js`.

---

### 2.6 Bundle Size and Build Pipeline Analysis (Optimization)
- **Observation**:
  - Build command (`npm run build`) runs in 9.03s and generates pre-rendered routes for `/gallery`, `/automation`, and `/videos`.
  - Bundle breakdown:
    - `vendor-react-BZIiX8JZ.js`: 192.03 kB (gzip: 63.57 kB)
    - `index-DeT7lgBo.js` (App entry + Home): 162.84 kB (gzip: 47.46 kB)
    - `vendor-motion-B78liQrM.js` (Framer Motion + Lenis): 149.38 kB (gzip: 48.54 kB)
    - `Gallery-CRFGFCpa.js`: 97.37 kB (gzip: 35.72 kB)
    - `IndustrialPortfolio-DXdtwIpN.js`: 76.77 kB (gzip: 18.04 kB)
    - `vendor-icons-CO-r9O4R.js`: 25.92 kB (gzip: 5.88 kB)
    - `index-CyNn7F05.css`: 116.89 kB (gzip: 17.36 kB)
  - Route code-splitting with `React.lazy` is already successfully implemented for `Gallery` and `IndustrialPortfolio`.
  - Optimization consideration: `EasterEgg.tsx` (terminal simulator with 416 lines) can also be lazy-loaded on demand when Konami code sequence starts, saving initial parse time.

---

## 3. Prioritized Action Plan

### Critical Priority (Immediate)
*None — No direct remote code execution on production servers or exposed active private credentials.*

### High Priority
1. **Fix Dependency Vulnerabilities**: Run `npm audit fix` to bump `vite`, `react-router-dom`, `nanoid`, and `browserslist`.
2. **Remove Secret Injection in `vite.config.ts`**: Delete lines 14–17 defining `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.
3. **Patch XSS in `MiniMarkdown`**: Enforce protocol validation on link URLs (`https://`, `http://`, `mailto:`) in `components/ContactInterface.tsx`.
4. **Implement HTTP Security Headers & CSP in `vercel.json`**: Configure CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.

### Medium Priority
5. **Add `"strict": true` in `tsconfig.json`**: Lock in current zero-error type safety.
6. **Enforce Chatbot Rate Limiting & Input Clamping**: Restore `MAX_MSGS = 20` and add `maxLength={500}` on `consoleInput` in `ContactInterface.tsx`.
7. **Add `"typecheck"` script to `package.json`**: Facilitate automated type verification in build pipelines.
8. **Standardize `target="_blank"` rel Attributes**: Apply `rel="noopener noreferrer"` across `Home.tsx`, `ProjectChip.tsx`, `CertificationsBlock.tsx`, and `prerender.js`.
9. **Introduce Vitest Test Setup**: Add tests for `chatbotWarmup`, `MiniMarkdown`, and `prerender.js`.

### Low Priority
10. **Prune Dead DevDependencies**: Remove `postcss` and `autoprefixer`.
11. **Remove Stale Artifacts in `public/`**: Delete `public/font_comparison.html` and `public/assets/srinivasa-manikanta-profile.webp.bak`.
12. **Remove Orphaned `src/` Directory**: Clean up empty `src/pages` folder.
13. **Sanitize JSON-LD in `SEO.tsx`**: Escape `</` characters in `schema`.
14. **Populate `SECURITY.md`**: Replace placeholder text with active security policy and contact email.
