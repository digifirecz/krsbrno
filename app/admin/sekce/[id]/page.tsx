'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getSection, updateSection, deleteSection } from '@/lib/actions/sections';
import type { Section } from '@/lib/sections';
import { getBlockTypeLabel } from '@/lib/blocks/registry';

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
import SermonsBlockEditor from '@/components/admin/blocks/SermonsBlockEditor';
import ContactFormBlockEditor from '@/components/admin/blocks/ContactFormBlockEditor';

import type {
  BlockData, PageHeroData, HomeHeroData, IconGridData, QuoteData, CtaBlockData, TimelineData,
  InfoCardData, PhotoCardGridData, ScheduleCardData, ChecklistCardData, ListCardData, CardGridData,
  BadgeCardData, TextSectionsData, MapEmbedData, TagGroupsData, SupportOptionsData, SocialCardData, PeopleListData,
  ArticlesBlockData, ContactFormBlockData,
} from '@/lib/blocks/types';
import { ArrowLeft, Trash2, Save, CheckCircle2, CalendarPlus, History, Layers } from 'lucide-react';

const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

function formatTimestamp(value: unknown): string | null {
  let date: Date | null = null;
  if (value instanceof Date) date = value;
  else if (value && typeof value === 'object' && 'toDate' in value) {
    date = (value as { toDate: () => Date }).toDate();
  }
  if (!date) return null;
  return date.toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminSectionEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sectionId = params.id;
  const { showToast } = useToast();

  const [section, setSection] = useState<Section | null>(null);
  const [name, setName] = useState('');
  const [data, setData] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getSection(sectionId)
      .then((fetched) => {
        if (!active || !fetched) return;
        setSection(fetched);
        setName(fetched.name);
        setData(fetched.data);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sectionId]);

  return (
    <RequireAuth>
      {(user) => {
        const handleSave = async () => {
          if (!data) return;
          setSaving(true);
          try {
            await updateSection(sectionId, { name: name.trim(), data }, user.email);
            setSection((prev) => (prev ? { ...prev, name: name.trim(), data, updatedAt: new Date(), updatedBy: user.email } : prev));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            showToast('Sekce byla uložena. Změna se projeví na všech stránkách, kde je použitá.');
          } catch (err) {
            showToast(`Sekci se nepodařilo uložit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setSaving(false);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteSection(sectionId);
            showToast('Sekce byla smazána.');
            router.push('/admin/sekce');
          } catch (err) {
            showToast(`Sekci se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zpět</span>
              </button>

              {!loading && (
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c93838] hover:bg-[#b02f2f] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  >
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Ukládám…' : saved ? 'Uloženo' : 'Uložit'}</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    title="Smazat sekci"
                    aria-label="Smazat sekci"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 bg-white hover:border-[#c93838] hover:bg-red-50 text-neutral-500 hover:text-[#c93838] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {loading || !section || !data ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="mb-8 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div>
                    <label className={labelClass}>Název sekce (jen pro administraci)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-lg sm:text-xl font-extrabold text-neutral-900 font-serif px-3.5 py-2 rounded-xl border border-neutral-200 bg-white focus:border-[#c93838]/50 focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 transition-colors"
                    />
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-700">Typ bloku</span> {getBlockTypeLabel(section.type)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
                        <CalendarPlus className="w-3.5 h-3.5" />
                      </div>
                      {formatTimestamp(section.createdAt) ? (
                        <p className="text-xs text-neutral-500">
                          <span className="font-semibold text-neutral-700">Vytvořeno</span> {formatTimestamp(section.createdAt)}
                          {section.createdBy && <span className="text-neutral-400"> · {section.createdBy}</span>}
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-400 italic">Datum vytvoření není k dispozici</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                        <History className="w-3.5 h-3.5" />
                      </div>
                      {formatTimestamp(section.updatedAt) ? (
                        <p className="text-xs text-neutral-500">
                          <span className="font-semibold text-neutral-700">Naposledy upraveno</span> {formatTimestamp(section.updatedAt)}
                          {section.updatedBy && <span className="text-neutral-400"> · {section.updatedBy}</span>}
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-400 italic">Zatím nikdy neupraveno</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
                  {section.type === 'pageHero' && (
                    <PageHeroEditor data={data as PageHeroData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'homeHero' && (
                    <HomeHeroEditor data={data as HomeHeroData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'iconGrid' && (
                    <IconGridEditor data={data as IconGridData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'quote' && (
                    <QuoteEditor data={data as QuoteData} onChange={setData} />
                  )}
                  {section.type === 'ctaBlock' && (
                    <CtaBlockEditor data={data as CtaBlockData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'timeline' && (
                    <TimelineEditor data={data as TimelineData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'infoCard' && (
                    <InfoCardEditor data={data as InfoCardData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'photoCardGrid' && (
                    <PhotoCardGridEditor data={data as PhotoCardGridData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'scheduleCard' && (
                    <ScheduleCardEditor data={data as ScheduleCardData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'checklistCard' && (
                    <ChecklistCardEditor data={data as ChecklistCardData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'listCard' && (
                    <ListCardEditor data={data as ListCardData} onChange={setData} />
                  )}
                  {section.type === 'cardGrid' && (
                    <CardGridEditor data={data as CardGridData} onChange={setData} />
                  )}
                  {section.type === 'badgeCard' && (
                    <BadgeCardEditor data={data as BadgeCardData} onChange={setData} />
                  )}
                  {section.type === 'textSections' && (
                    <TextSectionsEditor data={data as TextSectionsData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'mapEmbed' && (
                    <MapEmbedEditor data={data as MapEmbedData} onChange={setData} />
                  )}
                  {section.type === 'tagGroups' && (
                    <TagGroupsEditor data={data as TagGroupsData} onChange={setData} />
                  )}
                  {section.type === 'supportOptions' && (
                    <SupportOptionsEditor data={data as SupportOptionsData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'socialCard' && (
                    <SocialCardEditor data={data as SocialCardData} onChange={setData} pageId={sectionId} />
                  )}
                  {section.type === 'peopleList' && (
                    <PeopleListEditor data={data as PeopleListData} onChange={setData} />
                  )}
                  {section.type === 'articlesBlock' && (
                    <ArticlesBlockEditor data={data as ArticlesBlockData} onChange={setData} />
                  )}
                  {section.type === 'sermonsBlock' && <SermonsBlockEditor />}
                  {section.type === 'contactFormBlock' && (
                    <ContactFormBlockEditor data={data as ContactFormBlockData} onChange={setData} />
                  )}
                </div>
              </>
            )}

            <ConfirmModal
              open={deleteConfirmOpen}
              title="Smazat sekci"
              message={`Opravdu chcete sekci „${name || 'bez názvu'}“ trvale smazat? Zmizí i ze všech stránek, kde je použitá.`}
              onCancel={() => setDeleteConfirmOpen(false)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
