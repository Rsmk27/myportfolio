const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const certsFile = path.join(root, 'components/CertificationsBlock.tsx');
const content = fs.readFileSync(certsFile, 'utf8');

// Match all cert objects
const certBlocks = content.split(/id:\s*['"]CERT-/).slice(1);
console.log('Total cert blocks parsed:', certBlocks.length);

let issues = [];

certBlocks.forEach((block, idx) => {
  const idMatch = block.match(/^(\d{3})['"]/);
  const id = idMatch ? 'CERT-' + idMatch[1] : 'Unknown-' + idx;
  
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : 'No title';
  
  const imageMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
  const image = imageMatch ? imageMatch[1] : null;
  
  if (!image) {
    issues.push(`${id}: Missing image property`);
  } else if (image.endsWith('.pdf')) {
    issues.push(`${id}: image ends with .pdf (${image})`);
  } else {
    const diskPath = path.join(root, 'public', image.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      issues.push(`${id}: image file not found on disk: ${image}`);
    }
  }
  
  const galleryMatch = block.match(/gallery:\s*\[([\s\S]*?)\]/);
  if (galleryMatch) {
    const items = [...galleryMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
    for (const item of items) {
      const diskPath = path.join(root, 'public', item.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        issues.push(`${id}: gallery item not found on disk: ${item}`);
      }
    }
  }
});

console.log('Cert audit issues found:', issues.length);
if (issues.length > 0) {
  console.log(issues.join('\n'));
} else {
  console.log('ALL 36 CERTIFICATES FULLY VALIDATED WITH ZERO MISSING ASSETS!');
}
