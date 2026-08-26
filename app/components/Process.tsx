import Reveal, { RevealWords } from './Reveal';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';

/**
 * Numbered, because the order genuinely carries information: you cannot render
 * before there is a model, and the model follows the brief.
 */
export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section
      id={sectionIds.process}
      className="relative border-t border-ink-line bg-ink py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">{dict.process.eyebrow}</p>
        </Reveal>

        <h2 className="display max-w-[14ch] text-display-lg">
          <RevealWords text={dict.process.title} />
        </h2>

        <ol className="mt-16 grid gap-x-10 gap-y-14 md:mt-24 md:grid-cols-2 lg:grid-cols-4">
          {dict.process.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.1}>
                <div className="relative">
                  {/* The rail that links the steps on wide screens. */}
                  <span
                    className="absolute left-0 top-[0.6rem] hidden h-px w-full bg-ink-line lg:block"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute left-0 top-[0.6rem] hidden h-px w-8 bg-render lg:block"
                    aria-hidden="true"
                  />

                  <div className="relative flex items-baseline gap-4 pt-8 lg:pt-10">
                    <span className="mono-label text-render">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="display text-[1.875rem] leading-tight text-bone">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/60">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
