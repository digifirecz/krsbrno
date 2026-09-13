import { getIcon } from '@/lib/blocks/icons';
import type { BadgeCardData } from '@/lib/blocks/types';

export default function BadgeCardBlock({ data }: { data: BadgeCardData }) {
  const Icon = getIcon(data.icon);
  const badges = data.badges || [];

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/90 space-y-6 shadow-2xs">
          {(Icon || data.heading || data.subheading || badges.length > 0) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
              {(Icon || data.heading || data.subheading) && (
                <div className="flex items-center space-x-3">
                  {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    {data.heading && (
                      <h2 className="text-2xl font-extrabold font-serif tracking-tight text-neutral-900">
                        {data.heading}
                      </h2>
                    )}
                    {data.subheading && (
                      <p className="text-sm text-neutral-500 font-sans">{data.subheading}</p>
                    )}
                  </div>
                </div>
              )}

              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs font-semibold font-sans">
                  {badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={
                        badge.highlight
                          ? 'px-3 py-1 rounded-full bg-red-50 text-[#c93838] border border-red-100'
                          : 'px-3 py-1 rounded-full bg-white text-neutral-700 border border-neutral-200 shadow-2xs'
                      }
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {data.text && (
            <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed whitespace-pre-line">
              {data.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
