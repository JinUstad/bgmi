/**
 * apply-favicon.mjs
 * Converts the AI-generated favicon image into all required sizes
 * and places them in the correct Next.js App Router locations.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── Source: AI generated favicon image ───────────────────────────────────────
const SOURCE = `C:\\Users\\Jin Ustad\\.gemini\\antigravity-ide\\brain\\6aea578f-d51d-4b4e-a842-1de46bd856bd\\xylo_esports_favicon_1784165053128.png`;

const APP_DIR    = path.join(ROOT, 'src', 'app');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ICONS_DIR  = path.join(PUBLIC_DIR, 'icons');

fs.mkdirSync(ICONS_DIR, { recursive: true });

const src = fs.readFileSync(SOURCE);

console.log('🎨 Applying AI-generated XYLO Esports favicon...\n');

// ── 1. icon.png → src/app/icon.png (Next.js special file — main favicon) ─────
await sharp(src).resize(512, 512).png().toFile(path.join(APP_DIR, 'icon.png'));
console.log('  ✅ src/app/icon.png          (512×512 — Next.js primary icon)');

// ── 2. apple-icon.png → src/app/apple-icon.png ───────────────────────────────
await sharp(src).resize(180, 180).png().toFile(path.join(APP_DIR, 'apple-icon.png'));
console.log('  ✅ src/app/apple-icon.png    (180×180 — iOS home screen)');

// ── 3. favicon.ico → src/app/favicon.ico (proper multi-size ICO) ─────────────
const ico16 = await sharp(src).resize(16, 16).ensureAlpha().png().toBuffer();
const ico32 = await sharp(src).resize(32, 32).ensureAlpha().png().toBuffer();
const ico48 = await sharp(src).resize(48, 48).ensureAlpha().png().toBuffer();

const bufs = [ico16, ico32, ico48];
const sizes = [16, 32, 48];
const numImages = bufs.length;

// Build ICO binary (ICONDIR + ICONDIRENTRYs + image data)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(numImages, 4);

let dataOffset = 6 + numImages * 16;
const entries = bufs.map((buf, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizes[i], 0);
  entry.writeUInt8(sizes[i], 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(buf.length, 8);
  entry.writeUInt32LE(dataOffset, 12);
  dataOffset += buf.length;
  return entry;
});

const icoBuffer = Buffer.concat([header, ...entries, ...bufs]);
fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), icoBuffer);
console.log('  ✅ src/app/favicon.ico       (16+32+48px multi-size ICO)');

// ── 4. PWA icon sizes → public/icons/ ────────────────────────────────────────
const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of pwaSizes) {
  await sharp(src).resize(size, size).png()
    .toFile(path.join(ICONS_DIR, `icon-${size}.png`));
  console.log(`  ✅ public/icons/icon-${size}.png`);
}

// ── 5. OG Image → public/og-image.jpg (1200×630 with icon centred) ───────────
const icon200 = await sharp(src).resize(200, 200).png().toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } }
})
  .composite([{ input: icon200, gravity: 'centre' }])
  .jpeg({ quality: 92 })
  .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));
console.log('  ✅ public/og-image.jpg        (1200×630 OpenGraph image)');

// ── 6. Copy to public/icon.svg placeholder ───────────────────────────────────
// (keep SVG as fallback — already exists)
console.log('\n🎉 All favicon files applied successfully!');
console.log('   Hard refresh your browser with Ctrl+Shift+R to see the new favicon.\n');
