import { Lock, AlertCircle } from 'lucide-react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-[75vh] flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/40 space-y-7">
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Nastavení nového hesla
          </h1>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
            <span>Odkaz pro obnovu hesla chybí nebo je neplatný.</span>
          </div>
        )}
      </div>
    </div>
  );
}
