/**
 * PageHero — a compact page header (title + subtitle) used on list and detail
 * pages. Kept visually lighter than the homepage hero so it frames content
 * without competing with it.
 */
export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}
