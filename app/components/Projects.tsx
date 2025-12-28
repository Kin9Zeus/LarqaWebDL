'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';

const projects = [
  { 
    id: 1, 
    title: 'Casa del Bosque', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    year: '2023',
    location: 'Valle de Bravo, MX',
    area: '450 m²',
    description: 'Un refugio diseñado para desaparecer en el paisaje. La Casa del Bosque utiliza materiales locales como piedra volcánica y madera de pino para crear una atmósfera de completa integración. Los grandes ventanales permiten que la luz natural bañe cada rincón, creando un juego de sombras que cambia con el día.',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    id: 2, 
    title: 'Torre Vista', 
    category: 'Comercial', 
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    year: '2022',
    location: 'Ciudad de México',
    area: '12,000 m²',
    description: 'Un hito vertical que redefine el skyline urbano. Torre Vista combina eficiencia energética con una estética brutalista refinada. Sus jardines verticales en cada tercer nivel proporcionan pulmones verdes para los usuarios y la ciudad.',
    gallery: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    id: 3, 
    title: 'Refugio Andino', 
    category: 'Residencial', 
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop',
    year: '2024',
    location: 'Cusco, PE',
    area: '280 m²',
    description: 'Situado a 3,400 metros de altura, este refugio reinterpreta la arquitectura vernácula con técnicas contemporáneas. Muros de adobe reforzado y techos de paja se combinan con acero corten para resistir el clima extremo sin perder calidez.',
    gallery: [
      'https://images.unsplash.com/photo-1518732656745-d417788bc796?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    id: 4, 
    title: 'Centro Cultural', 
    category: 'Público', 
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop',
    year: '2021',
    location: 'Bogotá, CO',
    area: '3,500 m²',
    description: 'Un espacio diseñado para la comunidad. El Centro Cultural actúa como un lienzo en blanco para la expresión artística. Su atrio central de triple altura conecta todas las salas de exposición, fomentando el encuentro y el diálogo.',
    gallery: [
      'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    id: 5, 
    title: 'Loft Industrial', 
    category: 'Interiorismo', 
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
    year: '2023',
    location: 'Medellín, CO',
    area: '120 m²',
    description: 'Transformación de una antigua bodega textil en vivienda de lujo. Se conservaron las texturas originales de ladrillo y concreto, añadiendo capas de suavidad con textiles naturales y madera de roble.',
    gallery: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=800&auto=format&fit=crop'
    ]
  },
];

export default function Projects() {
  const targetRef = useRef(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Adjust transform range based on number of projects to ensure full scroll
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      // Reset scroll position of details panel
      if (detailsRef.current) {
        detailsRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  const handleNextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  return (
    <section ref={targetRef} className="relative h-auto md:h-[400vh] bg-beige-50">
      <div className="relative md:sticky md:top-0 flex h-auto md:h-screen items-center md:overflow-hidden pt-32 pb-8 md:py-0">
        <motion.div style={{ x: isMobile ? 0 : x }} className="flex gap-6 md:gap-16 px-6 md:px-24 overflow-x-auto md:overflow-visible w-full md:w-auto snap-x snap-mandatory md:snap-none pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex-shrink-0 w-[85vw] md:w-[400px] h-[50vh] md:h-[60vh] flex flex-col justify-center snap-center">
                <span className="text-sm uppercase tracking-widest text-beige-900 mb-4">Portafolio</span>
                <h1 className="text-5xl md:text-7xl font-serif text-black-rich mb-6">Proyectos <br/> Seleccionados</h1>
                <div className="w-12 h-1 bg-black-rich mb-6"></div>
                <p className="text-black-soft text-lg font-light leading-relaxed">
                  Espacios que dialogan con el entorno. Diseños que inspiran calma y vitalidad.
                </p>
                <div className="mt-8 text-sm text-gray-400 animate-pulse md:block hidden">
                  (Scroll hacia abajo para explorar)
                </div>
                <div className="mt-8 text-sm text-gray-400 animate-pulse md:hidden">
                  (Desliza para explorar →)
                </div>
            </div>
          {projects.map((project) => (
            <motion.div 
              layoutId={`project-card-${project.id}`}
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group relative flex-shrink-0 w-[85vw] md:w-[600px] h-[60vh] md:h-[70vh] overflow-hidden bg-white shadow-sm cursor-pointer snap-center"
            >
              <motion.div layoutId={`project-image-${project.id}`} className="relative w-full h-full">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none"></div>
              
              <motion.div 
                layoutId={`project-info-${project.id}`}
                className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-100 transition-all duration-500 pointer-events-none"
              >
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">{project.category}</p>
                <h3 className="text-3xl md:text-4xl font-serif mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                <div className="h-px w-0 bg-white group-hover:w-full transition-all duration-700"></div>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-xs uppercase tracking-widest">
                  Ver Detalles <ArrowRight size={14} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div 
              layoutId={`project-card-${selectedProject.id}`}
              className="relative w-full h-full md:w-[90vw] md:h-[90vh] bg-white overflow-hidden shadow-2xl md:rounded-sm flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
                className="absolute top-6 right-6 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black-rich transition-colors duration-300"
              >
                <X size={24} />
              </button>

              {/* Left Column: Image (Sticky on Desktop) */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-full relative">
                <motion.div layoutId={`project-image-${selectedProject.id}`} className="w-full h-full relative">
                    <Image
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                </motion.div>
                
                {/* Overlay Title on Mobile */}
                <div className="absolute bottom-0 left-0 p-6 md:hidden text-white z-20">
                    <span className="text-xs uppercase tracking-widest opacity-80">{selectedProject.category}</span>
                    <h2 className="text-3xl font-serif">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Right Column: Details (Scrollable) */}
              <div ref={detailsRef} className="w-full md:w-1/2 h-full overflow-y-auto bg-white p-8 md:p-16 relative">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-xl mx-auto"
                 >
                    {/* Header (Desktop) */}
                    <div className="hidden md:block mb-12">
                        <span className="text-sm uppercase tracking-widest text-beige-900 block mb-2">{selectedProject.category}</span>
                        <h2 className="text-5xl font-serif text-black-rich mb-6">{selectedProject.title}</h2>
                        <div className="w-12 h-1 bg-black-rich"></div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-12 border-b border-black-rich/10 pb-12">
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Año</h4>
                            <p className="text-black-rich font-medium">{selectedProject.year}</p>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Ubicación</h4>
                            <p className="text-black-rich font-medium">{selectedProject.location}</p>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Área</h4>
                            <p className="text-black-rich font-medium">{selectedProject.area}</p>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Servicios</h4>
                            <p className="text-black-rich font-medium">Diseño, Construcción</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-serif text-black-rich mb-6">Sobre el Proyecto</h3>
                        <p className="text-black-soft font-light leading-relaxed text-lg">
                            {selectedProject.description}
                        </p>
                    </div>

                    {/* Gallery */}
                    <div className="w-full">
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="text-2xl font-serif text-black-rich">Galería</h3>
                            <span className="text-xs uppercase tracking-widest text-gray-400 hidden md:block">Desliza para explorar</span>
                        </div>
                        
                        {/* Carousel Container with negative margins to bleed to edges */}
                        <div className="flex gap-6 overflow-x-auto pb-8 -mx-8 px-8 md:-mx-16 md:px-16 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {selectedProject.gallery.map((img, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="relative flex-shrink-0 w-[85%] md:w-[350px] h-[250px] md:h-[300px] snap-center rounded-sm overflow-hidden shadow-md group cursor-pointer"
                                >
                                    <Image 
                                        src={img}
                                        alt={`${selectedProject.title} - Vista ${idx + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                    
                                    {/* Card overlay info */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-xs uppercase tracking-widest">Vista {idx + 1}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-[-10px] md:hidden animate-pulse">Desliza →</p>
                    </div>

                    {/* Navigation Footer */}
                    <div className="mt-16 pt-8 border-t border-black-rich/10 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-gray-400">Siguiente Proyecto</span>
                        <button onClick={handleNextProject} className="group flex items-center gap-2 text-black-rich hover:text-beige-600 transition-colors cursor-hover">
                            Ver Siguiente <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
