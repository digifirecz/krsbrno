'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string; // "HH:MM" nebo ""
  onChange: (time: string) => void;
  className?: string;
}

function buildTimes(): string[] {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return out;
}
const TIMES = buildTimes();

export default function TimePicker({ value, onChange, className = '' }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; above: boolean } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    setRect({ left: r.left, top: r.bottom, width: Math.max(r.width, 110), above: spaceBelow < 240 && r.top > spaceBelow });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    const onScrollResize = () => place();
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    const t = setTimeout(() => {
      const idx = TIMES.indexOf(value);
      if (idx >= 0) (listRef.current?.children[idx] as HTMLElement | undefined)?.scrollIntoView({ block: 'center' });
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-2 rounded-xl border text-sm bg-white text-left flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838] cursor-pointer ${
          open ? 'border-[#c93838]' : 'border-neutral-200 hover:border-neutral-300'
        }`}
      >
        <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
        <span className={value ? 'text-neutral-800' : 'text-neutral-400'}>{value || '--:--'}</span>
      </button>

      {open &&
        rect &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              left: rect.left,
              width: rect.width,
              ...(rect.above ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.top + 4 }),
            }}
            className="z-[60] rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <ul ref={listRef} className="max-h-56 overflow-auto py-1">
              {TIMES.map((t) => (
                <li
                  key={t}
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                  className={`px-3.5 py-1.5 text-sm cursor-pointer ${
                    t === value ? 'bg-red-50 text-[#c93838] font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
