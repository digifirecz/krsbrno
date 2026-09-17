import ChurchApp from '@/components/ChurchApp';
import { getChromeData } from '@/lib/chromeData';
import { getHomePageId } from '@/lib/actions/pages';

export default async function HomePage() {
  const [chromeData, homePageId] = await Promise.all([getChromeData(), getHomePageId()]);
  return <ChurchApp initialTab="home" homePageId={homePageId} {...chromeData} />;
}
