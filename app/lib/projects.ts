import manifest from './work-manifest.json';
import type { Dictionary } from './i18n';

export type WorkImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export type WorkPair = {
  slug: string;
  model: WorkImage;
  render: WorkImage;
};

export type WorkProject = WorkPair & {
  title: string;
  typology: string;
  /** Portrait pairs get a taller grid cell than landscape ones. */
  orientation: 'landscape' | 'portrait' | 'square';
};

/**
 * Curated running order — strongest, most recognisable frames first, since the
 * gallery is the section that has to earn the enquiry.
 */
const ORDER = [
  'villa-luxury-frente-al-mar',
  // Slots 1 and 2 are the gallery's two portrait cells, so the only two
  // portrait pairs belong here — anything else gets cropped hard.
  'hotel-biofilico',
  'casa-madera',
  'casa-mediterranea-luxury',
  'vista-trasera-casa-luxury',
  'spa-bali',
  'oficinas-modernas',
  'oficinas-neo-industrial',
  'tienda-de-ropa-neo-industrial',
  'diseno-interior',
];

function orientationOf(image: WorkImage): WorkProject['orientation'] {
  const ratio = image.width / image.height;
  if (ratio > 1.15) return 'landscape';
  if (ratio < 0.9) return 'portrait';
  return 'square';
}

const pairs = manifest as WorkPair[];

export function getProjects(dict: Dictionary): WorkProject[] {
  const bySlug = new Map(pairs.map((p) => [p.slug, p]));
  const ordered = [
    ...ORDER.map((slug) => bySlug.get(slug)).filter((p): p is WorkPair => !!p),
    ...pairs.filter((p) => !ORDER.includes(p.slug)),
  ];

  return ordered.map((pair) => {
    const copy = dict.work.projects[pair.slug as keyof Dictionary['work']['projects']];
    return {
      ...pair,
      title: copy?.title ?? pair.slug,
      typology: copy?.typology ?? '',
      orientation: orientationOf(pair.render),
    };
  });
}

/** Looks up a specific frame, falling back to the running order's first. */
export function pickProject(projects: WorkProject[], slug: string): WorkProject {
  return projects.find((p) => p.slug === slug) ?? projects[0];
}
