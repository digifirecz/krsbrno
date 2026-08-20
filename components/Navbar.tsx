'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import { auth } from '@/lib/firebase';
import { PAGE_ID_TO_TAB } from '@/lib/blocks/pageRegistry';
import { getIcon } from '@/lib/blocks/icons';
import { useNavConfig } from '@/lib/useNavConfig';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';
import type { PageNavEntry } from '@/lib/pages';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function tabFor(entry: PageNavEntry): string {
  return PAGE_ID_TO_TAB[entry.id] || entry.id;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Set<string>>(new Set());

  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navConfig = useNavConfig();
  const siteSettings = useSiteSettings();
  const logo = siteSettings?.logo || DEFAULT_SITE_SETTINGS.logo;
  const logoAlt = siteSettings?.logoAlt || DEFAULT_SITE_SETTINGS.logoAlt;
  const navRef = useRef<HTMLDivElement>(null);

  const headerEntries = navConfig ? [...navConfig.values()].filter((e) => e.showInHeader) : [];
  const groupedEntries = new Map<string, { label: string; items: PageNavEntry[] }>();
  const standaloneEntries: PageNavEntry[] = [];
  headerEntries.forEach((entry) => {
    if (entry.headerGroupId) {
      const bucket = groupedEntries.get(entry.headerGroupId) || { label: entry.headerGroupLabel, items: [] };
      bucket.items.push(entry);
      groupedEntries.set(entry.headerGroupId, bucket);
    } else {
      standaloneEntries.push(entry);
    }
  });
  const groups = [...groupedEntries.entries()];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (tab: string, e?: React.MouseEvent) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
      // Allow opening in new tab
      return;
    }
    if (e) {
      e.preventDefault();
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setOpenGroup(null);
  };

  const toggleMobileGroup = (group: string) => {
    setMobileOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80' : 'bg-white border-b border-neutral-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a
            href={getPathForTab('home')}
            onClick={(e) => handleNavigate('home', e)}
            className="flex items-center text-left focus:outline-none group py-1 transition-transform duration-300 hover:scale-105 cursor-pointer"
            id="nav-logo"
            aria-label="Křesťanský sbor Brno - Domů"
          >
            <div className="relative h-9 sm:h-11 w-48 sm:w-56">
              <Image
                src={logo}
                alt={logoAlt}
                fill
                unoptimized
                className="object-contain object-left"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-1 lg:space-x-2">

            {/* Úvod */}
            <a
              href={getPathForTab('home')}
              onClick={(e) => handleNavigate('home', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-home"
            >
              Úvod
            </a>

            {/* Dynamic dropdown groups */}
            {groups.map(([groupId, { label: groupLabel, items }]) => {
              const isActive = items.some((i) => tabFor(i) === activeTab);
              const isOpen = openGroup === groupId;
              return (
                <div
                  key={groupId}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(groupId)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenGroup((prev) => (prev === groupId ? null : groupId));
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
                    type="button"
                    aria-expanded={isOpen}
                  >
                    <span>{groupLabel}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1.5 w-56 z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-neutral-200/90 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        {items.map((item) => {
                          const ItemIcon = getIcon(item.headerIcon) || FileText;
                          return (
                            <a
                              key={item.id}
                              href={getPathForTab(tabFor(item))}
                              onClick={(e) => handleNavigate(tabFor(item), e)}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#c93838] font-medium transition-colors flex items-center space-x-2.5 cursor-pointer ${activeTab === tabFor(item) ? 'text-[#c93838] bg-red-50/60 font-semibold' : 'text-neutral-700'}`}
                            >
                              <ItemIcon className="w-4 h-4 text-[#c93838]" />
                              <span>{item.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Kázání */}
            <a
              href={getPathForTab('sermons')}
              onClick={(e) => handleNavigate('sermons', e)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === 'sermons' ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              id="nav-sermons"
            >
              Kázání
            </a>

            {/* Standalone (ungrouped) header items */}
            {standaloneEntries.map((item) => (
              <a
                key={item.id}
                href={getPathForTab(tabFor(item))}
                onClick={(e) => handleNavigate(tabFor(item), e)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === tabFor(item) ? 'text-[#c93838] bg-red-50/90 font-semibold' : 'text-neutral-700 hover:text-[#c93838] hover:bg-neutral-50'}`}
              >
                {item.label}
              </a>
            ))}

            {isLoggedIn && (
              <a
                href="/admin"
                className="ml-2 inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-bold bg-[#c93838] text-white hover:bg-[#b02f2f] transition-colors cursor-pointer"
                id="nav-admin"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administrace</span>
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-neutral-700 hover:text-[#c93838] hover:bg-neutral-100 focus:outline-none cursor-pointer"
              aria-label="Otevřít menu"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl">
          <a
            href={getPathForTab('home')}
            onClick={(e) => handleNavigate('home', e)}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#c93838] bg-red-50' : 'text-neutral-900 hover:bg-neutral-50'}`}
          >
            Úvod
          </a>

          {groups.map(([groupId, { label: groupLabel, items }]) => {
            const isOpen = mobileOpenGroups.has(groupId);
            return (
              <div key={groupId} className="border-t border-neutral-100 pt-1.5 pb-1">
                <button
                  onClick={() => toggleMobileGroup(groupId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-xs text-neutral-500">{groupLabel}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#c93838]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-100 ml-3 mt-1">
                    {items.map((item) => {
                      const ItemIcon = getIcon(item.headerIcon) || FileText;
                      return (
                        <a
                          key={item.id}
                          href={getPathForTab(tabFor(item))}
                          onClick={(e) => handleNavigate(tabFor(item), e)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${activeTab === tabFor(item) ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-700 hover:bg-neutral-50'}`}
                        >
                          <ItemIcon className="w-4 h-4 text-[#c93838]" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="border-t border-neutral-100 pt-1">
            <a
              href={getPathForTab('sermons')}
              onClick={(e) => handleNavigate('sermons', e)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === 'sermons' ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-900 hover:bg-neutral-50'}`}
            >
              Kázání
            </a>
            {standaloneEntries.map((item) => (
              <a
                key={item.id}
                href={getPathForTab(tabFor(item))}
                onClick={(e) => handleNavigate(tabFor(item), e)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${activeTab === tabFor(item) ? 'text-[#c93838] bg-red-50 font-bold' : 'text-neutral-900 hover:bg-neutral-50'}`}
              >
                {item.label}
              </a>
            ))}

            {isLoggedIn && (
              <a
                href="/admin"
                className="mt-2 flex items-center justify-center space-x-2 w-full px-3 py-2.5 rounded-lg text-sm font-bold bg-[#c93838] text-white hover:bg-[#b02f2f] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administrace</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
