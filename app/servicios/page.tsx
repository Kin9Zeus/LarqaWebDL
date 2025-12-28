import Services from '../components/Services';
import Process from '../components/Process';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicios | Larqa Arquitectura',
  description: 'Servicios de arquitectura, diseño de interiores y consultoría.',
};

export default function ServicesPage() {
  return (
    <main className="bg-background bg-texture min-h-screen">
      <Services />
      <Process />
    </main>
  );
}
