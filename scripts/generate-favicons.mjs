/**
 * generate-favicons.mjs
 * Generates all favicon sizes from src/app/icon.svg using sharp.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SVG_PATH = path.join(ROOT, 'src', 'app', 'icon.svg');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const APP_DIR = path.join(ROOT, 'src', 'app');

// Ensure icons directory exists
fs.mkdirSync(ICONS_DIR, { recursive: true });

const svgBuffer = fs.readFileSync(SVG_PATH);

// --- PNG sizes for /public/icons/ ---
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🖼️  Generating PNG icons...');
for (const size of sizes) {
  const outPath = path.join(ICONS_DIR, `icon-${size}.png`);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`  ✅ icon-${size}.png`);
}

// --- Apple Touch Icon (180x180) ---
const applePath = path.join(ICONS_DIR, 'apple-touch-icon.png');
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(applePath);
console.log('  ✅ apple-touch-icon.png (180x180)');

// --- OG Image placeholder (1200x630) if it doesn't exist ---
const ogPath = path.join(PUBLIC_DIR, 'og-image.jpg');
if (!fs.existsSync(ogPath)) {
  // Create a dark background OG image with the icon centred
  const iconBuffer = await sharp(svgBuffer).resize(200, 200).png().toBuffer();
  
  // Create 1200x630 dark background
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 }
    }
  })
    .composite([
      {
        input: iconBuffer,
        gravity: 'centre',
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(ogPath);
  console.log('  ✅ og-image.jpg (1200x630) — placeholder created');
} else {
  console.log('  ⏭️  og-image.jpg already exists, skipping');
}

// --- favicon.ico (multi-size: 16, 32, 48) ---
// ICO format: we'll generate a 32x32 PNG and rename it as .ico
// For true multi-size ICO, we use the PNG-in-ICO trick (modern browsers handle this fine)
const faviconPath = path.join(APP_DIR, 'favicon.ico');

// Generate 32x32 PNG as ICO (browsers accept PNG inside .ico)
const favicon32 = await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toBuffer();

// Write as ICO (browsers interpret the PNG correctly as a favicon)
fs.writeFileSync(faviconPath, favicon32);
console.log('  ✅ favicon.ico (32x32 PNG-in-ICO)');

// Also save a separate 32x32 PNG for metadata reference
const favicon32Path = path.join(PUBLIC_DIR, 'favicon-32x32.png');
fs.writeFileSync(favicon32Path, favicon32);

const favicon16 = await sharp(svgBuffer)
  .resize(16, 16)
  .png()
  .toBuffer();
const favicon16Path = path.join(PUBLIC_DIR, 'favicon-16x16.png');
fs.writeFileSync(favicon16Path, favicon16);
console.log('  ✅ favicon-16x16.png & favicon-32x32.png');

console.log('\n🎉 All favicons generated successfully!');
console.log(`   Public icons: ${ICONS_DIR}`);
console.log(`   Favicon ICO:  ${faviconPath}`);
