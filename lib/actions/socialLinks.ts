'use server';

import * as data from '@/lib/data/socialLinks';
import type { SocialLink } from '@/lib/socialLinks';
import { requireSession } from '@/lib/auth/session';

// Public — Footer reads this via useSocialLinks.
export async function getSocialLinks(): Promise<SocialLink[]> {
  return data.getSocialLinks();
}

export async function createSocialLink(icon: string, url: string, order: number): Promise<string> {
  await requireSession();
  return data.createSocialLink(icon, url, order);
}

export async function updateSocialLink(
  id: string,
  patch: Partial<Pick<SocialLink, 'icon' | 'url' | 'order'>>,
): Promise<void> {
  await requireSession();
  return data.updateSocialLink(id, patch);
}

export async function deleteSocialLink(id: string): Promise<void> {
  await requireSession();
  return data.deleteSocialLink(id);
}
