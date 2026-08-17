'use client';

import Image from 'next/image';
import ImageCard from '@/components/ImageCard';
import QuoteBanner from '@/components/QuoteBanner';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  HeartHandshake, 
  Flame, 
  Sparkles, 
  Music, 
  Gift, 
  Heart, 
  ArrowRight, 
  TrendingUp, 
  Sun, 
  Smile,
  ChevronRight,
  MapPin
} from 'lucide-react';

interface MeetingsProps {
  setActiveTab: (tab: string) => void;
  isHomePage?: boolean;
}

export default function Meetings({ setActiveTab, isHomePage = false }: MeetingsProps) {
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

            <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Čas, kdy se scházíme a zaměřujeme svou pozornost na Boha. Součástí setkání jsou chvály (zpěv písní Bohu), srozumitelné a praktické biblické kázání (výklad z knihy Bible), modlitby (rozhovory s Bohem) a také prostor ke společným diskuzím.
            </p>

            <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs max-w-2xl mx-auto">
              Každé setkání má nenucený a přirozený průběh. Můžeš přijít, posadit se a poslouchat.
            </div>
          </div>

          {/* 3 Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Nedělní bohoslužba */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/sundayworship/800/450"
                  alt="Nedělní bohoslužba"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
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
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    Společné chvály, biblické kázání a připomínka toho, co pro nás Ježíš Kristus udělal.
                  </p>
                </div>
              </div>
            </div>

            {/* Středeční vyučování */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/wednesdaybible/800/450"
                  alt="Středeční vyučování"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50/90 text-[#c93838] border border-red-100 text-xs font-bold font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>17:45 – 18:45</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Středeční vyučování
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    Společné studium Bible a hledání odpovědí na otázky víry.
                  </p>
                </div>
              </div>
            </div>

            {/* Páteční modlitební */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 hover:border-[#c93838]/40 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/fridayprayer/800/450"
                  alt="Páteční modlitební"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50/90 text-[#c93838] border border-red-100 text-xs font-bold font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>17:45 – 18:45</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Páteční modlitební
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
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

  return (
    <div className="border-b border-neutral-200/60" id="sec-meetings">
      
      {/* 1. HEADER SECTION (Modernised Hero Header) */}
      <section className="py-12 sm:py-16 bg-neutral-50/80 border-b border-neutral-200/70 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
              <Users className="w-6 h-6" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
              Společná setkávání
            </h1>

            <div className="space-y-4 max-w-3xl mx-auto text-neutral-700 font-sans text-sm leading-relaxed">
              <p>
                Společná setkání jsou přirozenou součástí křesťanského života, protože věříme, že člověk nebyl stvořen Bohem k samotě, ale ke vztahům. Vzájemně se povzbuzujeme, neseme břemena druhých a společně rosteme ve víře a lásce. Právě mezi lidmi pociťujeme přijetí, útěchu i radost, která se těžko prožívá o samotě.
              </p>
              <div className="inline-block bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs">
                Setkání jsou otevřená pro všechny – pro ty, co věří, hledají nebo je víra jen zajímá.
              </div>
            </div>
          </div>



        </div>
      </section>

      {/* 2. BĚŽNÁ SETKÁVÁNÍ (Modernized Grid) */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Běžná setkávání
            </h2>

            <p className="text-sm text-neutral-600 leading-relaxed font-sans max-w-2xl mx-auto">
              Čas, kdy se scházíme a zaměřujeme svou pozornost na Boha. Součástí setkání jsou chvály (zpěv písní Bohu), srozumitelné a praktické biblické kázání (výklad z knihy Bible), modlitby (rozhovory s Bohem) a také prostor ke společným diskuzím.
            </p>

            <div className="inline-block bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs">
              Každé setkání má nenucený a přirozený průběh. Můžeš přijít, posadit se a poslouchat.
            </div>
          </div>

          {/* Grid 6 Cards (3x2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Nedělní bohoslužba */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/sundayworship/800/450"
                  alt="Nedělní bohoslužba"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center font-bold text-xs border border-red-100">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100/80 text-[#c93838] font-bold text-xs">
                    <Clock className="w-3 h-3" />
                    <span>9:30 - 11:00</span>
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Nedělní bohoslužba
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Společné chvály, biblické kázání a připomínka toho, co pro nás Ježíš Kristus udělal.
                </p>
              </div>
            </div>

            {/* Středeční vyučování */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/wednesdaybible/800/450"
                  alt="Středeční vyučování"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center font-bold text-xs border border-red-100">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-200/70 text-neutral-700 font-bold text-xs">
                    <Clock className="w-3 h-3" />
                    <span>17:45 - 18:45</span>
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Středeční vyučování
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Společné studium Bible a hledání odpovědí na otázky víry.
                </p>
              </div>
            </div>

            {/* Páteční modlitební */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/fridayprayer/800/450"
                  alt="Páteční modlitební"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center font-bold text-xs border border-red-100">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-200/70 text-neutral-700 font-bold text-xs">
                    <Clock className="w-3 h-3" />
                    <span>17:45 - 18:45</span>
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Páteční modlitební
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Společné modlitby a Duchovní zamyšlení pro každodenní život.
                </p>
              </div>
            </div>

            {/* Děti – Besídka */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/kidsbesidka/800/450"
                  alt="Děti – Besídka"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-100">
                    <Smile className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Děti – Besídka
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                    Pravidelný program a zábava pro děti do 5 let.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('kids')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] hover:text-[#b02e2e] transition-colors pt-2 cursor-pointer"
                >
                  <span>zjistit více</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dorost – Poutníci */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/teenspoutnici/800/450"
                  alt="Dorost – Poutníci"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs border border-sky-100">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Dorost – Poutníci
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                    Pravidelná setkání pro děti ve věku 12-15 let.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('teens')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] hover:text-[#b02e2e] transition-colors pt-2 cursor-pointer"
                >
                  <span>zjistit více</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mládež – Elevate */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/youthelevate/800/450"
                  alt="Mládež – Elevate"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                    Mládež – Elevate
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-sans">
                    Dynamické setkání pro mládež ve věku 15-30 let.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('youth')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] hover:text-[#b02e2e] transition-colors pt-2 cursor-pointer"
                >
                  <span>zjistit více</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PRAVIDELNÉ AKCE */}
      <section className="py-14 sm:py-18 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Pravidelné akce
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans max-w-2xl mx-auto">
              Pořádáme různé akce během roku – setkání, vyučování, konference i společné aktivity pro rodiny a děti. Jsou otevřené všem, kdo chtějí poznat víru blíž nebo strávit čas ve společenství.
            </p>
          </div>

          {/* Grid 6 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/baptismevent/800/450"
                  alt="Křest"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Křest
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Veřejné vyznání víry v Ježíše Krista a radostná oslava nového začátku.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/conferenceevent/800/450"
                  alt="Konference"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Konference
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Tematické setkání zaměřené na hlubší vyučování, povzbuzení a duchovní růst.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/worshipnightevent/800/450"
                  alt="Večer chval"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <Music className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Večer chval
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Společný večer modlitby a zpěvu zaměřený na Boha a duchovní povzbuzení.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/childrensdayevent/800/450"
                  alt="Den dětí"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <Smile className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Den dětí
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Odpoledne plné her a programu pro děti i jejich rodiče.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/christmassparty/800/450"
                  alt="Vánoční besídka"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Vánoční besídka
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Slavnostní setkání připomínající narození Ježíše Krista v rodinné atmosféře.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden group">
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                <Image
                  src="https://picsum.photos/seed/christmaswreaths/800/450"
                  alt="Vánoční vyrábění věnců"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center text-xs font-bold mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                  Vánoční vyrábění věnců
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  Tvořivé adventní setkání spojené s výrobou věnců a společným časem.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. VÝHODY SPOLEČENSTVÍ */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Výhody společenství
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-sans">
              Proč je dobré prožívat víru v komunitě ostatních
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            
            <div className="bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs hover:border-[#c93838]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] border border-red-100/80 flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Společenství a podpora
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Nemusíme zůstávat sami. Sdílíme radosti i těžkosti, modlíme se jeden za druhého a navzájem se povzbuzujeme.
              </p>
            </div>

            <div className="bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs hover:border-[#c93838]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] border border-red-100/80 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Duchovní růst
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Společné vyučování a rozhovory pomáhají lépe porozumět Bibli a žít víru prakticky.
              </p>
            </div>

            <div className="bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs hover:border-[#c93838]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] border border-red-100/80 flex items-center justify-center mx-auto mb-3">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Služba druhým
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Společenství dává prostor zapojit se podle svých darů a aktivně přispívat k životu církve.
              </p>
            </div>

            <div className="bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/80 text-center space-y-2 shadow-2xs hover:border-[#c93838]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] border border-red-100/80 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Radost a naděje
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Sdílená víra přináší silnější a intenzivnější radost, odvahu a jistotu, že nejsme na cestě sami.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. BIBLE QUOTE BANNER */}
      <QuoteBanner 
        quote="„Lépe je dvěma nežli samotnému; jejich námaha má štědrou odměnu: Padne-li jeden z nich, druhý ho zvedne, padne-li osamělý, běda, kdo zvedne jej?!“"
        citation="Kazatel 4:9-10 (Bible)"
      />

      {/* 6. STAŇ SE SOUČÁSTÍ & CTA */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Bottom Call to Action Box */}
          <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-2xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-5 shadow-xs relative overflow-hidden group hover:border-[#c93838]/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/80 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform duration-300">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
                Staň se součástí společenství
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-sans leading-relaxed">
                Nezůstávej na víru ani život sám. Rádi tě uvidíme mezi námi na kterémkoliv shromáždění.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('contact')}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Přijď mezi nás</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2 Bottom Images using reusable ImageCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4">
            <ImageCard
              src="https://picsum.photos/seed/brnochurchworship1/800/500"
              alt="Chvály a uctívání"
              caption="Chvály a uctívání při společných bohoslužbách"
            />
            <ImageCard
              src="https://picsum.photos/seed/brnochurchworship2/800/500"
              alt="Víra celým srdcem"
              caption="Víra celým srdcem a hudební doprovod"
            />
          </div>

        </div>
      </section>

    </div>
  );
}

