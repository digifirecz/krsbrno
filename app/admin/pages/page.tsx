'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import NewPageModal from '@/components/admin/NewPageModal';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getManagedPages, createPage, deletePage } from '@/lib/actions/pages';
import type { ManagedPage } from '@/lib/pages';
import { Files, Plus, Pencil, Trash2, Lock } from 'lucide-react';

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
      <div className="text-neutral-800 truncate">{by || '—'}</div>
      <div className="text-xs text-neutral-400">{fmtDate(at)}</div>
    </div>
  );
}

export default function AdminPagesListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [rows, setRows] = useState<ManagedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ManagedPage | null>(null);

  useEffect(() => {
    getManagedPages()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handleCreate = async (label: string) => {
          const slug = await createPage(label, user.email);
          showToast('Stránka byla vytvořena.');
          router.push(`/admin/pages/${slug}`);
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deletePage(id);
            setRows((prev) => prev.filter((p) => p.id !== id));
            showToast('Stránka byla smazána.');
          } catch (err) {
            showToast(`Stránku se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Files className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Stránky</h1>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat stránku</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                      <th className="px-4 py-3">Název</th>
                      <th className="px-4 py-3 w-44">Přidal</th>
                      <th className="px-4 py-3 w-44">Upravil</th>
                      <th className="px-4 py-3 w-20" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const canDelete = !row.builtIn && !row.protected;
                      return (
                        <tr key={row.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-neutral-900 inline-flex items-center gap-1.5">
                              {row.label}
                              {!canDelete && (
                                <span title="Nelze smazat" className="text-neutral-300">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={row.createdBy} at={row.createdAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={row.updatedBy} at={row.updatedAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => router.push(`/admin/pages/${row.id}`)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                                aria-label="Upravit"
                                title="Upravit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={!canDelete}
                                onClick={() => setDeleteTarget(row)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                aria-label="Smazat"
                                title={canDelete ? 'Smazat' : 'Tuto stránku nelze smazat'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <NewPageModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat stránku"
              message={`Opravdu chcete stránku „${deleteTarget?.label ?? ''}“ trvale smazat i s jejím obsahem?`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
