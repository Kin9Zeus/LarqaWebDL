'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const services = [
  {
    id: 1,
    title: "Diseño Arquitectónico",
    description: "Creación de espacios únicos que fusionan funcionalidad y estética. Desde residencias privadas hasta complejos comerciales, nos enfocamos en una arquitectura que respira.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Interiorismo",
    description: "Transformamos ambientes interiores para reflejar la esencia de quienes los habitan. Selección de materiales, iluminación y mobiliario con un enfoque minimalista.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Consultoría y Gestión",
    description: "Acompañamiento integral durante todo el proceso constructivo. Aseguramos que el diseño se ejecute fielmente, cuidando el presupuesto y los tiempos.",
    image: "https://images.unsplash.com/photo-1553877615-30c73165327b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Paisajismo",
    description: "Integración de la arquitectura con el entorno natural. Diseñamos jardines y espacios exteriores que promueven la serenidad y la conexión con la naturaleza.",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function Services() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 min-h-screen bg-mesh relative">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Title & Image Reveal */}
        <div className="lg:col-span-5 relative hidden lg:block h-[60vh] sticky top-32">
          <div className="relative w-full h-full overflow-hidden rounded-sm bg-beige-100">
             {services.map((service) => (
                <motion.div
                    key={service.id}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                        opacity: hoveredService === service.id ? 1 : 0,
                        scale: hoveredService === service.id ? 1 : 1.1
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Image 
                        src={service.image} 
                        alt={service.title}
                        fill
                        className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
                </motion.div>
             ))}
             {/* Default Image or Placeholder when nothing hovered */}
             <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${hoveredService ? 'opacity-0' : 'opacity-100'}`}>
                <span className="text-beige-300 font-serif text-6xl opacity-20 italic">Larqa</span>
             </div>
          </div>
        </div>

        {/* Right Column: Editorial List */}
        <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-16"
            >
                <span className="text-sm uppercase tracking-widest text-beige-900 mb-4 block">Lo que hacemos</span>
                <h1 className="text-5xl md:text-7xl font-serif text-black-rich mb-8">Nuestros Servicios</h1>
                <p className="text-lg font-light text-black-soft max-w-lg leading-relaxed">
                    Soluciones integrales donde cada línea tiene un propósito y cada material cuenta una historia.
                </p>
            </motion.div>

            <div className="flex flex-col">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredService(service.id)}
                        onMouseLeave={() => setHoveredService(null)}
                        className="group border-t border-black-rich/10 py-12 cursor-hover transition-colors duration-500 hover:bg-white/40"
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
                            <h3 className="text-3xl md:text-4xl font-serif text-black-rich group-hover:translate-x-4 transition-transform duration-500 ease-out">
                                {service.title}
                            </h3>
                            <span className="text-xs font-mono text-gray-400 mt-2 md:mt-0">0{service.id}</span>
                        </div>
                        <p className="text-black-soft font-light leading-relaxed max-w-xl group-hover:translate-x-4 transition-transform duration-500 ease-out delay-75 opacity-70 group-hover:opacity-100">
                            {service.description}
                        </p>
                    </motion.div>
                ))}
                <div className="border-t border-black-rich/10"></div>
            </div>
        </div>
      </div>
    </section>
  );
}
