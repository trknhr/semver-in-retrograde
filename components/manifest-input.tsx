"use client";

import { useDeferredValue, useState, useTransition } from "react";
import ReadingPanel from "@/components/reading-panel";
import ScoreCards from "@/components/score-cards";
import ShareCard from "@/components/share-card";
import { APP_SUBTITLE, SAMPLE_MANIFESTS } from "@/lib/constants";
import { detectUnsupportedManifest } from "@/lib/parse-manifest";
import type { AnalysisResult } from "@/lib/schemas";

type ApiErrorState = {
  code: number;
  error: string;
  detail?: string;
  title?: string;
};

function describeDraft(text: string) {
  if (!text.trim()) {
    return "Paste a package.json to begin the audit.";
  }

  const teapotIncident = detectUnsupportedManifest(text);

  if (teapotIncident === "python") {
    return "This resembles requirements.txt theology and will trigger a teapot response.";
  }

  if (teapotIncident === "ruby") {
    return "This resembles a Gemfile and will be redirected into ceremonial tea service.";
  }

  if (text.includes('"dependencies"') || text.includes('"devDependencies"')) {
    return "Manifest structure detected. The boardroom is prepared.";
  }

  if (text.trim().startsWith("{")) {
    return "Structured JSON detected. Awaiting executive interpretation.";
  }

  return "Input is present, but the manifest is still withholding context.";
}

function buildSharePayload(result: AnalysisResult) {
  return [
    result.reading.shareCaption,
    `Big 3: ${result.bigThree.sun} sun / ${result.bigThree.moon} moon / ${result.bigThree.rising} rising`,
    `Aura Stability ${result.scores.auraStability}, Chaos Index ${result.scores.chaosIndex}, Peer Dependency Tension ${result.scores.peerDependencyTension}`,
    "semver in retrograde",
  ].join("\n");
}

export default function ManifestInput() {
  const [manifestText, setManifestText] = useState<string>(
    SAMPLE_MANIFESTS[0].manifest,
  );
  const deferredManifestText = useDeferredValue(manifestText);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ApiErrorState | null>(null);
  const [copyState, setCopyState] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const draftDescription = describeDraft(deferredManifestText);

  async function handleAnalyze() {
    setCopyState(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manifestText,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | AnalysisResult
        | {
            error?: string;
            detail?: string;
            title?: string;
          }
        | null;

      if (!response.ok) {
        startTransition(() => {
          setResult(null);
          setError({
            code: response.status,
            error:
              payload && "error" in payload && payload.error
                ? payload.error
                : "The audit endpoint returned an unexpected response.",
            detail:
              payload && "detail" in payload && typeof payload.detail === "string"
                ? payload.detail
                : undefined,
            title:
              payload && "title" in payload && typeof payload.title === "string"
                ? payload.title
                : undefined,
          });
        });

        return;
      }

      startTransition(() => {
        setError(null);
        setResult(payload as AnalysisResult);
      });
    } catch {
      startTransition(() => {
        setResult(null);
        setError({
          code: 500,
          error: "The audit request failed before the boardroom could respond.",
        });
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopyState(label);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-black/10 bg-[var(--panel)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Input Console
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                  Dependency Aura Intake
                </h2>
              </div>
              <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {APP_SUBTITLE}
              </div>
            </div>

            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              Paste raw <code>package.json</code> contents. Inputs that resemble{" "}
              <code>requirements.txt</code> or <code>Gemfile</code> are
              ceremonially rejected with <code>418</code>.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {SAMPLE_MANIFESTS.map((sample) => (
                <button
                  key={sample.id}
                  className="rounded-2xl border border-black/10 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white"
                  type="button"
                  onClick={() => {
                    setManifestText(sample.manifest);
                    setCopyState(null);
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Sample
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                    {sample.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                package.json payload
              </span>
              <textarea
                className="min-h-[360px] rounded-[24px] border border-black/10 bg-[#f8f4ed] px-4 py-4 font-mono text-[13px] leading-6 text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                spellCheck={false}
                value={manifestText}
                onChange={(event) => setManifestText(event.target.value)}
              />
            </label>

            <div className="flex flex-col gap-3 rounded-[24px] border border-black/10 bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Live Draft Read
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                  {draftDescription}
                </p>
              </div>
              <button
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={isSubmitting || isPending}
                onClick={() => {
                  void handleAnalyze();
                }}
              >
                {isSubmitting || isPending
                  ? "Reading the room..."
                  : "Analyze my dependency aura"}
              </button>
            </div>
          </div>
        </div>

        <ScoreCards result={result} />
      </div>

      <div className="space-y-6">
        {error ? (
          <section className="rounded-[28px] border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-6 text-[var(--ink)] shadow-[0_18px_60px_rgba(177,75,53,0.12)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--danger)]">
                  Escalation
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  {error.title ?? "The audit was denied"}
                </h2>
              </div>
              <span className="rounded-full border border-[var(--danger)]/20 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--danger)]">
                HTTP {error.code}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
              {error.error}
            </p>
            {error.detail ? (
              <p className="mt-3 rounded-2xl border border-[var(--danger)]/20 bg-white/60 px-4 py-3 font-mono text-xs leading-6 text-[var(--ink-soft)]">
                {error.detail}
              </p>
            ) : null}
          </section>
        ) : null}

        <ReadingPanel result={result} />

        {result ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-black/10 bg-[var(--panel)] p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Distribution
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                  {result.model.mode === "live"
                    ? `Narrative copy generated with ${result.model.id}.`
                    : `Narrative copy generated with ${result.model.id}. Configure GEMINI_API_KEY to switch to live Gemini output.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  type="button"
                  onClick={() => void copy(result.reading.shareCaption, "caption")}
                >
                  Copy caption
                </button>
                <button
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  type="button"
                  onClick={() => void copy(buildSharePayload(result), "share report")}
                >
                  Copy share report
                </button>
              </div>
            </div>

            <ShareCard result={result} />

            {copyState ? (
              <p className="rounded-2xl border border-[var(--success)]/20 bg-[var(--success-soft)] px-4 py-3 text-sm text-[var(--success)]">
                Copied {copyState} to the clipboard.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
