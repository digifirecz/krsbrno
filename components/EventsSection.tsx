'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface EventItem {
  id: string;
  dateText: string;
  title: string;
  subtitle: string;
  image: string;
}

const HOMEPAGE_EVENTS: EventItem[] = [
  {
    id: 'kyberdite',
    dateText: '7. 2. 2026',
    title: 'Kyberdítě a jeho sítě',
    subtitle: 'Odolný dospělý, odolné dítě – přednáška a diskuze',
    image: 'https://picsum.photos/seed/kyberdite/600/400'
  },
  {
    id: 'vanocni-besidka',
    dateText: '14. 12. 2025',
    title: 'Vánoční besídka',
    subtitle: 'Divadelní představení dětí, hudba a vánoční atmosféra',
    image: 'https://picsum.photos/seed/vanocnibesidka/600/400'
  },
  {
    id: 'vyrabeni-vencu',
    dateText: '29. 11. 2025',
    title: 'Vyrábění adventních věnců',
    subtitle: 'Tradiční tvoření pro rodiny i jednotlivce s občerstvením',
    image: 'https://picsum.photos/seed/adventnivence/600/400'
  },
  {
    id: 'vecer-chval',
    dateText: '27. 11. 2025',
    title: 'Večer chval - light',
    subtitle: 'Akustická hudba, společné modlitby & prostor ke ztišení',
    image: 'https://picsum.photos/seed/vecerchval/600/400'
  },
  {
    id: 'manzelske-vecery',
    dateText: '15. 1. 2026',
    title: 'Manželské večery',
    subtitle: 'Praktické podněty pro upevnění vztahu v příjemném prostředí',
    image: 'https://picsum.photos/seed/couplesdinner/600/400'
  },
  {
    id: 'biblicky-seminar',
    dateText: '22. 2. 2026',
    title: 'Biblický seminář',
    subtitle: 'Hlubší studium Písma a praktické aplikace do dnešního života',
    image: 'https://picsum.photos/seed/bibleseminar/600/400'
  },
  {
    id: 'velikonocni-bohosluzba',
    dateText: '5. 4. 2026',
    title: 'Velikonoční bohoslužba',
    subtitle: 'Oslava Kristova vzkříšení a naděje pro každého člověka',
    image: 'https://picsum.photos/seed/eastermorning/600/400'
  },
  {
    id: 'mladeznicky-vikend',
    dateText: '18. 3. 2026',
    title: 'Víkendovka mládeže',
    subtitle: 'Společný čas mimo město, hry, rozhovory a hledání víry',
    image: 'https://picsum.photos/seed/youthgathering/600/400'
  },
  {
    id: 'sborovy-den',
    dateText: '14. 6. 2026',
    title: 'Sborový den na zahradě',
    subtitle: 'Grilování, aktivity pro děti a otevřené setkání pro všechny',
    image: 'https://picsum.photos/seed/gardengrill/600/400'
  },
  {
    id: 'spolecny-pust',
    dateText: '10. 1. 2026',
    title: 'Den půstu a modliteb',
    subtitle: 'Společné ztišení a hledání Božího vedení pro nový rok',
    image: 'https://picsum.photos/seed/prayerroom/600/400'
  },
  {
    id: 'detsky-tabor',
    dateText: '12. 7. 2026',
    title: 'Letní dětský tábor',
    subtitle: 'Týden plný dobrodružství, přátelství a biblických příběhů',
    image: 'https://picsum.photos/seed/summercampkid/600/400'
  },
  {
    id: 'konference-zeny',
    dateText: '9. 5. 2026',
    title: 'Setkání a konference žen',
    subtitle: 'Inspirace, vzájemné sdílení a duchovní povzbuzení',
    image: 'https://picsum.photos/seed/womenconf/600/400'
  },
  {
    id: 'muzska-snidane',
    dateText: '21. 3. 2026',
    title: 'Pánská snídaně',
    subtitle: 'Témata ze života mužů, otevřená diskuze a dobrá snídaně',
    image: 'https://picsum.photos/seed/menbreakfast/600/400'
  },
  {
    id: 'evangelizacni-koncert',
    dateText: '25. 4. 2026',
    title: 'Akustický koncert chval',
    subtitle: 'Hudební večer otevřený všem zájemcům z Brna a okolí',
    image: 'https://picsum.photos/seed/acousticconcert/600/400'
  },
  {
    id: 'podzimni-brigada',
    dateText: '17. 10. 2025',
    title: 'Brigáda na Šámalke',
    subtitle: 'Společná péče o sborový dům, zahradu a klubovny',
    image: 'https://picsum.photos/seed/autumnwork/600/400'
  },
  {
    id: 'novorocni-setkani',
    dateText: '1. 1. 2026',
    title: 'Novoroční ztišení',
    subtitle: 'Přivítání nového roku s modlitbou a Božím slovem',
    image: 'https://picsum.photos/seed/newyearhope/600/400'
  }
];

