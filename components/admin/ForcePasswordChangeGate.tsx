'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';

export default function ForcePasswordChangeGate() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2.5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-serif tracking-tight">
          Je potřeba změnit heslo
        </h1>
        <p className="text-sm text-neutral-600">
          Vaše heslo bylo nastaveno administrátorem. Než budete pokračovat, nastavte si prosím vlastní heslo.
        </p>
      </div>
      <ChangePasswordForm submitLabel="Nastavit heslo a pokračovat" onSuccess={() => router.refresh()} />
    </div>
  );
}
