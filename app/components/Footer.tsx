import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { sectionIds, site, whatsappLink } from '../lib/site';
import type { Dictionary, Locale } from '../lib/i18n';

const NAV_KEYS = ['method', 'work', 'services', 'process', 'about', 'contact'] as const;

export default function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line bg-ink-sunken">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative h-9 w-[132px]">
              <Image
                src="/logo-light.png"
                alt="LARQA"
                fill
                sizes="132px"
                className="object-contain object-left"
              />
            </div>
            <p className="eyebrow mt-6">{dict.footer.tagline}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone/50">
              {site.architect} · {dict.about.role}
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label={dict.footer.navTitle}>
            <p className="eyebrow mb-6">{dict.footer.navTitle}</p>
            <ul className="space-y-3.5">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <a
                    href={`#${sectionIds[key]}`}
                    className="link-wipe text-sm text-bone/60 transition-colors duration-300 hover:text-bone"
                  >
                    {dict.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">{dict.footer.contactTitle}</p>
            <ul className="space-y-3.5">
              {[
                { label: site.email, href: `mailto:${site.email}` },
                { label: dict.contact.whatsapp, href: whatsappLink(dict.common.whatsappMessage) },
                { label: site.instagramHandle, href: site.instagram },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-1.5 text-sm text-bone/60 transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.25}
                      className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-bone-faint">
            © {year} {site.legalName}. {dict.footer.rights}
          </p>
          <p className="mono-label text-bone-faint" lang={locale}>
            {dict.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
