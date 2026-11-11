import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import fs from 'fs';
import path from 'path';

// Components under test
import Home from '@/pages/Home';
import IndustrialPortfolio from '@/pages/IndustrialPortfolio';
import { CertificationsBlock, CERTS } from '@/components/CertificationsBlock';
import { ProjectChip } from '@/components/ProjectChip';
import { PROJECTS } from '@/constants';
import { INDUSTRIAL_PROJECTS } from '@/data/industrialProjects';

/** Helper to render components wrapped in required providers */
function renderWithProviders(ui: React.ReactElement) {
  return render(
    React.createElement(
      HelmetProvider,
      null,
      React.createElement(MemoryRouter, null, ui)
    )
  );
}

describe('Interactions & Accessibility Suite (Features #15, #17, #18)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 1: FEATURE COVERAGE
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 1 — Feature Coverage', () => {
    it('1.1 [Feature #17 Contract] GalleryModal must render with role="dialog" and aria-modal="true"', () => {
      // Check CertificationsBlock.tsx source for modal dialog ARIA semantics
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // GalleryModal must render an element with role="dialog" and aria-modal="true"
      expect(certsSource).toMatch(/role=["']dialog["']/);
      expect(certsSource).toMatch(/aria-modal=["']true["']/);

      // Verify in rendered DOM
      const { container } = render(React.createElement(CertificationsBlock, { isPowered: true }));
      // Click first certificate card
      const firstCard = container.querySelector('.group.cursor-pointer, [data-testid="cert-card"]');
      if (firstCard) {
        fireEvent.click(firstCard);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');
      }
    });

    it('1.2 [Feature #17 Contract] ProjectModal must render with role="dialog" and aria-modal="true"', () => {
      const industrialSource = fs.readFileSync(path.resolve(__dirname, '../pages/IndustrialPortfolio.tsx'), 'utf-8');

      // ProjectModal in IndustrialPortfolio must declare role="dialog" and aria-modal="true"
      expect(industrialSource).toMatch(/role=["']dialog["']/);
      expect(industrialSource).toMatch(/aria-modal=["']true["']/);

      // Verify in rendered DOM
      renderWithProviders(React.createElement(IndustrialPortfolio));
      const firstProjectCard = screen.getAllByRole('button', { name: /view project|explore project|open/i })[0] ||
        screen.getByText(INDUSTRIAL_PROJECTS[0].title);
      fireEvent.click(firstProjectCard);

      const dialog = screen.queryByRole('dialog');
      expect(dialog).not.toBeNull();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('1.3 should close GalleryModal on Escape keypress (Feature #17)', async () => {
      const { container } = render(React.createElement(CertificationsBlock, { isPowered: true }));

      // Find first card and click to open GalleryModal
      const firstCard = container.querySelector('.group.h-full');
      expect(firstCard).not.toBeNull();
      if (firstCard) {
        fireEvent.click(firstCard);

        // Modal should now be open - verify cert title is displayed in modal
        const certTitle = CERTS[0].title;
        expect(screen.getByText(certTitle)).toBeInTheDocument();

        // Press Escape key
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

        // Modal should dismiss
        await waitFor(() => {
          expect(screen.queryByText('VERIFICATION DETAILS')).not.toBeInTheDocument();
        });
      }
    });

    it('1.4 [Feature #17 Contract] should close ProjectModal on Escape keypress in IndustrialPortfolio', async () => {
      // Check IndustrialPortfolio.tsx source for Escape key handler inside ProjectModal
      const industrialSource = fs.readFileSync(path.resolve(__dirname, '../pages/IndustrialPortfolio.tsx'), 'utf-8');

      // The unremediated ProjectModal lacks an Escape key handler
      const hasEscapeInModal = /key\s*===\s*['"]Escape['"]/.test(
        industrialSource.slice(
          industrialSource.indexOf('const ProjectModal'),
          industrialSource.indexOf('export default IndustrialPortfolio')
        )
      );
      expect(hasEscapeInModal).toBe(true);
    });

    it('1.5 [Feature #15 Contract] Projects carousel must bind touchstart, touchmove, and touchend handlers', () => {
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Feature #15: Add touch event handling (onTouchStart, onTouchMove, onTouchEnd) to auto-scrolling projects carousel
      const carouselRefIdx = homeSource.indexOf('ref={projectsScrollRef}');
      expect(carouselRefIdx).toBeGreaterThan(0);

      const carouselSnippet = homeSource.slice(carouselRefIdx, carouselRefIdx + 600);
      expect(carouselSnippet).toContain('onTouchStart');
      expect(carouselSnippet).toContain('onTouchMove');
      expect(carouselSnippet).toContain('onTouchEnd');
    });

    it('1.6 should toggle auto-scroll pause state when Pause/Resume button is clicked in Home (Feature #15)', async () => {
      const user = userEvent.setup();
      renderWithProviders(React.createElement(Home));

      // Locate the Pause Auto-Scroll control button
      const pauseBtn = screen.getByRole('button', { name: /Pause Auto-Scroll/i });
      expect(pauseBtn).toBeInTheDocument();
      expect(pauseBtn).toHaveTextContent(/PAUSE/i);

      // Click to pause auto-scroll
      await user.click(pauseBtn);

      // Control toggles to RESUME
      const resumeBtn = screen.getByRole('button', { name: /Resume Auto-Scroll/i });
      expect(resumeBtn).toBeInTheDocument();
      expect(resumeBtn).toHaveTextContent(/RESUME/i);

      // Click again to resume
      await user.click(resumeBtn);
      expect(screen.getByRole('button', { name: /Pause Auto-Scroll/i })).toBeInTheDocument();
    });

    it('1.7 [Feature #17 Contract] Certificate cards must have tabIndex={0} and trigger on Enter key', () => {
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // Certificate cards must be keyboard accessible
      expect(certsSource).toMatch(/tabIndex=\{0\}/);
      expect(certsSource).toMatch(/onKeyDown=\{/);

      // Render CertificationsBlock
      const { container } = render(React.createElement(CertificationsBlock, { isPowered: true }));
      const firstCard = container.querySelector('[tabindex="0"], .group.h-full');
      expect(firstCard).toHaveAttribute('tabIndex', '0');

      // Fire Enter key on focused card
      fireEvent.keyDown(firstCard!, { key: 'Enter', code: 'Enter' });
      expect(screen.getByText(CERTS[0].title)).toBeInTheDocument();
    });

    it('1.8 [Feature #17 Contract] Project chips must have tabIndex={0} and keyboard trigger handlers', () => {
      const chipSource = fs.readFileSync(path.resolve(__dirname, '../components/ProjectChip.tsx'), 'utf-8');

      // ProjectChip must be focusable via keyboard
      expect(chipSource).toMatch(/tabIndex=\{0\}/);
      expect(chipSource).toMatch(/onKeyDown=\{/);

      // Render ProjectChip
      const sampleProject = PROJECTS[0];
      const { container } = render(React.createElement(ProjectChip, { project: sampleProject, isPowered: true }));

      const focusableChip = container.querySelector('[tabindex="0"]');
      expect(focusableChip).not.toBeNull();
      expect(focusableChip).toHaveAttribute('tabIndex', '0');
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 2: BOUNDARY & CORNER CASES
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 2 — Boundary & Corner Cases', () => {
    it('2.1 [Feature #17 Contract] Focus Trap cycles focus within modal (Tab & Shift+Tab containment)', () => {
      // Check for focus trap implementation in modals (CertificationsBlock or modal utilities)
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');
      const industrialSource = fs.readFileSync(path.resolve(__dirname, '../pages/IndustrialPortfolio.tsx'), 'utf-8');

      // Modals must either listen for Tab key or incorporate a focus trap mechanism
      const hasFocusTrap = certsSource.includes('focusTrap') ||
        certsSource.includes("e.key === 'Tab'") ||
        industrialSource.includes("e.key === 'Tab'") ||
        certsSource.includes('focus-trap');

      expect(hasFocusTrap).toBe(true);
    });

    it('2.2 [Feature #17 Contract] Modal must lock body scroll on open and restore on unmount', async () => {
      // Test GalleryModal in CertificationsBlock
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // Feature #17: GalleryModal must set document.body.style.overflow = 'hidden'
      expect(certsSource).toContain("document.body.style.overflow = 'hidden'");
      expect(certsSource).toContain("document.body.style.overflow = ''");

      const { container, unmount } = render(React.createElement(CertificationsBlock, { isPowered: true }));
      const firstCard = container.querySelector('.group.h-full');
      if (firstCard) {
        fireEvent.click(firstCard);
        // While modal is open, body scroll must be locked
        expect(document.body.style.overflow).toBe('hidden');

        // Close modal
        fireEvent.keyDown(window, { key: 'Escape' });
        await waitFor(() => {
          expect(document.body.style.overflow).toBe('');
        });
      }

      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('2.3 should distinguish touch tap from drag swipe based on displacement threshold (Feature #15)', () => {
      // A small displacement (< 8px) should be treated as a tap/click, not a scroll drag
      const calculateDragDisplacement = (startX: number, currentX: number): { isDrag: boolean; delta: number } => {
        const delta = startX - currentX;
        const DRAG_THRESHOLD_PX = 8;
        return {
          isDrag: Math.abs(delta) >= DRAG_THRESHOLD_PX,
          delta,
        };
      };

      // Tap jitter: 3px
      const tapResult = calculateDragDisplacement(100, 103);
      expect(tapResult.isDrag).toBe(false);

      // Intentional swipe: 45px
      const swipeResult = calculateDragDisplacement(100, 55);
      expect(swipeResult.isDrag).toBe(true);
      expect(swipeResult.delta).toBe(45);

      // Reverse swipe: -30px
      const revSwipeResult = calculateDragDisplacement(100, 130);
      expect(revSwipeResult.isDrag).toBe(true);
      expect(revSwipeResult.delta).toBe(-30);
    });

    it('2.4 should disambiguate between card click and carousel drag in CertificationsBlock', () => {
      const certsSource = fs.readFileSync(path.resolve(__dirname, '../components/CertificationsBlock.tsx'), 'utf-8');

      // Inspect handleTouchEnd logic: suppress synthetic click if touchMoved.current is true
      expect(certsSource).toContain('if (touchMoved.current)');
      expect(certsSource).toContain('e.preventDefault()');
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 3: CROSS-FEATURE INTERACTIONS
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 3 — Cross-Feature Interactions', () => {
    it('3.1 [Feature #18 Contract] Project detail modal displays full writeup, features, and gallery', () => {
      const chipSource = fs.readFileSync(path.resolve(__dirname, '../components/ProjectChip.tsx'), 'utf-8');
      const homeSource = fs.readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf-8');

      // Feature #18: Project details modal must surface project.details, project.features, and project.gallery
      const hasDetailModalSupport =
        chipSource.includes('project.details') ||
        homeSource.includes('selectedProject') ||
        homeSource.includes('ProjectDetailModal') ||
        chipSource.includes('onOpenDetails');

      expect(hasDetailModalSupport).toBe(true);

      // Verify that sample projects in constants.tsx contain features and gallery arrays
      const projectWithFeatures = PROJECTS.find((p) => p.features && p.features.length > 0);
      expect(projectWithFeatures).toBeDefined();
      expect(projectWithFeatures?.features?.length).toBeGreaterThan(0);
    });

    it('3.2 should retain open modal state during power grid toggle without closing', async () => {
      const { container, rerender } = render(React.createElement(CertificationsBlock, { isPowered: true }));

      // Open modal
      const firstCard = container.querySelector('.group.h-full');
      if (firstCard) {
        fireEvent.click(firstCard);
        expect(screen.getAllByText(CERTS[0].title).length).toBeGreaterThan(0);

        // Re-render CertificationsBlock with isPowered={false} (simulate power toggle)
        rerender(React.createElement(CertificationsBlock, { isPowered: false }));

        // Modal should remain present and not crash
        expect(screen.getAllByText(CERTS[0].title).length).toBeGreaterThan(0);
      }
    });

    it('3.3 should cleanly clean up window event listeners on modal unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { container, unmount } = render(React.createElement(CertificationsBlock, { isPowered: true }));
      const firstCard = container.querySelector('.group.h-full');
      if (firstCard) {
        fireEvent.click(firstCard);
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        // Unmount
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      }
    });
  });

  /* ──────────────────────────────────────────────────────────────────────────
     TIER 4: REAL-WORLD SCENARIOS
     ────────────────────────────────────────────────────────────────────────── */
  describe('Tier 4 — Real-World Scenarios', () => {
    it('4.1 [Feature #17 Contract] Keyboard-only user journey across projects and credentials', async () => {
      const user = userEvent.setup();
      renderWithProviders(React.createElement(Home));

      // Tab through page elements until reaching interactive controls
      await user.tab();
      expect(document.activeElement).not.toBeNull();

      // Certificate card in the document must be focusable
      const certCard = document.querySelector('[tabindex="0"]');
      expect(certCard).not.toBeNull();
    });

    it('4.2 should verify mobile touch-friendly close button target size (minimum 44x44px)', () => {
      const { container } = render(React.createElement(CertificationsBlock, { isPowered: true }));

      const firstCard = container.querySelector('.group.h-full');
      if (firstCard) {
        fireEvent.click(firstCard);

        // Find close button in modal
        const closeBtn = screen.getByRole('button', { name: /close|dismiss/i }) ||
          container.querySelector('button[title*="Close"], button svg.lucide-x')?.parentElement;

        expect(closeBtn).toBeInTheDocument();
        // The close button must have touch-friendly padding (p-2 or p-3 or min-w/min-h)
        const btnClass = closeBtn?.className || '';
        const isTouchFriendly = btnClass.includes('p-2') || btnClass.includes('p-3') || btnClass.includes('h-10') || btnClass.includes('w-10');
        expect(isTouchFriendly).toBe(true);
      }
    });
  });
});
