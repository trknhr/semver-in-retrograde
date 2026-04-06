import { describeDirection, describeScore } from "@/lib/compute-scores";
import type { AnalysisResult } from "@/lib/schemas";

type ScoreCardsProps = {
  result: AnalysisResult | null;
};

function scoreTone(value: number, direction: "positive" | "negative") {
  if (direction === "positive") {
    if (value >= 70) {
      return "border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]";
    }

    if (value >= 45) {
      return "border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]";
    }

    return "border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]";
  }

  if (value >= 70) {
    return "border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]";
  }

  if (value >= 45) {
    return "border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]";
  }

  return "border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]";
}

export default function ScoreCards({ result }: ScoreCardsProps) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-dashed border-black/15 bg-[var(--panel)] p-6 text-[var(--ink-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Result Dashboard
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          KPI cards will appear after the first audit.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7">
          The dashboard surfaces deterministic signals only: Aura Stability,
          Chaos Index, Peer Dependency Tension, Boundary Issues, Trust Issues,
          and Mercury status.
        </p>
      </section>
    );
  }

  const primaryCards = [
    {
      label: "Aura Stability",
      value: `${result.scores.auraStability}`,
      note: describeDirection("positive", result.scores.auraStability),
      tone: scoreTone(result.scores.auraStability, "positive"),
    },
    {
      label: "Chaos Index",
      value: `${result.scores.chaosIndex}`,
      note: describeScore(result.scores.chaosIndex),
      tone: scoreTone(result.scores.chaosIndex, "negative"),
    },
    {
      label: "Peer Dependency Tension",
      value: `${result.scores.peerDependencyTension}`,
      note: describeDirection("negative", result.scores.peerDependencyTension),
      tone: scoreTone(result.scores.peerDependencyTension, "negative"),
    },
    {
      label: "Mercury Status",
      value: result.scores.mercuryStatus,
      note: `${result.scores.mercurySeverity}/100 severity`,
      tone: scoreTone(result.scores.mercurySeverity, "negative"),
    },
  ];

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {primaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
          >
            <div
              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${card.tone}`}
            >
              {card.label}
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              {card.note}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 rounded-[28px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Secondary Signals
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Boundary Issues
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                {result.scores.boundaryIssues}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                Resolutions, overrides, and workspace politics.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Trust Issues
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                {result.scores.trustIssues}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                Private mode, hidden lifecycle behavior, and guarded intent.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/10 bg-[#f8f4ed] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Manifest Signals
          </p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-soft)] sm:grid-cols-2">
            <p>
              {result.features.dependencyCount} dependencies,{" "}
              {result.features.devDependencyCount} devDependencies
            </p>
            <p>{result.features.scriptCount} scripts declared</p>
            <p>{result.features.frameworks.join(", ") || "No dominant framework"}</p>
            <p>{result.features.packageManager ?? "No packageManager field"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
