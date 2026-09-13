'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SafeImage from '@/components/SafeImage';
import { X, Maximize2 } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
  className?: string;
  // Fixed width keeps every single-photo block the same physical size across
  // the site. Grids of multiple photos side by side should fill their own
  // cell instead, so set this false there — otherwise it just centers a
  // small fixed box inside a wider cell, leaving a big gap next to it.
  fixedWidth?: boolean;
  // Focal point (0-100%) admins set for this photo, used as object-position
  // when it's cropped to aspectRatio. Only affects the cropped thumbnail —
  // the full-size lightbox view below always shows the photo uncropped.
  focalX?: number;
  focalY?: number;
  // Extra zoom (>=1) anchored at the focal point, cropping further into the
  // axis that would otherwise show the photo uncropped.
  zoom?: number;
}

export default function ImageCard({
  src,
  alt,
  caption,
  aspectRatio = 'aspect-[16/10]',
  className = '',
  fixedWidth = false,
  focalX,
  focalY,
  zoom,
}: ImageCardProps) {
  const hasFocal = focalX !== undefined && focalY !== undefined;
  const objectPosition = hasFocal ? `${focalX}% ${focalY}%` : undefined;
  const extraZoom = hasFocal && zoom && zoom > 1 ? zoom : undefined;
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
        className={`relative ${fixedWidth ? 'w-72 max-w-full mx-auto' : 'w-full'} rounded-2xl overflow-hidden ${aspectRatio} border border-neutral-200/80 shadow-xs bg-neutral-100 group cursor-pointer ${className}`}
        title="Kliknutím zvětšíte obrázek"
      >
        <SafeImage
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          style={
            objectPosition
              ? { objectPosition, ...(extraZoom ? { transform: `scale(${extraZoom})`, transformOrigin: objectPosition } : {}) }
              : undefined
          }
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

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-pointer"
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
                <SafeImage
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
          </div>,
          document.body
        )}
    </>
  );
}
