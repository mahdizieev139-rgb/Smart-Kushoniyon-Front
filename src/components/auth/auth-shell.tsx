/**
 * AuthShell — the two-panel layout shared by the login and register pages.
 *
 * Left: a navy brand panel with a short value message. Right: the form (passed
 * as children). On mobile the brand panel is hidden to keep the form front and
 * center.
 */
import { Logo } from '@/components/layout/logo';
import { LocatorChip } from '@/components/ui/locator-chip';

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(50rem 30rem at 20% 0%, #2878D0 0%, transparent 60%), radial-gradient(40rem 24rem at 100% 100%, #E8A33D 0%, transparent 55%)',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="inline-flex w-fit rounded-lg bg-white px-2.5 py-1.5">
            <Logo />
          </div>
          <div>
            <h2 className="max-w-sm text-3xl font-bold text-white">{title}</h2>
            <p className="mt-3 max-w-sm text-white/70">{subtitle}</p>
            <div className="mt-6 flex items-center gap-2">
              <span className="rounded-lg bg-white/90 px-2 py-1">
                <LocatorChip gate="G1" section="Row A" />
              </span>
              <span className="text-xs text-white/50">DEMO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
