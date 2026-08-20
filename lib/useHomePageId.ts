'use client';

import { useEffect, useState } from 'react';
import { getHomePageId } from '@/lib/pages';

/**
 * The "Správa stránek" page chosen to render at "/", if the admin picked one
 * to override the built-in static home content. Null = not loaded yet or
 * no override configured (use the built-in content).
 */
export function useHomePageId(): string | null {
  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getHomePageId()
      .then((id) => {
        if (active) setPageId(id);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return pageId;
}
