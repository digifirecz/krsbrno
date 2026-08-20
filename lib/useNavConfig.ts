'use client';

import { useEffect, useState } from 'react';
import { getNavConfig, type PageNavEntry } from '@/lib/pages';

/**
 * Per-page header/footer visibility, driven by "Správa stránek" (see /admin/navigace).
 * Returns null while loading — callers should treat null as "assume visible" so
 * nav items don't flash away before the check resolves.
 */
export function useNavConfig(): Map<string, PageNavEntry> | null {
  const [config, setConfig] = useState<Map<string, PageNavEntry> | null>(null);

  useEffect(() => {
    let active = true;
    getNavConfig()
      .then((entries) => {
        if (active) setConfig(new Map(entries.map((e) => [e.id, e])));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return config;
}
