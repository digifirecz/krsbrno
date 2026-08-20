'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { ChecklistCardData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface ChecklistCardEditorProps {
  data: ChecklistCardData;
  onChange: (data: ChecklistCardData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function ChecklistCardEditor({ data, onChange, pageId }: ChecklistCardEditorProps) {
  const items = data.items || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Eyebrow (malý štítek nad nadpisem)</label>
        <input
          type="text"
          value={data.eyebrow || ''}
          onChange={(e) => onChange({ ...data, eyebrow: e.target.value || undefined })}
          className={fieldClass}
        />
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Body seznamu</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, items: [...items, { title: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat bod</span>
          </button>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Bod {idx + 1}</span>
              <button
                type="button"
                onClick={() => setDeleteIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], title: e.target.value };
                onChange({ ...data, items: next });
              }}
              placeholder="Titulek bodu *"
              className={fieldClass}
            />
            <textarea
              rows={2}
              value={item.text || ''}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], text: e.target.value || undefined };
                onChange({ ...data, items: next });
              }}
              placeholder="Text bodu"
              className={fieldClass}
            />
          </div>
        ))}
      </div>

      <div>
        <label className={labelClass}>Ikona poznámky</label>
        <IconPicker value={data.noteIcon} onChange={(noteIcon) => onChange({ ...data, noteIcon })} />
      </div>

      <div>
        <label className={labelClass}>Titulek poznámky</label>
        <input
          type="text"
          value={data.noteTitle || ''}
          onChange={(e) => onChange({ ...data, noteTitle: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Text poznámky</label>
        <textarea
          rows={2}
          value={data.noteText || ''}
          onChange={(e) => onChange({ ...data, noteText: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Fotka</label>
        <PhotoUpload
          value={data.photo?.src || ''}
          pageId={pageId}
          onChange={(src) => onChange({ ...data, photo: { ...data.photo, src } })}
        />
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit bod"
        message="Opravdu chcete tento bod seznamu odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, items: items.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
