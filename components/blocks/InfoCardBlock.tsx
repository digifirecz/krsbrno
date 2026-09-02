import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import { MapPin } from 'lucide-react';
import type { InfoCardData } from '@/lib/blocks/types';

export default function InfoCardBlock({ data }: { data: InfoCardData }) {
  const BadgeIcon = getIcon(data.badgeIcon);

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-neutral-200/90 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center shadow-xs">
          <div className="space-y-4">
            {data.badgeText && (
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#c93838] bg-red-50 px-3 py-1 rounded-md border border-red-100 font-sans">
                {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                <span>{data.badgeText}</span>
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 leading-snug">
              {data.title}
            </h2>

            {data.text && (
              <p className="text-sm text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                {data.text}
              </p>
            )}

            {data.addressLine && (
              <div className="pt-1 flex items-center space-x-2 text-xs font-bold text-neutral-800 font-sans">
                <MapPin className="w-4 h-4 text-[#c93838] shrink-0" />
                <span>{data.addressLine}</span>
              </div>
            )}
          </div>

          {data.photo?.src && (
            <ImageCard src={data.photo.src} alt={data.photo.caption || ''} caption={data.photo.caption} focalX={data.photo.focalX} focalY={data.photo.focalY} zoom={data.photo.zoom} />
          )}
        </div>
      </div>
    </section>
  );
}
