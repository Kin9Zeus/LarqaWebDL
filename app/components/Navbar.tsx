'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { sectionIds } from '../lib/site';
import { useMounted } from '../lib/useMounted';
import { alternateLocale, type Dictionary, type Locale } from '../lib/i18n';

const NAV_ORDER = ['method', 'work', 'services', 'process', 'about'] as const;

export default function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(sectionIds.hero);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const mounted = useMounted();

  const links = NAV_ORDER.map((key) => ({
    key,
    label: dict.nav[key],
    id: sectionIds[key],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy: the section occupying the middle band of the viewport wins.
  useEffect(() => {
    const ids = [sectionIds.hero, ...links.map((l) => l.id), sectionIds.contact];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock the page behind the full-screen mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const other = alternateLocale(locale);

  /** Remember the explicit choice so middleware stops guessing from headers. */
  const rememberLocale = () => {
    document.cookie = `LARQA_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || open
          ? 'border-b border-ink-line/80 bg-ink/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-6 md:px-10">
        <Link
          href={`/${locale}`}
          className="relative block h-7 w-[104px] shrink-0 transition-opacity duration-300 hover:opacity-70 md:h-8 md:w-[120px]"
          aria-label={`LARQA — ${dict.footer.tagline}`}
        >
          <Image
            src="/logo-light.png"
            alt="LARQA"
            fill
            sizes="120px"
            priority
            className="object-contain object-left"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label={dict.nav.method}>
          {links.map((link) => (
            <a
              key={link.key}
              href={`#${link.id}`}
              className={`mono-label transition-colors duration-300 ${
                active === link.id ? 'text-bone' : 'text-bone-dim hover:text-bone'
              }`}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={`/${other}`}
            onClick={rememberLocale}
            className="mono-label hidden text-bone-dim transition-colors duration-300 hover:text-bone sm:block"
            hrefLang={other}
          >
            {dict.nav.switchTo}
          </Link>

          <span className="hidden h-4 w-px bg-ink-line sm:block" aria-hidden="true" />

          <a
            href={`#${sectionIds.contact}`}
            className="mono-label hidden border border-bone/25 px-5 py-2.5 text-bone transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink md:inline-block"
          >
            {dict.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-bone lg:hidden"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {/* Reading progress. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-render"
        style={mounted ? { scaleX: progress, opacity: scrolled ? 1 : 0 } : { scaleX: 0, opacity: 0 }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[var(--nav-h)] z-[99] flex flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-12 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {[...links, { key: 'contact', label: dict.nav.contact, id: sectionIds.contact }].map(
                (link, i) => (
                  <motion.a
                    key={link.key}
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="display flex items-baseline gap-4 border-b border-ink-line py-5 text-[2rem] text-bone"
                  >
                    <span className="mono-label text-bone-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </motion.a>
                )
              )}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex items-center justify-between"
            >
              <Link
                href={`/${other}`}
                onClick={rememberLocale}
                className="mono-label text-bone-dim"
                hrefLang={other}
              >
                {dict.nav.switchTo}
              </Link>
              <a
                href={`#${sectionIds.contact}`}
                onClick={() => setOpen(false)}
                className="mono-label border border-bone/25 px-6 py-3 text-bone"
              >
                {dict.nav.cta}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
