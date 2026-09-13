import { getIcon } from '@/lib/blocks/icons';
import type { ListCardData } from '@/lib/blocks/types';

export default function ListCardBlock({ data }: { data: ListCardData }) {
  const Icon = getIcon(data.icon);
  const items = data.items || [];

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
          {(Icon || data.heading || data.subheading) && (
            <div className="flex items-center space-x-2.5 pb-2 border-b border-neutral-100">
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <div>
                {data.heading && (
                  <h2 className="text-lg font-bold font-serif text-neutral-900">
                    {data.heading}
                  </h2>
                )}
                {data.subheading && (
                  <p className="text-sm sm:text-base text-neutral-500 font-sans">
                    {data.subheading}
                  </p>
                )}
              </div>
            </div>
          )}

          <ul className="space-y-3 text-sm text-neutral-700 font-sans">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c93838] mt-2 shrink-0" />
                <span>
                  <span className="block">{item.title}</span>
                  {item.text && <span className="block text-neutral-500 whitespace-pre-line">{item.text}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
