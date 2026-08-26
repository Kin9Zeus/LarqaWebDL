'use client';

import { useEffect, useRef } from 'react';

/**
 * A trailing ring that follows the pointer and opens up over interactive
 * elements. The native cursor is left visible on purpose — hiding it costs
 * more in usability than the effect returns.
 *
 * Disabled entirely on touch devices and under reduced-motion.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    const ring = ringRef.current;
    if (!ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = '1';
      }
      const el = e.target as HTMLElement | null;
      targetScale = el?.closest('a, button, input, textarea, select, [data-cursor="grow"]')
        ? 2.4
        : 1;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
    };

    // Lerp toward the pointer so the ring lags behind it slightly.
    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      scale += (targetScale - scale) * 0.14;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[150] hidden h-8 w-8 rounded-full border border-bone/40 opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
      style={{ willChange: 'transform' }}
    />
  );
}
