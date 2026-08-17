'use client';

import { useState } from 'react';
import { SERMONS_DATA, Sermon } from '@/data/churchData';
import { Play, Pause, Search, Download, BookOpen, User, Calendar, Church, Users, Sparkles, ChevronRight, Volume2 } from 'lucide-react';

interface SermonsSectionProps {
  initialCategory?: 'sunday' | 'wednesday' | 'conference' | 'occasional';
}

export default function SermonsSection({ initialCategory = 'sunday' }: SermonsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'sunday' | 'wednesday' | 'conference' | 'occasional'>(initialCategory);
  const [selectedConferenceYear, setSelectedConferenceYear] = useState<string>('2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(SERMONS_DATA[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filter sermons by active category
  const categorySermons = SERMONS_DATA.filter((s) => s.category === activeCategory);
  
  // For conference view, filter by selected conference year
  const currentConferenceSermons = categorySermons.filter((s) => s.year === selectedConferenceYear);

  const activeSermon = SERMONS_DATA.find((s) => s.id === currentlyPlayingId) || SERMONS_DATA[0];

  const filteredSermons = categorySermons.filter((sermon) => {
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const togglePlay = (sermonId: string) => {
    if (currentlyPlayingId === sermonId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlayingId(sermonId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white min-h-[80vh]" id="sec-sermons">
      
      {/* 1. HERO / INTRO HEADER (Darker background block) */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Volume2 className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            {activeCategory === 'conference' ? 'Záznamy z konference' : activeCategory === 'wednesday' ? 'Středeční vyučování' : activeCategory === 'occasional' ? 'Příležitostná kázání' : 'Záznamy z bohoslužeb'}
          </h1>
          <p className="text-sm text-neutral-700 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Poslechněte si nahrávky kázání, stáhněte si MP3 nebo vyhledávejte v archivu.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT (Lighter background section) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('sunday')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs ${
                activeCategory === 'sunday'
                  ? 'bg-[#c93838] text-white shadow-md'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Church className="w-4 h-4" />
              <span>Nedělní bohoslužba</span>
            </button>
            
            <button
              onClick={() => setActiveCategory('wednesday')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs ${
                activeCategory === 'wednesday'
                  ? 'bg-[#c93838] text-white shadow-md'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Středeční vyučování</span>
            </button>

            <button
              onClick={() => setActiveCategory('conference')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs ${
                activeCategory === 'conference'
                  ? 'bg-[#c93838] text-white shadow-md'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Konference</span>
            </button>

            <button
              onClick={() => setActiveCategory('occasional')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-2xs ${
                activeCategory === 'occasional'
                  ? 'bg-[#c93838] text-white shadow-md'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Příležitostná</span>
            </button>
          </div>

        {/* Featured Dark Audio Player Bar */}
        {activeSermon && (
          <div className="mb-10 bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <button
                onClick={() => togglePlay(activeSermon.id)}
                className="w-13 h-13 rounded-full bg-[#c93838] hover:bg-[#b02e2e] text-white flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pozastavit' : 'Přehrát'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
              
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  {isPlaying ? 'Právě hraje' : 'Aktivní přehrávač'}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-serif text-white line-clamp-1">{activeSermon.title}</h3>
                <p className="text-xs text-neutral-400 font-sans">
                  {activeSermon.speaker} • {activeSermon.date}
                </p>
              </div>
            </div>

            {/* Simulated progress indicator */}
            <div className="w-full md:w-1/3 flex items-center space-x-3 text-xs text-neutral-400 font-sans">
              <span>0:00</span>
              <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden relative">
                <div className={`h-full bg-[#c93838] transition-all ${isPlaying ? 'w-1/3 animate-pulse' : 'w-0'}`} />
              </div>
              <span>{activeSermon.duration}</span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={activeSermon.audioUrl}
                download
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors border border-neutral-700"
                title="Stáhnout MP3"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Stáhnout MP3</span>
              </a>
            </div>
          </div>
        )}

        {/* CONFERENCE VIEW */}
        {activeCategory === 'conference' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Conference Content Card */}
            <div className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-8">
              
              <div className="border-b border-neutral-100 pb-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif mb-2">
                  {selectedConferenceYear} – {selectedConferenceYear === '2025' ? 'Vděčnost a radost jako životní postoj' : selectedConferenceYear === '2024' ? 'Církev v proměnách doby' : 'Učedníkem v 21. století'}
                </h3>
              </div>

              {/* Conference Banner / Summary Box */}
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-48 h-32 rounded-xl bg-gradient-to-br from-[#c93838] to-neutral-900 p-4 text-white flex flex-col justify-between shrink-0 shadow-inner">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-200">Konference</span>
                  <span className="text-3xl font-extrabold font-serif">{selectedConferenceYear}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed">
                    Stále se radujte, v modlitbách neustávejte. Za všech okolností dělejte, neboť to je vůle Boží v Kristu Ježíši pro vás.
                  </p>
                </div>
              </div>

              {/* Conference Talks List */}
              <div className="space-y-4">
                {currentConferenceSermons.length > 0 ? (
                  currentConferenceSermons.map((sermon) => {
                    const isThisPlaying = currentlyPlayingId === sermon.id && isPlaying;
                    return (
                      <div 
                        key={sermon.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl hover:bg-neutral-50 border-b border-neutral-100 transition-colors gap-4"
                      >
                        <div className="flex items-start sm:items-center space-x-4">
                          <button
                            onClick={() => togglePlay(sermon.id)}
                            className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-[#c93838] flex items-center justify-center shrink-0 transition-all"
                            title="Přehrát"
                          >
                            {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <span className="text-xs font-bold text-[#c93838]">{sermon.date}</span>
                              <span className="text-xs text-neutral-400">•</span>
                              <span className="text-xs font-medium text-neutral-600">{sermon.speaker}</span>
                            </div>
                            <h4 className="text-base font-bold text-neutral-900 font-serif">{sermon.title}</h4>
                            <p className="text-xs text-neutral-500 font-sans mt-0.5">{sermon.summary}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 self-end sm:self-center">
                          <span className="text-xs font-medium text-neutral-400">{sermon.duration}</span>
                          <a
                            href={sermon.audioUrl}
                            download
                            className="p-2.5 rounded-lg bg-neutral-100 hover:bg-red-50 hover:text-[#c93838] text-neutral-600 transition-colors"
                            title="Stáhnout MP3"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-8">Pro tento ročník konference zatím nejsou nahrávky.</p>
                )}
              </div>

            </div>

            {/* Sidebar with Conference Years */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 pb-2 border-b border-neutral-100">
                Ročníky konferencí
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedConferenceYear('2025')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedConferenceYear === '2025' ? 'bg-red-50 text-[#c93838] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>2025 - Vděčnost a radost</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
                <button
                  onClick={() => setSelectedConferenceYear('2024')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedConferenceYear === '2024' ? 'bg-red-50 text-[#c93838] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>2024 - Církev v proměnách</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
                <button
                  onClick={() => setSelectedConferenceYear('2023')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedConferenceYear === '2023' ? 'bg-red-50 text-[#c93838] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>2023 - Učedníkem v 21. st.</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* STANDARD LIST VIEW FOR SUNDAY, WEDNESDAY, OCCASIONAL */
          <div>
            {/* Search Bar only (without speaker dropdown) */}
            <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Hledat téma, řečníka..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838] bg-neutral-50/50 font-sans"
                />
              </div>
            </div>

            {/* Sermon Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSermons.length > 0 ? (
                filteredSermons.map((sermon) => {
                  const isThisPlaying = currentlyPlayingId === sermon.id && isPlaying;

                  return (
                    <div
                      key={sermon.id}
                      className={`bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                        currentlyPlayingId === sermon.id ? 'ring-2 ring-[#c93838]/40 border-[#c93838]' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold font-sans">
                            {sermon.series}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium font-sans">{sermon.date}</span>
                        </div>

                        <h3 className="text-xl font-bold text-neutral-900 font-serif mb-2">
                          {sermon.title}
                        </h3>

                        <div className="flex items-center space-x-1 text-xs text-neutral-600 font-semibold mb-3 font-sans">
                          <User className="w-3.5 h-3.5 text-[#c93838]" />
                          <span>{sermon.speaker}</span>
                        </div>

                        <p className="text-sm text-neutral-600 line-clamp-2 mb-4 font-sans leading-relaxed">
                          {sermon.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <button
                          onClick={() => togglePlay(sermon.id)}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#c93838] border border-red-100 text-xs font-bold transition-colors"
                        >
                          {isThisPlaying ? (
                            <>
                              <Pause className="w-4 h-4 fill-current" />
                              <span>Pozastavit</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-current" />
                              <span>Přehrát ({sermon.duration})</span>
                            </>
                          )}
                        </button>

                        <a
                          href={sermon.audioUrl}
                          download
                          className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
                          title="Stáhnout audio MP3"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-neutral-200">
                  <p className="text-sm text-neutral-500">Žádná kázání neodpovídají zvolenému filtru.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  </div>
  );
}
