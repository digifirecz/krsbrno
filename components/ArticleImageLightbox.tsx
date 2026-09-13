'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

interface ArticleImageLightboxProps {
  src: string;
  alt: string;
}

export default function ArticleImageLightbox({ src, alt }: ArticleImageLightboxProps) {
  const [open, setOpen] = useState(false);
  // Dokud se obrázek nenačte, hádáme širší poměr — ať náhled nenaskočí z nuly.
  // Jakmile jsou známé skutečné rozměry, box se jim přesně přizpůsobí (šířka podle
  // pevné výšky), takže žádné prázdné bílé okraje po stranách a text vedle dostane
  // zbylou šířku.
  const [ratio, setRatio] = useState(3 / 2);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <div
        className="relative w-full h-[360px] md:h-[600px] md:w-auto md:max-w-[65%] md:min-w-[35%] md:ml-auto shrink-0 bg-white"
        style={{ aspectRatio: `${ratio}` }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Zobrazit obrázek přes celou obrazovku"
          className="group absolute inset-0 w-full h-full cursor-zoom-in"
        >
          <SafeImage
            src={src}
            alt={alt}
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
          />
          <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4.5 h-4.5" />
          </span>
        </button>
      </div>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-neutral-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              aria-label="Zavřít"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <SafeImage src={src} alt={alt} fill className="object-contain" referrerPolicy="no-referrer" />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
