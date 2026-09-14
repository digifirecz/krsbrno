'use server';

import * as data from '@/lib/data/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';
import { requireSession } from '@/lib/auth/session';

// Public — Footer/Navbar/CookieConsent read this via useSiteSettings.
export async function getSiteSettings(): Promise<SiteSettings> {
  return data.getSiteSettings();
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  await requireSession();
  return data.setSiteSettings(patch);
}
