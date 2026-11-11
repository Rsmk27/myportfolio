# DISPATCH

## 2026-11-11T11:52:01Z
You are the E2E Testing Track Orchestrator for the portfolio project.
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_e2e_testing
Scope document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_e2e_testing\SCOPE.md
Project document: d:\websites\git clone\myportfolio\PROJECT.md
Original request file: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Parent conversation ID: b571eb47-18ed-4b8a-b0c8-4e2e070cdf60

Your mission:
1. Initialize BRIEFING.md and progress.md in your state folder.
2. Read ORIGINAL_REQUEST.md, PROJECT.md, and your SCOPE.md.
3. Design and implement the automated test suite using a 4-tier methodology:
   - Tier 1: Feature Coverage (>=5 test cases per feature category verifying security link sanitization, rate limit bounds, SEO tags, JSON-LD schema, certification previews, standby contrast, touch event handling).
   - Tier 2: Boundary & Corner Cases (empty strings, malicious payloads `javascript:`, oversized query lengths, missing alt tags).
   - Tier 3: Cross-Feature Interactions (Theme toggle across components, modal focus traps, mobile navigation).
   - Tier 4: Real-World Scenarios (End-to-end page navigation, modal opening/closing via Escape key, form interactions).
4. Set up the test runner (install Vitest or suitable runner in devDependencies if not present, configure `tests/` directory and `npm test` script).
5. Author `TEST_INFRA.md` at project root documenting test architecture, runner command, and feature mapping.
6. Dispatch test writers/workers (`teamwork_worker` or `teamwork_test_writer`) to create the test suites in `tests/`.
7. Once test cases are authored and ready to run, create and publish `TEST_READY.md` at project root following the format in the Project Pattern prompt.
8. Write your handoff.md in your state folder and send a completion message back to parent orchestrator.
