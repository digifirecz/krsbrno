import { getIcon } from '@/lib/blocks/icons';
import type { CardGridData, CardGridItem } from '@/lib/blocks/types';

function CardHeader({ icon, heading, subheading }: { icon?: string; heading?: string; subheading?: string }) {
  const Icon = getIcon(icon);
  if (!Icon && !heading && !subheading) return null;
  return (
    <div className="flex items-center space-x-2.5 pb-2 border-b border-neutral-100">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div>
        {heading && <h3 className="text-lg font-bold font-serif text-neutral-900">{heading}</h3>}
        {subheading && <p className="text-sm sm:text-base text-neutral-500 font-sans">{subheading}</p>}
      </div>
    </div>
  );
}

function CardGridCard({ card }: { card: CardGridItem }) {
  if (card.kind === 'icon') {
    const Icon = getIcon(card.icon);
    return (
      <div className="bg-neutral-50/60 p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-red-100/80 text-[#c93838] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h3 className="text-lg font-bold font-serif text-neutral-900">{card.title}</h3>
        {card.text && (
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans whitespace-pre-line">{card.text}</p>
        )}
      </div>
    );
  }

  if (card.kind === 'list') {
    const items = card.items || [];
    return (
      <div className={`p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4 ${card.wide ? 'md:col-span-2' : ''}`}>
        <CardHeader icon={card.icon} heading={card.heading} subheading={card.subheading} />
        <ul className={`space-y-3 text-sm text-neutral-700 font-sans ${card.wide ? 'md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-3 md:space-y-0' : ''}`}>
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
    );
  }

  const people = card.people || [];
  return (
    <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
      <CardHeader icon={card.icon} heading={card.heading} subheading={card.subheading} />
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
  );
}

export default function CardGridBlock({ data }: { data: CardGridData }) {
  const cards = data.cards || [];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.subheading) && (
          <div className="text-center space-y-2">
            {data.heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">{data.heading}</h2>
            )}
            {data.subheading && (
              <p className="text-sm sm:text-base text-neutral-500 font-sans max-w-xl mx-auto">{data.subheading}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {cards.map((card, idx) => (
            <CardGridCard key={idx} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
