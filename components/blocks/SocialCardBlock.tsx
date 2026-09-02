import { getIcon } from '@/lib/blocks/icons';
import ImageCard from '@/components/ImageCard';
import EmbedContent from '@/components/blocks/EmbedContent';
import type { SocialCardData } from '@/lib/blocks/types';

const ASPECT_CLASSES = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
};

export default function SocialCardBlock({ data }: { data: SocialCardData }) {
  const links = data.links || [];
  const aspectClass = ASPECT_CLASSES[data.photoAspectRatio || 'square'];

  const content = (
    <div className="space-y-5 font-sans text-neutral-700">
      {data.heading && (
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
          {data.heading}
        </h2>
      )}

      {data.text && (
        <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
          {data.text}
        </p>
      )}

      {links.length > 0 && (
        <div className="pt-3 flex flex-wrap gap-2.5">
          {links.map((link, idx) => {
            const Icon = getIcon(link.icon);
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs font-sans transition-all cursor-pointer shadow-2xs"
              >
                {Icon && <Icon className="w-4 h-4 text-[#c93838]" />}
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );

  const side = data.embed ? <EmbedContent data={data.embed} /> : data.photo ? (
    <ImageCard src={data.photo.src} alt={data.photo.caption || ''} aspectRatio={aspectClass} fixedWidth caption={data.photo.caption} focalX={data.photo.focalX} focalY={data.photo.focalY} />
  ) : null;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {side ? (
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 ${data.embed ? 'items-start' : 'items-center'}`}>
            <div className="lg:col-span-6">{content}</div>
            <div className="lg:col-span-6">{side}</div>
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
