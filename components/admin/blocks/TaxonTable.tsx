'use client';

import { useState } from 'react';
import { Check, X, Pencil, Trash2 } from 'lucide-react';
import type { SermonTaxon } from '@/lib/sermons';

interface TaxonTableProps {
  items: SermonTaxon[];
  /** Header label for the first column ("Kategorie" / "Jméno"). */
  nameLabel: string;
  onRename: (id: string, name: string) => Promise<void> | void;
  onDelete: (item: SermonTaxon) => void;
}

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// A single cell holding two lines: who (dark) over when (muted).
function AuthorCell({ by, at }: { by?: string | null; at?: Date | null }) {
  if (!by && !at) return <span className="text-neutral-300">—</span>;
  return (
    <div className="leading-tight">
      <div className="text-neutral-800 truncate">{by || '—'}</div>
      <div className="text-xs text-neutral-400">{fmtDate(at)}</div>
    </div>
  );
}

// True only if the row was actually edited after creation (we stamp
// updated = created on insert, so equal timestamps mean "never edited").
function wasEdited(t: SermonTaxon): boolean {
  if (!t.updatedAt || !t.createdAt) return false;
  const u = t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt);
  const c = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
  return u.getTime() - c.getTime() > 1000;
}

export default function TaxonTable({ items, nameLabel, onRename, onDelete }: TaxonTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (t: SermonTaxon) => {
    setEditId(t.id);
    setEditName(t.name);
  };

  const commit = async (id: string) => {
    const name = editName.trim();
    setEditId(null);
    if (name) await onRename(id, name);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-200">
            <th className="px-4 py-3">{nameLabel}</th>
            <th className="px-4 py-3">Přidal</th>
            <th className="px-4 py-3">Upravil</th>
            <th className="px-4 py-3 w-24 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
              <td className="px-4 py-3 align-top">
                {editId === t.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commit(t.id);
                      if (e.key === 'Escape') setEditId(null);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30"
                  />
                ) : (
                  <span className="font-semibold text-neutral-900">{t.name}</span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <AuthorCell by={t.createdBy} at={t.createdAt} />
              </td>
              <td className="px-4 py-3 align-top">
                {wasEdited(t) ? <AuthorCell by={t.updatedBy} at={t.updatedAt} /> : <span className="text-neutral-300">—</span>}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center justify-end space-x-1">
                  {editId === t.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => commit(t.id)}
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 cursor-pointer"
                        aria-label="Uložit"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditId(null)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 cursor-pointer"
                        aria-label="Zrušit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(t)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                        aria-label="Přejmenovat"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(t)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer"
                        aria-label="Smazat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
