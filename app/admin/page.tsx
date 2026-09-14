'use client';

import { useState, useEffect } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import { Files, Users, LayoutTemplate, Newspaper, Layers } from 'lucide-react';
import { getAllRoles } from '@/lib/actions/roles';
import { getNavConfig } from '@/lib/actions/pages';
import { getAllArticlesForAdmin } from '@/lib/actions/articles';
import { getSections } from '@/lib/actions/sections';
import { MANAGEABLE_PAGES } from '@/lib/blocks/pageRegistry';

interface DashboardStats {
  pages: number;
  articles: number;
  navItems: number;
  users: number;
  sections: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let active = true;
    const staticIds = new Set(MANAGEABLE_PAGES.map((p) => p.id));
    Promise.all([getAllArticlesForAdmin(), getNavConfig(), getAllRoles(), getSections()])
      .then(([articles, navConfig, roles, sections]) => {
        if (!active) return;
        const customCount = navConfig.filter((p) => !staticIds.has(p.id)).length;
        setStats({
          pages: MANAGEABLE_PAGES.length + customCount,
          articles: articles.length,
          navItems: navConfig.filter((p) => p.showInHeader || p.showInFooter).length,
          users: roles.length,
          sections: sections.length,
        });
      })
      .catch(() => {
        if (active) setStats({ pages: 0, articles: 0, navItems: 0, users: 0, sections: 0 });
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <RequireAuth>
      {(user) => (
        <>
          <h1 className="text-3xl font-extrabold text-neutral-900 font-serif mb-2">
            Vítejte v administraci
          </h1>
          <p className="text-neutral-500 mb-8">
            Rychlý přehled obsahu webu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/admin/pages"
          className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex items-center space-x-4 hover:border-[#c93838]/50 hover:bg-red-50/20 transition-colors"
        >
          <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] shrink-0">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-neutral-900 font-serif leading-none">
              {stats ? stats.pages : '…'}
            </p>
            <p className="text-sm text-neutral-500 mt-1.5">Stránek</p>
          </div>
        </a>
        <a
          href="/admin/sekce"
          className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex items-center space-x-4 hover:border-[#c93838]/50 hover:bg-red-50/20 transition-colors"
        >
          <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-neutral-900 font-serif leading-none">
              {stats ? stats.sections : '…'}
            </p>
            <p className="text-sm text-neutral-500 mt-1.5">Sekcí</p>
          </div>
        </a>
        <a
          href="/admin/clanky"
          className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex items-center space-x-4 hover:border-[#c93838]/50 hover:bg-red-50/20 transition-colors"
        >
          <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-neutral-900 font-serif leading-none">
              {stats ? stats.articles : '…'}
            </p>
            <p className="text-sm text-neutral-500 mt-1.5">Článků</p>
          </div>
        </a>
        <a
          href="/admin/navigace"
          className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex items-center space-x-4 hover:border-[#c93838]/50 hover:bg-red-50/20 transition-colors"
        >
          <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] shrink-0">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-neutral-900 font-serif leading-none">
              {stats ? stats.navItems : '…'}
            </p>
            <p className="text-sm text-neutral-500 mt-1.5">Položek v navigaci</p>
          </div>
        </a>
        {user.role === 'admin' && (
          <a
            href="/admin/users"
            className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex items-center space-x-4 hover:border-[#c93838]/50 hover:bg-red-50/20 transition-colors"
          >
            <div className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-xl flex items-center justify-center text-[#c93838] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-900 font-serif leading-none">
                {stats ? stats.users : '…'}
              </p>
              <p className="text-sm text-neutral-500 mt-1.5">Uživatelů</p>
            </div>
          </a>
        )}
          </div>
        </>
      )}
    </RequireAuth>
  );
}
