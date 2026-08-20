import type { MapEmbedData } from '@/lib/blocks/types';

interface MapEmbedEditorProps {
  data: MapEmbedData;
  onChange: (data: MapEmbedData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function MapEmbedEditor({ data, onChange }: MapEmbedEditorProps) {
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
        <label className={labelClass}>Podnadpis</label>
        <input
          type="text"
          value={data.subheading || ''}
          onChange={(e) => onChange({ ...data, subheading: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Embed URL <span className="text-[#c93838]">*</span>
        </label>
        <textarea
          rows={3}
          value={data.embedUrl}
          onChange={(e) => onChange({ ...data, embedUrl: e.target.value })}
          className={fieldClass}
          placeholder="https://…"
        />
      </div>
    </div>
  );
}
