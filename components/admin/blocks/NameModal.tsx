'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface NameModalProps {
  open: boolean;
  title: string;
  label: string;
  submitLabel: string;
  placeholder?: string;
  hint?: string;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export default function NameModal({ open, title, label, submitLabel, placeholder, hint, onClose, onCreate }: NameModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName('');
    setError('');
    setSubmitting(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Vyplňte prosím název.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onCreate(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se vytvořit.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer" onClick={onClose}>
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold font-serif">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-1">{label}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
            autoFocus
          />
          {hint && <p className="text-xs text-neutral-400 mt-1.5">{hint}</p>}
          {error && <p className="text-xs font-medium text-[#c93838] mt-2">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#c93838] hover:bg-[#b02f2f] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Vytváří se…' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
