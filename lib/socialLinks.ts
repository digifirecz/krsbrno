import { doc, getDocs, setDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SocialLink {
  id: string;
  icon: string;
  url: string;
  order: number;
}

interface SocialLinkDoc {
  icon: string;
  url: string;
  order: number;
}

function fromDoc(id: string, data: SocialLinkDoc): SocialLink {
  return {
    id,
    icon: data.icon || '',
    url: data.url || '',
    order: data.order ?? 0,
  };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const snap = await getDocs(collection(db, 'socialLinks'));
  return snap.docs
    .map((d) => fromDoc(d.id, d.data() as SocialLinkDoc))
    .sort((a, b) => a.order - b.order);
}

export async function createSocialLink(icon: string, url: string, order: number): Promise<string> {
  const ref = await addDoc(collection(db, 'socialLinks'), { icon, url, order });
  return ref.id;
}

export async function updateSocialLink(id: string, patch: Partial<Pick<SocialLink, 'icon' | 'url' | 'order'>>): Promise<void> {
  await setDoc(doc(db, 'socialLinks', id), patch, { merge: true });
}

export async function deleteSocialLink(id: string): Promise<void> {
  await deleteDoc(doc(db, 'socialLinks', id));
}
