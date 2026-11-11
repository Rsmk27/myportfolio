const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('components/CertificationsBlock.tsx', 'utf8');
const certFiles = fs.readdirSync('public/assets/certifications');
console.log('Cert files in public directory:');
certFiles.forEach(f => console.log('  ', f));

// Find all `id: "...", title: "...", image: "..."`
const regex = /id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?image:\s*["']([^"']+)["']/g;
let match;
const certs = [];
while ((match = regex.exec(content)) !== null) {
    certs.push({ id: match[1], title: match[2], image: match[3] });
}

console.log('\nTotal parsed certs:', certs.length);
certs.forEach((c, idx) => {
    const isPdf = c.image.endsWith('.pdf');
    const filename = path.basename(c.image);
    const pngName = filename.replace(/\.pdf$/, '.png');
    const pngExists = certFiles.includes(pngName);
    console.log(`${idx + 1}. [${c.id}] "${c.title}" -> ${c.image} (PDF: ${isPdf}, PNG exists: ${pngExists})`);
});
