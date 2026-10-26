import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "./route";

let n = 0;
// Each request gets its own IP so the rate limiter only fires where a test means it to.
function req(body: string, headers: Record<string, string> = {}, ip = `10.0.0.${++n}`) {
  return new Request("https://velora.test/api/inquiry", {
    method: "POST",
    body,
    headers: { host: "velora.test", origin: "https://velora.test", "content-type": "application/json", "x-forwarded-for": ip, ...headers },
  });
}

const brief = {
  clientName: "Budi",
  clientEmail: "budi@example.com",
  companyOrBrand: "Budi Co",
  selectedProjectType: "HIGH_CRAFT_WEB_EXPERIENCE",
  selectedPillars: ["UI_UX_DESIGN"],
  targetTimeline: "URGENT_2_4_WEEKS",
  projectScopeNotes: "Butuh website booking untuk barbershop kami.",
};

test("rejects other origins, missing or malformed origin", async () => {
  assert.equal((await POST(req("{}", { origin: "https://evil.example" }))).status, 403);
  assert.equal((await POST(req("{}", { origin: "null" }))).status, 403);
  const noOrigin = new Request("https://velora.test/api/inquiry", { method: "POST", body: "{}", headers: { host: "velora.test", "content-type": "application/json" } });
  assert.equal((await POST(noOrigin)).status, 403);
});

test("rejects wrong content type and oversized bodies", async () => {
  assert.equal((await POST(req("{}", { "content-type": "text/plain" }))).status, 415);
  assert.equal((await POST(req("{}", { "content-length": "999999" }))).status, 413);
  assert.equal((await POST(req(JSON.stringify({ x: "a".repeat(20_000) })))).status, 413);
});

test("bad JSON, honeypot, invalid payload, unconfigured mailer", async () => {
  assert.equal((await POST(req("{not json"))).status, 400);
  assert.equal((await POST(req(JSON.stringify({ website: "spam" })))).status, 202);
  const bad = await POST(req(JSON.stringify({ ...brief, clientEmail: "nope" })));
  assert.equal(bad.status, 422);
  assert.deepEqual((await bad.json()).fields, ["clientEmail"]);
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(req(JSON.stringify(brief)))).status, 503);
});

test("rate limits a single address after five requests", async () => {
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await POST(req("{}", {}, "10.9.9.9"))).status);
  assert.deepEqual(codes, [422, 422, 422, 422, 422, 429]);
});
