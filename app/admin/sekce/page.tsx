'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import AddBlockModal from '@/components/admin/blocks/AddBlockModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getSections, createSection, type Section } from '@/lib/sections';
import { getBlockTypeLabel } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import { ChevronRight, Layers, Plus } from 'lucide-react';

export default function AdminSectionsListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    getSections()
      .then(setSections)
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handlePick = async (type: BlockType) => {
          setAddOpen(false);
          try {
            const id = await createSection(getBlockTypeLabel(type), type, user.email);
            showToast('Sekce byla vytvořena.');
            router.push(`/admin/sekce/${id}`);
          } catch (err) {
            showToast(`Sekci se nepodařilo vytvořit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-3xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                    Sekce
                  </h1>
                  <p className="text-sm text-neutral-600 mt-0.5">
                    Znovupoužitelný obsah — vytvoříte jednou, přidáte na libovolné stránky přes „Přidat sekci“.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat sekci</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/admin/sekce/${section.id}`}
                    className="group flex items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl hover:border-[#c93838]/50 hover:shadow-sm transition-all gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#c93838] group-hover:text-white">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900 truncate block">{section.name || 'Bez názvu'}</span>
                        <span className="text-xs text-neutral-400">{getBlockTypeLabel(section.type)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}

                {sections.length === 0 && (
                  <p className="text-sm text-neutral-400 px-1">Zatím žádné sekce. Přidejte první tlačítkem výše.</p>
                )}
              </div>
            )}

            <AddBlockModal open={addOpen} onClose={() => setAddOpen(false)} onPick={handlePick} />
          </div>
        );
      }}
    </RequireAuth>
  );
}
