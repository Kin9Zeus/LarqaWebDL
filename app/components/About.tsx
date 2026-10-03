import Image from 'next/image';
import Reveal, { RevealWords } from './Reveal';
import portrait from '../lib/portrait.json';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';

/**
 * The one light section on the page, and the only one about a person rather
 * than a process. The palette inversion is the argument: everything else here
 * is machinery, this part is the architect.
 *
 * The portrait of Laura sits at the head of the left column, above the name
 * block. Regenerate it with scripts/make-portrait.mjs.
 */
export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section
      id={sectionIds.about}
      className="surface-light relative overflow-hidden py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow mb-10">{dict.about.eyebrow}</p>
        </Reveal>

        {/* This is the section's statement, not a quotation — the actual quote
            from Laura sits at the end of the column below. */}
        {/* The lead is written in capitals, which run about a third wider than
            lowercase, so it takes the medium display size and a wider measure. */}
        <h2 className="display max-w-[32ch] text-display-md text-ink">
          <RevealWords text={dict.about.lead} />
        </h2>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="mb-8 max-w-[26rem] overflow-hidden bg-ink/5">
              <Image
                src="/laura.webp"
                alt={dict.about.portraitAlt}
                width={portrait.width}
                height={portrait.height}
                placeholder="blur"
                blurDataURL={portrait.blurDataURL}
                sizes="(min-width: 1024px) 30vw, (min-width: 448px) 26rem, 100vw"
                className="h-auto w-full"
              />
            </div>
            <div className="max-w-[26rem] border-t border-ink/20 pt-6">
              <h3 className="display text-[2rem] leading-tight text-ink">{dict.about.name}</h3>
              <p className="mono-label mt-3 text-ink/50">{dict.about.role}</p>
            </div>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-ink/75">{dict.about.body1}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-7 text-lg leading-relaxed text-ink/75">{dict.about.body2}</p>
            </Reveal>

            <Reveal delay={0.26}>
              <blockquote className="display mt-14 border-l-2 border-render pl-7 text-[clamp(1.5rem,2.6vw,2.125rem)] leading-snug text-ink">
                “{dict.about.quote}”
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
