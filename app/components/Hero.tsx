'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-mesh">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-beige-200 rounded-full blur-[60px] md:blur-[100px]"
          style={{ willChange: 'transform' }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-beige-100 rounded-full blur-[80px] md:blur-[120px]"
          style={{ willChange: 'transform' }}
          animate={{
            x: [0, -50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="block text-xs md:text-sm uppercase tracking-[0.4em] text-beige-900 mb-6">
            Estudio de Arquitectura
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-black-rich mb-8 tracking-tight">
            LARQA
          </h1>
          <div className="h-px w-24 bg-black-rich/20 mx-auto mb-8"></div>
          <p className="text-lg md:text-2xl font-light text-black-soft leading-relaxed">
            <span className="italic">Serenidad</span> &bull; <span className="italic">Vitalidad</span> &bull; <span className="italic">Firmeza</span> &bull; <span className="italic">Delicadeza</span>
          </p>
        </motion.div>
      </div>

      {/* Bottom Wave/Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>
    </section>
  );
}
