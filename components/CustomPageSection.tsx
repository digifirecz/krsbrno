'use client';

import { useEffect, useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPageBlocks } from '@/lib/actions/pages';
import type { BlockInstance } from '@/lib/blocks/types';

interface CustomPageSectionProps {
  pageId: string;
  // Shown instead of a blank page when the blocks genuinely fail to load
  // (e.g. the database is unreachable) — distinct from a page that loaded
  // fine and just has zero blocks configured.
  fallback?: React.ReactNode;
}

export default function CustomPageSection({ pageId, fallback }: CustomPageSectionProps) {
  const [blocks, setBlocks] = useState<BlockInstance[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setBlocks(null);
    setFailed(false);
    getPageBlocks(pageId)
      .then((fetched) => {
        if (active) setBlocks(fetched || []);
      })
      .catch(() => {
        if (active) {
          setBlocks([]);
          setFailed(true);
        }
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

  if (failed && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="bg-white">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}
