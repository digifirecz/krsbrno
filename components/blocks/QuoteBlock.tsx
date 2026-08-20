import QuoteBanner from '@/components/QuoteBanner';
import type { QuoteData } from '@/lib/blocks/types';

export default function QuoteBlock({ data }: { data: QuoteData }) {
  return <QuoteBanner quote={data.quote} citation={data.citation} />;
}
