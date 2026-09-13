import { PAGE_IDS, PAGE_ID_TO_TAB } from '@/lib/blocks/pageRegistry';

export interface RouteInfo {
  tab: string;
  path: string;
  title: string;
  label: string;
}

export const TAB_TO_PATH: Record<string, string> = {
  home: '/',
  beliefs: '/cemu-verime',
  about: '/o-nasem-sboru',
  confession: '/nase-vyznani',
  history: '/historie',
  management: '/sprava-sboru',
  leadership: '/vedeni',
  meetings: '/setkavani',
  library: '/knihovna',
  contact: '/kontakt',
  support: '/podpora',
  youth: '/mladez',
  teens: '/dorost',
  kids: '/program',
  groups: '/program',
  events: '/akce',
  login: '/login',
  admin: '/admin',
};

export const PATH_TO_TAB: Record<string, string> = {
  // Root & Home
  '': 'home',
  '/': 'home',
  'home': 'home',
  'uvod': 'home',

  // Kdo jsme
  'cemu-verime': 'beliefs',
  'verime': 'beliefs',
  'beliefs': 'beliefs',

  'o-nas': 'about',
  'o-nasem-sboru': 'about',
  'kdo-jsme': 'about',
  'about': 'about',

  'nase-vyznani': 'confession',
  'vyznani': 'confession',
  'confession': 'confession',

  'historie': 'history',
  'history': 'history',

  'sprava-sboru': 'management',
  'organizace': 'management',
  'sprava': 'management',
  'management': 'management',

  'vedeni': 'leadership',
  'vedeni-sboru': 'leadership',
  'leadership': 'leadership',

  // Co děláme
  'setkavani': 'meetings',
  'spolecna-setkavani': 'meetings',
  'bohosluzby': 'meetings',
  'meetings': 'meetings',

  'knihovna': 'library',
  'knihovna-den': 'library',
  'library': 'library',

  'mladez': 'youth',
  'elevate': 'youth',
  'youth': 'youth',

  'dorost': 'teens',
  'poutnici': 'teens',
  'teens': 'teens',

  'program': 'kids',
  'deti': 'kids',
  'skupinky': 'kids',
  'besidka': 'kids',
  'groups': 'groups',

  'akce': 'events',
  'udalosti': 'events',
  'events': 'events',

  // Kontakt
  'kontakt': 'contact',
  'contact': 'contact',

  // Podpora
  'podpora': 'support',
  'darovat': 'support',
  'finance': 'support',
  'support': 'support',

  // Přihlášení
  'login': 'login',
  'prihlaseni': 'login',

  // Administrace
  'admin': 'admin',
};

export const PAGE_TITLES: Record<string, string> = {
  home: 'Křesťanský sbor Brno | Moderní společenství víry a naděje',
  beliefs: 'Čemu věříme | Křesťanský sbor Brno',
  about: 'O našem sboru | Křesťanský sbor Brno',
  confession: 'Naše vyznání | Křesťanský sbor Brno',
  history: 'Naše historie | Křesťanský sbor Brno',
  management: 'Kdo spravuje sbor | Křesťanský sbor Brno',
  leadership: 'Kdo nás vede | Křesťanský sbor Brno',
  meetings: 'Společná setkávání | Křesťanský sbor Brno',
  library: 'Knihovna DEN | Křesťanský sbor Brno',
  contact: 'Kontakt | Křesťanský sbor Brno',
  support: 'Podpora | Křesťanský sbor Brno',
  youth: 'Mládež Elevate | Křesťanský sbor Brno',
  teens: 'Dorost Poutníci | Křesťanský sbor Brno',
  kids: 'Program pro děti | Křesťanský sbor Brno',
  groups: 'Program pro děti a mládež | Křesťanský sbor Brno',
  events: 'Kalendář akcí | Křesťanský sbor Brno',
  login: 'Přihlášení do sboru | Křesťanský sbor Brno',
  admin: 'Administrace | Křesťanský sbor Brno',
};

// Any slug not found in PATH_TO_TAB is treated as a custom page id (see CustomPageSection),
// rather than silently falling back to the home page.
export function getTabFromSlug(slug: string): string {
  const normalized = (slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  return PATH_TO_TAB[normalized] || normalized || 'home';
}

export function getTabFromPath(pathname: string): string {
  const normalized = (pathname || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  return PATH_TO_TAB[normalized] || normalized || 'home';
}

export function getPathForTab(tab: string): string {
  const pageId = PAGE_IDS[tab as keyof typeof PAGE_IDS] ?? tab;
  if (pageIdToSlugCache[pageId]) return `/${pageIdToSlugCache[pageId]}`;
  if (TAB_TO_PATH[tab]) return TAB_TO_PATH[tab];
  return tab && tab !== 'home' ? `/${tab}` : '/';
}

export function getTitleForTab(tab: string): string {
  return PAGE_TITLES[tab] || PAGE_TITLES.home;
}

// Managed pages ("Správa stránek") get a dynamic, DB-driven URL slug derived from their
// editable title, instead of a hardcoded path — this cache backs the sync getPathForTab()
// above, and resolveDynamicSlug() below handles incoming requests for those slugs.
let pageIdToSlugCache: Record<string, string> = {};

export async function preloadPageSlugs(): Promise<void> {
  const { getAllPageSlugs } = await import('@/lib/actions/pages');
  const entries = await getAllPageSlugs();
  const next: Record<string, string> = {};
  entries.forEach((e) => {
    next[e.id] = e.slug;
  });
  pageIdToSlugCache = next;
}

export interface DynamicSlugResolution {
  tab: string;
  pageId: string;
  redirectPath?: string;
}

/**
 * Resolves an incoming URL slug against DB-managed pages (current or historical slug).
 * Falls back to null when the slug isn't a managed page at all.
 */
export async function resolveDynamicSlug(slug: string): Promise<DynamicSlugResolution | null> {
  const normalized = (slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!normalized) return null;
  const { resolvePageBySlug } = await import('@/lib/actions/pages');
  const match = await resolvePageBySlug(normalized);
  if (!match) return null;
  const tab = PAGE_ID_TO_TAB[match.pageId] || match.pageId;
  if (match.redirectSlug && match.redirectSlug !== normalized) {
    return { tab, pageId: match.pageId, redirectPath: `/${match.redirectSlug}` };
  }
  return { tab, pageId: match.pageId };
}
