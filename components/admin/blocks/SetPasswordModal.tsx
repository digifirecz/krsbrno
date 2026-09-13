'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SetPasswordModalProps {
  email: string | null;
  onClose: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function SetPasswordModal({ email, onClose, onSubmit }: SetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!email) return;
    setPassword('');
    setError('');
    setSubmitting(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [email, onClose]);

  if (!email) return null;

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Heslo se nepodařilo nastavit.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer" onClick={onClose}>
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold font-serif">Nastavit heslo</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-600">
          Nové heslo pro <span className="font-semibold text-neutral-900">{email}</span>.
        </p>

        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-1">Nové heslo</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="alespoň 8 znaků"
            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
            autoFocus
          />
        </div>

        {error && <p className="text-xs font-medium text-[#c93838]">{error}</p>}

        <div className="flex justify-end space-x-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#c93838] hover:bg-[#b02f2f] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Ukládám…' : 'Nastavit heslo'}
          </button>
        </div>
      </div>
    </div>
  );
}
