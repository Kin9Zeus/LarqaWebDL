'use client';

import { useState, type CSSProperties } from 'react';
import Comparator from './Comparator';
import Reveal, { RevealRule, RevealWords } from './Reveal';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';
import type { WorkProject } from '../lib/projects';

/**
 * Wraps the comparator with the argument for it, and pipes the slider position
 * into `--reveal` so the section's accent physically travels from the cool
 * draft blue to the warm render amber as the visitor drags.
 */
export default function MethodSection({
  dict,
  project,
}: {
  dict: Dictionary;
  project: WorkProject;
}) {
  const [reveal, setReveal] = useState(0.38);

  return (
    <section
      id={sectionIds.method}
      style={{ '--reveal': reveal } as CSSProperties}
      className="accent-scope relative border-t border-ink-line bg-ink py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow eyebrow-accent mb-8">{dict.method.eyebrow}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="display text-display-lg lg:col-span-7">
            <RevealWords text={dict.method.title} />
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-md text-base leading-relaxed text-bone/70">{dict.method.body}</p>
          </Reveal>
        </div>

        <RevealRule className="my-12 md:my-16" />

        <Reveal y={40}>
          <Comparator
            project={project}
            dict={dict}
            onRevealChange={setReveal}
            sizes="(min-width: 1600px) 1520px, 100vw"
            className="w-full"
          />
        </Reveal>

        {/* The claim the comparator exists to support. */}
        <div className="mt-12 grid gap-px overflow-hidden border border-ink-line bg-ink-line sm:grid-cols-2">
          <div className="bg-ink px-7 py-9 md:px-10 md:py-12">
            <p className="mono-label text-bone-faint">{dict.method.traditionalLabel}</p>
            <p className="display mt-4 text-display-md text-bone-dim line-through decoration-1 decoration-bone-faint/60">
              {dict.method.traditionalValue}
            </p>
            <p className="mono-label mt-3 text-bone-faint">{dict.method.perImage}</p>
          </div>

          <div className="relative bg-ink px-7 py-9 md:px-10 md:py-12">
            {/* Warms up in step with the slider. */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: reveal,
                background:
                  'radial-gradient(120% 100% at 100% 100%, color-mix(in oklab, var(--color-render) 16%, transparent) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />
            <p className="mono-label relative text-bone-faint">{dict.method.larqaLabel}</p>
            <p
              className="display relative mt-4 text-display-md transition-colors duration-300"
              style={{ color: 'var(--accent)' }}
            >
              {dict.method.larqaValue}
            </p>
            <p className="mono-label relative mt-3 text-bone-faint">{dict.method.perImage}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
