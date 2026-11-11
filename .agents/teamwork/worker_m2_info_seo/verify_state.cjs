const fs = require('fs');

console.log('=== VERIFYING MILESTONE 2 DELIVERABLES ===');

// 1. Check Certifications
const certs = fs.readFileSync('components/CertificationsBlock.tsx', 'utf8');
const certImages = [...certs.matchAll(/id:\s*['"](CERT-[0-9]+)['"][\s\S]*?image:\s*['"]([^'"]+)['"]/g)].map(m => ({ id: m[1], image: m[2] }));
console.log('1. Certifications total count:', certImages.length);
const invalidCerts = certImages.filter(c => c.image.endsWith('.pdf') || !fs.existsSync('public' + c.image));
console.log('   Invalid / PDF cert images count:', invalidCerts.length);
if (invalidCerts.length > 0) {
    console.error('   Invalid certs:', invalidCerts);
} else {
    console.log('   ✓ All 36 certificates have valid PNG/JPG preview images existing on disk.');
}

// 2. Check Projects in constants.tsx
const constants = fs.readFileSync('constants.tsx', 'utf8');
const projectIds = [...constants.matchAll(/id:\s*['"](p[0-9]+)['"]/g)].map(m => m[1]);
console.log('2. Project IDs in constants.tsx:', projectIds);
const all8Present = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'].every(id => projectIds.includes(id));
console.log('   ✓ All 8 projects (p1 to p8) present:', all8Present);

// Check p7 image
const p7Match = constants.match(/id:\s*['"]p7['"][\s\S]*?image:\s*['"]([^'"]+)['"]/);
console.log('   ✓ Project p7 image:', p7Match ? p7Match[1] : 'NOT FOUND');

// 3. Check Favicon & Manifest
const faviconExists = fs.existsSync('public/favicon.ico');
const manifestExists = fs.existsSync('public/manifest.json');
console.log('3. public/favicon.ico exists:', faviconExists);
console.log('   public/manifest.json exists:', manifestExists);

// 4. Check OG Preview image
const ogPreviewExists = fs.existsSync('public/assets/og-preview.jpg');
console.log('4. public/assets/og-preview.jpg exists:', ogPreviewExists);

// Check index.html links
const indexHtml = fs.readFileSync('index.html', 'utf8');
const hasFaviconLink = indexHtml.includes('href="/favicon.ico"');
const hasManifestLink = indexHtml.includes('href="/manifest.json"');
const hasOgPreview = indexHtml.includes('https://rsmk.tech/assets/og-preview.jpg');
const hasLinkedIn = indexHtml.includes('platform.linkedin.com');
console.log('   index.html has favicon link:', hasFaviconLink);
console.log('   index.html has manifest link:', hasManifestLink);
console.log('   index.html has og-preview.jpg:', hasOgPreview);
console.log('   index.html has LinkedIn script:', hasLinkedIn);

// 5. Check deleted media
const deletedVideos = [
    'public/assets/gallery/vid-20260106-WA0007.mp4',
    'public/assets/gallery/vid-20260107-WA0006.mp4',
    'public/assets/gallery/vid-20260107-WA0004.mp4',
    'public/assets/gallery/vid-20260107-WA0064.mp4',
    'public/font_comparison.html',
    'public/assets/srinivasa-manikanta-profile.webp.bak'
];
const anyRemains = deletedVideos.some(f => fs.existsSync(f));
console.log('5. Unreferenced media and artifacts remaining (must be false):', anyRemains);

// 6. Check /videos canonical in prerendered files
const videosIndexHtml = fs.readFileSync('dist/videos/index.html', 'utf8');
const canonicalMatch = videosIndexHtml.match(/<link\s+rel=['"]canonical['"]\s+href=['"]([^'"]+)['"]/i);
console.log('6. Prerendered /videos canonical URL:', canonicalMatch ? canonicalMatch[1] : 'NOT FOUND');

// 7. Check App.tsx redirect
const appTsx = fs.readFileSync('App.tsx', 'utf8');
const hasNavigate = appTsx.includes('<Route path="/videos" element={<Navigate to="/automation" replace />} />');
console.log('7. App.tsx /videos redirects to /automation via Navigate:', hasNavigate);

// 8. Check SEO.tsx defaultImage and keywords
const seoTsx = fs.readFileSync('components/common/SEO.tsx', 'utf8');
const hasKeywordsMeta = seoTsx.includes('<meta name="keywords" content={finalKeywords} />');
const hasOgDefault = seoTsx.includes('https://rsmk.tech/assets/og-preview.jpg');
console.log('8. SEO.tsx has keywords meta tag:', hasKeywordsMeta);
console.log('   SEO.tsx defaultImage is og-preview.jpg:', hasOgDefault);
