import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Role = 'admin' | 'sprava';

export interface RoleEntry {
  uid: string;
  email: string;
  role: Role;
}

export interface RoleDefinition {
  id: string;
  label: string;
}

// In-memory cache so navigating between admin pages doesn't refetch + wait on
// the same role lookup every time (every admin page/layout checks it independently).
const roleCache = new Map<string, Role>();
const rolePending = new Map<string, Promise<Role>>();

export async function getRole(uid: string): Promise<Role> {
  const cached = roleCache.get(uid);
  if (cached) return cached;

  const pending = rolePending.get(uid);
  if (pending) return pending;

  const promise = (async () => {
    const snap = await getDoc(doc(db, 'roles', uid));
    const role = !snap.exists() ? 'sprava' : ((snap.data().role as Role) || 'sprava');
    roleCache.set(uid, role);
    rolePending.delete(uid);
    return role;
  })();

  rolePending.set(uid, promise);
  return promise;
}

export async function getAllRoles(): Promise<RoleEntry[]> {
  const snap = await getDocs(collection(db, 'roles'));
  return snap.docs.map((d) => ({
    uid: d.id,
    email: (d.data().email as string) || '',
    role: (d.data().role as Role) || 'sprava',
  }));
}

export async function setRole(uid: string, email: string, role: Role): Promise<void> {
  await setDoc(doc(db, 'roles', uid), { email, role });
  roleCache.set(uid, role);
}

export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  const snap = await getDocs(collection(db, 'roleDefinitions'));
  return snap.docs.map((d) => ({ id: d.id, label: (d.data().label as string) || d.id }));
}
