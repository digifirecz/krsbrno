'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { TAB_TO_PATH, PAGE_TITLES } from '@/lib/routes';
import type { PhotoCardGridData, PhotoCardItem } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface PhotoCardGridEditorProps {
  data: PhotoCardGridData;
  onChange: (data: PhotoCardGridData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

type BadgeMode = 'none' | 'icon' | 'badge';

function getBadgeMode(card: PhotoCardItem): BadgeMode {
  if (card.icon) return 'icon';
  if (card.badge) return 'badge';
  return 'none';
}

const TARGET_OPTIONS = Object.keys(TAB_TO_PATH).map((tab) => ({
  tab,
  label: (PAGE_TITLES[tab] || tab).split(' | ')[0],
}));

export default function PhotoCardGridEditor({ data, onChange, pageId }: PhotoCardGridEditorProps) {
  const cards = data.cards || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  // Overrides the data-derived mode so clicking "Ikona"/"Štítek" shows that
  // control immediately, even before a value has been picked in it (at which
  // point card.icon/card.badge are both still empty and would read as "none").
  const [modeOverride, setModeOverride] = useState<Record<number, BadgeMode>>({});

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
        <textarea
          rows={2}
          value={data.subheading || ''}
          onChange={(e) => onChange({ ...data, subheading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Zvýrazněný dodatek</label>
        <input
          type="text"
          value={data.highlight || ''}
          onChange={(e) => onChange({ ...data, highlight: e.target.value || undefined })}
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

            <PhotoUpload
              value={card.photo?.src || ''}
              pageId={pageId}
              aspectRatio={2}
              focal={card.photo?.focalX !== undefined ? { x: card.photo.focalX, y: card.photo.focalY ?? 50 } : undefined}
              onFocalChange={(f) => {
                const next = [...cards];
                next[idx] = { ...next[idx], photo: { ...next[idx].photo, src: next[idx].photo?.src || '', focalX: f.x, focalY: f.y } };
                onChange({ ...data, cards: next });
              }}
              onChange={(src) => {
                const next = [...cards];
                next[idx] = { ...next[idx], photo: { ...next[idx].photo, src } };
                onChange({ ...data, cards: next });
              }}
            />

            <div>
              <label className={labelClass}>Ikona nebo štítek</label>
              <div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden mb-2">
                {(['none', 'icon', 'badge'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setModeOverride((prev) => ({ ...prev, [idx]: mode }));
                      const next = [...cards];
                      next[idx] = { ...next[idx], icon: mode === 'icon' ? next[idx].icon : undefined, badge: mode === 'badge' ? next[idx].badge : undefined };
                      onChange({ ...data, cards: next });
                    }}
                    className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                      (modeOverride[idx] ?? getBadgeMode(card)) === mode ? 'bg-[#c93838] text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {mode === 'none' ? 'Žádný' : mode === 'icon' ? 'Ikona' : 'Štítek'}
                  </button>
                ))}
              </div>
              {(modeOverride[idx] ?? getBadgeMode(card)) === 'icon' && (
                <IconPicker
                  value={card.icon}
                  onChange={(icon) => {
                    const next = [...cards];
                    next[idx] = { ...next[idx], icon };
                    onChange({ ...data, cards: next });
                  }}
                />
              )}
              {(modeOverride[idx] ?? getBadgeMode(card)) === 'badge' && (
                <input
                  type="text"
                  value={card.badge || ''}
                  onChange={(e) => {
                    const next = [...cards];
                    next[idx] = { ...next[idx], badge: e.target.value || undefined };
                    onChange({ ...data, cards: next });
                  }}
                  placeholder="Štítek (např. 9:30 – 11:00)"
                  className={fieldClass}
                />
              )}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={card.linkLabel || ''}
                onChange={(e) => {
                  const next = [...cards];
                  next[idx] = { ...next[idx], linkLabel: e.target.value || undefined };
                  onChange({ ...data, cards: next });
                }}
                placeholder="Text odkazu (volitelné)"
                className={fieldClass}
              />
              <select
                value={card.linkTarget || ''}
                onChange={(e) => {
                  const next = [...cards];
                  next[idx] = { ...next[idx], linkTarget: e.target.value || undefined };
                  onChange({ ...data, cards: next });
                }}
                className={`${fieldClass} bg-white`}
              >
                <option value="">Bez odkazu</option>
                {TARGET_OPTIONS.map(({ tab, label }) => (
                  <option key={tab} value={tab}>{label}</option>
                ))}
              </select>
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
    </div>
  );
}
