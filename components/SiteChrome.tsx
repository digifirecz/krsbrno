'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPathForTab } from '@/lib/routes';

interface SiteChromeProps {
  children: React.ReactNode;
  activeTab: string;
}

/**
 * Wraps a standalone route (outside the ChurchApp SPA — /admin/*, /login/*
 * auth pages) with the same public site header/footer that ChurchApp renders,
 * so the header/footer stay visible while navigating through it.
 */
export default function SiteChrome({ children, activeTab }: SiteChromeProps) {
  const router = useRouter();

  const setActiveTab = (tab: string) => {
    router.push(getPathForTab(tab));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow">{children}</main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
