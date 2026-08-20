import Image from 'next/image';
import { getIcon } from '@/lib/blocks/icons';
import { getPathForTab } from '@/lib/routes';
import { Clock, ChevronRight } from 'lucide-react';
import type { PhotoCardGridData } from '@/lib/blocks/types';

export default function PhotoCardGridBlock({ data }: { data: PhotoCardGridData }) {
  const cards = data.cards || [];

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.subheading || data.highlight) && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {data.heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-sm text-neutral-600 leading-relaxed font-sans max-w-2xl mx-auto whitespace-pre-line">
                {data.subheading}
              </p>
            )}
            {data.highlight && (
              <div className="inline-block bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs whitespace-pre-line">
                {data.highlight}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = getIcon(card.icon);
            return (
              <div key={idx} className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col group">
                {card.photo && (
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={card.photo.src}
                      alt={card.photo.caption || card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {Icon && (
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center border border-red-100">
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      {card.badge && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-100/80 text-[#c93838] font-bold text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{card.badge}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                      {card.title}
                    </h3>
                    {card.text && (
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                        {card.text}
                      </p>
                    )}
                  </div>
                  {card.linkLabel && card.linkTarget && (
                    <a
                      href={getPathForTab(card.linkTarget)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] hover:text-[#b02e2e] transition-colors pt-2 cursor-pointer"
                    >
                      <span>{card.linkLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
