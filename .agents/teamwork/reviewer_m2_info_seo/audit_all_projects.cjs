const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const constantsFile = path.join(root, 'constants.tsx');
const content = fs.readFileSync(constantsFile, 'utf8');

// Audit projects p1 to p8
const pBlocks = content.split(/id:\s*['"](p[1-8])['"]/).slice(1);
console.log('Project blocks length:', pBlocks.length / 2);

let issues = [];

for (let i = 0; i < pBlocks.length; i += 2) {
  const pid = pBlocks[i];
  const block = pBlocks[i + 1];

  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const imageMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
  const linkMatch = block.match(/link:\s*['"]([^'"]+)['"]/);
  const detailsMatch = block.match(/details:\s*['"]([^'"]+)['"]/);
  const featuresMatch = block.match(/features:\s*\[([\s\S]*?)\]/);
  const galleryMatch = block.match(/gallery:\s*\[([\s\S]*?)\]/);

  if (!titleMatch) issues.push(`${pid}: Missing title`);
  if (!imageMatch) issues.push(`${pid}: Missing image`);
  else {
    const imgPath = path.join(root, 'public', imageMatch[1].replace(/^\//, ''));
    if (!fs.existsSync(imgPath)) {
      issues.push(`${pid}: image not found: ${imageMatch[1]}`);
    }
  }

  if (linkMatch && !linkMatch[1].startsWith('https://')) {
    issues.push(`${pid}: insecure or invalid link: ${linkMatch[1]}`);
  }

  const features = featuresMatch ? [...featuresMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]) : [];
  if (features.length < 3) {
    issues.push(`${pid}: features count < 3 (${features.length})`);
  }

  if (galleryMatch) {
    const items = [...galleryMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
    for (const item of items) {
      if (item.startsWith('/assets/')) {
        const itemPath = path.join(root, 'public', item.replace(/^\//, ''));
        if (!fs.existsSync(itemPath)) {
          issues.push(`${pid}: gallery item not found: ${item}`);
        }
      }
    }
  }

  console.log(`Validated ${pid}: title="${titleMatch ? titleMatch[1] : 'none'}", features=${features.length}, gallery items checked.`);
}

console.log('Project issues count:', issues.length);
if (issues.length > 0) {
  console.log(issues.join('\n'));
} else {
  console.log('ALL PROJECTS p1-p8 FULLY VALIDATED WITH ZERO BROKEN ASSETS!');
}
