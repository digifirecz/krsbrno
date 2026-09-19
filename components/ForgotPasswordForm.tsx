'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '@/lib/actions/auth';
import { isValidEmail } from '@/lib/validation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [done, setDone] = useState(false);

  const emailInvalid = emailTouched && email !== '' && !isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!isValidEmail(email)) {
      setEmailTouched(true);
      setErrorMessage('Zadejte platnou e-mailovou adresu.');
      return;
    }
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setDone(true);
    } catch {
      setErrorMessage('Při odesílání e-mailu došlo k chybě. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-emerald-950">Odkaz odeslán</h3>
          <p className="text-emerald-800 text-sm">
            Pokud účet s tímto e-mailem existuje, byl na něj odeslán odkaz pro obnovu hesla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">E-mailová adresa</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            aria-invalid={emailInvalid}
            placeholder="např. clen@krsbrno.cz"
            className={`w-full pl-10 pr-4 py-3 bg-neutral-50/50 border rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all placeholder:text-neutral-400 ${
              emailInvalid ? 'border-[#c93838]' : 'border-neutral-200'
            }`}
            autoFocus
          />
        </div>
        {emailInvalid && <p className="text-xs font-medium text-[#c93838]">Zadejte platnou e-mailovou adresu.</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 bg-[#c93838] hover:bg-[#b02f2f] text-white font-semibold rounded-xl text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center cursor-pointer disabled:opacity-70"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>Odeslat odkaz pro obnovu hesla</span>
        )}
      </button>
    </form>
  );
}
