import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import type { PageHeroData } from '@/lib/blocks/types';

export default function PageHeroBlock({ data }: { data: PageHeroData }) {
  const Icon = getIcon(data.icon);
  const photos = (data.photos || []).filter((p) => p.src);

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
              <Icon className="w-6 h-6" />
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            {data.title}
          </h1>

          {(data.description || data.highlight) && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {data.description && (
                <p className="text-sm text-neutral-700 font-sans leading-relaxed whitespace-pre-line">
                  {data.description}
                </p>
              )}
              {data.highlight && (
                <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs whitespace-pre-line">
                  {data.highlight}
                </div>
              )}
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 max-w-3xl mx-auto">
            {photos.map((photo, idx) => (
              <ImageCard key={idx} src={photo.src} alt={photo.caption || ''} caption={photo.caption} aspectRatio="aspect-[4/3]" fixedWidth={false} focalX={photo.focalX} focalY={photo.focalY} zoom={photo.zoom} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
