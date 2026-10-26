import assert from "node:assert/strict";
import { test } from "node:test";
import { buildBlueprint } from "./utils";

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

