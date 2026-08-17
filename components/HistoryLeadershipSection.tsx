'use client';

import { useState } from 'react';
import ImageCard from '@/components/ImageCard';
import { HISTORY_TIMELINE } from '@/data/churchData';
import { Calendar, MapPin, Building2, ChevronDown, ArrowRight, Heart, Users, Church } from 'lucide-react';

interface HistoryLeadershipProps {
  setActiveTab?: (tab: string) => void;
}

export default function HistoryLeadershipSection({ setActiveTab }: HistoryLeadershipProps) {
  // Store expanded item indexes. By default, open the first item
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="border-b border-neutral-200/60" id="sec-about">
      
      {/* SECTION 1: O našem sboru & Sborový dům (Soustředěný světle šedý blok s pozadím) */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
              <Church className="w-6 h-6" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
              O našem sboru
            </h1>

            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-neutral-700 font-sans leading-relaxed">
                Naše historie je svědectvím o tom, jak Bůh vede lidi napříč generacemi. Od prvních kroků až dodnes prožíváme jeho vedení, proměnu životů i budování společenství. Každé období přineslo nové výzvy, příležitosti i růst, který sbor formoval.
              </p>
            </div>
          </div>

          {/* Sborová budova (Church Building Card) */}
          <div className="rounded-2xl bg-white p-6 sm:p-8 border border-neutral-200/90 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#c93838] bg-red-50 px-3 py-1 rounded-md border border-red-100 font-sans">
                <Building2 className="w-3.5 h-3.5" />
                <span>Sborový dům „Šámalka“</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 leading-snug">
                Náš domov a místo setkávání
              </h2>
              
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Původní stolařská dílna na Šámalově byla během let postupně přebudována ve sborový dům se sály, knihovnou, klubovnami pro děti a mládež i velkou zahradou. Od roku 2020 je sbor výlučným vlastníkem celého objektu, což přináší skvělé zázemí pro všechny generace.
              </p>
              
              <div className="pt-1 flex items-center space-x-2 text-xs font-bold text-neutral-800 font-sans">
                <MapPin className="w-4 h-4 text-[#c93838] shrink-0" />
                <span>Šámalova 15a, 615 00 Brno - Židenice</span>
              </div>
            </div>

            <ImageCard
              src="https://picsum.photos/seed/historicchurchbrno/800/500"
              alt="Sborový dům Šámalova"
              caption="Sborový dům se sály, klubovnami a zahradou"
            />
          </div>

        </div>
      </section>

      {/* SECTION 2: Historie našeho sboru v datech (Čistý bílý podklad) */}
      <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Historie našeho sboru v datech
            </h2>
            <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto">
              Klikněte na jednotlivé roky pro zobrazení celého příběhu
            </p>
          </div>

          {/* Vertical Alternating Timeline Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Central Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#c93838]/20 via-[#c93838] to-[#c93838]/20" />
            
            {/* Mobile Vertical Line */}
            <div className="block md:hidden absolute left-4 top-3 bottom-3 w-0.5 bg-neutral-200" />

            <div className="space-y-4 sm:space-y-5">
              {HISTORY_TIMELINE.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isExpanded = expandedIndex === idx;

                return (
                  <div 
                    key={idx}
                    className="relative flex flex-col md:flex-row items-center"
                  >
                    {/* Card Container */}
                    <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${
                      isEven 
                        ? 'md:order-2 md:pl-8 md:pr-0' 
                        : 'md:order-1 md:pr-8 md:pl-0'
                    }`}>
                      <div 
                        onClick={() => toggleExpand(idx)}
                        className={`bg-neutral-50/90 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none group ${
                          isExpanded 
                            ? 'border-[#c93838] bg-white shadow-md ring-1 ring-[#c93838]/20' 
                            : 'border-neutral-200/80 hover:border-[#c93838]/40 hover:bg-white shadow-2xs'
                        }`}
                      >
                        {/* Header row: Year + Expand Toggle */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#c93838] text-white font-extrabold text-xs tracking-wider shadow-2xs font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{item.year}</span>
                          </span>
                          
                          <div className={`p-1 rounded-full transition-transform duration-200 ${
                            isExpanded ? 'bg-red-50 text-[#c93838] rotate-180' : 'text-neutral-400 group-hover:text-neutral-700'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-neutral-900 font-serif mt-2 group-hover:text-[#c93838] transition-colors">
                          {item.title}
                        </h3>

                        {/* Expandable Text Body */}
                        {isExpanded && (
                          <div className="mt-2.5 pt-2.5 border-t border-neutral-100 text-sm text-neutral-600 leading-relaxed font-sans animate-in fade-in duration-200">
                            {item.text}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Minimal Sleek Dot on Axis */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white transition-all shadow-2xs ${
                        isExpanded 
                          ? 'bg-[#c93838] ring-3 ring-red-100 scale-110' 
                          : 'bg-neutral-300'
                      }`} />
                    </div>

                    {/* Empty Opposite Half on Desktop */}
                    <div className={`hidden md:block w-1/2 ${
                      isEven ? 'md:order-1' : 'md:order-2'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Pozvání na setkání (Soustředěný světlý blok s kartou) */}
      <section className="py-12 sm:py-16 bg-neutral-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-5 shadow-xs">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
                Přijďte se k nám podívat
              </h3>
              
              <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
                Každou neděli se setkáváme ke společným bohoslužbám, modlitbám a rozhovorům nad Biblí.
              </p>

              <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs max-w-xl mx-auto">
                Dveře jsou otevřené pro každého – ať už věříte, hledáte odpovědi, nebo se chcete jen nezávazně podívat.
              </div>
            </div>

            {setActiveTab && (
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('meetings')}
                  className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Společná setkávání</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
