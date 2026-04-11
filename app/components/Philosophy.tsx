'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function Philosophy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section ref={ref} className="py-32 px-6 bg-beige-50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            style={{ opacity }}
            className="z-10 order-2 lg:order-1"
          >
            <span className="text-sm uppercase tracking-widest text-beige-900 mb-6 block">Nuestra Filosofía</span>
            <h2 className="text-4xl md:text-6xl font-serif text-black-rich mb-8 leading-tight">
              Arquitectura que <br/>
              <span className="italic text-beige-600">dialoga</span> con el entorno.
            </h2>
            <p className="text-lg font-light text-black-soft mb-8 leading-relaxed">
              En Larqa, creemos que el diseño no es solo visual, es sensorial. Creamos espacios que capturan la luz, abrazan la naturaleza y elevan la experiencia humana. Cada línea trazada busca el equilibrio entre la firmeza de la estructura y la delicadeza del habitar.
            </p>
          </motion.div>

          {/* Parallax Image */}
          <div className="relative h-[600px] w-full overflow-hidden order-1 lg:order-2 rounded-sm">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" 
                alt="Casa moderna con diseño minimalista integrada al paisaje natural" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
