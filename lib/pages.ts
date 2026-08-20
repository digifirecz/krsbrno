import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, getDocs, query, where, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MANAGEABLE_PAGES } from '@/lib/blocks/pageRegistry';
import type { BlockInstance, PageDoc } from '@/lib/blocks/types';

export interface CustomPage {
  id: string;
  label: string;
  protected?: boolean;
}

export interface PageSlugEntry {
  id: string;
  slug: string;
}

export interface PageNavEntry {
  id: string;
  label: string;
  showInHeader: boolean;
  showInFooter: boolean;
  headerGroupId: string;
  headerGroupLabel: string;
  headerIcon?: string;
  protected: boolean;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getPageBlocks(pageId: string): Promise<BlockInstance[] | null> {
  const snap = await getDoc(doc(db, 'pages', pageId));
  if (!snap.exists()) return null;
  const data = snap.data() as PageDoc;
  if (!data.blocks || data.blocks.length === 0) return null;
  return [...data.blocks].sort((a, b) => a.order - b.order);
}

export async function getPageDoc(pageId: string): Promise<PageDoc | null> {
  const snap = await getDoc(doc(db, 'pages', pageId));
  if (!snap.exists()) return null;
  return snap.data() as PageDoc;
}

function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

async function nextPageId(): Promise<string> {
  const counterRef = doc(db, 'meta', 'pageCounter');
  const nextValue = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().value as number) || 0) : 0;
    const next = current + 1;
    tx.set(counterRef, { value: next });
    return next;
  });
  return String(nextValue);
}

export async function savePageBlocks(
  pageId: string,
  blocks: BlockInstance[],
  title?: string | null,
  updatedBy?: string | null,
  navConfig?: { headerGroupId?: string; headerIcon?: string }
): Promise<string> {
  const trimmedTitle = (title || '').trim();
  const existing = await getPageDoc(pageId);
  const desiredSlug = trimmedTitle ? slugify(trimmedTitle) : '';

  let slug = existing?.slug || pageId;
  let slugHistory = existing?.slugHistory || [];

  if (desiredSlug && desiredSlug !== slug) {
    const snap = await getDocs(collection(db, 'pages'));
    const taken = new Set<string>();
    snap.docs.forEach((d) => {
      if (d.id === pageId) return;
      const data = d.data() as PageDoc;
      if (data.slug) taken.add(data.slug);
      (data.slugHistory || []).forEach((s) => taken.add(s));
    });
    const nextSlug = uniqueSlug(desiredSlug, taken);
    if (!slugHistory.includes(slug)) slugHistory = [...slugHistory, slug];
    slug = nextSlug;
    slugHistory = slugHistory.filter((s) => s !== slug);
  }

  await setDoc(
    doc(db, 'pages', pageId),
    {
      blocks,
      title: trimmedTitle || null,
      slug,
      slugHistory,
      updatedAt: serverTimestamp(),
      updatedBy: updatedBy || null,
      ...(navConfig?.headerGroupId !== undefined ? { headerGroupId: navConfig.headerGroupId } : {}),
      ...(navConfig?.headerIcon !== undefined ? { headerIcon: navConfig.headerIcon } : {}),
    },
    { merge: true }
  );

  return slug;
}

export async function getCustomPages(): Promise<CustomPage[]> {
  const staticIds = new Set(MANAGEABLE_PAGES.map((p) => p.id));
  const snap = await getDocs(collection(db, 'pages'));
  return snap.docs
    .filter((d) => !staticIds.has(d.id))
    .map((d) => ({ id: d.id, label: (d.data().title as string) || d.id, protected: !!d.data().protected }));
}

export async function getProtectedPageId(): Promise<string | null> {
  const snap = await getDocs(query(collection(db, 'pages'), where('protected', '==', true)));
  return snap.empty ? null : snap.docs[0].id;
}

export async function getAllPageSlugs(): Promise<PageSlugEntry[]> {
  const snap = await getDocs(collection(db, 'pages'));
  return snap.docs
    .map((d) => ({ id: d.id, slug: (d.data().slug as string) || d.id }))
    .filter((e) => !!e.slug);
}

