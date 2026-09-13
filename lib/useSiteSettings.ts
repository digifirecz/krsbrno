'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/actions/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';

/**
 * Site-wide branding/contact info (logo, address, email) managed in /admin/nastaveni.
 * Undefined = still loading (don't render anything yet); null = loaded but the
 * fetch failed (e.g. DB unreachable) — callers must not paper over that with
 * hardcoded defaults, since those wouldn't be real data.
 */
export function useSiteSettings(): SiteSettings | null | undefined {
  const [settings, setSettings] = useState<SiteSettings | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getSiteSettings()
      .then((fetched) => {
        if (active) setSettings(fetched);
      })
      .catch(() => {
        if (active) setSettings(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
