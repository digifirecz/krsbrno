import { Sparkles } from 'lucide-react';

// Shown whenever a page/section genuinely has no content to render — either
// the data failed to load, or it loaded fine but nothing was configured yet.
// Deliberately generic: no placeholder copy or stock imagery pretending to be
// real content, since everything on the site is supposed to come from the DB.
export default function EmptyPageState() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shadow-2xs">
        <Sparkles className="w-6 h-6" />
      </div>
      <p className="text-lg sm:text-xl font-serif font-bold text-neutral-800 tracking-tight">
        Obsah se připravuje
      </p>
    </div>
  );
}
