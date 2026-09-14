'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import RichTextEditor from '@/components/admin/blocks/RichTextEditor';
import AudioUpload from '@/components/admin/blocks/AudioUpload';
import CategorySelect from '@/components/admin/blocks/CategorySelect';
import SpeakerSelect from '@/components/admin/blocks/SpeakerSelect';
import { useToast } from '@/components/admin/ToastProvider';
import { getSermon, createSermon, updateSermon, deleteSermon } from '@/lib/actions/sermons';
import { getYoutubeEmbedUrl } from '@/lib/youtube';
import { ArrowLeft, Trash2, Save, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';
const labelClass = 'block text-xs font-bold text-neutral-600 mb-1';

function toDateInput(d: Date | null | undefined): string {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

export default function AdminSermonEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sermonId = params.id;
  const isNew = sermonId === 'novy';
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [speakerId, setSpeakerId] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [speakerError, setSpeakerError] = useState(false);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    let active = true;
    getSermon(sermonId)
      .then((s) => {
        if (!active) return;
        if (s) {
          setTitle(s.title);
          setSpeakerId(s.speakerId || '');
          setDateStr(toDateInput(s.date));
          setCategoryId(s.categoryId || '');
          setDescription(s.description || '');
          setAudioUrl(s.audioUrl || '');
          setYoutubeUrl(s.youtubeUrl || '');
          setVisible(s.visible);
        }
        setLoading(false);
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [sermonId, isNew]);

  return (
    <RequireAuth>
      {(user) => {
        const handleSave = async () => {
          if (!speakerId) {
            setSpeakerError(true);
            showToast('Řečník je povinný.', 'error');
            return;
          }
          setSpeakerError(false);
          setSaving(true);
          const patch = {
            title: title.trim(),
            speakerId: speakerId || null,
            date: dateStr ? new Date(`${dateStr}T12:00:00`) : null,
            categoryId: categoryId || null,
            description: description.trim() || null,
            audioUrl: audioUrl || null,
            youtubeUrl: youtubeUrl.trim() || null,
            visible,
          };
          try {
            if (isNew) {
              const newId = await createSermon(patch, user.email);
              showToast(visible ? 'Záznam byl vytvořen.' : 'Záznam byl vytvořen a je skrytý na webu.');
              router.replace(`/admin/zaznamy/${newId}`);
              return;
            }
            await updateSermon(sermonId, patch, user.email);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            showToast(visible ? 'Záznam byl uložen.' : 'Záznam byl uložen a je skrytý na webu.');
          } catch (err) {
            showToast(`Záznam se nepodařilo ${isNew ? 'vytvořit' : 'uložit'}${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setSaving(false);
          }
        };

        const handleDelete = async () => {
          try {
            await deleteSermon(sermonId);
            showToast('Záznam byl smazán.');
            router.push('/admin/zaznamy');
          } catch (err) {
            showToast(`Záznam se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <Link
                href="/admin/zaznamy"
                className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zpět na seznam záznamů</span>
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
                  <button
                    onClick={() => setVisible((v) => !v)}
                    title={visible ? 'Zobrazeno na webu' : 'Skryto na webu'}
                    aria-label={visible ? 'Skrýt záznam' : 'Zobrazit záznam'}
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-all cursor-pointer ${
                      visible
                        ? 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-500'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  {!isNew && (
                    <button
                      onClick={() => setDeleteOpen(true)}
                      title="Smazat záznam"
                      aria-label="Smazat záznam"
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
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div>
                    <label className={labelClass}>Název</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-lg sm:text-xl font-extrabold text-neutral-900 font-serif px-3.5 py-2 rounded-xl border border-neutral-200 bg-white focus:border-[#c93838]/50 focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Datum</label>
                      <input
                        type="date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Kategorie</label>
                      <CategorySelect value={categoryId} onChange={setCategoryId} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Řečník <span className="text-[#c93838]">*</span>
                    </label>
                    <SpeakerSelect
                      value={speakerId}
                      onChange={(v) => {
                        setSpeakerId(v);
                        if (v) setSpeakerError(false);
                      }}
                    />
                    {speakerError && <p className="text-xs font-medium text-[#c93838] mt-1">Řečník je povinný.</p>}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div>
                    <label className={labelClass}>Nahrávka</label>
                    <AudioUpload value={audioUrl} onChange={setAudioUrl} id={sermonId} folder="sermons" />
                  </div>

                  <div>
                    <label className={labelClass}>YouTube</label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className={fieldClass}
                    />
                    {youtubeUrl.trim() && !getYoutubeEmbedUrl(youtubeUrl) && (
                      <p className="text-xs font-medium text-[#c93838] mt-1">
                        Tenhle odkaz nevypadá jako platné YouTube video — na webu se nezobrazí.
                      </p>
                    )}
                    {getYoutubeEmbedUrl(youtubeUrl) && (
                      <div className="mt-2 aspect-video w-full max-w-sm rounded-xl overflow-hidden bg-neutral-100">
                        <iframe
                          src={getYoutubeEmbedUrl(youtubeUrl) ?? undefined}
                          className="w-full h-full"
                          title="Náhled YouTube videa"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Popis</label>
                    <RichTextEditor value={description} onChange={setDescription} placeholder="" />
                  </div>
                </div>
              </div>
            )}

            <ConfirmModal
              open={deleteOpen}
              title="Smazat záznam"
              message={`Opravdu chcete záznam „${title || 'bez názvu'}“ trvale smazat?`}
              onCancel={() => setDeleteOpen(false)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAuth>
  );
}
