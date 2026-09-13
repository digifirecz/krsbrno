'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { RoleDefinition } from '@/lib/roles';

interface NewUserModalProps {
  open: boolean;
  roleDefs: RoleDefinition[];
  onClose: () => void;
  onCreate: (email: string, role: string) => Promise<void>;
}

export default function NewUserModal({ open, roleDefs, onClose, onCreate }: NewUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('sprava');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEmail('');
    setRole(roleDefs.find((d) => d.id === 'sprava')?.id ?? roleDefs[0]?.id ?? 'sprava');
    setError('');
    setSubmitting(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, roleDefs, onClose]);

  if (!open) return null;

  const handleSubmit = async () => {
    const e = email.trim().toLowerCase();
    if (!e.includes('@')) {
      setError('Zadejte platný e-mail.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onCreate(e, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uživatele se nepodařilo přidat.');
      setSubmitting(false);
    }
  };

  const fieldClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer" onClick={onClose}>
      <div
        className="bg-white text-neutral-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold font-serif">Nový uživatel</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="jan.novak@email.cz"
            className={fieldClass}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-1">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
            {roleDefs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-neutral-400">
          Přiřadíte jen roli — účet si heslo nastaví sám přes „Zapomněli jste heslo?“ na přihlašovací stránce, nebo mu ho můžete rovnou nastavit v tabulce uživatelů.
        </p>
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
            {submitting ? 'Přidávám…' : 'Přidat uživatele'}
          </button>
        </div>
      </div>
    </div>
  );
}
