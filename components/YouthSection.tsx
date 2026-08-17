'use client';

import ImageCard from '@/components/ImageCard';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Heart, 
  Users, 
  Compass, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface YouthSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function YouthSection({ setActiveTab }: YouthSectionProps) {
  return (
    <div className="bg-white" id="sec-youth">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Users className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Mládež – Elevate
          </h1>

          <p className="text-sm text-neutral-700 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Prostor pro přátelství, zábavu, hlubší témata i objevování toho, co pro náš život znamená víra v Boha.
          </p>
        </div>
      </section>

      {/* 1. SETKÁVÁNÍ */}
      <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="lg:col-span-7 space-y-5 font-sans text-neutral-700 leading-relaxed text-sm sm:text-base">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Setkávání
              </h2>

              <p className="font-bold text-neutral-900">
                Život je lepší, když máme přátele, se kterými se sdílíme a navzájem si pomáháme. Proto tvoříme skupinu mladých lidí ve věku od 15 do 30 let.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm">
                Věříme, že Ježíš Kristus má nabízí našemu životu skutečný smysl a hodnotu. Setkáváme se, abychom objevovali, jak tato víra dokáže přinést pravou radost do našeho života.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm">
                Kromě toho hrajeme zábavné aktivity, zpíváme, povídáme si a podporujeme se. Ať o víře teprve přemýšlíš nebo už máš nějaký základ – každý tu má místo a prostor růst tak, jak potřebuje.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm">
                Taky děláme neformální akce – jsou to setkání, kde si užijeme společný čas. Žádný velký program, jen dobrá parta a pohodová atmosféra. Může to být výlet, přesespávačka, minigolf, bowling, kulečník nebo třeba večer plný deskových her.
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center space-x-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-[#c93838] font-extrabold text-xs sm:text-sm font-sans">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Scházíme se každý čtvrtek v 18:00.</span>
                </div>
              </div>

            </div>

            {/* Right: 2 Photos */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <ImageCard
                src="https://picsum.photos/seed/elevate-garden1/600/800"
                alt="Setkání mládeže na zahradě sboru u stolu"
                aspectRatio="aspect-[3/4]"
                caption="Společný čas v létě na zahradě"
              />
              <ImageCard
                src="https://picsum.photos/seed/elevate-indoor1/600/800"
                alt="Pohodový večer s mládeží v klubovně"
                aspectRatio="aspect-[3/4]"
                caption="Čtvrteční setkání v klubovně"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. VÍKENDOVKY A POBYTY */}
      <section className="py-14 sm:py-20 bg-neutral-50/80 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left: 2 Photos */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-1">
              <ImageCard
                src="https://picsum.photos/seed/elevate-stay1/600/800"
                alt="Skupinový rozhovor u stolu v chatě"
                aspectRatio="aspect-[3/4]"
                caption="Společné stolování na víkendovce"
              />
              <ImageCard
                src="https://picsum.photos/seed/elevate-volleyball/600/800"
                alt="Sport a volejbal v přírodě na letním pobytu"
                aspectRatio="aspect-[3/4]"
                caption="Volejbal v přírodě"
              />
            </div>

            {/* Right: Text Content */}
            <div className="lg:col-span-7 space-y-5 font-sans text-neutral-700 leading-relaxed text-sm sm:text-base order-1 lg:order-2">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Víkendovky a pobyty
              </h2>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Tyto akce jsou skvělé v tom, že máme čas být spolu a zažít věci, na které v běžném týdnu nezbývá prostor. Hrajeme deskové nebo sportovní hry, jdeme na procházku v přírodě nebo jen chillujeme. Díky tomu mohou růst naše vztahy a vznikat skvělé zážitky.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Necháváme prostor i víře – krátká zamyšlení, modlitby a hluboké rozhovory často otevřou diskuze, které nám pomáhají růst a přiblížit se k Bohu. Je to prostor k tomu, se zastavit a slyšet, co nám Bůh chce říct.
              </p>

              <p className="font-bold text-neutral-900 text-xs sm:text-sm">
                Kombinace odpočinku, přátelství, zábavy a duchovního načerpání dělá tyhle pobyty výjimečnými.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm italic">
                Pořádáme jarní víkendovky, letní pobyty a podzimní víkendovky.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* 3. PŘIDEJ SE & KALENDÁŘ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Left: Info & Contact Buttons */}
            <div className="lg:col-span-6 space-y-5 font-sans text-neutral-700">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Přidej se
              </h2>

              <p className="font-bold text-neutral-900 text-sm sm:text-base">
                Pokud zvažuješ, jestli přijít na mládež – zkus to.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Nemusíš se na nic připravovat, stačí jen udělat krok vpřed. Přijdeš, podíváš se, poznáš nás a sám uvidíš, jaká je u nás atmosféra. Ať už přijdeš kdykoliv, vždy se najde někdo, kdo tě přivítá a vtáhne do dění.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Určitě nezapomeň kouknout na naše sociální sítě, kde nejen zachycujeme naše společné okamžiky, ale dáváme i všechny aktuality a přihlášky.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Pokud máš jakékoliv otázky, klidně nám napiš na mail nebo do zpráv. Rádi tě poznáme a vše ti zodpovíme.
              </p>

              {/* 3 Social/Contact Buttons */}
              <div className="pt-3 flex flex-wrap gap-2.5">
                <a
                  href="https://instagram.com/elevate_brno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs font-sans transition-all cursor-pointer shadow-2xs"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>elevate_brno</span>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs font-sans transition-all cursor-pointer shadow-2xs"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Mládež Elevate Brno</span>
                </a>

                <a
                  href="mailto:elevate@krsbrno.cz"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs font-sans transition-all cursor-pointer shadow-2xs"
                >
                  <Mail className="w-4 h-4 text-[#c93838]" />
                  <span>elevate@krsbrno.cz</span>
                </a>
              </div>

            </div>

            {/* Right: Calendar Section */}
            <div className="lg:col-span-6 space-y-3 font-sans">
              <p className="text-xs sm:text-sm text-neutral-600 font-medium text-right sm:text-left lg:text-right">
                Můžeš si přidat náš kalendář, ať ti nic neunikne.
              </p>

              {/* Styled Google Calendar Container */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-[#c93838]" />
                    <span className="text-xs font-extrabold text-neutral-900 font-sans">
                      Kalendář akcí Mládeže – Elevate Brno
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Čtvrtky 18:00
                  </span>
                </div>

                <div className="w-full h-80 sm:h-96 rounded-xl border border-neutral-200 overflow-hidden relative bg-neutral-50">
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FPrague&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=MONTH&src=ZWxldmF0ZUBrcnNicm5vLmN6&color=%23c93838" 
                    style={{ border: 0 }} 
                    width="100%" 
                    height="100%" 
                    title="Mládež Elevate Brno Kalendář"
                  ></iframe>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
