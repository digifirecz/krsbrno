'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import {
  getSermonCategories,
  createSermonCategory,
  updateSermonCategory,
  deleteSermonCategory,
} from '@/lib/actions/sermons';
import type { SermonCategory } from '@/lib/sermons';
import { ArrowLeft, Trash2, Save, CheckCircle2, CalendarPlus, History } from 'lucide-react';

const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

function formatTimestamp(value: Date | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminSermonCategoryEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const categoryId = params.id;
  const isNew = categoryId === 'novy';
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [meta, setMeta] = useState<Pick<SermonCategory, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    let active = true;
    getSermonCategories()
      .then((cats) => {
        if (!active) return;
        const fetched = cats.find((c) => c.id === categoryId);
        if (fetched) {
          setName(fetched.name);
          setMeta({
            createdAt: fetched.createdAt,
            createdBy: fetched.createdBy,
            updatedAt: fetched.updatedAt,
            updatedBy: fetched.updatedBy,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoryId, isNew]);

  return (
    <RequireAuth>
      {(user) => {
        const handleSave = async () => {
          if (!name.trim()) {
            setNameError(true);
            showToast('Název je povinný.', 'error');
            return;
          }
          setNameError(false);
          setSaving(true);
          try {
            if (isNew) {
              const created = await createSermonCategory(name.trim(), user.email);
              showToast('Kategorie byla vytvořena.');
              router.replace(`/admin/kategorie-zaznamu/${created.id}`);
              return;
            }
            await updateSermonCategory(categoryId, { name: name.trim() }, user.email);
            setMeta((prev) => ({ ...prev, updatedAt: new Date(), updatedBy: user.email }));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            showToast('Kategorie byla uložena.');
          } catch (err) {
            showToast(`Kategorii se nepodařilo ${isNew ? 'vytvořit' : 'uložit'}${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setSaving(false);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteSermonCategory(categoryId);
            showToast('Kategorie byla smazána. Záznamy v ní zůstaly bez kategorie.');
            router.push('/admin/kategorie-zaznamu');
          } catch (err) {
            showToast(`Kategorii se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <Link
                href="/admin/kategorie-zaznamu"
                className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zpět na seznam kategorií</span>
              </Link>

              {!loading && (
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#c93838] hover:bg-[#b02f2f] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  >
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? (isNew ? 'Vytvářím…' : 'Ukládám…') : saved ? 'Uloženo' : isNew ? 'Vytvořit' : 'Uložit'}</span>
                  </button>
                  {!isNew && (
                    <button
                      onClick={() => setDeleteConfirmOpen(true)}
                      title="Smazat kategorii"
                      aria-label="Smazat kategorii"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-200 bg-white hover:border-[#c93838] hover:bg-red-50 text-neutral-500 hover:text-[#c93838] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div>
                  <label className={labelClass}>
                    Název <span className="text-[#c93838]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setNameError(false);
                    }}
                    className={`w-full text-lg sm:text-xl font-extrabold text-neutral-900 font-serif px-3.5 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-colors ${
                      nameError
                        ? 'border-[#c93838] focus:border-[#c93838] focus:ring-[#c93838]/20'
                        : 'border-neutral-200 focus:border-[#c93838]/50 focus:ring-[#c93838]/20'
                    }`}
                  />
                  {nameError && <p className="text-xs font-medium text-[#c93838] mt-1">Název je povinný.</p>}
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
            )}

            <ConfirmModal
              open={deleteConfirmOpen}
              title="Smazat kategorii"
              message={`Opravdu smazat kategorii „${name || ''}“? Záznamy v ní zůstanou, jen ztratí zařazení.`}
              onCancel={() => setDeleteConfirmOpen(false)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
