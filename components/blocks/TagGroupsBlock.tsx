import { getIcon } from '@/lib/blocks/icons';
import type { TagGroupsData } from '@/lib/blocks/types';

export default function TagGroupsBlock({ data }: { data: TagGroupsData }) {
  const Icon = getIcon(data.icon);
  const groups = data.groups || [];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.subheading) && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
            )}
            {data.heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
                {data.subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {groups.map((group, idx) => (
            <div key={idx} className="bg-neutral-50/80 p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5">
              <h3 className="text-xl font-extrabold text-neutral-900 font-serif text-center pb-1 border-b border-neutral-200/80">
                {group.heading}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                {(group.tags || []).map((tag, tagIdx) => (
                  <div key={tagIdx} className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
