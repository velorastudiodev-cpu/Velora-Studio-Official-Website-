"use client";

import { useLanguage } from "@/context/LanguageContext";
import { pillars } from "@/data/pillars";
import type { DisciplinePillar } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** Discipline chip: 1px border and dot in the pillar's own accent token. */
export function PillarBadge({ id, dimmed = false }: { id: DisciplinePillar; dimmed?: boolean }) {
  const { l } = useLanguage();
  const pillar = pillars.find((p) => p.id === id);
  if (!pillar) return null;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 border px-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink transition-opacity",
        dimmed && "opacity-40",
      )}
      style={{ borderColor: `var(${pillar.accentVar})` }}
    >
      <span aria-hidden className="size-1.5" style={{ background: `var(${pillar.accentVar})` }} />
      {l(pillar.title)}
    </span>
  );
}
