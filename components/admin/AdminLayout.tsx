'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, LayoutDashboard, FileText, Users, Settings, LayoutTemplate, Newspaper, Layers, ChevronDown } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import { getRole, type Role } from '@/lib/roles';

interface AdminLayoutProps {
  children: React.ReactNode;
  setActiveTab?: (tab: string) => void;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Přehled', icon: LayoutDashboard, exact: true },
  { href: '/admin/clanky', label: 'Články', icon: Newspaper, exact: false },
];

const PAGES_GROUP_ITEMS = [
  { href: '/admin/pages', label: 'Stránky', icon: FileText },
  { href: '/admin/sekce', label: 'Sekce', icon: Layers },
  { href: '/admin/navigace', label: 'Navigace', icon: LayoutTemplate },
];

export default function AdminLayout({ children, setActiveTab }: AdminLayoutProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const pagesGroupActive = PAGES_GROUP_ITEMS.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const [pagesGroupOpen, setPagesGroupOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        getRole(user.uid).then(setRole).catch(() => setRole('sprava'));
      } else {
        if (setActiveTab) {
          setActiveTab('login');
        } else if (typeof window !== 'undefined') {
          window.location.href = getPathForTab('login');
        }
      }
    });
    return () => unsubscribe();
  }, [setActiveTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (setActiveTab) {
        setActiveTab('home');
      } else if (typeof window !== 'undefined') {
        window.location.href = getPathForTab('home');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!userEmail) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
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

            <button className="flex items-center space-x-3 w-full px-4 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl text-sm font-medium transition-colors">
              <FileText className="w-5 h-5" />
              <span>Kázání a záznamy</span>
            </button>

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
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-neutral-100 h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
