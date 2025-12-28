import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import SelectedWork from './components/SelectedWork';

export default function Home() {
  return (
    <main className="w-full relative bg-background bg-texture selection:bg-beige-200 selection:text-black-rich min-h-screen">
      <Hero />
      <Philosophy />
      <SelectedWork />
    </main>
  );
}
