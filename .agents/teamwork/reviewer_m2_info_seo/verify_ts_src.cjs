const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');

const srcFiles = [
  'App.tsx',
  'constants.tsx',
  'types.ts',
  'components/CertificationsBlock.tsx',
  'components/common/SEO.tsx',
  'components/ContactInterface.tsx',
  'components/CustomCursor.tsx',
  'components/EasterEgg.tsx',
  'components/PCBBackground.tsx',
  'components/ProjectChip.tsx',
  'components/SkillBreadboard.tsx',
  'components/TimelineSystem.tsx',
  'pages/Home.tsx',
  'pages/IndustrialPortfolio.tsx',
  'pages/Gallery.tsx',
  'pages/NotFound.tsx'
];

console.log('Checking TypeScript on application source files:');
try {
  const result = execSync(`npx tsc --noEmit --strict ${srcFiles.join(' ')}`, {
    cwd: root,
    encoding: 'utf8'
  });
  console.log('Result: PASS (0 errors)');
} catch (err) {
  console.error('Errors found:\n', err.stdout || err.message);
}
