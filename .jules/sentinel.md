## 2026-04-25 - Ignored Vulnerability Context
**Vulnerability:** API Keys injected in `vite.config.ts`.
**Learning:** The user explicitly instructed to ignore the `GEMINI_API_KEY` environment variable injection in `vite.config.ts` during security audits. This could be intentional for a static site relying on client-side API requests, or an accepted risk.
**Prevention:** Do not flag or attempt to remove this configuration during future security audits unless explicitly instructed.
