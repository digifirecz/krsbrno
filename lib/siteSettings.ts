// Shared types + default content for site-wide settings. Implementation lives
// in lib/data/siteSettings.ts (server, Drizzle); client components reach it
// through lib/actions/siteSettings.ts. The DEFAULT_* consts are safe to import
// anywhere (no server dependency).

export interface SiteSettings {
  address: string;
  email: string;
  logo: string;
  logoAlt: string;
  gdprText: string;
}

export const DEFAULT_GDPR_TEXT = `<p>Křesťanský sbor Brno zpracovává osobní údaje v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).</p><p><strong>1. Účel zpracování:</strong> Osobní údaje z kontaktních formulářů nebo e-mailové komunikace využíváme výhradně k odpovědi na vaše dotazy nebo k organizaci sborových akcí.</p><p><strong>2. Doba uchování:</strong> Údaje uchováváme pouze po dobu nezbytnou k vyřízení požadavku.</p><p><strong>3. Vaše práva:</strong> Máte právo požadovat přístup k osobním údajům, jejich opravu, výmaz nebo omezení zpracování zasláním žádosti na info@krsbrno.cz.</p>`;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  address: 'Šámalova 15a, Brno',
  email: 'info@krsbrno.cz',
  logo: '/logo.png',
  logoAlt: 'Křesťanský sbor Brno',
  gdprText: DEFAULT_GDPR_TEXT,
};
