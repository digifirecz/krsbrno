'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import RichTextEditor from '@/components/admin/blocks/RichTextEditor';
import { useToast } from '@/components/admin/ToastProvider';
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/lib/actions/socialLinks';
import type { SocialLink } from '@/lib/socialLinks';
import { getSiteSettings, setSiteSettings } from '@/lib/actions/siteSettings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';
import { Settings, Share2, Plus, Save, CheckCircle2, X, Link2, Image as ImageIcon, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface Draft {
  icon: string;
  url: string;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [siteDraft, setSiteDraft] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [newIcon, setNewIcon] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [savedAll, setSavedAll] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<SocialLink | null>(null);

  useEffect(() => {
    Promise.all([getSocialLinks(), getSiteSettings()])
      .then(([fetchedLinks, fetchedSettings]) => {
        setLinks(fetchedLinks);
        setDrafts(Object.fromEntries(fetchedLinks.map((l) => [l.id, { icon: l.icon, url: l.url }])));
        setSiteSettingsState(fetchedSettings);
        setSiteDraft(fetchedSettings);
      })
      .catch(() => setLinks([]))
      .finally(() => setLoading(false));
  }, []);

  const updateDraft = (id: string, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const isDirty = (link: SocialLink) => {
    const draft = drafts[link.id];
    return !!draft && (draft.icon !== link.icon || draft.url !== link.url);
  };

  const siteDirty =
    siteDraft.logo !== siteSettings.logo ||
    siteDraft.logoAlt !== siteSettings.logoAlt ||
    siteDraft.address !== siteSettings.address ||
    siteDraft.email !== siteSettings.email ||
    siteDraft.gdprText !== siteSettings.gdprText;

  const anyDirty = siteDirty || links.some(isDirty);

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      const dirtyLinks = links.filter(isDirty);
      const writes: Promise<unknown>[] = dirtyLinks.map((link) =>
        updateSocialLink(link.id, { icon: drafts[link.id].icon, url: drafts[link.id].url })
      );
      if (siteDirty) {
        writes.push(setSiteSettings(siteDraft));
      }
      await Promise.all(writes);

      setLinks((prev) => prev.map((l) => (drafts[l.id] ? { ...l, ...drafts[l.id] } : l)));
      setSiteSettingsState(siteDraft);
      setSavedAll(true);
      setTimeout(() => setSavedAll(false), 3000);
      showToast(dirtyLinks.length > 0 || siteDirty ? 'Nastavení bylo uloženo.' : 'Žádné změny k uložení.');
    } catch (err) {
      showToast(`Nastavení se nepodařilo uložit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    } finally {
      setSavingAll(false);
    }
  };

  const handleAdd = async () => {
    if (!newIcon || !newUrl.trim()) return;
    setAdding(true);
    try {
      const id = await createSocialLink(newIcon, newUrl.trim(), links.length);
      const created: SocialLink = { id, icon: newIcon, url: newUrl.trim(), order: links.length };
      setLinks((prev) => [...prev, created]);
      setDrafts((prev) => ({ ...prev, [id]: { icon: created.icon, url: created.url } }));
      setNewIcon('');
      setNewUrl('');
      showToast('Sociální síť byla přidána.');
    } catch (err) {
      showToast(`Sociální síť se nepodařilo přidat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    const target = removeTarget;
    setRemoveTarget(null);
    try {
      await deleteSocialLink(target.id);
      setLinks((prev) => prev.filter((l) => l.id !== target.id));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[target.id];
        return next;
      });
      showToast('Sociální síť byla odebrána.');
    } catch (err) {
      showToast(`Sociální síť se nepodařilo odebrat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    }
  };

  return (
    <RequireAuth>
      {() => (
        <div className="max-w-2xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                    Nastavení stránky
                  </h1>
                  <p className="text-sm text-neutral-600 mt-0.5">
                    Obecná nastavení webu.
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
                Máte neuložené změny.
              </p>
            )}

            <div className="flex items-center space-x-2 mb-3 px-1">
              <ImageIcon className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Logo</h2>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl space-y-4 mb-10">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">Obrázek loga</label>
                  <PhotoUpload
                    value={siteDraft.logo}
                    onChange={(url) => setSiteDraft((prev) => ({ ...prev, logo: url || DEFAULT_SITE_SETTINGS.logo }))}
                    pageId="global"
                    folder="branding"
                    fit="contain"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">Alt text</label>
                  <input
                    type="text"
                    value={siteDraft.logoAlt}
                    onChange={(e) => setSiteDraft((prev) => ({ ...prev, logoAlt: e.target.value }))}
                    placeholder="Křesťanský sbor Brno"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5 px-0.5">
                    Popisek loga pro čtečky obrazovky a vyhledávače.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-3 px-1">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Kontakt v patičce</h2>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl space-y-4 mb-10">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">Adresa</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={siteDraft.address}
                      onChange={(e) => setSiteDraft((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Šámalova 15a, Brno"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={siteDraft.email}
                      onChange={(e) => setSiteDraft((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="info@krsbrno.cz"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-3 px-1">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">GDPR</h2>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl space-y-2 mb-10">
                <label className="block text-xs font-bold text-neutral-500">Text zobrazený v patičce a v cookie liště</label>
                <RichTextEditor
                  value={siteDraft.gdprText}
                  onChange={(value) => setSiteDraft((prev) => ({ ...prev, gdprText: value }))}
                  placeholder="Text ochrany osobních údajů…"
                />
              </div>
            )}

            <div className="flex items-center space-x-2 mb-3 px-1">
              <Share2 className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sociální sítě v patičce</h2>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link) => {
                  const draft = drafts[link.id] || { icon: link.icon, url: link.url };
                  const dirty = isDirty(link);
                  return (
                    <div
                      key={link.id}
                      className={`p-4 sm:p-5 bg-white border rounded-2xl space-y-3 transition-colors ${dirty ? 'border-amber-300' : 'border-neutral-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-24 shrink-0">
                          <PhotoUpload
                            value={draft.icon}
                            onChange={(url) => updateDraft(link.id, { icon: url })}
                            pageId="global"
                            folder="social"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="relative">
                            <Link2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="url"
                              value={draft.url}
                              onChange={(e) => updateDraft(link.id, { url: e.target.value })}
                              placeholder="https://instagram.com/..."
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setRemoveTarget(link)}
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-400 hover:text-[#c93838] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Odebrat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {links.length === 0 && (
                  <p className="text-sm text-neutral-400 px-1">Zatím žádné sociální sítě. Přidejte první níže.</p>
                )}
              </div>
            )}

            <div className="mt-4 px-4 py-3.5 rounded-2xl bg-neutral-950 flex items-center space-x-2.5 overflow-x-auto">
              {links.map((link) => {
                const draft = drafts[link.id] || { icon: link.icon, url: link.url };
                return (
                  <div
                    key={link.id}
                    className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0"
                  >
                    {draft.icon ? (
                      <Image src={draft.icon} alt="" width={20} height={20} className="object-contain" unoptimized />
                    ) : (
                      <Share2 className="w-4 h-4 text-neutral-600" />
                    )}
                  </div>
                );
              })}
              {newIcon && (
                <div className="w-11 h-11 rounded-xl bg-neutral-900 border-2 border-[#c93838] flex items-center justify-center overflow-hidden shrink-0 animate-in fade-in zoom-in-95 duration-200">
                  <Image src={newIcon} alt="" width={20} height={20} className="object-contain" unoptimized />
                </div>
              )}
              {links.length === 0 && !newIcon && (
                <p className="text-xs text-neutral-500">Náhled patičky se zobrazí po nahrání ikonky</p>
              )}
            </div>

            <div className="mt-3 p-4 sm:p-5 bg-white border border-dashed border-neutral-300 rounded-2xl space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">Ikonka</label>
                <PhotoUpload value={newIcon} onChange={setNewIcon} pageId="global" folder="social" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">Odkaz</label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={!newIcon || !newUrl.trim() || adding}
                onClick={handleAdd}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{adding ? 'Přidávám…' : 'Přidat sociální síť'}</span>
              </button>
            </div>

            <ConfirmModal
              open={removeTarget !== null}
              title="Odebrat sociální síť"
              message="Opravdu chcete tuto sociální síť odebrat z patičky webu?"
              onCancel={() => setRemoveTarget(null)}
              onConfirm={handleRemove}
            />
        </div>
      )}
    </RequireAuth>
  );
}
