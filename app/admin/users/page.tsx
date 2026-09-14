'use client';

import { useEffect, useState } from 'react';
import RequireAdmin from '@/components/admin/RequireAdmin';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import NewUserModal from '@/components/admin/blocks/NewUserModal';
import SetPasswordModal from '@/components/admin/blocks/SetPasswordModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getAllRoles, getRoleDefinitions, setRole, deleteRole } from '@/lib/actions/roles';
import { adminSetPassword } from '@/lib/actions/auth';
import type { RoleEntry, RoleDefinition } from '@/lib/roles';
import { UserCog, Plus, Trash2, KeyRound } from 'lucide-react';

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Author({ by, at }: { by?: string | null; at?: Date | null }) {
  if (!by && !at) return <span className="text-neutral-300">—</span>;
  return (
    <div className="leading-tight">
      <div className="text-neutral-800 truncate">{by || '—'}</div>
      <div className="text-xs text-neutral-400">{fmtDate(at)}</div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState<RoleEntry[]>([]);
  const [roleDefs, setRoleDefs] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [savingEmail, setSavingEmail] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleEntry | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllRoles(), getRoleDefinitions()])
      .then(([r, defs]) => {
        setRows(r);
        setRoleDefs(defs);
      })
      .finally(() => setLoading(false));
  }, []);

  const roleLabel = (id: string) => roleDefs.find((d) => d.id === id)?.label || id;

  return (
    <RequireAdmin>
      {(user) => {
        const handleAdd = async (email: string, role: string) => {
          const entry = await setRole(email, role, user.email);
          setRows((prev) => {
            const rest = prev.filter((r) => r.email !== entry.email);
            return [...rest, entry].sort((a, b) => a.email.localeCompare(b.email));
          });
          setAddOpen(false);
          showToast(`${entry.email} má roli ${roleLabel(entry.role)}.`);
        };

        const handleChangeRole = async (entry: RoleEntry, role: string) => {
          if (role === entry.role) return;
          setSavingEmail(entry.email);
          const prevRole = entry.role;
          setRows((prev) => prev.map((r) => (r.email === entry.email ? { ...r, role } : r)));
          try {
            await setRole(entry.email, role, user.email);
            showToast(`${entry.email} má roli ${roleLabel(role)}.`);
          } catch (err) {
            setRows((prev) => prev.map((r) => (r.email === entry.email ? { ...r, role: prevRole } : r)));
            showToast(`Roli se nepodařilo změnit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setSavingEmail(null);
          }
        };

        const handleSetPassword = async (email: string, password: string) => {
          const result = await adminSetPassword(email, password, user.email);
          if (!result.ok) throw new Error(result.error);
          setPasswordTarget(null);
          showToast(`Heslo pro ${email} bylo nastaveno.`);
        };

        const handleDelete = async () => {
          if (!deleteTarget) return;
          const { email } = deleteTarget;
          try {
            await deleteRole(email);
            setRows((prev) => prev.filter((r) => r.email !== email));
            showToast(`Role uživatele ${email} byla odebrána.`);
          } catch (err) {
            showToast(`Nepodařilo se odebrat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          } finally {
            setDeleteTarget(null);
          }
        };

        return (
          <div className="max-w-4xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <UserCog className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Uživatelé</h1>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat uživatele</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-neutral-400 px-1">Zatím žádní uživatelé s přiřazenou rolí. Přidejte prvního tlačítkem výše.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3 w-40">Role</th>
                      <th className="px-4 py-3 w-44">Přiřadil</th>
                      <th className="px-4 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((entry) => {
                      const isSelf = entry.email === (user.email ?? '').toLowerCase();
                      return (
                        <tr key={entry.email} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
                          <td className="px-4 py-3 align-top">
                            <span className="font-semibold text-neutral-900">{entry.email}</span>
                            {isSelf && <span className="ml-2 text-xs text-neutral-400">(vy)</span>}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <select
                              value={entry.role}
                              disabled={savingEmail === entry.email || isSelf}
                              onChange={(e) => handleChangeRole(entry, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-neutral-200 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#c93838]/40 disabled:opacity-60 disabled:cursor-not-allowed"
                              title={isSelf ? 'Vlastní roli nelze měnit' : undefined}
                            >
                              {roleDefs.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <Author by={entry.updatedBy} at={entry.updatedAt} />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => setPasswordTarget(entry.email)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer"
                                aria-label="Nastavit heslo"
                                title="Nastavit heslo"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isSelf}
                                onClick={() => setDeleteTarget(entry)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                aria-label="Odebrat roli"
                                title={isSelf ? 'Vlastní přístup nelze odebrat' : 'Odebrat roli'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <NewUserModal open={addOpen} roleDefs={roleDefs} onClose={() => setAddOpen(false)} onCreate={handleAdd} />

            <SetPasswordModal email={passwordTarget} onClose={() => setPasswordTarget(null)} onSubmit={handleSetPassword} />

            <ConfirmModal
              open={!!deleteTarget}
              title="Odebrat roli"
              message={`Odebrat roli uživateli „${deleteTarget?.email ?? ''}“? Po přihlášení dostane výchozí (nejnižší) oprávnění.`}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
            />
          </div>
        );
      }}
    </RequireAdmin>
  );
}
