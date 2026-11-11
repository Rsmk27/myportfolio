# Progress — Milestone 1: Security Hardening & Dependency Remediation

Last visited: 2026-11-11T12:03:00Z

## Status: All Tasks Completed & Verified

- [x] 0. Establish baseline: read SCOPE.md, analysis.md, handoff.md, inspect current files (npm audit: 11 vulns; tsc: 0 errors; build: success)
- [x] 1. Dependency CVE Remediation & Pruning: pruned `postcss` & `autoprefixer`, ran `npm audit fix`, added `"typecheck"` script, verified 0 vulnerabilities.
- [x] 2. Secret Exposure Hazard in `vite.config.ts`: removed `define` block mapping `GEMINI_API_KEY` to client-side `process.env`.
- [x] 3. Client-Side Markdown XSS in `components/ContactInterface.tsx`: protocol whitelist regex `/^(https?:\/\/|mailto:)/i` with safe fallback `<span>{label} ({url})</span>`.
- [x] 4. Security Headers & CSP in `vercel.json`: added strict headers rule for `/(.*)` including CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- [x] 5. Chatbot Rate Limiting & Input Bounds in `components/ContactInterface.tsx`: restored `MAX_MSGS = 20`, added `maxLength={500}` on input, added query trim & slice in `sendToAI`.
- [x] 6. Strict TypeScript in `tsconfig.json`: added `"strict": true`, verified 0 errors with `npx tsc --noEmit`.
- [x] 7. JSON-LD Script Escaping in `components/common/SEO.tsx`: escaped `<` to `\u003c` via `.replace(/</g, '\\u003c')`.
- [x] 8. Final Verification (`npm audit`, `npx tsc --noEmit`, `npm run typecheck`, `npm run build`): all passing with exit code 0.
