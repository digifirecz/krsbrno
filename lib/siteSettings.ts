import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SiteSettings {
  address: string;
  email: string;
  logo: string;
  logoAlt: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  address: 'Šámalova 15a, Brno',
  email: 'info@krsbrno.cz',
  logo: '/logo.png',
  logoAlt: 'Křesťanský sbor Brno',
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
  };
}

export async function setSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, 'meta', 'siteSettings'), patch, { merge: true });
}
