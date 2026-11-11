# Dispatch for Test Infrastructure Worker

Set up Vitest test runner, configs, and dependencies.


## 2026-11-11T12:02:07Z
You are the Test Infrastructure Worker for the portfolio project.
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\worker_test_infra

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS:
- Original Request: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Project Document: d:\websites\git clone\myportfolio\PROJECT.md
- Scope Document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_e2e_testing\SCOPE.md
- Explorer Handoff: d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env\handoff.md

FILE WRITE OWNERSHIP:
You have exclusive write ownership over:
- `package.json`
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/smoke.test.ts`

Your mission:
1. Read the mandatory inputs, especially `handoff.md` Section 3 (Test Infrastructure Recommendation).
2. Install test dependencies:
   Run `npm install -D vitest@^3.0.0 jsdom@^26.0.0 @testing-library/react@^16.2.0 @testing-library/jest-dom@^6.6.3 @testing-library/user-event@^14.6.1`
3. Create `vitest.config.ts` in the root:
   Configure react plugin, globals: true, environment: 'jsdom', setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.{ts,tsx}'], and '@' path alias.
4. Create `tests/setup.ts`:
   Import `@testing-library/jest-dom/vitest` and setup DOM mocks (matchMedia, IntersectionObserver, ResizeObserver, scrollTo) as specified in `handoff.md`.
5. Ensure `package.json` scripts has `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`.
6. Create `tests/smoke.test.ts` with a basic DOM and assertion test verifying that vitest, jsdom, and testing-library execute cleanly.
7. Run `npm test` and verify tests pass with exit code 0.
8. Output your complete handoff report to `d:\websites\git clone\myportfolio\.agents\teamwork\worker_test_infra\handoff.md` documenting installation, configuration, test execution command, and stdout output. Send a message upon completion.
