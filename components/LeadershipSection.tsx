'use client';

import { 
  Users, 
  Church, 
  HeartHandshake, 
  Sparkles, 
  Home, 
  Globe, 
  Megaphone, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface LeadershipSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function LeadershipSection({ setActiveTab }: LeadershipSectionProps) {
  return (
    <div className="bg-white" id="sec-leadership">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Users className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Kdo nás vede
          </h1>

          <div className="space-y-4 max-w-2xl sm:max-w-3xl mx-auto">
            <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs text-left leading-relaxed">
              Každý věřící je vybaven mnoha dary a povolán ke službě. Každý věřící má dar k budování Církve a ke službě druhým. V našem sboru se jednotliví věřící zapojují do služby dle míry svých obdarování, svých schopností a možností a hlavně dle rozpoznání Božího vedení a autority.
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* 1. Přehled služeb */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                Přehled služeb
              </h2>
              <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto">
                Služba ve sboru je rozdělena do několika klíčových oblastí, kde se věřící aktivně zapojují.
              </p>
            </div>

            {/* Grid of Modern Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              
              {/* Card 1: Provoz bohoslužeb */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <Church className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Provoz bohoslužeb a shromáždění
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Organizace průběhu shromáždění</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Hudební doprovod a vedení zpěvu</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Ozvučení a audio technika</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Příprava hlavního sálu</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Památka Páně */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Přisluhování u Památky Páně
                </h3>
                <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                  Příprava a přisluhování při nedělním lámání chleba a společném vysluhování Památky Páně.
                </p>
              </div>

              {/* Card 3: Výchova dětí a mládeže */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Výchova dětí a mládeže
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Vedení Besídek (děti od 1 do 12 let)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Vedení Dorostu / Poutníci (12 až 17 let)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Vedení Mládeže (mladí lidé od 17 let)</span>
                  </li>
                </ul>
              </div>

              {/* Card 4: Evangelizace */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Evangelizace a misie
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Organizace evangelizačních bohoslužeb</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Duchovní práce ve věznicích</span>
                  </li>
                </ul>
              </div>

              {/* Card 5: Správa & Finance */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Správa domu a finance
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Správa sborového domu a jeho úklid</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Finance – vedení účetnictví</span>
                  </li>
                </ul>
              </div>

              {/* Card 6: Informovanost & Prezentace */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/20 transition-all space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#c93838] flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  Informovanost a prezentace
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Mluvčí sboru a mediální prezentace</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Redakce sborového časopisu & literatura</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Administrace webových stránek</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>Jednání s okolím (statutární orgán)</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* 2. Sborová rada */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/90 text-neutral-900 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold font-serif tracking-tight text-neutral-900">
                    Sborová rada
                  </h2>
                  <p className="text-sm text-neutral-500 font-sans">
                    Pracovní orgán sboru
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold font-sans">
                <span className="px-3 py-1 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-2xs">
                  Nejvýše 15 členů
                </span>
                <span className="px-3 py-1 rounded-full bg-red-50 text-[#c93838] border border-red-100">
                  Současně 12 lidí
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-700 font-sans leading-relaxed">
              Sborová rada se skládá z osob zodpovědných za jednotlivé úseky sborové práce, statutárních zástupců a starších sboru. Sborová rada má nejvýše 15 členů, v současnosti je to 12 lidí. Sborová rada se schází k pracovním poradám zpravidla jedenkrát měsíčně, a to po středečním biblickém shromáždění. Členy Sborové rady mohou být i sestry. Účast ve Sborové radě není vnímána jako funkce, ale je spjata se službou ve sboru. Chceme, aby ti, kteří pracují, také nesli odpovědnost a též mohli o věcech rozhodovat. Sborové radě dává důvěru celý sbor na sejití nazvaném „Shromáždění sboru“.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
