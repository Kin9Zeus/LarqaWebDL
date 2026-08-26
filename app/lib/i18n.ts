import es from './dictionaries/es.json';
import en from './dictionaries/en.json';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

/** The Spanish dictionary is the source of truth for the shape. */
export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** The other locale, for the language toggle. */
export function alternateLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};
