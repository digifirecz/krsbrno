import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import type { TextSectionsData } from '@/lib/blocks/types';

const ASPECT_CLASSES = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
};

export default function TextSectionsBlock({ data }: { data: TextSectionsData }) {
  const photos = (data.photos || []).filter((p) => p.src);
  const sections = data.sections || [];
  const photosRight = data.photosPosition === 'right';
  const aspectClass = ASPECT_CLASSES[data.photoAspectRatio || 'square'];

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {photos.length > 0 && (
            <div className={`lg:col-span-4 space-y-4 ${photosRight ? 'lg:order-2' : ''}`}>
              {photos.map((photo, idx) => (
                <ImageCard key={idx} src={photo.src} alt={photo.caption || ''} aspectRatio={aspectClass} fixedWidth caption={photo.caption} focalX={photo.focalX} focalY={photo.focalY} zoom={photo.zoom} />
              ))}
            </div>
          )}

          <div className={`${photos.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} ${photosRight ? 'lg:order-1' : ''} space-y-8 font-sans text-neutral-700 leading-relaxed`}>
            {sections.map((section, idx) => {
              const Icon = getIcon(section.icon);
              return (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {Icon && (
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-serif">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="text-sm sm:text-base text-neutral-600 space-y-3 font-sans leading-relaxed">
                    {section.text && (
                      <div
                        className="[&_a]:text-[#c93838] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    )}

                    {(section.notes || []).map((note, noteIdx) => {
                      const NoteIcon = getIcon(note.icon);
                      return (
                        <div key={noteIdx} className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-100/90 text-neutral-700 text-xs sm:text-sm font-sans">
                          {NoteIcon && <NoteIcon className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />}
                          <span className="whitespace-pre-line">{note.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
