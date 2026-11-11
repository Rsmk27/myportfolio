# Test Environment & Architecture Investigation Report

**State Folder**: `d:\websites\git clone\myportfolio\.agents\teamwork\explorer_test_env`  
**Generated Date**: 2026-11-11  
**Author**: Test Environment & Architecture Explorer  
**Recipient Conversation ID**: `1ae2ed1b-99ca-4c43-94b1-341fc132aeaa`

---

## Executive Summary

A comprehensive, read-only architectural investigation was conducted across the portfolio repository to evaluate the test environment readiness and formulate an end-to-end, 4-tier testing specification covering all 21 items in `PROJECT.md § Feature Inventory`. 

Key findings:
1. **Test Infrastructure**: Currently, no automated test runner (Vitest/Jest) or test scripts exist in `package.json`. Node is v22.20.0, Vite is 6.4.6, React is 18.3.1, and React Router is 7.18.5. `vitest` with `jsdom` and `@testing-library/react` is the exact native match for this toolchain.
2. **Security**: Unsanitized markdown link parser in `ContactInterface.tsx` permits `javascript:` pseudo-protocols; `MAX_MSGS` is unconstrained at `999999`; `maxLength={500}` is missing; `process.env.API_KEY` define remains in `vite.config.ts`; `tsconfig.json` lacks `"strict": true`; `vercel.json` lacks CSP and security headers.
3. **SEO & Metadata**: `SEO.tsx` does not escape `<` in JSON-LD script tags, and omits the `<meta name="keywords">` tag; `/public/favicon.ico` and `/public/manifest.json` are absent; `scripts/prerender.js` does not canonicalize `/videos` to `/automation`.
4. **UI Contrast**: Standby mode (`isPowered === false`) sets text to `#111111` or `#18181b` on `#080806`, yielding an unreadable ~1.05:1 contrast ratio that violates WCAG AA (>= 4.5:1).
5. **Interactions & A11y**: Existing modals (`GalleryModal`, `ProjectModal`) lack ARIA `role="dialog"`, `aria-modal="true"`, and keyboard focus traps. Projects carousel lacks touch event bindings. `ProjectChip.tsx` lacks keyboard triggers (`tabIndex`, Enter/Space) and modal detail invocation.
6. **Content**: `constants.tsx` is missing project records `p2` and `p4`, and SPDS references the wrong background asset. All 36 certification preview `.png` assets exist in `public/assets/certifications/`.

---

# SECTION 1: OBSERVATION

### 1. Current Toolchain & Package Setup
- **`package.json`** (`lines 6-10`, `lines 22-33`):
  ```json
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/prerender.js",
    "preview": "vite preview"
  }
  ```
  - `scripts.test` is undefined.
  - Dependencies: `"react": "^18.3.1"`, `"react-dom": "^18.3.1"`, `"react-router-dom": "^7.13.0"`, `"react-helmet-async": "^2.0.5"`.
  - Installed devDependencies: `"vite": "^6.2.0"`, `"typescript": "~5.8.2"`, `"@tailwindcss/vite": "^4.3.0"`. No test packages installed.
  - Installed versions from `npm list --depth=0`: `node v22.20.0`, `vite@6.4.6`, `typescript@5.8.3`.
- **`tsconfig.json`** (`lines 1-31`):
  `"strict": true` is missing from `compilerOptions`. Current options include `target: "ES2022"`, `moduleResolution: "bundler"`, `skipLibCheck: true`, `noEmit: true`.
- **`vite.config.ts`** (`lines 14-17`):
  ```typescript
  define: {
    'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  }
  ```
  `process.env.API_KEY` define remains exposed in the client configuration.

### 2. Security Subsystem
- **`components/ContactInterface.tsx`** (`lines 12, lines 80-99, lines 651-667`):
  - Line 12: `const MAX_MSGS = 999999;` (UI displays 20-message limit notice at line 638, creating rate-limiting mismatch).
  - Lines 80-99:
    ```tsx
    if (text[j] === '[') {
        const labelEnd = text.indexOf(']', j);
        if (labelEnd !== -1 && text[labelEnd + 1] === '(') {
            const urlEnd = text.indexOf(')', labelEnd + 2);
            if (urlEnd !== -1) {
                flush();
                const label = text.slice(j + 1, labelEnd);
                const url = text.slice(labelEnd + 2, urlEnd);
                push(
                    <a key={`${key}-l${j}`} href={url} target="_blank" rel="noopener noreferrer"
                        className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
                        {label}
                    </a>
                );
                j = urlEnd + 1;
                continue;
            }
        }
    }
    ```
    Raw `url` is passed directly to `href={url}` without validating protocol `/^(https?:\/\/|mailto:)/i`. Malicious inputs such as `[test](javascript:alert(1))` render active `javascript:` links.
  - Line 651: `<input type="text" value={consoleInput} ... />` lacks `maxLength={500}`.
