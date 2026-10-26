import { z } from "zod";
import { CapabilityPillarSchema } from "@/lib/schemas";

const seed = [
  {
    id: "UI_UX_DESIGN",
    indexCode: "01",
    title: { id: "UI/UX Designer", en: "UI/UX Designer" },
    accentVar: "--pillar-uiux",
    summary: {
      id: "Design system bertoken, prototipe interaktif, dan alur pengguna yang diuji, dengan kontras WCAG AAA sebagai syarat dasar.",
      en: "Tokenised design systems, interactive prototypes and tested user journeys, with WCAG AAA contrast as the baseline.",
    },
    deliverables: [
      { id: "Design system bertoken (warna, tipografi, spasi, gerak)", en: "Tokenised design system (colour, type, spacing, motion)" },
      { id: "Prototipe interaktif berfidelitas tinggi", en: "High-fidelity interactive prototypes" },
      { id: "Optimasi user journey & alur konversi", en: "User journey & conversion flow optimisation" },
      { id: "Audit aksesibilitas & kontras WCAG AAA", en: "Accessibility & WCAG AAA contrast audit" },
    ],
    coreStack: ["Figma", "Design Tokens", "Framer Motion", "WCAG 2.2"],
    benchmarkMetric: "WCAG AAA ≥ 7.0:1",
  },
  {
    id: "WEBSITE_ENGINEERING",
    indexCode: "02",
    title: { id: "Website Engineering", en: "Website Engineering" },
    accentVar: "--pillar-web-eng",
    summary: {
      id: "Core Web Vitals sempurna, layout tanpa pergeseran, arsitektur SEO semantik, dan gerak 60–120fps berakselerasi perangkat keras.",
      en: "Perfect Core Web Vitals, zero-shift layouts, semantic SEO architecture and hardware-accelerated 60–120fps motion.",
    },
    deliverables: [
      { id: "Skor Core Web Vitals 100/100", en: "Core Web Vitals scored 100/100" },
      { id: "Layout zero-CLS dengan dimensi terkunci", en: "Zero-CLS layouts with locked dimensions" },
      { id: "Arsitektur SEO semantik & data terstruktur", en: "Semantic SEO architecture & structured data" },
      { id: "Animasi 60–120fps berbasis transform", en: "Transform-based 60–120fps animation" },
    ],
    coreStack: ["Next.js 15", "Edge Runtime", "Lighthouse CI", "Web Vitals"],
    benchmarkMetric: "Lighthouse 100/100 · CLS 0.000",
  },
  {
    id: "WEB_DEVELOPMENT",
    indexCode: "03",
    title: { id: "Web Developer", en: "Web Developer" },
    accentVar: "--pillar-web-dev",
    summary: {
      id: "Aplikasi web full-stack Next.js App Router: booking real-time, dashboard CMS multi-tenant, pembayaran, dan manajemen state.",
      en: "Full-stack Next.js App Router web apps: real-time booking, multi-tenant CMS dashboards, payments and state management.",
    },
    deliverables: [
      { id: "Aplikasi full-stack Next.js App Router", en: "Full-stack Next.js App Router applications" },
      { id: "Sistem booking real-time bebas bentrok", en: "Conflict-free real-time booking systems" },
      { id: "Dashboard CMS multi-tenant", en: "Multi-tenant CMS dashboards" },
      { id: "Integrasi pembayaran QRIS & webhook", en: "QRIS payment & webhook integration" },
    ],
    coreStack: ["Next.js App Router", "TypeScript", "Prisma", "Server-Sent Events"],
    benchmarkMetric: "INP 18ms · +64% booking conversion",
  },
  {
    id: "SOFTWARE_DEVELOPMENT",
    indexCode: "04",
    title: { id: "Software Developer", en: "Software Developer" },
    accentVar: "--pillar-soft-dev",
    summary: {
      id: "Skema basis data relasional, API dengan rate-limiting & idempotensi, sinkronisasi offline-first, dan kontrol akses berbasis peran.",
      en: "Relational database schemas, rate-limited idempotent APIs, offline-first sync and role-based access control.",
    },
    deliverables: [
      { id: "Perancangan skema basis data relasional", en: "Relational database schema design" },
      { id: "API dengan rate-limiting & idempotency key", en: "APIs with rate limiting & idempotency keys" },
      { id: "Sinkronisasi data offline-first (IndexedDB)", en: "Offline-first data sync (IndexedDB)" },
      { id: "Role-Based Access Control (RBAC)", en: "Role-Based Access Control (RBAC)" },
    ],
    coreStack: ["PostgreSQL", "Redis", "Zod", "Service Workers"],
    benchmarkMetric: "0.00% slot conflicts · 100% ledger accuracy",
  },
] satisfies z.input<typeof CapabilityPillarSchema>[];

export const pillars = z.array(CapabilityPillarSchema).length(4).parse(seed);