export async function getNavConfig(): Promise<PageNavEntry[]> {
  const staticLabels = new Map(MANAGEABLE_PAGES.map((p) => [p.id, p.label]));
  const [snap, groups] = await Promise.all([getDocs(collection(db, 'pages')), getNavGroups()]);
  const groupLabels = new Map(groups.map((g) => [g.id, g.label]));
  return snap.docs.map((d) => {
    const data = d.data() as PageDoc;
    const headerGroupId = data.headerGroupId || '';
    return {
      id: d.id,
      label: data.title || staticLabels.get(d.id) || d.id,
      showInHeader: !!data.showInHeader,
      showInFooter: !!data.showInFooter,
      headerGroupId,
      headerGroupLabel: headerGroupId ? groupLabels.get(headerGroupId) || '' : '',
      headerIcon: data.headerIcon,
      protected: !!data.protected,
    };
  });
}

export async function setNavVisibility(
  pageId: string,
  visibility: { showInHeader?: boolean; showInFooter?: boolean; headerGroupId?: string; headerIcon?: string }
): Promise<void> {
  await setDoc(doc(db, 'pages', pageId), visibility, { merge: true });
}

export async function resolvePageBySlug(slug: string): Promise<{ pageId: string; redirectSlug?: string } | null> {
  const currentQuery = query(collection(db, 'pages'), where('slug', '==', slug));
  const currentSnap = await getDocs(currentQuery);
  if (!currentSnap.empty) {
    return { pageId: currentSnap.docs[0].id };
  }

  const historyQuery = query(collection(db, 'pages'), where('slugHistory', 'array-contains', slug));
  const historySnap = await getDocs(historyQuery);
  if (!historySnap.empty) {
    const data = historySnap.docs[0].data() as PageDoc;
    return { pageId: historySnap.docs[0].id, redirectSlug: data.slug || historySnap.docs[0].id };
  }

  return null;
}

export async function createPage(label: string, createdBy?: string | null): Promise<string> {
  const trimmed = label.trim();
  const baseSlug = slugify(trimmed);
  if (!trimmed || !baseSlug) {
    throw new Error('Zadejte platný název stránky.');
  }

  const staticMatch = MANAGEABLE_PAGES.find((p) => p.label.trim().toLowerCase() === trimmed.toLowerCase());
  if (staticMatch) {
    throw new Error('Stránka s tímto názvem už existuje.');
  }

  const snap = await getDocs(collection(db, 'pages'));
  const taken = new Set<string>();
  let titleCollision = false;
  snap.docs.forEach((d) => {
    const data = d.data() as PageDoc;
    if (data.slug) taken.add(data.slug);
    (data.slugHistory || []).forEach((s) => taken.add(s));
    if ((data.title || '').trim().toLowerCase() === trimmed.toLowerCase()) titleCollision = true;
  });
  if (titleCollision) {
    throw new Error('Stránka s tímto názvem už existuje.');
  }

  const slug = uniqueSlug(baseSlug, taken);
  const id = await nextPageId();

  await setDoc(doc(db, 'pages', id), {
    blocks: [],
    title: trimmed,
    slug,
    slugHistory: [],
    createdAt: serverTimestamp(),
    createdBy: createdBy || null,
    updatedAt: serverTimestamp(),
    updatedBy: createdBy || null,
  });

  return id;
}

export async function deletePage(pageId: string): Promise<void> {
  await deleteDoc(doc(db, 'pages', pageId));
}

export async function getHomePageId(): Promise<string | null> {
  const snap = await getDoc(doc(db, 'meta', 'homePage'));
  if (!snap.exists()) return null;
  return (snap.data().pageId as string) || null;
}

export async function setHomePageId(pageId: string | null): Promise<void> {
  await setDoc(doc(db, 'meta', 'homePage'), { pageId: pageId || null });
}

export interface NavGroup {
  id: string;
  label: string;
}

export async function getNavGroups(): Promise<NavGroup[]> {
  const snap = await getDocs(collection(db, 'navGroups'));
  return snap.docs.map((d) => ({ id: d.id, label: (d.data().label as string) || d.id }));
}

export async function createNavGroup(label: string): Promise<NavGroup> {
  const trimmed = label.trim();
  if (!trimmed) throw new Error('Zadejte název skupiny.');

  const snap = await getDocs(collection(db, 'navGroups'));
  const taken = new Set(snap.docs.map((d) => d.id));
  if (snap.docs.some((d) => ((d.data().label as string) || '').trim().toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Skupina s tímto názvem už existuje.');
  }

  const id = uniqueSlug(slugify(trimmed) || 'skupina', taken);
  await setDoc(doc(db, 'navGroups', id), { label: trimmed });
  return { id, label: trimmed };
}

export async function deleteNavGroup(groupId: string): Promise<void> {
  await deleteDoc(doc(db, 'navGroups', groupId));
}
