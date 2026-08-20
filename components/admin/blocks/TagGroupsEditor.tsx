'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { TagGroupsData, TagGroup } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface TagGroupsEditorProps {
  data: TagGroupsData;
  onChange: (data: TagGroupsData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

function emptyGroup(): TagGroup {
  return { heading: '', tags: [''] };
}

export default function TagGroupsEditor({ data, onChange }: TagGroupsEditorProps) {
  const groups = data.groups || [];
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const updateGroup = (idx: number, group: TagGroup) => {
    const next = [...groups];
    next[idx] = group;
    onChange({ ...data, groups: next });
  };

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
        <textarea
          rows={2}
          value={data.subheading || ''}
          onChange={(e) => onChange({ ...data, subheading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Skupiny</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, groups: [...groups, emptyGroup()] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat skupinu</span>
          </button>
        </div>

        {groups.map((group, idx) => {
          const tags = group.tags || [];
          return (
            <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">Skupina {idx + 1}</span>
                <button type="button" onClick={() => setDeleteIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={group.heading}
                onChange={(e) => updateGroup(idx, { ...group, heading: e.target.value })}
                placeholder="Nadpis skupiny *"
                className={fieldClass}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Štítky</span>
                  <button
                    type="button"
                    onClick={() => updateGroup(idx, { ...group, tags: [...tags, ''] })}
                    className="text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
                  >
                    + štítek
                  </button>
                </div>
                {tags.map((tag, tagIdx) => (
                  <div key={tagIdx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const next = [...tags];
                        next[tagIdx] = e.target.value;
                        updateGroup(idx, { ...group, tags: next });
                      }}
                      className={fieldClass}
                    />
                    <button
                      type="button"
                      onClick={() => updateGroup(idx, { ...group, tags: tags.filter((_, i) => i !== tagIdx) })}
                      className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={deleteIdx !== null}
        title="Odstranit skupinu"
        message="Opravdu chcete tuto skupinu štítků odstranit?"
        onCancel={() => setDeleteIdx(null)}
        onConfirm={() => {
          if (deleteIdx !== null) onChange({ ...data, groups: groups.filter((_, i) => i !== deleteIdx) });
          setDeleteIdx(null);
        }}
      />
    </div>
  );
}
