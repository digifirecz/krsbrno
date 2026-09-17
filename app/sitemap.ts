import type { MetadataRoute } from 'next';
import { getAllPageSlugs } from '@/lib/actions/pages';
import { getArticles } from '@/lib/data/articles';

// Canonical URL per section — PATH_TO_TAB in lib/routes.ts has several
// aliases per tab (e.g. "kontakt"/"contact" both resolve to the same page);
// listing every alias here would just be duplicate-content noise for search
// engines, so this picks one canonical path per tab. login/admin excluded on
// purpose — nothing there is meant to be publicly indexed.
const STATIC_PATHS = [
  '/',
  '/cemu-verime',
  '/o-nas',
  '/nase-vyznani',
  '/historie',
  '/sprava-sboru',
  '/vedeni',
  '/setkavani',
  '/knihovna',
  '/mladez',
  '/dorost',
  '/program',
  '/akce',
  '/kontakt',
  '/podpora',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'https://krsbrno.cz';
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));

  const [pageSlugs, articles] = await Promise.all([
    getAllPageSlugs().catch(() => []),
    getArticles({ visibleOnly: true }).catch(() => []),
  ]);

  const pageEntries: MetadataRoute.Sitemap = pageSlugs.map(({ slug }) => ({
    url: `${baseUrl}/${slug}`,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/clanek/${article.id}`,
  }));

  // De-dupe by URL — a managed page can share a path with one of the
  // canonical entries above (e.g. the built-in contact page).
  const seen = new Set<string>();
  return [...staticEntries, ...pageEntries, ...articleEntries].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
