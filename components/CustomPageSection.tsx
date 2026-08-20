'use client';

import { useEffect, useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPageBlocks } from '@/lib/pages';
import type { BlockInstance } from '@/lib/blocks/types';

export default function CustomPageSection({ pageId }: { pageId: string }) {
  const [blocks, setBlocks] = useState<BlockInstance[] | null>(null);

  useEffect(() => {
    let active = true;
    setBlocks(null);
    getPageBlocks(pageId)
      .then((fetched) => {
        if (active) setBlocks(fetched || []);
      })
      .catch(() => {
        if (active) setBlocks([]);
      });
    return () => {
      active = false;
    };
  }, [pageId]);

  if (!blocks) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
