import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { getPathForTab } from '@/lib/routes';

export default function ForgotPasswordPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-[75vh] flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md mb-6 flex items-center">
        <Link
          href={getPathForTab('login')}
          className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět na přihlášení</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/40 space-y-7">
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Zapomenuté heslo
          </h1>
          <p className="text-sm text-neutral-600">Zadejte svůj e-mail a pošleme vám odkaz pro obnovu hesla.</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
