## 2026-11-11T12:09:12Z

You are the Core & Content Test Writer Worker for the portfolio project.
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\worker_tests_core

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS:
- Original Request: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Document: d:\websites\git clone\myportfolio\PROJECT.md
- Scope Document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_e2e_testing\SCOPE.md
- Explorer Handoff: d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env\handoff.md

FILE WRITE OWNERSHIP:
You have exclusive write ownership over:
- `tests/security.test.ts`
- `tests/seo.test.ts`
- `tests/content.test.ts`
- `TEST_INFRA.md` (at project root)

You MUST NOT touch or modify any other files in `tests/` or source code.

Your mission:
1. Read the explorer handoff `d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env\handoff.md`, specifically Section 4 for `tests/security.test.ts`, `tests/seo.test.ts`, and `tests/content.test.ts`.
2. Implement `tests/security.test.ts`:
   - Cover Features #1, #2, #3, #4, #5, #6 across all 4 tiers (Tier 1: Feature coverage, Tier 2: Boundary & Corner, Tier 3: Cross-feature, Tier 4: Real-world/fuzzing).
   - Test markdown link sanitization (valid https/http/mailto vs blocking `javascript:`, data URIs, obfuscation), vercel.json security headers & CSP, process.env.API_KEY removal from vite.config.ts, tsconfig strict mode, ContactInterface MAX_MSGS=20 and maxLength=500.
3. Implement `tests/seo.test.ts`:
   - Cover Features #7, #9, #10, #13 across all 4 tiers.
   - Test public/favicon.ico, public/manifest.json, SEO.tsx title/description/keywords tags, canonical URL (/videos -> /automation), JSON-LD script escaping (\u003c), OpenGraph 1200x630 dimensions and image file existence, robots.txt and sitemap.xml.
4. Implement `tests/content.test.ts`:
   - Cover Features #8, #11, #12 across all 4 tiers.
   - Test all 36 certifications in CERTS array (id, title, issuer, year, category, skills), matching .png preview assets in public/assets/certifications/, valid sha256 verification hashes, constants.tsx PROJECTS catalog completeness (including p2 and p4 restored, catalog length >= 8), SPDS image reference (not chatbot background), social links, and pruning of orphaned media.
5. Author `TEST_INFRA.md` at the project root documenting test architecture, runner commands, 4-tier methodology, and mapping of all 21 features in PROJECT.md to test files.
6. Run `npx vitest run tests/security.test.ts tests/seo.test.ts tests/content.test.ts` to verify the tests execute cleanly. Document passing and failing tests (explaining which failures are expected contract checks awaiting implementation milestones M1/M2/M3).
7. Output your complete handoff report to `d:\websites\git clone\myportfolio\.agents\teamwork\worker_tests_core\handoff.md` and send a completion message.
