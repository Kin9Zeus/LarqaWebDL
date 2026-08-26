import { ArrowRight } from 'lucide-react';
import Reveal, { RevealWords } from './Reveal';
import type { Dictionary } from '../lib/i18n';

/**
 * The argument section. The marquee band is the one loud typographic moment
 * on the page; everything under it is deliberately quiet so the claim lands.
 */
export default function SpeedSection({ dict }: { dict: Dictionary }) {
  /* The track needs the sequence exactly twice: the keyframes travel -50%, so
     any other count makes the loop snap. Keys are prefixed per half because
     both halves are siblings in one parent. */
  const phrases = (half: string) =>
    Array.from({ length: 4 }, (_, i) => (
      <span
        key={`${half}-${i}`}
        className="display flex shrink-0 items-center text-[clamp(2rem,8vw,7rem)]"
      >
        <span className="marquee-text whitespace-nowrap px-8">{dict.speed.marquee}</span>
        <span className="marquee-dot h-2 w-2 shrink-0 rounded-full bg-render" aria-hidden="true" />
      </span>
    ));

  return (
    <section className="relative overflow-hidden border-t border-ink-line bg-ink py-24 md:py-36">
      {/* Typographic band */}
      <div className="marquee py-6" aria-hidden="true">
        <div className="marquee-track">
          {phrases('a')}
          {phrases('b')}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1600px] px-6 md:mt-24 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">{dict.speed.eyebrow}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="display text-display-lg lg:col-span-6">
            <RevealWords text={dict.speed.title} />
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <p className="max-w-md text-base leading-relaxed text-bone/70">{dict.speed.body}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden border border-ink-line bg-ink-line md:mt-24 md:grid-cols-3">
          {dict.speed.cards.map((card, i) => (
            <li key={card.label} className="bg-ink">
              <Reveal delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col px-7 py-10 md:px-9 md:py-12">
                  <p className="mono-label text-bone-faint">{card.label}</p>

                  <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="text-lg text-bone-dim line-through decoration-1 decoration-bone-faint/60">
                      {card.before}
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.25}
                      className="shrink-0 self-center text-bone-faint"
                      aria-hidden="true"
                    />
                    <span className="display text-[1.75rem] leading-tight text-render">
                      {card.after}
                    </span>
                  </div>

                  <p className="mt-auto pt-8 text-sm leading-relaxed text-bone/55">{card.note}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
