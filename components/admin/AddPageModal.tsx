'use client';

import { useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

interface AddPageModalProps {
  open: boolean;
  title: string;
  pages: { id: string; label: string }[];
  onClose: () => void;
  onPick: (pageId: string) => void;
}

export default function AddPageModal({ open, title, pages, onClose, onPick }: AddPageModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col animate-in zoom-in-95 duration-150 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3 shrink-0">
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

        {pages.length === 0 ? (
          <p className="text-sm text-neutral-500 pt-4">Žádné další stránky k přidání.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onPick(page.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-[#c93838]/50 hover:bg-red-50/30 transition-colors cursor-pointer text-left"
              >
                <p className="font-bold text-neutral-900 text-sm">{page.label}</p>
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 ml-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
