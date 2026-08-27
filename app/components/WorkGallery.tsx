'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import Comparator from './Comparator';
import Reveal, { RevealRule, RevealWords } from './Reveal';
import { sectionIds } from '../lib/site';
import type { Dictionary } from '../lib/i18n';
import type { WorkProject } from '../lib/projects';

/**
 * Editorial grid. Spans are fixed rather than derived from orientation so the
 * rows always close out evenly at 12 columns; each cell then crops its image
 * to a ratio chosen for that slot.
 */
const LAYOUT = [
  { span: 'lg:col-span-8', aspect: 'aspect-[16/9]', sizes: '(min-width:1024px) 62vw, 100vw' },
  { span: 'lg:col-span-4', aspect: 'aspect-[3/4]', sizes: '(min-width:1024px) 31vw, 100vw' },
  { span: 'lg:col-span-4', aspect: 'aspect-[3/4]', sizes: '(min-width:1024px) 31vw, 100vw' },
  { span: 'lg:col-span-8', aspect: 'aspect-[16/9]', sizes: '(min-width:1024px) 62vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
  { span: 'lg:col-span-6', aspect: 'aspect-[4/3]', sizes: '(min-width:1024px) 47vw, 100vw' },
];

export default function WorkGallery({
  dict,
  projects,
}: {
  dict: Dictionary;
  projects: WorkProject[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const isOpen = openIndex !== null;
  const current = isOpen ? projects[openIndex] : null;

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) => (i === null ? i : (i + delta + projects.length) % projects.length));
    },
    [projects.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, step]);

  return (
    <section id={sectionIds.work} className="border-t border-ink-line bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow mb-8">{dict.work.eyebrow}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 className="display text-display-lg lg:col-span-7">
            {/* Counted from the manifest so adding a pair never leaves a stale
                number in the headline. */}
            <RevealWords text={dict.work.title.replace('{count}', String(projects.length))} />
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-md text-base leading-relaxed text-bone/70">{dict.work.body}</p>
          </Reveal>
        </div>

        <RevealRule className="my-12 md:my-16" />

        <ul className="grid gap-5 md:gap-6 lg:grid-cols-12">
          {projects.map((project, i) => (
            <WorkCard
              key={project.slug}
              project={project}
              slot={LAYOUT[i % LAYOUT.length]}
              index={i}
              revealDelay={(i % 3) * 0.08}
              viewLabel={dict.work.viewLabel}
              onOpen={(el) => {
                lastTrigger.current = el;
                setOpenIndex(i);
              }}
            />
          ))}
        </ul>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col bg-ink-sunken/97 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink-line px-5 py-4 md:px-8">
              <div className="min-w-0">
                <h3 className="display truncate text-[1.5rem] leading-tight text-bone md:text-[2rem]">
                  {current.title}
                </h3>
                <p className="mono-label mt-1 text-bone-faint">{current.typology}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-ink-line text-bone transition-colors duration-300 hover:border-bone"
                aria-label={dict.work.closeLabel}
              >
                <X size={20} strokeWidth={1.25} />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-6 md:px-8">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[1400px]"
              >
                <Comparator
                  project={current}
                  dict={dict}
                  priority
                  sizes="(min-width: 1400px) 1360px, 92vw"
                />
              </motion.div>
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-ink-line px-5 py-4 md:px-8">
              <button
                type="button"
                onClick={() => step(-1)}
                className="mono-label group flex items-center gap-3 text-bone-dim transition-colors duration-300 hover:text-bone"
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.25}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                {dict.work.prevLabel}
              </button>

              <span className="mono-label text-bone-faint">
                {String(openIndex + 1).padStart(2, '0')} {dict.work.counterSeparator}{' '}
                {String(projects.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => step(1)}
                className="mono-label group flex items-center gap-3 text-bone-dim transition-colors duration-300 hover:text-bone"
              >
                {dict.work.nextLabel}
                <ArrowRight
                  size={15}
                  strokeWidth={1.25}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


type Slot = (typeof LAYOUT)[number];

/**
 * One gallery cell.
 *
 * Owns a live IntersectionObserver purely so the touch-device alternation can
 * be switched off while the card is off screen — ten cards animating
 * `clip-path` in the background is real battery cost for something nobody is
 * looking at. `--peek-index` phase-shifts each card so they never pulse in
 * unison. On pointer devices none of this applies and hover drives the wipe.
 */
function WorkCard({
  project,
  slot,
  index,
  revealDelay,
  viewLabel,
  onOpen,
}: {
  project: WorkProject;
  slot: Slot;
  index: number;
  revealDelay: number;
  viewLabel: string;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Defaults to on-screen so the touch alternation runs even if the observer
  // never delivers a callback; the observer can only ever pause it.
  const [offScreen, setOffScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOffScreen(!entry.isIntersecting);
      },
      { rootMargin: '10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`${slot.span}${offScreen ? ' peek-off' : ''}`}
      style={{ '--peek-index': String(index) } as CSSProperties}
    >
      <Reveal delay={revealDelay}>
        <button
          type="button"
          onClick={(e) => onOpen(e.currentTarget)}
          className="group block w-full text-left"
          aria-label={`${project.title} — ${viewLabel}`}
        >
          <div className={`relative w-full overflow-hidden bg-ink-raised ${slot.aspect}`}>
            <Image
              src={project.render.src}
              alt={project.title}
              fill
              sizes={slot.sizes}
              placeholder="blur"
              blurDataURL={project.render.blurDataURL}
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />

            {/* The 3D model underneath. Revealed by hover on pointer devices and
                by the looping alternation on touch; see .work-peek. */}
            <div className="work-peek" aria-hidden="true">
              <Image
                src={project.model.src}
                alt=""
                fill
                sizes={slot.sizes}
                placeholder="blur"
                blurDataURL={project.model.blurDataURL}
                className="object-cover"
              />
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
              aria-hidden="true"
            />

            <span className="work-cta mono-label absolute bottom-4 right-4 z-10 border border-bone/25 bg-ink/60 px-3 py-1.5 text-bone opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              {viewLabel}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink-line pt-4">
            <h3 className="display text-[1.5rem] leading-tight text-bone transition-colors duration-500 group-hover:text-render">
              {project.title}
            </h3>
            <span className="mono-label shrink-0 text-bone-faint">{project.typology}</span>
          </div>
        </button>
      </Reveal>
    </li>
  );
}
