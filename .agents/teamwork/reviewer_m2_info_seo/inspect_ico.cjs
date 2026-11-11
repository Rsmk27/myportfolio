const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const faviconPath = path.join(root, 'public/favicon.ico');
const buf = fs.readFileSync(faviconPath);
const count = buf.readUInt16LE(4);
console.log('Favicon frame count:', count);
for (let i = 0; i < count; i++) {
  const offset = 6 + i * 16;
  const w = buf[offset] || 256;
  const h = buf[offset + 1] || 256;
  const bpp = buf.readUInt16LE(offset + 6);
  const size = buf.readUInt32LE(offset + 8);
  console.log('Frame ' + i + ': ' + w + 'x' + h + ', bpp=' + bpp + ', size=' + size + ' bytes');
}
