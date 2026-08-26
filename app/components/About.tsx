import Reveal, { RevealWords } from './Reveal';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';

/**
 * The one light section on the page, and the only one about a person rather
 * than a process. The palette inversion is the argument: everything else here
 * is machinery, this part is the architect.
 *
 * A portrait of Laura belongs in the left column — drop the file in
 * public/laura.jpg and add it beside the name block.
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
        <h2 className="display max-w-[20ch] text-display-lg text-ink">
          <RevealWords text={dict.about.lead} />
        </h2>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-3">
            <div className="border-t border-ink/20 pt-6">
              <h3 className="display text-[2rem] leading-tight text-ink">{dict.about.name}</h3>
              <p className="mono-label mt-3 text-ink/50">{dict.about.role}</p>
            </div>
          </Reveal>

          <div className="lg:col-span-8 lg:col-start-5">
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
