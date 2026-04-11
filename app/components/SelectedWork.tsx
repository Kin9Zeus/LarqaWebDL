'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SelectedWork() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-sm uppercase tracking-widest text-beige-900 mb-4 block">Portafolio Destacado</span>
            <h2 className="text-4xl md:text-5xl font-serif text-black-rich">Obras Recientes</h2>
          </div>
          <Link href="/proyectos" className="group flex items-center gap-2 text-sm uppercase tracking-widest text-black-rich mt-6 md:mt-0 cursor-hover">
            Ver todo el portafolio
            <span className="group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Featured Project Big Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 relative h-[60vh] overflow-hidden group cursor-hover"
          >
            <Image 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
              alt="Casa del Lago"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
          </motion.div>
          
          <div className="lg:col-span-4 flex flex-col justify-end p-4">
            <span className="text-xs uppercase tracking-widest text-beige-600 mb-2">Residencial / 2024</span>
            <h3 className="text-3xl font-serif text-black-rich mb-4">Casa del Lago</h3>
            <p className="text-black-soft font-light mb-8 text-sm leading-relaxed">
              Un refugio minimalista diseñado para fundirse con el paisaje lacustre. Materiales autóctonos y grandes ventanales que borran el límite entre interior y exterior.
            </p>
            <Link href="/proyectos" className="inline-block text-xs uppercase tracking-widest border-b border-black-rich pb-1 self-start hover:text-beige-600 hover:border-beige-600 transition-colors cursor-hover">
              Ver Proyecto
            </Link>
          </div>
        </div>

        {/* Secondary Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Oficinas Norte",
              category: "Corporativo",
              image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Apartamento 502",
              category: "Interiorismo",
              image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
            }
          ].map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group cursor-hover"
            >
              <div className="relative h-[400px] mb-6 overflow-hidden">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-serif text-black-rich group-hover:text-beige-600 transition-colors">{project.title}</h3>
                <span className="text-xs uppercase tracking-widest text-gray-400">{project.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
