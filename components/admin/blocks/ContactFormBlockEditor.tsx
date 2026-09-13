'use client';

import { useState } from 'react';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import type { ContactFormBlockData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

interface ContactFormBlockEditorProps {
  data: ContactFormBlockData;
  onChange: (data: ContactFormBlockData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';
const sectionLabelClass = 'text-xs font-bold uppercase tracking-wider text-neutral-400';

export default function ContactFormBlockEditor({ data, onChange }: ContactFormBlockEditorProps) {
  const contacts = data.contacts || [];
  const topics = data.topics && data.topics.length > 0 ? data.topics : [''];
  const [deleteContactIdx, setDeleteContactIdx] = useState<number | null>(null);
  const [deleteTopicIdx, setDeleteTopicIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="p-3 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/60">
        <span className={sectionLabelClass}>Karta s e-maily</span>

        <input
          type="text"
          value={data.emailsHeading || ''}
          onChange={(e) => onChange({ ...data, emailsHeading: e.target.value || undefined })}
          placeholder="Nadpis (např. E-mailové kontakty)"
          className={fieldClass}
        />
        <input
          type="text"
          value={data.emailsSubheading || ''}
          onChange={(e) => onChange({ ...data, emailsSubheading: e.target.value || undefined })}
          placeholder="Podnadpis"
          className={fieldClass}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">E-mailové kontakty</span>
            <button
              type="button"
              onClick={() => onChange({ ...data, contacts: [...contacts, { email: '' }] })}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Přidat kontakt</span>
            </button>
          </div>
          {contacts.map((contact, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-neutral-200 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-500">Kontakt {idx + 1}</span>
                <button type="button" onClick={() => setDeleteContactIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => {
                  const next = [...contacts];
                  next[idx] = { ...next[idx], email: e.target.value };
                  onChange({ ...data, contacts: next });
                }}
                placeholder="jméno@krsbrno.cz *"
                className={fieldClass}
              />
              <input
                type="text"
                value={contact.description || ''}
                onChange={(e) => {
                  const next = [...contacts];
                  next[idx] = { ...next[idx], description: e.target.value || undefined };
                  onChange({ ...data, contacts: next });
                }}
                placeholder="K čemu tento e-mail slouží"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/60">
        <span className={sectionLabelClass}>Formulář</span>

        <input
          type="text"
          value={data.formHeading || ''}
          onChange={(e) => onChange({ ...data, formHeading: e.target.value || undefined })}
          placeholder="Nadpis (např. Napište nám zprávu)"
          className={fieldClass}
        />
        <textarea
          rows={2}
          value={data.formText || ''}
          onChange={(e) => onChange({ ...data, formText: e.target.value || undefined })}
          placeholder="Úvodní text nad formulářem"
          className={fieldClass}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Témata dotazu (nabídka ve formuláři)</span>
            <button
              type="button"
              onClick={() => onChange({ ...data, topics: [...topics, ''] })}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Přidat téma</span>
            </button>
          </div>
          {topics.map((topic, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  const next = [...topics];
                  next[idx] = e.target.value;
                  onChange({ ...data, topics: next });
                }}
                placeholder="Téma"
                className={fieldClass}
              />
              <button type="button" onClick={() => setDeleteTopicIdx(idx)} className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={deleteContactIdx !== null}
        title="Odstranit kontakt"
        message="Opravdu chcete tento e-mailový kontakt odstranit?"
        onCancel={() => setDeleteContactIdx(null)}
        onConfirm={() => {
          if (deleteContactIdx !== null) onChange({ ...data, contacts: contacts.filter((_, i) => i !== deleteContactIdx) });
          setDeleteContactIdx(null);
        }}
      />

      <ConfirmModal
        open={deleteTopicIdx !== null}
        title="Odstranit téma"
        message="Opravdu chcete toto téma odstranit?"
        onCancel={() => setDeleteTopicIdx(null)}
        onConfirm={() => {
          if (deleteTopicIdx !== null) onChange({ ...data, topics: topics.filter((_, i) => i !== deleteTopicIdx) });
          setDeleteTopicIdx(null);
        }}
      />
    </div>
  );
}
