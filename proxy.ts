import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './app/lib/i18n';

const PUBLIC_FILE = /\.[^/]+$/;

/** Routes from the previous multi-page site → the section that replaced them. */
const LEGACY_ROUTES: Record<string, string> = {
  '/proyectos': 'proyectos',
  '/servicios': 'servicios',
  '/contacto': 'contacto',
};

/**
 * Picks the best locale from Accept-Language, falling back to Spanish.
 * Kept dependency-free: the header is simple enough that Negotiator/intl
 * would be more weight than value for two locales.
 */
function detectLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language');
  if (!header) return defaultLocale;

  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q.split('=')[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    const match = locales.find((l) => l === base);
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, Next internals, and anything that looks like a static file.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // A returning visitor's explicit choice beats their browser header.
  const stored = request.cookies.get('LARQA_LOCALE')?.value;
  const locale =
    stored && locales.includes(stored as (typeof locales)[number])
      ? stored
      : detectLocale(request);

  const url = request.nextUrl.clone();

  // The previous site was multi-page and these three paths are indexed. They
  // now map to sections of the single landing page — without this they would
  // resolve to /{locale}/proyectos and 404, losing the existing search
  // rankings. Sent as 308 so the move is recorded as permanent.
  const anchor = LEGACY_ROUTES[pathname];
  if (anchor) {
    url.pathname = `/${locale}`;
    url.hash = anchor;
    return NextResponse.redirect(url, 308);
  }

  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
