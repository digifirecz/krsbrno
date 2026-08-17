import { Metadata } from 'next';
import ChurchApp from '@/components/ChurchApp';
import { getTabFromSlug, getTitleForTab } from '@/lib/routes';

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
  const tab = getTabFromSlug(slug);
  const title = getTitleForTab(tab);

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
  const tab = getTabFromSlug(slug);

  return <ChurchApp initialTab={tab} />;
}
