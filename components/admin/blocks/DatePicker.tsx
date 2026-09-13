'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // "YYYY-MM-DD" nebo ""
  onChange: (iso: string) => void;
  className?: string;
}

const WEEKDAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTHS = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
];

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function fmtDisplay(iso: string): string {
  const p = parseIso(iso);
  return p ? `${p.d}. ${p.m}. ${p.y}` : '';
}

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseIso(value);
  const today = new Date();
  const [viewY, setViewY] = useState(parsed?.y ?? today.getFullYear());
  const [viewM, setViewM] = useState(parsed?.m ?? today.getMonth() + 1);
  const [rect, setRect] = useState<{ left: number; top: number; above: boolean } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    setRect({ left: r.left, top: r.bottom, above: spaceBelow < 340 && r.top > spaceBelow });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (parsed) {
      setViewY(parsed.y);
      setViewM(parsed.m);
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    const onScrollResize = () => place();
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const daysInMonth = new Date(viewY, viewM, 0).getDate();
  const firstWeekday = (new Date(viewY, viewM - 1, 1).getDay() + 6) % 7; // Po = 0

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goPrevMonth = () => {
    if (viewM === 1) {
      setViewM(12);
      setViewY((y) => y - 1);
    } else {
      setViewM((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewM === 12) {
      setViewM(1);
      setViewY((y) => y + 1);
    } else {
      setViewM((m) => m + 1);
    }
  };

  const pick = (d: number) => {
    onChange(toIso(viewY, viewM, d));
    setOpen(false);
  };

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
        <CalendarIcon className="w-4 h-4 text-neutral-400 shrink-0" />
        <span className={value ? 'text-neutral-800' : 'text-neutral-400'}>{value ? fmtDisplay(value) : 'Vybrat datum'}</span>
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
              ...(rect.above ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.top + 4 }),
            }}
            className="z-[60] w-72 rounded-xl border border-neutral-200 bg-white shadow-lg p-3 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                aria-label="Předchozí měsíc"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-neutral-800">
                {MONTHS[viewM - 1]} {viewY}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                aria-label="Další měsíc"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-xs font-bold text-neutral-400 py-1">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((d, i) => {
                if (d === null) return <div key={`e${i}`} />;
                const isSelected = parsed && parsed.y === viewY && parsed.m === viewM && parsed.d === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pick(d)}
                    className={`aspect-square rounded-lg text-sm cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#c93838] text-white font-bold' : 'text-neutral-700 hover:bg-red-50 hover:text-[#c93838]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
