import { getMeta, setMeta } from '@/lib/data/meta';
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '@/lib/siteSettings';

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = (await getMeta<Partial<SiteSettings>>('siteSettings')) || {};
  return {
    siteName: data.siteName || DEFAULT_SITE_SETTINGS.siteName,
    address: data.address || DEFAULT_SITE_SETTINGS.address,
    email: data.email || DEFAULT_SITE_SETTINGS.email,
    logo: data.logo || DEFAULT_SITE_SETTINGS.logo,
    logoAlt: data.logoAlt || DEFAULT_SITE_SETTINGS.logoAlt,
    gdprText: data.gdprText || DEFAULT_SITE_SETTINGS.gdprText,
  };
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  await setMeta('siteSettings', patch, true);
}
