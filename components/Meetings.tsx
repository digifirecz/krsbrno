'use client';

import { useEffect, useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPageBlocks } from '@/lib/actions/pages';
import { PAGE_IDS } from '@/lib/blocks/pageRegistry';
import type { BlockInstance } from '@/lib/blocks/types';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  HeartHandshake,
  ArrowRight,
  MapPin
} from 'lucide-react';

interface MeetingsProps {
  setActiveTab: (tab: string) => void;
  isHomePage?: boolean;
}

export default function Meetings({ setActiveTab, isHomePage = false }: MeetingsProps) {
  const [blocks, setBlocks] = useState<BlockInstance[] | null>(null);

  useEffect(() => {
    if (isHomePage) return;
    let active = true;
    getPageBlocks(PAGE_IDS.meetings)
      .then((fetched) => {
        if (active) setBlocks(fetched || []);
      })
      .catch(() => {
        if (active) setBlocks([]);
      });
    return () => {
      active = false;
    };
  }, [isHomePage]);

  if (isHomePage) {
    return (
      <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-neutral-50/50 to-white border-b border-neutral-200/70" id="sec-meetings-home">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
              <Calendar className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif tracking-tight">
              Běžná setkávání
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Čas, kdy se scházíme a zaměřujeme svou pozornost na Boha. Součástí setkání jsou chvály (zpěv písní Bohu), srozumitelné a praktické biblické kázání (výklad z knihy Bible), modlitby (rozhovory s Bohem) a také prostor ke společným diskuzím.
            </p>

            <p className="italic font-serif text-sm sm:text-base text-[#c93838] leading-relaxed max-w-2xl mx-auto">
              Každé setkání má nenucený a přirozený průběh. Můžeš přijít, posadit se a poslouchat.
            </p>
          </div>

          {/* 3 Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Nedělní bohoslužba */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50/90 text-[#c93838] border border-red-100 text-xs font-bold font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>9:30 – 11:00</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Nedělní bohoslužba
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                    Společné chvály, biblické kázání a připomínka toho, co pro nás Ježíš Kristus udělal.
                  </p>
                </div>
              </div>
            </div>

            {/* Středeční vyučování */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 text-amber-700 border border-amber-100 text-xs font-bold font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>17:45 – 18:45</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Středeční vyučování
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                    Společné studium Bible a hledání odpovědí na otázky víry.
                  </p>
                </div>
              </div>
            </div>

            {/* Páteční modlitební */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50/90 text-blue-700 border border-blue-100 text-xs font-bold font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>17:45 – 18:45</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Páteční modlitební
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                    Společné modlitby a duchovní zamyšlení pro každodenní život.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('contact')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Kde se setkáváme</span>
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80 font-bold text-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span>Více našich setkání</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>
    );
  }

  if (!blocks) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="border-b border-neutral-200/60" id="sec-meetings">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
