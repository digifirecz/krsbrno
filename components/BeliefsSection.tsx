'use client';

import ImageCard from '@/components/ImageCard';
import QuoteBanner from '@/components/QuoteBanner';
import { 
  ArrowRight, 
  Sun, 
  ShieldAlert, 
  Heart, 
  Sunrise, 
  Sparkles, 
  Users, 
  Flame, 
  BookOpen, 
  MessageSquare, 
  Music2,
  HeartHandshake
} from 'lucide-react';

interface BeliefsSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function BeliefsSection({ setActiveTab }: BeliefsSectionProps) {
  const handleCTA = () => {
    if (setActiveTab) {
      setActiveTab('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const contactSec = document.getElementById('sec-contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-white" id="sec-beliefs">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
              Čemu věříme
            </h1>

            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-sm text-neutral-700 font-sans leading-relaxed">
                Jsme lidé, kteří věří v Boha a snaží se řídit životem a učením Ježíše Krista. Víru chápeme jako cestu, která dává smysl životu, vztahům i rozhodnutím. Základem je pro nás Bible, kterou vnímáme jako zdroj inspirace, naděje a praktické moudrosti pro každodenní život. Naší vizí je šířit dobro ve světě a dobrou zprávu o naději a záchraně, kterou Bůh nabízí všem lidem.
              </p>
              <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs">
                Chceme být místem, kde je každý vítán – ať už věří, hledá, nebo se teprve seznamuje s pravou hodnotou křesťanství.
              </div>
            </div>
          </div>

          {/* 2 Top Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
            <ImageCard
              src="https://picsum.photos/seed/belieffaith1/800/500"
              alt="Biblická pravda a hodnoty"
              caption="Biblická pravda a hodnoty pro každodenní život"
            />
            <ImageCard
              src="https://picsum.photos/seed/belieffaith2/800/500"
              alt="Společenství a víra"
              caption="Živá víra a společenství v praxi"
            />
          </div>

        </div>
      </section>

      {/* SECTION 1: Boží plán s člověkem */}
      <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Boží plán s člověkem
            </h2>
            <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto">
              Příběh o stvoření, odvrácení se od Boha, záchraně a věčné naději.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Card 1: Vznik dobra */}
            <div className="bg-neutral-50/60 p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Vznik dobra
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Bůh stvořil svět jako dobrý a smysluplný. Člověka stvořil pro vztah se sebou i s ostatními. Svět měl být místem lásky, radosti, spravedlnosti a života v Boží blízkosti.
              </p>
            </div>

            {/* Card 2: Vznik zla */}
            <div className="bg-neutral-50/60 p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Vznik zla
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Zlo není Božím záměrem. Lidé dostali svobodu volby a odvrácení se od Boha přineslo do světa bolest, pýchu, nespravedlnost i duchovní prázdnotu. To je realita, kterou kolem sebe vidíme dodnes.
              </p>
            </div>

            {/* Card 3: Záchrana světa */}
            <div className="bg-neutral-50/60 p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Záchrana světa
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Bůh svět neopustil. Před zhruba 2000 lety poslal Ježíše Krista, svého Syna, který přišel mezi lidi, zemřel za jejich chyby (hříchy) a byl vzkříšen k životu. V něm nabízí Bůh odpuštění a nový začátek.
              </p>
            </div>

            {/* Card 4: Naděje budoucnosti */}
            <div className="bg-neutral-50/60 p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Sunrise className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Naděje budoucnosti
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Smrtí život nekončí. Člověk je stvořen pro věčnost a Bůh věřícím zaslibuje nový svět, kde nebude bolest ani nespravedlnost, ale plnost života v jeho přítomnosti.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Život věřícího člověka */}
      <section className="py-12 sm:py-16 bg-neutral-50/40 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Život věřícího člověka
            </h2>
            <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto">
              Praktické prožívání víry v každodenním životě i ve společenství.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1: Nový začátek */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Nový začátek
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Víra začíná osobním rozhodnutím důvěřovat Ježíši Kristu. Křest je fyzickým vyjádřením víry a symbolem nového života.
              </p>
            </div>

            {/* Card 2: Církev */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Církev
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Církev je společenství lidí, kteří se snaží následovat Ježíše Krista. Místo přijetí, růstu a vzájemné podpory.
              </p>
            </div>

            {/* Card 3: Boží působení */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Boží působení
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Bůh v životě věřícího působí skrze proměnu srdce, pokoj v obtížích i vedení při rozhodování.
              </p>
            </div>

            {/* Card 4: Boží slovo – Bible */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Boží slovo – Bible
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Průvodce pro každodenní život a zdroj povzbuzení. Skrze Písmo poznáváme, kým Bůh je.
              </p>
            </div>

            {/* Card 5: Modlitba */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Modlitba
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Osobní rozhovor s Bohem. Prostor pro vděčnost, prosby i hledání Božího vedení v běžném životě.
              </p>
            </div>

            {/* Card 6: Chvály */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                <Music2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-serif">
                Chvály
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                Hudební vyjádření vděčnosti a radosti z Boží přítomnosti v našem životě a společenství.
              </p>
            </div>
          </div>

        </div>
      </section>



      {/* SECTION 3: Modlitba odevzdání */}
      <QuoteBanner 
        quote="„Bože, přicházím k Tobě takový, jaký jsem. Uvědomuji si, že potřebuji odpuštění a nový začátek. Věřím, že Ježíš Kristus přišel na svět, zemřel za mé hříchy a vstal z mrtvých. Přijímám jeho oběť a prosím o odpuštění všeho, co jsem pokazil. Otevírám Ti svůj život a chci Ti důvěřovat. Veď mě, proměňuj a uč mě žít podle Tvého záměru. Amen.“"
        citation="Modlitba odevzdání"
      />

      {/* SECTION 4: Přijď mezi nás & Fotky */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* CTA Box */}
          <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-5 shadow-2xs relative overflow-hidden group hover:border-red-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-[#c93838] border border-red-200/60 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform duration-300">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
                Cesta víry nekončí u jednoho
              </h3>
              
              <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
                Pokud ses rozhodl odevzdat svůj život Bohu, je to úžasná zpráva! Máme z toho opravdovou radost a chceme ji prožít společně s tebou. Víra patří do společenství.
              </p>

              <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs max-w-xl mx-auto">
                Přijď mezi nás, pověz nám o svém rozhodnutí a dovol nám být ti oporou na tvém novém začátku na cestě víry.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCTA}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Přijď mezi nás</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spodní 2 fotky */}
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
