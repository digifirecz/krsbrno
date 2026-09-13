'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import NameModal from '@/components/admin/blocks/NameModal';
import TaxonTable from '@/components/admin/blocks/TaxonTable';
import { useToast } from '@/components/admin/ToastProvider';
import { getNavGroups, createNavGroup, updateNavGroup, deleteNavGroup } from '@/lib/actions/pages';
import type { NavGroup } from '@/lib/pages';
import type { SermonTaxon } from '@/lib/sermons';
import { Tag, Plus } from 'lucide-react';

const toTaxon = (g: NavGroup): SermonTaxon => ({
  id: g.id,
  name: g.label,
  order: g.order ?? 0,
  createdAt: g.createdAt ?? null,
  createdBy: g.createdBy ?? null,
  updatedAt: g.updatedAt ?? null,
  updatedBy: g.updatedBy ?? null,
});

export default function PageCategoriesPage() {
  const { showToast } = useToast();
  const [groups, setGroups] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NavGroup | null>(null);

  useEffect(() => {
    getNavGroups()
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handleAdd = async (label: string) => {
          const g = await createNavGroup(label, user.email);
          setGroups((prev) => [...prev, g]);
          setAddOpen(false);
          showToast('Kategorie byla přidána.');
        };

        const handleRename = async (id: string, label: string) => {
          try {
            await updateNavGroup(id, label, user.email);
            setGroups((prev) =>
              prev.map((g) => (g.id === id ? { ...g, label, updatedBy: user.email, updatedAt: new Date() } : g)),
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
            await deleteNavGroup(id);
            setGroups((prev) => prev.filter((g) => g.id !== id));
            showToast('Kategorie byla smazána.');
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Kategorie stránek</h1>
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
            ) : groups.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">
                Zatím žádné kategorie. Stránky se stejnou kategorií se v hlavičce webu sloučí pod jedno rozbalovací menu.
              </p>
            ) : (
              <TaxonTable
                items={groups.map(toTaxon)}
                nameLabel="Kategorie"
                onRename={handleRename}
                onDelete={(t) => setDeleteTarget(groups.find((g) => g.id === t.id) ?? null)}
              />
            )}

            <NameModal
              open={addOpen}
              title="Nová kategorie"
              label="Název kategorie"
              submitLabel="Vytvořit kategorii"
              placeholder="Např. Kdo jsme"
              hint="Stránky se stejnou kategorií se v hlavičce webu sloučí pod jedno rozbalovací menu."
              onClose={() => setAddOpen(false)}
              onCreate={handleAdd}
            />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat kategorii"
              message={`Opravdu smazat kategorii „${deleteTarget?.label ?? ''}“? Stránky, které do ní patří, se v menu dál zobrazují pohromadě.`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
