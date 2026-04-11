'use client';
import Image from 'next/image';

export default function StudioLocation() {
  return (
    <section className="pb-24 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="relative w-full h-[500px] overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
           {/* Placeholder for a stylized map or studio location shot */}
           <Image 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
             alt="Oficina del estudio Larqa Arquitectura en Bogotá, Colombia"
             fill
             sizes="(max-width: 1280px) 100vw, 1280px"
             className="object-cover"
           />
           <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
             <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 text-center max-w-md">
                <h3 className="text-2xl font-serif text-black-rich mb-4">Visítanos</h3>
                <p className="text-black-soft font-light mb-6">
                  Calle de la Arquitectura, 10-20<br/>
                  Bogotá, Colombia
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest border-b border-black-rich pb-1 hover:text-beige-600 hover:border-beige-600 transition-colors"
                >
                  Ver en Google Maps
                </a>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
