'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { TAB_TO_PATH, PAGE_TITLES } from '@/lib/routes';
import type { CtaBlockData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface CtaBlockEditorProps {
  data: CtaBlockData;
  onChange: (data: CtaBlockData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

const TARGET_OPTIONS = Object.keys(TAB_TO_PATH).map((tab) => ({
  tab,
  label: (PAGE_TITLES[tab] || tab).split(' | ')[0],
}));

export default function CtaBlockEditor({ data, onChange, pageId }: CtaBlockEditorProps) {
  const photos = data.photos || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Ikona</label>
        <IconPicker value={data.icon} onChange={(icon) => onChange({ ...data, icon })} />
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
        />
      </div>

      <div>
        <label className={labelClass}>Text</label>
        <textarea
          rows={3}
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value || undefined })}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Text tlačítka</label>
          <input
            type="text"
            value={data.buttonLabel || ''}
            onChange={(e) => onChange({ ...data, buttonLabel: e.target.value || undefined })}
            className={fieldClass}
            placeholder="Např. Přijď mezi nás"
          />
        </div>
        <div>
          <label className={labelClass}>Cíl tlačítka</label>
          <select
            value={data.buttonUrl ? '__external__' : (data.buttonTarget || '')}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '__external__') {
                onChange({ ...data, buttonTarget: undefined, buttonUrl: data.buttonUrl || '' });
              } else {
                onChange({ ...data, buttonTarget: value || undefined, buttonUrl: undefined });
              }
            }}
            className={`${fieldClass} bg-white`}
          >
            <option value="">Bez odkazu</option>
            {TARGET_OPTIONS.map(({ tab, label }) => (
              <option key={tab} value={tab}>{label}</option>
            ))}
            <option value="__external__">Externí odkaz (URL)</option>
          </select>
        </div>
      </div>

      {data.buttonUrl !== undefined && (
        <div>
          <label className={labelClass}>URL externího odkazu</label>
          <input
            type="text"
            value={data.buttonUrl}
            onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
            className={fieldClass}
            placeholder="https://…"
          />
        </div>
      )}

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
