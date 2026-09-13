'use client';

import { useEffect, useRef, useState } from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Textové pole s vlastní (nestrict) nabídkou už použitých hodnot — na rozdíl
// od SearchSelect jde napsat i úplně nová hodnota, nabídka jen napovídá.
export default function LocationInput({ value, onChange, options, placeholder }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const q = norm(value.trim());
  const filtered = options.filter((o) => norm(o) !== q && (!q || norm(o).includes(q)));

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-neutral-200 bg-white shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
          {filtered.map((opt) => (
            <li
              key={opt}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-3.5 py-2 text-sm text-neutral-700 hover:bg-red-50 hover:text-[#c93838] cursor-pointer truncate"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
