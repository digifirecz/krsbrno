import type { QuoteData } from '@/lib/blocks/types';

interface QuoteEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

export default function QuoteEditor({ data, onChange }: QuoteEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Text citace <span className="text-[#c93838]">*</span>
        </label>
        <textarea
          rows={3}
          value={data.quote}
          onChange={(e) => onChange({ ...data, quote: e.target.value })}
          className={fieldClass}
          placeholder="„…“"
        />
      </div>

      <div>
        <label className={labelClass}>Podtext (autor, zdroj)</label>
        <input
          type="text"
          value={data.citation || ''}
          onChange={(e) => onChange({ ...data, citation: e.target.value || undefined })}
          className={fieldClass}
          placeholder="Např. Modlitba odevzdání"
        />
      </div>
    </div>
  );
}
