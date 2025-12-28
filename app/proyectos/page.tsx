import Projects from '../components/Projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proyectos | Larqa Arquitectura',
  description: 'Portafolio de proyectos de arquitectura y diseño.',
};

export default function ProjectsPage() {
  return (
    <main className="bg-background bg-texture min-h-screen">
      <Projects />
    </main>
  );
}
