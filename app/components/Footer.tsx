'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black-rich text-beige-50 py-16 px-6 border-t border-white/10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h3 className="text-3xl font-serif font-light tracking-widest mb-2">LARQA</h3>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">Arquitectura & Diseño</p>
        </div>
        
        <div className="flex space-x-8 mb-8 md:mb-0">
          <Link href="https://www.instagram.com/larqa_arquitectura?igsh=bW41c3Z4OHg1bnBw" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Instagram</Link>
          <Link href="#" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">LinkedIn</Link>
          <Link href="#" className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Behance</Link>
        </div>

        <div className="text-xs text-gray-500 tracking-wide">
          &copy; {new Date().getFullYear()} Larqa Studio.
        </div>
      </div>
    </footer>
  );
}
