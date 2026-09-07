'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import NameModal from '@/components/admin/blocks/NameModal';
import TaxonTable from '@/components/admin/blocks/TaxonTable';
import { useToast } from '@/components/admin/ToastProvider';
import {
  getSermonSpeakers,
  createSermonSpeaker,
  updateSermonSpeaker,
  deleteSermonSpeaker,
} from '@/lib/actions/sermons';
import type { SermonSpeaker } from '@/lib/sermons';
import { Mic, Plus } from 'lucide-react';

export default function SermonSpeakersPage() {
  const { showToast } = useToast();
  const [cats, setCats] = useState<SermonSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SermonSpeaker | null>(null);

  useEffect(() => {
    getSermonSpeakers()
      .then(setCats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handleAdd = async (name: string) => {
          const cat = await createSermonSpeaker(name, user.email);
          setCats((prev) => [...prev, cat].sort((a, b) => a.order - b.order));
          setAddOpen(false);
          showToast('Řečník byl přidán.');
        };

        const handleRename = async (id: string, name: string) => {
          try {
            await updateSermonSpeaker(id, { name }, user.email);
            setCats((prev) =>
              prev.map((c) => (c.id === id ? { ...c, name, updatedBy: user.email, updatedAt: new Date() } : c)),
            );
            showToast('Řečník byl přejmenován.');
          } catch (err) {
            showToast(`Přejmenování se nezdařilo${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteSermonSpeaker(id);
            setCats((prev) => prev.filter((c) => c.id !== id));
            showToast('Řečník byl smazán. U dotčených záznamů zůstalo pole řečník prázdné.');
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
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Řečníci</h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat řečníka</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : cats.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádní řečníci. Přidejte prvního tlačítkem výše.</p>
            ) : (
              <TaxonTable items={cats} nameLabel="Jméno" onRename={handleRename} onDelete={setDeleteTarget} />
            )}

            <NameModal
              open={addOpen}
              title="Nový řečník"
              label="Jméno řečníka"
              submitLabel="Vytvořit řečníka"
              placeholder="Např. Petr Svoboda"
              onClose={() => setAddOpen(false)}
              onCreate={handleAdd}
            />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat řečníka"
              message={`Opravdu smazat řečníka „${deleteTarget?.name ?? ''}“? U záznamů s tímto řečníkem se pole vyprázdní.`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
