## 2026-11-11T13:02:34Z
You are the implementation Worker for Milestone 3 (UI & Interactions Remediation).
Working directory: d:\websites\git clone\myportfolio
State folder: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_worker_m3_ui_interactions
Original request file: d:\websites\git clone\myportfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Scope document: d:\websites\git clone\myportfolio\.agents\teamwork\sub_orch_m3_ui_interactions\SCOPE.md
Project document: d:\websites\git clone\myportfolio\PROJECT.md
Audit reference analysis: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_ui_interactions\analysis.md
Audit reference handoff: d:\websites\git clone\myportfolio\.agents\teamwork\teamwork_explorer_survey_ui_interactions\handoff.md
Test files under test:
- `tests/ui.test.ts`
- `tests/interactions.test.ts`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Assigned Scope & Exclusive File Ownership:
You own and may edit the following files:
1. `pages/Home.tsx`
2. `pages/IndustrialPortfolio.tsx`
3. `components/SkillBreadboard.tsx`
4. `components/TimelineSystem.tsx`
5. `components/CertificationsBlock.tsx`
6. `components/ProjectChip.tsx`
7. `components/CustomCursor.tsx`
8. `components/ContactInterface.tsx`
9. `index.css`

## Exact Tasks to Implement:

1. **Standby Mode Contrast Failure (Feature #14)**:
   - In `pages/Home.tsx`: SectionHeader currently sets `color: isPowered ? '#ffffff' : '#111111'`. Change the standby color to high-contrast telemetry zinc `#a1a1aa` (or `#f59e0b` / `#fbbf24`), satisfying WCAG AA ratio >= 4.5:1 against `#080806`.
   - In `components/SkillBreadboard.tsx`: Ensure headings and text do NOT switch to `text-gray-900` when `isPowered === false`. Use `text-zinc-400` or `text-zinc-300` / telemetry amber.
   - In `components/TimelineSystem.tsx`: Ensure headings and text do NOT switch to `text-gray-900`, `text-blue-600`, or `text-gray-800` when `isPowered === false`. Use `text-zinc-300`, `text-cyan-400`, `text-zinc-400`.
   - In `components/CertificationsBlock.tsx`: Ensure card headings and text do NOT switch to `text-zinc-900` when `isPowered === false`. Use `text-zinc-300` / `text-zinc-400`. Also ensure cards do not get `opacity-40 cursor-not-allowed pointer-events-none` when `isPowered === false`.
   - In `components/ProjectChip.tsx`: Ensure it does not switch to blinding `bg-white` and `bg-gray-50` with black text when `isPowered === false`; keep dark container styling with telemetry borders/text.

2. **Projects Carousel Mobile Touch Handling (Feature #15)**:
   - In `pages/Home.tsx`: On the element with `ref={projectsScrollRef}`, add `onTouchStart`, `onTouchMove`, and `onTouchEnd` event handlers so finger touches pause the auto-scroll animation and allow smooth touch dragging without jitter. (Ensure `onTouchStart`, `onTouchMove`, `onTouchEnd` are within the JSX element props of `projectsScrollRef` to satisfy `tests/interactions.test.ts` test 1.5).

3. **Viewport Breakout Margins (Feature #16)**:
   - In `pages/Home.tsx`: Remove `w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]` on the projects carousel wrapper (around line 955). Replace with clean container styling: `relative w-full overflow-hidden py-4 mt-4 select-none` to prevent horizontal scrollbar jitter on desktop and mobile.

4. **Modals Accessibility, ARIA Dialog Semantics & Escape Key (Feature #17)**:
   - In `pages/IndustrialPortfolio.tsx` (`ProjectModal`):
     - Add `role="dialog"` and `aria-modal="true"`.
     - Add an `Escape` keydown event listener to close the modal (`e.key === 'Escape'`).
     - Add focus containment/tab trap (`e.key === 'Tab'`).
     - Lock body scrolling when open (`document.body.style.overflow = 'hidden'`) and restore on close/unmount (`document.body.style.overflow = ''`).
   - In `components/CertificationsBlock.tsx` (`GalleryModal`):
     - Ensure it has `role="dialog"` and `aria-modal="true"`.
     - Ensure `document.body.style.overflow = 'hidden'` on open and restore on close/unmount (`document.body.style.overflow = ''`).
     - Add focus containment/tab trap (`e.key === 'Tab'`).
     - Ensure close button is touch-friendly with `p-2` or `p-3` or `h-10`/`w-10`.
     - Ensure `Escape` key closes the modal and listeners are cleaned up on unmount.
     - Keep `if (touchMoved.current)` / `e.preventDefault()` intact.

5. **Cards Keyboard Navigation (Feature #17)**:
   - In `components/CertificationsBlock.tsx` (`CertificateCard`):
     - Add `tabIndex={0}`, `role="button"`, and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}`.
   - In `pages/IndustrialPortfolio.tsx` (`ProjectCard`):
     - Add `tabIndex={0}`, `role="button"`, and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}`.
   - In `components/ProjectChip.tsx`:
     - Add `tabIndex={0}`, `role="button"`, and `onKeyDown`.

6. **Project Details Modal (Feature #18)**:
   - In `components/ProjectChip.tsx` and/or `pages/Home.tsx`: Provide an interactive modal (e.g. `ProjectDetailModal` or chip expansion modal) that surfaces `project.details`, `project.features`, and `project.gallery` from `constants.tsx` when clicked/triggered. (Must satisfy `tests/interactions.test.ts` test 3.1).

7. **Typography & Muted Text Contrast (Feature #19)**:
   - In `components/CustomCursor.tsx`: Change `'JetBrains Mono', monospace` to `'Space Mono', monospace`.
   - In `pages/Home.tsx`, `IndustrialPortfolio.tsx`: Upgrade low-contrast text classes (`text-gray-600`, `text-gray-700`, `text-zinc-600`) to WCAG AA compliant `text-zinc-400` or `text-gray-400` (#a1a1aa / #9ca3af, contrast > 7:1 against `#080806`).
   - In `components/ContactInterface.tsx`: Enlarge small touch targets (e.g. copy button, clear button) to at least 44x44px hit area or add touch padding.
   - In `components/CertificationsBlock.tsx`: Add `aria-label="Scroll credentials left"` and `aria-label="Scroll credentials right"` to carousel arrow buttons.

8. **Dead Timers & Layout Polish (Feature #20)**:
   - In `pages/Home.tsx`: Remove unrendered `heroIntro` and `statusText` state hooks and intervals (`const [heroIntro, setHeroIntro]`, `const [statusText, setStatusText]`, and `'INITIALIZING SYSTEM PROFILER...'`).
   - In `index.css`: Update `contain-intrinsic-size: 1px 900px` to `contain-intrinsic-size: auto 1200px` (or appropriate layout containment) on `#skills, #certifications, #experience, #contact`.

## Verification Steps:
After making edits, you MUST run:
1. `npm run typecheck` - verify 0 errors.
2. `npm run build` - verify clean build and SSG generation.
3. `npx vitest run tests/ui.test.ts tests/interactions.test.ts` - verify 100% of tests pass.

Report your changes, verification command outputs, and write your `handoff.md` in your state folder.
