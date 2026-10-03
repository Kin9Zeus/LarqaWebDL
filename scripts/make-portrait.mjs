/**
 * Turns the raw portrait of Laura into the web asset used by the About section.
 *
 * The original is a tall phone photo (1126x2000). The About column shows it at
 * 4:5, so this crops to that ratio, keeping her from the hair to the shoes, and
 * writes a WebP plus a tiny blur placeholder so <Image> causes no layout shift.
 * The raw photo stays out of git, like the work renders (see ADR-0011).
 *
 * Run: node scripts/make-portrait.mjs <path-to-raw-photo>
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT_FILE = path.join(process.cwd(), 'public', 'laura.webp');
const OUT_META = path.join(process.cwd(), 'app', 'lib', 'portrait.json');

const WIDTH = 1000;
const HEIGHT = 1250; // 4:5
/** Crop origin as a fraction of the source height, tuned to this photo. */
const TOP_RATIO = 0.23;
const QUALITY = 82;

async function main() {
  const src = process.argv[2];
  if (!src) {
    console.error('usage: node scripts/make-portrait.mjs <path-to-raw-photo>');
    process.exit(1);
  }

  const image = sharp(src).rotate(); // honour EXIF orientation
  const { width, height } = await image.metadata();

  const cropHeight = Math.round((width * HEIGHT) / WIDTH);
  const top = Math.min(Math.round(height * TOP_RATIO), height - cropHeight);

  const cropped = image.extract({ left: 0, top, width, height: cropHeight });

  await mkdir(path.dirname(OUT_META), { recursive: true });
  await cropped
    .clone()
    .resize(WIDTH, HEIGHT)
    .webp({ quality: QUALITY })
    .toFile(OUT_FILE);

  const blur = await cropped.clone().resize(16).webp({ quality: 40 }).toBuffer();
  const meta = {
    width: WIDTH,
    height: HEIGHT,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
  await writeFile(OUT_META, JSON.stringify(meta, null, 2) + '\n');

  console.log(`wrote ${path.relative(process.cwd(), OUT_FILE)} and ${path.relative(process.cwd(), OUT_META)}`);
}

main();
