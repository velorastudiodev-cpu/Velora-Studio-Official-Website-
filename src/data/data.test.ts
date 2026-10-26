import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { CapabilityPillarSchema, CTAInquiryPayloadSchema, DictionarySchema, ProjectSchema } from "@/lib/schemas";
import { dictionary } from "./dictionaries";
import { pillars } from "./pillars";
import { projects } from "./projects";

// Seed data ships unvalidated to the browser; this is where it is held to the schemas.
test("projects, pillars and every UI string match their schemas", () => {
  z.array(ProjectSchema).length(3).parse(projects);
  z.array(CapabilityPillarSchema).length(4).parse(pillars);
  DictionarySchema.parse(dictionary);
});

test("the schemas reject what they should", () => {
  assert.ok(!DictionarySchema.safeParse({ k: { id: "x", en: "" } }).success, "empty EN rejected");
  const brief = {
    clientName: "Al",
    clientEmail: "nope",
    companyOrBrand: "Co",
    selectedProjectType: "HIGH_CRAFT_WEB_EXPERIENCE",
    selectedPillars: ["UI_UX_DESIGN"],
    targetTimeline: "URGENT_2_4_WEEKS",
    projectScopeNotes: "x".repeat(25),
  };
  assert.ok(!CTAInquiryPayloadSchema.safeParse(brief).success, "bad email rejected");
  assert.ok(CTAInquiryPayloadSchema.safeParse({ ...brief, clientEmail: "a@b.co" }).success, "valid brief accepted");
});
