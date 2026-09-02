import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import { CheckCircle2 } from 'lucide-react';
import type { IconGridData } from '@/lib/blocks/types';

export default function IconGridBlock({ data }: { data: IconGridData }) {
  const cols = data.cards.length > 4 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';
  const photos = (data.photos || []).filter((p) => p.src);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.subheading) && (
          <div className="text-center space-y-2">
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

        <div className={`grid grid-cols-1 ${cols} gap-5 sm:gap-6`}>
          {data.cards.map((card, idx) => {
            const Icon = getIcon(card.icon);
            return (
              <div key={idx} className="bg-neutral-50/60 p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 hover:border-red-200 transition-colors">
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <h3 className="text-base font-bold text-neutral-900 font-serif">
                  {card.title}
                </h3>
                {card.text && (
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                    {card.text}
                  </p>
                )}
                {card.items && card.items.length > 0 && (
                  <ul className="space-y-2 text-sm text-neutral-600 font-sans">
                    {card.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
            {photos.map((photo, idx) => (
              <ImageCard key={idx} src={photo.src} alt={photo.caption || ''} caption={photo.caption} aspectRatio="aspect-[4/3]" fixedWidth={false} focalX={photo.focalX} focalY={photo.focalY} zoom={photo.zoom} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
