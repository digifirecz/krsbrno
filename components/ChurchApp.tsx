'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Meetings from '@/components/Meetings';
import GroupsSection from '@/components/GroupsSection';
import SermonsSection from '@/components/SermonsSection';
import BeliefsSection from '@/components/BeliefsSection';
import HistoryLeadershipSection from '@/components/HistoryLeadershipSection';
import EventsSection from '@/components/EventsSection';
import SupportSection from '@/components/SupportSection';
import ContactSection from '@/components/ContactSection';
import LibraryDen from '@/components/LibraryDen';
import YouthSection from '@/components/YouthSection';
import TeensSection from '@/components/TeensSection';
import ManagementSection from '@/components/ManagementSection';
import LeadershipSection from '@/components/LeadershipSection';
import ConfessionSection from '@/components/ConfessionSection';
import LoginSection from '@/components/LoginSection';
import CustomPageSection from '@/components/CustomPageSection';
import QuoteBanner from '@/components/QuoteBanner';
import Footer from '@/components/Footer';
import { getPathForTab, getTabFromPath, getTitleForTab, preloadPageSlugs, resolveDynamicSlug } from '@/lib/routes';
import { useHomePageId } from '@/lib/useHomePageId';

const KNOWN_TABS = new Set([
  'home', 'about', 'beliefs', 'confession', 'history', 'management', 'leadership',
  'groups', 'kids', 'youth', 'teens', 'meetings', 'library', 'sermons', 'contact',
  'support', 'events', 'login',
]);

interface ChurchAppProps {
  initialTab?: string;
}

async function resolvePathToTab(pathname: string): Promise<string> {
  const dynamic = await resolveDynamicSlug(pathname).catch(() => null);
  if (dynamic) return dynamic.tab;
  return getTabFromPath(pathname);
}

export default function ChurchApp({ initialTab = 'home' }: ChurchAppProps) {
  const [activeTab, setActiveTabState] = useState<string>(initialTab);
  const homePageId = useHomePageId();

  // Warm the dynamic-page slug cache used by getPathForTab() for managed pages.
  useEffect(() => {
    preloadPageSlugs().catch(() => {});
  }, []);

  // Sync state from URL pathname on client load and browser Back/Forward (popstate)
  useEffect(() => {
    let active = true;

    // If browser URL has a pathname, initialize tab from current URL
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      resolvePathToTab(currentPath).then((currentTab) => {
        if (!active) return;
        if (currentTab && currentTab !== activeTab) {
          setActiveTabState(currentTab);
          document.title = getTitleForTab(currentTab);
        }
      });
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      resolvePathToTab(currentPath).then((resolvedTab) => {
        if (!active) return;
        setActiveTabState(resolvedTab);
        document.title = getTitleForTab(resolvedTab);
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      active = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update browser URL and document title when activeTab changes
  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    const targetPath = getPathForTab(tab);
    
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
      document.title = getTitleForTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">

      {/* Sticky Top Header with live URL synchronization */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Body depending on selection */}
      <main className="flex-grow">

        {/* 1. Úvod (Home Page) */}
        {activeTab === 'home' && (
          <div>
            {homePageId ? (
              <CustomPageSection
                pageId={homePageId}
                fallback={
                  <>
                    <Hero setActiveTab={setActiveTab} />
                    <Meetings isHomePage setActiveTab={setActiveTab} />
                  </>
                }
              />
            ) : (
              <>
                <Hero setActiveTab={setActiveTab} />
                <Meetings isHomePage={true} setActiveTab={setActiveTab} />
              </>
            )}

            {/* Výchozí (needitovatelný) úvod nemá vlastní blok s články, tak se sem doplní natvrdo.
                Vlastní stránka Úvod si "Seznam článků" přidává jako blok sama, aby nešlo o duplicitu. */}
            {!homePageId && <EventsSection />}

            {!homePageId && (
              <QuoteBanner
                quote="„Z jednoho člověka učinil celé lidstvo, aby žilo na celém zemském povrchu. Vyměřil jim určená období a hranice jejich života, aby hledali Boha, zda by se ho snad mohli dotknout a nalézt ho – ačkoli není daleko od žádného z nás.“"
                citation="Skutky 17:26-27 (Bible)"
              />
            )}
          </div>
        )}

        {/* 2. Kdo jsme */}
        {activeTab === 'about' && (
          <HistoryLeadershipSection />
        )}

        {/* 2.1 Čemu věříme */}
        {activeTab === 'beliefs' && (
          <BeliefsSection />
        )}

        {/* 2.1b Naše vyznání */}
        {activeTab === 'confession' && (
          <ConfessionSection />
        )}

        {/* 2.2 Naše historie */}
        {activeTab === 'history' && (
          <HistoryLeadershipSection />
        )}

        {/* 2.3 Kdo spravuje sbor */}
        {activeTab === 'management' && (
          <ManagementSection />
        )}

        {/* 2.4 Kdo nás vede */}
        {activeTab === 'leadership' && (
          <LeadershipSection />
        )}

        {/* 3. Co děláme / Program */}
        {(activeTab === 'groups' || activeTab === 'kids') && (
          <div className="py-8 space-y-12">
            <GroupsSection initialGroupId="besidka" />
            <EventsSection />
          </div>
        )}

        {/* 3.1 Mládež - Elevate */}
        {activeTab === 'youth' && (
          <YouthSection />
        )}

        {/* 3.2 Dorost - Poutníci */}
        {activeTab === 'teens' && (
          <TeensSection />
        )}

        {/* 3.3 Společná setkávání */}
        {activeTab === 'meetings' && (
          <Meetings setActiveTab={setActiveTab} />
        )}

        {/* 3.4 Knihovna DEN */}
        {activeTab === 'library' && (
          <LibraryDen />
        )}

        {/* 4. Kázání */}
        {activeTab === 'sermons' && (
          <SermonsSection />
        )}

        {/* 5. Kontakt */}
        {activeTab === 'contact' && (
          <ContactSection />
        )}

        {/* 6. Podpora */}
        {activeTab === 'support' && (
          <SupportSection />
        )}

        {/* 7. Akce */}
        {activeTab === 'events' && (
          <div className="py-8">
            <EventsSection />
          </div>
        )}

        {/* 8. Přihlášení (Login) */}
        {activeTab === 'login' && (
          <LoginSection setActiveTab={setActiveTab} />
        )}

        {/* 9. Vlastní stránka vytvořená v administraci */}
        {!KNOWN_TABS.has(activeTab) && (
          <CustomPageSection pageId={activeTab} />
        )}
      </main>

      {/* Footer with URL routing */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
