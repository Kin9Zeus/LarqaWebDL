import Reveal, { RevealRule, RevealWords } from './Reveal';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';

/**
 * Deliberately un-numbered: these are parallel offerings, not a sequence.
 * (The process section directly below *is* a sequence, and is numbered.)
 */
export default function Services({ dict }: { dict: Dictionary }) {
  return (
    <section
      id={sectionIds.services}
      className="border-t border-ink-line bg-ink py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">{dict.services.eyebrow}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="display text-display-lg lg:col-span-7">
            <RevealWords text={dict.services.title} />
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-md text-base leading-relaxed text-bone/70">
              {dict.services.body}
            </p>
          </Reveal>
        </div>

        <RevealRule className="my-12 md:my-16" />

        <ul className="grid gap-px overflow-hidden border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
          {dict.services.items.map((item, i) => (
            <li key={item.title} className="group relative bg-ink">
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <div className="relative flex h-full flex-col px-7 py-10 transition-colors duration-500 group-hover:bg-ink-raised md:px-9 md:py-12">
                  <span
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-render transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <h3 className="display text-[1.75rem] leading-tight text-bone">{item.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-bone/60 transition-colors duration-500 group-hover:text-bone/80">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
