import { notFound } from 'next/navigation';
import Hero from '../components/Hero';
import MethodSection from '../components/MethodSection';
import SpeedSection from '../components/SpeedSection';
import WorkGallery from '../components/WorkGallery';
import Services from '../components/Services';
import Process from '../components/Process';
import About from '../components/About';
import Contact from '../components/Contact';
import { getDictionary, isLocale, locales, type Locale } from '../lib/i18n';
import { getProjects, pickProject } from '../lib/projects';

/** Both locales are known at build time, so both pages prerender as static. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const projects = getProjects(dict);

  // The hero still and the method comparator use different frames on purpose:
  // the gallery opens with the villa, so reusing it directly above would read
  // as a duplicate.
  const heroStill = pickProject(projects, 'villa-luxury-frente-al-mar');
  const methodFrame = pickProject(projects, 'vista-trasera-casa-luxury');

  return (
    <>
      <Hero dict={dict} fallback={heroStill} />
      <MethodSection dict={dict} project={methodFrame} />
      <SpeedSection dict={dict} />
      <WorkGallery dict={dict} projects={projects} />
      <Services dict={dict} />
      <Process dict={dict} />
      <About dict={dict} />
      <Contact dict={dict} locale={locale as Locale} />
    </>
  );
}
