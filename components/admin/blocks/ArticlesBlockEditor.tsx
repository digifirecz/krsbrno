import IconPicker from '@/components/admin/blocks/IconPicker';
import type { ArticlesBlockData } from '@/lib/blocks/types';
import { Newspaper } from 'lucide-react';

interface ArticlesBlockEditorProps {
  data: ArticlesBlockData;
  onChange: (data: ArticlesBlockData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function ArticlesBlockEditor({ data, onChange }: ArticlesBlockEditorProps) {
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
          placeholder="Události"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Popis</label>
        <textarea
          rows={3}
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value || undefined })}
          placeholder="Krátký popis pod nadpisem"
          className={fieldClass}
        />
      </div>

      <div className="flex items-start space-x-2.5 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
        <Newspaper className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-500 leading-relaxed">
          Zde se zobrazí seznam publikovaných článků (viz „Články“ v administraci). Karty se načtou automaticky, nic dalšího tu nastavovat nemusíte.
        </p>
      </div>
    </div>
  );
}
