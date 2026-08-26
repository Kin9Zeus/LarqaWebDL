import { notFound } from 'next/navigation';

/**
 * Catches every unmatched path *inside* a locale so it renders
 * `app/[locale]/not-found.tsx` — with the navbar, footer and correct language —
 * instead of falling through to Next's bare built-in 404.
 *
 * Without this, `/es/anything` resolves at the root, where there is no layout
 * (the root layout lives at `app/[locale]/layout.tsx`) and Next serves its
 * default page.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
