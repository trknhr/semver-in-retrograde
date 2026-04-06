import { buildTeapotPayload } from "@/lib/parse-manifest";

export const runtime = "nodejs";

function teapot() {
  return Response.json(buildTeapotPayload("python"), {
    status: 418,
  });
}

export async function GET() {
  return teapot();
}

export async function POST() {
  return teapot();
}
