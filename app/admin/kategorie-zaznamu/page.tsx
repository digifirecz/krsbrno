'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import NameModal from '@/components/admin/blocks/NameModal';
import TaxonTable from '@/components/admin/blocks/TaxonTable';
import { useToast } from '@/components/admin/ToastProvider';
import {
  getSermonCategories,
  createSermonCategory,
  updateSermonCategory,
  deleteSermonCategory,
} from '@/lib/actions/sermons';
import type { SermonCategory } from '@/lib/sermons';
import { Tag, Plus } from 'lucide-react';

export default function SermonCategoriesPage() {
  const { showToast } = useToast();
  const [cats, setCats] = useState<SermonCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SermonCategory | null>(null);

  useEffect(() => {
    getSermonCategories()
      .then(setCats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handleAdd = async (name: string) => {
          const cat = await createSermonCategory(name, user.email);
          setCats((prev) => [...prev, cat].sort((a, b) => a.order - b.order));
          setAddOpen(false);
          showToast('Kategorie byla přidána.');
        };

        const handleRename = async (id: string, name: string) => {
          try {
            await updateSermonCategory(id, { name }, user.email);
            setCats((prev) =>
              prev.map((c) => (c.id === id ? { ...c, name, updatedBy: user.email, updatedAt: new Date() } : c)),
            );
            showToast('Kategorie byla přejmenována.');
          } catch (err) {
            showToast(`Přejmenování se nezdařilo${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteSermonCategory(id);
            setCats((prev) => prev.filter((c) => c.id !== id));
            showToast('Kategorie byla smazána. Záznamy v ní zůstaly bez kategorie.');
          } catch (err) {
            showToast(`Smazání se nezdařilo${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Kategorie</h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat kategorii</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : cats.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádné kategorie. Přidejte první tlačítkem výše.</p>
            ) : (
              <TaxonTable items={cats} nameLabel="Kategorie" onRename={handleRename} onDelete={setDeleteTarget} />
            )}

            <NameModal
              open={addOpen}
              title="Nová kategorie"
              label="Název kategorie"
              submitLabel="Vytvořit kategorii"
              placeholder="Např. nedělní bohoslužba"
              onClose={() => setAddOpen(false)}
              onCreate={handleAdd}
            />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat kategorii"
              message={`Opravdu smazat kategorii „${deleteTarget?.name ?? ''}“? Záznamy v ní zůstanou, jen ztratí zařazení.`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
