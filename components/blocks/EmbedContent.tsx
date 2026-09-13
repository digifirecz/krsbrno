import type { MapEmbedData } from '@/lib/blocks/types';

export default function EmbedContent({ data }: { data: MapEmbedData }) {
  return (
    <div className="space-y-4">
      {(data.heading || data.subheading) && (
        <div className="text-center">
          {data.heading && (
            <h3 className="text-xl font-extrabold text-neutral-900 font-serif">
              {data.heading}
            </h3>
          )}
          {data.subheading && (
            <p className="text-sm sm:text-base text-neutral-500 font-sans">
              {data.subheading}
            </p>
          )}
        </div>
      )}

      <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs relative bg-neutral-100">
        <iframe
          src={data.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={data.heading || 'Vložený obsah'}
        />
      </div>
    </div>
  );
}
