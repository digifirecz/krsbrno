export interface RouteInfo {
  tab: string;
  path: string;
  title: string;
  label: string;
}

export const TAB_TO_PATH: Record<string, string> = {
  home: '/',
  beliefs: '/cemu-verime',
  about: '/o-nas',
  confession: '/nase-vyznani',
  history: '/historie',
  management: '/sprava-sboru',
  leadership: '/vedeni',
  meetings: '/setkavani',
  library: '/knihovna',
  sermons: '/kazani',
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

  // Kázání
  'kazani': 'sermons',
  'zaznamy': 'sermons',
  'audio': 'sermons',
  'sermons': 'sermons',

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
  sermons: 'Záznamy z bohoslužeb a kázání | Křesťanský sbor Brno',
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

export function getTabFromSlug(slug: string): string {
  const normalized = (slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  return PATH_TO_TAB[normalized] || 'home';
}

export function getTabFromPath(pathname: string): string {
  const normalized = (pathname || '').toLowerCase().replace(/^\/+|\/+$/g, '');
  return PATH_TO_TAB[normalized] || 'home';
}

export function getPathForTab(tab: string): string {
  return TAB_TO_PATH[tab] || '/';
}

export function getTitleForTab(tab: string): string {
  return PAGE_TITLES[tab] || PAGE_TITLES.home;
}
