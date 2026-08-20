'use client';

import { useEffect } from 'react';
import { BLOCK_TYPE_REGISTRY } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import { ChevronRight, X } from 'lucide-react';

interface AddBlockModalProps {
  open: boolean;
  onClose: () => void;
  onPick: (type: BlockType) => void;
}

export default function AddBlockModal({ open, onClose, onPick }: AddBlockModalProps) {
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
          <h3 className="text-lg font-bold font-serif">Přidat blok</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 overflow-y-auto">
          {BLOCK_TYPE_REGISTRY.map((blockType) => (
            <button
              key={blockType.type}
              type="button"
              onClick={() => onPick(blockType.type)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-[#c93838]/50 hover:bg-red-50/30 transition-colors cursor-pointer text-left"
            >
              <div>
                <p className="font-bold text-neutral-900 text-sm">{blockType.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{blockType.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 ml-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
