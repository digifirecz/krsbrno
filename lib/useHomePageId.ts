'use client';

import { useEffect, useState } from 'react';
import { getHomePageId } from '@/lib/actions/pages';

/**
 * The "Správa stránek" page chosen to render at "/". Undefined = still
 * loading (don't render anything yet); null = loaded, no page configured.
 */
export function useHomePageId(): string | null | undefined {
  const [pageId, setPageId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getHomePageId()
      .then((id) => {
        if (active) setPageId(id);
      })
      .catch(() => {
        if (active) setPageId(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return pageId;
}
