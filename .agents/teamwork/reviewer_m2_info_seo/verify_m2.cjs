const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');

console.log('=== Milestone 2 Comprehensive Review Verification ===');

// 1. Certifications Visual Breakdown
console.log('\n--- 1. Certifications Visual Breakdown ---');
const certsFile = path.join(root, 'components/CertificationsBlock.tsx');
const certsContent = fs.readFileSync(certsFile, 'utf8');

// Find all image: '...' in CERTIFICATIONS
const imagePdfMatches = certsContent.match(/image:\s*['"][^'"]+\.pdf['"]/g);
console.log('image: ending in .pdf count:', imagePdfMatches ? imagePdfMatches.length : 0);
if (imagePdfMatches) {
  console.error('FAIL: Found .pdf in image field:', imagePdfMatches);
}

// Find all certificates defined in CERTIFICATIONS
const certIdMatches = certsContent.match(/id:\s*['"]CERT-\d+['"]/g);
console.log('Total CERT IDs:', certIdMatches ? certIdMatches.length : 0);

// Check all image and gallery paths referenced in CertificationsBlock
const imageMatches = [...certsContent.matchAll(/image:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total image paths found:', imageMatches.length);

let missingImages = 0;
for (const img of imageMatches) {
  if (img.startsWith('/')) {
    const fullPath = path.join(root, 'public', img.replace(/^\//, ''));
    if (!fs.existsSync(fullPath)) {
      console.error(`FAIL: Image path does not exist: ${fullPath} (ref: ${img})`);
      missingImages++;
    }
  }
}
console.log('Missing image files on disk:', missingImages);

// Check gallery references
const galleryMatches = [...certsContent.matchAll(/gallery:\s*\[([^\]]+)\]/g)];
console.log('Certificates with gallery arrays:', galleryMatches.length);
let missingGalleryFiles = 0;
let pdfInGalleryCount = 0;
for (const g of galleryMatches) {
  const items = [...g[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  for (const item of items) {
    if (item.endsWith('.pdf')) pdfInGalleryCount++;
    if (item.startsWith('/')) {
      const fullPath = path.join(root, 'public', item.replace(/^\//, ''));
      if (!fs.existsSync(fullPath)) {
        console.error(`FAIL: Gallery file does not exist: ${fullPath} (ref: ${item})`);
        missingGalleryFiles++;
      }
    }
  }
}
console.log('Gallery files missing on disk:', missingGalleryFiles);
console.log('PDFs preserved in gallery arrays:', pdfInGalleryCount);

// Check if GalleryModal allows PDF viewing/download
const hasPdfButton = certsContent.includes('FULL PDF') || certsContent.includes('.endsWith(\'.pdf\')') || certsContent.includes('.endsWith(".pdf")');
console.log('CertificationsBlock modal has PDF handling:', hasPdfButton);

// 2. Restored Projects
console.log('\n--- 2. Restored Projects ---');
const constantsFile = path.join(root, 'constants.tsx');
const constantsContent = fs.readFileSync(constantsFile, 'utf8');

const pMatches = [...constantsContent.matchAll(/id:\s*['"](p[1-8])['"]/g)].map(m => m[1]);
console.log('Project IDs found in constants.tsx:', pMatches);

// Check p2 details
const p2Match = constantsContent.match(/id:\s*['"]p2['"][\s\S]*?features:\s*\[([\s\S]*?)\][\s\S]*?tech:\s*\[([\s\S]*?)\]/);
if (p2Match) {
  const features = [...p2Match[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  const tech = [...p2Match[2].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`p2: features count=${features.length}, tech count=${tech.length}`);
} else {
  console.error('FAIL: Could not parse p2 details');
}

// Check p4 details
const p4Match = constantsContent.match(/id:\s*['"]p4['"][\s\S]*?features:\s*\[([\s\S]*?)\][\s\S]*?tech:\s*\[([\s\S]*?)\]/);
if (p4Match) {
  const features = [...p4Match[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  const tech = [...p4Match[2].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`p4: features count=${features.length}, tech count=${tech.length}`);
} else {
  console.error('FAIL: Could not parse p4 details');
}

// Check p7 image
const p7Match = constantsContent.match(/id:\s*['"]p7['"][\s\S]*?image:\s*['"]([^'"]+)['"]/);
console.log('p7 image reference:', p7Match ? p7Match[1] : 'NOT FOUND');
if (p7Match) {
  const p7ImgPath = path.join(root, 'public', p7Match[1].replace(/^\//, ''));
  console.log('p7 image exists on disk:', fs.existsSync(p7ImgPath));
  if (p7Match[1].includes('ai-chatbot-interface-background')) {
    console.error('FAIL: p7 still uses ai-chatbot-interface-background!');
  }
}

// 3. Favicon & Web Manifest
console.log('\n--- 3. Favicon & Web Manifest ---');
const faviconPath = path.join(root, 'public/favicon.ico');
const manifestPath = path.join(root, 'public/manifest.json');
const indexHtmlPath = path.join(root, 'index.html');
const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

console.log('public/favicon.ico exists:', fs.existsSync(faviconPath));
if (fs.existsSync(faviconPath)) {
  const icoStats = fs.statSync(faviconPath);
  console.log('favicon.ico size:', icoStats.size, 'bytes');
  const buf = fs.readFileSync(faviconPath);
  const reserved = buf.readUInt16LE(0);
  const type = buf.readUInt16LE(2);
  const count = buf.readUInt16LE(4);
  console.log(`ICO Header: reserved=${reserved}, type=${type} (1=icon), count=${count} images`);
}

console.log('public/manifest.json exists:', fs.existsSync(manifestPath));
if (fs.existsSync(manifestPath)) {
  try {
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('manifest.json is valid JSON. name:', manifestJson.name, 'icons count:', manifestJson.icons ? manifestJson.icons.length : 0);
  } catch (e) {
    console.error('FAIL: manifest.json is invalid JSON:', e.message);
  }
}

const hasManifestLink = indexContent.includes('<link rel="manifest" href="/manifest.json"');
console.log('index.html links to manifest.json:', hasManifestLink);

// 4. OpenGraph 1200x630 Banner & Meta
console.log('\n--- 4. OpenGraph 1200x630 Banner & Meta ---');
const ogPath = path.join(root, 'public/assets/og-preview.jpg');
console.log('public/assets/og-preview.jpg exists:', fs.existsSync(ogPath));
if (fs.existsSync(ogPath)) {
  const ogStats = fs.statSync(ogPath);
  console.log('og-preview.jpg size:', ogStats.size, 'bytes');
  const ogBuf = fs.readFileSync(ogPath);
  const isJpeg = ogBuf[0] === 0xFF && ogBuf[1] === 0xD8;
  console.log('og-preview.jpg has JPEG header 0xFFD8:', isJpeg);
  
  let offset = 2;
  let width = 0, height = 0;
  while (offset < ogBuf.length) {
    if (ogBuf[offset] !== 0xFF) break;
    const marker = ogBuf[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      height = ogBuf.readUInt16BE(offset + 5);
      width = ogBuf.readUInt16BE(offset + 7);
      break;
    }
    const len = ogBuf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  console.log(`og-preview.jpg dimensions: ${width}x${height}`);
}

const hasOgImage = indexContent.includes('content="https://rsmk.tech/assets/og-preview.jpg"');
const hasOgWidth = indexContent.includes('property="og:image:width" content="1200"');
const hasOgHeight = indexContent.includes('property="og:image:height" content="630"');
const hasOgType = indexContent.includes('property="og:image:type" content="image/jpeg"');
console.log('index.html has og:image og-preview.jpg:', hasOgImage);
console.log('index.html has og:image:width 1200:', hasOgWidth);
console.log('index.html has og:image:height 630:', hasOgHeight);
console.log('index.html has og:image:type image/jpeg:', hasOgType);

const seoFile = path.join(root, 'components/common/SEO.tsx');
const seoContent = fs.readFileSync(seoFile, 'utf8');
const seoHasKeywords = seoContent.includes('name="keywords"') && seoContent.includes('content={finalKeywords}');
console.log('SEO.tsx renders meta keywords:', seoHasKeywords);

// 5. Clean Assets & Deleted Media
console.log('\n--- 5. Clean Assets & Deleted Media ---');
const galleryDir = path.join(root, 'public/assets/gallery');
const galleryFiles = fs.existsSync(galleryDir) ? fs.readdirSync(galleryDir) : [];
const whatsappVideos = galleryFiles.filter(f => /vid-2026010.*\.mp4/i.test(f) || f.endsWith('.mp4'));
console.log('MP4 files in public/assets/gallery:', whatsappVideos);

const fontCompPath = path.join(root, 'public/font_comparison.html');
console.log('public/font_comparison.html exists:', fs.existsSync(fontCompPath));

function findBakFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results = results.concat(findBakFiles(full));
    } else if (ent.name.endsWith('.bak')) {
      results.push(full);
    }
  }
  return results;
}
const bakFiles = findBakFiles(path.join(root, 'public'));
console.log('.bak files in public/:', bakFiles);

// 6. Canonicalization
console.log('\n--- 6. Canonicalization ---');
const appFile = path.join(root, 'App.tsx');
const appContent = fs.readFileSync(appFile, 'utf8');
const appHasRedirect = appContent.includes('path="/videos"') && (appContent.includes('Navigate to="/automation"') || appContent.includes('Navigate to=\'/automation\''));
console.log('App.tsx redirects /videos to /automation:', appHasRedirect);

const distVideosIndex = path.join(root, 'dist/videos/index.html');
if (fs.existsSync(distVideosIndex)) {
  const vIndexContent = fs.readFileSync(distVideosIndex, 'utf8');
  const canonicalMatch = vIndexContent.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  console.log('dist/videos/index.html canonical link:', canonicalMatch ? canonicalMatch[1] : 'NONE');
} else {
  console.log('dist/videos/index.html not generated');
}

const distVideosHtml = path.join(root, 'dist/videos.html');
if (fs.existsSync(distVideosHtml)) {
  const vHtmlContent = fs.readFileSync(distVideosHtml, 'utf8');
  const canonicalMatch = vHtmlContent.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  console.log('dist/videos.html canonical link:', canonicalMatch ? canonicalMatch[1] : 'NONE');
}

// 7. LinkedIn Script
console.log('\n--- 7. LinkedIn Script ---');
const hasLinkedInScript = indexContent.includes('platform.linkedin.com/badges/js/profile.js');
console.log('index.html contains dead LinkedIn script:', hasLinkedInScript);
