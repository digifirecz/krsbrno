'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import MapEmbedEditor from '@/components/admin/blocks/MapEmbedEditor';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { SocialCardData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

type SideMode = 'none' | 'photo' | 'embed';

function getSideMode(data: SocialCardData): SideMode {
  if (data.embed) return 'embed';
  if (data.photo) return 'photo';
  return 'none';
}

interface SocialCardEditorProps {
  data: SocialCardData;
  onChange: (data: SocialCardData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function SocialCardEditor({ data, onChange, pageId }: SocialCardEditorProps) {
  const links = data.links || [];
  const [deleteLinkIdx, setDeleteLinkIdx] = useState<number | null>(null);

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
        <label className={labelClass}>Text</label>
        <textarea
          rows={6}
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Odkazy</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, links: [...links, { label: '', url: '' }] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat odkaz</span>
          </button>
        </div>

        {links.map((link, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500">Odkaz {idx + 1}</span>
              <button type="button" onClick={() => setDeleteLinkIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <IconPicker
              value={link.icon}
              onChange={(icon) => {
                const next = [...links];
                next[idx] = { ...next[idx], icon };
                onChange({ ...data, links: next });
              }}
            />
            <input
              type="text"
              value={link.label}
              onChange={(e) => {
                const next = [...links];
                next[idx] = { ...next[idx], label: e.target.value };
                onChange({ ...data, links: next });
              }}
              placeholder="Text odkazu *"
              className={fieldClass}
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => {
                const next = [...links];
                next[idx] = { ...next[idx], url: e.target.value };
                onChange({ ...data, links: next });
              }}
              placeholder="URL (https://… nebo mailto:…) *"
              className={fieldClass}
            />
          </div>
        ))}
      </div>

      <div>
        <label className={labelClass}>Boční obsah</label>
        <select
          value={getSideMode(data)}
          onChange={(e) => {
            const mode = e.target.value as SideMode;
            if (mode === 'none') onChange({ ...data, photo: undefined, embed: undefined });
            else if (mode === 'photo') onChange({ ...data, embed: undefined, photo: data.photo || { src: '' } });
            else onChange({ ...data, photo: undefined, embed: data.embed || { embedUrl: '' } });
          }}
          className={`${fieldClass} bg-white`}
        >
          <option value="none">Žádný</option>
          <option value="photo">Fotka</option>
          <option value="embed">Vložený obsah</option>
        </select>
      </div>

      {data.photo && (
        <div>
          <PhotoUpload
            value={data.photo.src}
            pageId={pageId}
            onChange={(src) => onChange({ ...data, photo: { ...data.photo, src } })}
          />
          <input
            type="text"
            value={data.photo.caption || ''}
            onChange={(e) => onChange({ ...data, photo: { ...data.photo!, caption: e.target.value || undefined } })}
            placeholder="Popisek"
            className={`${fieldClass} mt-2`}
          />
        </div>
      )}

      {data.embed && (
        <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/60">
          <MapEmbedEditor
            data={data.embed}
            onChange={(embed) => onChange({ ...data, embed })}
          />
        </div>
      )}

      <ConfirmModal
        open={deleteLinkIdx !== null}
        title="Odstranit odkaz"
        message="Opravdu chcete tento odkaz odstranit?"
        onCancel={() => setDeleteLinkIdx(null)}
        onConfirm={() => {
          if (deleteLinkIdx !== null) onChange({ ...data, links: links.filter((_, i) => i !== deleteLinkIdx) });
          setDeleteLinkIdx(null);
        }}
      />
    </div>
  );
}
