'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getDictionary, defaultLocale, isLocale, type Locale } from '../lib/i18n';
import { sectionIds, site } from '../lib/site';

/**
 * Localised 404, inside the [locale] segment so it keeps the navbar, footer
 * and language of wherever the visitor already was.
 *
 * Next.js does not pass params to not-found boundaries, so the locale comes
 * from the pathname — which proxy.ts has already guaranteed is prefixed.
 * Reading it on the client (rather than from request headers) keeps the rest
 * of the route statically renderable.
 */
export default function NotFound() {
  const pathname = usePathname() ?? '';
  const segment = pathname.split('/').filter(Boolean)[0];
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink pt-[var(--nav-h)]">
      {/* A faint construction grid — the drawing under the drawing. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-bone) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bone) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 py-24 md:px-10">
        <p className="eyebrow mb-8 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-render" aria-hidden="true" />
          {dict.notFound.eyebrow}
        </p>

        <p
          className="display select-none text-[clamp(6rem,22vw,18rem)] leading-[0.85] text-bone/10"
          aria-hidden="true"
        >
          {dict.notFound.code}
        </p>

        <h1 className="display mt-6 max-w-[16ch] text-display-lg text-bone">
          {dict.notFound.title}
        </h1>

        <p className="mt-7 max-w-md text-base leading-relaxed text-bone/60">
          {dict.notFound.body}
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link
            href={`/${locale}`}
            className="mono-label group inline-flex items-center justify-center gap-3 bg-bone px-8 py-4 text-ink transition-colors duration-500 hover:bg-render"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-x-1"
            />
            {dict.notFound.cta}
          </Link>

          <a
            href={`mailto:${site.email}`}
            className="mono-label group inline-flex items-center justify-center gap-2 border border-bone/25 px-8 py-4 text-bone transition-colors duration-500 hover:border-bone"
          >
            {dict.notFound.ctaSecondary}
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <Link
          href={`/${locale}#${sectionIds.work}`}
          className="link-wipe mono-label mt-14 inline-block text-bone-dim hover:text-bone"
        >
          {dict.nav.work}
        </Link>
      </div>
    </section>
  );
}
