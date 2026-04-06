import type { AnalysisResult } from "@/lib/schemas";

type ShareCardProps = {
  result: AnalysisResult;
};

export default function ShareCard({ result }: ShareCardProps) {
  return (
    <section className="rounded-[32px] border border-black/10 bg-[var(--ink)] p-6 text-white shadow-[0_24px_90px_rgba(18,32,51,0.22)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
            Share Card
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
            {result.manifestName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            {result.reading.shareCaption}
          </p>
        </div>
        <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          Screenshot-ready
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Big 3
          </p>
          <p className="mt-3 text-sm leading-7 text-white/80">
            {result.bigThree.sun} sun
            <br />
            {result.bigThree.moon} moon
            <br />
            {result.bigThree.rising} rising
          </p>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            KPI Snapshot
          </p>
          <div className="mt-3 grid gap-2 text-sm text-white/80">
            <p>Aura Stability: {result.scores.auraStability}</p>
            <p>Chaos Index: {result.scores.chaosIndex}</p>
            <p>Peer Tension: {result.scores.peerDependencyTension}</p>
          </div>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Mercury
          </p>
          <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
            {result.scores.mercuryStatus}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/72">
            {result.reading.prophecy}
          </p>
        </article>
      </div>
    </section>
  );
}
