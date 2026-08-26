/**
 * Converts the raw 3D-model / AI-render pairs into web-ready WebP assets.
 *
 * Source images live outside the build (see .gitignore) because they weigh
 * ~57MB total. This writes optimized derivatives into public/work/ plus a
 * manifest with dimensions and blur placeholders so <Image> never causes
 * layout shift.
 *
 * Run: node scripts/optimize-work-images.mjs
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = path.join(process.cwd(), '3D a Render imagenes');
const OUT_DIR = path.join(process.cwd(), 'public', 'work');
const MANIFEST = path.join(process.cwd(), 'app', 'lib', 'work-manifest.json');

const MAX_WIDTH = 2000;
const QUALITY = 82;

/** Strips accents and normalizes a filename stem into a url-safe slug. */
function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const projects = new Map();

  for (const file of files) {
    const stem = file.replace(/\.(jpe?g|png)$/i, '');
    const isModel = /_modelo_3d$/i.test(stem);
    const isRender = /_render$/i.test(stem);
    if (!isModel && !isRender) {
      console.warn(`skipped (unrecognized variant): ${file}`);
      continue;
    }

    const variant = isModel ? 'model' : 'render';
    const projectSlug = slugify(stem.replace(/_(modelo_3d|render)$/i, ''));
    const outName = `${projectSlug}-${variant}.webp`;

    const pipeline = sharp(path.join(SRC_DIR, file)).rotate();
    const meta = await pipeline.metadata();

    const resized = pipeline.resize({
      width: Math.min(MAX_WIDTH, meta.width),
      withoutEnlargement: true,
    });

    const info = await resized
      .clone()
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(path.join(OUT_DIR, outName));

    // 24px-wide blur placeholder, inlined as a data URI.
    const lqip = await sharp(path.join(SRC_DIR, file))
      .resize({ width: 24 })
      .webp({ quality: 45 })
      .toBuffer();

    const entry = projects.get(projectSlug) ?? { slug: projectSlug };
    entry[variant] = {
      src: `/work/${outName}`,
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    };
    projects.set(projectSlug, entry);

    console.log(
      `${outName}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`
    );
  }

  const manifest = [...projects.values()].filter((p) => p.model && p.render);
  const incomplete = [...projects.values()].filter((p) => !p.model || !p.render);
  for (const p of incomplete) {
    console.warn(`incomplete pair, excluded from manifest: ${p.slug}`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\n${manifest.length} complete pairs -> ${path.relative(process.cwd(), MANIFEST)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
