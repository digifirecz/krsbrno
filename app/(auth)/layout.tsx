import SiteChrome from '@/components/SiteChrome';
import { getChromeData } from '@/lib/chromeData';

// See app/admin/layout.tsx — same reasoning (avoid build-time prerendering).
export const dynamic = 'force-dynamic';

export default async function AuthRoutesLayout({ children }: { children: React.ReactNode }) {
  const chromeData = await getChromeData();
  return <SiteChrome activeTab="login" {...chromeData}>{children}</SiteChrome>;
}
