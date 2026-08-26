'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dictionary } from '../lib/i18n';
import type { WorkProject } from '../lib/projects';

type ComparatorProps = {
  project: WorkProject;
  dict: Dictionary;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** Reports 0–1 so a parent section can tint itself with the same value. */
  onRevealChange?: (reveal: number) => void;
};

/**
 * The signature element: one frame in two states.
 *
 * The interactive surface is a real <input type="range"> laid over the image
 * at zero opacity. That buys native keyboard support, native touch dragging,
 * click-to-jump and screen-reader semantics for free — all of which a
 * hand-rolled pointer handler would have to reimplement and would get subtly
 * wrong.
 */
export default function Comparator({
  project,
  dict,
  priority = false,
  className = '',
  sizes = '(min-width: 1024px) 70vw, 100vw',
  onRevealChange,
}: ComparatorProps) {
  const [position, setPosition] = useState(38);
  const [touched, setTouched] = useState(false);
  const id = useId();

  const update = (value: number) => {
    setPosition(value);
    if (!touched) setTouched(true);
    onRevealChange?.(value / 100);
  };

  const aspect = `${project.render.width} / ${project.render.height}`;

  return (
    <figure className={`compare-shell relative overflow-hidden bg-ink-raised ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        {/* Base state: the finished render. */}
        <Image
          src={project.render.src}
          alt={`${project.title} — ${dict.method.labelRender}`}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={project.render.blurDataURL}
          className="object-cover"
        />

        {/* Overlay state: the untextured 3D model, clipped to the left. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={project.model.src}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL={project.model.blurDataURL}
            className="object-cover"
          />
        </div>

        {/* State labels. Each dims when its side is mostly hidden. */}
        <span
          className="mono-label pointer-events-none absolute left-4 top-4 z-20 border border-bone/20 bg-ink/70 px-3 py-1.5 text-bone backdrop-blur-sm transition-opacity duration-300 md:left-6 md:top-6"
          style={{ opacity: position < 12 ? 0 : 1 }}
        >
          {dict.method.labelModel}
        </span>
        <span
          className="mono-label pointer-events-none absolute right-4 top-4 z-20 border border-render/30 bg-ink/70 px-3 py-1.5 text-render backdrop-blur-sm transition-opacity duration-300 md:right-6 md:top-6"
          style={{ opacity: position > 88 ? 0 : 1 }}
        >
          {dict.method.labelRender}
        </span>

        {/* Divider + grip */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-bone/90 mix-blend-difference"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-ink/40 backdrop-blur-md">
            <ChevronLeft size={13} strokeWidth={1.5} className="text-bone" />
            <ChevronRight size={13} strokeWidth={1.5} className="text-bone" />
          </span>
        </div>

        {/* The actual control. */}
        <label htmlFor={id} className="sr-only">
          {dict.method.sliderLabel}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={position}
          onChange={(e) => update(Number(e.target.value))}
          className="absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
          style={{ touchAction: 'pan-y' }}
          aria-valuetext={`${Math.round(position)}% ${dict.method.labelModel}`}
        />

        {/* Affordance, retired once the visitor has understood it. */}
        <div
          className={`pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap border border-bone/20 bg-ink/70 px-4 py-2 backdrop-blur-sm transition-all duration-500 md:bottom-6 ${
            touched ? 'translate-y-3 opacity-0' : 'opacity-100'
          }`}
        >
          <span className="mono-label text-bone">{dict.method.dragHint}</span>
        </div>
      </div>

      <figcaption className="sr-only">
        {project.title} — {project.typology}. {dict.method.keyboardHint}
      </figcaption>
    </figure>
  );
}
