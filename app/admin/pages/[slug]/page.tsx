'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/admin/RequireAuth';
import IconPicker from '@/components/admin/blocks/IconPicker';
import PageHeroEditor from '@/components/admin/blocks/PageHeroEditor';
import HomeHeroEditor from '@/components/admin/blocks/HomeHeroEditor';
import IconGridEditor from '@/components/admin/blocks/IconGridEditor';
import QuoteEditor from '@/components/admin/blocks/QuoteEditor';
import CtaBlockEditor from '@/components/admin/blocks/CtaBlockEditor';
import TimelineEditor from '@/components/admin/blocks/TimelineEditor';
import InfoCardEditor from '@/components/admin/blocks/InfoCardEditor';
import PhotoCardGridEditor from '@/components/admin/blocks/PhotoCardGridEditor';
import ScheduleCardEditor from '@/components/admin/blocks/ScheduleCardEditor';
import ChecklistCardEditor from '@/components/admin/blocks/ChecklistCardEditor';
import ListCardEditor from '@/components/admin/blocks/ListCardEditor';
import CardGridEditor from '@/components/admin/blocks/CardGridEditor';
import BadgeCardEditor from '@/components/admin/blocks/BadgeCardEditor';
import TextSectionsEditor from '@/components/admin/blocks/TextSectionsEditor';
import MapEmbedEditor from '@/components/admin/blocks/MapEmbedEditor';
import TagGroupsEditor from '@/components/admin/blocks/TagGroupsEditor';
import SupportOptionsEditor from '@/components/admin/blocks/SupportOptionsEditor';
import SocialCardEditor from '@/components/admin/blocks/SocialCardEditor';
import PeopleListEditor from '@/components/admin/blocks/PeopleListEditor';
import ArticlesBlockEditor from '@/components/admin/blocks/ArticlesBlockEditor';
import AddPageModal from '@/components/admin/AddPageModal';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getPageDoc, savePageBlocks, deletePage, getNavGroups } from '@/lib/actions/pages';
import { slugify } from '@/lib/pages';
import type { NavGroup } from '@/lib/pages';
import { getSections } from '@/lib/actions/sections';
import type { Section } from '@/lib/sections';
import type { Role } from '@/lib/roles';
import { MANAGEABLE_PAGES } from '@/lib/blocks/pageRegistry';
import { getBlockTypeLabel } from '@/lib/blocks/registry';
import type { BlockInstance, PageHeroData, HomeHeroData, IconGridData, QuoteData, CtaBlockData, TimelineData, InfoCardData, PhotoCardGridData, ScheduleCardData, ChecklistCardData, ListCardData, CardGridData, BadgeCardData, TextSectionsData, MapEmbedData, TagGroupsData, SupportOptionsData, SocialCardData, PeopleListData, ArticlesBlockData } from '@/lib/blocks/types';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Lock, Save, CheckCircle2, AlertCircle, CalendarPlus, History, Layers } from 'lucide-react';

function reorder(blocks: BlockInstance[]): BlockInstance[] {
  return blocks.map((b, idx) => ({ ...b, order: idx }));
}

