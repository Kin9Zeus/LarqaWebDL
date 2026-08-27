/**
 * Single source of truth for LARQA's real-world contact details.
 *
 * whatsappNumber is LARQA's business line, digits only with the country code
 * first (no +, no spaces) — that is the format wa.me expects. The env var is
 * kept as an override for staging; note that NEXT_PUBLIC_* is inlined at build
 * time, so changing it requires a rebuild, not just a restart.
 */
export const site = {
  name: 'LARQA',
  legalName: 'LARQA Arquitectura',
  architect: 'Laura Martínez',
  url: 'https://www.larqa.co',
  email: 'larqa.arquitectura@gmail.com',
  instagram: 'https://www.instagram.com/larqa_arquitectura',
  instagramHandle: '@larqa_arquitectura',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573007173422',
} as const;

/** Builds a wa.me deep link with a pre-written first message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Anchor ids used by the navbar and the section elements. Order matters. */
export const sectionIds = {
  hero: 'inicio',
  method: 'metodo',
  work: 'proyectos',
  services: 'servicios',
  process: 'proceso',
  about: 'arquitecta',
  contact: 'contacto',
} as const;
