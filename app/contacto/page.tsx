import Contact from '../components/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Larqa Arquitectura',
  description: 'Contáctanos para iniciar tu próximo proyecto de arquitectura.',
};

export default function ContactPage() {
  return (
    <main className="bg-background bg-texture min-h-screen pt-20">
      <Contact />
    </main>
  );
}
