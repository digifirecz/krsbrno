'use server';

import * as data from '@/lib/data/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';
import { requireSession } from '@/lib/auth/session';

// Public — fetched server-side via lib/chromeData.ts for Footer/Navbar/CookieConsent.
export async function getSiteSettings(): Promise<SiteSettings> {
  return data.getSiteSettings();
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  await requireSession();
  return data.setSiteSettings(patch);
}
