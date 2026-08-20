'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPathForTab } from '@/lib/routes';

interface AdminSiteChromeProps {
  children: React.ReactNode;
}

/**
 * Wraps the standalone /admin/* routes (pages, clanky, navigace, users — anything
 * outside the ChurchApp SPA) with the same public site header/footer that ChurchApp
 * renders, so the header/footer stay visible while navigating through administration.
 */
export default function AdminSiteChrome({ children }: AdminSiteChromeProps) {
  const router = useRouter();

  const setActiveTab = (tab: string) => {
    router.push(getPathForTab(tab));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="admin" setActiveTab={setActiveTab} />
      <main className="flex-grow">{children}</main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
