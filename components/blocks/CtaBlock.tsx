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

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
              <p className="text-sm text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {data.text}
              </p>
            )}

            {data.highlight && (
              <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-4 py-2.5 text-sm text-neutral-700 font-sans shadow-2xs max-w-xl mx-auto whitespace-pre-line">
                {data.highlight}
              </div>
            )}
          </div>

          {data.buttonLabel && href && (
            <div className="pt-2">
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#c93838] hover:bg-[#b02e2e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{data.buttonLabel}</span>
                {isExternal ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4 max-w-3xl mx-auto">
            {photos.map((photo, idx) => (
              <ImageCard key={idx} src={photo.src} alt={photo.caption || ''} caption={photo.caption} aspectRatio="aspect-[4/3]" fixedWidth={false} focalX={photo.focalX} focalY={photo.focalY} zoom={photo.zoom} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
