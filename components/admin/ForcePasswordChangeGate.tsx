'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';

export default function ForcePasswordChangeGate() {
  const router = useRouter();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-[75vh] flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/40 space-y-7">
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Je potřeba změnit heslo
          </h1>
          <p className="text-sm text-neutral-600">
            Vaše heslo bylo nastaveno administrátorem. Než budete pokračovat, nastavte si prosím vlastní heslo.
          </p>
        </div>
        <ChangePasswordForm submitLabel="Nastavit heslo a pokračovat" onSuccess={() => router.refresh()} className="w-full" />
      </div>
    </div>
  );
}
