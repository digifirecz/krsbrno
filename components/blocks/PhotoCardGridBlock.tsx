import SafeImage from '@/components/SafeImage';
import { getIcon } from '@/lib/blocks/icons';
import { getPathForTab } from '@/lib/routes';
import { focalCropStyle } from '@/lib/blocks/photoFocal';
import { getBadgeColorClasses } from '@/lib/blocks/badgeColors';
import { Clock, ChevronRight } from 'lucide-react';
import type { PhotoCardGridData } from '@/lib/blocks/types';

export default function PhotoCardGridBlock({ data, limit }: { data: PhotoCardGridData; limit?: number }) {
  const cards = limit ? (data.cards || []).slice(0, limit) : data.cards || [];

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
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans max-w-2xl mx-auto whitespace-pre-line">
                {data.subheading}
              </p>
            )}
            {data.highlight && (
              <p className="italic font-serif text-sm sm:text-base text-[#c93838] leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {data.highlight}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card, idx) => {
            const Icon = getIcon(card.icon);
            const BadgeIcon = getIcon(card.badgeIcon) || Clock;
            const badgeColors = getBadgeColorClasses(card.badgeColor);
            const href = card.linkLabel && card.linkTarget ? getPathForTab(card.linkTarget) : undefined;
            const CardTag = href ? 'a' : 'div';
            return (
              <CardTag
                key={idx}
                {...(href ? { href } : {})}
                className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#c93838]/30 transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col group"
              >
                {card.photo?.src && (
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                    <SafeImage
                      src={card.photo.src}
                      alt={card.photo.caption || card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      style={focalCropStyle(card.photo)}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {Icon ? (
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center border border-red-100">
                        <Icon className="w-4 h-4" />
                      </div>
                    ) : card.badge ? (
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-xs ${badgeColors.bg} ${badgeColors.text}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{card.badge}</span>
                      </span>
                    ) : null}
                    <h3 className="text-lg font-extrabold text-neutral-900 font-serif group-hover:text-[#c93838] transition-colors">
                      {card.title}
                    </h3>
                    {card.text && (
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                        {card.text}
                      </p>
                    )}
                  </div>
                  {card.linkLabel && href && (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] group-hover:text-[#b02e2e] transition-colors pt-2">
                      <span>{card.linkLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
