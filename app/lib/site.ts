/**
 * Single source of truth for LARQA's real-world contact details.
 *
 * NOTE: WHATSAPP_NUMBER is still a placeholder — replace it with Laura's real
 * number (digits only, country code first, no + or spaces) or set
 * NEXT_PUBLIC_WHATSAPP_NUMBER in the environment.
 */
export const site = {
  name: 'LARQA',
  legalName: 'LARQA Arquitectura',
  architect: 'Laura Martínez',
  url: 'https://www.larqa.co',
  email: 'larqa.arquitectura@gmail.com',
  instagram: 'https://www.instagram.com/larqa_arquitectura',
  instagramHandle: '@larqa_arquitectura',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573001234567',
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
