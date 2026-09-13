'use client';

import { useState } from 'react';
import SafeImage from '@/components/SafeImage';
import { focalCropStyle } from '@/lib/blocks/photoFocal';
import { Calendar, ChevronDown } from 'lucide-react';
import type { TimelineData } from '@/lib/blocks/types';

export default function TimelineBlock({ data }: { data: TimelineData }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const items = data.items || [];

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.subheading) && (
          <div className="text-center max-w-2xl mx-auto space-y-2">
            {data.heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-sm text-neutral-500 font-sans max-w-xl mx-auto">
                {data.subheading}
              </p>
            )}
          </div>
        )}

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#c93838]/20 via-[#c93838] to-[#c93838]/20" />
          <div className="block md:hidden absolute left-4 top-3 bottom-3 w-0.5 bg-neutral-200" />

          <div className="space-y-4 sm:space-y-5">
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const isExpanded = expandedIndex === idx;

              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-center">
                  <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${isEven ? 'md:order-2 md:pl-8 md:pr-0' : 'md:order-1 md:pr-8 md:pl-0'}`}>
                    <div
                      onClick={() => toggleExpand(idx)}
                      className={`bg-neutral-50/90 rounded-2xl border transition-all duration-200 cursor-pointer select-none group overflow-hidden ${
                        isExpanded
                          ? 'border-[#c93838] bg-white shadow-md ring-1 ring-[#c93838]/20'
                          : 'border-neutral-200/80 hover:border-[#c93838]/40 hover:bg-white shadow-2xs'
                      }`}
                    >
                      {item.photo?.src && (
                        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-100">
                          <SafeImage
                            src={item.photo.src}
                            alt={item.photo.caption || item.title}
                            fill
                            className="object-cover"
                            style={focalCropStyle(item.photo)}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#c93838] text-white font-extrabold text-xs tracking-wider shadow-2xs font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{item.year}</span>
                          </span>
                          <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? 'bg-red-50 text-[#c93838] rotate-180' : 'text-neutral-400 group-hover:text-neutral-700'}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-neutral-900 font-serif mt-2 group-hover:text-[#c93838] transition-colors">
                          {item.title}
                        </h3>

                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            {item.text && (
                              <div className="mt-2.5 pt-2.5 border-t border-neutral-100 text-sm sm:text-base text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                                {item.text}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white transition-all shadow-2xs ${isExpanded ? 'bg-[#c93838] ring-3 ring-red-100 scale-110' : 'bg-neutral-300'}`} />
                  </div>

                  <div className={`hidden md:block w-1/2 ${isEven ? 'md:order-1' : 'md:order-2'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
