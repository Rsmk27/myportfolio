# Worker Dispatch — Milestone 1 (Security Hardening & Dependency Remediation)

## Objective
Implement all Milestone 1 security hardening and dependency remediation fixes as defined in SCOPE.md and the survey analysis.
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_worker_m1_security
Scope document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m1_security\SCOPE.md
Project document: d:\websites\git clone\myportfolio\PROJECT.md
Original request: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Audit reference analysis: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_security_tech\analysis.md
Audit reference handoff: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_security_tech\handoff.md
Parent Orchestrator: Sub-Orchestrator Milestone 1 (conversation ID: bf7d6aec-82cc-412d-8dfa-9acd1e6ddcb2)

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.


## 2026-11-11T11:53:22Z
You are the Worker assigned to implement Milestone 1: Security Hardening & Dependency Remediation for the portfolio repository.

Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_worker_m1_security
Scope document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m1_security\SCOPE.md
Project document: d:\websites\git clone\myportfolio\PROJECT.md
Original request: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Audit reference analysis: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_security_tech\analysis.md
Audit reference handoff: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_security_tech\handoff.md
Parent conversation ID: bf7d6aec-82cc-412d-8dfa-9acd1e6ddcb2

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusive Write Ownership:
You have exclusive write ownership of these files:
- package.json
- package-lock.json
- vite.config.ts
- tsconfig.json
- vercel.json
- components/ContactInterface.tsx
- components/common/SEO.tsx

Your tasks:
1. Dependency CVE Remediation & Pruning:
   - Run `npm audit fix` to resolve high-severity vulnerabilities in dependencies (vite, react-router, etc.).
   - Prune dead devDependencies `postcss` and `autoprefixer` (`npm uninstall -D autoprefixer postcss` or remove them and update lockfile).
   - In `package.json`, add `"typecheck": "tsc --noEmit"` to `"scripts"`.
   - Verify `npm audit` reports 0 vulnerabilities.

2. Secret Exposure Hazard in `vite.config.ts`:
   - Remove lines 14-17 (the `define` block with `process.env.API_KEY` and `process.env.GEMINI_API_KEY`).
   - Cleanly save `vite.config.ts`.

3. Client-Side Markdown XSS in `components/ContactInterface.tsx`:
   - In `MiniMarkdown`, when parsing markdown links `[label](url)`, sanitize the URL using regex protocol whitelist `/^(https?:\/\/|mailto:)/i`.
   - If safe, render `<a href={url.trim()} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-200 transition-colors">{label}</a>`.
   - If unsafe (e.g. `javascript:`, `data:`, `vbscript:`), do NOT render an active link; render safe fallback text such as `<span>{label} ({url})</span>` or similar.

4. Security Headers & CSP in `vercel.json`:
   - Add a global headers rule for `/(.*)` with strict security headers:
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
     - `Content-Security-Policy`:
       "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://platform.linkedin.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://project-mani-c0t3.onrender.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms; frame-src https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self';"

5. Chatbot Rate Limiting & Input Bounds in `components/ContactInterface.tsx`:
   - Restore `const MAX_MSGS = 20;` (was set to 999999).
   - Add `maxLength={500}` on the console input `<input ... />`.
   - In `sendToAI`, trim user query to 500 characters (`query.trim().slice(0, 500)`).
   - Standardize external link `rel="noopener noreferrer"` if applicable.

6. Strict TypeScript in `tsconfig.json`:
   - Add `"strict": true` to `"compilerOptions"` in `tsconfig.json`.
   - Run `npx tsc --noEmit` and confirm 0 errors.

7. JSON-LD Script Escaping in `components/common/SEO.tsx`:
   - Ensure `<script type="application/ld+json">` contents escape `<` to `\u003c` (e.g., `JSON.stringify(schema).replace(/</g, '\\u003c')`) so that injected schema cannot break out with `</script>`.

Verification Requirements:
Run and report the full command lines and outputs for:
- `npm audit`
- `npx tsc --noEmit` (or `npm run typecheck`)
- `npm run build`

Document all changes, file paths, and verification commands in `d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_worker_m1_security\handoff.md`.
When done, message your parent with `send_message` (Recipient: bf7d6aec-82cc-412d-8dfa-9acd1e6ddcb2) summarizing your changes and verification results.
