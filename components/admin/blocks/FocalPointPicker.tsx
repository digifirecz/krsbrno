'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, X, ZoomIn } from 'lucide-react';

export interface FocalPoint {
  x: number;
  y: number;
  // Extra zoom (>=1) anchored at (x, y), cropping further into the axis
  // that would otherwise show the photo uncropped. 1 = no extra zoom.
  zoom?: number;
}

interface FocalPointPickerProps {
  open: boolean;
  src: string;
  // Target width/height ratio of the shape this photo is cropped into on the
  // frontend (e.g. 4/3, 1, 16/10). Used only to draw the crop-window preview.
  aspectRatio: number;
  value?: FocalPoint;
  onChange: (value: FocalPoint) => void;
  onClose: () => void;
}

const MAX_W = 480;
const MAX_H = 420;
const MAX_ZOOM = 3;

export default function FocalPointPicker({ open, src, aspectRatio, value, onChange, onClose }: FocalPointPickerProps) {
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [point, setPoint] = useState<FocalPoint>(value || { x: 50, y: 50 });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setPoint(value || { x: 50, y: 50 });
      setNatural(null);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const zoom = point.zoom || 1;
  const scale = natural ? Math.min(MAX_W / natural.w, MAX_H / natural.h, 1) : 1;
  const displayW = natural ? Math.round(natural.w * scale) : MAX_W;
  const displayH = natural ? Math.round(natural.h * scale) : MAX_H;

  // Mirrors what CSS object-fit:cover + object-position (+ a zoom transform
  // anchored at the same point) do, so the highlighted window shows exactly
  // what will stay visible on the frontend.
  let winW = displayW;
  let winH = displayH;
  if (natural) {
    const imgRatio = natural.w / natural.h;
    if (imgRatio > aspectRatio) {
      winH = displayH;
      winW = displayH * aspectRatio;
    } else {
      winW = displayW;
      winH = displayW / aspectRatio;
    }
  }
  winW /= zoom;
  winH /= zoom;
  const winX = (displayW - winW) * (point.x / 100);
  const winY = (displayH - winH) * (point.y / 100);

  const updateFromPoint = (clientX: number, clientY: number) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setPoint((prev) => ({ ...prev, x: Math.round(x), y: Math.round(y) }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 w-full shadow-2xl space-y-4 border border-neutral-200"
        style={{ maxWidth: Math.max(displayW, 340) + 48 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif">Nastavit výřez fotky</h3>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          Klikni nebo přetáhni bod na místo, které se má na webu vždy zobrazit, a přiblížením ořízni i to, co nechceš mít po stranách. Zvýrazněný rámeček ukazuje výřez tak, jak bude fotka vidět na stránce — samotný soubor zůstane celý.
        </p>

        <div
          ref={boxRef}
          className="relative mx-auto bg-neutral-900 rounded-lg overflow-hidden cursor-crosshair select-none touch-none"
          style={{ width: displayW, height: displayH }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setDragging(true);
            updateFromPoint(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging) updateFromPoint(e.clientX, e.clientY);
          }}
          onPointerUp={() => setDragging(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {natural && (
            <div
              className="absolute border-2 border-white pointer-events-none"
              style={{ left: winX, top: winY, width: winW, height: winH, boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)' }}
            />
          )}

          <div
            className="absolute w-4 h-4 rounded-full bg-[#c93838] border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          />
        </div>

        <div className="flex items-center space-x-3">
          <ZoomIn className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.05}
            value={zoom}
            onChange={(e) => setPoint((prev) => ({ ...prev, zoom: Number(e.target.value) }))}
            className="flex-1 accent-[#c93838] cursor-pointer"
          />
          <span className="text-xs font-bold text-neutral-500 w-9 text-right shrink-0">{zoom.toFixed(2)}×</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setPoint({ x: 50, y: 50, zoom: 1 })}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-[#c93838] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetovat</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
            >
              Zrušit
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(point);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#c93838] hover:bg-[#b02f2f] cursor-pointer"
            >
              Použít
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
