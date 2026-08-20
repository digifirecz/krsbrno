'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { CardGridData, CardGridItem } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface CardGridEditorProps {
  data: CardGridData;
  onChange: (data: CardGridData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

const KIND_OPTIONS: { value: CardGridItem['kind']; label: string }[] = [
  { value: 'icon', label: 'Ikona + text' },
  { value: 'list', label: 'Seznam' },
  { value: 'people', label: 'Jména' },
];

function emptyCard(kind: CardGridItem['kind']): CardGridItem {
  if (kind === 'icon') return { kind: 'icon', title: '' };
  if (kind === 'list') return { kind: 'list', items: [{ title: '' }] };
  return { kind: 'people', people: [''] };
}

function CardEditor({ card, onChange }: { card: CardGridItem; onChange: (card: CardGridItem) => void }) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  if (card.kind === 'icon') {
    return (
      <div className="space-y-2">
        <IconPicker value={card.icon} onChange={(icon) => onChange({ ...card, icon })} />
        <input
          type="text"
          value={card.title}
          onChange={(e) => onChange({ ...card, title: e.target.value })}
          placeholder="Titulek *"
          className={fieldClass}
        />
        <textarea
          rows={3}
          value={card.text || ''}
          onChange={(e) => onChange({ ...card, text: e.target.value || undefined })}
          placeholder="Text"
          className={fieldClass}
        />
      </div>
    );
  }

  if (card.kind === 'list') {
    const items = card.items || [];
    return (
      <div className="space-y-2">
        <IconPicker value={card.icon} onChange={(icon) => onChange({ ...card, icon })} />
        <input
          type="text"
          value={card.heading || ''}
          onChange={(e) => onChange({ ...card, heading: e.target.value || undefined })}
          placeholder="Nadpis"
          className={fieldClass}
        />
        <input
          type="text"
          value={card.subheading || ''}
          onChange={(e) => onChange({ ...card, subheading: e.target.value || undefined })}
          placeholder="Podnadpis"
          className={fieldClass}
        />
        <label className="flex items-center space-x-1.5 text-xs font-bold text-neutral-600 cursor-pointer">
          <input
            type="checkbox"
            checked={!!card.wide}
            onChange={(e) => onChange({ ...card, wide: e.target.checked || undefined })}
          />
          <span>Široká karta (přes celou šířku, seznam ve 2 sloupcích)</span>
        </label>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Body seznamu</span>
            <button
              type="button"
              onClick={() => onChange({ ...card, items: [...items, { title: '' }] })}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Přidat bod</span>
            </button>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], title: e.target.value };
                  onChange({ ...card, items: next });
                }}
                placeholder="Bod seznamu *"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => setDeleteIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <ConfirmModal
          open={deleteIdx !== null}
          title="Odstranit bod"
          message="Opravdu chcete tento bod seznamu odstranit?"
          onCancel={() => setDeleteIdx(null)}
          onConfirm={() => {
            if (deleteIdx !== null) onChange({ ...card, items: items.filter((_, i) => i !== deleteIdx) });
            setDeleteIdx(null);
          }}
        />
      </div>
    );
  }

  const people = card.people || [];
  return (
    <div className="space-y-2">
      <IconPicker value={card.icon} onChange={(icon) => onChange({ ...card, icon })} />
      <input
        type="text"
        value={card.heading || ''}
        onChange={(e) => onChange({ ...card, heading: e.target.value || undefined })}
        placeholder="Nadpis"
        className={fieldClass}
      />
      <input
        type="text"
        value={card.subheading || ''}
        onChange={(e) => onChange({ ...card, subheading: e.target.value || undefined })}
        placeholder="Podnadpis"
        className={fieldClass}
      />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={labelClass}>Jména</span>
          <button
            type="button"
            onClick={() => onChange({ ...card, people: [...people, ''] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat osobu</span>
          </button>
        </div>
        {people.map((person, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="text"
              value={person}
              onChange={(e) => {
                const next = [...people];
                next[idx] = e.target.value;
                onChange({ ...card, people: next });
              }}
              placeholder="Jméno a příjmení"
              className={fieldClass}
            />
            <button
              type="button"
              onClick={() => setDeleteIdx(idx)}
              className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit osobu"
        message="Opravdu chcete tuto osobu odstranit ze seznamu?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...card, people: people.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}

export default function CardGridEditor({ data, onChange }: CardGridEditorProps) {
  const cards = data.cards || [];
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);

  const updateCard = (idx: number, card: CardGridItem) => {
    const next = [...cards];
    next[idx] = card;
    onChange({ ...data, cards: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Nadpis mřížky</label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={(e) => onChange({ ...data, heading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Podnadpis mřížky</label>
        <input
          type="text"
          value={data.subheading || ''}
          onChange={(e) => onChange({ ...data, subheading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Karty (v mřížce po dvou)</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, cards: [...cards, emptyCard('icon')] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat kartu</span>
          </button>
        </div>

        {cards.map((card, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {KIND_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateCard(idx, emptyCard(opt.value))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      card.kind === opt.value
                        ? 'bg-[#c93838] text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#c93838]/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setRemoveIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <CardEditor card={card} onChange={(next) => updateCard(idx, next)} />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={removeIdx !== null}
        title="Odstranit kartu"
        message="Opravdu chcete tuto kartu z mřížky odstranit?"
        onCancel={() => setRemoveIdx(null)}
        onConfirm={() => {
          if (removeIdx !== null) onChange({ ...data, cards: cards.filter((_, i) => i !== removeIdx) });
          setRemoveIdx(null);
        }}
      />
    </div>
  );
}
