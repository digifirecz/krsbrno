import { doc, getDoc, getDocs, setDoc, deleteDoc, collection, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { emptyBlockData } from '@/lib/blocks/defaults';
import type { BlockType, BlockData } from '@/lib/blocks/types';

export interface Section {
  id: string;
  name: string;
  type: BlockType;
  data: BlockData;
  createdAt?: unknown;
  createdBy?: string | null;
  updatedAt?: unknown;
  updatedBy?: string | null;
}

interface SectionDoc {
  name: string;
  type: BlockType;
  data: BlockData;
  createdAt?: unknown;
  createdBy?: string | null;
  updatedAt?: unknown;
  updatedBy?: string | null;
}

function fromDoc(id: string, data: SectionDoc): Section {
  return {
    id,
    name: data.name || '',
    type: data.type,
    data: data.data,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy,
  };
}

export async function getSections(): Promise<Section[]> {
  const snap = await getDocs(collection(db, 'sections'));
  return snap.docs
    .map((d) => fromDoc(d.id, d.data() as SectionDoc))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

export async function getSection(id: string): Promise<Section | null> {
  const snap = await getDoc(doc(db, 'sections', id));
  if (!snap.exists()) return null;
  return fromDoc(snap.id, snap.data() as SectionDoc);
}

async function nextSectionId(): Promise<string> {
  const counterRef = doc(db, 'meta', 'sectionCounter');
  const nextValue = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? ((snap.data().value as number) || 0) : 0;
    const next = current + 1;
    tx.set(counterRef, { value: next });
    return next;
  });
  return String(nextValue);
}

export async function createSection(name: string, type: BlockType, createdBy?: string | null): Promise<string> {
  const id = await nextSectionId();
  await setDoc(doc(db, 'sections', id), {
    name,
    type,
    data: emptyBlockData(type),
    createdAt: serverTimestamp(),
    createdBy: createdBy || null,
    updatedAt: serverTimestamp(),
    updatedBy: createdBy || null,
  });
  return id;
}

export async function updateSection(
  id: string,
  patch: { name?: string; data?: BlockData },
  updatedBy?: string | null
): Promise<void> {
  await setDoc(
    doc(db, 'sections', id),
    { ...patch, updatedAt: serverTimestamp(), updatedBy: updatedBy || null },
    { merge: true }
  );
}

export async function deleteSection(id: string): Promise<void> {
  await deleteDoc(doc(db, 'sections', id));
}
