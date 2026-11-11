# Scope: Milestone 3 — UI & Interactions Remediation

## Architecture
- Pages: `pages/Home.tsx`, `pages/IndustrialPortfolio.tsx`.
- Components: `components/SkillBreadboard.tsx`, `components/TimelineSystem.tsx`, `components/CertificationsBlock.tsx`, `components/ProjectChip.tsx`, `components/CustomCursor.tsx`, `components/ContactInterface.tsx`.
- Styles: `index.css`, `index.html`.

## Feature Inventory & Tasks
| # | Feature / Issue | Description | File Ownership | Status |
|---|-----------------|-------------|----------------|--------|
| 1 | Standby Mode Contrast Failure | Fix `#111111` / `text-gray-900` on dark background in Standby mode across Home, Skills, Timeline, Certs (WCAG AA > 4.5:1) | `pages/Home.tsx`, `SkillBreadboard.tsx`, `TimelineSystem.tsx`, `CertificationsBlock.tsx` | DONE |
| 2 | Carousel Touch Gesture Support | Add touch event handling and mobile drag support (`onTouchStart`, `onTouchMove`, `onTouchEnd`) to auto-scrolling projects carousel | `pages/Home.tsx` | DONE |
| 3 | Viewport Negative Margin Breakout | Remove `-ml-[50vw] -mr-[50vw]` overflow causing horizontal scroll jitter on desktop | `pages/Home.tsx` | DONE |
| 4 | Modal Keyboard Traps & Escape Close | Implement ARIA `role="dialog"`, focus traps, and `Escape` key close on `ProjectModal` and `GalleryModal` | `pages/IndustrialPortfolio.tsx`, `CertificationsBlock.tsx` | DONE |
| 5 | Card Keyboard Navigation | Add `tabIndex={0}`, `role="button"`, and `onKeyDown` (Enter/Space) to `CertificateCard` and `ProjectCard` | `CertificationsBlock.tsx`, `IndustrialPortfolio.tsx` | DONE |
| 6 | Project Details Expansion Modal | Surface rich project writeups, feature lists, and gallery photos from `constants.tsx` via interactive modal | `components/ProjectChip.tsx` | DONE |
| 7 | Font Import & Muted Text Contrast | Normalize `JetBrains Mono` or import font in `index.html`; upgrade muted text contrast (`text-gray-600`/`700` to `zinc-400`); enlarge touch targets | `CustomCursor.tsx`, `pages/Home.tsx`, `ContactInterface.tsx`, `index.html` | DONE |
| 8 | Dead Timers & Layout Polish | Remove unrendered `heroIntro`/`statusText` timers in `Home.tsx`; update `contain-intrinsic-size` in `index.css` | `pages/Home.tsx`, `index.css` | DONE |

## Exclusive Write Ownership
This milestone exclusively owns:
- `pages/Home.tsx`
- `pages/IndustrialPortfolio.tsx`
- `components/SkillBreadboard.tsx`
- `components/TimelineSystem.tsx`
- `components/CertificationsBlock.tsx` (accessibility, Standby colors, modal focus)
- `components/ProjectChip.tsx`
- `components/CustomCursor.tsx`
- `components/ContactInterface.tsx`
- `index.css`

## Verification Methods
1. Verify Standby mode text contrast in Home, Skills, Timeline, and Certifications is >= 4.5:1 against `#080806`. (VERIFIED: Contrast 7.5:1 to 12.3:1)
2. Verify touching carousel on mobile stops rAF auto-scroll. (VERIFIED: onTouchStart/Move/End handlers bound directly on carousel ref)
3. Verify opening ProjectModal on `/automation` and pressing `Escape` closes the modal cleanly. (VERIFIED: Escape key handler & focus containment active)
4. Verify `CertificateCard` and `ProjectCard` are reachable by `Tab` and triggerable by `Enter` / `Space`. (VERIFIED: tabIndex={0}, role="button", onKeyDown implemented)
5. Verify `npm run typecheck` and `npm run build` succeed with exit code 0. (VERIFIED: Clean Vite bundle & SSG prerender)
6. Verify `npx vitest run tests/ui.test.ts tests/interactions.test.ts` passes 100%. (VERIFIED: 32/32 tests passed)
