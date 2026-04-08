import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugifyEvalId(evalId) {
  return evalId.replaceAll(":", "-");
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

async function readLatestEvalId() {
  const lastWrittenPath = path.join(os.homedir(), ".promptfoo", "evalLastWritten");
  const raw = await readFile(lastWrittenPath, "utf8");

  return raw.trim().split(":")[0];
}

function renderComponentReasons(componentResults) {
  return componentResults
    .map((component, index) => {
      const label =
        component.assertion?.type === "llm-rubric"
          ? `Judge ${index - 1}`
          : `Check ${index + 1}`;

      return `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(component.reason ?? "No reason provided.")}</li>`;
    })
    .join("");
}

function renderRows(results) {
  return results
    .map((result) => {
      const output = result.response?.output;
      const reading = output?.reading;
      const grading = result.gradingResult ?? {};
      const fixturePath = result.vars?.fixturePath ?? "unknown fixture";
      const requiredSignal = result.vars?.requiredSignals ?? "[]";
      const manifestName = output?.manifestName ?? "Unknown manifest";
      const modelId = output?.model?.id ?? "unknown model";
      const modelMode = output?.model?.mode ?? "unknown";
      const executiveSummary =
        typeof reading?.executiveSummary === "string"
          ? reading.executiveSummary
          : "No executive summary available.";
      const componentReasons = Array.isArray(grading.componentResults)
        ? renderComponentReasons(grading.componentResults)
        : "";

      return `
        <tr>
          <td>${escapeHtml(path.basename(fixturePath))}</td>
          <td>${escapeHtml(String(requiredSignal))}</td>
          <td>${escapeHtml(manifestName)}</td>
          <td><span class="pill ${result.success ? "pass" : "fail"}">${result.success ? "PASS" : "FAIL"}</span></td>
          <td>${escapeHtml(modelMode)}</td>
          <td>${escapeHtml(formatDuration(result.latencyMs ?? 0))}</td>
          <td>
            <details>
              <summary>View details</summary>
              <p><strong>Model:</strong> ${escapeHtml(modelId)}</p>
              <p><strong>Score:</strong> ${escapeHtml(String(result.score ?? grading.score ?? "n/a"))}</p>
              <p><strong>Summary:</strong> ${escapeHtml(executiveSummary)}</p>
              <p><strong>Reason:</strong> ${escapeHtml(grading.reason ?? "No grading reason provided.")}</p>
              <ul>${componentReasons}</ul>
            </details>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderHtml(exported, slug) {
  const stats = exported.results.stats;
  const promptMetrics = exported.results.prompts[0]?.metrics;
  const results = exported.results.results;
  const jsonFilename = `${slug}.json`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(exported.evalId)} | Eval Report</title>
    <style>
      :root {
        --bg: #f4efe4;
        --paper: #fffaf0;
        --ink: #2d3954;
        --muted: #7b6f63;
        --line: rgba(45, 57, 84, 0.14);
        --accent: #9d6c26;
        --good: #2e7d32;
        --bad: #b33a3a;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background:
          linear-gradient(180deg, rgba(157, 108, 38, 0.06), transparent 30%),
          repeating-linear-gradient(
            90deg,
            rgba(45, 57, 84, 0.025) 0,
            rgba(45, 57, 84, 0.025) 1px,
            transparent 1px,
            transparent 28px
          ),
          var(--bg);
      }
      main {
        max-width: 1120px;
        margin: 0 auto;
        padding: 48px 20px 72px;
      }
      h1, h2 {
        margin: 0 0 12px;
        line-height: 1.1;
      }
      h1 {
        font-size: clamp(2rem, 4vw, 3.6rem);
      }
      p, li, td, th, summary {
        line-height: 1.6;
      }
      .lede {
        max-width: 72ch;
        color: var(--muted);
        margin-bottom: 28px;
      }
      .panel {
        background: rgba(255, 250, 240, 0.86);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 18px 50px rgba(45, 57, 84, 0.08);
        backdrop-filter: blur(10px);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        margin: 24px 0 32px;
      }
      .stat {
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.55);
      }
      .eyebrow {
        display: block;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--muted);
        margin-bottom: 6px;
      }
      .value {
        font-size: 1.8rem;
        font-weight: 700;
      }
      .pill {
        display: inline-flex;
        padding: 0.18rem 0.55rem;
        border-radius: 999px;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.08em;
      }
      .pass {
        color: var(--good);
        background: rgba(46, 125, 50, 0.12);
      }
      .fail {
        color: var(--bad);
        background: rgba(179, 58, 58, 0.12);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        text-align: left;
        vertical-align: top;
        padding: 14px 12px;
        border-top: 1px solid var(--line);
      }
      th {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted);
      }
      details {
        min-width: 240px;
      }
      summary {
        cursor: pointer;
        color: var(--accent);
      }
      a {
        color: var(--accent);
      }
      code {
        font-family: "SFMono-Regular", ui-monospace, monospace;
        font-size: 0.95em;
      }
      @media (max-width: 860px) {
        table, thead, tbody, tr, th, td {
          display: block;
          width: 100%;
        }
        thead {
          display: none;
        }
        tr {
          border-top: 1px solid var(--line);
          padding: 12px 0;
        }
        td {
          border-top: 0;
          padding: 8px 0;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <span class="eyebrow">Semver in Retrograde Eval Report</span>
        <h1>${escapeHtml(exported.evalId)}</h1>
        <p class="lede">
          Static export of a saved promptfoo run for the reading endpoint. This page summarizes the
          recorded results and links to the raw JSON artifact used for the report.
        </p>
        <p>
          <strong>Timestamp:</strong> ${escapeHtml(formatDate(exported.results.timestamp))}<br />
          <strong>Raw artifact:</strong>
          <a href="./${escapeHtml(jsonFilename)}">${escapeHtml(jsonFilename)}</a>
        </p>

        <div class="stats">
          <article class="stat">
            <span class="eyebrow">Passes</span>
            <div class="value">${escapeHtml(formatNumber(stats.successes))}</div>
          </article>
          <article class="stat">
            <span class="eyebrow">Failures</span>
            <div class="value">${escapeHtml(formatNumber(stats.failures))}</div>
          </article>
          <article class="stat">
            <span class="eyebrow">Errors</span>
            <div class="value">${escapeHtml(formatNumber(stats.errors))}</div>
          </article>
          <article class="stat">
            <span class="eyebrow">Duration</span>
            <div class="value">${escapeHtml(formatDuration(stats.durationMs))}</div>
          </article>
          <article class="stat">
            <span class="eyebrow">Judge Tokens</span>
            <div class="value">${escapeHtml(formatNumber(stats.tokenUsage.assertions.total))}</div>
          </article>
          <article class="stat">
            <span class="eyebrow">Assertions</span>
            <div class="value">${escapeHtml(formatNumber(promptMetrics.assertPassCount))}</div>
          </article>
        </div>

        <h2>Cases</h2>
        <table>
          <thead>
            <tr>
              <th>Fixture</th>
              <th>Signal</th>
              <th>Manifest</th>
              <th>Status</th>
              <th>Mode</th>
              <th>Latency</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(results)}
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>`;
}

async function main() {
  const evalId = process.argv[2] ?? (await readLatestEvalId());
  const slug = slugifyEvalId(evalId);
  const outputDir = path.join(process.cwd(), "public", "evals");
  const jsonPath = path.join(outputDir, `${slug}.json`);
  const htmlPath = path.join(outputDir, `${slug}.html`);

  await mkdir(outputDir, { recursive: true });

  await execFileAsync("npx", [
    "promptfoo",
    "export",
    "eval",
    evalId,
    "-o",
    jsonPath,
  ]);

  const exported = JSON.parse(await readFile(jsonPath, "utf8"));
  const html = renderHtml(exported, slug);

  await writeFile(htmlPath, html);

  console.log(`Exported ${evalId}`);
  console.log(`JSON: ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`HTML: ${path.relative(process.cwd(), htmlPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
