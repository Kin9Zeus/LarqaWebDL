'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { sectionIds } from '../lib/site';
import { useMounted } from '../lib/useMounted';
import type { Dictionary } from '../lib/i18n';
import type { WorkProject } from '../lib/projects';

/**
 * The hero is a scroll-scrubbed film of the architectural process: drawing →
 * 3D model → render → built work. The film carries that sequence on its own —
 * there is no label overlay, so nothing competes with the headline.
 *
 * Desktop scrubs the video against scroll position. Mobile plays it as a
 * normal autoplaying loop instead — seeking `currentTime` every frame is
 * expensive on iOS Safari and produces exactly the stutter we are trying to
 * avoid. Both degrade to a still frame if the video is missing.
 */
export default function Hero({ dict, fallback }: { dict: Dictionary; fallback: WorkProject }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mode, setMode] = useState<'scrub' | 'loop'>('loop');
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.32, 0.5], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  // Scroll-linked styles are withheld until after hydration; see useMounted.
  const mounted = useMounted();
  const fadeStyle = mounted ? { opacity: contentOpacity } : undefined;

  // Decide scrub vs loop once, and re-decide on resize.
  useEffect(() => {
    const decide = () => {
      const wide = window.matchMedia('(min-width: 768px)').matches;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setMode(wide && !still ? 'scrub' : 'loop');
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, []);

  // The hero video files are supplied separately. Until they land, `onError`
  // covers browsers that report exhausted sources, and this timeout covers the
  // ones that quietly stall — either way we fall back to the still frame.
  useEffect(() => {
    if (videoReady || videoFailed) return;
    const id = window.setTimeout(() => setVideoFailed(true), 4000);
    return () => window.clearTimeout(id);
  }, [videoReady, videoFailed]);

  // Scrub the video against smoothed scroll progress.
  useEffect(() => {
    if (mode !== 'scrub' || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    let raf = 0;
    let last = -1;

    const tick = () => {
      const duration = video.duration;
      if (duration && Number.isFinite(duration)) {
        const t = Math.min(duration - 0.05, Math.max(0, smooth.get() * duration));
        // Only seek on a meaningful delta; redundant seeks stall the decoder.
        if (Math.abs(t - last) > 0.02) {
          video.currentTime = t;
          last = t;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, videoFailed, smooth]);

  // In loop mode the browser drives playback.
  useEffect(() => {
    if (mode !== 'loop' || videoFailed) return;
    videoRef.current?.play().catch(() => {
      /* autoplay blocked — the poster frame still reads correctly */
    });
  }, [mode, videoFailed]);

  return (
    <section
      ref={sectionRef}
      id={sectionIds.hero}
      className="relative h-screen md:h-[320vh]"
      aria-label={dict.hero.eyebrow}
    >
      {/* pt reserves the fixed navbar's band so the bottom-anchored content can
          never slide underneath it. The media layer is absolutely positioned
          against the padding box, so it still fills the frame edge to edge. */}
      <div className="hero-anchor sticky top-0 flex h-screen overflow-hidden pt-[var(--nav-h)]">
        {/* Media layer */}
        <motion.div className="absolute inset-0" style={mounted ? { scale: mediaScale } : undefined}>
          {videoFailed ? (
            <Image
              src={fallback.render.src}
              alt={dict.hero.videoAlt}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={fallback.render.blurDataURL}
              className="object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={fallback.render.src}
              muted
              playsInline
              loop={mode === 'loop'}
              autoPlay={mode === 'loop'}
              preload="auto"
              aria-label={dict.hero.videoAlt}
              onLoadedMetadata={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            >
              <source src="/video/hero-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
              <source src="/video/hero-mobile.mp4" type="video/mp4" />
            </video>
          )}
        </motion.div>

        {/* Scrim: keeps the display type legible over any frame of the film. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Content */}
        <motion.div
          style={mounted ? { opacity: contentOpacity, y: contentY } : undefined}
          className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-[clamp(2.5rem,8vh,6rem)] md:px-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow mb-5 flex items-center gap-3 md:mb-7"
          >
            <span className="inline-block h-px w-8 bg-render" aria-hidden="true" />
            {dict.hero.eyebrow}
          </motion.p>

          <h1 className="display max-w-[16ch] text-display-xl">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {dict.hero.titleLead}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-render"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                {dict.hero.titleAccent}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-bone/75 md:mt-8 md:text-lg"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 md:mt-11"
          >
            <a
              href={`#${sectionIds.method}`}
              className="mono-label group inline-flex items-center justify-center gap-3 bg-bone px-8 py-4 text-ink transition-colors duration-500 hover:bg-render"
            >
              {dict.hero.ctaPrimary}
              <ArrowDown
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-500 group-hover:translate-y-1"
              />
            </a>
            <a
              href={`#${sectionIds.contact}`}
              className="mono-label inline-flex items-center justify-center border border-bone/25 px-8 py-4 text-bone transition-colors duration-500 hover:border-bone"
            >
              {dict.hero.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={fadeStyle}
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          aria-hidden="true"
        >
          <span className="mono-label text-bone-faint">{dict.hero.scrollHint}</span>
          <span className="scroll-cue block h-10 w-px bg-bone/40" />
        </motion.div>
      </div>
    </section>
  );
}
