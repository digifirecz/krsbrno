// Shown whenever a page/section genuinely has no content to render — either
// the data failed to load, or it loaded fine but nothing was configured yet.
// Deliberately generic: no placeholder copy or stock imagery pretending to be
// real content, since everything on the site is supposed to come from the DB.
export default function EmptyPageState() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-sm text-neutral-400 font-sans">Na stránce se právě pracuje.</p>
    </div>
  );
}
