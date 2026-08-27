'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Scroll entrances, built as progressive enhancement rather than with Framer
 * Motion.
 *
 * Framer renders its `initial` state into the server HTML as an inline
 * `opacity: 0`, so any browser that fails to run the JS shows a page of blank
 * space — which is exactly what Instagram's in-app WebView did. Here the
 * markup ships in its finished state and the hidden start lives in CSS behind
 * `html.js`, a class added only when IntersectionObserver is available to
 * reveal it again. No JS, no hiding.
 */
function useInView<T extends HTMLElement>(rootMargin = '-80px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Custom properties consumed by the .reveal rules in globals.css. */
function vars(delay: number, y?: number): CSSProperties {
  const style: Record<string, string> = { '--reveal-delay': `${delay}s` };
  if (y !== undefined) style['--reveal-y'] = `${y}px`;
  return style as CSSProperties;
}

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before this element starts. Use to stagger siblings. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={vars(delay, y)}
      className={`reveal${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}

/**
 * A hairline that draws itself left-to-right when it enters. Used as the
 * divider under section titles.
 */
export function RevealRule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={vars(delay)}
      className={`rule reveal-rule${inView ? ' is-in' : ''} ${className}`}
    />
  );
}

/**
 * Word-by-word entrance for display headlines. Splits on spaces and keeps each
 * word unbreakable so the line breaks stay where the layout wants them.
 */
export function RevealWords({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>('-60px');
  const words = text.split(' ');

  return (
    <span ref={ref} className={`${inView ? 'is-in ' : ''}${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="reveal-word-mask inline-block overflow-hidden align-bottom"
        >
          <span className="reveal-word inline-block" style={vars(delay + i * 0.06)}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
