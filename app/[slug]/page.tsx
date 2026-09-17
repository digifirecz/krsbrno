import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ChurchApp from '@/components/ChurchApp';
import { getTabFromSlug, getTitleForTab, resolveDynamicSlug } from '@/lib/routes';
import { getPageDoc } from '@/lib/data/pages';
import { getChromeData } from '@/lib/chromeData';
import { getHomePageId } from '@/lib/actions/pages';

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: 'podpora' },
    { slug: 'kazani' },
    { slug: 'kontakt' },
    { slug: 'cemu-verime' },
    { slug: 'o-nas' },
    { slug: 'nase-vyznani' },
    { slug: 'historie' },
    { slug: 'sprava-sboru' },
    { slug: 'vedeni' },
    { slug: 'setkavani' },
    { slug: 'knihovna' },
    { slug: 'mladez' },
    { slug: 'dorost' },
    { slug: 'program' },
    { slug: 'akce' },
    { slug: 'login' },
    { slug: 'prihlaseni' },
    // Aliases
    { slug: 'verime' },
    { slug: 'o-nasem-sboru' },
    { slug: 'kdo-jsme' },
    { slug: 'vyznani' },
    { slug: 'organizace' },
    { slug: 'sprava' },
    { slug: 'bohosluzby' },
    { slug: 'knihovna-den' },
    { slug: 'zaznamy' },
    { slug: 'audio' },
    { slug: 'darovat' },
    { slug: 'finance' },
    { slug: 'elevate' },
    { slug: 'poutnici' },
    { slug: 'deti' },
    { slug: 'skupinky' },
    { slug: 'besidka' },
  ];
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  let tab = getTabFromSlug(slug);
  let title = getTitleForTab(tab);

  const dynamic = await resolveDynamicSlug(slug).catch(() => null);
  if (dynamic) {
    tab = dynamic.tab;
    const pageDoc = await getPageDoc(dynamic.pageId).catch(() => null);
    title = pageDoc?.title ? `${pageDoc.title} | Křesťanský sbor Brno` : getTitleForTab(tab);
  }

  return {
    title,
    description: 'Křesťanský sbor Brno – otevřené společenství lidí v Brně-Židenicích. Běžná setkávání, nedělní bohoslužby, mládež Elevate, besídka pro děti, knihovna DEN a kázání.',
    openGraph: {
      title,
      description: 'Křesťanský sbor Brno – otevřené společenství lidí v Brně-Židenicích.',
    },
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  const dynamic = await resolveDynamicSlug(slug).catch(() => null);
  if (dynamic?.redirectPath) {
    redirect(dynamic.redirectPath);
  }
  const tab = dynamic?.tab || getTabFromSlug(slug);
  const [chromeData, homePageId] = await Promise.all([getChromeData(), getHomePageId()]);

  return <ChurchApp initialTab={tab} homePageId={homePageId} {...chromeData} />;
}