export default function EventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef<number | null>(null);

  // Responsive items count determination
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = HOMEPAGE_EVENTS.length; // 16 items
  const maxIndex = Math.max(0, totalItems - visibleCards);
  const effectiveIndex = Math.min(currentIndex, maxIndex);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // 4 dots navigation (1 dot = 1 row / page of 4 items)
  const totalDots = 4;
  const activeDotIndex = Math.min(Math.round(effectiveIndex / 4), totalDots - 1);

  const handleDotClick = (dotIdx: number) => {
    // Jump by 4 items (1 row)
    const target = Math.min(dotIdx * 4, maxIndex);
    setCurrentIndex(target);
  };

  // Touch Swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      // swipe left -> next
      nextSlide();
    } else if (diff < -45) {
      // swipe right -> prev
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden" id="sec-events">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Události
          </h2>

          <p className="text-base text-neutral-700 font-sans leading-relaxed max-w-2xl mx-auto">
            Pořádáme různé akce během roku – setkání, vyučování, konference i společné aktivity pro rodiny a děti. Jsou otevřené všem, kdo chtějí poznat víru blíž nebo strávit čas ve společenství.
          </p>
        </div>

        {/* Carousel Container with Arrows */}
        <div 
          className="relative px-0 sm:px-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Arrow Button (disappears at start) */}
          {effectiveIndex > 0 && (
            <button
              onClick={prevSlide}
              aria-label="Předchozí událost"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-neutral-200/90 text-neutral-800 flex items-center justify-center shadow-lg hover:bg-neutral-50 hover:text-[#c93838] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Right Arrow Button (disappears at end) */}
          {effectiveIndex < maxIndex && (
            <button
              onClick={nextSlide}
              aria-label="Další událost"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-neutral-200/90 text-neutral-800 flex items-center justify-center shadow-lg hover:bg-neutral-50 hover:text-[#c93838] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Carousel Track Wrapper */}
          <div className="overflow-hidden py-4 -my-4">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(effectiveIndex * 100) / visibleCards}%)`
              }}
            >
              {HOMEPAGE_EVENTS.map((event) => (
                <div 
                  key={event.id}
                  className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                >
                  <div className="h-full rounded-2xl overflow-hidden bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group cursor-pointer">
                    
                    {/* Image banner */}
                    <div className="relative aspect-[16/11] w-full bg-neutral-900 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Title, Date Label Badge & Description */}
                    <div className="p-5 text-left bg-white flex-grow flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#c93838] font-bold text-xs border border-red-100/80 mb-2.5 font-sans w-fit shadow-2xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.dateText}</span>
                        </div>
                        
                        <h3 className="text-base font-bold text-neutral-900 font-serif leading-snug group-hover:text-[#c93838] transition-colors">
                          {event.title}
                        </h3>

                        {event.subtitle && (
                          <p className="text-sm text-neutral-600 pt-2 font-sans line-clamp-2 leading-relaxed">
                            {event.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8 Dots Navigation Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-8">
          {Array.from({ length: totalDots }).map((_, dotIdx) => {
            const isActive = dotIdx === activeDotIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => handleDotClick(dotIdx)}
                aria-label={`Přejít na část ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive 
                    ? 'w-7 h-2.5 bg-[#c93838]' 
                    : 'w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
