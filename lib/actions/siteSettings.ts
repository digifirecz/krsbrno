'use server';

import * as data from '@/lib/data/siteSettings';
import type { SiteSettings } from '@/lib/siteSettings';

export async function getSiteSettings(): Promise<SiteSettings> {
  return data.getSiteSettings();
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  return data.setSiteSettings(patch);
}
