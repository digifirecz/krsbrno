'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { LogOut, LayoutDashboard, FileText, Users, Settings, LayoutTemplate, Newspaper, Layers, ChevronDown, AudioLines, Tag, Mic, MessageSquare } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import type { Role } from '@/lib/roles';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: { email: string; role: Role };
  setActiveTab?: (tab: string) => void;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Přehled', icon: LayoutDashboard, exact: true },
  { href: '/admin/clanky', label: 'Články', icon: Newspaper, exact: false },
  { href: '/admin/oznamy', label: 'Oznamy', icon: MessageSquare, exact: false },
];

const PAGES_GROUP_ITEMS = [
  { href: '/admin/pages', label: 'Stránky', icon: FileText },
  { href: '/admin/kategorie-stranek', label: 'Kategorie', icon: Tag },
  { href: '/admin/sekce', label: 'Sekce', icon: Layers },
  { href: '/admin/navigace', label: 'Navigace', icon: LayoutTemplate },
];

const SERMONS_GROUP_ITEMS = [
  { href: '/admin/zaznamy', label: 'Záznamy', icon: AudioLines },
  { href: '/admin/kategorie-zaznamu', label: 'Kategorie', icon: Tag },
  { href: '/admin/recnici-zaznamu', label: 'Řečníci', icon: Mic },
];

export default function AdminLayout({ children, user, setActiveTab }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const userEmail = user.email;
  const role = user.role;
  const pagesGroupActive = PAGES_GROUP_ITEMS.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const [pagesGroupOpen, setPagesGroupOpen] = useState(true);
  const sermonsGroupActive = SERMONS_GROUP_ITEMS.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const [sermonsGroupOpen, setSermonsGroupOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    if (setActiveTab) {
      setActiveTab('home');
    } else {
      router.push(getPathForTab('home'));
    }
  };

  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex flex-col h-full space-y-1">
            <div className="mb-6 px-4 py-2">
              <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Administrace</h2>
              <p className="text-xs text-neutral-600 mt-1 truncate" title={userEmail}>{userEmail}</p>
            </div>

            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-red-50 text-[#c93838]'
                      : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div>
              <button
                type="button"
                onClick={() => setSermonsGroupOpen((v) => !v)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  sermonsGroupActive
                    ? 'text-[#c93838]'
                    : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <AudioLines className="w-5 h-5" />
                  <span>Záznamy</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${sermonsGroupOpen ? '' : '-rotate-90'}`} />
              </button>

              {sermonsGroupOpen && (
                <div className="pl-4 space-y-1 pt-1">
                  {SERMONS_GROUP_ITEMS.map((item) => {
                    const active = isActive(item.href, false);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                          active
                            ? 'bg-red-50 text-[#c93838] font-semibold'
                            : 'text-neutral-500 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setPagesGroupOpen((v) => !v)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  pagesGroupActive
                    ? 'text-[#c93838]'
                    : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" />
                  <span>Správa stránek</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${pagesGroupOpen ? '' : '-rotate-90'}`} />
              </button>

              {pagesGroupOpen && (
                <div className="pl-4 space-y-1 pt-1">
                  {PAGES_GROUP_ITEMS.map((item) => {
                    const active = isActive(item.href, false);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                          active
                            ? 'bg-red-50 text-[#c93838] font-semibold'
                            : 'text-neutral-500 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {role === 'admin' && (
              <Link
                href="/admin/users"
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive('/admin/users', false)
                    ? 'bg-red-50 text-[#c93838]'
                    : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Uživatelé</span>
              </Link>
            )}

            <Link
              href="/admin/nastaveni"
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isActive('/admin/nastaveni', false)
                  ? 'bg-red-50 text-[#c93838]'
                  : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Nastavení stránky</span>
            </Link>

            <div className="mt-auto pt-8">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-500 hover:bg-neutral-50 hover:text-[#c93838] rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Odhlásit se</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100 h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
