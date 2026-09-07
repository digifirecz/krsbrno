'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface NewSermonModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
}

export default function NewSermonModal({ open, onClose, onCreate }: NewSermonModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setError('');
    setSubmitting(false);
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Zadejte název záznamu.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onCreate(title.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Záznam se nepodařilo vytvořit.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold font-serif">Nový záznam</h3>
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
          <label className="block text-xs font-bold text-neutral-600 mb-1">Název záznamu</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Např. Naděje, která nezklame"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
            autoFocus
          />
          <p className="text-xs text-neutral-400 mt-1.5">Datum, kategorii, nahrávku a popis doplníte v editoru.</p>
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
            {submitting ? 'Vytváří se…' : 'Vytvořit záznam'}
          </button>
        </div>
      </div>
    </div>
  );
}
