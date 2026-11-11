import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import fs from 'fs';
import path from 'path';
import { SEO } from '@/components/common/SEO';
import { PROFILE } from '@/constants';

describe('SEO & Metadata Test Suite (Features #7, #9, #10, #13)', () => {
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');

  const renderSEO = (props = {}) => {
    HelmetProvider.canUseDOM = false;
    const helmetContext: any = {};
    render(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(SEO, props)
      )
    );
    return helmetContext;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 1: Core Feature Coverage
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 1 — Core Feature Coverage', () => {
    it('Feature #10: public/favicon.ico exists on disk and is non-empty', () => {
      const faviconPath = path.join(publicDir, 'favicon.ico');
      const exists = fs.existsSync(faviconPath);
      expect(exists, 'Contract: public/favicon.ico must exist on disk (M2 requirement)').toBe(true);
      if (exists) {
        const stats = fs.statSync(faviconPath);
        expect(stats.size).toBeGreaterThan(0);
      }
    });

    it('Feature #10: public/manifest.json exists and defines valid PWA manifest fields', () => {
      const manifestPath = path.join(publicDir, 'manifest.json');
      const exists = fs.existsSync(manifestPath);
      expect(exists, 'Contract: public/manifest.json must exist on disk (M2 requirement)').toBe(true);

      if (exists) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        expect(manifest.name).toBeDefined();
        expect(manifest.short_name).toBeDefined();
        expect(manifest.start_url).toBeDefined();
        expect(manifest.display).toBe('standalone');
        expect(manifest.theme_color || manifest.background_color).toBeDefined();
        expect(Array.isArray(manifest.icons)).toBe(true);
        expect(manifest.icons.length).toBeGreaterThan(0);
      }
    });

    it('Feature #10: index.html links to favicon.ico and manifest.json', () => {
      const indexPath = path.join(rootDir, 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);

      const html = fs.readFileSync(indexPath, 'utf8');
      expect(html).toMatch(/<link\s+[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["'][^"']*favicon\.ico["']/i);
      expect(html).toMatch(/<link\s+[^>]*rel=["']manifest["'][^>]*href=["']\/manifest\.json["']/i);
    });

    it('Feature #13: SEO component renders primary title and description tags', () => {
      const context = renderSEO({
        title: 'Automation & Robotics Projects',
        description: 'Explore PLC, CODESYS, and Embedded systems projects by RSMK.',
      });

      const titleOutput = context.helmet.title.toString();
      const metaOutput = context.helmet.meta.toString();

      expect(titleOutput).toMatch(/Automation (&amp;|&) Robotics Projects/);
      expect(titleOutput).toContain(PROFILE.name);
      expect(metaOutput).toContain('Explore PLC, CODESYS, and Embedded systems projects by RSMK.');
    });

    it('Feature #13: SEO component renders meta keywords tag', () => {
      const customKeywords = 'PLC, SCADA, CODESYS, Factory IO, ESP32';
      const context = renderSEO({
        keywords: customKeywords,
      });

      const metaOutput = context.helmet.meta.toString();
      expect(
        metaOutput,
        'Contract: SEO component must output <meta name="keywords" content="..."> (M2 requirement)'
      ).toContain(`name="keywords" content="${customKeywords}"`);
    });

    it('Feature #13: SEO component renders canonical link pointing to full canonical URL', () => {
      const context = renderSEO({
        url: '/automation',
      });

      const linkOutput = context.helmet.link.toString();
      expect(linkOutput).toContain('rel="canonical"');
      expect(linkOutput).toContain('href="https://rsmk.tech/automation"');
    });

    it('Feature #9: SEO component defines OpenGraph 1200x630 dimensions and standard og properties', () => {
      const context = renderSEO({
        title: 'Hardware Portfolio',
        description: 'Custom hardware systems.',
      });

      const metaOutput = context.helmet.meta.toString();

      expect(metaOutput).toContain('property="og:type" content="website"');
      expect(metaOutput).toContain('property="og:image:width" content="1200"');
      expect(metaOutput).toContain('property="og:image:height" content="630"');
      expect(metaOutput).toContain('property="og:site_name"');
      expect(metaOutput).toContain('property="og:title"');
      expect(metaOutput).toContain('property="og:description"');
      expect(metaOutput).toContain('property="og:image"');
    });

    it('Feature #13: public/robots.txt allows indexing and references sitemap.xml', () => {
      const robotsPath = path.join(publicDir, 'robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);

      const content = fs.readFileSync(robotsPath, 'utf8');
      expect(content).toMatch(/User-agent:\s*\*/i);
      expect(content).toMatch(/Allow:\s*\//i);
      expect(content).toMatch(/Sitemap:\s*https:\/\/rsmk\.tech\/sitemap\.xml/i);
    });

    it('Feature #13: public/sitemap.xml defines canonical routes and valid XML schema', () => {
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);

      const content = fs.readFileSync(sitemapPath, 'utf8');
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<loc>https://rsmk.tech/</loc>');
      expect(content).toContain('<loc>https://rsmk.tech/gallery</loc>');
      expect(content).toContain('<loc>https://rsmk.tech/automation</loc>');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 2: Boundary & Corner Cases
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 2 — Boundary & Corner Cases', () => {
    it('Feature #7: JSON-LD schema escapes < and </script> tags with \\u003c to prevent script breakout', () => {
      const adversarialSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: "</script><script>alert('xss')</script>",
        description: 'Test <tag> breakout',
      };

      const context = renderSEO({ schema: adversarialSchema });
      const scriptOutput = context.helmet.script.toString();

      // Script content must NOT contain literal unescaped </script> inside JSON body
      // Raw "</script><script>" would cause HTML parser breakout
      expect(scriptOutput).not.toContain('</script><script>');
      // Verify < was substituted with unicode escape \u003c
      expect(scriptOutput).toContain('\\u003c/script>');
      expect(scriptOutput).toContain('\\u003cscript>');
      expect(scriptOutput).toContain('\\u003ctag>');
    });

    it('Feature #13: Canonical URL normalizes relative paths, leading slashes, and absolute URLs', () => {
      // 1. Relative path without slash
      const ctx1 = renderSEO({ url: 'automation' });
      expect(ctx1.helmet.link.toString()).toContain('href="https://rsmk.tech/automation"');

      // 2. Path with leading slash
      const ctx2 = renderSEO({ url: '/automation' });
      expect(ctx2.helmet.link.toString()).toContain('href="https://rsmk.tech/automation"');

      // 3. Full absolute URL
      const ctx3 = renderSEO({ url: 'https://rsmk.tech/automation' });
      expect(ctx3.helmet.link.toString()).toContain('href="https://rsmk.tech/automation"');

      // 4. Root / empty defaults to siteUrl
      const ctx4 = renderSEO();
      expect(ctx4.helmet.link.toString()).toContain('href="https://rsmk.tech"');
    });

    it('Feature #13: noindex prop outputs noindex, nofollow robots directive', () => {
      const normalContext = renderSEO({ noindex: false });
      expect(normalContext.helmet.meta.toString()).toContain('content="index, follow');

      const noindexContext = renderSEO({ noindex: true });
      expect(noindexContext.helmet.meta.toString()).toContain('content="noindex, nofollow"');
    });

    it('Feature #9: OpenGraph image MIME type dynamically adapts to PNG, JPG, and WebP file extensions', () => {
      const pngContext = renderSEO({ image: 'https://rsmk.tech/assets/banner.png' });
      expect(pngContext.helmet.meta.toString()).toContain('property="og:image:type" content="image/png"');

      const jpgContext = renderSEO({ image: 'https://rsmk.tech/assets/banner.jpg' });
      expect(jpgContext.helmet.meta.toString()).toContain('property="og:image:type" content="image/jpeg"');

      const jpegContext = renderSEO({ image: 'https://rsmk.tech/assets/banner.jpeg' });
      expect(jpegContext.helmet.meta.toString()).toContain('property="og:image:type" content="image/jpeg"');

      const webpContext = renderSEO({ image: 'https://rsmk.tech/assets/banner.webp' });
      expect(webpContext.helmet.meta.toString()).toContain('property="og:image:type" content="image/webp"');
    });

    it('Feature #9: detects masqueraded WebP files in public/assets (must have genuine RIFF...WEBP magic bytes)', () => {
      const assetsDir = path.join(publicDir, 'assets');
      if (!fs.existsSync(assetsDir)) return;

      const webpFiles = fs
        .readdirSync(assetsDir)
        .filter((file) => typeof file === 'string' && file.endsWith('.webp'));

      const masqueradedFiles: string[] = [];

      webpFiles.forEach((file) => {
        const filePath = path.join(assetsDir, file);
        const buffer = Buffer.alloc(12);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 12, 0);
        fs.closeSync(fd);

        const riffHeader = buffer.toString('ascii', 0, 4);
        const webpFormat = buffer.toString('ascii', 8, 12);

        // A genuine WebP file starts with 'RIFF' at bytes 0-3 and 'WEBP' at bytes 8-11
        const isGenuineWebP = riffHeader === 'RIFF' && webpFormat === 'WEBP';
        if (!isGenuineWebP) {
          masqueradedFiles.push(file);
        }
      });

      expect(
        masqueradedFiles,
        `Contract: All .webp files in public/assets must be genuine WebP binaries, not masqueraded PNG/JPEG (M2 requirement). Masqueraded: ${masqueradedFiles.join(
          ', '
        )}`
      ).toHaveLength(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 3: Cross-Feature Interactions
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 3 — Cross-Feature Interactions', () => {
    it('Feature #13: scripts/prerender.js canonicalizes /videos route to https://rsmk.tech/automation', () => {
      const prerenderPath = path.join(rootDir, 'scripts', 'prerender.js');
      expect(fs.existsSync(prerenderPath)).toBe(true);

      const content = fs.readFileSync(prerenderPath, 'utf8');

      // The prerender configuration for 'videos' must specify the canonical URL as '/automation'
      const videosRouteConfigMatch = content.match(
        /{\s*dir:\s*['"]videos['"]\s*,\s*config:\s*{\s*\.\.\.automationRoute\s*,\s*url:\s*['"]([^'"]+)['"]/
      );

      expect(
        videosRouteConfigMatch,
        'prerender.js must define a routes entry for dir: "videos"'
      ).not.toBeNull();

      if (videosRouteConfigMatch) {
        const canonicalUrl = videosRouteConfigMatch[1];
        expect(
          canonicalUrl,
          'Contract: /videos route must canonicalize to https://rsmk.tech/automation (M2 requirement)'
        ).toBe('https://rsmk.tech/automation');
      }
    });

    it('Feature #9: OpenGraph card image referenced in SEO default exists physically on disk in public/', () => {
      const seoPath = path.join(rootDir, 'components', 'common', 'SEO.tsx');
      const content = fs.readFileSync(seoPath, 'utf8');

      const match = content.match(/const\s+defaultImage\s*=\s*["']https:\/\/rsmk\.tech(\/assets\/[^"']+)["']/);
      expect(match).not.toBeNull();

      if (match) {
        const relativeAssetPath = match[1];
        const fullDiskPath = path.join(publicDir, relativeAssetPath);
        expect(
          fs.existsSync(fullDiskPath),
          `Default OpenGraph image must exist at ${fullDiskPath}`
        ).toBe(true);
      }
    });

    it('Feature #7 & #13: JSON-LD schema includes verified Profile and WebSite metadata', () => {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${PROFILE.name} Portfolio`,
        url: 'https://rsmk.tech',
      };

      const context = renderSEO({ schema: websiteSchema });
      const scriptOutput = context.helmet.script.toString();

      expect(scriptOutput).toContain('application/ld+json');
      expect(scriptOutput).toContain('https://schema.org');
      expect(scriptOutput).toContain('WebSite');
      expect(scriptOutput).toContain(PROFILE.name);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 4: Real-World Scenarios
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 4 — Real-World Scenarios', () => {
    it('Feature #13: Search engine crawler simulation: validates 10 essential meta tags in index.html', () => {
      const indexPath = path.join(rootDir, 'index.html');
      const html = fs.readFileSync(indexPath, 'utf8');

      // Validate core tags expected by search engine crawlers in static HTML head
      expect(html).toMatch(/<title>[^<]+<\/title>/i);
      expect(html).toMatch(/<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i);
      expect(html).toMatch(/<meta\s+[^>]*name=["']viewport["']/i);
      expect(html).toMatch(/<meta\s+[^>]*charset=/i);
      expect(html).toMatch(/<meta\s+[^>]*property=["']og:title["']/i);
      expect(html).toMatch(/<meta\s+[^>]*property=["']og:description["']/i);
      expect(html).toMatch(/<meta\s+[^>]*property=["']og:image["']/i);
      expect(html).toMatch(/<meta\s+[^>]*property=["']og:url["']/i);
      expect(html).toMatch(/<meta\s+[^>]*name=["']twitter:card["']/i);
      expect(html).toMatch(/<link\s+[^>]*rel=["']canonical["']/i);
    });

    it('Feature #10: PWA Manifest icon validation confirms assets exist when manifest is present', () => {
      const manifestPath = path.join(publicDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        // Contract pending M2
        expect(fs.existsSync(manifestPath), 'manifest.json awaits M2 creation').toBe(false);
        return;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.icons.forEach((icon: { src: string; sizes: string; type?: string }) => {
        const iconPath = path.join(publicDir, icon.src.replace(/^\//, ''));
        expect(fs.existsSync(iconPath), `Icon asset ${icon.src} must exist on disk`).toBe(true);
      });
    });

    it('Feature #13: XML Sitemap URLs all use valid HTTPS canonical format', () => {
      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      const content = fs.readFileSync(sitemapPath, 'utf8');

      const locMatches = content.match(/<loc>(https:\/\/[^<]+)<\/loc>/g) || [];
      expect(locMatches.length).toBeGreaterThan(0);

      locMatches.forEach((locTag) => {
        const url = locTag.replace(/<\/?loc>/g, '');
        expect(url.startsWith('https://rsmk.tech')).toBe(true);
        expect(url).not.toContain('localhost');
        expect(url).not.toContain('http://');
      });
    });
  });
});