- **`vercel.json`** (`lines 8-54`):
  Contains cache headers for assets, sitemap, and robots, but zero security headers. Lacks:
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Content-Security-Policy`.

### 3. SEO & Metadata Subsystem
- **`components/common/SEO.tsx`** (`lines 36, 41-91`):
  - Line 36: `const finalKeywords = keywords || defaultKeywords;` is defined, but no `<meta name="keywords" content={finalKeywords} />` tag is rendered inside `<Helmet>`.
  - Lines 86-90:
    ```tsx
    {schema && (
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    )}
    ```
    JSON is serialized with `JSON.stringify(schema)` without escaping `<` (`\u003c`), vulnerable to script breakout (`</script>`).
- **`public/` directory**:
  - `Get-ChildItem -Path public` confirmed: `assets/`, `font_comparison.html`, `robots.txt`, `sitemap.xml`, `_redirects`.
  - `favicon.ico` is **absent** (returns 404).
  - `manifest.json` is **absent** (PWA manifest missing).
  - `font_comparison.html` is an unreferenced 43KB test artifact.
- **`scripts/prerender.js`** (`line 316`):
  ```javascript
  { dir: 'videos', config: { ...automationRoute, url: 'https://rsmk.tech/videos' } }
  ```
  Prerender route `/videos` sets canonical URL to `https://rsmk.tech/videos` instead of canonicalizing to `https://rsmk.tech/automation`.

### 4. UI & Theme Contrast Subsystem
- **`pages/Home.tsx`** (`lines 81-87, lines 955`):
  - Line 85: `color: isPowered ? '#ffffff' : '#111111'` on background `#080806` produces a contrast ratio of **1.05:1**, failing WCAG AA (>= 4.5:1).
  - Line 955: `<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-4 mt-4 select-none">` creates horizontal document scrollbar breakout on desktop viewports.
- **`components/SkillBreadboard.tsx`** (`lines 177, 215, 276`):
  - Line 276: `className={... ${isPowered ? 'text-white' : 'text-gray-900'}}`
  - On `#080806`, `text-gray-900` (#111827) produces a contrast ratio of **1.14:1**.
- **`components/TimelineSystem.tsx`** (`lines 87, 110`):
  - Line 87: Standby card background is `bg-white/5` on `#080806`.
  - Line 110: Heading is `text-gray-900`. Contrast ratio is **~1.1:1**.
- **`components/CertificationsBlock.tsx`** (`lines 873, 968, 972, 1002`):
  - Line 873: `!isPowered ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''` disables card access.
  - Line 968: `text-zinc-900` on `#121212` produces **1.35:1** contrast.

### 5. Interactions & Accessibility Subsystem
- **`components/CertificationsBlock.tsx`** (`GalleryModal`, `lines 1034-1188`):
  - Has `Escape` key listener (`line 1024`), but missing `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and focus trap cycle.
- **`pages/IndustrialPortfolio.tsx`** (`ProjectModal`, `lines 183-432`):
  - Missing `Escape` key handler (only closes on overlay click or X button click).
  - Missing `role="dialog"` and `aria-modal="true"`.
- **`components/ProjectChip.tsx`** (`lines 63-243`):
  - Not keyboard accessible: lacks `tabIndex={0}` and `onKeyDown` (Enter/Space).
  - Does not open a project detail modal on click (only hover overlay with link).
- **`pages/Home.tsx`** (`lines 957-967`):
  - Projects carousel only binds mouse handlers (`onMouseDown`, `onMouseMove`, `onMouseUp`). Touch handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`) are absent.

### 6. Content & Asset Catalog Subsystem
- **`constants.tsx`** (`PROJECTS`, `lines 60-204`):
  - Contains only 6 projects: `p1`, `p3`, `p5`, `p6`, `p7`, `p8`.
  - Missing `p2` ("Industrial Automation & Control – CODESYS & Factory I/O Simulation") and `p4` ("Single-Axis Solar Tracker" or other omitted project).
  - Project `p7` (SPDS) specifies `image: '/assets/ai-chatbot-interface-background.webp'`, which is the chatbot UI background rather than solar dewatering hardware.
