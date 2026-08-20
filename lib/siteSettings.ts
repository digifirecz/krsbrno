import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, 'meta', 'siteSettings'));
  if (!snap.exists()) return DEFAULT_SITE_SETTINGS;
  const data = snap.data() as Partial<SiteSettings>;
  return {
    address: data.address || DEFAULT_SITE_SETTINGS.address,
    email: data.email || DEFAULT_SITE_SETTINGS.email,
    logo: data.logo || DEFAULT_SITE_SETTINGS.logo,
    logoAlt: data.logoAlt || DEFAULT_SITE_SETTINGS.logoAlt,
    gdprText: data.gdprText || DEFAULT_SITE_SETTINGS.gdprText,
  };
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, 'meta', 'siteSettings'), patch, { merge: true });
}
