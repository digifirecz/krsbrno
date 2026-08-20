import EmbedContent from '@/components/blocks/EmbedContent';
import type { MapEmbedData } from '@/lib/blocks/types';

export default function MapEmbedBlock({ data }: { data: MapEmbedData }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmbedContent data={data} />
      </div>
    </section>
  );
}
