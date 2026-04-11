'use client';
import { motion } from 'framer-motion';
import { Pencil, Ruler, Hammer, Key } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Pencil,
    title: "Concepto",
    description: "Escuchamos tu visión y trazamos las primeras líneas. Definimos la esencia del proyecto."
  },
  {
    id: 2,
    icon: Ruler,
    title: "Desarrollo",
    description: "Convertimos ideas en planos técnicos precisos. Cada detalle es calculado y especificado."
  },
  {
    id: 3,
    icon: Hammer,
    title: "Ejecución",
    description: "Supervisamos la obra para asegurar que la realidad supere a la visualización."
  },
  {
    id: 4,
    icon: Key,
    title: "Entrega",
    description: "Te entregamos no solo un espacio, sino un nuevo escenario para tu vida."
  }
];

export default function Process() {
  return (
    <section className="py-24 px-6 bg-beige-100">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <span className="text-sm uppercase tracking-widest text-beige-900 mb-4 block">Metodología</span>
          <h2 className="text-4xl md:text-5xl font-serif text-black-rich">Nuestro Proceso</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-beige-300 z-0"></div>

          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border border-beige-200 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:border-black-rich">
                <step.icon size={32} className="text-black-rich stroke-1" />
              </div>
              <h3 className="text-2xl font-serif text-black-rich mb-4">{step.title}</h3>
              <p className="text-black-soft font-light text-sm leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