- **`components/CertificationsBlock.tsx`** (`CERTS`, `lines 22-590`):
  - Enumerates 36 certificates (CERT-002 through CERT-041).
  - All 36 have matching `.png` preview assets verified in `public/assets/certifications/`.

---

# SECTION 2: LOGIC CHAIN

```
[Observation 1.1] package.json uses Vite 6.4.6, React 18.3.1, TypeScript 5.8.3, but no test runner exists
   └──> Vitest is built specifically for Vite projects, sharing the same plugins, aliases, and transform pipeline.
   └──> Jest would require Babel/ts-jest duplicate transforms and struggles with Vite CSS plugins (@tailwindcss/vite).
   └──> Recommendation: Vitest + jsdom + @testing-library/react + @testing-library/jest-dom is the zero-overhead, 100% compatible choice.

[Observation 2.1] ContactInterface.tsx MiniMarkdown takes raw markdown string and injects href={url} directly
   └──> An AI response or injection payload like [click](javascript:alert(1)) generates a live XSS execution vector.
   └──> Validation with /^(https?:\/\/|mailto:)/i is required to ensure only safe protocols render as <a> links.
   └──> MAX_MSGS=999999 and missing maxLength={500} bypass rate limits and allow backend flooding.

[Observation 2.2] vercel.json contains no security headers or CSP
   └──> The production site is vulnerable to clickjacking (missing X-Frame-Options), MIME sniffing, and rogue scripts.
   └──> A strict CSP directive must be defined and validated via test.

[Observation 3.1] SEO.tsx emits raw JSON.stringify(schema) and omits keywords tag; favicon.ico/manifest.json missing
   └──> Script tags in HTML are closed by the literal sequence </script> regardless of JS string literals. Unescaped JSON-LD breaks out.
   └──> Missing keywords tag leaves Feature 13 unsatisfied. Missing favicon.ico and manifest.json fail PWA and crawler audits.

[Observation 4.1] Standby mode (isPowered=false) in Home, Skills, Timeline, Certs uses #111111 or text-gray-900 on #080806
   └──> Contrast ratios are 1.05:1 to 1.35:1. WCAG AA requires >= 4.5:1 for normal body text and >= 3:1 for large text.
   └──> High-contrast telemetry palette (Amber #f59e0b, Zinc #a1a1aa, Zinc #d4d4d8) provides > 7:1 contrast on #080806.

[Observation 5.1] Modals lack role="dialog", aria-modal="true", and focus traps; carousel lacks touch handlers
   └──> Screen readers cannot detect modal context; Tab key escapes to background elements behind the modal.
   └──> Mobile users cannot swipe the projects carousel because only mouse drag events are bound.

[Observation 6.1] constants.tsx lacks p2 and p4; p7 has incorrect SPDS image
   └──> Incomplete project catalog and corrupted image references degrade information integrity.
   └──> Content tests must assert catalog completeness and asset filesystem presence.
```

---

# SECTION 3: TEST INFRASTRUCTURE RECOMMENDATION

### 1. Exact NPM Packages to Install
Add the following packages to `devDependencies` in `package.json`:

```bash
npm install -D vitest@^3.0.0 jsdom@^26.0.0 @testing-library/react@^16.2.0 @testing-library/jest-dom@^6.6.3 @testing-library/user-event@^14.6.1
```

| Package | Version | Purpose |
|---|---|---|
| `vitest` | `^3.0.0` | High-performance test runner native to Vite 6 |
| `jsdom` | `^26.0.0` | DOM simulation environment for React component rendering |
| `@testing-library/react` | `^16.2.0` | React 18 component testing utilities and queries |
| `@testing-library/jest-dom` | `^6.6.3` | Matchers for DOM assertion (`toBeInTheDocument`, `toHaveAttribute`) |
| `@testing-library/user-event` | `^14.6.1` | Realistic browser event simulations (typing, clicking, tabbing) |

