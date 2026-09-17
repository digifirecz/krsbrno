'use client';

import RequireAuth from '@/components/admin/RequireAuth';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import { KeyRound } from 'lucide-react';

export default function AdminAccountPage() {
  return (
    <RequireAuth>
      {(user) => (
        <div className="max-w-2xl space-y-8">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 font-serif tracking-tight">Můj účet</h1>
            <p className="text-sm text-neutral-600 mt-1">{user.email}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900 font-serif">Změnit heslo</h2>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
