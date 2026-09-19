'use server';

import * as data from '@/lib/data/socialLinks';
import type { SocialLink } from '@/lib/socialLinks';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Public — fetched server-side via lib/chromeData.ts for the Footer.
export const getSocialLinks = withAction('socialLinks.getSocialLinks', async (): Promise<SocialLink[]> => {
  return data.getSocialLinks();
});

export const createSocialLink = withAction('socialLinks.createSocialLink', async (icon: string, url: string, order: number): Promise<string> => {
  await requireSession();
  return data.createSocialLink(icon, url, order);
});

export const updateSocialLink = withAction('socialLinks.updateSocialLink', async (id: string, patch: Partial<Pick<SocialLink, 'icon' | 'url' | 'order'>>): Promise<void> => {
  await requireSession();
  return data.updateSocialLink(id, patch);
});

export const deleteSocialLink = withAction('socialLinks.deleteSocialLink', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteSocialLink(id);
});
