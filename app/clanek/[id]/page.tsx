import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import SiteChrome from '@/components/SiteChrome';
import ArticleImageLightbox from '@/components/ArticleImageLightbox';
import ArticleBackLink from '@/components/ArticleBackLink';
import { getArticle } from '@/lib/data/articles';
import { getPathForTab } from '@/lib/routes';
import { BADGE_COLORS } from '@/lib/blocks/badgeColors';
import { getChromeData } from '@/lib/chromeData';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

function absoluteUrl(path: string): string {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  return path.startsWith('http') ? path : `${baseUrl}${path}`;
}

function plainText(html: string): string | undefined {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 200) : undefined;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article || !article.visible) {
    return { title: 'Článek nenalezen | Křesťanský sbor Brno' };
  }

  const description = article.subtitle ? plainText(article.subtitle) : undefined;
  const title = `${article.title} | Křesťanský sbor Brno`;

  return {
    title,
    description,
    openGraph: {
      title: article.title,
      description,
      url: absoluteUrl(`/clanek/${article.id}`),
      images: article.image ? [{ url: absoluteUrl(article.image) }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article || !article.visible) notFound();
  const chromeData = await getChromeData();

  return (
    <SiteChrome activeTab="events" {...chromeData}>
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ArticleBackLink fallbackHref={getPathForTab('events')} />

          <div className="rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row-reverse md:items-stretch">
            {article.image && <ArticleImageLightbox src={article.image} alt={article.title} />}

            <div className="p-6 sm:p-8 flex-1 min-w-0 space-y-4">
              {(article.dateText || article.location) && (
                <div className="flex flex-wrap items-center gap-2">
                  {article.dateText && (
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-bold text-xs border border-black/5 font-sans w-fit shadow-2xs ${BADGE_COLORS.red.bg} ${BADGE_COLORS.red.text}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.dateText}</span>
                      {article.timeText && <span>· {article.timeText}</span>}
                    </div>
                  )}

                  {article.location && (
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-bold text-xs border border-black/5 font-sans w-fit shadow-2xs ${BADGE_COLORS.blue.bg} ${BADGE_COLORS.blue.text}`}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{article.location}</span>
                    </div>
                  )}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
                {article.title}
              </h1>

              {article.subtitle && (
                <div
                  className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed [&_a]:text-[#c93838] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3"
                  dangerouslySetInnerHTML={{ __html: article.subtitle }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
