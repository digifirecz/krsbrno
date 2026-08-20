'use client';

import { useState } from 'react';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { ScheduleCardData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface ScheduleCardEditorProps {
  data: ScheduleCardData;
  onChange: (data: ScheduleCardData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function ScheduleCardEditor({ data, onChange, pageId }: ScheduleCardEditorProps) {
  const schedule = data.schedule || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Fotka</label>
        <PhotoUpload
          value={data.photo?.src || ''}
          pageId={pageId}
          onChange={(src) => onChange({ ...data, photo: { ...data.photo, src } })}
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
          <label className={labelClass}>Časy</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, schedule: [...schedule, { label: '', time: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat čas</span>
          </button>
        </div>
        {schedule.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => {
                const next = [...schedule];
                next[idx] = { ...next[idx], label: e.target.value };
                onChange({ ...data, schedule: next });
              }}
              placeholder="Den (např. Středa)"
              className={fieldClass}
            />
            <input
              type="text"
              value={item.time}
              onChange={(e) => {
                const next = [...schedule];
                next[idx] = { ...next[idx], time: e.target.value };
                onChange({ ...data, schedule: next });
              }}
              placeholder="Čas (např. 18:00 – 19:00)"
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
        <label className={labelClass}>Zvýrazněný text</label>
        <textarea
          rows={2}
          value={data.highlight || ''}
          onChange={(e) => onChange({ ...data, highlight: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit čas"
        message="Opravdu chcete tento časový údaj odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, schedule: schedule.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