### 2. Standalone Test Configuration: `vitest.config.ts`
Create `vitest.config.ts` in the project root to keep the test pipeline distinct from `vite.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

### 3. Test Setup File: `tests/setup.ts`
Create `tests/setup.ts` to mock browser APIs absent in JSDOM:

```typescript
import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
  takeRecords = () => [];
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock window.scrollTo
window.scrollTo = (() => {}) as any;
```

### 4. Scripts Update in `package.json`
```json
"scripts": {
  "dev": "vite",
  "build": "vite build && node scripts/prerender.js",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

---

# SECTION 4: 4-TIER TEST SPECIFICATION & TEST CASE DESIGNS

The test harness is divided into 5 suites corresponding to the 5 audit domains. Each suite implements the mandatory 4-Tier methodology:
- **Tier 1**: Feature Coverage (>=5 isolated unit/functional tests)
- **Tier 2**: Boundary & Corner Cases (malicious inputs, limits, edge conditions)
- **Tier 3**: Cross-Feature Combinations (multi-module interactions)
- **Tier 4**: Real-World Scenarios (end-to-end user workflows and bundle checks)

---

## Suite 1: `tests/security.test.ts`
**Features Covered**: #1 (CVEs), #2 (Secret Exposure), #3 (MiniMarkdown XSS), #4 (Security Headers & CSP), #5 (Chatbot Rate Bounds), #6 (Strict TypeScript & Dead Deps).

### Tier 1 — Feature Coverage
1. `test('MiniMarkdown allows valid https:// links')`: Input `[RSMK Tech](https://rsmk.tech)` renders `<a href="https://rsmk.tech" target="_blank" rel="noopener noreferrer">`.
2. `test('MiniMarkdown allows valid http:// and mailto: links')`: Input `[Mail](mailto:test@rsmk.tech)` renders `<a href="mailto:test@rsmk.tech">`.
3. `test('vercel.json specifies global security headers')`: Parses `vercel.json`, verifies presence of headers rule `/(.*)` containing `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
4. `test('vercel.json specifies comprehensive Content-Security-Policy')`: Validates CSP header string contains `default-src 'self'`, `script-src`, `style-src`, `img-src`, `connect-src`, `object-src 'none'`.
5. `test('vite.config.ts omits process.env.API_KEY client define')`: Inspects `vite.config.ts` file contents; verifies `'process.env.API_KEY'` is not declared in the `define` object.
6. `test('tsconfig.json enforces strict mode')`: Parses `tsconfig.json`, verifies `compilerOptions.strict === true`.
7. `test('ContactInterface enforces MAX_MSGS = 20 and input maxLength = 500')`: Inspects `ContactInterface.tsx` constants and rendered input properties.

### Tier 2 — Boundary & Corner Cases
1. `test('MiniMarkdown blocks javascript: URI execution')`: Input `[Click Me](javascript:alert(1))` must NOT render an `<a>` with `javascript:` href (renders plain text or safe anchor).
2. `test('MiniMarkdown blocks protocol obfuscation tricks')`: Inputs with mixed casing `[Test](JaVaScRiPt:alert(1))`, whitespace `[Test]( javascript:...)`, and `data:text/html` are sanitized.
3. `test('MiniMarkdown neutralizes nested HTML tag breakouts')`: Input `[Test](https://rsmk.tech" onclick="alert(1))` properly escapes quotes and attributes.
4. `test('Chat input rejects input exceeding 500 characters')`: Simulating user typing 501 characters truncates value to 500 characters.
5. `test('Chat rate limit locks UI exactly at message 20')`: After 20 user submissions, input becomes `disabled={true}`, send button is disabled, and limit banner is displayed.
6. `test('Empty and whitespace-only submissions are blocked')`: Typing `"   "` does not increment message count or trigger fetch call.

### Tier 3 — Cross-Feature Combinations
1. `test('MiniMarkdown handles mixed complex payload safely')`: A single markdown response containing code blocks, bold text, valid links, and malicious links renders valid formatting while neutering attack vectors.
2. `test('Session storage rate count syncs across simulated re-renders')`: Setting `sessionStorage.getItem('rsmk_chat_usage')` to 20 immediately locks down a newly mounted `ContactInterface`.
3. `test('CSP header whitelists all runtime analytics and API origins')`: Asserts CSP connect-src and script-src include `https://project-mani-c0t3.onrender.com`, `https://www.googletagmanager.com`, `https://www.clarity.ms`, and `https://fonts.googleapis.com`.

### Tier 4 — Real-World Scenarios
1. `test('Adversarial prompt injection and XSS fuzzing workflow')`: Executes an automated fuzzing array of 15 known markdown XSS vectors against `ContactInterface` and asserts zero unescaped DOM executions.
2. `test('Production bundle secret scan')`: Scans `dist/` or project assets to verify zero instances of string matching raw API secret patterns or unescaped `.env` variables.

---

## Suite 2: `tests/seo.test.ts`
**Features Covered**: #7 (JSON-LD Escaping), #9 (Asset Masking & OG Card), #10 (Favicon & Manifest), #13 (SEO Canonical & Keywords).

### Tier 1 — Feature Coverage
1. `test('public/favicon.ico exists and is non-empty')`: Asserts `public/favicon.ico` exists on disk with byte size > 0.
2. `test('public/manifest.json exists and contains required PWA fields')`: Parses `public/manifest.json`, validates `name`, `short_name`, `icons`, `start_url`, `display: standalone`, `theme_color`.
3. `test('index.html links to favicon and web manifest')`: Asserts `<link rel="icon" href="/favicon.ico">` and `<link rel="manifest" href="/manifest.json">` exist in `index.html`.
4. `test('SEO component renders title, meta description, and keywords tags')`: Renders `<SEO title="Test Title" keywords="react, testing" />` within `<HelmetProvider>` and verifies tags.
5. `test('SEO component renders canonical URL')`: Verifies `<link rel="canonical" href="https://rsmk.tech/automation">` on `/automation`.
6. `test('SEO component renders OpenGraph 1200x630 tags')`: Verifies `og:image:width === "1200"` and `og:image:height === "630"`.
7. `test('public/robots.txt allows all and specifies sitemap')`: Verifies `User-agent: *`, `Allow: /`, and `Sitemap: https://rsmk.tech/sitemap.xml`.
8. `test('public/sitemap.xml contains primary canonical routes')`: Verifies XML includes `https://rsmk.tech/`, `https://rsmk.tech/gallery`, `https://rsmk.tech/automation`.

### Tier 2 — Boundary & Corner Cases
1. `test('JSON-LD schema escapes < and </script> tags')`: Passes schema object `{ name: "</script><script>alert(1)</script>" }` to `SEO.tsx` and asserts output does NOT contain raw `</script>`.
2. `test('Canonical URL formats relative paths correctly')`: Renders with `url="automation"` and `url="/automation"` — both produce exact canonical `https://rsmk.tech/automation`.
3. `test('noindex prop switches robots tag to noindex, nofollow')`: Verifies `<SEO noindex={true} />` produces `<meta name="robots" content="noindex, nofollow">`.
4. `test('OpenGraph image fallback handles JPG, PNG, and WebP extensions')`: Verifies `og:image:type` assigns `image/jpeg` for `.jpg`, `image/png` for `.png`, and `image/webp` for `.webp`.

### Tier 3 — Cross-Feature Interactions
1. `test('/videos route canonicalizes to /automation in SEO component')`: Mounts `IndustrialPortfolio` rendered under `/videos` route and confirms canonical link is `https://rsmk.tech/automation`.
2. `test('scripts/prerender.js emits escaped JSON-LD and canonical /automation for /videos')`: Inspects `prerender.js` routes config to confirm `videos` entry uses `url: 'https://rsmk.tech/automation'`.
3. `test('OpenGraph card image referenced in SEO exists physically on disk')`: Extracts `defaultImage` or OG card path from `SEO.tsx` and verifies file exists in `public/`.

### Tier 4 — Real-World Scenarios
1. `test('Search engine crawler head simulation')`: Simulates crawler fetching `index.html` and asserts all 12 mandatory meta tags (`title`, `description`, `canonical`, `og:title`, `og:image`, `og:url`, `twitter:card`, `twitter:image`, `robots`, `viewport`, `charset`, `keywords`) are present.
2. `test('Lighthouse PWA manifest validation')`: Validates manifest icon entries physically exist in `public/` and match specified dimensions (192x192, 512x512).

---

## Suite 3: `tests/ui.test.ts`
**Features Covered**: #14 (Standby Mode Contrast), #16 (Viewport Breakout Margin), #19 (Typography Polish), #20 (Anchor Stabilization & Dead Code).

### Tier 1 — Feature Coverage
1. `test('isPowered toggle updates theme state')`: Clicking power grid switch in `Home.tsx` toggles `isPowered` between `true` and `false`.
2. `test('Home section headers maintain WCAG AA contrast in Standby mode')`: Asserts section header color in Standby mode is not `#111111` and has contrast ratio >= 4.5:1 against `#080806`.
3. `test('SkillBreadboard headings and text maintain WCAG AA contrast in Standby mode')`: Asserts `CategoryCard` titles and chips do not use dark gray on `#080806` in Standby mode.
4. `test('TimelineSystem headings maintain WCAG AA contrast in Standby mode')`: Asserts role/degree headings do not use `text-gray-900` on `#080806`.
5. `test('CertificationsBlock text maintains WCAG AA contrast in Standby mode')`: Asserts credential text, issuer, and titles meet WCAG AA contrast.
6. `test('Projects carousel container omits negative breakout margins')`: Asserts carousel wrapper in `Home.tsx` does NOT contain `-ml-[50vw] -mr-[50vw]`.

### Tier 2 — Boundary & Corner Cases
1. `test('Luminance contrast ratio math utility function')`: Implements WCAG 2.1 relative luminance formula in tests and verifies:
   - Amber `#f59e0b` on `#080806` = 9.4:1 (PASS)
   - Zinc `#a1a1aa` on `#080806` = 7.1:1 (PASS)
   - Cyan `#22d3ee` on `#080806` = 11.2:1 (PASS)
   - Black `#111111` on `#080806` = 1.05:1 (FAIL)
2. `test('Muted text tokens meet 4.5:1 ratio')`: Tests secondary subtitles (`text-zinc-400`, `text-gray-400`) against background `#080806` to ensure >= 4.5:1.
3. `test('Standby mode does not disable pointer events on certificate cards')`: Asserts cards remain inspectable in Standby mode without `pointer-events-none`.

### Tier 3 — Cross-Feature Interactions
1. `test('Standby toggle updates contrast dynamically across all 4 components')`: Renders `Home.tsx` containing Skills, Timeline, and Certs; clicks toggle and asserts all headers update to high-contrast telemetry colors simultaneously.
2. `test('Anchor jump target for #certifications retains layout stability')`: Asserts `contain-intrinsic-size` or layout dimensions prevent Cumulative Layout Shift (CLS) on navigation.
3. `test('Dead code timers are removed from Home.tsx')`: Verifies unrendered `heroIntro` / `statusText` interval timers do not trigger state updates or leak memory.

### Tier 4 — Real-World Scenarios
1. `test('Full-page automated color contrast scan')`: Traverses all rendered text nodes on the Home page in both Online and Standby modes, validating every visible text element has contrast >= 4.5:1 against its computed background.

---

## Suite 4: `tests/interactions.test.ts`
**Features Covered**: #15 (Carousel Touch Support), #17 (Modal Accessibility & Focus Traps), #18 (Project Details Modal).

### Tier 1 — Feature Coverage
1. `test('GalleryModal includes role="dialog" and aria-modal="true"')`: Renders `GalleryModal` in `CertificationsBlock.tsx` and asserts modal root has `role="dialog"` and `aria-modal="true"`.
2. `test('ProjectModal includes role="dialog" and aria-modal="true"')`: Renders `ProjectModal` in `IndustrialPortfolio.tsx` and asserts modal root has `role="dialog"` and `aria-modal="true"`.
3. `test('Escape key closes GalleryModal')`: Opens `GalleryModal`, presses `Escape`, and verifies modal closes (`onClose` invoked).
4. `test('Escape key closes ProjectModal')`: Opens `ProjectModal`, presses `Escape`, and verifies modal closes (`onClose` invoked).
5. `test('Projects carousel binds touchstart, touchmove, and touchend handlers')`: Inspects `projectsScrollRef` element in `Home.tsx` and confirms touch event listeners are attached.
6. `test('Projects carousel pause/play control toggles auto-scroll')`: Clicking Pause button updates state and changes button label to RESUME.
7. `test('Certificate cards have tabIndex={0} and trigger on Enter key')`: Renders `CertificateCard`, presses `Enter`, and asserts modal opens.
8. `test('Project chips have tabIndex={0} and trigger on Enter key')`: Renders `ProjectChip`, presses `Enter`, and asserts action triggers.

### Tier 2 — Boundary & Corner Cases
1. `test('Focus Trap cycles focus within modal')`: In an open modal, pressing `Tab` on the last interactive element shifts focus to the first interactive element (close button); pressing `Shift+Tab` on the first shifts focus to the last. Focus never leaves the modal.
2. `test('Modal locks body scroll on open and restores on unmount')`: Verifies `document.body.style.overflow === 'hidden'` when modal is mounted, and `""` when unmounted.
3. `test('Carousel touch swipe distinguishes tap from drag')`: Swiping < 8px does not trigger scroll displacement; swiping > 15px calculates correct scroll delta.
4. `test('Certificate card click vs drag disambiguation')`: Dragging carousel does not inadvertently open card modal on mouse/touch up.

### Tier 3 — Cross-Feature Interactions
1. `test('Project details modal displays full writeup, features, and gallery')`: Clicking a project chip opens modal populated with `project.details`, `project.features`, and `project.gallery` from `constants.tsx`.
2. `test('Opening modal during power grid toggle retains modal state')`: Toggling power grid while modal is open does not dismiss or corrupt modal contents.
3. `test('Escape key closes only the topmost modal when nested')`: Confirms clean unmount and event listener cleanup.

### Tier 4 — Real-World Scenarios
1. `test('Keyboard-only user journey across projects and credentials')`: Simulates keyboard user pressing Tab to navigate to projects carousel, pressing Enter on a project to open details modal, tabbing through modal features, pressing Escape to exit, and verifying focus returns to the card trigger.
2. `test('Mobile user touch interaction journey')`: Simulates touch swipe across projects carousel, tap to open certificate preview, and tap on touch-friendly close button (minimum 44x44px).

---

## Suite 5: `tests/content.test.ts`
**Features Covered**: #8 (Certificate Previews Mapping), #11 (Project Listings & Images), #12 (Orphaned Media & File Hygiene).

### Tier 1 — Feature Coverage
1. `test('All 36 certifications in CERTS array are fully defined')`: Verifies every entry in `CERTS` has `id`, `title`, `issuer`, `year`, `category`, and non-empty `skills`.
2. `test('Every certification maps to an existing PNG/JPG preview on disk')`: For each of the 36 certs, resolves `previewImage` against `public/` and asserts file exists.
3. `test('Every certification has a valid verificationHash')`: Asserts `verificationHash` matches `/^sha256-[0-9a-f]{64}$/i`.
4. `test('constants.tsx PROJECTS catalog includes restored p2 and p4')`: Asserts `PROJECTS` has length >= 8, containing IDs `p1`, `p2`, `p3`, `p4`, `p5`, `p6`, `p7`, `p8`.
5. `test('SPDS project p7 references dedicated solar dewatering image')`: Asserts `p7.image` is NOT `ai-chatbot-interface-background.webp` and references a valid solar/dewatering asset.
6. `test('PROFILE object contains complete contact and social links')`: Verifies `PROFILE.name`, `email`, `location`, `resume`, and all 6 social platforms (`github`, `linkedin`, `telegram`, `instagram`, `x`, `email`).
7. `test('EXPERIENCE and EDUCATION data arrays are complete')`: Asserts `EXPERIENCE` has Coromandel internship with description bullets and tech tags; `EDUCATION` has B.Tech and Diploma.

### Tier 2 — Boundary & Corner Cases
1. `test('Missing image fallback gracefully renders placeholder')`: Certificate or project with undefined image renders without throwing uncaught exceptions.
2. `test('Asset file type validation')`: Verifies all referenced images are valid image binaries (PNG, JPG, WebP, SVG) and not HTML error pages.
3. `test('No duplicate IDs exist across projects or certifications')`: Asserts `new Set(PROJECTS.map(p => p.id)).size === PROJECTS.length` and `new Set(CERTS.map(c => c.id)).size === CERTS.length`.
4. `test('External links use secure https:// or mailto: schemes')`: Asserts every URL in `PROJECTS`, `PROFILE.socials`, and `CERTS` uses `https://` or `mailto:`.

### Tier 3 — Cross-Feature Interactions
1. `test('Industrial projects filter and search matches data catalog')`: Simulates keyword searches in `data/industrialProjects.ts` (`CODESYS`, `EPLAN`, `Modbus`, `Factory I/O`) and confirms matching projects are returned.
2. `test('Orphaned media files are pruned from public directory')`: Scans `public/` to confirm unreferenced 43.5 MB WhatsApp video files, backup files, and `font_comparison.html` are deleted.
3. `test('ItemList schema in index.html matches constants.tsx PROJECTS catalog')`: Asserts item count and project titles in `index.html` JSON-LD align with `constants.tsx`.

### Tier 4 — Real-World Scenarios
1. `test('Complete repository dead-link and broken-image audit')`: Crawls every image URL, PDF URL, and link referenced across `constants.tsx`, `CertificationsBlock.tsx`, `industrialProjects.ts`, `Gallery.tsx`, and `Home.tsx` and asserts 100% of local assets exist on disk.
2. `test('Recruiter verification inspection journey')`: Asserts all credential IDs, institution names, and project demo links resolve with accurate metadata.

---

# SECTION 5: CAVEATS & RISK ASSESSMENT

1. **Vite 6 / Vitest 3 ESM Compatibility**:
   `package.json` specifies `"type": "module"`. Vitest 3.x is ESM-native and pairs seamlessly with Vite 6.4.6. Ensure `vitest` version is `^3.0.0` (earlier Vitest 1.x/2.x had peer dependency conflicts with Vite 6).
2. **Tailwind CSS v4 JIT in JSDOM**:
   Tailwind v4 uses `@tailwindcss/vite` without `tailwind.config.js`. JSDOM does not parse CSS cascade rules into computed styles. Therefore, contrast tests should verify class names and inline styles, or use a custom relative luminance calculation utility that maps Tailwind color classes (`text-amber-400`, `text-zinc-400`, `text-gray-900`) to their exact hex values.
3. **Framer Motion in JSDOM**:
   Framer Motion animations can cause asynchronous timing issues in tests. The setup file (`tests/setup.ts`) or test wrappers should mock `framer-motion` or use `MotionConfig reducedMotion="always"` to guarantee synchronous rendering.
4. **React Router v7 Data vs Component API**:
   The app uses React Router v7 (`react-router-dom@7.18.5`) with `<BrowserRouter>`, `<Routes>`, and `<Route>`. Test wrappers should wrap components in `<MemoryRouter>` to simulate path changes.

---

# SECTION 6: CONCLUSION

1. **Readiness**: The repository is fully prepared for test harness integration. Node 22, Vite 6, and TypeScript 5 are modern and standard. Installing `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` requires zero project structural re-architecture.
2. **Scope Alignment**: The proposed 5 test suites (`security.test.ts`, `seo.test.ts`, `ui.test.ts`, `interactions.test.ts`, `content.test.ts`) directly map to the 21 features in `PROJECT.md § Feature Inventory` with complete 4-tier depth.
3. **Actionable Implementation Order for Sub-Orchestrator**:
   - **Step 1**: Install test runner packages and add `vitest.config.ts`, `tests/setup.ts`, and `"test": "vitest run"` script.
   - **Step 2**: Author `tests/security.test.ts` to lock down M1 requirements.
   - **Step 3**: Author `tests/seo.test.ts` and `tests/content.test.ts` to lock down M2 requirements.
   - **Step 4**: Author `tests/ui.test.ts` and `tests/interactions.test.ts` to lock down M3 requirements.
   - **Step 5**: Execute `npm test` across all 5 suites and publish `TEST_INFRA.md` and `TEST_READY.md`.

---

# SECTION 7: VERIFICATION METHOD

### Independent Verification Steps
1. **Verify State and Report Files**:
   ```powershell
   Get-ChildItem -Path .agents\teamwork\explorer_test_env\
   Get-Content -Path .agents\teamwork\explorer_test_env\handoff.md -TotalCount 50
   ```
2. **Verify Toolchain & Dependency Versions**:
   ```powershell
   node -v
   npm -v
   npm list vite react typescript
   ```
3. **Verify Observations from Codebase**:
   - Check `ContactInterface.tsx` markdown link parser:
     ```powershell
     Select-String -Path components\ContactInterface.tsx -Pattern "MAX_MSGS|\[.*\]\(" -Context 2,2
     ```
   - Check `Home.tsx` contrast and margin breakout:
     ```powershell
     Select-String -Path pages\Home.tsx -Pattern "-ml-\[50vw\]|#111111" -Context 1,1
     ```
   - Check `constants.tsx` project IDs:
     ```powershell
     Select-String -Path constants.tsx -Pattern "id:\s*'p\d'"
     ```
   - Check certifications PNG assets count:
     ```powershell
     (Get-ChildItem -Path public\assets\certifications -Filter *.png).Count
     ```
4. **Invalidation Conditions**:
   - If `vitest run` fails due to Vite 6 compatibility, bump to latest `vitest@latest`.
   - If JSDOM fails on canvas/webgl, verify tests do not instantiate Three.js/PCB canvas without mock.
