'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import NewPageModal from '@/components/admin/NewPageModal';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { MANAGEABLE_PAGES } from '@/lib/blocks/pageRegistry';
import {
  getCustomPages,
  createPage,
  getNavGroups,
  createNavGroup,
  deleteNavGroup,
  type CustomPage,
  type NavGroup,
} from '@/lib/pages';
import { ChevronRight, FileText, Files, Tag, Plus, X, Lock } from 'lucide-react';

export default function AdminPagesListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [groups, setGroups] = useState<NavGroup[]>([]);
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [groupError, setGroupError] = useState('');
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<NavGroup | null>(null);

  useEffect(() => {
    getCustomPages()
      .then(setCustomPages)
      .catch(() => setCustomPages([]));
  }, []);

  useEffect(() => {
    getNavGroups()
      .then(setGroups)
      .catch(() => setGroups([]));
  }, []);

  const handleCreate = async (label: string, createdBy?: string | null) => {
    const slug = await createPage(label, createdBy);
    showToast('Stránka byla vytvořena.');
    router.push(`/admin/pages/${slug}`);
  };

  const handleCreateGroup = async () => {
    setGroupError('');
    try {
      const group = await createNavGroup(newGroupLabel);
      setGroups((prev) => [...prev, group]);
      setNewGroupLabel('');
      showToast('Skupina byla vytvořena.');
    } catch (err) {
      setGroupError(err instanceof Error ? err.message : 'Skupinu se nepodařilo vytvořit.');
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteGroupTarget) return;
    try {
      await deleteNavGroup(deleteGroupTarget.id);
      setGroups((prev) => prev.filter((g) => g.id !== deleteGroupTarget.id));
      setDeleteGroupTarget(null);
      showToast('Skupina byla smazána.');
    } catch (err) {
      setDeleteGroupTarget(null);
      showToast(`Skupinu se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    }
  };

  const allPages = [...MANAGEABLE_PAGES, ...customPages].sort((a, b) => Number(a.id) - Number(b.id));

  return (
    <RequireAuth>
      {(user) => (
        <div className="max-w-4xl">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                <Files className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                  Správa stránek
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Vyberte stránku, jejíž obsah chcete upravit.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nová stránka</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allPages.map((page) => (
              <div
                key={page.id}
                className="group flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-[#c93838]/50 hover:shadow-sm transition-all"
              >
                <Link href={`/admin/pages/${page.id}`} className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#c93838] group-hover:text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-neutral-900 truncate">{page.label}</span>
                  {page.protected && (
                    <span title="Nelze smazat" className="text-neutral-300 shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Link>
                <Link href={`/admin/pages/${page.id}`} className="p-2 rounded-lg text-neutral-400 hover:text-[#c93838] shrink-0">
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Skupiny */}
          <div className="mt-10">
            <div className="flex items-center space-x-2 mb-3 px-1">
              <Tag className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Skupiny</h2>
            </div>

            <div className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl space-y-3">
              {groups.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {groups.map((group) => (
                    <span
                      key={group.id}
                      className="inline-flex items-center space-x-1.5 pl-3 pr-1.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-700"
                    >
                      <span>{group.label}</span>
                      <button
                        type="button"
                        onClick={() => setDeleteGroupTarget(group)}
                        className="p-1 rounded-md text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer"
                        aria-label={`Smazat skupinu ${group.label}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateGroup();
                  }}
                  placeholder="Název nové skupiny, např. Kdo jsme"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
                />
                <button
                  type="button"
                  disabled={!newGroupLabel.trim()}
                  onClick={handleCreateGroup}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-800 text-white text-sm font-bold hover:bg-neutral-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Založit</span>
                </button>
              </div>
              {groupError && <p className="text-xs font-medium text-[#c93838]">{groupError}</p>}
            </div>

            <p className="text-xs text-neutral-400 mt-2 px-1">
              Skupinu ke stránce přiřadíte v jejím editoru. Stránky se stejnou skupinou se v hlavičce webu sloučí pod jedno rozbalovací menu.
            </p>
          </div>

          <NewPageModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreate={(label) => handleCreate(label, user.email)}
          />

          <ConfirmModal
            open={deleteGroupTarget !== null}
            title="Smazat skupinu"
            message={`Opravdu chcete skupinu „${deleteGroupTarget?.label}“ smazat ze seznamu? Půjde vybrat jen u nových přiřazení – stránky, které do ní už patří, se v menu dál zobrazují pohromadě.`}
            onCancel={() => setDeleteGroupTarget(null)}
            onConfirm={handleDeleteGroup}
          />
        </div>
      )}
    </RequireAuth>
  );
}
