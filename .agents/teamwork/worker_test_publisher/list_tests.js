const fs = require('fs');
const files = [
  'tests/smoke.test.ts',
  'tests/security.test.ts',
  'tests/seo.test.ts',
  'tests/content.test.ts',
  'tests/ui.test.ts',
  'tests/interactions.test.ts'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let tier = 'None';
  console.log('\n=== ' + f + ' ===');
  lines.forEach(l => {
    if (l.includes('Tier 1')) tier = 'Tier 1';
    else if (l.includes('Tier 2')) tier = 'Tier 2';
    else if (l.includes('Tier 3')) tier = 'Tier 3';
    else if (l.includes('Tier 4')) tier = 'Tier 4';
    const m = l.match(/^\s*(?:it|test)\s*\((['"`].+?['"`])/);
    if (m) {
      console.log(' [' + tier + '] ' + m[1]);
    }
  });
});
