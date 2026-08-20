'use client';

import { useEffect, useState } from 'react';
import RequireAdmin from '@/components/admin/RequireAdmin';
import { useToast } from '@/components/admin/ToastProvider';
import { getAllRoles, getRoleDefinitions, setRole, type RoleEntry, type RoleDefinition, type Role } from '@/lib/roles';
import { UserCog } from 'lucide-react';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<RoleEntry[]>([]);
  const [roleDefs, setRoleDefs] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUid, setSavingUid] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllRoles(), getRoleDefinitions()])
      .then(([r, defs]) => {
        setRoles(r);
        setRoleDefs(defs);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChangeRole = async (entry: RoleEntry, role: Role) => {
    setSavingUid(entry.uid);
    try {
      await setRole(entry.uid, entry.email, role);
      setRoles((prev) => prev.map((r) => (r.uid === entry.uid ? { ...r, role } : r)));
      const label = roleDefs.find((d) => d.id === role)?.label || role;
      showToast(`Uživateli ${entry.email} byla nastavena role ${label}.`);
    } catch (err) {
      showToast(`Roli se nepodařilo změnit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <RequireAdmin>
      {() => (
        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Nastavení účtů
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Role určuje, kdo má přístup i k této sekci nastavení. Nové přihlašovací účty se zakládají ve Firebase konzoli, tady se jim jen přiřazuje role.
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {roles.map((entry) => (
                <div
                  key={entry.uid}
                  className="flex items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl gap-4 flex-wrap"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                      <UserCog className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-neutral-900 truncate">{entry.email}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {roleDefs.map((def) => (
                      <button
                        key={def.id}
                        type="button"
                        disabled={savingUid === entry.uid}
                        onClick={() => handleChangeRole(entry, def.id as Role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors disabled:opacity-60 ${
                          entry.role === def.id
                            ? 'bg-[#c93838] text-white'
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:border-[#c93838]/50'
                        }`}
                      >
                        {def.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </RequireAdmin>
  );
}
