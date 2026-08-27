/**
 * Builds the LARQA icon mark and every favicon deliverable.
 *
 * The wordmark cannot be the favicon: it is 2.3:1, so squaring it squashes the
 * lockup into an illegible smear — which is exactly what the old /logo.png
 * favicon did. The mark is instead a capital L drawn in the logo's own voice:
 * a heavy stem against a light arm, with the flared bracket serifs the wordmark
 * uses.
 *
 * It is deliberately a full L rather than a trace of the logo's actual glyph.
 * In the wordmark that glyph is closer to a capital I, and only reads as an L
 * because of the swash sweeping beneath the whole word — a swash that dissolves
 * into a smudge below 32px, leaving the icon looking like an "I".
 *
 * Optical sizing: the 16 and 32px tiles render from a heavier cut of the same
 * skeleton, because the fine cut's arm and serifs vanish at that scale. This is
 * what type foundries do, and it keeps the small sizes legible without turning
 * them into a different mark.
 *
 * Run: node scripts/make-favicon.mjs [--preview]
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const APP = path.join(process.cwd(), 'app');

const INK = '#0b0c0e';
const BONE = '#e8e4dd';

/* Graphite letter on a bone field: mirrors the logo's black-on-white original
   and stays visible against both light and dark browser tab bars. */
const FG = INK;
const BG = BONE;

/** The letterform on a 1000x1000 grid. */
function letterL(w, color) {
  const cx = 360;
  const top = 250;
  const bot = 750;
  const s = w.stem / 2;
  const sh = w.serifHalf;
  const st = w.serifThick;
  const br = 46;
  const armTop = bot - w.arm;
  const armEnd = 736;

  const d = `
    M ${cx - sh} ${top}
    L ${cx + sh} ${top}
    L ${cx + sh} ${top + st}
    C ${cx + s + 26} ${top + st + 4}, ${cx + s + 2} ${top + st + 12}, ${cx + s} ${top + st + br}
    L ${cx + s} ${armTop}
    L ${armEnd - 66} ${armTop}
    C ${armEnd - 34} ${armTop - 5}, ${armEnd - 16} ${armTop - 15}, ${armEnd - 9} ${armTop - 32}
    L ${armEnd} ${armTop - 32}
    L ${armEnd} ${bot}
    L ${cx - sh} ${bot}
    L ${cx - sh} ${bot - st}
    C ${cx - s - 26} ${bot - st - 4}, ${cx - s - 2} ${bot - st - 12}, ${cx - s} ${bot - st - br}
    L ${cx - s} ${top + st + br}
    C ${cx - s - 2} ${top + st + 12}, ${cx - s - 26} ${top + st + 4}, ${cx - sh} ${top + st}
    Z`;

  return `<path d="${d}" fill="${color}"/>`;
}

const FINE = { stem: 74, serifHalf: 116, serifThick: 19, arm: 34 };
const BOLD = { stem: 116, serifHalf: 150, serifThick: 34, arm: 56 };

function tile(weight) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
      <rect width="1000" height="1000" fill="${BG}"/>
      ${letterL(weight, FG)}
    </svg>`
  );
}

/** Rasterises at the exact target size — never by downscaling one bitmap. */
async function raster(size) {
  const source = tile(size <= 32 ? BOLD : FINE);
  return sharp(source).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Minimal ICO container. The format is a 6-byte header plus one 16-byte
 * directory entry per image, and modern .ico files may embed PNG payloads
 * directly, so no BMP encoding is required. sharp cannot write .ico, hence
 * this.
 */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = 6 + 16 * images.length;

  images.forEach(({ size, buf }, i) => {
    const e = 16 * i;
    // A 0 in these fields means 256.
    entries.writeUInt8(size >= 256 ? 0 : size, e);
    entries.writeUInt8(size >= 256 ? 0 : size, e + 1);
    entries.writeUInt8(0, e + 2); // palette size
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4); // colour planes
    entries.writeUInt16LE(32, e + 6); // bits per pixel
    entries.writeUInt32LE(buf.length, e + 8);
    entries.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });

  return Buffer.concat([header, entries, ...images.map((i) => i.buf)]);
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  // Legacy browsers and Windows; 48 is what Windows uses for shortcuts.
  const ico = buildIco(
    await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await raster(size) })))
  );
  await writeFile(path.join(APP, 'favicon.ico'), ico);
  console.log(`app/favicon.ico          16+32+48   ${(ico.length / 1024).toFixed(1)}KB`);

  for (const [name, size] of [
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['apple-icon.png', 180],
  ]) {
    const buf = await raster(size);
    await writeFile(path.join(PUBLIC, name), buf);
    console.log(`public/${name.padEnd(24)} ${String(size).padEnd(10)} ${(buf.length / 1024).toFixed(1)}KB`);
  }

  if (process.argv.includes('--preview')) {
    const OUT = path.join(process.cwd(), 'scratch-favicon');
    await mkdir(OUT, { recursive: true });
    for (const size of [16, 32, 48, 128, 512]) {
      await writeFile(path.join(OUT, `preview-${size}.png`), await raster(size));
    }
    console.log('previews -> scratch-favicon/');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
