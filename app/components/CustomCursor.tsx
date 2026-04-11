'use client';
import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number>(0);
  const isTouchDevice = useRef(false);

  const updateCursorStyle = useCallback(() => {
    if (!cursorRef.current) return;
    const { x, y } = positionRef.current;
    const scale = isHoveringRef.current ? 4 : 1;
    const opacity = isHoveringRef.current ? 0.2 : 1;
    cursorRef.current.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0) scale(${scale})`;
    cursorRef.current.style.opacity = String(opacity);
  }, []);

  useEffect(() => {
    // Detect touch devices
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCursorStyle);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const wasHovering = isHoveringRef.current;
      isHoveringRef.current = !!(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-hover')
      );
      if (wasHovering !== isHoveringRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateCursorStyle);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateCursorStyle]);

  // Don't render on touch devices (SSR-safe: render but hide via CSS)
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-black-rich rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ 
        willChange: 'transform, opacity',
        transition: 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease',
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    />
  );
}
