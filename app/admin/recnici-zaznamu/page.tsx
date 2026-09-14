'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getSermonSpeakers, deleteSermonSpeaker } from '@/lib/actions/sermons';
import type { SermonSpeaker } from '@/lib/sermons';
import { Mic, Plus, Pencil, Trash2 } from 'lucide-react';

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Author({ by, at }: { by?: string | null; at?: Date | null }) {
  if (!by && !at) return <span className="text-neutral-300">—</span>;
  return (
    <div className="leading-tight">
      <div className="text-neutral-800 truncate" title={by || undefined}>{by || <span className="text-neutral-300">—</span>}</div>
      <div className="text-xs text-neutral-400">{fmtDate(at)}</div>
    </div>
  );
}

export default function SermonSpeakersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [speakers, setSpeakers] = useState<SermonSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SermonSpeaker | null>(null);

  useEffect(() => {
    getSermonSpeakers()
      .then(setSpeakers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {() => {
        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteSermonSpeaker(id);
            setSpeakers((prev) => prev.filter((s) => s.id !== id));
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Řečníci</h1>
              </div>
              <button
                type="button"
                onClick={() => router.push('/admin/recnici-zaznamu/novy')}
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
            ) : speakers.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádní řečníci. Přidejte prvního tlačítkem výše.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                      <th className="px-4 py-3">Jméno</th>
                      <th className="px-4 py-3">Přidal</th>
                      <th className="px-4 py-3">Upravil</th>
                      <th className="px-4 py-3 w-24 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {speakers.map((s) => (
                      <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-4 py-3 align-top">
                          <span className="font-semibold text-neutral-900">{s.name}</span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Author by={s.createdBy} at={s.createdAt} />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Author by={s.updatedBy} at={s.updatedAt} />
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              type="button"
                              onClick={() => router.push(`/admin/recnici-zaznamu/${s.id}`)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                              aria-label="Upravit"
                              title="Upravit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(s)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer"
                              aria-label="Smazat"
                              title="Smazat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
