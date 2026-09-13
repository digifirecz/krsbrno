'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface ArticleBackLinkProps {
  fallbackHref: string;
}

// Vždycky vede zpátky přesně tam, odkud čtenář přišel (domů, na "Kalendář akcí",
// do jiné stránky se seznamem článků…), místo aby ho to natvrdo posílalo na
// samostatnou stránku "Kalendář akcí" bez zbytku obsahu. Když je odkaz otevřený
// přímo (sdílený odkaz, nová karta bez historie), spadne to na tu stránku jako
// rozumný výchozí stav.
export default function ArticleBackLink({ fallbackHref }: ArticleBackLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className="inline-flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-[#c93838] transition-colors font-sans"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Zpět na události</span>
    </a>
  );
}
