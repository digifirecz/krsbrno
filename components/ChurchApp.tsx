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
import AdminSection from '@/components/AdminSection';
import AskAiModal from '@/components/AskAiModal';
import QuoteBanner from '@/components/QuoteBanner';
import Footer from '@/components/Footer';
import { getPathForTab, getTabFromPath, getTitleForTab } from '@/lib/routes';

interface ChurchAppProps {
  initialTab?: string;
}

export default function ChurchApp({ initialTab = 'home' }: ChurchAppProps) {
  const [activeTab, setActiveTabState] = useState<string>(initialTab);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  // Sync state from URL pathname on client load and browser Back/Forward (popstate)
  useEffect(() => {
    // If browser URL has a pathname, initialize tab from current URL
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentTab = getTabFromPath(currentPath);
      if (currentTab && currentTab !== activeTab) {
        setActiveTabState(currentTab);
        document.title = getTitleForTab(currentTab);
      }
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const resolvedTab = getTabFromPath(currentPath);
      setActiveTabState(resolvedTab);
      document.title = getTitleForTab(resolvedTab);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
        openAiModal={() => setAiModalOpen(true)}
      />

      {/* Main Page Body depending on selection */}
      <main className="flex-grow">
        
        {/* 1. Úvod (Home Page) */}
        {activeTab === 'home' && (
          <div>
            <Hero setActiveTab={setActiveTab} />
            <Meetings isHomePage={true} setActiveTab={setActiveTab} />
            <EventsSection />
            
            {/* Bible Verse Full-Width Banner */}
            <QuoteBanner 
              quote="„Z jednoho člověka učinil celé lidstvo, aby žilo na celém zemském povrchu. Vyměřil jim určená období a hranice jejich života, aby hledali Boha, zda by se ho snad mohli dotknout a nalézt ho – ačkoli není daleko od žádného z nás.“"
              citation="Skutky 17:26-27 (Bible)"
            />
          </div>
        )}

        {/* 2. Kdo jsme */}
        {activeTab === 'about' && (
          <HistoryLeadershipSection setActiveTab={setActiveTab} />
        )}

        {/* 2.1 Čemu věříme */}
        {activeTab === 'beliefs' && (
          <BeliefsSection setActiveTab={setActiveTab} />
        )}

        {/* 2.1b Naše vyznání */}
        {activeTab === 'confession' && (
          <ConfessionSection setActiveTab={setActiveTab} />
        )}

        {/* 2.2 Naše historie */}
        {activeTab === 'history' && (
          <HistoryLeadershipSection setActiveTab={setActiveTab} />
        )}

        {/* 2.3 Kdo spravuje sbor */}
        {activeTab === 'management' && (
          <ManagementSection setActiveTab={setActiveTab} />
        )}

        {/* 2.4 Kdo nás vede */}
        {activeTab === 'leadership' && (
          <LeadershipSection setActiveTab={setActiveTab} />
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
          <YouthSection setActiveTab={setActiveTab} />
        )}

        {/* 3.2 Dorost - Poutníci */}
        {activeTab === 'teens' && (
          <TeensSection setActiveTab={setActiveTab} />
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

        {/* 9. Administrace (Admin) */}
        {activeTab === 'admin' && (
          <AdminSection setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Footer with URL routing */}
      <Footer setActiveTab={setActiveTab} />

      {/* AI Assistant Modal */}
      <AskAiModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

    </div>
  );
}
