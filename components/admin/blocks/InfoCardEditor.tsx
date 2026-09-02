'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { InfoCardData } from '@/lib/blocks/types';
import { Trash2 } from 'lucide-react';

interface InfoCardEditorProps {
  data: InfoCardData;
  onChange: (data: InfoCardData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function InfoCardEditor({ data, onChange, pageId }: InfoCardEditorProps) {
  const [confirmRemovePhoto, setConfirmRemovePhoto] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Ikona štítku</label>
        <IconPicker value={data.badgeIcon} onChange={(badgeIcon) => onChange({ ...data, badgeIcon })} />
      </div>

      <div>
        <label className={labelClass}>Text štítku</label>
        <input
          type="text"
          value={data.badgeText || ''}
          onChange={(e) => onChange({ ...data, badgeText: e.target.value || undefined })}
          className={fieldClass}
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
        <label className={labelClass}>Adresa / dodatek</label>
        <input
          type="text"
          value={data.addressLine || ''}
          onChange={(e) => onChange({ ...data, addressLine: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Fotka</label>
          {data.photo?.src && (
            <button
              type="button"
              onClick={() => setConfirmRemovePhoto(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-neutral-400 hover:text-[#c93838] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Odebrat fotku</span>
            </button>
          )}
        </div>
        <PhotoUpload
          value={data.photo?.src || ''}
          pageId={pageId}
          aspectRatio={16 / 10}
          focal={data.photo?.focalX !== undefined ? { x: data.photo.focalX, y: data.photo.focalY ?? 50, zoom: data.photo.zoom } : undefined}
          onFocalChange={(f) => onChange({ ...data, photo: { ...data.photo, src: data.photo?.src || '', focalX: f.x, focalY: f.y, zoom: f.zoom } })}
          onChange={(src) => onChange({ ...data, photo: src ? { ...data.photo, src } : undefined })}
        />
        {data.photo?.src && (
          <input
            type="text"
            value={data.photo.caption || ''}
            onChange={(e) => onChange({ ...data, photo: { ...data.photo!, caption: e.target.value || undefined } })}
            placeholder="Popisek"
            className={fieldClass}
          />
        )}
      </div>

      <ConfirmModal
        open={confirmRemovePhoto}
        title="Odebrat fotku"
        message="Opravdu chcete tuto fotku odebrat?"
        onCancel={() => setConfirmRemovePhoto(false)}
        onConfirm={() => {
          onChange({ ...data, photo: undefined });
          setConfirmRemovePhoto(false);
        }}
      />
    </div>
  );
}
