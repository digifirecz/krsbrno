'use client';

import CustomPageSection from '@/components/CustomPageSection';
import { PAGE_IDS } from '@/lib/blocks/pageRegistry';

export default function Meetings() {
  return (
    <div className="border-b border-neutral-200/60" id="sec-meetings">
      <CustomPageSection pageId={PAGE_IDS.meetings} />
    </div>
  );
}
