'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getArticles, deleteArticle } from '@/lib/actions/articles';
import type { Article } from '@/lib/articles';
import { eventDateSortKey } from '@/lib/eventDate';
import { Newspaper, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

type SortKey = 'title' | 'date' | 'created' | 'updated';

const PAGE_SIZE = 15;

const filterInput =
  'w-full px-2 py-1 rounded-lg border border-neutral-200 text-xs font-normal text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#c93838]/40 focus:border-[#c93838]';

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

function Author({ by, at }: { by?: string | null; at?: Date | null }) {
  if (!by && !at) return <span className="text-neutral-300">—</span>;
  return (
    <div className="leading-tight">
      <div className="text-neutral-800 truncate" title={by || undefined}>{by || '—'}</div>
      <div className="text-xs text-neutral-400">{fmtDate(at)}</div>
    </div>
  );
}

export default function AdminArticlesListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const [fTitle, setFTitle] = useState('');
  const [fState, setFState] = useState<'' | 'visible' | 'hidden'>('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = fTitle.trim().toLowerCase();
    return articles.filter((a) => {
      if (q && !(a.title || '').toLowerCase().includes(q)) return false;
      if (fState === 'visible' && !a.visible) return false;
      if (fState === 'hidden' && a.visible) return false;
      return true;
    });
  }, [articles, fTitle, fState]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === 'asc' ? 1 : -1;
    // Chybějící hodnota (bez data/bez autora) vždy až na konec, ať netříští řazení podle zbytku.
    const keyOf = (a: Article): number | string | null => {
      if (sortKey === 'title') return (a.title || '').toLowerCase();
      if (sortKey === 'date') return eventDateSortKey(a.dateText)?.getTime() ?? null;
      if (sortKey === 'created') return a.createdAt ? new Date(a.createdAt).getTime() : null;
      return a.updatedAt ? new Date(a.updatedAt).getTime() : null;
    };
    return [...filtered].sort((a, b) => {
      const ka = keyOf(a);
      const kb = keyOf(b);
      if (ka === null && kb === null) return 0;
      if (ka === null) return 1;
      if (kb === null) return -1;
      if (ka < kb) return -1 * dir;
      if (ka > kb) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const shown = sorted.slice(0, limit);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setLimit(PAGE_SIZE);
  };

  const sortHeader = (key: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => handleSort(key)}
      className="inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
    >
      <span>{label}</span>
      {sortKey === key &&
        (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
    </button>
  );

  return (
    <RequireAuth>
      {(user) => {
        const handleAdd = () => {
          router.push('/admin/clanky/novy');
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteArticle(id);
            setArticles((prev) => prev.filter((a) => a.id !== id));
            showToast('Článek byl smazán.');
          } catch (err) {
            showToast(`Článek se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Články</h1>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat článek</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádné články. Přidejte první tlačítkem výše.</p>
            ) : (
              <>
                <div className="rounded-2xl border border-neutral-200">
                  <table className="w-full table-fixed text-sm">
                    <thead>
                      <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                        <th className="px-4 pt-3 pb-1.5 w-14" />
                        <th className="px-4 pt-3 pb-1.5">{sortHeader('title', 'Titulek')}</th>
                        <th className="px-4 pt-3 pb-1.5 w-24">{sortHeader('date', 'Datum')}</th>
                        <th className="px-4 pt-3 pb-1.5 w-32">{sortHeader('created', 'Přidal')}</th>
                        <th className="px-4 pt-3 pb-1.5 w-32">{sortHeader('updated', 'Upravil')}</th>
                        <th className="px-4 pt-3 pb-1.5 w-32">Stav</th>
                        <th className="px-4 pt-3 pb-1.5 w-20" />
                      </tr>
                      <tr className="border-b border-neutral-200 bg-neutral-50/60">
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={fTitle}
                            onChange={(e) => {
                              setFTitle(e.target.value);
                              setLimit(PAGE_SIZE);
                            }}
                            placeholder="filtrovat titulek…"
                            className={filterInput}
                          />
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2">
                          <select
                            value={fState}
                            onChange={(e) => {
                              setFState(e.target.value as '' | 'visible' | 'hidden');
                              setLimit(PAGE_SIZE);
                            }}
                            className={filterInput}
                          >
                            <option value="">vše</option>
                            <option value="visible">viditelné</option>
                            <option value="hidden">skryté</option>
                          </select>
                        </td>
                        <td className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((a) => (
                        <tr key={a.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                          <td className="px-4 py-3 align-top">
                            <div className="relative w-10 h-10 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0 overflow-hidden">
                              {a.image ? (
                                <Image src={a.image} alt="" fill className="object-cover" unoptimized />
                              ) : (
                                <Newspaper className="w-4 h-4" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-neutral-900">{a.title || 'Bez titulku'}</span>
                          </td>
                          <td className="px-4 py-3 align-top text-neutral-500 whitespace-nowrap leading-tight">
                            <div>{a.dateText || '—'}</div>
                            {a.timeText && <div className="text-xs text-neutral-400">{a.timeText}</div>}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={a.createdBy} at={a.createdAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={a.updatedBy} at={a.updatedAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                a.visible ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {a.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              {a.visible ? 'viditelné' : 'skryté'}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => router.push(`/admin/clanky/${a.id}`)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                                aria-label="Upravit"
                                title="Upravit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(a)}
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
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-neutral-400">
                            Žádné články neodpovídají filtru.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {limit < filtered.length && (
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => setLimit((n) => n + PAGE_SIZE)}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:border-[#c93838] hover:text-[#c93838] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Načíst dalších {Math.min(PAGE_SIZE, filtered.length - limit)}</span>
                    </button>
                  </div>
                )}
              </>
            )}

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat článek"
              message={`Opravdu chcete článek „${deleteTarget?.title || 'bez titulku'}“ trvale smazat?`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
