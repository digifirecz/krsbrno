import ImageCard from '@/components/ImageCard';
import { Clock } from 'lucide-react';
import type { ScheduleCardData } from '@/lib/blocks/types';

export default function ScheduleCardBlock({ data }: { data: ScheduleCardData }) {
  const schedule = data.schedule || [];

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {data.photo && (
            <div className="space-y-3">
              <ImageCard src={data.photo.src} alt={data.photo.caption || ''} aspectRatio="aspect-[4/3]" caption={data.photo.caption} focalX={data.photo.focalX} focalY={data.photo.focalY} />
            </div>
          )}

          <div className="space-y-6">
            {schedule.length > 0 && (
              <div className="bg-gradient-to-br from-red-50/70 via-neutral-50 to-white p-6 sm:p-7 rounded-2xl border border-red-100/90 shadow-2xs space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    {data.heading && (
                      <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 font-serif">
                        {data.heading}
                      </h2>
                    )}
                    {data.subheading && (
                      <p className="text-xs text-neutral-500 font-sans">
                        {data.subheading}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {schedule.map((item, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-neutral-200/80 space-y-1 shadow-2xs">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-sans block">{item.label}</span>
                      <span className="text-base font-extrabold text-[#c93838] font-sans block">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.text || data.highlight) && (
              <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {data.text && <p className="whitespace-pre-line">{data.text}</p>}
                {data.highlight && <p className="font-semibold text-neutral-900 whitespace-pre-line">{data.highlight}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
