'use client';

import ImageCard from '@/components/ImageCard';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Search, 
  Printer, 
  BookMarked, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  HeartHandshake, 
  Users, 
  Bookmark,
  FileText,
  Library,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

export default function LibraryDen() {
  return (
    <div className="border-b border-neutral-200/60" id="sec-library">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Knihovna DEN
          </h1>

          <p className="text-sm text-neutral-700 leading-relaxed font-sans max-w-3xl mx-auto">
            Knihovna DEN je otevřené místo pro každého, kdo má rád knihy, chce se vzdělávat nebo hledá odpovědi na otázky o víře, životě a vztazích. Nachází se přímo v našem sboru a již od roku 2006 slouží jako půjčovna knih a místo pro klid či společná setkání.
          </p>

        </div>
      </section>

      {/* 2. OPENING HOURS & ABOUT */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            {/* Left: Image with caption */}
            <div className="space-y-3">
              <ImageCard
                src="https://picsum.photos/seed/libraryden1/800/600"
                alt="Knihovna DEN regály s knihami"
                aspectRatio="aspect-[4/3]"
                caption="Příjemné prostředí s rozsáhlým knižním fondem"
              />
            </div>

            {/* Right: Opening Hours Card & Intro */}
            <div className="space-y-6">
              
              {/* Otevírací doba Box */}
              <div className="bg-gradient-to-br from-red-50/70 via-neutral-50 to-white p-6 sm:p-7 rounded-2xl border border-red-100/90 shadow-2xs space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 font-serif">
                      Kdy je otevřená
                    </h2>
                    <p className="text-xs text-neutral-500 font-sans">
                      Pravidelné výpůjční hodiny
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 space-y-1 shadow-2xs">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans block">Středa</span>
                    <span className="text-base font-extrabold text-[#c93838] font-sans block">18:00 – 19:00</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 space-y-1 shadow-2xs">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans block">Neděle</span>
                    <span className="text-base font-extrabold text-[#c93838] font-sans block">10:00 – 12:00</span>
                  </div>
                </div>
              </div>

              {/* Informační odstavec */}
              <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <p>
                  V knihovně najdete především knihy s křesťanskou tematikou, ale také mnoho dalších titulů, které se dotýkají běžného života, rozvoje osobnosti a budování zdravých vztahů.
                </p>
                <p className="font-semibold text-neutral-900">
                  Každý si zde může najít něco, co ho obohatí, povzbudí nebo inspirovat k dalšímu studiu.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. CO V NÍ NAJDETE (CATEGORIES GRID) */}
      <section className="py-14 sm:py-18 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
              <BookMarked className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Co v knihovně najdete
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
              Široká nabídka žánrů pro dospělé, mládež i nejmenší čtenáře
            </p>
          </div>

          {/* 5 Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 space-y-2 shadow-2xs hover:shadow-md hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Knihy o Bibli a víře
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Biblické komentáře, výkladové publikace, duchovní zamýšlení a teologická literatura.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 space-y-2 shadow-2xs hover:shadow-md hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Historie a smysl života
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Historické publikace, příběhy víry, svědectví a zamyšlení nad základními otázkami lidství.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 space-y-2 shadow-2xs hover:shadow-md hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center mb-3">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Vztahy, psychologie & výchova
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Praktická literatura pro manželství, komunikaci, rodinu, psychologii a výchovu dětí.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 space-y-2 shadow-2xs hover:shadow-md hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Beletrie pro dospělé
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Inspirativní romány, životní příběhy a kvalitní česká i zahraniční beletrie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 space-y-2 shadow-2xs hover:shadow-md hover:-translate-y-0.5 sm:col-span-2 md:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 font-serif">
                Knihy pro děti a mládež
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Ilustrované dětské Bible, dobrodružné knihy, komiksy a četba pro dospívající.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. JAK JI MŮŽETE VYUŽÍT & REGISTRACE */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            
            {/* Left: Services List */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#c93838] uppercase tracking-wider font-sans">
                  Služby návštěvníkům
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                  Jak ji můžete využít
                </h2>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-900">Studium na místě</div>
                    <div className="text-neutral-600 text-xs">Možnost číst a studovat knihy v klidném prostředí přímo v knihovně.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-900">Výpůjčky domů</div>
                    <div className="text-neutral-600 text-xs">Možnost půjčit si oblíbené knihy domů na určenou dobu.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-900">Doporučení & Vyhledávání</div>
                    <div className="text-neutral-600 text-xs">Osobní pomoc s výběrem knih nebo vyhledáním konkrétních informací.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-900">Tisk & Kopírování</div>
                    <div className="text-neutral-600 text-xs">Příležitostné kopírování a tisk potřebných materiálů.</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-900">Společenská setkání</div>
                    <div className="text-neutral-600 text-xs">Vzdělávací a komunitní setkání nad knihami a tématy.</div>
                  </div>
                </div>

              </div>

              {/* Registrace box */}
              <div className="bg-red-50/70 border border-red-100 p-4 rounded-xl space-y-1 font-sans">
                <div className="flex items-center space-x-2 text-[#c93838] font-bold text-sm">
                  <Bookmark className="w-4 h-4" />
                  <span>Registrace čtenáře</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Pokud si plánuješ knihy půjčit domů, je potřeba se zaregistrovat. Registrace je velmi jednoduchá a platí na jeden rok.
                </p>
              </div>

            </div>

            {/* Right: Image */}
            <div className="space-y-3">
              <ImageCard
                src="https://picsum.photos/seed/libraryden2/800/600"
                alt="Knihovna DEN studijní stůl"
                aspectRatio="aspect-[4/3]"
                caption="Klidné prostředí pro četbu, práci i rozhovory"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. OFICIÁLNÍ WEB & KATALOG CTA */}
      <section className="py-14 sm:py-18 bg-neutral-50/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-sm relative overflow-hidden group hover:border-[#c93838]/30 transition-all duration-300">
            
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform duration-300">
              <Library className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
                Online katalog Knihovny DEN
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                Podrobné informace o rejstříku knih, vyhledávání v katalogu, půjčovacím řádu a dalších pravidlech najdeš na oficiálním webu Knihovny DEN.
              </p>
            </div>

            <div>
              <a
                href="https://knihovnaden.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Navštívit knihovnaden.cz</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

