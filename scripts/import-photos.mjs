// Makes web-ready copies of the photo shoot.
// Reads the full-size originals in photos-originals/{hero,stylists,rituals}/ (gitignored, hundreds of MB)
// and writes resized JPEGs to web/src/assets/photos/<same folder>/, which are committed.
// Astro then builds responsive sizes from these for each screen.
// Run from the repo root: node scripts/import-photos.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(root, 'web', 'package.json'))('sharp');

const SRC = path.join(root, 'photos-originals');
const OUT = path.join(root, 'web/src/assets/photos');
const MAX_EDGE = 2400; // big enough for a full-width hero on a large retina screen
const QUALITY = 80;

let total = 0;
for (const folder of readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const outDir = path.join(OUT, folder.name);
  mkdirSync(outDir, { recursive: true });
  for (const file of readdirSync(path.join(SRC, folder.name)).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))) {
    // "IMG_0156.jpeg" -> "img-0156.jpg"; long camera-roll ids get shortened
    const base = path.parse(file).name.toLowerCase().replace(/_/g, '-').replace(/^([0-9a-f]{8})-.*$/, 'photo-$1');
    const dest = path.join(outDir, `${base}.jpg`);
    // .rotate() applies the camera's orientation; sharp drops all metadata (including any GPS location) by default.
    await sharp(path.join(SRC, folder.name, file))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(dest);
    const kb = Math.round(statSync(dest).size / 1024);
    total += kb;
    console.log(`${folder.name}/${base}.jpg  ${kb} KB`);
  }
}
console.log(`total ${(total / 1024).toFixed(1)} MB`);
