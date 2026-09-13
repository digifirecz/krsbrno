import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import { getPathForTab } from '@/lib/routes';
import type { CtaBlockData } from '@/lib/blocks/types';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function CtaBlock({ data }: { data: CtaBlockData }) {
  const Icon = getIcon(data.icon);
  const href = data.buttonUrl || (data.buttonTarget ? getPathForTab(data.buttonTarget) : undefined);
  const isExternal = !!data.buttonUrl;
  const photos = (data.photos || []).filter((p) => p.src);

  const button = data.buttonLabel && href && (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
    >
      <span>{data.buttonLabel}</span>
      {isExternal ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
    </a>
  );

  // S fotkami: text nalevo, fotky napravo — vizuální pauza mezi jinak vždy
  // vystředěnými bloky. Bez fotek zůstává původní vystředěná karta.
  if (photos.length > 0) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-neutral-200/90 shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:items-stretch">
            <div className="order-2 lg:order-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
              {Icon && (
                <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-[#c93838] border border-red-200/60 flex items-center justify-center shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
                  {data.title}
                </h3>

                {data.text && (
                  <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed whitespace-pre-line">
                    {data.text}
                  </p>
                )}

                {data.highlight && (
                  <p className="italic font-serif text-sm sm:text-base text-[#c93838] leading-relaxed whitespace-pre-line">
                    {data.highlight}
                  </p>
                )}
              </div>

              {button && <div className="pt-2">{button}</div>}
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4 bg-neutral-50">
              {photos.map((photo, idx) => (
                <ImageCard key={idx} src={photo.src} alt={photo.caption || ''} caption={photo.caption} aspectRatio="aspect-[4/3]" fixedWidth={false} focalX={photo.focalX} focalY={photo.focalY} zoom={photo.zoom} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-5 shadow-2xs relative overflow-hidden group hover:border-red-200 transition-all">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-red-100/80 text-[#c93838] border border-red-200/60 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-neutral-900">
              {data.title}
            </h3>

            {data.text && (
              <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {data.text}
              </p>
            )}

            {data.highlight && (
              <p className="italic font-serif text-sm sm:text-base text-[#c93838] leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                {data.highlight}
              </p>
            )}
          </div>

          {button && <div className="pt-2">{button}</div>}
        </div>
      </div>
    </section>
  );
}
