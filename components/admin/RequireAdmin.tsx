'use client';

import RequireAuth from '@/components/admin/RequireAuth';
import type { SessionUser } from '@/lib/auth/session';
import { ShieldAlert } from 'lucide-react';

interface RequireAdminProps {
  children: (user: SessionUser) => React.ReactNode;
}

function AdminGate({ user, children }: { user: SessionUser; children: (user: SessionUser) => React.ReactNode }) {
  if (user.role !== 'admin') {
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
