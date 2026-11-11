const fs = require('fs');

const certsFilePath = 'components/CertificationsBlock.tsx';
let content = fs.readFileSync(certsFilePath, 'utf8');

// Replace each of the 31 image/gallery pairs:
// image: '/assets/certifications/<NAME>.pdf',
// gallery: ['/assets/certifications/<NAME>.pdf'],
// with:
// image: '/assets/certifications/<NAME>.png',
// gallery: [
//     '/assets/certifications/<NAME>.png',
//     '/assets/certifications/<NAME>.pdf'
// ],

const updated = content.replace(
    /image:\s*['"](\/assets\/certifications\/([^'"]+?)\.pdf)['"],\s*gallery:\s*\[['"](\/assets\/certifications\/([^'"]+?)\.pdf)['"]\]/g,
    (match, fullPdfPath1, baseName1, fullPdfPath2, baseName2) => {
        return `image: '/assets/certifications/${baseName1}.png',\n        gallery: [\n            '/assets/certifications/${baseName1}.png',\n            '/assets/certifications/${baseName1}.pdf'\n        ]`;
    }
);

// Also in GalleryModal, ensure the FULL PDF button shows if cert.gallery has a pdf
let finalContent = updated.replace(
    `{mainSrc && mainSrc.endsWith('.pdf') && (`,
    `{(cert.gallery?.some(s => s.endsWith('.pdf')) || (mainSrc && mainSrc.endsWith('.pdf'))) && (`
);

finalContent = finalContent.replace(
    `<a\n                                href={mainSrc}\n                                target="_blank"`,
    `<a\n                                href={mainSrc && mainSrc.endsWith('.pdf') ? mainSrc : (cert.gallery?.find(s => s.endsWith('.pdf')) || mainSrc)}\n                                target="_blank"`
);

fs.writeFileSync(certsFilePath, finalContent, 'utf8');
console.log('Successfully updated components/CertificationsBlock.tsx');
