import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { socialLinks } from '@/lib/db/schema';
import type { SocialLink } from '@/lib/socialLinks';

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.order));
  return rows.map((r) => ({ id: String(r.id), icon: r.icon || '', url: r.url || '', order: r.order ?? 0 }));
}

export async function createSocialLink(icon: string, url: string, order: number): Promise<string> {
  const [res] = await db.insert(socialLinks).values({ icon, url, order });
  return String(res.insertId);
}

export async function updateSocialLink(
  id: string,
  patch: Partial<Pick<SocialLink, 'icon' | 'url' | 'order'>>,
): Promise<void> {
  await db
    .update(socialLinks)
    .set({
      ...(patch.icon !== undefined ? { icon: patch.icon } : {}),
      ...(patch.url !== undefined ? { url: patch.url } : {}),
      ...(patch.order !== undefined ? { order: patch.order } : {}),
    })
    .where(eq(socialLinks.id, Number(id)));
}

export async function deleteSocialLink(id: string): Promise<void> {
  await db.delete(socialLinks).where(eq(socialLinks.id, Number(id)));
}
