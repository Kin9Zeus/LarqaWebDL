'use client';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function NatureSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Note: You need to add a file named 'nature-ambience.mp3' to public/sounds/ folder
    // Or change this path to your file.
    audioRef.current = new Audio('/sounds/rain-drum-strike-sound-bath-321676.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.1; // Very subtle volume

    return () => {
      // Cleanup: pause and release the Audio object on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.log("Audio play failed (user interaction needed first)", e);
        // Sometimes browsers block audio if no interaction, but click handler satisfies this.
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all text-black-rich border border-beige-200 group min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={isPlaying ? 'Silenciar sonido ambiente' : 'Activar sonido ambiente'}
      title="Ambiente Natural"
    >
      {isPlaying ? (
        <Volume2 size={20} className="opacity-70 group-hover:opacity-100" />
      ) : (
        <VolumeX size={20} className="opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );
}
