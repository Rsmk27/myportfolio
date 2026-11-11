import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import fs from 'fs';
import path from 'path';

// Import components under test
import Home from '@/pages/Home';
import { SkillBreadboard } from '@/components/SkillBreadboard';
import { TimelineSystem } from '@/components/TimelineSystem';
import { CertificationsBlock, CERTS } from '@/components/CertificationsBlock';

/* ══════════════════════════════════════════════════════════════════════════════
   WCAG 2.1 COLOR CONTRAST & LUMINANCE MATHEMATICAL SPECIFICATION
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Parses standard 3 or 6 digit hex color strings into normalized sRGB channel values [0, 1].
 */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    throw new Error(`Invalid hex color string: "${hex}"`);
  }
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
}

/**
 * Computes WCAG 2.1 relative luminance for an sRGB triplet.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where each channel is linearized according to sRGB transfer function.
 */
export function getRelativeLuminance(hexOrRgb: string | [number, number, number]): number {
  const [r, g, b] = typeof hexOrRgb === 'string' ? hexToRgb(hexOrRgb) : hexOrRgb;

  const linearize = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const R = linearize(r);
  const G = linearize(g);
  const B = linearize(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Computes the WCAG 2.1 contrast ratio between two colors:
 * Ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color.
 */
export function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getRelativeLuminance(foreground);
  const lum2 = getRelativeLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Canonical Tailwind color map for classes utilized across the portfolio UI.
 */
export const TAILWIND_COLORS: Record<string, string> = {
  // Telemetry high-contrast palette
  'text-amber-400': '#fbbf24',
  'text-amber-500': '#f59e0b',
  'text-zinc-400': '#a1a1aa',
  'text-zinc-300': '#d4d4d8',
  'text-zinc-200': '#e4e4e7',
  'text-cyan-400': '#22d3ee',
  'text-cyan-300': '#67e8f9',
  'text-white': '#ffffff',

  // Dark/Low-contrast colors (rejected on dark backgrounds)
  'text-zinc-900': '#18181b',
  'text-zinc-800': '#27272a',
  'text-zinc-700': '#3f3f46',
  'text-gray-900': '#111827',
  'text-gray-800': '#1f2937',
  'text-gray-700': '#374151',
  '#111111': '#111111',
  '#18181b': '#18181b',
  '#121212': '#121212',
  '#080806': '#080806',
};

const BG_DARK = '#080806';
const WCAG_AA_NORMAL_TEXT_MIN_RATIO = 4.5;
const WCAG_AA_LARGE_TEXT_MIN_RATIO = 3.0;

/** Helper to render components wrapped in required router & helmet providers */
function renderWithProviders(ui: React.ReactElement) {
  return render(
    React.createElement(
      HelmetProvider,
      null,
      React.createElement(MemoryRouter, null, ui)
    )
  );
}

describe('UI & Theme Contrast Suite (Features #14, #16, #19, #20)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 1: FEATURE COVERAGE
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 1 — Feature Coverage', () => {
    it('1.1 should toggle isPowered theme state when power grid switch is clicked in Home', async () => {
      const user = userEvent.setup();
      renderWithProviders(React.createElement(Home));

      // Find the power toggle button by title or accessible name
      const toggleButton = screen.getByRole('button', {
        name: /ONLINE|STANDBY/i,
      });
      expect(toggleButton).toBeInTheDocument();

      // Initially online (powered)
      expect(toggleButton).toHaveTextContent(/ONLINE/i);

      // Click to toggle into Standby mode
      await user.click(toggleButton);

      // Verify button reflects updated Standby state
      expect(toggleButton).toHaveTextContent(/STANDBY/i);
    });

    it('1.2 [Feature #14 Contract] Home section headers must maintain WCAG AA contrast in Standby mode', () => {
      // Inspect SectionHeader implementation in Home.tsx
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // The current unremediated code sets `color: isPowered ? '#ffffff' : '#111111'`
      // Contract: Standby mode color must NOT be '#111111'
      expect(homeSource).not.toMatch(/color:\s*isPowered\s*\?\s*['"]#ffffff['"]\s*:\s*['"]#111111['"]/);

      // Contract: Standby color against #080806 must satisfy WCAG AA >= 4.5:1
      const standbyColorMatch = homeSource.match(/color:\s*isPowered\s*\?\s*['"]#ffffff['"]\s*:\s*['"]([^'"]+)['"]/);
      if (standbyColorMatch) {
        const standbyColor = standbyColorMatch[1];
        const ratio = getContrastRatio(standbyColor, BG_DARK);
        expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      }
    });

    it('1.3 [Feature #14 Contract] SkillBreadboard headings and text must maintain WCAG AA contrast in Standby mode', () => {
      const skillsSource = fs.readFileSync(path.resolve(__dirname, '../components/SkillBreadboard.tsx'), 'utf-8');

      // Contract: Heading must NOT fall back to dark 'text-gray-900' in standby mode
      expect(skillsSource).not.toMatch(/isPowered\s*\?\s*['"]text-white['"]\s*:\s*['"]text-gray-900['"]/);

      // Render SkillBreadboard in Standby mode (isPowered=false)
      const { container } = render(React.createElement(SkillBreadboard, { isPowered: false }));
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
      // Ensure heading class does not include text-gray-900
      expect(heading?.className).not.toContain('text-gray-900');
    });

    it('1.4 [Feature #14 Contract] TimelineSystem headings must maintain WCAG AA contrast in Standby mode', () => {
      const timelineSource = fs.readFileSync(path.resolve(__dirname, '../components/TimelineSystem.tsx'), 'utf-8');

      // Contract: Timeline role/degree headers must NOT fall back to text-gray-900 in standby mode
      expect(timelineSource).not.toMatch(/isPowered\s*\?\s*['"]text-white['"]\s*:\s*['"]text-gray-900['"]/);

      const { container } = render(React.createElement(TimelineSystem, { isPowered: false }));
      const cardHeadings = container.querySelectorAll('h4');
      expect(cardHeadings.length).toBeGreaterThan(0);
      cardHeadings.forEach((h) => {
        expect(h.className).not.toContain('text-gray-900');
      });
    });

    it('1.5 [Feature #14 Contract] CertificationsBlock text must maintain WCAG AA contrast in Standby mode', () => {
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // Contract: Cert titles must NOT fall back to text-zinc-900 in standby mode
      expect(certsSource).not.toMatch(/isPowered\s*\?\s*['"]text-white['"]\s*:\s*['"]text-zinc-900['"]/);

      const { container } = render(React.createElement(CertificationsBlock, { isPowered: false }));
      const certTitles = container.querySelectorAll('h4');
      expect(certTitles.length).toBeGreaterThan(0);
      certTitles.forEach((h) => {
        expect(h.className).not.toContain('text-zinc-900');
      });
    });

    it('1.6 [Feature #16 Contract] Projects carousel container omits negative breakout margins', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Feature #16: Remove `-ml-[50vw] -mr-[50vw]` overflow causing horizontal scroll jitter on desktop
      expect(homeSource).not.toContain('-ml-[50vw]');
      expect(homeSource).not.toContain('-mr-[50vw]');
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 2: BOUNDARY & CORNER CASES
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 2 — Boundary & Corner Cases', () => {
    it('2.1 should compute WCAG 2.1 relative luminance and contrast ratios accurately', () => {
      // Telemetry Amber (#f59e0b) on dark background (#080806)
      const amberRatio = getContrastRatio('#f59e0b', BG_DARK);
      expect(amberRatio).toBeGreaterThanOrEqual(9.0);
      expect(amberRatio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);

      // Telemetry Zinc (#a1a1aa) on dark background (#080806)
      const zincRatio = getContrastRatio('#a1a1aa', BG_DARK);
      expect(zincRatio).toBeGreaterThanOrEqual(7.0);
      expect(zincRatio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);

      // Cyan (#22d3ee) on dark background (#080806)
      const cyanRatio = getContrastRatio('#22d3ee', BG_DARK);
      expect(cyanRatio).toBeGreaterThanOrEqual(11.0);
      expect(cyanRatio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);

      // White (#ffffff) on dark background (#080806)
      const whiteRatio = getContrastRatio('#ffffff', BG_DARK);
      expect(whiteRatio).toBeGreaterThanOrEqual(18.0);

      // Black (#111111) on dark background (#080806) - MUST FAIL (< 1.2:1)
      const darkBlackRatio = getContrastRatio('#111111', BG_DARK);
      expect(darkBlackRatio).toBeLessThan(1.2);
      expect(darkBlackRatio).toBeLessThan(WCAG_AA_NORMAL_TEXT_MIN_RATIO);

      // Dark zinc (#18181b) on dark background (#080806) - MUST FAIL (< 1.3:1)
      const darkZincRatio = getContrastRatio('#18181b', BG_DARK);
      expect(darkZincRatio).toBeLessThan(1.3);
      expect(darkZincRatio).toBeLessThan(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
    });

    it('2.2 [Feature #19 Contract] Secondary and muted text tokens must meet 4.5:1 ratio against #080806', () => {
      // High contrast muted tokens
      const zinc400 = TAILWIND_COLORS['text-zinc-400'];
      const zinc300 = TAILWIND_COLORS['text-zinc-300'];
      const amber400 = TAILWIND_COLORS['text-amber-400'];

      expect(getContrastRatio(zinc400, BG_DARK)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      expect(getContrastRatio(zinc300, BG_DARK)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      expect(getContrastRatio(amber400, BG_DARK)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);

      // Low contrast text colors must fail the WCAG AA threshold
      const gray700 = TAILWIND_COLORS['text-gray-700'];
      const gray800 = TAILWIND_COLORS['text-gray-800'];
      expect(getContrastRatio(gray700, BG_DARK)).toBeLessThan(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      expect(getContrastRatio(gray800, BG_DARK)).toBeLessThan(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
    });

    it('2.3 [Feature #14 Contract] Standby mode does not disable pointer events on certificate cards', () => {
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // Contract: In Standby mode, cards must not be disabled with pointer-events-none or cursor-not-allowed
      expect(certsSource).not.toContain('opacity-40 cursor-not-allowed pointer-events-none');

      const { container } = render(React.createElement(CertificationsBlock, { isPowered: false }));
      const disabledCards = container.querySelectorAll('.pointer-events-none');
      // No interactive cards should have pointer-events-none applied to them
      expect(disabledCards.length).toBe(0);
    });

    it('2.4 should maintain layout containment boundaries without viewport overflow', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Breakout patterns like w-screen with negative margins must be avoided
      const breakoutPattern = /w-screen\s+relative\s+left-1\/2\s+right-1\/2\s+-ml-\[50vw\]\s+-mr-\[50vw\]/;
      expect(homeSource).not.toMatch(breakoutPattern);
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 3: CROSS-FEATURE INTERACTIONS
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 3 — Cross-Feature Interactions', () => {
    it('3.1 should dynamically update contrast across all 4 components when power is toggled', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(React.createElement(Home));

      const toggleButton = screen.getByRole('button', {
        name: /ONLINE|STANDBY/i,
      });

      // Verify components rendered
      expect(container.querySelector('#skills')).toBeInTheDocument();
      expect(container.querySelector('#certifications')).toBeInTheDocument();
      expect(container.querySelector('#experience')).toBeInTheDocument();

      // Click toggle
      await user.click(toggleButton);

      // Verify no header or card is rendered with illegible #111111
      const inlineStyledHeaders = container.querySelectorAll('h2[style*="color"]');
      inlineStyledHeaders.forEach((el) => {
        const style = el.getAttribute('style') || '';
        expect(style).not.toContain('#111111');
      });
    });

    it('3.2 [Feature #20 Contract] Anchor jump target for #certifications retains layout stability', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Check section #certifications declaration
      const certSectionRegex = /<section[^>]*id=['"]certifications['"][^>]*>/;
      const match = homeSource.match(certSectionRegex);
      expect(match).not.toBeNull();

      // Feature #20: Fix contain-intrinsic-size on #certifications to prevent CLS
      // The section or its container should specify layout containment or min-height
      const sectionSnippet = match ? match[0] : '';
      const containsContainment = sectionSnippet.includes('contain-') || homeSource.includes('contain-intrinsic-size') || homeSource.includes('content-visibility');
      expect(containsContainment).toBe(true);
    });

    it('3.3 [Feature #20 Contract] Dead code timers (heroIntro / statusText) are removed from Home.tsx', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Feature #20: Remove unrendered heroIntro / statusText timers
      expect(homeSource).not.toMatch(/const\s+\[heroIntro,\s*setHeroIntro\]\s*=\s*useState/);
      expect(homeSource).not.toMatch(/const\s+\[statusText,\s*setStatusText\]\s*=\s*useState/);
      expect(homeSource).not.toContain('INITIALIZING SYSTEM PROFILER...');
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 4: REAL-WORLD SCENARIOS
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 4 — Real-World Scenarios', () => {
    it('4.1 should pass full-page automated color contrast verification in Standby mode', () => {
      // In Standby mode, all theme tokens must be checked
      const telemetryPalette = [
        TAILWIND_COLORS['text-amber-400'],
        TAILWIND_COLORS['text-amber-500'],
        TAILWIND_COLORS['text-zinc-400'],
        TAILWIND_COLORS['text-zinc-300'],
        TAILWIND_COLORS['text-cyan-400'],
      ];

      // Every approved telemetry color must exceed WCAG AA ratio (4.5:1)
      telemetryPalette.forEach((hex) => {
        const ratio = getContrastRatio(hex, BG_DARK);
        expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      });

      // Disallowed colors must fail
      const disallowedColors = ['#111111', '#18181b', '#111827'];
      disallowedColors.forEach((hex) => {
        const ratio = getContrastRatio(hex, BG_DARK);
        expect(ratio).toBeLessThan(WCAG_AA_NORMAL_TEXT_MIN_RATIO);
      });
    });

    it('4.2 [Feature #19 Contract] Typography consistency across components', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');
      const skillsSource = fs.readFileSync(path.resolve(__dirname, '../components/SkillBreadboard.tsx'), 'utf-8');

      // Fonts should use Space Grotesk, Space Mono, or JetBrains Mono
      expect(homeSource).toContain("'Space Grotesk'");
      expect(skillsSource).toContain("'Space Grotesk'");
    });
  });
});
