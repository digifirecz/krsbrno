'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export default function Hero({ setActiveTab }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 md:py-24 bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/60 border-b border-neutral-200/60">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 items-center">

          {/* Left Text Content */}
          <div className="space-y-6 max-w-2xl">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#c93838] border border-red-100/80 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#c93838]" />
              <span>Otevřené společenství v Brně-Židenicích</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight font-serif leading-[1.12]">
              Nejsi na to <span className="text-[#c93838] relative inline-block">sám</span>
            </h1>

            {/* Paragraphs */}
            <div className="space-y-3.5 text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              <p>
                Věříme, že Bůh proměňuje životy a přináší skutečnou radost a naději v dnešním světě. Poznáváme ho skrze Ježíše Krista, který nám ukázal, jaký Bůh skutečně je.
              </p>
              <p>
                Víra se nejlépe žije společně, proto tvoříme společenství lidí, kteří se navzájem podporují, sdílejí své příběhy a chtějí ve víře růst.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setActiveTab('contact')}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[#c93838] hover:bg-[#b02e2e] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 duration-150 group"
                id="hero-btn-prijd"
              >
                <span>Přijď mezi nás</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('beliefs')}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-neutral-800 bg-white border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 duration-150"
                id="hero-btn-cemu-verime"
              >
                <span>Čemu věříme</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}


