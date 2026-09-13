'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import type { TimelineData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface TimelineEditorProps {
  data: TimelineData;
  onChange: (data: TimelineData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function TimelineEditor({ data, onChange, pageId }: TimelineEditorProps) {
  const items = data.items || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

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
          <label className={labelClass}>Roky</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, items: [...items, { year: '', title: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat rok</span>
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Položka {idx + 1}</span>
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
              value={item.year}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], year: e.target.value };
                onChange({ ...data, items: next });
              }}
              placeholder="Rok *"
              className={fieldClass}
            />
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], title: e.target.value };
                onChange({ ...data, items: next });
              }}
              placeholder="Titulek *"
              className={fieldClass}
            />
            <textarea
              rows={3}
              value={item.text || ''}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...next[idx], text: e.target.value || undefined };
                onChange({ ...data, items: next });
              }}
              placeholder="Text"
              className={fieldClass}
            />

            <div>
              <span className="text-xs font-bold text-neutral-500 block mb-1.5">Fotka v hlavičce karty (nepovinná)</span>
              <PhotoUpload
                value={item.photo?.src || ''}
                pageId={pageId}
                aspectRatio={16 / 9}
                focal={item.photo?.focalX !== undefined ? { x: item.photo.focalX, y: item.photo.focalY ?? 50, zoom: item.photo.zoom } : undefined}
                onFocalChange={(f) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], photo: { ...next[idx].photo, src: next[idx].photo?.src || '', focalX: f.x, focalY: f.y, zoom: f.zoom } };
                  onChange({ ...data, items: next });
                }}
                onChange={(src) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], photo: src ? { ...next[idx].photo, src } : undefined };
                  onChange({ ...data, items: next });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit položku"
        message="Opravdu chcete tuto položku časové osy odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, items: items.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
