'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import NewSermonModal from '@/components/admin/blocks/NewSermonModal';
import SearchSelect from '@/components/admin/blocks/SearchSelect';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import Badge from '@/components/admin/blocks/Badge';
import { useToast } from '@/components/admin/ToastProvider';
import {
  getSermons,
  getSermonCategories,
  getSermonSpeakers,
  createSermon,
  updateSermon,
  deleteSermon,
} from '@/lib/actions/sermons';
import type { Sermon, SermonCategory, SermonSpeaker } from '@/lib/sermons';
import { AudioLines, Plus, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

const PAGE_SIZE = 20;

function formatDate(value: Date | null | undefined): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

const filterInput =
  'w-full px-2 py-1 rounded-lg border border-neutral-200 text-xs font-normal text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#c93838]/40 focus:border-[#c93838]';

function Author({ by, at }: { by?: string | null; at?: Date | null }) {
  if (!by && !at) return <span className="text-neutral-300">—</span>;
  const d = at ? (at instanceof Date ? at : new Date(at)) : null;
  const when = d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '';
  return (
    <div className="leading-tight">
      <div className="text-neutral-800 truncate">{by || '—'}</div>
      <div className="text-xs text-neutral-400">{when}</div>
    </div>
  );
}

export default function AdminSermonsListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [cats, setCats] = useState<SermonCategory[]>([]);
  const [speakers, setSpeakers] = useState<SermonSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [activeCat, setActiveCat] = useState(''); // '' = Vše
  const [fName, setFName] = useState('');
  const [fSpeaker, setFSpeaker] = useState('');
  const [fState, setFState] = useState<'' | 'visible' | 'hidden'>('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState<Sermon | null>(null);

  useEffect(() => {
    Promise.all([getSermons(), getSermonCategories(), getSermonSpeakers()])
      .then(([s, c, sp]) => {
        setSermons(s);
        setCats(c);
        setSpeakers(sp);
      })
      .finally(() => setLoading(false));
  }, []);

  const catName = (id?: string | null) => cats.find((c) => c.id === id)?.name;
  const speakerName = (id?: string | null) => speakers.find((s) => s.id === id)?.name;

  const showCatCol = activeCat === '';
  const colCount = showCatCol ? 8 : 7;

  const filtered = useMemo(() => {
    const q = fName.trim().toLowerCase();
    return sermons.filter((s) => {
      if (activeCat && s.categoryId !== activeCat) return false;
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (fSpeaker && s.speakerId !== fSpeaker) return false;
      if (fState === 'visible' && !s.visible) return false;
      if (fState === 'hidden' && s.visible) return false;
      return true;
    });
  }, [sermons, activeCat, fName, fSpeaker, fState]);

  const shown = filtered.slice(0, limit);
  const resetLimit = () => setLimit(PAGE_SIZE);
  const selectCat = (id: string) => {
    setActiveCat(id);
    resetLimit();
  };

  return (
    <RequireAuth>
      {(user) => {
        const handleCreate = async (title: string) => {
          const id = await createSermon(user.email);
          await updateSermon(id, { title }, user.email);
          showToast('Záznam byl vytvořen.');
          router.push(`/admin/zaznamy/${id}`);
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { id } = deleteTarget;
          try {
            await deleteSermon(id);
            setSermons((prev) => prev.filter((s) => s.id !== id));
            showToast('Záznam byl smazán.');
          } catch (err) {
            showToast(`Záznam se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-full">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <AudioLines className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Záznamy</h1>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat záznam</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sermons.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádné záznamy. Přidejte první tlačítkem výše.</p>
            ) : (
              <>
                {/* category tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => selectCat('')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      activeCat === ''
                        ? 'bg-[#c93838] text-white'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    Vše
                  </button>
                  {cats.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectCat(c.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                        activeCat === c.id
                          ? 'bg-[#c93838] text-white'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                  <table className="w-full min-w-[960px] text-sm">
                    <thead>
                      <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                        <th className="px-4 pt-3 pb-1.5 w-24">Datum</th>
                        <th className="px-4 pt-3 pb-1.5">Název</th>
                        {showCatCol && <th className="px-4 pt-3 pb-1.5 w-40">Kategorie</th>}
                        <th className="px-4 pt-3 pb-1.5 w-36">Řečník</th>
                        <th className="px-4 pt-3 pb-1.5 w-28">Stav</th>
                        <th className="px-4 pt-3 pb-1.5 w-40">Přidal</th>
                        <th className="px-4 pt-3 pb-1.5 w-40">Upravil</th>
                        <th className="px-4 pt-3 pb-1.5 w-20" />
                      </tr>
                      {/* filter row */}
                      <tr className="border-b border-neutral-200 bg-neutral-50/60">
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={fName}
                            onChange={(e) => {
                              setFName(e.target.value);
                              resetLimit();
                            }}
                            placeholder="filtrovat název…"
                            className={filterInput}
                          />
                        </td>
                        {showCatCol && <td className="px-4 py-2" />}
                        <td className="px-4 py-2">
                          <SearchSelect
                            size="sm"
                            value={fSpeaker}
                            onChange={(v) => {
                              setFSpeaker(v);
                              resetLimit();
                            }}
                            options={speakers.map((sp) => ({ value: sp.id, label: sp.name }))}
                            emptyLabel="vše"
                            searchPlaceholder="Hledat řečníka…"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={fState}
                            onChange={(e) => {
                              setFState(e.target.value as '' | 'visible' | 'hidden');
                              resetLimit();
                            }}
                            className={filterInput}
                          >
                            <option value="">vše</option>
                            <option value="visible">viditelné</option>
                            <option value="hidden">skryté</option>
                          </select>
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((s) => (
                        <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                          <td className="px-4 py-3 text-neutral-500 whitespace-nowrap tabular-nums">{formatDate(s.date)}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-neutral-900">{s.title || 'Bez názvu'}</span>
                          </td>
                          {showCatCol && (
                            <td className="px-4 py-3">
                              {catName(s.categoryId) ? (
                                <Badge className="capitalize">{catName(s.categoryId)}</Badge>
                              ) : (
                                <span className="text-neutral-300">—</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 text-neutral-600">{speakerName(s.speakerId) || '—'}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                s.visible ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              {s.visible ? 'viditelné' : 'skryté'}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={s.createdBy} at={s.createdAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={s.updatedBy} at={s.updatedAt} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => router.push(`/admin/zaznamy/${s.id}`)}
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
                          <td colSpan={colCount} className="px-4 py-8 text-center text-sm text-neutral-400">
                            Žádné záznamy neodpovídají filtru.
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
                      <span>Načíst další ({filtered.length - limit})</span>
                    </button>
                  </div>
                )}
              </>
            )}

            <NewSermonModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />

            <ConfirmModal
              open={!!deleteTarget}
              title="Smazat záznam"
              message={`Opravdu chcete záznam „${deleteTarget?.title || 'bez názvu'}“ trvale smazat?`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
