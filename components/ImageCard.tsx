'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Maximize2 } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
  className?: string;
}

export default function ImageCard({
  src,
  alt,
  caption,
  aspectRatio = 'aspect-[16/10]',
  className = '',
}: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`relative rounded-2xl overflow-hidden ${aspectRatio} border border-neutral-200/80 shadow-xs bg-neutral-100 group cursor-pointer ${className}`}
        title="Kliknutím zvětšíte obrázek"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md">
          <Maximize2 className="w-4 h-4" />
        </div>
        {caption && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-3.5 left-3 right-3 text-center text-xs sm:text-sm text-white font-medium font-sans drop-shadow-xs leading-snug">
              {caption}
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-[10000] border border-white/20"
            aria-label="Zavřít"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh] sm:h-[85vh] flex items-center justify-center">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {caption && (
              <p className="mt-4 text-center text-white/90 text-sm sm:text-base font-sans font-medium px-4 max-w-2xl animate-in fade-in duration-300">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
