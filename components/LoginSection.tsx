'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff, UserCheck } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import { login } from '@/lib/actions/auth';

interface LoginSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function LoginSection({ setActiveTab }: LoginSectionProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNavigateHome = (e?: React.MouseEvent) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
      return;
    }
    if (e) {
      e.preventDefault();
    }
    if (setActiveTab) {
      setActiveTab('home');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Prosím vyplňte e-mail i heslo.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      setIsLoading(false);
      if (!result.ok) {
        setErrorMessage(result.error || 'Při přihlašování došlo k chybě. Zkuste to prosím znovu.');
        return;
      }
      router.push('/admin');
    } catch {
      setIsLoading(false);
      setErrorMessage('Při přihlašování došlo k chybě. Zkuste to prosím znovu.');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 min-h-[75vh] flex flex-col justify-center items-center font-sans">
      
      {/* Back button link */}
      <div className="w-full max-w-md mb-6 flex items-center">
        <a
          href={getPathForTab('home')}
          onClick={handleNavigateHome}
          className="inline-flex items-center space-x-2 text-sm font-medium text-neutral-600 hover:text-[#c93838] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zpět na hlavní stránku</span>
        </a>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/40 space-y-7">
        
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Přihlášení do administrace
          </h1>
          <p className="text-sm text-neutral-600">
            Zadejte své přihlašovací údaje
          </p>
        </div>

        {/* Success State */}
        {successMessage ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-950">Přihlášení úspěšné</h3>
              <p className="text-emerald-800 text-sm">{successMessage}</p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleNavigateHome}
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl text-sm transition-colors text-center cursor-pointer shadow-sm"
              >
                Přejít na úvodní stránku
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-red-800 text-xs sm:text-sm animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                E-mailová adresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Heslo
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#c93838] hover:underline"
                >
                  Zapomněli jste heslo?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#c93838] hover:bg-[#b02f2f] text-white font-semibold rounded-xl text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Přihlásit se</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
