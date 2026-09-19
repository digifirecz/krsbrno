'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { changePassword } from '@/lib/actions/auth';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  submitLabel?: string;
  className?: string;
}

export default function ChangePasswordForm({ onSuccess, submitLabel = 'Změnit heslo', className = 'max-w-sm' }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Nové heslo musí mít alespoň 8 znaků.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Nové heslo a jeho potvrzení se neshodují.');
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (!result.ok) {
        setError(result.error || 'Změnu hesla se nepodařilo dokončit.');
        return;
      }
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.();
    } catch {
      setError('Změnu hesla se nepodařilo dokončit. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <p className="text-sm font-semibold text-emerald-900">Heslo bylo úspěšně změněno.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 font-sans ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-[#c93838] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">Současné heslo</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPasswords ? 'text' : 'password'}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">Nové heslo</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPasswords ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-10 pr-11 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
            tabIndex={-1}
            aria-label={showPasswords ? 'Skrýt hesla' : 'Zobrazit hesla'}
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">Potvrzení nového hesla</label>
        <input
          type={showPasswords ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/20 focus:border-[#c93838] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 bg-[#c93838] hover:bg-[#b02f2f] text-white font-semibold rounded-xl text-sm shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-70"
      >
        {loading ? 'Ukládám…' : submitLabel}
      </button>
    </form>
  );
}
