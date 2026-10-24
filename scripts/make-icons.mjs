// Builds every favicon/app icon from the RH emblem in the wordmark.
// Run from the repo root: node scripts/make-icons.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(root, 'web', 'package.json'))('sharp');
const out = (f) => path.join(root, 'web/public', f);

const TERRACOTTA = '#8C5637'; // 5.5:1 against ivory
const IVORY = '#FFF4E1';

// 1. Crop the circular RH emblem off the left of the wordmark, trim, and make it a square canvas.
const emblemCrop = await sharp(path.join(root, 'web/src/assets/logo-wordmark-chocolate.png'))
  .extract({ left: 0, top: 0, width: 640, height: 579 })
  .trim()
  .toBuffer();

// 2. Recolor to ivory: keep the alpha channel, replace the color.
const { data: alpha, info } = await sharp(emblemCrop).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
const emblemIvory = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: IVORY } })
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png()
  .toBuffer();

// The emblem's hairline strokes vanish below ~48px, so tab sizes use a thickened copy:
// blur the alpha at high resolution, then threshold it, which fattens every stroke.
const bold = async (sigma, cut) => {
  const a = await sharp(emblemIvory).resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha().extractChannel(3).blur(sigma).threshold(cut).raw().toBuffer();
  return sharp({ create: { width: 512, height: 512, channels: 3, background: IVORY } })
    .joinChannel(a, { raw: { width: 512, height: 512, channels: 1 } })
    .png()
    .toBuffer();
};
const emblemBold = await bold(7, 40); // 32px and 48px
const emblemHeavy = await bold(13, 28); // 16px

/** Terracotta tile with the ivory emblem. `inset` is the emblem's share of the tile; `radius` rounds the tile (0 = square). */
async function tile(size, inset, radius, source = emblemIvory) {
  const inner = Math.round(size * inset);
  const emblem = await sharp(source).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`);
  return sharp({ create: { width: size, height: size, channels: 4, background: TERRACOTTA } })
    .composite([{ input: emblem, gravity: 'centre' }, { input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// Browser tab icons: rounded tile, emblem fills most of it so thin lines survive at 16px.
const tab = {};
for (const s of [16, 32, 48]) tab[s] = await tile(s, 0.94, Math.round(s * 0.22), s === 16 ? emblemHeavy : emblemBold);
writeFileSync(out('favicon-16x16.png'), tab[16]);
writeFileSync(out('favicon-32x32.png'), tab[32]);

// favicon.ico with 16/32/48 PNG payloads (supported by every current browser)
const sizes = [16, 32, 48];
const head = Buffer.alloc(6);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(tab[s].length, 8); e.writeUInt32LE(offset, 12);
  offset += tab[s].length;
  return e;
});
writeFileSync(out('favicon.ico'), Buffer.concat([head, ...entries, ...sizes.map((s) => tab[s])]));

// iOS ignores transparency and rounds the corners itself: full-bleed square.
writeFileSync(out('apple-touch-icon.png'), await sharp(await tile(180, 0.74, 0)).flatten({ background: TERRACOTTA }).png().toBuffer());
// Android / PWA: regular and maskable (maskable keeps the emblem inside the 80% safe zone).
writeFileSync(out('icon-192.png'), await tile(192, 0.86, 42));
writeFileSync(out('icon-512.png'), await tile(512, 0.86, 112));
writeFileSync(out('icon-maskable-512.png'), await sharp(await tile(512, 0.6, 0)).flatten({ background: TERRACOTTA }).png().toBuffer());

console.log('wrote favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png');

// Monogram for the site itself (footer, dark sections): the same emblem in sand on a transparent background.
// The DS calls for the sand monogram on dark surfaces; it is 9.7:1 against espresso.
const SAND = '#E8D4B9';
const monogramSand = await sharp({ create: { width: info.width, height: info.height, channels: 3, background: SAND } })
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(path.join(root, 'web/src/assets/monogram-sand.png'), monogramSand);
console.log(`wrote web/src/assets/monogram-sand.png (${info.width}x${info.height})`);
