import { Music } from 'lucide-react';

export default function SermonsBlockEditor() {
  return (
    <div className="flex items-start space-x-2.5 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
      <Music className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
      <p className="text-xs text-neutral-500 leading-relaxed">
        Zde se zobrazí vyhledávání, filtrování podle kategorie a přehrávač kázání (viz „Kázání“ v administraci). Nic dalšího tu nastavovat nemusíte.
      </p>
    </div>
  );
}
