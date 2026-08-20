'use client';

import { useEffect, useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPageBlocks } from '@/lib/pages';
import { PAGE_IDS } from '@/lib/blocks/pageRegistry';
import type { BlockInstance } from '@/lib/blocks/types';

export default function LibraryDen() {
  const [blocks, setBlocks] = useState<BlockInstance[] | null>(null);

  useEffect(() => {
    let active = true;
    getPageBlocks(PAGE_IDS.library)
      .then((fetched) => {
        if (active) setBlocks(fetched || []);
      })
      .catch(() => {
        if (active) setBlocks([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!blocks) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="border-b border-neutral-200/60" id="sec-library">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
