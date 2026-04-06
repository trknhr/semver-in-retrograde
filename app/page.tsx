import ManifestInput from "@/components/manifest-input";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <section className="grid gap-6 rounded-[32px] border border-black/10 bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1">
              Deterministic Scoring
            </span>
            <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1">
              Server-Side Gemini Copy
            </span>
            <span className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-1">
              418 Escalation Ready
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              Semver in Retrograde
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
              Enterprise-grade dependency aura intelligence for emotionally
              unavailable JavaScript projects.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Paste a <code>package.json</code>, trigger an unnecessary audit,
              and receive a fully composed executive reading about version
              ranges, lifecycle scripts, and interpersonal dependency tension.
            </p>
          </div>
        </div>

        <aside className="grid gap-4 rounded-[28px] border border-black/10 bg-[var(--panel-strong)] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Review Scope
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              Local code computes every score. Gemini only writes the boardroom
              fiction.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[var(--ink-soft)]">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <p className="font-semibold text-[var(--ink)]">Big 3</p>
              <p className="mt-1 leading-6">
                Sun sign from framework, moon sign from test stack, rising sign
                from package manager vibes.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <p className="font-semibold text-[var(--ink)]">
                Audit Outcome
              </p>
              <p className="mt-1 leading-6">
                KPI cards, red flags, prophecy, lucky command, and a
                screenshot-ready share card.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <ManifestInput />
    </main>
  );
}
