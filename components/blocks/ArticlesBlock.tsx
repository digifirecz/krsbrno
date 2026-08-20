import EventsSection from '@/components/EventsSection';
import type { ArticlesBlockData } from '@/lib/blocks/types';

export default function ArticlesBlock({ data }: { data: ArticlesBlockData }) {
  return <EventsSection icon={data.icon} heading={data.heading} description={data.description} />;
}
