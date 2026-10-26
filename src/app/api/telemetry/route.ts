// Edge so the hero's roundtrip reading reflects the nearest region, not a cold origin.
export const runtime = "edge";

export function GET() {
  return Response.json(
    { ok: true, serverTime: Date.now(), region: process.env.VERCEL_REGION ?? "local" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
