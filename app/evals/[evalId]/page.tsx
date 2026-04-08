import { permanentRedirect } from "next/navigation";

function toEvalArtifactPath(evalId: string) {
  return `/evals/${evalId.replaceAll(":", "-")}.html`;
}

export default async function EvalReportAliasPage({
  params,
}: {
  params: Promise<{ evalId: string }>;
}) {
  const { evalId } = await params;

  permanentRedirect(toEvalArtifactPath(evalId));
}
