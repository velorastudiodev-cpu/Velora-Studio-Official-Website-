// Plain value lists shared by the Zod schemas (server, tests) and the client, so the browser bundle
// can use them without shipping Zod.
export const LOCALES = ["id", "en"] as const;

export const PROJECT_TYPES = [
  "FULL_ECOSYSTEM_WEB_AND_CMS",
  "HIGH_CRAFT_WEB_EXPERIENCE",
  "CUSTOM_SAAS_OR_MARKETPLACE",
  "DESIGN_SYSTEM_AND_UIUX_OVERHAUL",
] as const;

export const TIMELINES = ["URGENT_2_4_WEEKS", "STANDARD_1_2_MONTHS", "ENTERPRISE_3_MONTHS_PLUS"] as const;
