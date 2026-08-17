'use client';

import { ShieldCheck, ExternalLink, Users, BookOpen, Heart, Building, CheckCircle2, UserCheck } from 'lucide-react';

interface ManagementSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function ManagementSection({ setActiveTab }: ManagementSectionProps) {
  const elders = [
    'Aleš Drbal',
    'Petr Jahůdka',
    'Miloš Kašparec',
    'Petr Libánský ml.',
    'Jakub Lofítek',
    'Miloš Rauš',
    'Rostislav Zeman',
  ];

  return (
    <div className="bg-white" id="sec-management">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Building className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Kdo spravuje sbor
          </h1>

          <div className="space-y-4 max-w-2xl sm:max-w-3xl mx-auto">
            <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs text-left leading-relaxed">
              Sbor je z hlediska vystupování v občanské společnosti právnickou osobou evidovanou u Ministerstva kultury podle zákona o církvích (
              <a 
                href="https://mk.gov.cz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#c93838] hover:underline font-medium inline-flex items-center space-x-0.5"
              >
                <span>Výpis z rejstříku MK</span>
                <ExternalLink className="w-3 h-3 ml-0.5 inline" />
              </a>
              ) a je součástí společenství sborů sdružených v Křesťanských sborech. Nejsme závislí na státní podpoře a nepobíráme od státu žádné dotace.
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Principles Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-serif text-neutral-900">
                Nejvyšší autorita
              </h2>
              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Hlavou Církve a její nejvyšší autoritou je Ježíš Kristus. Naše víra a poznání vychází výhradně z Bible, která je Bohem zjeveným Slovem, daným člověku a Církvi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-serif text-neutral-900">
                Vedení sboru
              </h2>
              <p className="text-sm text-neutral-600 font-sans leading-relaxed">
                Podle Nového zákona je každý místní sbor podřízen Bohem danému vedení. Duchovní odpovědnost za sbor a jeho vedení je svěřena starším sboru – bratrům povolaným Bohem, přijatým sborem a závislým na Kristově autoritě.
              </p>
            </div>
          </div>

          {/* Two Columns: Duties & Elders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 pt-4 border-t border-neutral-200/80">
            
            {/* Left Column: Úkolem starších */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold font-serif text-neutral-900">
                  Úkolem starších zejména je
                </h2>
              </div>

              <ul className="space-y-3 text-sm text-neutral-700 font-sans">
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c93838] mt-2 shrink-0" />
                  <span>Vedení sboru a odpovědnost za něj před Bohem i před státem</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c93838] mt-2 shrink-0" />
                  <span>Duchovní vyučování</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c93838] mt-2 shrink-0" />
                  <span>Péče o sbor i o jednotlivé věřící</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c93838] mt-2 shrink-0" />
                  <span>Modlitební stráž</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Sedm bratrů */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-serif text-neutral-900">
                    Služba starších sboru
                  </h2>
                  <p className="text-sm text-neutral-500 font-sans">V současnosti koná službu těchto 7 bratrů:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-sans">
                {elders.map((elder, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-100/80 text-[#c93838] font-bold text-xs flex items-center justify-center shrink-0">
                      {elder.split(' ')[0][0]}
                    </div>
                    <span className="font-medium text-neutral-800">{elder}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
