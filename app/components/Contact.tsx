'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    countryCode: '+57',
    whatsapp: '',
    service: 'Diseño Arquitectónico',
    preference: 'email',
    message: ''
  });

  const countryCodes = [
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+52', country: 'México', flag: '🇲🇽' },
    { code: '+1', country: 'USA/Canadá', flag: '🇺🇸' },
    { code: '+34', country: 'España', flag: '🇪🇸' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+51', country: 'Perú', flag: '🇵🇪' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+507', country: 'Panamá', flag: '🇵🇦' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+1-809', country: 'Rep. Dominicana', flag: '🇩🇴' },
    { code: '+other', country: 'Otro', flag: '🌍' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    
    try {
      const submissionData = {
        ...formData,
        whatsapp: `${formData.countryCode} ${formData.whatsapp}`
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setFormState('success');
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            countryCode: '+57',
            whatsapp: '',
            service: 'Diseño Arquitectónico',
            preference: 'email',
            message: ''
        });
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormState('error');
    }
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-start">
        
        {/* Info */}
        <div className="relative z-10">
          <span className="text-sm uppercase tracking-widest text-beige-900 mb-4 block">Contacto</span>
          <h2 className="text-4xl md:text-6xl font-serif text-black-rich mb-8">Iniciemos tu <br/> Próximo Proyecto</h2>
          <p className="text-black-soft mb-12 text-lg font-light leading-relaxed">
            ¿Listo para transformar tu visión en realidad? Contáctanos para una consulta inicial o solicita un presupuesto detallado. Nos especializamos en crear espacios que transmiten serenidad y vitalidad.
          </p>
          
          <div className="space-y-6 text-black-rich font-light">
            <div className="cursor-hover inline-block">
              <h4 className="text-sm uppercase tracking-widest mb-1 font-bold">Email</h4>
              <p>contacto@larqa.com</p>
            </div>
            <br />
            <div className="cursor-hover inline-block">
              <h4 className="text-sm uppercase tracking-widest mb-1 font-bold">Teléfono</h4>
              <p>+57 300 123 4567</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-beige-50 p-8 md:p-12 shadow-sm relative z-10 border border-beige-200 min-h-[500px]">
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
                  <Check size={40} />
                </div>
                <h3 className="text-3xl font-serif text-black-rich">¡Mensaje Enviado!</h3>
                <p className="text-black-soft font-light max-w-xs">
                  Gracias por contactarnos. Nuestro equipo revisará tu solicitud y te responderá en breve.
                </p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="mt-8 text-xs uppercase tracking-widest border-b border-black-rich pb-1 hover:text-beige-900 hover:border-beige-900 transition-colors cursor-hover"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">Nombre</label>
                    <input 
                        required 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        type="text" 
                        className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light" 
                        placeholder="Tu nombre" 
                    />
                    </div>
                    <div>
                    <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">Apellido</label>
                    <input 
                        required 
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        type="text" 
                        className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light" 
                        placeholder="Tu apellido" 
                    />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">Email</label>
                        <input 
                            required 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light" 
                            placeholder="tu@email.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">WhatsApp</label>
                        <div className="flex gap-3">
                          <div className="relative w-[120px] shrink-0">
                             <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light appearance-none pr-8"
                             >
                               {countryCodes.map((country) => (
                                 <option key={country.code} value={country.code}>
                                   {country.flag} {country.code}
                                 </option>
                               ))}
                             </select>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                               </svg>
                             </div>
                          </div>
                          <input 
                              required 
                              name="whatsapp"
                              value={formData.whatsapp}
                              onChange={handleChange}
                              type="tel" 
                              className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light flex-1 min-w-0" 
                              placeholder="300 123 4567" 
                          />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-black-soft mb-4">Preferencia de Contacto</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer cursor-hover">
                            <input 
                                type="radio" 
                                name="preference" 
                                value="email" 
                                checked={formData.preference === 'email'}
                                onChange={handleChange}
                                className="accent-black-rich" 
                            />
                            <span className="text-sm font-light text-black-soft">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer cursor-hover">
                            <input 
                                type="radio" 
                                name="preference" 
                                value="whatsapp" 
                                checked={formData.preference === 'whatsapp'}
                                onChange={handleChange}
                                className="accent-black-rich" 
                            />
                            <span className="text-sm font-light text-black-soft">WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer cursor-hover">
                            <input 
                                type="radio" 
                                name="preference" 
                                value="both" 
                                checked={formData.preference === 'both'}
                                onChange={handleChange}
                                className="accent-black-rich" 
                            />
                            <span className="text-sm font-light text-black-soft">Ambos</span>
                        </label>
                    </div>
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">Servicio de Interés</label>
                  <div className="relative">
                    <select 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light appearance-none rounded-none"
                    >
                        <option>Diseño Arquitectónico</option>
                        <option>Interiorismo</option>
                        <option>Consultoría</option>
                        <option>Presupuesto / Cotización</option>
                        <option>Agendar Cita</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-black-soft mb-2">Mensaje</label>
                  <textarea 
                    required 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    className="cursor-hover w-full bg-white border-b border-gray-200 p-3 focus:outline-none focus:border-black-rich transition-colors font-light resize-none" 
                    placeholder="Cuéntanos sobre tu proyecto..."
                  ></textarea>
                </div>

                {formState === 'error' && (
                    <p className="text-red-500 text-xs">Hubo un error al enviar el mensaje. Por favor intenta de nuevo.</p>
                )}

                <button 
                  type="submit" 
                  disabled={formState === 'loading'}
                  className="cursor-hover w-full bg-black-rich text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-black-soft transition-colors duration-300 mt-4 flex items-center justify-center disabled:opacity-70"
                >
                  {formState === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Solicitud'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-beige-50/50 to-transparent pointer-events-none -z-0"></div>
    </section>
  );
}
