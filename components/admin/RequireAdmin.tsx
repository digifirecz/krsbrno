'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import RequireAuth from '@/components/admin/RequireAuth';
import { getRole } from '@/lib/roles';
import { ShieldAlert } from 'lucide-react';

interface RequireAdminProps {
  children: (user: User) => React.ReactNode;
}

function AdminGate({ user, children }: { user: User; children: (user: User) => React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getRole(user.uid)
      .then((role) => {
        if (active) setAllowed(role === 'admin');
      })
      .catch(() => {
        if (active) setAllowed(false);
      });
    return () => {
      active = false;
    };
  }, [user.uid]);

  if (allowed === null) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold font-serif text-neutral-900">Nemáte oprávnění</h1>
        <p className="text-sm text-neutral-600">Tato sekce je dostupná jen pro účty s rolí administrátor.</p>
      </div>
    );
  }

  return <>{children(user)}</>;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  return <RequireAuth>{(user) => <AdminGate user={user}>{children}</AdminGate>}</RequireAuth>;
}
