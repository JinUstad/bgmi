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

fs.mkdirSync(ICONS_DIR, { recursive: true });
const svgBuffer = fs.readFileSync(SVG_PATH);

console.log('🖼️  Generating PNG icons from original SVG...');

// Since it's an SVG, we want to rasterize it nicely.
// Sharp can take an SVG directly.
const getResizedBuffer = async (size) => {
  return await sharp(svgBuffer).resize(size, size).ensureAlpha().png().toBuffer();
};

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of sizes) {
  const buf = await getResizedBuffer(size);
  fs.writeFileSync(path.join(ICONS_DIR, `icon-${size}.png`), buf);
  console.log(`  ✅ icon-${size}.png`);
}

const buf180 = await getResizedBuffer(180);
fs.writeFileSync(path.join(APP_DIR, 'apple-icon.png'), buf180);
console.log('  ✅ apple-icon.png');

const buf512 = await getResizedBuffer(512);
fs.writeFileSync(path.join(APP_DIR, 'icon.png'), buf512);
console.log('  ✅ icon.png (512x512)');

// ICO generation
const ico16 = await getResizedBuffer(16);
const ico32 = await getResizedBuffer(32);
const ico48 = await getResizedBuffer(48);

const bufs = [ico16, ico32, ico48];
const icoSizes = [16, 32, 48];
const numImages = bufs.length;

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(numImages, 4);

let dataOffset = 6 + numImages * 16;
const entries = bufs.map((buf, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(icoSizes[i], 0);
  entry.writeUInt8(icoSizes[i], 1);
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
console.log('  ✅ favicon.ico (16+32+48px multi-size ICO)');

console.log('\\n🎉 All favicon files restored from original SVG!');
