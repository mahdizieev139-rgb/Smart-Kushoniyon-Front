/**
 * PageHero — a compact page header (title + subtitle) used on list and detail
 * pages. Kept visually lighter than the homepage hero so it frames content
 * without competing with it.
 */
export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/60 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12">
        <span aria-hidden className="block h-1 w-10 rounded-full bg-brand" />
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}
