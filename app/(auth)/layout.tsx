import SiteChrome from '@/components/SiteChrome';

export default function AuthRoutesLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome activeTab="login">{children}</SiteChrome>;
}
