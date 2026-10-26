import { z } from "zod";
import { LedgerEntrySchema } from "@/lib/schemas";

// Newest first, like `git log`. Figures match the project metrics in projects.ts.
const seed = [
  {
    tag: "studio@2.0.0",
    scope: "STUDIO",
    pillars: ["UI_UX_DESIGN", "WEBSITE_ENGINEERING"],
    title: {
      id: "Konsol Velora Studio Dev: satu sistem desain untuk studio dan ketiga mahakarya",
      en: "Velora Studio Dev console: one design system for the studio and all three flagships",
    },
    changes: [
      { id: "Token warna violet-rose dengan kontras teks utama ≥ 7.0:1", en: "Violet-rose colour tokens with primary text contrast ≥ 7.0:1" },
      { id: "Seluruh data proyek divalidasi Zod, 100% bilingual ID/EN", en: "All project data Zod-validated, 100% bilingual ID/EN" },
    ],
  },
  {
    tag: "VEL-003@1.0.0",
    scope: "VEL-003",
    pillars: ["WEBSITE_ENGINEERING", "SOFTWARE_DEVELOPMENT"],
    title: {
      id: "Dzikri Mount Guide rilis produksi: manifest offline-first & kalkulator beban porter",
      en: "Dzikri Mount Guide ships to production: offline-first manifests & porter load calculator",
    },
    changes: [
      { id: "Manifest tiket & itinerary 100% tersedia offline, dibaca < 15ms dari IndexedDB", en: "Ticket & itinerary manifests 100% available offline, read in < 15ms from IndexedDB" },
      { id: "Bobot bundle dipangkas 68%: first load 1.1s di jaringan 3G", en: "Bundle weight cut 68%: 1.1s first load on 3G" },
      { id: "Aturan beban maksimum 20 kg per porter ditegakkan secara deterministik", en: "20 kg per porter maximum enforced deterministically" },
    ],
  },
  {
    tag: "VEL-002@1.0.0",
    scope: "VEL-002",
    pillars: ["WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"],
    title: {
      id: "Ikbar Barbershop Dashboard: CMS, POS & komisi terhubung ke VEL-001",
      en: "Ikbar Barbershop Dashboard: CMS, POS & commissions wired to VEL-001",
    },
    changes: [
      { id: "Perubahan konten & harga tayang di VEL-001 dalam 32ms lewat cache purge", en: "Content & price changes reach VEL-001 in 32ms via cache purge" },
      { id: "50+ stream kursi bersamaan via SSE tanpa lag", en: "50+ concurrent chair streams over SSE with zero lag" },
      { id: "Buku komisi kapster 100% akurat dengan audit otomatis", en: "Barber commission ledger 100% accurate with automated audit" },
    ],
  },
  {
    tag: "VEL-001@1.0.0",
    scope: "VEL-001",
    pillars: ["UI_UX_DESIGN", "WEBSITE_ENGINEERING", "WEB_DEVELOPMENT"],
    title: {
      id: "Ikbar Barbershop live: booking tiga klik dengan penguncian slot atomik",
      en: "Ikbar Barbershop goes live: three-click booking with atomic slot locking",
    },
    changes: [
      { id: "Lighthouse 100/100 dengan CLS 0.000", en: "Lighthouse 100/100 with CLS 0.000" },
      { id: "Konversi booking naik 64%, checkout di bawah 45 detik", en: "Booking conversion up 64%, checkout under 45 seconds" },
      { id: "0.00% slot bentrok; INP 18ms", en: "0.00% slot conflicts; 18ms INP" },
    ],
  },
] satisfies z.input<typeof LedgerEntrySchema>[];

export const ledger = z.array(LedgerEntrySchema).min(1).parse(seed);
