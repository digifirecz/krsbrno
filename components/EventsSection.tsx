'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getArticles } from '@/lib/actions/articles';
import type { Article } from '@/lib/articles';
import { getIcon } from '@/lib/blocks/icons';
import { focalCropStyle } from '@/lib/blocks/photoFocal';
import { eventDateSortKey } from '@/lib/eventDate';

interface EventsSectionProps {
  icon?: string;
  heading?: string;
  description?: string;
  // Podle čeho se seznam řadí — datum konání akce (výchozí), nebo datum
  // přidání článku do administrace. Nastavuje se v editaci bloku, žádný
  // přepínač pro návštěvníky webu.
  sortBy?: 'eventDate' | 'created';
  // Směr řazení — od nejnižší hodnoty (výchozí), nebo od nejvyšší.
  sortDir?: 'asc' | 'desc';
}

const DEFAULT_HEADING = 'Události';
const DEFAULT_DESCRIPTION =
  'Pořádáme různé akce během roku – setkání, vyučování, konference i společné aktivity pro rodiny a děti. Jsou otevřené všem, kdo chtějí poznat víru blíž nebo strávit čas ve společenství.';

export default function EventsSection({ icon, heading, description, sortBy = 'eventDate', sortDir = 'asc' }: EventsSectionProps = {}) {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const HeadingIcon = getIcon(icon) || Sparkles;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    getArticles()
      .then((fetched) => {
        if (active) setArticles(fetched.filter((a) => a.visible));
      })
      .catch(() => {
        if (active) setArticles([]);
      });
    return () => {
      active = false;
    };
  }, []);

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

  // Dokud se články ještě nenačetly (první render), sekci nezobrazovat vůbec.
  // Když se načtou a žádné nejsou, sekce zůstává (nadpis/popis) jen s hláškou
  // místo kolotoče, ať návštěvník ví, že prázdno je záměrné, ne chyba.
  if (!articles) return null;
  const hasArticles = articles.length > 0;

  // Datum akce = chybějící/nerozpoznané datum vždy až na konec bez ohledu na
  // směr, ať netříští řazení zbytku. Datum přidání = pořadí z getArticles().
  const dir = sortDir === 'desc' ? -1 : 1;
  const sortedArticles =
    sortBy === 'created'
      ? sortDir === 'desc'
        ? [...articles].reverse()
        : articles
      : [...articles].sort((a, b) => {
          const da = eventDateSortKey(a.dateText)?.getTime() ?? null;
          const db = eventDateSortKey(b.dateText)?.getTime() ?? null;
          if (da === null && db === null) return 0;
          if (da === null) return 1;
          if (db === null) return -1;
          return (da - db) * dir;
        });

  const totalItems = sortedArticles.length;
  const maxIndex = Math.max(0, totalItems - visibleCards);
  const effectiveIndex = Math.min(currentIndex, maxIndex);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Dots navigation (1 dot = 1 row / page of `visibleCards` items)
  const totalDots = Math.max(1, Math.ceil(totalItems / visibleCards));
  const activeDotIndex = Math.min(Math.round(effectiveIndex / visibleCards), totalDots - 1);

  const handleDotClick = (dotIdx: number) => {
    const target = Math.min(dotIdx * visibleCards, maxIndex);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <HeadingIcon className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif tracking-tight">
            {heading || DEFAULT_HEADING}
          </h2>

          <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed max-w-2xl mx-auto">
            {description || DEFAULT_DESCRIPTION}
          </p>
        </div>

        {!hasArticles && (
          <div className="text-center max-w-md mx-auto py-6 px-6 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <p className="text-sm text-neutral-500 font-sans">
              Momentálně není žádná událost k dispozici.
            </p>
          </div>
        )}

        {/* Carousel Container with Arrows */}
        {hasArticles && (
        <>
        <div
          className="relative"
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
              {sortedArticles.map((article) => (
                <div
                  key={article.id}
                  className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                >
                  <Link
                    href={`/clanek/${article.id}`}
                    className="h-full rounded-2xl overflow-hidden bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group cursor-pointer"
                  >

                    {/* Image banner */}
                    {article.image && (
                      <div className="relative aspect-[16/11] w-full bg-neutral-900 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          style={focalCropStyle({ src: article.image, focalX: article.focalX, focalY: article.focalY, zoom: article.zoom })}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Title, Date Label Badge & Description */}
                    <div className="p-5 text-left bg-white flex-grow flex flex-col justify-between">
                      <div>
                        {article.dateText && (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#c93838] font-bold text-xs border border-red-100/80 mb-2.5 font-sans w-fit shadow-2xs">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{article.dateText}</span>
                          </div>
                        )}

                        <h3 className="text-base font-bold text-neutral-900 font-serif leading-snug group-hover:text-[#c93838] transition-colors">
                          {article.title}
                        </h3>

                        {article.subtitle && (
                          <div
                            className="text-sm text-neutral-600 pt-2 font-sans line-clamp-2 leading-relaxed [&_a]:text-[#c93838] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
                            dangerouslySetInnerHTML={{ __html: article.subtitle }}
                          />
                        )}
                      </div>

                      <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] pt-3">
                        <span>Zjistit více</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Navigation Indicator */}
        {totalDots > 1 && (
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
        )}
        </>
        )}

      </div>
    </section>
  );
}
