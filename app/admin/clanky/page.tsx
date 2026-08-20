'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/admin/RequireAuth';
import { useToast } from '@/components/admin/ToastProvider';
import { getArticles, createArticle, type Article } from '@/lib/articles';
import { ChevronRight, Newspaper, Plus, EyeOff, ChevronDown } from 'lucide-react';

const PAGE_SIZE = 5;

function formatCreatedAt(value: unknown): string | null {
  let date: Date | null = null;
  if (value instanceof Date) date = value;
  else if (value && typeof value === 'object' && 'toDate' in value) {
    date = (value as { toDate: () => Date }).toDate();
  }
  if (!date) return null;
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

export default function AdminArticlesListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      {(user) => {
        const handleAdd = async () => {
          try {
            const id = await createArticle(articles.length, user.email);
            showToast('Článek byl vytvořen.');
            router.push(`/admin/clanky/${id}`);
          } catch (err) {
            showToast(`Článek se nepodařilo vytvořit${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
          }
        };

        return (
          <div className="max-w-3xl">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                    Články
                  </h1>
                  <p className="text-sm text-neutral-600 mt-0.5">
                    Karty v kolotoči Událostí na Úvodu i na stránce Akce.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#c93838] text-white text-sm font-bold hover:bg-[#b02f2f] transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat článek</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.slice(0, visibleCount).map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/clanky/${article.id}`}
                    className="group flex items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl hover:border-[#c93838]/50 hover:shadow-sm transition-all gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0 overflow-hidden transition-colors group-hover:bg-[#c93838] group-hover:text-white">
                        {article.image ? (
                          <Image src={article.image} alt="" fill className="object-cover" unoptimized />
                        ) : (
                          <Newspaper className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900 truncate block">
                          {article.title || 'Bez titulku'}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {formatCreatedAt(article.createdAt) ? `Vytvořeno ${formatCreatedAt(article.createdAt)}` : article.dateText || 'Bez data'}
                        </span>
                      </div>
                      {!article.visible && (
                        <span title="Skryto" className="text-neutral-300 shrink-0">
                          <EyeOff className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}

                {articles.length === 0 && (
                  <p className="text-sm text-neutral-400 px-1">Zatím žádné články. Přidejte první tlačítkem výše.</p>
                )}

                {visibleCount < articles.length && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:border-[#c93838] hover:text-[#c93838] text-sm font-semibold transition-colors cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Načíst dalších {Math.min(PAGE_SIZE, articles.length - visibleCount)}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </RequireAuth>
  );
}
