'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { IconGridData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface IconGridEditorProps {
  data: IconGridData;
  onChange: (data: IconGridData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function IconGridEditor({ data, onChange }: IconGridEditorProps) {
  const cards = data.cards || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ cardIdx: number; itemIdx: number } | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Nadpis</label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={(e) => onChange({ ...data, heading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Podnadpis</label>
        <input
          type="text"
          value={data.subheading || ''}
          onChange={(e) => onChange({ ...data, subheading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Karty</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, cards: [...cards, { title: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat kartu</span>
          </button>
        </div>

        {cards.map((card, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Karta {idx + 1}</span>
              <button
                type="button"
                onClick={() => setDeleteIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <IconPicker
              value={card.icon}
              onChange={(icon) => {
                const next = [...cards];
                next[idx] = { ...next[idx], icon };
                onChange({ ...data, cards: next });
              }}
            />

            <input
              type="text"
              value={card.title}
              onChange={(e) => {
                const next = [...cards];
                next[idx] = { ...next[idx], title: e.target.value };
                onChange({ ...data, cards: next });
              }}
              placeholder="Titulek karty *"
              className={fieldClass}
            />

            <textarea
              rows={2}
              value={card.text || ''}
              onChange={(e) => {
                const next = [...cards];
                next[idx] = { ...next[idx], text: e.target.value || undefined };
                onChange({ ...data, cards: next });
              }}
              placeholder="Text karty"
              className={fieldClass}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">Odrážkový seznam (nepovinný, místo/vedle textu)</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...cards];
                    next[idx] = { ...next[idx], items: [...(next[idx].items || []), { title: '' }] };
                    onChange({ ...data, cards: next });
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Přidat bod</span>
                </button>
              </div>
              {(card.items || []).map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...cards];
                      const items = [...(next[idx].items || [])];
                      items[itemIdx] = { ...items[itemIdx], title: e.target.value };
                      next[idx] = { ...next[idx], items };
                      onChange({ ...data, cards: next });
                    }}
                    placeholder="Bod seznamu"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteItem({ cardIdx: idx, itemIdx })}
                    className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit kartu"
        message="Opravdu chcete tuto kartu odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, cards: cards.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />

      <ConfirmModal
        open={deleteItem !== null}
        title="Odstranit bod"
        message="Opravdu chcete tento bod seznamu odstranit?"
        onCancel={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem !== null) {
            const next = [...cards];
            const items = (next[deleteItem.cardIdx].items || []).filter((_, i) => i !== deleteItem.itemIdx);
            next[deleteItem.cardIdx] = { ...next[deleteItem.cardIdx], items };
            onChange({ ...data, cards: next });
          }
          setDeleteItem(null);
        }}
      />
    </div>
  );
}
