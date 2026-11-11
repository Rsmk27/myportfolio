# Scope: E2E Testing Track Orchestrator

## Mission
Design and create a comprehensive, requirement-driven automated test suite verifying all 21 features and fixes enumerated in `PROJECT.md § Feature Inventory`. Publish `TEST_INFRA.md` and `TEST_READY.md` when complete.

## Architecture
- Test runner and environment setup in `tests/`.
- Test files covering:
  - Security & Sanitization (`tests/security.test.ts`): Markdown link sanitization, XSS blocking, header configuration, CSP rules, strict TypeScript verification.
  - SEO & Metadata (`tests/seo.test.ts`): Favicon, manifest, og:image dimensions, meta tags, schema JSON-LD, robots/sitemap.
  - UI & Themes (`tests/ui.test.ts`): Standby mode WCAG AA contrast (text vs background >= 4.5:1), responsive layout rules, touch target sizing.
  - Interactions & Accessibility (`tests/interactions.test.ts`): Keyboard accessibility (tabIndex, Enter/Space, Escape close), modal ARIA attributes (`role="dialog"`, `aria-modal="true"`), touch event listeners.
  - Information Integrity (`tests/content.test.ts`): 36/36 certificates preview validation, project catalog completeness, asset validity.

## Test Case Tiers (4-Tier Methodology)
- **Tier 1 — Feature Coverage**: >=5 tests per core feature category verifying isolated functionality.
- **Tier 2 — Boundary & Corner Cases**: Edge cases (malicious payloads `javascript:`, empty strings, extreme inputs).
- **Tier 3 — Cross-Feature Combinations**: Interaction between theme states, modals, navigation, and rendering.
- **Tier 4 — Real-World Application Scenarios**: End-to-end user workflows.

## Deliverables
1. `TEST_INFRA.md` at project root documenting test architecture and feature mapping.
2. Production test suite in `tests/` with npm test script.
3. `TEST_READY.md` at project root summarizing test runner command and coverage checklist.
