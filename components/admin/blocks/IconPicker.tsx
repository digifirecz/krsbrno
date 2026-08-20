'use client';

import { useEffect, useState } from 'react';
import { ICON_MAP, ICON_NAMES, getIcon } from '@/lib/blocks/icons';
import { Ban, X } from 'lucide-react';

interface IconPickerProps {
  value?: string;
  onChange: (name: string | undefined) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);

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

  const pick = (name: string | undefined) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white hover:border-[#c93838]/40 transition-colors cursor-pointer"
      >
        <span className="w-7 h-7 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
          {SelectedIcon ? <SelectedIcon className="w-4 h-4" /> : <Ban className="w-4 h-4 text-neutral-400" />}
        </span>
        <span className="text-neutral-700 flex-1 text-left">{value || 'Bez ikony'}</span>
        <span className="text-xs font-semibold text-[#c93838]">Vybrat</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white text-neutral-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif">Vyberte ikonu</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
                aria-label="Zavřít"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-80 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => pick(undefined)}
                title="Bez ikony"
                className={`aspect-square rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  !value ? 'bg-red-50 text-[#c93838] ring-2 ring-[#c93838]' : 'text-neutral-400 hover:bg-neutral-50 border border-neutral-100'
                }`}
              >
                <Ban className="w-5 h-5" />
              </button>
              {ICON_NAMES.map((name) => {
                const Icon = ICON_MAP[name];
                const selected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pick(name)}
                    title={name}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      selected ? 'bg-red-50 text-[#c93838] ring-2 ring-[#c93838]' : 'text-neutral-600 hover:bg-neutral-50 border border-neutral-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
