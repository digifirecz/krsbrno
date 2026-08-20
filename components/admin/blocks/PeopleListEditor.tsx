'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { PeopleListData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface PeopleListEditorProps {
  data: PeopleListData;
  onChange: (data: PeopleListData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function PeopleListEditor({ data, onChange }: PeopleListEditorProps) {
  const people = data.people || [];
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Jména</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, people: [...people, ''] })}
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
                onChange({ ...data, people: next });
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
          if (deleteIdx !== null) onChange({ ...data, people: people.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
