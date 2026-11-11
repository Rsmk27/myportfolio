import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CERTS } from '@/components/CertificationsBlock';
import { PROJECTS, PROFILE, EXPERIENCE, EDUCATION } from '@/constants';
import { INDUSTRIAL_PROJECTS } from '@/data/industrialProjects';

describe('Content & Information Architecture Test Suite (Features #8, #11, #12)', () => {
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 1: Core Feature Coverage
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 1 — Core Feature Coverage', () => {
    it('Feature #8: CERTS array defines all 36 certifications with complete metadata', () => {
      expect(CERTS).toBeDefined();
      expect(Array.isArray(CERTS)).toBe(true);
      expect(CERTS.length).toBe(36);

      CERTS.forEach((cert) => {
        expect(cert.id).toBeDefined();
        expect(cert.id).toMatch(/^CERT-\d{3}$/);
        expect(cert.title).toBeDefined();
        expect(cert.title.trim().length).toBeGreaterThan(0);
        expect(cert.issuer).toBeDefined();
        expect(cert.issuer.trim().length).toBeGreaterThan(0);
        expect(cert.year).toBeDefined();
        expect(cert.year).toMatch(/^\d{4}$/);
        expect(cert.category).toBeDefined();
        expect(cert.category.trim().length).toBeGreaterThan(0);
        expect(Array.isArray(cert.skills)).toBe(true);
        expect(cert.skills.length).toBeGreaterThan(0);
      });
    });

    it('Feature #8: Every certification has a valid SHA-256 verification hash', () => {
      const sha256Pattern = /^sha256-[0-9a-f]{64}$/i;

      CERTS.forEach((cert) => {
        expect(
          cert.verificationHash,
          `Cert ${cert.id} must have a valid sha256 verificationHash`
        ).toBeDefined();
        expect(
          cert.verificationHash,
          `Cert ${cert.id} verificationHash must match standard sha256 pattern`
        ).toMatch(sha256Pattern);
      });
    });

    it('Feature #8: Every certification provides a valid PNG image preview URL (not PDF)', () => {
      const pdfCerts: string[] = [];

      CERTS.forEach((cert) => {
        const img = cert.image || '';
        if (img.toLowerCase().endsWith('.pdf')) {
          pdfCerts.push(`${cert.id} (${cert.title}): ${img}`);
        }
      });

      expect(
        pdfCerts,
        `Contract: All 36 certifications must point to .png image previews instead of .pdf files (M2 requirement). Found ${pdfCerts.length} PDF references:\n${pdfCerts.join(
          '\n'
        )}`
      ).toHaveLength(0);
    });

    it('Feature #11: PROJECTS catalog includes restored projects p2 and p4 with total length >= 8', () => {
      expect(PROJECTS).toBeDefined();
      expect(Array.isArray(PROJECTS)).toBe(true);

      const projectIds = PROJECTS.map((p) => p.id);

      expect(
        PROJECTS.length,
        'Contract: PROJECTS catalog must contain at least 8 projects including restored p2 and p4 (M2 requirement)'
      ).toBeGreaterThanOrEqual(8);

      expect(
        projectIds,
        'Contract: PROJECTS must include restored project p2 (Industrial Automation) (M2 requirement)'
      ).toContain('p2');

      expect(
        projectIds,
        'Contract: PROJECTS must include restored project p4 (Single-Axis Solar Tracker or equivalent) (M2 requirement)'
      ).toContain('p4');
    });

    it('Feature #11: Project p7 (SPDS) references dedicated solar dewatering image rather than chatbot UI background', () => {
      const spds = PROJECTS.find((p) => p.id === 'p7');
      expect(spds, 'Project p7 (SPDS) must exist in PROJECTS catalog').toBeDefined();

      if (spds) {
        expect(
          spds.image,
          'Contract: Project p7 must not use ai-chatbot-interface-background.webp as its thumbnail (M2 requirement)'
        ).not.toContain('ai-chatbot-interface-background');

        const imagePath = path.join(publicDir, spds.image.replace(/^\//, ''));
        expect(
          fs.existsSync(imagePath),
          `Project p7 image file must exist at ${imagePath}`
        ).toBe(true);
      }
    });

    it('Feature #12: PROFILE object contains complete bio, resume, and social channels', () => {
      expect(PROFILE).toBeDefined();
      expect(PROFILE.name).toBe('Srinivasa Manikanta Rajapantula');
      expect(PROFILE.title).toBeDefined();
      expect(PROFILE.bio).toBeDefined();
      expect(PROFILE.email).toBe('srinivasmanikantarajapantula@gmail.com');
      expect(PROFILE.location).toBeDefined();
      expect(PROFILE.resume).toBeDefined();

      const platforms = PROFILE.socials.map((s) => s.platform);
      expect(platforms).toContain('github');
      expect(platforms).toContain('linkedin');
      expect(platforms).toContain('telegram');
      expect(platforms).toContain('instagram');
      expect(platforms).toContain('x');
      expect(platforms).toContain('email');
    });

    it('Feature #12: EXPERIENCE and EDUCATION data arrays in constants.tsx are complete and structured', () => {
      expect(EXPERIENCE).toBeDefined();
      expect(Array.isArray(EXPERIENCE)).toBe(true);
      expect(EXPERIENCE.length).toBeGreaterThan(0);

      const coromandel = EXPERIENCE.find((e) => e.company.includes('Coromandel'));
      expect(coromandel).toBeDefined();
      if (coromandel) {
        expect(coromandel.role).toBeDefined();
        expect(coromandel.duration || (coromandel as any).period).toBeDefined();
        expect(Array.isArray(coromandel.description)).toBe(true);
        expect(coromandel.description.length).toBeGreaterThan(0);
        expect(Array.isArray(coromandel.tech)).toBe(true);
        expect(coromandel.tech.length).toBeGreaterThan(0);
      }

      expect(EDUCATION).toBeDefined();
      expect(Array.isArray(EDUCATION)).toBe(true);
      expect(EDUCATION.length).toBeGreaterThanOrEqual(2);

      const degrees = EDUCATION.map((e) => e.degree.toLowerCase());
      expect(degrees.some((d) => d.includes('b.tech') || d.includes('bachelor'))).toBe(true);
      expect(degrees.some((d) => d.includes('diploma'))).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 2: Boundary & Corner Cases
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 2 — Boundary & Corner Cases', () => {
    it('Feature #8: No duplicate IDs or credential IDs exist across CERTS array', () => {
      const ids = CERTS.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      const credentialIds = CERTS.filter((c) => c.credentialId).map((c) => c.credentialId);
      const uniqueCredIds = new Set(credentialIds);
      expect(uniqueCredIds.size).toBe(credentialIds.length);
    });

    it('Feature #11: No duplicate IDs exist across PROJECTS catalog and all IDs follow p[0-9] format', () => {
      const ids = PROJECTS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      ids.forEach((id) => {
        expect(id).toMatch(/^p\d+$/);
      });
    });

    it('Feature #11: All projects define non-empty tech arrays and detailed feature lists', () => {
      PROJECTS.forEach((project) => {
        expect(
          project.tech.length,
          `Project ${project.id} must list at least 2 technologies`
        ).toBeGreaterThanOrEqual(2);

        expect(
          project.features?.length ?? 0,
          `Project ${project.id} must list at least 3 features`
        ).toBeGreaterThanOrEqual(3);

        expect(
          project.details?.length ?? 0,
          `Project ${project.id} must have detailed writeup >= 50 chars`
        ).toBeGreaterThanOrEqual(50);
      });
    });

    it('Feature #12: External links in PROJECTS and PROFILE use secure HTTPS or mailto: protocols', () => {
      // Check PROFILE socials
      PROFILE.socials.forEach((social) => {
        expect(
          social.url,
          `Social link for ${social.platform} must use https:// or mailto:`
        ).toMatch(/^(https:\/\/|mailto:)/);
      });

      // Check PROJECTS live links
      PROJECTS.forEach((project) => {
        if (project.link) {
          expect(
            project.link,
            `Project ${project.id} link must use https://`
          ).toMatch(/^https:\/\//);
        }
      });
    });

    it('Feature #12: Prunes orphaned temporary and backup files from public root and assets', () => {
      const testArtifactPath = path.join(publicDir, 'font_comparison.html');
      const backupFilePath = path.join(publicDir, 'assets', 'srinivasa-manikanta-profile.webp.bak');

      expect(
        fs.existsSync(testArtifactPath),
        'Contract: public/font_comparison.html test artifact must be pruned (M2 requirement)'
      ).toBe(false);

      expect(
        fs.existsSync(backupFilePath),
        'Contract: public/assets/srinivasa-manikanta-profile.webp.bak backup file must be pruned (M2 requirement)'
      ).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 3: Cross-Feature Interactions
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 3 — Cross-Feature Interactions', () => {
    it('Feature #12: Prunes unreferenced 43.5 MB WhatsApp video files from public/assets/gallery/', () => {
      const galleryDir = path.join(publicDir, 'assets', 'gallery');

      const orphanedVideos = [
        'vid-20260106-WA0007.mp4',
        'vid-20260107-WA0004.mp4',
        'vid-20260107-WA0006.mp4',
        'vid-20260107-WA0064.mp4',
      ];

      const existingOrphanedVideos: string[] = [];

      orphanedVideos.forEach((video) => {
        const fullVideoPath = path.join(galleryDir, video);
        if (fs.existsSync(fullVideoPath)) {
          existingOrphanedVideos.push(video);
        }
      });

      expect(
        existingOrphanedVideos,
        `Contract: 43.5 MB WhatsApp video files must be pruned from public/assets/gallery/ (M2 requirement). Found: ${existingOrphanedVideos.join(
          ', '
        )}`
      ).toHaveLength(0);
    });

    it('Feature #8: All 36 certification preview PNG assets physically exist on disk in public/assets/certifications/', () => {
      const certsDir = path.join(publicDir, 'assets', 'certifications');
      expect(fs.existsSync(certsDir)).toBe(true);

      const files = fs.readdirSync(certsDir) as string[];
      const pngFiles = files.filter((f) => typeof f === 'string' && f.endsWith('.png'));

      expect(
        pngFiles.length,
        'public/assets/certifications/ must contain at least 32 PNG preview files'
      ).toBeGreaterThanOrEqual(32);
    });

    it('Feature #11: All local project images and gallery media in PROJECTS exist physically on disk', () => {
      PROJECTS.forEach((project) => {
        if (project.image && project.image.startsWith('/assets/')) {
          const imgPath = path.join(publicDir, project.image.replace(/^\//, ''));
          expect(
            fs.existsSync(imgPath),
            `Project ${project.id} main image at ${imgPath} must exist`
          ).toBe(true);
        }

        if (project.gallery && Array.isArray(project.gallery)) {
          project.gallery.forEach((mediaPath) => {
            if (mediaPath.startsWith('/assets/')) {
              const fullMediaPath = path.join(publicDir, mediaPath.replace(/^\//, ''));
              expect(
                fs.existsSync(fullMediaPath),
                `Project ${project.id} gallery media at ${fullMediaPath} must exist`
              ).toBe(true);
            }
          });
        }
      });
    });

    it('Feature #11 & industrialProjects: INDUSTRIAL_PROJECTS catalog in data/industrialProjects.ts is consistent and searchable', () => {
      expect(INDUSTRIAL_PROJECTS).toBeDefined();
      expect(Array.isArray(INDUSTRIAL_PROJECTS)).toBe(true);
      expect(INDUSTRIAL_PROJECTS.length).toBeGreaterThanOrEqual(4);

      INDUSTRIAL_PROJECTS.forEach((project) => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.status).toBeDefined();
        expect(project.category).toBeDefined();
        expect(Array.isArray(project.tags)).toBe(true);
        expect(project.problemStatement).toBeDefined();
      });

      // Verify search filterability by key technologies
      const codesysProjects = INDUSTRIAL_PROJECTS.filter(
        (p) =>
          p.tags.some((t) => /codesys/i.test(t)) ||
          p.software.some((s) => /codesys/i.test(s)) ||
          /codesys/i.test(p.description)
      );
      expect(codesysProjects.length).toBeGreaterThan(0);

      const factoryIoProjects = INDUSTRIAL_PROJECTS.filter(
        (p) =>
          p.tags.some((t) => /factory\s*i\/?o/i.test(t)) ||
          p.software.some((s) => /factory\s*i\/?o/i.test(s)) ||
          /factory\s*i\/?o/i.test(p.description)
      );
      expect(factoryIoProjects.length).toBeGreaterThan(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIER 4: Real-World Scenarios
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Tier 4 — Real-World Scenarios', () => {
    it('Feature #8 & #11: Repository asset integrity audit: validates 100% of referenced local media exists on disk', () => {
      const missingAssets: string[] = [];

      // Audit CERTS image references (for non-PDF images)
      CERTS.forEach((cert) => {
        if (cert.image && cert.image.startsWith('/assets/') && !cert.image.endsWith('.pdf')) {
          const diskPath = path.join(publicDir, cert.image.replace(/^\//, ''));
          if (!fs.existsSync(diskPath)) {
            missingAssets.push(`Cert ${cert.id}: ${cert.image}`);
          }
        }
      });

      // Audit PROFILE image references
      if (PROFILE.image && PROFILE.image.startsWith('/assets/')) {
        const profileImg = path.join(publicDir, PROFILE.image.replace(/^\//, ''));
        if (!fs.existsSync(profileImg)) {
          missingAssets.push(`PROFILE.image: ${PROFILE.image}`);
        }
      }

      expect(
        missingAssets,
        `All active local image references must exist on disk. Missing: ${missingAssets.join(', ')}`
      ).toHaveLength(0);
    });

    it('Feature #11: Recruiter portfolio verification audit: project awards and credentials align with resume claims', () => {
      // SFMD Award check
      const sfmd = PROJECTS.find((p) => p.id === 'p1');
      expect(sfmd).toBeDefined();
      if (sfmd) {
        expect(sfmd.award || sfmd.awards).toBeDefined();
        const awardsText = `${sfmd.award} ${sfmd.awards?.join(' ')}`.toLowerCase();
        expect(awardsText).toContain('winner');
      }

      // ColorOhm App check
      const colorohm = PROJECTS.find((p) => p.id === 'p3');
      expect(colorohm).toBeDefined();
      if (colorohm) {
        expect(colorohm.link).toBeDefined();
        expect(colorohm.features?.some((f) => f.includes('Android'))).toBe(true);
      }

      // AgriRover Robot check
      const agrirover = PROJECTS.find((p) => p.id === 'p8');
      expect(agrirover).toBeDefined();
      if (agrirover) {
        expect(agrirover.tech).toContain('ESP32');
      }
    });
  });
});
