import { CONTACT } from "@/data/contact";
import { CTAInquiryPayloadSchema } from "@/lib/schemas";

// shortcut: no rate limiting beyond the honeypot; add one (e.g. Upstash) if the form starts drawing spam.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: humans never see the "website" field, bots fill it. Pretend success so they move on.
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const parsed = CTAInquiryPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid_payload", issues: parsed.error.issues }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "Velora Inquiry <onboarding@resend.dev>",
      to: [CONTACT.email],
      reply_to: p.clientEmail,
      subject: `[Velora] ${p.selectedProjectType} — ${p.companyOrBrand}`,
      text,
    }),
  });

  if (!res.ok) return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true }, { status: 202 });
}