function formatTimestamp(value: unknown): string | null {
  let date: Date | null = null;
  if (value instanceof Date) date = value;
  else if (value && typeof value === 'object' && 'toDate' in value) {
    date = (value as { toDate: () => Date }).toDate();
  }
  if (!date) return null;
  return date.toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminPageBlocksEditor() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const pageId = params.slug;
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState<{ createdAt?: unknown; createdBy?: string | null; updatedAt?: unknown; updatedBy?: string | null; slug?: string | null }>({});
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [sectionPickerOpen, setSectionPickerOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletePageConfirmOpen, setDeletePageConfirmOpen] = useState(false);
  const [headerGroupId, setHeaderGroupId] = useState('');
  const [headerIcon, setHeaderIcon] = useState<string | undefined>(undefined);
  const [savedHeaderGroupId, setSavedHeaderGroupId] = useState('');
  const [savedHeaderIcon, setSavedHeaderIcon] = useState<string | undefined>(undefined);
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    getNavGroups().then(setNavGroups).catch(() => {});
  }, []);

  useEffect(() => {
    getSections().then(setSections).catch(() => {});
  }, []);

  const sectionsById = new Map(sections.map((s) => [s.id, s]));

  useEffect(() => {
    let active = true;
    getPageDoc(pageId)
      .then((fetched) => {
        if (!active) return;
        setBlocks((fetched?.blocks || []).slice().sort((a, b) => a.order - b.order));
        setTitle(fetched?.title || MANAGEABLE_PAGES.find((p) => p.id === pageId)?.label || pageId);
        setHeaderGroupId(fetched?.headerGroupId || '');
        setHeaderIcon(fetched?.headerIcon || undefined);
        setSavedHeaderGroupId(fetched?.headerGroupId || '');
        setSavedHeaderIcon(fetched?.headerIcon || undefined);
        setIsProtected(!!fetched?.protected);
        setMeta({
          createdAt: fetched?.createdAt,
          createdBy: fetched?.createdBy,
          updatedAt: fetched?.updatedAt,
          updatedBy: fetched?.updatedBy,
          slug: fetched?.slug || pageId,
        });
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setBlocks([]);
          setTitle(MANAGEABLE_PAGES.find((p) => p.id === pageId)?.label || pageId);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [pageId]);

  const updateBlockData = (id: string, data: BlockInstance['data']) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const updateBlockLimit = (id: string, itemLimit: number | undefined) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, itemLimit } : b)));
  };

  const toggleVisible = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const swapWith = direction === 'up' ? idx - 1 : idx + 1;
      if (idx === -1 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return reorder(next);
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => reorder(prev.filter((b) => b.id !== id)));
  };

  const addSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    setSectionPickerOpen(false);
    if (!section) return;
    setBlocks((prev) =>
      reorder([
        ...prev,
        { id: crypto.randomUUID(), type: section.type, sectionId: section.id, visible: true, order: prev.length, data: section.data },
      ])
    );
  };

  const handleSave = async (updatedBy?: string | null) => {
    const newErrors: string[] = [];
    blocks.forEach((block, idx) => {
      if (block.sectionId) return;
      if (block.type === 'pageHero') {
        const data = block.data as PageHeroData;
        if (!data.title.trim()) newErrors.push(`Blok ${idx + 1} (úvod): titulek je povinný.`);
      }
      if (block.type === 'homeHero') {
        const data = block.data as HomeHeroData;
        if (!data.title.trim()) newErrors.push(`Blok ${idx + 1} (velký hero): nadpis je povinný.`);
      }
      if (block.type === 'iconGrid') {
        const data = block.data as IconGridData;
        data.cards.forEach((card, cardIdx) => {
          if (!card.title.trim()) newErrors.push(`Blok ${idx + 1}, karta ${cardIdx + 1}: titulek karty je povinný.`);
        });
      }
      if (block.type === 'quote') {
        const data = block.data as QuoteData;
        if (!data.quote.trim()) newErrors.push(`Blok ${idx + 1} (citace): text citace je povinný.`);
      }
      if (block.type === 'ctaBlock') {
        const data = block.data as CtaBlockData;
        if (!data.title.trim()) newErrors.push(`Blok ${idx + 1} (výzva k akci): titulek je povinný.`);
      }
      if (block.type === 'timeline') {
        const data = block.data as TimelineData;
        data.items.forEach((item, itemIdx) => {
          if (!item.year.trim() || !item.title.trim()) {
            newErrors.push(`Blok ${idx + 1}, položka ${itemIdx + 1}: rok i titulek jsou povinné.`);
          }
        });
      }
      if (block.type === 'infoCard') {
        const data = block.data as InfoCardData;
        if (!data.title.trim()) newErrors.push(`Blok ${idx + 1} (informační karta): titulek je povinný.`);
      }
      if (block.type === 'photoCardGrid') {
        const data = block.data as PhotoCardGridData;
        data.cards.forEach((card, cardIdx) => {
          if (!card.title.trim()) newErrors.push(`Blok ${idx + 1}, karta ${cardIdx + 1}: titulek karty je povinný.`);
        });
      }
      if (block.type === 'scheduleCard') {
        const data = block.data as ScheduleCardData;
        data.schedule.forEach((item, itemIdx) => {
          if (!item.label.trim() || !item.time.trim()) {
            newErrors.push(`Blok ${idx + 1}, čas ${itemIdx + 1}: den i čas jsou povinné.`);
          }
        });
      }
      if (block.type === 'checklistCard') {
        const data = block.data as ChecklistCardData;
        data.items.forEach((item, itemIdx) => {
          if (!item.title.trim()) newErrors.push(`Blok ${idx + 1}, bod ${itemIdx + 1}: titulek je povinný.`);
        });
      }
      if (block.type === 'listCard') {
        const data = block.data as ListCardData;
        data.items.forEach((item, itemIdx) => {
          if (!item.title.trim()) newErrors.push(`Blok ${idx + 1}, bod ${itemIdx + 1}: titulek je povinný.`);
        });
      }
      if (block.type === 'cardGrid') {
        const data = block.data as CardGridData;
        data.cards.forEach((card, cardIdx) => {
          if (card.kind === 'icon' && !card.title.trim()) {
            newErrors.push(`Blok ${idx + 1}, karta ${cardIdx + 1}: titulek je povinný.`);
          }
          if (card.kind === 'list') {
            card.items.forEach((item, itemIdx) => {
              if (!item.title.trim()) newErrors.push(`Blok ${idx + 1}, karta ${cardIdx + 1}, bod ${itemIdx + 1}: titulek je povinný.`);
            });
          }
        });
      }
      if (block.type === 'textSections') {
        const data = block.data as TextSectionsData;
        data.sections.forEach((section, sectionIdx) => {
          if (!section.heading.trim()) newErrors.push(`Blok ${idx + 1}, sekce ${sectionIdx + 1}: nadpis je povinný.`);
        });
      }
      if (block.type === 'mapEmbed') {
        const data = block.data as MapEmbedData;
        if (!data.embedUrl.trim()) newErrors.push(`Blok ${idx + 1} (mapa): embed URL je povinné.`);
      }
      if (block.type === 'tagGroups') {
        const data = block.data as TagGroupsData;
        data.groups.forEach((group, groupIdx) => {
          if (!group.heading.trim()) newErrors.push(`Blok ${idx + 1}, skupina ${groupIdx + 1}: nadpis je povinný.`);
        });
      }
      if (block.type === 'supportOptions') {
        const data = block.data as SupportOptionsData;
        if (!data.financial.title.trim()) newErrors.push(`Blok ${idx + 1}: titulek karty Finanční podpora je povinný.`);
        if (!data.financial.accountNumber.trim()) newErrors.push(`Blok ${idx + 1}: číslo účtu je povinné.`);
        if (!data.financial.iban.trim()) newErrors.push(`Blok ${idx + 1}: IBAN je povinný.`);
        if (!data.involvement.title.trim()) newErrors.push(`Blok ${idx + 1}: titulek karty Podpora zapojením je povinný.`);
      }
      if (block.type === 'socialCard') {
        const data = block.data as SocialCardData;
        if (data.embed && !data.embed.embedUrl.trim()) {
          newErrors.push(`Blok ${idx + 1}: embed URL je povinné.`);
        }
        data.links.forEach((link, linkIdx) => {
          if (!link.label.trim() || !link.url.trim()) {
            newErrors.push(`Blok ${idx + 1}, odkaz ${linkIdx + 1}: text i URL jsou povinné.`);
          }
        });
      }
      if (block.type === 'peopleList') {
        const data = block.data as PeopleListData;
        data.people.forEach((person, personIdx) => {
          if (!person.trim()) newErrors.push(`Blok ${idx + 1}, osoba ${personIdx + 1}: jméno je povinné.`);
        });
      }
    });

    if (!title.trim()) {
      newErrors.push('Název stránky je povinný.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setSaved(false);
      return;
    }

    setErrors([]);
    setSaving(true);
    try {
      const newSlug = await savePageBlocks(pageId, blocks, title.trim(), updatedBy, {
        headerGroupId,
        headerIcon: headerIcon || '',
      });
      setMeta((prev) => ({ ...prev, updatedAt: new Date(), updatedBy: updatedBy || null, slug: newSlug }));
      setSavedHeaderGroupId(headerGroupId);
      setSavedHeaderIcon(headerIcon);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      showToast('Stránka byla uložena.');
    } catch (err) {
      showToast(`Stránku se nepodařilo uložit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (role: Role) => {
    if (role !== 'admin' || isProtected) return;
    try {
      await deletePage(pageId);
      setDeletePageConfirmOpen(false);
      showToast('Stránka byla smazána.');
      router.push('/admin/pages');
    } catch (err) {
      setDeletePageConfirmOpen(false);
      showToast(`Stránku se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    }
  };

  const handleGroupChange = (value: string) => {
    setHeaderGroupId(value);
  };

  const handleIconChange = (value: string | undefined) => {
    setHeaderIcon(value);
  };

  const navDirty = headerGroupId !== savedHeaderGroupId || (headerIcon || '') !== (savedHeaderIcon || '');

  return (
    <RequireAuth>
      {(user) => (
        <div className="max-w-4xl">
          <Link
            href="/admin/pages"
            className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět na seznam stránek</span>
          </Link>

          <div className="mb-8 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs font-bold text-neutral-500 mb-1">Název stránky</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full max-w-md text-lg sm:text-xl font-extrabold text-neutral-900 font-serif px-3.5 py-2 rounded-xl border border-neutral-200 bg-white focus:border-[#c93838]/50 focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 transition-colors"
                />
                {(() => {
                  const pendingSlug = slugify(title);
                  const changed = pendingSlug && meta.slug && pendingSlug !== meta.slug;
                  return (
                    <p className="text-xs text-neutral-500 mt-1.5 px-0.5">
                      {changed ? (
                        <>Po uložení se adresa změní na <span className="font-mono font-semibold text-amber-700">/{pendingSlug}</span></>
                      ) : (
                        <>Veřejná adresa: <span className="font-mono font-semibold text-neutral-700">/{meta.slug || pageId}</span></>
                      )}
                    </p>
                  );
                })()}

                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-neutral-500 shrink-0">Kategorie</label>
                    <select
                      value={headerGroupId}
                      onChange={(e) => handleGroupChange(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                    >
                      <option value="">Bez kategorie</option>
                      {navGroups.map((g) => (
                        <option key={g.id} value={g.id}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-neutral-500 shrink-0">Ikona v hlavičce</label>
                    <div className="w-40">
                      <IconPicker value={headerIcon} onChange={handleIconChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleSave(user.email)}
                  disabled={saving}
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c93838] hover:bg-[#b02f2f] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:hover:shadow-sm disabled:active:scale-100"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Ukládám…' : saved ? 'Uloženo' : 'Uložit změny'}</span>
                </button>
                {isProtected ? (
                  <span
                    title="Tuto stránku nelze smazat"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-300"
                  >
                    <Lock className="w-4 h-4" />
                  </span>
                ) : (
                  user.role === 'admin' && (
                    <button
                      onClick={() => setDeletePageConfirmOpen(true)}
                      title="Smazat stránku"
                      aria-label="Smazat stránku"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 bg-white hover:border-[#c93838] hover:bg-red-50 text-neutral-500 hover:text-[#c93838] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
                  <CalendarPlus className="w-3.5 h-3.5" />
                </div>
                {formatTimestamp(meta.createdAt) ? (
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-700">Vytvořeno</span> {formatTimestamp(meta.createdAt)}
                    {meta.createdBy && <span className="text-neutral-400"> · {meta.createdBy}</span>}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 italic">Datum vytvoření není k dispozici</p>
                )}
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                  <History className="w-3.5 h-3.5" />
                </div>
                {formatTimestamp(meta.updatedAt) ? (
                  <p className="text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-700">Naposledy upraveno</span> {formatTimestamp(meta.updatedAt)}
                    {meta.updatedBy && <span className="text-neutral-400"> · {meta.updatedBy}</span>}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 italic">Zatím nikdy neupraveno</p>
                )}
              </div>
            </div>
          </div>

          {navDirty && (
            <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
              Máte neuloženou změnu kategorie nebo ikony. Projeví se až po kliknutí na „Uložit změny“.
            </p>
          )}

          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
              {errors.map((err, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-sm text-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-2xs border-neutral-200 ${block.visible ? '' : 'opacity-50'}`}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {getBlockTypeLabel(block.type)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                        aria-label="Posunout nahoru"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 cursor-pointer"
                        aria-label="Posunout dolů"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleVisible(block.id)}
                        className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-50 cursor-pointer"
                        aria-label={block.visible ? 'Skrýt blok' : 'Zobrazit blok'}
                      >
                        {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(block.id)}
                        className="p-2 rounded-lg text-neutral-500 hover:bg-red-50 hover:text-[#c93838] cursor-pointer"
                        aria-label="Odstranit blok"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {block.sectionId && (
                    <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex-wrap">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {sectionsById.get(block.sectionId)?.name || 'Sekce'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {sectionsById.get(block.sectionId)
                              ? getBlockTypeLabel(sectionsById.get(block.sectionId)!.type)
                              : 'Sdílená sekce'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {sectionsById.get(block.sectionId)?.type === 'photoCardGrid' && (
                          <label className="inline-flex items-center space-x-1.5 text-xs text-neutral-600">
                            <span>Zobrazit</span>
                            <input
                              type="number"
                              min={1}
                              value={block.itemLimit ?? ''}
                              onChange={(e) => updateBlockLimit(block.id, e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="vše"
                              className="w-16 px-2 py-1 rounded-lg border border-neutral-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                            />
                            <span>z položek</span>
                          </label>
                        )}
                        <Link
                          href={`/admin/sekce/${block.sectionId}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-[#c93838] hover:underline"
                        >
                          <span>Upravit sekci</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {!block.sectionId && (
                  <>
                  {block.type === 'pageHero' && (
                    <PageHeroEditor
                      data={block.data as PageHeroData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'homeHero' && (
                    <HomeHeroEditor
                      data={block.data as HomeHeroData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'iconGrid' && (
                    <IconGridEditor
                      data={block.data as IconGridData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'quote' && (
                    <QuoteEditor
                      data={block.data as QuoteData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'ctaBlock' && (
                    <CtaBlockEditor
                      data={block.data as CtaBlockData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'timeline' && (
                    <TimelineEditor
                      data={block.data as TimelineData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'infoCard' && (
                    <InfoCardEditor
                      data={block.data as InfoCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'photoCardGrid' && (
                    <PhotoCardGridEditor
                      data={block.data as PhotoCardGridData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'scheduleCard' && (
                    <ScheduleCardEditor
                      data={block.data as ScheduleCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'checklistCard' && (
                    <ChecklistCardEditor
                      data={block.data as ChecklistCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'listCard' && (
                    <ListCardEditor
                      data={block.data as ListCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'cardGrid' && (
                    <CardGridEditor
                      data={block.data as CardGridData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'badgeCard' && (
                    <BadgeCardEditor
                      data={block.data as BadgeCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'textSections' && (
                    <TextSectionsEditor
                      data={block.data as TextSectionsData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'mapEmbed' && (
                    <MapEmbedEditor
                      data={block.data as MapEmbedData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'tagGroups' && (
                    <TagGroupsEditor
                      data={block.data as TagGroupsData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'supportOptions' && (
                    <SupportOptionsEditor
                      data={block.data as SupportOptionsData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'socialCard' && (
                    <SocialCardEditor
                      data={block.data as SocialCardData}
                      onChange={(data) => updateBlockData(block.id, data)}
                      pageId={pageId}
                    />
                  )}
                  {block.type === 'peopleList' && (
                    <PeopleListEditor
                      data={block.data as PeopleListData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  {block.type === 'articlesBlock' && (
                    <ArticlesBlockEditor
                      data={block.data as ArticlesBlockData}
                      onChange={(data) => updateBlockData(block.id, data)}
                    />
                  )}
                  </>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setSectionPickerOpen(true)}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:border-[#c93838] hover:text-[#c93838] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Přidat sekci</span>
                </button>
              </div>
            </div>
          )}

          <AddPageModal
            open={sectionPickerOpen}
            title="Přidat sekci"
            pages={sections.map((s) => ({ id: s.id, label: `${s.name || 'Bez názvu'} — ${getBlockTypeLabel(s.type)}` }))}
            onClose={() => setSectionPickerOpen(false)}
            onPick={addSection}
          />

          <ConfirmModal
            open={pendingDeleteId !== null}
            title="Odstranit blok"
            message="Opravdu chcete tento blok odstranit? Tuto akci nelze vzít zpět."
            onCancel={() => setPendingDeleteId(null)}
            onConfirm={() => {
              if (pendingDeleteId) removeBlock(pendingDeleteId);
              setPendingDeleteId(null);
            }}
          />

          <ConfirmModal
            open={deletePageConfirmOpen}
            title="Smazat stránku"
            message={`Opravdu chcete stránku „${title}“ trvale smazat i s celým jejím obsahem? Zmizí i z navigace webu. Tuto akci nelze vzít zpět.`}
            onCancel={() => setDeletePageConfirmOpen(false)}
            onConfirm={() => handleDeletePage(user.role as Role)}
          />
        </div>
      )}
    </RequireAuth>
  );
}
