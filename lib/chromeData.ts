// Server-side fetch for the data Navbar/Footer/CookieConsent need on every
// page (logo/contact info, nav visibility, social links). Previously each of
// those client components fetched its own copy via a useEffect hook, which
// meant the header/footer rendered empty on first paint and then popped in
// piecemeal as each request resolved — causing layout shift and a handful of
// extra network round trips on every single page view. Fetching it once here
// and passing it down as props removes both.
import { cache } from 'react';
import { getSiteSettings } from '@/lib/actions/siteSettings';
import { getNavConfig } from '@/lib/actions/pages';
import { getSocialLinks } from '@/lib/actions/socialLinks';
import type { SiteSettings } from '@/lib/siteSettings';
import type { PageNavEntry } from '@/lib/pages';
import type { SocialLink } from '@/lib/socialLinks';

export interface ChromeData {
  siteSettings: SiteSettings;
  navConfigEntries: PageNavEntry[];
  socialLinks: SocialLink[];
}

// cache() dedupes this within a single request, so it's cheap to call from
// both app/layout.tsx and the page/layout underneath it.
export const getChromeData = cache(async (): Promise<ChromeData> => {
  const [siteSettings, navConfigEntries, socialLinks] = await Promise.all([
    getSiteSettings(),
    getNavConfig(),
    getSocialLinks(),
  ]);
  return { siteSettings, navConfigEntries, socialLinks };
});
