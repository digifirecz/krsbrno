import { doc, getDoc, getDocs, setDoc, deleteDoc, collection, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  dateText: string;
  image?: string;
  visible: boolean;
  order: number;
  createdAt?: unknown;
  createdBy?: string | null;
  updatedAt?: unknown;
  updatedBy?: string | null;
}

interface ArticleDoc {
  title: string;
  subtitle?: string | null;
  dateText: string;
  image?: string | null;
  visible: boolean;
  order: number;
  createdAt?: unknown;
  createdBy?: string | null;
  updatedAt?: unknown;
  updatedBy?: string | null;
}

function fromDoc(id: string, data: ArticleDoc): Article {
  return {
    id,
    title: data.title || '',
    subtitle: data.subtitle || undefined,
    dateText: data.dateText || '',
    image: data.image || undefined,
    visible: data.visible !== false,
    order: data.order ?? 0,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy,
  };
}

export async function getArticles(): Promise<Article[]> {
  const snap = await getDocs(collection(db, 'articles'));
  return snap.docs
    .map((d) => fromDoc(d.id, d.data() as ArticleDoc))
    .sort((a, b) => a.order - b.order);
}

export async function getArticle(id: string): Promise<Article | null> {
  const snap = await getDoc(doc(db, 'articles', id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data() as ArticleDoc);
}

async function nextArticleId(): Promise<string> {
  const counterRef = doc(db, 'meta', 'articleCounter');
  const nextValue = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().value as number) || 0) : 0;
    const next = current + 1;
    tx.set(counterRef, { value: next });
    return next;
  });
  return String(nextValue);
}

export async function createArticle(order: number, createdBy?: string | null): Promise<string> {
  const id = await nextArticleId();
  await setDoc(doc(db, 'articles', id), {
    title: '',
    subtitle: null,
    dateText: '',
    image: null,
    visible: true,
    order,
    createdAt: serverTimestamp(),
    createdBy: createdBy || null,
    updatedAt: serverTimestamp(),
    updatedBy: createdBy || null,
  });
  return id;
}

export async function updateArticle(
  id: string,
  patch: Partial<Omit<Article, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>,
  updatedBy?: string | null
): Promise<void> {
  await setDoc(
    doc(db, 'articles', id),
    { ...patch, updatedAt: serverTimestamp(), updatedBy: updatedBy || null },
    { merge: true }
  );
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, 'articles', id));
}
