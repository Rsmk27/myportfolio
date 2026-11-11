## 2026-11-11T11:53:29Z
You are the Test Environment & Architecture Explorer for the portfolio project.
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env

MANDATORY INPUTS:
- Original Request: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Document: d:\websites\git clone\myportfolio\PROJECT.md
- Scope Document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_e2e_testing\SCOPE.md

Your mission:
1. Read ORIGINAL_REQUEST.md, PROJECT.md, and SCOPE.md.
2. Inspect package.json, vite.config.ts, tsconfig.json, and the directory tree to assess the current test runner setup (check if vitest, jest, or any test scripts exist).
3. Investigate the codebase components, utilities, and assets that our tests will exercise:
   - Security: MiniMarkdown / link sanitization in ContactInterface.tsx, vercel.json headers & CSP, strict TypeScript mode, process.env.API_KEY omission.
   - SEO & Metadata: SEO.tsx tags, JSON-LD schema generation and escaping, canonical links, robots, manifest.json, favicon.ico.
   - UI & Theme: Standby mode styling / color contrast in Home.tsx, SkillBreadboard.tsx, TimelineSystem.tsx, CertificationsBlock.tsx (WCAG AA >= 4.5:1 ratio).
   - Interactions & A11y: Modal focus traps, Escape key handler, role="dialog", carousel touch events.
   - Content: CertificationsBlock.tsx previews mapping (all 31+ certs), constants.tsx project catalog (p2, p4 restored).
4. Recommend exact packages to install (e.g. `vitest`, `jsdom` or `happy-dom`, `@testing-library/react`, `@testing-library/jest-dom`) and the `vitest.config.ts` or `vite.config.ts` test configuration.
5. Provide a detailed design and test case breakdown across all 4 tiers (Tier 1: Feature Coverage, Tier 2: Boundary/Edge Cases, Tier 3: Cross-Feature Interactions, Tier 4: Real-World Scenarios) for:
   - `tests/security.test.ts`
   - `tests/seo.test.ts`
   - `tests/ui.test.ts`
   - `tests/interactions.test.ts`
   - `tests/content.test.ts`
6. Write your comprehensive findings and recommendations to `d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env\handoff.md` and send a message back.
