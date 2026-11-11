# Handoff Report: Security and Tech Stack/Architecture Audit

**Agent**: Teamwork Explorer (Security & Tech Stack Specialist)  
**Working Directory**: `d:\websites\git clone\myportfolio`  
**State Folder**: `d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_security_tech`  
**Date**: 2026-11-11  
**Handoff Type**: Hard (Investigation complete)  

---

## 1. Observation

Direct observations and evidence collected during the investigation:

1. **Dependency Vulnerability Scan (`npm audit`)**:
   - Command: `npm audit --json`
   - Output: 11 vulnerabilities (0 critical, 9 high, 1 moderate, 1 low) in 176 total packages.
   - Direct package affected: `vite@6.2.0` (lockfile `6.4.1`) with 9 advisories including GHSA-p9ff-h696-f583 (High, arbitrary file read via WebSocket) and GHSA-587h-7wmj-h5pm (High, `launch-editor` Windows execution bypass).
   - Direct package affected: `react-router-dom@7.13.0` (and `react-router@7.13.0`) with advisories including GHSA-49rj-9fvp-4h2h (High, unauthenticated RCE via turbo-stream deserialization) and GHSA-wrjc-x8rr-h8h6 (High, open redirect).
   - Transitive packages affected: `nanoid@3.3.11` via `postcss@8.5.6` (GHSA-28wg-ghj8-5hjv, GHSA-2v37-7h3g-55p8, GHSA-xwg4-73v4-xw9w) and `browserslist@4.28.1` via `autoprefixer@10.4.23` (GHSA-c83g-rgw3-j3cx, GHSA-73wf-gq98-2v4g).
   - Command: `npm audit fix --dry-run`
   - Output: Updates 35 packages to clean versions (`vite@6.4.6`, `react-router@7.18.5`, `postcss@8.5.32`, `nanoid@3.3.20`, `browserslist@4.29.5`).

2. **Secret Exposure Hazard in `vite.config.ts`**:
   - File: `vite.config.ts`, lines 14–17:
     ```ts
     define: {
       'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
       'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
     },
     ```
   - Global codebase search: No client file references `process.env.API_KEY` or `process.env.GEMINI_API_KEY`. The chatbot communicates exclusively via backend API `https://project-mani-c0t3.onrender.com/api/chat`.

3. **Client-Side Markdown XSS Vector in `ContactInterface.tsx`**:
   - File: `components/ContactInterface.tsx`, lines 80–99:
     ```tsx
     // Link [label](url)
     if (text[j] === '[') {
         const labelEnd = text.indexOf(']', j);
         if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
             const urlEnd = text.indexOf(')', labelEnd + 2);
             if (urlEnd !== -1) {
                 flush();
                 const label = text.slice(j + 1, labelEnd);
                 const url = text.slice(labelEnd + 2, urlEnd);
                 push(
                     <a key={`${key}-l${j}`} href={url} target="_blank" rel="noopener noreferrer"
                         className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
                         {label}
                     </a>
                 );
                 j = urlEnd + 1;
                 continue;
             }
         }
     }
     ```
   - Protocol validation is completely absent: `url` is passed directly to `<a href={url}>`.

4. **Missing Security Headers & Content Security Policy**:
   - File: `vercel.json`, lines 8–54:
     - Rules only define `Content-Type`, `Cache-Control`, and `X-Robots-Tag` for static assets (`/assets/(.*)`, `/sitemap.xml`, `/robots.txt`).
     - There is no header rule for SPA document requests (`/(.*)`).
     - Missing headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
     - File: `index.html`: Contains no `<meta http-equiv="Content-Security-Policy">`.

5. **Chatbot Uplink Rate Limiting & Input Validation**:
   - File: `components/ContactInterface.tsx`:
     - Line 12: `const MAX_MSGS = 999999;`
     - Line 638: `You've reached the 20-message session limit. Refresh the page to start a new session 🔄`
     - Lines 651–667: `<input type="text" ... />` lacks `maxLength`.
     - Lines 335–370: User query string is not bounded in `sendToAI`.

6. **External Links Security (`target="_blank"`)**:
   - `pages/Home.tsx` (lines 506, 590, 872): Uses `rel="noreferrer"` (omits explicit `noopener`).
   - `components/ProjectChip.tsx` (lines 124, 162, 196): Uses `rel="noreferrer"` (omits explicit `noopener`).
   - `components/CertificationsBlock.tsx` (line 1087): Uses `rel="noreferrer"` (omits explicit `noopener`).
   - `scripts/prerender.js` (lines 291, 295, 299, 303): Uses `rel="noopener"` (omits `noreferrer`, leaking referrer header to YouTube).

7. **JSON-LD Script Escaping**:
   - File: `components/common/SEO.tsx`, lines 86–90:
     ```tsx
     {schema && (
       <script type="application/ld+json">
         {JSON.stringify(schema)}
       </script>
     )}
     ```
   - Does not escape `<` to `\u003c`, risking script breakout if schema contains `</script>`.

8. **Static Asset & Repository Hygiene**:
   - `public/font_comparison.html` (93 lines) is an internal testing page copied into production `dist/`.
   - `public/assets/srinivasa-manikanta-profile.webp.bak` (44.7 kB) is an unneeded backup file deployed to production.
   - `SECURITY.md` is an unpopulated template containing generic GitHub instructions.

9. **TypeScript Configuration & Type Safety**:
   - File: `tsconfig.json`: `"strict": true` is missing.
   - Command: `npx tsc --noEmit --strict`
   - Output: 0 errors (exited with code 0).

10. **Dead devDependencies**:
    - File: `package.json`, lines 28–30: Contains `autoprefixer` and `postcss`.
    - No `postcss.config.*` exists; Tailwind v4 is compiled via `@tailwindcss/vite`.
    - `npm ls nanoid browserslist`: Shows `postcss` and `autoprefixer` are the sole sources of the vulnerable `nanoid` and `browserslist` packages.

