import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Italiana, Jost, IBM_Plex_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import CustomCursor from '../components/CustomCursor';
import { locales, isLocale, getDictionary, type Locale } from '../lib/i18n';
import { site } from '../lib/site';
import '../globals.css';

/* Italiana mirrors the logo's high-contrast didone wordmark; Jost mirrors the
   wide-tracked geometric sans of the "ARQUITECTURA" lockup underneath it. */
const italiana = Italiana({
  variable: '--font-italiana',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/es',
        en: '/en',
        'x-default': '/es',
      },
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_ES',
      url: `${site.url}/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/og.jpg'],
    },
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: '#0b0c0e',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#larqa`,
    name: site.legalName,
    url: `${site.url}/${locale}`,
    image: `${site.url}/og.jpg`,
    description: dict.meta.description,
    email: site.email,
    sameAs: [site.instagram],
    founder: {
      '@type': 'Person',
      name: site.architect,
      jobTitle: dict.about.role,
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Architectural visualization',
      'AI-assisted rendering',
      '3D modeling',
      'Interior design',
      'Architectural design',
    ],
  };

  return (
    <html
      lang={locale}
      className={`${italiana.variable} ${jost.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain bg-ink text-bone antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-bone focus:px-4 focus:py-3 focus:text-sm focus:text-ink"
        >
          {dict.nav.skipToContent}
        </a>

        <CustomCursor />
        <Navbar dict={dict} locale={locale as Locale} />
        <main id="main">{children}</main>
        <Footer dict={dict} locale={locale as Locale} />
        <WhatsAppFloat dict={dict} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
