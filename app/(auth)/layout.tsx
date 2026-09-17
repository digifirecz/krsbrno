import SiteChrome from '@/components/SiteChrome';
import { getChromeData } from '@/lib/chromeData';

export default async function AuthRoutesLayout({ children }: { children: React.ReactNode }) {
  const chromeData = await getChromeData();
  return <SiteChrome activeTab="login" {...chromeData}>{children}</SiteChrome>;
}
