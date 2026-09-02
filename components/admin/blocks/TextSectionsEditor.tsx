'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import RichTextEditor from '@/components/admin/blocks/RichTextEditor';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { TextSectionsData, TextSection } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface TextSectionsEditorProps {
  data: TextSectionsData;
  onChange: (data: TextSectionsData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

function emptySection(): TextSection {
  return { heading: '' };
}

const ASPECT_RATIOS = { square: 1, landscape: 4 / 3, portrait: 3 / 4 };

export default function TextSectionsEditor({ data, onChange, pageId }: TextSectionsEditorProps) {
  const photos = data.photos || [];
  const sections = data.sections || [];
  const [deletePhotoIdx, setDeletePhotoIdx] = useState<number | null>(null);
  const [deleteSectionIdx, setDeleteSectionIdx] = useState<number | null>(null);

  const updateSection = (idx: number, section: TextSection) => {
    const next = [...sections];
    next[idx] = section;
    onChange({ ...data, sections: next });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Pozice fotek</label>
          <select
            value={data.photosPosition || 'left'}
            onChange={(e) => onChange({ ...data, photosPosition: e.target.value === 'right' ? 'right' : 'left' })}
            className={`${fieldClass} bg-white`}
          >
            <option value="left">Vlevo</option>
            <option value="right">Vpravo</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Formát fotek</label>
          <select
            value={data.photoAspectRatio || 'square'}
            onChange={(e) => onChange({ ...data, photoAspectRatio: e.target.value as TextSectionsData['photoAspectRatio'] })}
            className={`${fieldClass} bg-white`}
          >
            <option value="square">Čtverec (1:1)</option>
            <option value="landscape">Na šířku (4:3)</option>
            <option value="portrait">Na výšku (3:4)</option>
          </select>
        </div>
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
              <button type="button" onClick={() => setDeletePhotoIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <PhotoUpload
              value={photo.src}
              pageId={pageId}
              aspectRatio={ASPECT_RATIOS[data.photoAspectRatio || 'square']}
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClass}>Textové sekce</label>
          <button
            type="button"
            onClick={() => onChange({ ...data, sections: [...sections, emptySection()] })}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Přidat sekci</span>
          </button>
        </div>

        {sections.map((section, idx) => {
          const notes = section.notes || [];
          return (
            <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">Sekce {idx + 1}</span>
                <button type="button" onClick={() => setDeleteSectionIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className={labelClass}>Ikona</label>
                <IconPicker value={section.icon} onChange={(icon) => updateSection(idx, { ...section, icon })} />
              </div>

              <div>
                <label className={labelClass}>
                  Nadpis <span className="text-[#c93838]">*</span>
                </label>
                <input
                  type="text"
                  value={section.heading}
                  onChange={(e) => updateSection(idx, { ...section, heading: e.target.value })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Popis</label>
                <RichTextEditor
                  value={section.text || ''}
                  onChange={(text) => updateSection(idx, { ...section, text: text || undefined })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Poznámky (zvýrazněné boxy)</span>
                  <button
                    type="button"
                    onClick={() => updateSection(idx, { ...section, notes: [...notes, { text: '' }] })}
                    className="text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
                  >
                    + poznámka
                  </button>
                </div>
                {notes.map((note, nIdx) => (
                  <div key={nIdx} className="p-2.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">Poznámka {nIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => updateSection(idx, { ...section, notes: notes.filter((_, i) => i !== nIdx) })}
                        className="text-neutral-400 hover:text-[#c93838] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <IconPicker
                      value={note.icon}
                      onChange={(icon) => {
                        const next = [...notes];
                        next[nIdx] = { ...next[nIdx], icon };
                        updateSection(idx, { ...section, notes: next });
                      }}
                    />
                    <textarea
                      rows={2}
                      value={note.text}
                      onChange={(e) => {
                        const next = [...notes];
                        next[nIdx] = { ...next[nIdx], text: e.target.value };
                        updateSection(idx, { ...section, notes: next });
                      }}
                      placeholder="Text poznámky"
                      className={fieldClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={deletePhotoIdx !== null}
        title="Odstranit fotku"
        message="Opravdu chcete tuto fotku odstranit?"
        onCancel={() => setDeletePhotoIdx(null)}
        onConfirm={() => {
          if (deletePhotoIdx !== null) onChange({ ...data, photos: photos.filter((_, i) => i !== deletePhotoIdx) });
          setDeletePhotoIdx(null);
        }}
      />
      <ConfirmModal
        open={deleteSectionIdx !== null}
        title="Odstranit sekci"
        message="Opravdu chcete tuto textovou sekci odstranit?"
        onCancel={() => setDeleteSectionIdx(null)}
        onConfirm={() => {
          if (deleteSectionIdx !== null) onChange({ ...data, sections: sections.filter((_, i) => i !== deleteSectionIdx) });
          setDeleteSectionIdx(null);
        }}
      />
    </div>
  );
}
