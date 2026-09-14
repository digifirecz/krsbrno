'use client';

import { useState } from 'react';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { TAB_TO_PATH, PAGE_TITLES } from '@/lib/routes';
import type { SupportOptionsData } from '@/lib/blocks/types';
import { Plus, Trash2 } from 'lucide-react';

const TARGET_OPTIONS = Object.keys(TAB_TO_PATH).map((tab) => ({
  tab,
  label: (PAGE_TITLES[tab] || tab).split(' | ')[0],
}));

interface SupportOptionsEditorProps {
  data: SupportOptionsData;
  onChange: (data: SupportOptionsData) => void;
  pageId: string;
}

const fieldBase = 'px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const fieldClass = `w-full ${fieldBase}`;
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';
const sectionLabelClass = 'text-xs font-bold uppercase tracking-wider text-neutral-400';

export default function SupportOptionsEditor({ data, onChange, pageId }: SupportOptionsEditorProps) {
  const vs = data.financial.variableSymbols || [];
  const [deleteVsIdx, setDeleteVsIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Ikona nadpisu sekce</label>
        <IconPicker value={data.icon} onChange={(icon) => onChange({ ...data, icon })} />
      </div>

      <div>
        <label className={labelClass}>Název karty</label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={(e) => onChange({ ...data, heading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Popis</label>
        <textarea
          rows={2}
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="p-3 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/60">
        <span className={sectionLabelClass}>Karta s platbou</span>

        <div>
          <label className={labelClass}>Ikona</label>
          <IconPicker
            value={data.financial.icon}
            onChange={(icon) => onChange({ ...data, financial: { ...data.financial, icon } })}
          />
        </div>
        <div>
          <label className={labelClass}>
            Nadpis <span className="text-[#c93838]">*</span>
          </label>
          <input
            type="text"
            value={data.financial.title}
            onChange={(e) => onChange({ ...data, financial: { ...data.financial, title: e.target.value } })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Popis</label>
          <textarea
            rows={2}
            value={data.financial.text || ''}
            onChange={(e) => onChange({ ...data, financial: { ...data.financial, text: e.target.value || undefined } })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Zvýrazněný dodatek</label>
          <textarea
            rows={2}
            value={data.financial.highlight || ''}
            onChange={(e) => onChange({ ...data, financial: { ...data.financial, highlight: e.target.value || undefined } })}
            className={fieldClass}
          />
        </div>

        <div className="pt-1 border-t border-neutral-200 space-y-2">
          <span className="text-xs font-semibold text-neutral-500">Bankovní účet</span>
          <div>
            <label className={labelClass}>Název banky</label>
            <input
              type="text"
              value={data.financial.bankName || ''}
              onChange={(e) => onChange({ ...data, financial: { ...data.financial, bankName: e.target.value || undefined } })}
              placeholder="Např. Fio banka, a.s."
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Číslo účtu <span className="text-[#c93838]">*</span>
            </label>
            <input
              type="text"
              value={data.financial.accountNumber}
              onChange={(e) => onChange({ ...data, financial: { ...data.financial, accountNumber: e.target.value } })}
              placeholder="Např. 2500752953/2010"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              IBAN <span className="text-[#c93838]">*</span>
            </label>
            <input
              type="text"
              value={data.financial.iban}
              onChange={(e) => onChange({ ...data, financial: { ...data.financial, iban: e.target.value } })}
              placeholder="Podle něj se generuje QR platba"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Variabilní symboly</span>
            <button
              type="button"
              onClick={() => onChange({ ...data, financial: { ...data.financial, variableSymbols: [...vs, { code: '', label: '' }] } })}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Přidat symbol</span>
            </button>
          </div>
          {vs.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={item.code}
                onChange={(e) => {
                  const next = [...vs];
                  next[idx] = { ...next[idx], code: e.target.value };
                  onChange({ ...data, financial: { ...data.financial, variableSymbols: next } });
                }}
                placeholder="Kód"
                className={`${fieldBase} w-28 shrink-0`}
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const next = [...vs];
                  next[idx] = { ...next[idx], label: e.target.value };
                  onChange({ ...data, financial: { ...data.financial, variableSymbols: next } });
                }}
                placeholder="Účel"
                className={`${fieldBase} flex-1 min-w-0`}
              />
              <button
                type="button"
                onClick={() => setDeleteVsIdx(idx)}
                className="text-neutral-400 hover:text-[#c93838] cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/60">
        <span className={sectionLabelClass}>Karta s popisem</span>

        <IconPicker
          value={data.involvement.icon}
          onChange={(icon) => onChange({ ...data, involvement: { ...data.involvement, icon } })}
        />
        <input
          type="text"
          value={data.involvement.title}
          onChange={(e) => onChange({ ...data, involvement: { ...data.involvement, title: e.target.value } })}
          placeholder="Titulek karty *"
          className={fieldClass}
        />
        <textarea
          rows={3}
          value={data.involvement.text || ''}
          onChange={(e) => onChange({ ...data, involvement: { ...data.involvement, text: e.target.value || undefined } })}
          placeholder="Text"
          className={fieldClass}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={data.involvement.linkLabel || ''}
            onChange={(e) => onChange({ ...data, involvement: { ...data.involvement, linkLabel: e.target.value || undefined } })}
            placeholder="Text odkazu (např. Přehled služeb)"
            className={fieldClass}
          />
          <select
            value={data.involvement.linkUrl !== undefined ? '__external__' : (data.involvement.linkTarget || '')}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '__external__') {
                onChange({ ...data, involvement: { ...data.involvement, linkTarget: undefined, linkUrl: data.involvement.linkUrl || '' } });
              } else {
                onChange({ ...data, involvement: { ...data.involvement, linkTarget: value || undefined, linkUrl: undefined } });
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
        {data.involvement.linkUrl !== undefined && (
          <input
            type="text"
            value={data.involvement.linkUrl}
            onChange={(e) => onChange({ ...data, involvement: { ...data.involvement, linkUrl: e.target.value } })}
            placeholder="https://…"
            className={fieldClass}
          />
        )}

        <PhotoUpload
          value={data.involvement.photo?.src || ''}
          pageId={pageId}
          aspectRatio={16 / 10}
          focal={data.involvement.photo?.focalX !== undefined ? { x: data.involvement.photo.focalX, y: data.involvement.photo.focalY ?? 50, zoom: data.involvement.photo.zoom } : undefined}
          onFocalChange={(f) =>
            onChange({
              ...data,
              involvement: { ...data.involvement, photo: { ...data.involvement.photo, src: data.involvement.photo?.src || '', focalX: f.x, focalY: f.y, zoom: f.zoom } },
            })
          }
          onChange={(src) => onChange({ ...data, involvement: { ...data.involvement, photo: src ? { ...data.involvement.photo, src } : undefined } })}
        />
        {data.involvement.photo?.src && (
          <input
            type="text"
            value={data.involvement.photo.caption || ''}
            onChange={(e) => onChange({ ...data, involvement: { ...data.involvement, photo: { ...data.involvement.photo!, caption: e.target.value || undefined } } })}
            placeholder="Popisek fotky"
            className={fieldClass}
          />
        )}
      </div>

      <ConfirmModal
        open={deleteVsIdx !== null}
        title="Odstranit symbol"
        message="Opravdu chcete tento variabilní symbol odstranit?"
        onCancel={() => setDeleteVsIdx(null)}
        onConfirm={() => {
          if (deleteVsIdx !== null) onChange({ ...data, financial: { ...data.financial, variableSymbols: vs.filter((_, i) => i !== deleteVsIdx) } });
          setDeleteVsIdx(null);
        }}
      />
    </div>
  );
}
