import assert from "node:assert/strict";
import { test } from "node:test";
import { buildBlueprint, contrastRatio, formatWIB, simulateSpring, splitMetrics } from "./utils";

test("blueprint is deterministic and dedupes the stack", () => {
  const a = buildBlueprint("FULL_ECOSYSTEM_WEB_AND_CMS", ["WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"], "STANDARD_1_2_MONTHS");
  assert.deepEqual(a, buildBlueprint("FULL_ECOSYSTEM_WEB_AND_CMS", ["WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"], "STANDARD_1_2_MONTHS"));
  assert.equal(new Set(a.stack).size, a.stack.length);
  assert.equal(a.nodes, 9 + 1 + 2);
  assert.equal(a.deliverables.length, 3 + 2);
});

test("scope larger than the timeline ships in phases", () => {
  const big = buildBlueprint(
    "FULL_ECOSYSTEM_WEB_AND_CMS",
    ["UI_UX_DESIGN", "WEBSITE_ENGINEERING", "WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"],
    "URGENT_2_4_WEEKS",
  );
  assert.equal(big.phases, Math.ceil(13 / 4));
  assert.equal(buildBlueprint("DESIGN_SYSTEM_AND_UIUX_OVERHAUL", ["UI_UX_DESIGN"], "ENTERPRISE_3_MONTHS_PLUS").phases, 1);
});

test("WCAG contrast matches known values", () => {
  assert.equal(contrastRatio("#000000", "#FFFFFF").toFixed(1), "21.0");
  assert.equal(contrastRatio("#FAFAFC", "#09090B").toFixed(2), "19.09");
});

test("WIB clock is UTC+7 regardless of host timezone", () => {
  assert.equal(formatWIB(new Date("2026-01-01T20:05:09Z")), "03:05:09");
});

test("spring settles, and stiffer springs settle sooner", () => {
  const soft = simulateSpring(150, 20, 0.8);
  const stiff = simulateSpring(600, 40, 0.8);
  assert.ok(stiff.settledMs < soft.settledMs);
  assert.ok(Math.abs(stiff.points.at(-1) ?? 1) < 0.005);
});

test("ledger highlights metrics but not project ids", () => {
  const metrics = (s: string) => splitMetrics(s).filter((_, i) => i % 2 === 1);
  assert.deepEqual(metrics("Content reaches VEL-001 in 32ms via cache purge"), ["32ms"]);
  assert.deepEqual(metrics("Lighthouse 100/100 with CLS 0.000"), ["100/100", "0.000"]);
  assert.deepEqual(metrics("Booking conversion up 64%, checkout under 45 seconds"), ["64%", "45"]);
  assert.deepEqual(metrics("50+ concurrent chair streams"), ["50+"]);
});
