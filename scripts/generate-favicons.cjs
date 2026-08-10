/**
 * Generate PNG favicons from SVG using sharp.
 * Run: node scripts/generate-favicons.cjs
 * Run before: npm install sharp (one-time)
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const svgPath = path.join(projectRoot, 'public', 'favicon.svg');

// Install sharp temporarily if not available
try {
  require.resolve('sharp');
} catch {
  console.log('Installing sharp temporarily...');
  execSync('npm install --no-save sharp', { cwd: projectRoot, stdio: 'inherit' });
}

const sharp = require('sharp');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-180.png', size: 180 },
];

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  for (const { name, size } of sizes) {
    const outPath = path.join(projectRoot, 'public', name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

generate().then(() => console.log('Done!')).catch(console.error);
