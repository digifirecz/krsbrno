'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { PageHeroData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface PageHeroEditorProps {
  data: PageHeroData;
  onChange: (data: PageHeroData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function PageHeroEditor({ data, onChange, pageId }: PageHeroEditorProps) {
  const photos = data.photos || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Ikona</label>
        <IconPicker
          value={data.icon}
          onChange={(icon) => onChange({ ...data, icon })}
        />
      </div>

      <div>
        <label className={labelClass}>
          Titulek <span className="text-[#c93838]">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className={fieldClass}
          placeholder="Titulek stránky"
        />
      </div>

      <div>
        <label className={labelClass}>Popis</label>
        <textarea
          rows={3}
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Zvýrazněný dodatek</label>
        <textarea
          rows={2}
          value={data.highlight || ''}
          onChange={(e) => onChange({ ...data, highlight: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Fotky</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, photos: [...photos, { src: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat fotku</span>
          </button>
        </div>
        {photos.map((photo, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Fotka {idx + 1}</span>
              <button
                type="button"
                onClick={() => setDeleteIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <PhotoUpload
              value={photo.src}
              pageId={pageId}
              aspectRatio={4 / 3}
              focal={photo.focalX !== undefined ? { x: photo.focalX, y: photo.focalY ?? 50, zoom: photo.zoom } : undefined}
              onFocalChange={(f) => {
                const next = [...photos];
                next[idx] = { ...next[idx], focalX: f.x, focalY: f.y, zoom: f.zoom };
                onChange({ ...data, photos: next });
              }}
              onChange={(src) => {
                const next = [...photos];
                next[idx] = { ...next[idx], src };
                onChange({ ...data, photos: next });
              }}
            />
            <input
              type="text"
              value={photo.caption || ''}
              onChange={(e) => {
                const next = [...photos];
                next[idx] = { ...next[idx], caption: e.target.value || undefined };
                onChange({ ...data, photos: next });
              }}
              placeholder="Popisek"
              className={fieldClass}
            />
          </div>
        ))}
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit fotku"
        message="Opravdu chcete tuto fotku odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, photos: photos.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
