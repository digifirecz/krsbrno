'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getSermons, getSermonCategories, getSermonSpeakers } from '@/lib/actions/sermons';
import type { Sermon, SermonCategory, SermonSpeaker } from '@/lib/sermons';
import { getYoutubeEmbedUrl } from '@/lib/youtube';
import { Play, Pause, Search, Download, User, Volume2, LayoutGrid, Youtube } from 'lucide-react';

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function SermonsSection() {
  const [cats, setCats] = useState<SermonCategory[]>([]);
  const [speakers, setSpeakers] = useState<SermonSpeaker[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCat, setActiveCat] = useState<string>(''); // '' = Vše
  const [search, setSearch] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getSermonCategories(), getSermonSpeakers(), getSermons()])
      .then(([c, sp, s]) => {
        if (!active) return;
        setCats(c);
        setSpeakers(sp);
        setSermons(s);
        setCurrentId(s.find((x) => x.audioUrl)?.id ?? null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const speakerName = (id?: string | null) => speakers.find((s) => s.id === id)?.name;
  const catName = (id?: string | null) => cats.find((c) => c.id === id)?.name;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sermons.filter((s) => {
      if (activeCat && s.categoryId !== activeCat) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (speakerName(s.speakerId) || '').toLowerCase().includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sermons, activeCat, search, speakers]);

  const active = sermons.find((s) => s.id === currentId) || null;

  // Load the selected recording into the audio element.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !active?.audioUrl) return;
    if (el.src.endsWith(encodeURI(active.audioUrl)) || el.src.endsWith(active.audioUrl)) return;
    el.src = active.audioUrl;
    el.load();
  }, [active?.audioUrl]);

  const selectAndPlay = (s: Sermon) => {
    if (!s.audioUrl) return;
    if (currentId === s.id) {
      const el = audioRef.current;
      if (!el) return;
      if (el.paused) el.play().catch(() => {});
      else el.pause();
      return;
    }
    setCurrentId(s.id);
    // src set by effect on next render; play once it's ready
    requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
  };

  return (
    <div className="bg-white min-h-[70vh]" id="sec-sermons">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Volume2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            {activeCat ? catName(activeCat) : 'Záznamy'}
          </h1>
          <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed max-w-2xl mx-auto">
            Poslechněte si nahrávky ze setkání a bohoslužeb, nebo si je stáhněte.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sermons.length === 0 ? (
            <p className="text-center text-neutral-500 py-16">Zatím zde nejsou žádné záznamy.</p>
          ) : (
            <>
              {/* Category switcher — driven by DB categories */}
              {cats.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  <button
                    onClick={() => setActiveCat('')}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer ${
                      activeCat === ''
                        ? 'bg-[#c93838] text-white shadow-md'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Vše</span>
                  </button>
                  {cats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCat(c.id)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs capitalize cursor-pointer ${
                        activeCat === c.id
                          ? 'bg-[#c93838] text-white shadow-md'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Player bar */}
              {active && (
                <div className="mb-10 bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-neutral-800">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="min-w-0 md:w-64 shrink-0">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                        {isPlaying ? 'Právě hraje' : 'Vybraný záznam'}
                      </span>
                      {active.title && (
                        <h3 className="text-base sm:text-lg font-bold font-serif text-white truncate">{active.title}</h3>
                      )}
                      <p className="text-xs text-neutral-400 font-sans truncate">
                        {[speakerName(active.speakerId), fmtDate(active.date)].filter(Boolean).join(' • ')}
                      </p>
                    </div>

                    <audio
                      ref={audioRef}
                      controls
                      preload="none"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full flex-1 min-w-0"
                    >
                      Váš prohlížeč nepodporuje přehrávání zvuku.
                    </audio>

                    {active.audioUrl && (
                      <a
                        href={active.audioUrl}
                        download
                        className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors border border-neutral-700 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Stáhnout MP3</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Hledat téma, řečníka…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838] bg-neutral-50/50 font-sans"
                  />
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visible.length === 0 ? (
                  <div className="md:col-span-2 text-center py-12 bg-white rounded-2xl border border-neutral-200">
                    <p className="text-sm text-neutral-500">Žádné záznamy neodpovídají filtru.</p>
                  </div>
                ) : (
                  visible.map((s) => {
                    const thisPlaying = currentId === s.id && isPlaying;
                    const embedUrl = getYoutubeEmbedUrl(s.youtubeUrl);
                    return (
                      <div
                        key={s.id}
                        className={`bg-white p-6 sm:p-7 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                          currentId === s.id ? 'ring-2 ring-[#c93838]/40 border-[#c93838]' : 'border-neutral-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3 gap-2">
                            {catName(s.categoryId) ? (
                              <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold capitalize">
                                {catName(s.categoryId)}
                              </span>
                            ) : (
                              <span />
                            )}
                            <span className="text-xs text-neutral-400 font-medium shrink-0">{fmtDate(s.date)}</span>
                          </div>

                          {s.title && <h3 className="text-xl font-bold text-neutral-900 font-serif mb-2">{s.title}</h3>}

                          {speakerName(s.speakerId) && (
                            <div className="flex items-center space-x-1 text-xs text-neutral-600 font-semibold mb-3">
                              <User className="w-3.5 h-3.5 text-[#c93838]" />
                              <span>{speakerName(s.speakerId)}</span>
                            </div>
                          )}

                          {s.description && (
                            <div
                              className="text-sm text-neutral-600 line-clamp-2 mb-4 leading-relaxed [&_a]:text-[#c93838] [&_a]:underline"
                              dangerouslySetInnerHTML={{ __html: s.description }}
                            />
                          )}
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              onClick={() => selectAndPlay(s)}
                              disabled={!s.audioUrl}
                              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#c93838] border border-red-100 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                              {thisPlaying ? (
                                <>
                                  <Pause className="w-4 h-4 fill-current" />
                                  <span>Pozastavit</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 fill-current" />
                                  <span>{s.audioUrl ? 'Přehrát' : 'Bez nahrávky'}</span>
                                </>
                              )}
                            </button>

                            {embedUrl && (
                              <a
                                href={s.youtubeUrl ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-bold transition-colors shrink-0"
                              >
                                <Youtube className="w-4 h-4 text-[#FF0000]" />
                                <span>Video na YouTube</span>
                              </a>
                            )}
                          </div>

                          {s.audioUrl && (
                            <a
                              href={s.audioUrl}
                              download
                              className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors shrink-0"
                              title="Stáhnout MP3"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
