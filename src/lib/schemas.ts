import { z } from "zod";

export const LocaleEnum = z.enum(["id", "en"]);

export const LocalizedTextSchema = z.object({
  id: z.string().min(1),
  en: z.string().min(1),
});

export const DisciplinePillarEnum = z.enum([
  "UI_UX_DESIGN",
  "WEBSITE_ENGINEERING",
  "WEB_DEVELOPMENT",
  "SOFTWARE_DEVELOPMENT",
]);

export const ProjectIdEnum = z.enum(["VEL-001", "VEL-002", "VEL-003"]);

export const ArchitectureNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum([
    "client_web",
    "cms_dashboard",
    "design_system",
    "edge_gateway",
    "api_core",
    "database",
    "realtime_sync",
    "offline_storage",
  ]),
  tech: z.string(),
  latencyMs: z.number(),
  connections: z.array(z.string()),
});

export const DesignSystemSpecSchema = z.object({
  wcagLevel: z.enum(["AA", "AAA"]),
  contrastRatio: z.string(),
  tokenCount: z.number().int().positive(),
  interactionFrameBudgetMs: z.number(),
  gridSystem: z.string(),
  colorSignature: z.array(z.string()).min(3),
  keyUXFlows: z.array(LocalizedTextSchema).min(3),
});

export const ProjectSchema = z
  .object({
    id: ProjectIdEnum,
    // Links VEL-001 (client web) and VEL-002 (CMS) as one ecosystem.
    linkedProjectId: ProjectIdEnum.optional(),
    title: LocalizedTextSchema,
    slug: z.string(),
    categoryBadge: LocalizedTextSchema,
    tagline: LocalizedTextSchema,
    clientOrDomain: LocalizedTextSchema,
    soloFounderRole: z.string(),
    pillars: z.array(DisciplinePillarEnum).min(2),
    timeline: z.string(),
    status: z.enum(["PRODUCTION", "LIVE_ECOSYSTEM"]),
    stack: z.array(z.string()).min(4),
    problemStatement: LocalizedTextSchema,
    engineeringSolution: LocalizedTextSchema,
    metrics: z
      .array(
        z.object({
          label: LocalizedTextSchema,
          value: z.string(),
          delta: z.string(),
        }),
      )
      .length(4),
    links: z.object({
      liveDemo: z.url().optional(),
      architectureDoc: z.string().optional(),
      figmaRedline: z.string().optional(),
    }),
    architecture: z.array(ArchitectureNodeSchema).min(5),
    designSpec: DesignSystemSpecSchema,
  })
  // A graph edge pointing at a missing node would render a dangling line.
  .refine(
    (p) => {
      const ids = new Set(p.architecture.map((n) => n.id));
      return p.architecture.every((n) => n.connections.every((c) => ids.has(c)));
    },
    { message: "architecture.connections must reference existing node ids" },
  );

export const CapabilityPillarSchema = z.object({
  id: DisciplinePillarEnum,
  indexCode: z.string(),
  title: LocalizedTextSchema,
  accentVar: z.string(),
  summary: LocalizedTextSchema,
  deliverables: z.array(LocalizedTextSchema).min(4),
  coreStack: z.array(z.string()).min(4),
  benchmarkMetric: z.string(),
});

// Every UI string must exist in both languages.
export const DictionarySchema = z.record(z.string(), LocalizedTextSchema);

export const CTAInquiryPayloadSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.email(),
  companyOrBrand: z.string().min(2),
  selectedProjectType: z.enum([
    "FULL_ECOSYSTEM_WEB_AND_CMS",
    "HIGH_CRAFT_WEB_EXPERIENCE",
    "CUSTOM_SAAS_OR_MARKETPLACE",
    "DESIGN_SYSTEM_AND_UIUX_OVERHAUL",
  ]),
  selectedPillars: z.array(DisciplinePillarEnum).min(1),
  targetTimeline: z.enum(["URGENT_2_4_WEEKS", "STANDARD_1_2_MONTHS", "ENTERPRISE_3_MONTHS_PLUS"]),
  projectScopeNotes: z.string().min(20).max(1500),
});

export type Locale = z.infer<typeof LocaleEnum>;
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type DisciplinePillar = z.infer<typeof DisciplinePillarEnum>;
export type ProjectId = z.infer<typeof ProjectIdEnum>;
export type ArchitectureNode = z.infer<typeof ArchitectureNodeSchema>;
export type ProjectItem = z.infer<typeof ProjectSchema>;
export type CapabilityPillar = z.infer<typeof CapabilityPillarSchema>;
export type CTAInquiryPayload = z.infer<typeof CTAInquiryPayloadSchema>;
