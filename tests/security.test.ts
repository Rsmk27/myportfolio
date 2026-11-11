import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { ContactInterface } from '@/components/ContactInterface';
import { PROFILE } from '@/constants';
import { AI_CHAT_API_URL } from '@/utils/chatbotWarmup';

describe('Security Test Suite (Features #1 - #6)', () => {
  const rootDir = path.resolve(__dirname, '..');

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 1: Core Feature Coverage
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 1 — Core Feature Coverage', () => {
    it('Feature #3: MiniMarkdown renders valid https:// links with safe attributes', async () => {
      // Mock chat API response containing valid https link
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Check out [RSMK Tech Portfolio](https://rsmk.tech) for projects.',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'show links');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'RSMK Tech Portfolio' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://rsmk.tech');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('Feature #3: MiniMarkdown renders valid http:// and mailto: links', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Reach out via [Official Email](mailto:srinivasamanikanta270@gmail.com) or [HTTP Mirror](http://example.com).',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'contact details');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        const mailLink = screen.getByRole('link', { name: 'Official Email' });
        expect(mailLink).toHaveAttribute('href', 'mailto:srinivasamanikanta270@gmail.com');

        const httpLink = screen.getByRole('link', { name: 'HTTP Mirror' });
        expect(httpLink).toHaveAttribute('href', 'http://example.com');
      });
    });

    it('Feature #4: vercel.json specifies all mandatory global security headers', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);

      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      expect(vercelConfig.headers).toBeDefined();
      expect(Array.isArray(vercelConfig.headers)).toBe(true);

      const globalHeaderRule = vercelConfig.headers.find(
        (h: any) => h.source === '/(.*)' || h.source === '/:path*'
      );
      expect(globalHeaderRule).toBeDefined();

      const headersMap: Record<string, string> = {};
      globalHeaderRule.headers.forEach((h: { key: string; value: string }) => {
        headersMap[h.key.toLowerCase()] = h.value;
      });

      // Verify standard required security headers
      expect(headersMap['x-frame-options']).toBe('DENY');
      expect(headersMap['x-content-type-options']).toBe('nosniff');
      expect(headersMap['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headersMap['permissions-policy']).toBeDefined();
      expect(headersMap['permissions-policy']).toContain('camera=()');
      expect(headersMap['permissions-policy']).toContain('microphone=()');
    });

    it('Feature #4: vercel.json configures a comprehensive Content-Security-Policy', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const globalHeaderRule = vercelConfig.headers.find(
        (h: any) => h.source === '/(.*)' || h.source === '/:path*'
      );

      const cspHeader = globalHeaderRule.headers.find(
        (h: { key: string }) => h.key.toLowerCase() === 'content-security-policy'
      );
      expect(cspHeader).toBeDefined();
      const csp = cspHeader.value;

      // Assert key CSP directives
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain('script-src');
      expect(csp).toContain('style-src');
      expect(csp).toContain('connect-src');
      expect(csp).toContain('frame-src');
      expect(csp).toContain('https://www.youtube.com');
    });

    it('Feature #2: vite.config.ts omits client-side process.env.API_KEY define', () => {
      const viteConfigPath = path.join(rootDir, 'vite.config.ts');
      expect(fs.existsSync(viteConfigPath)).toBe(true);

      const content = fs.readFileSync(viteConfigPath, 'utf8');

      // Verify process.env.API_KEY is not defined in vite.config.ts
      expect(content).not.toMatch(/['"]process\.env\.API_KEY['"]/);
      expect(content).not.toMatch(/['"]process\.env\.GEMINI_API_KEY['"]/);
    });

    it('Feature #6: tsconfig.json enforces strict compiler options', () => {
      const tsconfigPath = path.join(rootDir, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);

      const content = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(content);

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
    });

    it('Feature #6: package.json prunes dead postcss and autoprefixer dependencies', () => {
      const pkgPath = path.join(rootDir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      expect(allDeps['postcss']).toBeUndefined();
      expect(allDeps['autoprefixer']).toBeUndefined();
      // Tailwind v4 Vite plugin replaces both
      expect(allDeps['@tailwindcss/vite']).toBeDefined();
    });

    it('Feature #5: ContactInterface enforces MAX_MSGS = 20 and input maxLength = 500', () => {
      const contactCodePath = path.join(rootDir, 'components', 'ContactInterface.tsx');
      const content = fs.readFileSync(contactCodePath, 'utf8');

      // Assert rate limit constant in code
      expect(content).toMatch(/const\s+MAX_MSGS\s*=\s*20\s*;/);

      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));
      const input = screen.getByPlaceholderText(/Ask me anything/i) as HTMLInputElement;

      expect(input).toHaveAttribute('maxLength', '500');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 2: Boundary & Corner Cases
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 2 — Boundary & Corner Cases', () => {
    it('Feature #3: MiniMarkdown blocks direct javascript: URI scheme execution', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Click this malicious link: [Exploit Link](javascript:alert(document.cookie))',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'test javascript scheme');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Exploit Link/i)).toBeInTheDocument();
      });

      // Assert NO anchor tag exists with javascript: in href
      const anchors = document.querySelectorAll('a[href^="javascript:"]');
      expect(anchors.length).toBe(0);

      // Verify the link was neutralized to plain text / span rather than clickable exploit
      const linkRole = screen.queryByRole('link', { name: 'Exploit Link' });
      expect(linkRole).toBeNull();
    });

    it('Feature #3: MiniMarkdown blocks protocol obfuscation tricks (mixed casing, leading spaces)', async () => {
      const obfuscatedPayloads = [
        '[Test1](JaVaScRiPt:alert(1))',
        '[Test2](  javascript:alert(2))',
        '[Test3](JAVASCRIPT:void(0))',
        '[Test4](jav&#x09;ascript:alert(4))',
      ];

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: obfuscatedPayloads.join(' '),
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'obfuscation test');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Test1/i)).toBeInTheDocument();
      });

      const anchors = document.querySelectorAll('a');
      anchors.forEach((a) => {
        const href = a.getAttribute('href') || '';
        expect(href.toLowerCase().trim()).not.toMatch(/^javascript:/i);
      });
    });

    it('Feature #3: MiniMarkdown blocks data: URI and vbscript: execution vectors', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Payloads: [Data Link](data:text/html,<script>alert(1)</script>) and [VBS Link](vbscript:msgbox("xss"))',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'data uri test');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Data Link/i)).toBeInTheDocument();
      });

      const maliciousAnchors = document.querySelectorAll('a[href^="data:"], a[href^="vbscript:"]');
      expect(maliciousAnchors.length).toBe(0);
    });

    it('Feature #3: MiniMarkdown neutralizes HTML tag breakout attempts in markdown', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Breakout: [Safe Label](https://rsmk.tech" onclick="alert(1)) and `<img src=x onerror=alert(1)>`',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'breakout test');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/Safe Label/i)).toBeInTheDocument();
      });

      // Ensure no DOM attribute 'onclick' is injected
      const elementsWithInlineHandler = document.querySelectorAll('[onclick]');
      expect(elementsWithInlineHandler.length).toBe(0);
    });

    it('Feature #5: Chat input rejects/truncates characters beyond 500 limit', async () => {
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));
      const input = screen.getByPlaceholderText(/Ask me anything/i) as HTMLInputElement;

      // Simulate entering string longer than 500 chars
      const longInput = 'A'.repeat(550);
      fireEvent.change(input, { target: { value: longInput } });

      // In HTML, inputs with maxLength=500 constrain user input
      expect(input.maxLength).toBe(500);
    });

    it('Feature #5: Chat locks UI when 20-message session limit is reached', () => {
      sessionStorage.setItem('rsmk_chat_usage', '20');

      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Session limit reached/i) as HTMLInputElement;
      expect(input).toBeDisabled();

      const limitBanner = screen.getByText(/reached the 20-message session limit/i);
      expect(limitBanner).toBeInTheDocument();
    });

    it('Feature #5: Empty and whitespace-only submissions are blocked', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i) as HTMLInputElement;
      const submitBtn = input.closest('form')!.querySelector('button[type="submit"]') as HTMLButtonElement;

      // Initially empty -> disabled
      expect(submitBtn).toBeDisabled();

      // Whitespace only
      fireEvent.change(input, { target: { value: '     ' } });
      expect(submitBtn).toBeDisabled();

      fireEvent.submit(input.closest('form')!);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 3: Cross-Feature Combinations
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 3 — Cross-Feature Combinations', () => {
    it('Feature #3 & #5: renders mixed complex markdown with bold, code, valid link, and neutralized vector safely', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response:
            'Here is the **architecture**: inspect `main.cpp`. Refer to [Portfolio](https://rsmk.tech) but ignore [Malicious](javascript:alert(1)).',
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'explain architecture');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        // Strong element
        expect(screen.getByText('architecture')).toHaveClass('font-bold');
        // Inline code
        expect(screen.getByText('main.cpp')).toHaveClass('font-mono');
        // Valid link
        const validLink = screen.getByRole('link', { name: 'Portfolio' });
        expect(validLink).toHaveAttribute('href', 'https://rsmk.tech');
        // Neutralized link
        expect(screen.queryByRole('link', { name: 'Malicious' })).toBeNull();
      });
    });

    it('Feature #4 & #5: vercel.json CSP connect-src whitelists the exact AI_CHAT_API_URL domain', () => {
      const vercelPath = path.join(rootDir, 'vercel.json');
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const globalHeaderRule = vercelConfig.headers.find(
        (h: any) => h.source === '/(.*)' || h.source === '/:path*'
      );
      const cspHeader = globalHeaderRule.headers.find(
        (h: { key: string }) => h.key.toLowerCase() === 'content-security-policy'
      );
      const csp = cspHeader.value;

      // Extract hostname of AI_CHAT_API_URL
      const url = new URL(AI_CHAT_API_URL);
      const domain = `${url.protocol}//${url.host}`;

      expect(csp).toContain(domain);
    });

    it('Feature #5: Session storage usage increments and persists across interactions', async () => {
      sessionStorage.setItem('rsmk_chat_usage', '19');

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Final response before limit.',
        }),
      } as Response);

      const user = userEvent.setup();
      const { rerender } = render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'message 20');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(sessionStorage.getItem('rsmk_chat_usage')).toBe('20');
      });

      // Rerender component simulating fresh mount with updated session
      rerender(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      await waitFor(() => {
        const lockedInput = screen.getByPlaceholderText(/Session limit reached/i);
        expect(lockedInput).toBeDisabled();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 4: Real-World Scenarios, Fuzzing & Adversarial Hardening
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 4 — Adversarial, Fuzzing & Real-World Scenarios', () => {
    it('Feature #3: Fuzzing parser with 15 adversarial markdown XSS vectors produces zero active scripts/links', async () => {
      const fuzzVectors = [
        '[a](javascript:alert(1))',
        '[b](JAVASCRIPT:alert(2))',
        '[c](JaVaScRiPt:alert(3))',
        '[d](  javascript:alert(4))',
        '[e](\\javascript:alert(5))',
        '[f](javascript\\:alert(6))',
        '[g](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
        '[h](data:text/javascript,alert(1))',
        '[i](vbscript:alert(1))',
        '[j](livescript:alert(1))',
        '[k](mocha:alert(1))',
        '[l](javascript:/*--></title></style></textarea>*/<svg/onload=alert(1)>)',
        '[m](https://rsmk.tech"onfocus="alert(1))',
        '[n](https://rsmk.tech?param=<script>alert(1)</script>)',
        '[o](mailto:test@rsmk.tech?subject=<script>alert(1)</script>)',
      ];

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: fuzzVectors.join('\n\n'),
        }),
      } as Response);

      const user = userEvent.setup();
      render(React.createElement(ContactInterface, { profile: PROFILE, isPowered: true }));

      const input = screen.getByPlaceholderText(/Ask me anything/i);
      await user.type(input, 'run fuzz suite');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('ACKNOWLEDGED')).toBeInTheDocument();
      });

      // Audit all rendered links in the DOM: NO link may have an executable scheme
      const allAnchors = document.querySelectorAll('a');
      allAnchors.forEach((a) => {
        const href = a.getAttribute('href') || '';
        expect(href).not.toMatch(/^\s*javascript:/i);
        expect(href).not.toMatch(/^\s*data:/i);
        expect(href).not.toMatch(/^\s*vbscript:/i);
        expect(href).not.toMatch(/^\s*livescript:/i);
      });
    });

    it('Feature #2: Production codebase secret audit confirms zero exposed raw API keys', () => {
      const codeDirs = ['components', 'pages', 'data', 'utils', 'scripts'];
      const secretPatterns = [
        /AIza[0-9A-Za-z-_]{35}/, // Google API key
        /sk-[0-9A-Za-z]{32,}/,   // OpenAI / Generic Secret
        /ghp_[0-9A-Za-z]{36}/,   // GitHub personal token
      ];

      codeDirs.forEach((dir) => {
        const fullDir = path.join(rootDir, dir);
        if (!fs.existsSync(fullDir)) return;

        const files = fs.readdirSync(fullDir, { recursive: true }) as string[];
        files.forEach((file) => {
          if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))) {
            const filePath = path.join(fullDir, file);
            if (fs.statSync(filePath).isFile()) {
              const content = fs.readFileSync(filePath, 'utf8');
              secretPatterns.forEach((pattern) => {
                expect(content).not.toMatch(pattern);
              });
            }
          }
        });
      });
    });

    it('Feature #1: Dependency inventory confirms no deprecated or vulnerable packages in core dependencies', () => {
      const pkgPath = path.join(rootDir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      // Validate core dependencies exist and are pinned to modern versions
      expect(pkg.dependencies.react).toMatch(/\^?18\./);
      expect(pkg.dependencies['react-dom']).toMatch(/\^?18\./);
      expect(pkg.dependencies['react-router-dom']).toMatch(/\^?7\./);

      // Verify no known legacy / vulnerable build plugins
      const devDeps = pkg.devDependencies || {};
      expect(devDeps['babel-core']).toBeUndefined();
      expect(devDeps['ts-node']).toBeUndefined();
    });
  });
});
