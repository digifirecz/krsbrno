import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import { CheckCircle2 } from 'lucide-react';
import type { ChecklistCardData } from '@/lib/blocks/types';

export default function ChecklistCardBlock({ data }: { data: ChecklistCardData }) {
  const items = data.items || [];
  const NoteIcon = getIcon(data.noteIcon);

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${data.photo ? 'md:grid-cols-2' : ''} gap-8 sm:gap-12 items-center`}>
          <div className="space-y-6">
            {(data.eyebrow || data.heading) && (
              <div className="space-y-2">
                {data.eyebrow && (
                  <span className="text-xs font-bold text-[#c93838] uppercase tracking-wider font-sans block">
                    {data.eyebrow}
                  </span>
                )}
                {data.heading && (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                    {data.heading}
                  </h2>
                )}
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-3 font-sans text-xs sm:text-sm">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-neutral-900">{item.title}</div>
                      {item.text && <div className="text-neutral-600 text-xs whitespace-pre-line">{item.text}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(data.noteTitle || data.noteText) && (
              <div className="bg-red-50/70 border border-red-100 p-4 rounded-xl space-y-1 font-sans">
                {data.noteTitle && (
                  <div className="flex items-center space-x-2 text-[#c93838] font-bold text-sm">
                    {NoteIcon && <NoteIcon className="w-4 h-4" />}
                    <span>{data.noteTitle}</span>
                  </div>
                )}
                {data.noteText && (
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{data.noteText}</p>
                )}
              </div>
            )}
          </div>

          {data.photo?.src && (
            <div className="space-y-3">
              <ImageCard src={data.photo.src} alt={data.photo.caption || ''} aspectRatio="aspect-[4/3]" caption={data.photo.caption} focalX={data.photo.focalX} focalY={data.photo.focalY} zoom={data.photo.zoom} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
