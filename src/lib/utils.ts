import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { pillars } from "@/data/pillars";
import type { CTAInquiryPayload, DisciplinePillar, LocalizedText, ProjectId } from "@/lib/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Damped harmonic spring presets (PRD §2.3).
export const SPRING = {
  micro: { type: "spring", stiffness: 420, damping: 28, mass: 0.8 },
  drawer: { type: "spring", stiffness: 290, damping: 30, mass: 1.0 },
  node: { type: "spring", stiffness: 520, damping: 34, mass: 0.6 },
} as const;

// ---------- Project blueprint calculator (CTA console) ----------

export type ProjectType = CTAInquiryPayload["selectedProjectType"];
export type Timeline = CTAInquiryPayload["targetTimeline"];

const ARCHETYPES: Record<
  ProjectType,
  { stack: string[]; nodes: number; lighthouse: string; reference: ProjectId[]; deliverables: LocalizedText[] }
> = {
  FULL_ECOSYSTEM_WEB_AND_CMS: {
    stack: ["Next.js 15", "TypeScript", "PostgreSQL", "Prisma", "Server-Sent Events"],
    nodes: 9,
    lighthouse: "100 web · ≥95 dashboard",
    reference: ["VEL-001", "VEL-002"],
    deliverables: [
      { id: "Website klien yang terhubung ke dashboard", en: "Client website wired to its dashboard" },
      { id: "Dashboard CMS & operasional kustom", en: "Custom CMS & operations dashboard" },
      { id: "Basis data & event bus bersama untuk keduanya", en: "One shared database & event bus for both" },
    ],
  },
  HIGH_CRAFT_WEB_EXPERIENCE: {
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion"],
    nodes: 5,
    lighthouse: "100/100",
    reference: ["VEL-001"],
    deliverables: [
      { id: "Website brand berkualitas tinggi", en: "High-craft brand website" },
      { id: "Alur booking atau konversi tiga langkah", en: "Three-step booking or conversion flow" },
      { id: "SEO semantik & Core Web Vitals hijau", en: "Semantic SEO & green Core Web Vitals" },
    ],
  },
  CUSTOM_SAAS_OR_MARKETPLACE: {
    stack: ["Next.js 15", "TypeScript", "PostgreSQL", "PWA / IndexedDB", "Zod"],
    nodes: 8,
    lighthouse: "100/100 mobile",
    reference: ["VEL-003"],
    deliverables: [
      { id: "Marketplace dengan booking & escrow", en: "Marketplace with booking & escrow" },
      { id: "Mode offline-first untuk area minim sinyal", en: "Offline-first mode for low-signal areas" },
      { id: "Panel admin & verifikasi mitra", en: "Admin panel & partner verification" },
    ],
  },
  DESIGN_SYSTEM_AND_UIUX_OVERHAUL: {
    stack: ["Figma", "Design Tokens", "Tailwind CSS v4", "TypeScript"],
    nodes: 3,
    lighthouse: "100/100",
    reference: [],
    deliverables: [
      { id: "Sistem token warna, tipografi & gerak", en: "Colour, type & motion token system" },
      { id: "Pustaka komponen terdokumentasi", en: "Documented component library" },
      { id: "Refaktor arsitektur frontend", en: "Frontend architecture refactor" },
    ],
  },
};

const PILLAR_STACK: Record<DisciplinePillar, string[]> = {
  UI_UX_DESIGN: ["Figma", "Design Tokens"],
  WEBSITE_ENGINEERING: ["Edge Runtime", "Lighthouse CI"],
  WEB_DEVELOPMENT: ["Next.js App Router", "Server Actions"],
  SOFTWARE_DEVELOPMENT: ["PostgreSQL", "Zod", "RBAC"],
};

// Extra architecture nodes a pillar brings: edge layer, API layer, auth + data layer.
const PILLAR_NODES: Record<DisciplinePillar, number> = {
  UI_UX_DESIGN: 0,
  WEBSITE_ENGINEERING: 1,
  WEB_DEVELOPMENT: 1,
  SOFTWARE_DEVELOPMENT: 2,
};

/** Two-week sprints in each timeline option. */
export const TIMELINE_SPRINTS: Record<Timeline, number> = {
  URGENT_2_4_WEEKS: 2,
  STANDARD_1_2_MONTHS: 4,
  ENTERPRISE_3_MONTHS_PLUS: 6,
};

const NODES_PER_SPRINT = 2;

export type Blueprint = {
  stack: string[];
  nodes: number;
  lighthouse: string;
  reference: ProjectId[];
  deliverables: LocalizedText[];
  /** >1 means the scope does not fit the timeline and ships in phases, MVP first. */
  phases: number;
};

/** Deterministic: the same choices always give the same blueprint. */
export function buildBlueprint(type: ProjectType, selected: readonly DisciplinePillar[], timeline: Timeline): Blueprint {
  const a = ARCHETYPES[type];
  const stack = [...new Set([...a.stack, ...selected.flatMap((p) => PILLAR_STACK[p])])];
  const nodes = a.nodes + selected.reduce((sum, p) => sum + PILLAR_NODES[p], 0);
  const extra = pillars.filter((p) => selected.includes(p.id)).flatMap((p) => p.deliverables.slice(0, 1));
  const deliverables = [...a.deliverables, ...extra];
  const phases = Math.max(1, Math.ceil(nodes / (TIMELINE_SPRINTS[timeline] * NODES_PER_SPRINT)));
  return { stack, nodes, lighthouse: a.lighthouse, reference: a.reference, deliverables, phases };
}
