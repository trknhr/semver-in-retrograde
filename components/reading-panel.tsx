import type { AnalysisResult } from "@/lib/schemas";

type ReadingPanelProps = {
  result: AnalysisResult | null;
};

function SignBlock({
  title,
  sign,
  interpretation,
}: {
  title: string;
  sign: string;
  interpretation: string;
}) {
  return (
    <article className="rounded-[24px] border border-black/10 bg-white/75 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {title}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
        {sign}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
        {interpretation}
      </p>
    </article>
  );
}

export default function ReadingPanel({ result }: ReadingPanelProps) {
  if (!result) {
    return (
      <section className="rounded-[28px] border border-dashed border-black/15 bg-[var(--panel)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Executive Reading
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          Your boardroom prophecy will render here.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
          The output includes an executive summary, Big 3 interpretations, red
          flags, a prophecy, a lucky command, and a share caption.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Executive Reading
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
            {result.manifestName}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
            {result.reading.executiveSummary}
          </p>
        </div>

        <div className="rounded-[24px] border border-black/10 bg-white/75 px-4 py-3 text-sm text-[var(--ink-soft)]">
          <p className="font-semibold text-[var(--ink)]">Boardroom Assessment</p>
          <p className="mt-1 max-w-sm leading-6">
            {result.reading.boardroomAssessment}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SignBlock
          title="Sun Sign"
          sign={result.bigThree.sun}
          interpretation={result.reading.sunInterpretation}
        />
        <SignBlock
          title="Moon Sign"
          sign={result.bigThree.moon}
          interpretation={result.reading.moonInterpretation}
        />
        <SignBlock
          title="Rising Sign"
          sign={result.bigThree.rising}
          interpretation={result.reading.risingInterpretation}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[24px] border border-black/10 bg-[#f8f4ed] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Red Flags
          </p>
          <ul className="mt-4 grid gap-3">
            {result.reading.redFlags.map((flag) => (
              <li
                key={flag}
                className="rounded-2xl border border-black/10 bg-white/85 px-4 py-3 text-sm leading-6 text-[var(--ink-soft)]"
              >
                {flag}
              </li>
            ))}
          </ul>
        </article>

        <div className="grid gap-4">
          <article className="rounded-[24px] border border-black/10 bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Prophecy
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
              {result.reading.prophecy}
            </p>
          </article>

          <article className="rounded-[24px] border border-black/10 bg-white/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Lucky Command
            </p>
            <code className="mt-3 block rounded-2xl border border-black/10 bg-[var(--ink)] px-4 py-3 text-sm text-white">
              {result.reading.luckyCommand}
            </code>
          </article>
        </div>
      </div>

      {result.warnings.length > 0 ? (
        <div className="mt-6 rounded-[24px] border border-[var(--warning)]/25 bg-[var(--warning-soft)] p-4 text-sm leading-7 text-[var(--ink-soft)]">
          <p className="font-semibold text-[var(--warning)]">Operational note</p>
          <p>{result.warnings[0]}</p>
        </div>
      ) : null}
    </section>
  );
}
