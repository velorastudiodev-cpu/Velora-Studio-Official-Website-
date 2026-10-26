import { CONTACT } from "@/data/contact";
import { CTAInquiryPayloadSchema } from "@/lib/schemas";

const MAX_BODY_BYTES = 10_000; // a full brief is ~2 kB; anything far larger is not a brief
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

// shortcut: per-instance memory, so the limit resets on cold starts and is not shared across regions;
// move to a shared store (e.g. Upstash Redis) if the form is enabled and starts drawing spam.
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // bound memory under a flood of distinct IPs
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  // Only this site's own pages may post: blocks other sites from using the form as a spam relay.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host || !URL.canParse(origin) || new URL(origin).host !== host) return json({ ok: false, error: "forbidden" }, 403);

  if (!req.headers.get("content-type")?.startsWith("application/json")) return json({ ok: false, error: "unsupported_media_type" }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  // Content-Length can be absent or wrong (chunked), so the cap is enforced on what is actually read too.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: humans never see the "website" field, bots fill it. Pretend success so they move on.
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return json({ ok: true }, 202);
  }

  const parsed = CTAInquiryPayloadSchema.safeParse(body);
  // Field paths only: the client needs to know what to fix, not the schema internals.
  if (!parsed.success) return json({ ok: false, error: "invalid_payload", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 422);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ ok: false, error: "not_configured" }, 503);

  const p = parsed.data;
  const text = [
    `Name: ${p.clientName}`,
    `Email: ${p.clientEmail}`,
    `Company/Brand: ${p.companyOrBrand}`,
    `Archetype: ${p.selectedProjectType}`,
    `Pillars: ${p.selectedPillars.join(", ")}`,
    `Timeline: ${p.targetTimeline}`,
    "",
    p.projectScopeNotes,
  ].join("\n");
  // Line breaks in a subject are a header-injection vector on SMTP relays.
  const subject = `[Velora] ${p.selectedProjectType} — ${p.companyOrBrand}`.replace(/[\r\n]+/g, " ").slice(0, 160);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "Velora Inquiry <onboarding@resend.dev>",
      to: [CONTACT.email],
      reply_to: p.clientEmail,
      subject,
      text,
    }),
  });

  if (!res.ok) return json({ ok: false, error: "send_failed" }, 502);
  return json({ ok: true }, 202);
}
