'use server';

import * as data from '@/lib/data/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Public — fetched server-side via lib/chromeData.ts for Footer/Navbar/CookieConsent.
export const getSiteSettings = withAction('siteSettings.getSiteSettings', async (): Promise<SiteSettings> => {
  return data.getSiteSettings();
});

export const setSiteSettings = withAction('siteSettings.setSiteSettings', async (patch: Partial<SiteSettings>): Promise<void> => {
  await requireSession();
  return data.setSiteSettings(patch);
});
