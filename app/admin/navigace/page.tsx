'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import AddPageModal from '@/components/admin/AddPageModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getNavConfig, setNavVisibility, getHomePageId, setHomePageId, type PageNavEntry } from '@/lib/pages';
import { getIcon } from '@/lib/blocks/icons';
import { LayoutTemplate, Home, PanelTop, PanelBottom, Plus, X, Save, CheckCircle2 } from 'lucide-react';

interface Visibility {
  showInHeader: boolean;
  showInFooter: boolean;
}

export default function AdminNavigationPage() {
  const { showToast } = useToast();
  const [pages, setPages] = useState<PageNavEntry[]>([]);
  const [draft, setDraft] = useState<Record<string, Visibility>>({});
  const [loading, setLoading] = useState(true);
  const [addHeaderOpen, setAddHeaderOpen] = useState(false);
  const [addFooterOpen, setAddFooterOpen] = useState(false);
  const [homePageId, setHomePageIdState] = useState('');
  const [draftHomePageId, setDraftHomePageId] = useState('');
  const [savingAll, setSavingAll] = useState(false);
  const [savedAll, setSavedAll] = useState(false);

  useEffect(() => {
    Promise.all([getNavConfig(), getHomePageId()])
      .then(([entries, homeId]) => {
        const sorted = entries.sort((a, b) => Number(a.id) - Number(b.id));
        setPages(sorted);
        setDraft(Object.fromEntries(sorted.map((p) => [p.id, { showInHeader: p.showInHeader, showInFooter: p.showInFooter }])));
        setHomePageIdState(homeId || '');
        setDraftHomePageId(homeId || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const protectedPage = pages.find((p) => p.protected);

  const anyDirty =
    draftHomePageId !== homePageId ||
    pages.some((p) => {
      const d = draft[p.id];
      return d && (d.showInHeader !== p.showInHeader || d.showInFooter !== p.showInFooter);
    });

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      const writes: Promise<void>[] = [];
      if (draftHomePageId !== homePageId) {
        writes.push(setHomePageId(draftHomePageId || null));
      }
      const changedPages = pages.filter((p) => {
        const d = draft[p.id];
        return d && (d.showInHeader !== p.showInHeader || d.showInFooter !== p.showInFooter);
      });
      changedPages.forEach((p) => {
        writes.push(setNavVisibility(p.id, { showInHeader: draft[p.id].showInHeader, showInFooter: draft[p.id].showInFooter }));
      });

      await Promise.all(writes);

      setPages((prev) => prev.map((p) => (draft[p.id] ? { ...p, ...draft[p.id] } : p)));
      setHomePageIdState(draftHomePageId);
      setSavedAll(true);
      setTimeout(() => setSavedAll(false), 3000);
      showToast('Navigace byla uložena.');
    } catch (err) {
      showToast(`Navigaci se nepodařilo uložit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    } finally {
      setSavingAll(false);
    }
  };

  const headerPages = pages.filter((p) => draft[p.id]?.showInHeader);
  const footerPages = pages.filter((p) => draft[p.id]?.showInFooter);
  const headerCandidates = pages.filter((p) => !draft[p.id]?.showInHeader);
  const footerCandidates = pages.filter((p) => !draft[p.id]?.showInFooter);

  const headerGroupedList = (() => {
    const groupBuckets = new Map<string, { groupId: string; groupLabel: string; items: PageNavEntry[] }>();
    const standalone: PageNavEntry[] = [];
    headerPages.forEach((page) => {
      if (page.headerGroupId) {
        const bucket = groupBuckets.get(page.headerGroupId) || { groupId: page.headerGroupId, groupLabel: page.headerGroupLabel, items: [] };
        bucket.items.push(page);
        groupBuckets.set(page.headerGroupId, bucket);
      } else {
        standalone.push(page);
      }
    });
    return [...groupBuckets.values(), ...(standalone.length > 0 ? [{ groupId: '', groupLabel: '', items: standalone }] : [])];
  })();

  const setPageVisibility = (pageId: string, patch: Partial<Visibility>) => {
    setDraft((prev) => ({ ...prev, [pageId]: { ...prev[pageId], ...patch } }));
  };

  const handleAddHeader = (pageId: string) => {
    setAddHeaderOpen(false);
    setPageVisibility(pageId, { showInHeader: true });
  };

  const handleAddFooter = (pageId: string) => {
    setAddFooterOpen(false);
    setPageVisibility(pageId, { showInFooter: true });
  };

  return (
    <RequireAuth>
      {() => (
        <div className="max-w-3xl">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                  Navigace
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Vyberte, které stránky se zobrazují v horním menu a v patičce webu.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingAll}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c93838] hover:bg-[#b02f2f] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60 shrink-0"
            >
              {savedAll ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savingAll ? 'Ukládám…' : savedAll ? 'Uloženo' : 'Uložit'}</span>
            </button>
          </div>
          {anyDirty && (
            <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6 -mt-4">
              Máte neuložené změny v navigaci.
            </p>
          )}

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Hlavní stránka */}
              <div>
                <div className="flex items-center space-x-2 mb-3 px-1">
                  <Home className="w-4 h-4 text-neutral-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Hlavní stránka (/)</h2>
                </div>

                <div className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl">
                  <select
                    value={draftHomePageId || protectedPage?.id || ''}
                    onChange={(e) => setDraftHomePageId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>{p.protected ? `${p.label} (výchozí)` : p.label}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-neutral-400 mt-2 px-1">
                  Vyberte, který obsah ze "Správy stránek" se má zobrazit na hlavní stránce webu (/).
                </p>
              </div>

              {/* Hlavička */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2">
                    <PanelTop className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Hlavička</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddHeaderOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Přidat</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {headerGroupedList.map(({ groupId, groupLabel, items }) => (
                    <div key={groupId || 'none'}>
                      {groupLabel && (
                        <p className="text-xs font-bold text-neutral-500 mb-1.5 px-1">{groupLabel}</p>
                      )}
                      <div className="space-y-2">
                        {items.map((page) => {
                          const PageIcon = getIcon(page.headerIcon);
                          return (
                            <div
                              key={page.id}
                              className={`flex items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl gap-3 flex-wrap ${groupLabel ? 'ml-3' : ''}`}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                {PageIcon && (
                                  <span className="w-7 h-7 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                                    <PageIcon className="w-4 h-4" />
                                  </span>
                                )}
                                <span className="font-semibold text-neutral-900 truncate">{page.label}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPageVisibility(page.id, { showInHeader: false })}
                                className="p-2 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer shrink-0"
                                aria-label="Odebrat z hlavičky"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {headerPages.length === 0 && (
                    <p className="text-sm text-neutral-400 px-1">Zatím žádné stránky v hlavičce.</p>
                  )}
                </div>

                <p className="text-xs text-neutral-400 mt-3 px-1">
                  Skupinu i ikonu ke stránce přiřadíte v editoru dané stránky. Skupiny se zakládají ve "Správě stránek". Stránky se stejnou skupinou se v menu sloučí pod jedno rozbalovací menu.
                </p>
              </div>

              {/* Patička */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2">
                    <PanelBottom className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Patička</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddFooterOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-900 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Přidat</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {footerPages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl gap-3 flex-wrap"
                    >
                      <span className="font-semibold text-neutral-900">{page.label}</span>
                      <button
                        type="button"
                        onClick={() => setPageVisibility(page.id, { showInFooter: false })}
                        className="p-2 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer"
                        aria-label="Odebrat z patičky"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {footerPages.length === 0 && (
                    <p className="text-sm text-neutral-400 px-1">Zatím žádné stránky v patičce.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <AddPageModal
            open={addHeaderOpen}
            title="Přidat do hlavičky"
            pages={headerCandidates}
            onClose={() => setAddHeaderOpen(false)}
            onPick={handleAddHeader}
          />

          <AddPageModal
            open={addFooterOpen}
            title="Přidat do patičky"
            pages={footerCandidates}
            onClose={() => setAddFooterOpen(false)}
            onPick={handleAddFooter}
          />
        </div>
      )}
    </RequireAuth>
  );
}
