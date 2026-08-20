'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { BadgeCardData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface BadgeCardEditorProps {
  data: BadgeCardData;
  onChange: (data: BadgeCardData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function BadgeCardEditor({ data, onChange }: BadgeCardEditorProps) {
  const badges = data.badges || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Ikona</label>
        <IconPicker value={data.icon} onChange={(icon) => onChange({ ...data, icon })} />
      </div>

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
          <label className={labelClass}>Štítky</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, badges: [...badges, { label: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat štítek</span>
          </button>
        </div>
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="text"
              value={badge.label}
              onChange={(e) => {
                const next = [...badges];
                next[idx] = { ...next[idx], label: e.target.value };
                onChange({ ...data, badges: next });
              }}
              placeholder="Text štítku"
              className={fieldClass}
            />
            <label className="flex items-center space-x-1.5 text-xs font-bold text-neutral-600 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={!!badge.highlight}
                onChange={(e) => {
                  const next = [...badges];
                  next[idx] = { ...next[idx], highlight: e.target.checked || undefined };
                  onChange({ ...data, badges: next });
                }}
              />
              <span>Zvýraznit</span>
            </label>
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

      <div>
        <label className={labelClass}>Text</label>
        <textarea
          rows={4}
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit štítek"
        message="Opravdu chcete tento štítek odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, badges: badges.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
