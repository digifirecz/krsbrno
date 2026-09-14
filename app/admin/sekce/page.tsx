'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import AddBlockModal from '@/components/admin/blocks/AddBlockModal';
import SearchSelect from '@/components/admin/blocks/SearchSelect';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getSections, createSection, deleteSection } from '@/lib/actions/sections';
import type { Section } from '@/lib/sections';
import { getBlockTypeLabel } from '@/lib/blocks/registry';
import type { BlockType } from '@/lib/blocks/types';
import Badge from '@/components/admin/blocks/Badge';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';

const filterInput =
  'w-full px-2 py-1 rounded-lg border border-neutral-200 text-xs font-normal text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#c93838]/40 focus:border-[#c93838]';

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

export default function AdminSectionsListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const [fName, setFName] = useState('');
  const [fType, setFType] = useState('');

  useEffect(() => {
    getSections()
      .then(setSections)
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  const typeOptions = useMemo(
    () =>
      [...new Set(sections.map((s) => s.type))]
        .map((t) => ({ value: t, label: getBlockTypeLabel(t) }))
        .sort((a, b) => a.label.localeCompare(b.label, 'cs')),
    [sections],
  );

  const filtered = useMemo(() => {
    const q = fName.trim().toLowerCase();
    return sections.filter((s) => {
      if (fType && s.type !== fType) return false;
      if (q && !(s.name || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sections, fName, fType]);

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

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteSection(id);
            setSections((prev) => prev.filter((s) => s.id !== id));
            showToast('Sekce byla smazána.');
          } catch (err) {
            showToast(`Sekci se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Layers className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Sekce</h1>
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
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sections.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádné sekce. Přidejte první tlačítkem výše.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                      <th className="px-4 pt-3 pb-1.5">Název</th>
                      <th className="px-4 pt-3 pb-1.5 w-48">Typ</th>
                      <th className="px-4 pt-3 pb-1.5 w-44">Přidal</th>
                      <th className="px-4 pt-3 pb-1.5 w-44">Upravil</th>
                      <th className="px-4 pt-3 pb-1.5 w-20" />
                    </tr>
                    <tr className="border-b border-neutral-200 bg-neutral-50/60">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={fName}
                          onChange={(e) => setFName(e.target.value)}
                          placeholder="filtrovat název…"
                          className={filterInput}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <SearchSelect
                          size="sm"
                          value={fType}
                          onChange={setFType}
                          options={typeOptions}
                          emptyLabel="vše"
                          searchPlaceholder="Hledat typ…"
                        />
                      </td>
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-4 py-3 align-top">
                          <span className="font-semibold text-neutral-900">{s.name || 'Bez názvu'}</span>
                        </td>
                        <td className="px-4 py-3 align-top"><Badge>{getBlockTypeLabel(s.type)}</Badge></td>
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
                              onClick={() => router.push(`/admin/sekce/${s.id}`)}
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
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400">
                          Žádné sekce neodpovídají filtru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <AddBlockModal open={addOpen} onClose={() => setAddOpen(false)} onPick={handlePick} />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat sekci"
              message={`Opravdu chcete sekci „${deleteTarget?.name || 'bez názvu'}“ smazat? Pokud je použitá na některé stránce, blok tam přestane fungovat.`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
