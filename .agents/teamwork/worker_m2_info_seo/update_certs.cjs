const fs = require('fs');
const path = require('path');

const certsFilePath = 'components/CertificationsBlock.tsx';
let content = fs.readFileSync(certsFilePath, 'utf8');

const certFiles = fs.readdirSync('public/assets/certifications');

// Let's check all certificates where image is a PDF
let updatedCount = 0;
// We can parse through the file or use a replacement strategy.
// Each cert item has:
//   image: '/assets/certifications/<NAME>.pdf',
//   gallery: ['/assets/certifications/<NAME>.pdf'],

const regex = /image:\s*['"](\/assets\/certifications\/([^'"]+?)\.pdf)['"],\s*gallery:\s*\[['"](\/assets\/certifications\/([^'"]+?)\.pdf)['"]\]/g;

let matches = [...content.matchAll(regex)];
console.log('Matches with single gallery PDF:', matches.length);

matches.forEach(m => {
    const fullPdfPath = m[1];
    const baseName = m[2];
    const pngName = baseName + '.png';
    if (!certFiles.includes(pngName)) {
        console.error('MISSING PNG FOR:', baseName);
    } else {
        console.log('Matched and verified PNG exists for:', baseName);
    }
});

// Check if any other image: has .pdf
const pdfImgRegex = /image:\s*['"]([^'"]+?\.pdf)['"]/g;
const allPdfImgs = [...content.matchAll(pdfImgRegex)];
console.log('Total PDF images in file:', allPdfImgs.length);
allPdfImgs.forEach(m => console.log('  ', m[1]));
