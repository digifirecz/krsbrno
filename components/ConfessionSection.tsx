'use client';

import { 
  BookMarked, 
  Sun, 
  Heart, 
  Flame, 
  Church, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface ConfessionSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function ConfessionSection({ setActiveTab }: ConfessionSectionProps) {
  const confessionPoints = [
    {
      title: 'Věříme, že Bůh',
      icon: Sun,
      items: [
        'je jediný Vládce celého vesmíru a je duchovní Bytost',
        'je svatý a dokonalý, stálý, neměnný a věčný',
        'má tři podstaty – Bůh Otec, Bůh Syn a Bůh Duch Svatý',
        'stvořil celý svět, celou přírodu a také člověka',
        'nesnáší hřích',
        'miluje hříšníka a touží po osobním vztahu s člověkem',
      ],
    },
    {
      title: 'Věříme, že Ježíš Kristus',
      icon: Heart,
      items: [
        'je Boží Syn se všemi charakteristikami Pána Boha',
        'byl počat z Ducha svatého a narodil se z panny',
        'byl a je Bůh, ale byl i člověk se základními znaky člověka',
        'na Zemi žil dokonalý život bez hříchu',
        'třetí den po ukřižování ho Bůh Otec vzkřísil z mrtvých',
        'byl poslán Bohem Otcem na Zem v lidském těle, aby zemřel za hříšné lidi; skrze tuto oběť mohou lidé získat odpuštění a být přijati mezi Boží lid',
        'svojí obětí očišťuje před Bohem od hříchu ty, kteří v Něj věří',
        'jednou si přijde pro svou Církev a vezme ji k sobě',
        'je jediná cesta k Bohu Otci',
      ],
    },
    {
      title: 'Věříme, že Duch svatý',
      icon: Flame,
      items: [
        'je osobou',
        'dává schopnost porozumět Božímu Slovu',
        'dává duchovní dary věřícím lidem',
        'prostřednictvím věřících lidí promlouvá k světu a usvědčuje jej z hříchu',
        'inspiroval a vedl pisatele k sepsání Bible',
      ],
    },
    {
      title: 'Věříme, že Církev',
      icon: Church,
      items: [
        'patří Bohu, který je její hlavou',
        'není dílem lidské organizace',
        'přijímá členy na základě osobní víry v oběť Ježíše Krista',
        'čeká na druhý příchod Ježíše Krista',
      ],
    },
    {
      title: 'Věříme, že Bible',
      icon: BookOpen,
      items: [
        'je Božím Slovem',
        'je nezměnitelná, nezaměnitelná a neomylná kniha',
        'je soubor knih Starého a Nového zákona, který je úplný a nelze k němu nic dalšího dodávat',
        'obsahuje pravidla pro život Božího lidu, plán spasení i nástin naší budoucnosti',
      ],
    },
  ];

  return (
    <div className="bg-white" id="sec-confession">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Naše vyznání
          </h1>

          <p className="text-sm text-neutral-700 font-sans max-w-3xl mx-auto leading-relaxed">
            Představení teologických základů a věroučných článků našeho sboru. Toto vyznání vyjadřuje naše poznání Božího slova a křesťanské doktríny.
          </p>
        </div>
      </section>

      {/* Main Confession Cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {confessionPoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 sm:p-7 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 hover:border-red-200 hover:bg-red-50/10 transition-all shadow-2xs space-y-4 ${
                    idx === 1 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-neutral-200/70">
                    <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900">
                      {point.title}
                    </h2>
                  </div>

                  <ul className={`space-y-2.5 text-sm text-neutral-700 font-sans ${
                    idx === 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 space-y-0' : ''
                  }`}>
                    {point.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
