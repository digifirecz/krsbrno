'use server';

import * as data from '@/lib/data/socialLinks';
import type { SocialLink } from '@/lib/socialLinks';

export async function getSocialLinks(): Promise<SocialLink[]> {
  return data.getSocialLinks();
}

export async function createSocialLink(icon: string, url: string, order: number): Promise<string> {
  return data.createSocialLink(icon, url, order);
}

export async function updateSocialLink(
  id: string,
  patch: Partial<Pick<SocialLink, 'icon' | 'url' | 'order'>>,
): Promise<void> {
  return data.updateSocialLink(id, patch);
}

export async function deleteSocialLink(id: string): Promise<void> {
  return data.deleteSocialLink(id);
}
