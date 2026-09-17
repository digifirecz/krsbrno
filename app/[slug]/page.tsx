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

// No generateStaticParams here on purpose — these pages now each fetch
// chrome data + the DB on render (see SlugPage below), and pre-building all
// ~35 slugs at once during `next build` fires that many DB round trips
// concurrently from Vercel's build machine, which the DB's connection pooler
// can't keep up with inside the 60s per-page build timeout. Rendering these
// on the first real visitor request (and letting Next cache the result)
// avoids the build-time burst entirely and works fine at runtime — the same
// pooler already handles regular traffic without issue.

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
