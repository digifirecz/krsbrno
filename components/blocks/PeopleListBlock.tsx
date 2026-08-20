import { getIcon } from '@/lib/blocks/icons';
import type { PeopleListData } from '@/lib/blocks/types';

export default function PeopleListBlock({ data }: { data: PeopleListData }) {
  const Icon = getIcon(data.icon);
  const people = data.people || [];

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
                  <p className="text-sm text-neutral-500 font-sans">
                    {data.subheading}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-sans">
            {people.map((person, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-red-100/80 text-[#c93838] font-bold text-xs flex items-center justify-center shrink-0">
                  {person.trim().charAt(0)}
                </div>
                <span className="font-medium text-neutral-800">{person}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