11. **Test Infrastructure & Linting**:
    - Project contains zero test files (`*.test.*`, `*.spec.*`).
    - Project contains no ESLint configuration and no Prettier configuration.
    - `package.json` contains no `"test"`, `"lint"`, or `"typecheck"` scripts.
    - No `.github/workflows` CI/CD directory exists.

12. **Build Pipeline & Bundle Profile**:
    - Command: `npm run build`
    - Output: Built in 9.03s; pre-rendered `gallery`, `automation`, and `videos`.
    - Main chunks: `vendor-react` (192 kB), `index` (162 kB), `vendor-motion` (149 kB), `index.css` (116 kB).

---

## 2. Logic Chain

1. **Dependency Risk**:
   - *From Observation 1*: `vite` and `react-router-dom` have 9 high-severity advisories including arbitrary file read and RCE in dependency libraries.
   - *Inference*: Updating dependencies via `npm audit fix` is essential to eliminate known CVEs and maintain supply chain security.

2. **Secret Leakage Prevention**:
   - *From Observation 2*: `vite.config.ts` passes `env.GEMINI_API_KEY` to client-side `process.env.API_KEY`.
   - *Inference*: Although client code does not currently invoke this variable, keeping `define` in `vite.config.ts` creates a critical hazard: any developer or tool writing `process.env.API_KEY` client-side will bake the secret into public bundles. Removing this unused block eliminates the hazard completely.

3. **XSS Mitigation**:
   - *From Observation 3*: `MiniMarkdown` renders markdown links directly into `<a href={url}>`.
   - *Inference*: Because the markdown originates from AI responses (or potential prompt injection), an unvalidated URI like `javascript:...` executes arbitrary script on click. Enforcing a regex whitelist (`/^(https?:\/\/|mailto:)/i`) closes this vulnerability.

4. **Defense-in-Depth via Security Headers**:
   - *From Observation 4*: `vercel.json` serves HTML pages without CSP, Clickjacking protection (`X-Frame-Options`), or MIME protections (`X-Content-Type-Options`).
   - *Inference*: Adding these headers directly into `vercel.json` ensures that modern browsers enforce script source restrictions, block iframe framing, and disallow MIME sniffing.

5. **Rate Limiting & Form Integrity**:
   - *From Observation 5*: `MAX_MSGS = 999999` contradicts the UI's 20-message warning, and `consoleInput` has no length restriction.
   - *Inference*: Aligning `MAX_MSGS = 20` and adding `maxLength={500}` protects the Render backend container from abuse and aligns user expectations.

6. **Type Safety Consolidation**:
   - *From Observation 9*: The codebase compiles cleanly under `--strict` with zero errors.
   - *Inference*: Adding `"strict": true` to `tsconfig.json` can be done immediately with zero breaking changes, preventing future regressions.

7. **Dead Dependency Pruning**:
   - *From Observation 10*: `postcss` and `autoprefixer` are unreferenced in Tailwind v4 and introduce vulnerable versions of `nanoid` and `browserslist`.
   - *Inference*: Removing these packages simplifies the dependency graph and eliminates several vulnerabilities outright.

---

## 3. Caveats

1. **Backend Server Isolation**: The Render backend repository (`https://project-mani-c0t3.onrender.com`) is hosted separately; its internal rate limiting, CORS configuration, and LLM prompt sanitization could not be directly inspected from this frontend repository.
2. **Third-Party CDN Integrations**: External scripts are loaded from Google Tag Manager (`googletagmanager.com`), Microsoft Clarity (`clarity.ms`), and LinkedIn (`platform.linkedin.com`). The CSP policy recommended allows these origins, but changes to external providers may require updating CSP directives.
3. **No Caveats on Local Codebase**: All local configuration files, source files, and build scripts were thoroughly analyzed.

---

## 4. Conclusion

The portfolio is architecturally functional with clean code-splitting, modern Tailwind CSS v4, and clean TypeScript compliance. However, it requires immediate high-priority security hardening:
1. Updating vulnerable dependencies via `npm audit fix` (9 high advisories).
2. Removing secret injection config in `vite.config.ts`.
3. Sanitizing link protocols in `MiniMarkdown` to eliminate an XSS vector.
4. Adding comprehensive security headers and a strict CSP in `vercel.json`.
5. Restoring chat rate limiting (`MAX_MSGS = 20`) and input length bounds.
6. Enabling `"strict": true` in `tsconfig.json`, standardizing external links, and pruning dead dependencies.

A detailed, prioritized technical report with all file paths, line references, and remediation code has been authored in `analysis.md`.

---

## 5. Verification Method

To independently verify all findings and validate future implementations:

1. **Dependency Audit Verification**:
   ```powershell
   npm audit --json
   ```
   *Expected outcome*: Identifies 11 vulnerabilities (9 High). After fix, 0 vulnerabilities should remain.

2. **TypeScript Strict Verification**:
   ```powershell
   npx tsc --noEmit --strict
   ```
   *Expected outcome*: Exits with code 0.

3. **Build & Prerender Verification**:
   ```powershell
   npm run build
   ```
   *Expected outcome*: Transforms modules cleanly, outputs split vendor chunks, and prerenders `gallery`, `automation`, and `videos` into `dist/`.

4. **Security Header Inspection**:
   Inspect `vercel.json` to verify `headers` configuration for `/(.*)`.

5. **XSS Protection Test**:
   In `components/ContactInterface.tsx`, test `MiniMarkdown` with payload `[Malicious Link](javascript:alert(1))` to verify that it does not render an active `<a href="javascript:...">` element.
