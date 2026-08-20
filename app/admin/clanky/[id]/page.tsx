'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import PhotoUpload from '@/components/admin/blocks/PhotoUpload';
import RichTextEditor from '@/components/admin/blocks/RichTextEditor';
import { useToast } from '@/components/admin/ToastProvider';
import { getArticle, updateArticle, deleteArticle, type Article } from '@/lib/articles';
import { ArrowLeft, Trash2, Save, CheckCircle2, Eye, EyeOff, CalendarPlus, History } from 'lucide-react';

const fieldClass = 'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
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

export default function AdminArticleEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const articleId = params.id;
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dateText, setDateText] = useState('');
  const [image, setImage] = useState('');
  const [visible, setVisible] = useState(true);
  const [meta, setMeta] = useState<Pick<Article, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getArticle(articleId)
      .then((fetched) => {
        if (!active || !fetched) return;
        setTitle(fetched.title);
        setSubtitle(fetched.subtitle || '');
        setDateText(fetched.dateText);
        setImage(fetched.image || '');
        setVisible(fetched.visible);
        setMeta({
          createdAt: fetched.createdAt,
          createdBy: fetched.createdBy,
          updatedAt: fetched.updatedAt,
          updatedBy: fetched.updatedBy,
        });
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [articleId]);

  return (
    <RequireAuth>
      {(user) => {
        const handleSave = async () => {
          setSaving(true);
          try {
            await updateArticle(
              articleId,
              { title: title.trim(), subtitle: subtitle.trim() || undefined, dateText: dateText.trim(), image: image || undefined, visible },
              user.email
            );
            setMeta((prev) => ({ ...prev, updatedAt: new Date(), updatedBy: user.email }));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            showToast(visible ? 'Článek byl uložen.' : 'Článek byl uložen a je skrytý na webu.');
          } catch (err) {
            showToast(`Článek se nepodařilo uložit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setSaving(false);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteArticle(articleId);
            showToast('Článek byl smazán.');
            router.push('/admin/clanky');
          } catch (err) {
            showToast(`Článek se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <Link
                href="/admin/clanky"
                className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zpět na seznam článků</span>
              </Link>

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
                    onClick={() => setVisible((v) => !v)}
                    title={visible ? 'Zobrazeno na webu' : 'Skryto na webu'}
                    aria-label={visible ? 'Skrýt článek' : 'Zobrazit článek'}
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-all cursor-pointer ${
                      visible
                        ? 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-500'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(true)}
                    title="Smazat článek"
                    aria-label="Smazat článek"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 bg-white hover:border-[#c93838] hover:bg-red-50 text-neutral-500 hover:text-[#c93838] transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="mb-8 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div>
                    <label className={labelClass}>Titulek</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Název akce"
                      className="w-full text-lg sm:text-xl font-extrabold text-neutral-900 font-serif px-3.5 py-2 rounded-xl border border-neutral-200 bg-white focus:border-[#c93838]/50 focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 transition-colors"
                    />
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

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div>
                    <label className={labelClass}>Fotka</label>
                    <PhotoUpload value={image} pageId={articleId} folder="articles" onChange={setImage} />
                  </div>

                  <div>
                    <label className={labelClass}>Datum</label>
                    <input
                      type="text"
                      value={dateText}
                      onChange={(e) => setDateText(e.target.value)}
                      placeholder="7. 2. 2026"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Popisek</label>
                    <RichTextEditor value={subtitle} onChange={setSubtitle} placeholder="Krátký popis akce" />
                  </div>
                </div>
              </>
            )}

            <ConfirmModal
              open={deleteConfirmOpen}
              title="Smazat článek"
              message={`Opravdu chcete článek „${title || 'bez titulku'}“ trvale smazat?`}
              onCancel={() => setDeleteConfirmOpen(false)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
