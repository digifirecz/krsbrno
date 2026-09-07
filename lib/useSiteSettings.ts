'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings } from '@/lib/actions/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';

/**
 * Site-wide branding/contact info (logo, address, email) managed in /admin/nastaveni.
 * Returns null while loading — callers should fall back to the static defaults so
 * nothing flashes/changes on load.
 */
export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;
    getSiteSettings()
      .then((fetched) => {
        if (active) setSettings(fetched);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
