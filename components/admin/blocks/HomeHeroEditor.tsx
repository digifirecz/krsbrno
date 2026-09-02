import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import { TAB_TO_PATH, PAGE_TITLES } from '@/lib/routes';
import type { HomeHeroData } from '@/lib/blocks/types';

interface HomeHeroEditorProps {
  data: HomeHeroData;
  onChange: (data: HomeHeroData) => void;
  pageId: string;
}

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

const TARGET_OPTIONS = Object.keys(TAB_TO_PATH).map((tab) => ({
  tab,
  label: (PAGE_TITLES[tab] || tab).split(' | ')[0],
}));

export default function HomeHeroEditor({ data, onChange, pageId }: HomeHeroEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Text v pilulce nad nadpisem</label>
        <input
          type="text"
          value={data.pillText || ''}
          onChange={(e) => onChange({ ...data, pillText: e.target.value || undefined })}
          className={fieldClass}
          placeholder="Otevřené společenství v Brně-Židenicích"
        />
      </div>

      <div>
        <label className={labelClass}>
          Nadpis <span className="text-[#c93838]">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className={fieldClass}
          placeholder="Nejsi na to sám"
        />
      </div>

      <div>
        <label className={labelClass}>Zvýrazněné slovo v nadpisu</label>
        <input
          type="text"
          value={data.highlightWord || ''}
          onChange={(e) => onChange({ ...data, highlightWord: e.target.value || undefined })}
          className={fieldClass}
          placeholder="sám"
        />
        <p className="text-xs text-neutral-400 mt-1 px-0.5">Musí přesně odpovídat slovu v nadpisu, jinak se nezvýrazní.</p>
      </div>

      <div>
        <label className={labelClass}>Text (odstavce odděl prázdným řádkem)</label>
        <textarea
          rows={5}
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value || undefined })}
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60">
        <div className="sm:col-span-2">
          <label className={labelClass}>Hlavní tlačítko</label>
        </div>
        <div>
          <label className={labelClass}>Text tlačítka</label>
          <input
            type="text"
            value={data.buttonLabel || ''}
            onChange={(e) => onChange({ ...data, buttonLabel: e.target.value || undefined })}
            className={fieldClass}
            placeholder="Přijď mezi nás"
          />
        </div>
        <div>
          <label className={labelClass}>Cíl tlačítka</label>
          <select
            value={data.buttonUrl ? '__external__' : (data.buttonTarget || '')}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '__external__') {
                onChange({ ...data, buttonTarget: undefined, buttonUrl: data.buttonUrl || '' });
              } else {
                onChange({ ...data, buttonTarget: value || undefined, buttonUrl: undefined });
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
        {data.buttonUrl !== undefined && (
          <div className="sm:col-span-2">
            <label className={labelClass}>URL externího odkazu</label>
            <input
              type="text"
              value={data.buttonUrl}
              onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
              className={fieldClass}
              placeholder="https://…"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60">
        <div className="sm:col-span-2">
          <label className={labelClass}>Vedlejší tlačítko</label>
        </div>
        <div>
          <label className={labelClass}>Text tlačítka</label>
          <input
            type="text"
            value={data.secondaryButtonLabel || ''}
            onChange={(e) => onChange({ ...data, secondaryButtonLabel: e.target.value || undefined })}
            className={fieldClass}
            placeholder="Čemu věříme"
          />
        </div>
        <div>
          <label className={labelClass}>Cíl tlačítka</label>
          <select
            value={data.secondaryButtonUrl ? '__external__' : (data.secondaryButtonTarget || '')}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '__external__') {
                onChange({ ...data, secondaryButtonTarget: undefined, secondaryButtonUrl: data.secondaryButtonUrl || '' });
              } else {
                onChange({ ...data, secondaryButtonTarget: value || undefined, secondaryButtonUrl: undefined });
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
        {data.secondaryButtonUrl !== undefined && (
          <div className="sm:col-span-2">
            <label className={labelClass}>URL externího odkazu</label>
            <input
              type="text"
              value={data.secondaryButtonUrl}
              onChange={(e) => onChange({ ...data, secondaryButtonUrl: e.target.value })}
              className={fieldClass}
              placeholder="https://…"
            />
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Fotka</label>
        <PhotoUpload
          value={data.photo?.src || ''}
          pageId={pageId}
          aspectRatio={4 / 3}
          focal={data.photo?.focalX !== undefined ? { x: data.photo.focalX, y: data.photo.focalY ?? 50 } : undefined}
          onFocalChange={(f) => onChange({ ...data, photo: { ...data.photo, src: data.photo?.src || '', focalX: f.x, focalY: f.y } })}
          onChange={(src) => onChange({ ...data, photo: src ? { ...data.photo, src } : undefined })}
        />
        {data.photo?.src && (
          <input
            type="text"
            value={data.photo.caption || ''}
            onChange={(e) => onChange({ ...data, photo: { ...data.photo!, caption: e.target.value || undefined } })}
            placeholder="Popisek fotky"
            className={`${fieldClass} mt-2`}
          />
        )}
      </div>
    </div>
  );
}
