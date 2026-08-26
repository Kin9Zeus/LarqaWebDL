/**
 * Derives brand assets from the source logo and hero render.
 *
 *  - public/logo-light.png : the wordmark in bone on transparency, trimmed,
 *    for use on the graphite navbar/footer.
 *  - public/og.jpg         : 1200x630 social card.
 *
 * Run: node scripts/make-brand-assets.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const BONE = { r: 232, g: 228, b: 221 };

async function makeLightLogo() {
  const src = path.join(PUBLIC, 'logo.png');

  // Flatten onto white so trim() has a uniform border to cut, then use the
  // inverted luminance as an alpha mask: black strokes become opaque bone.
  const trimmed = await sharp(src)
    .flatten({ background: '#ffffff' })
    .trim({ threshold: 12 })
    .toBuffer();

  const { width, height } = await sharp(trimmed).metadata();

  const alpha = await sharp(trimmed)
    .greyscale()
    .negate()
    .linear(1.35, 0) // firm up the hairlines so they survive downscaling
    .raw()
    .toBuffer();

  await sharp({
    create: { width, height, channels: 3, background: BONE },
  })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'logo-light.png'));

  console.log(`logo-light.png  ${width}x${height}`);
}

async function makeOgImage() {
  const W = 1200;
  const H = 630;

  const base = await sharp(path.join(PUBLIC, 'work', 'villa-luxury-frente-al-mar-render.webp'))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .toBuffer();

  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b0c0e" stop-opacity="0.15"/>
          <stop offset="55%" stop-color="#0b0c0e" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0b0c0e" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
    </svg>`
  );

  const mark = await sharp(path.join(PUBLIC, 'logo-light.png'))
    .resize({ width: 340 })
    .toBuffer();
  const markMeta = await sharp(mark).metadata();

  await sharp(base)
    .composite([
      { input: scrim, top: 0, left: 0 },
      { input: mark, left: 72, top: H - markMeta.height - 72 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(PUBLIC, 'og.jpg'));

  console.log(`og.jpg          ${W}x${H}`);
}

await makeLightLogo();
await makeOgImage();
