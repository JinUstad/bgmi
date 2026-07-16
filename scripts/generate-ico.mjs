/**
 * generate-ico.mjs
 * Creates a proper multi-size ICO file from icon.svg using sharp.
 * ICO format: 16x16, 32x32, 48x48 sizes embedded.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'src', 'app', 'icon.svg');
const ICO_OUT  = path.join(ROOT, 'src', 'app', 'favicon.ico');

const svgBuffer = fs.readFileSync(SVG_PATH);

// Generate PNG buffers for each size we want in the ICO
const sizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  sizes.map(size =>
    sharp(svgBuffer).resize(size, size).png().toBuffer()
  )
);

// ─── Build ICO binary manually ───────────────────────────────────────────────
// ICO file structure:
//   ICONDIR header (6 bytes)
//   ICONDIRENTRY per image (16 bytes each)
//   Raw PNG data concatenated

const numImages = pngBuffers.length;

// Header: Reserved(2) + Type(2) + Count(2)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);         // Reserved
header.writeUInt16LE(1, 2);         // Type: 1 = ICO
header.writeUInt16LE(numImages, 4); // Number of images

// Directory entries start after header
const dirOffset = 6 + numImages * 16;

// Build directory entries
const dirEntries = [];
let dataOffset = dirOffset;

for (let i = 0; i < numImages; i++) {
  const size = sizes[i];
  const pngData = pngBuffers[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);  // Width (0 = 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1);  // Height
  entry.writeUInt8(0, 2);   // Color count (0 = no palette)
  entry.writeUInt8(0, 3);   // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngData.length, 8);  // Size of image data
  entry.writeUInt32LE(dataOffset, 12);     // Offset of image data
  dirEntries.push(entry);
  dataOffset += pngData.length;
}

// Concatenate everything
const icoBuffer = Buffer.concat([
  header,
  ...dirEntries,
  ...pngBuffers
]);

fs.writeFileSync(ICO_OUT, icoBuffer);
console.log(`✅ favicon.ico written (${sizes.join('x, ')}x) → ${ICO_OUT}`);
console.log(`   File size: ${(icoBuffer.length / 1024).toFixed(1)} KB`);
