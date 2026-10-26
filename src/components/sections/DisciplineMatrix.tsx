"use client";

import { motion } from "motion/react";
import { GridCell } from "@/components/grid/GridCell";
import { DesignTokenPlayground } from "@/components/interactive/DesignTokenPlayground";
import { useLanguage } from "@/context/LanguageContext";
import { usePillarFilter } from "@/context/PillarFilterContext";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";
import { cn, SPRING } from "@/lib/utils";

const chip =
  "relative h-8 px-3 font-mono text-[11px] uppercase tracking-[0.06em] text-secondary transition-colors hover:text-ink aria-pressed:text-ink";

export function DisciplineMatrix() {
  const { t, l } = useLanguage();
  const { active, setActive } = usePillarFilter();

  return (
    <>
      <GridCell
        as="section"
        id="pillars"
        crosshair
        inspector="Pillars · header · p-10"
        aria-labelledby="pillars-heading"
        className="border-t border-hairline px-5 py-14 sm:px-10"
      >
        <div>
          <div>
            <p className="text-label">{t("pillars.label")}</p>
            <h2 id="pillars-heading" className="text-h2 mt-4">
              {t("pillars.heading")}
            </h2>
            <p className="text-body mt-4 text-secondary">{t("pillars.intro")}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-1" role="group" aria-label={t("cmdk.group.pillars")}>
            {[null, ...pillars.map((p) => p.id)].map((id) => {
              const pressed = active === id;
              const pillar = pillars.find((p) => p.id === id);
              return (
                <button key={id ?? "all"} type="button" aria-pressed={pressed} onClick={() => setActive(id)} className={chip}>
                  {pressed && (
                    <motion.span
                      layoutId="pillar-chip"
                      transition={SPRING.micro}
                      className="absolute inset-0 border"
                      style={{ borderColor: pillar ? `var(${pillar.accentVar})` : "var(--border-strong)" }}
                    />
                  )}
                  <span className="relative">{pillar ? `${pillar.indexCode} ${l(pillar.title)}` : t("pillars.filter.all")}</span>
                </button>
              );
            })}
          </div>
        </div>
      </GridCell>

      <div className="grid border-t border-hairline md:grid-cols-2">
        {pillars.map((p) => {
          const isActive = active === p.id;
          const dimmed = active !== null && !isActive;
          const usedIn = projects.filter((proj) => proj.pillars.includes(p.id)).map((proj) => proj.id);
          return (
            <GridCell
              key={p.id}
              as="article"
              inspector={`Pillar ${p.indexCode} · ${p.accentVar}`}
              className={cn(
                "flex flex-col border-hairline px-5 py-8 transition-opacity sm:px-10 [&:nth-child(n+2)]:border-t md:odd:border-r md:[&:nth-child(2)]:border-t-0",
                dimmed && "opacity-45",
              )}
              style={{ boxShadow: isActive ? `inset 0 2px 0 var(${p.accentVar})` : undefined }}
            >
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(isActive ? null : p.id)}
                className="group flex items-baseline gap-3 text-left"
              >
                <span className="tabular font-mono text-sm" style={{ color: `var(${p.accentVar})` }}>
                  {p.indexCode}{" //"}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink underline-offset-4 group-hover:underline">
                  {l(p.title)}
                </h3>
              </button>
              <p className="text-body mt-3 text-secondary">{l(p.summary)}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{t("pillars.deliverables")}</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink">
                    {p.deliverables.map((d) => (
                      <li key={d.en} className="flex gap-2">
                        <span aria-hidden className="mt-2 size-1 shrink-0" style={{ background: `var(${p.accentVar})` }} />
                        {l(d)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{t("pillars.stack")}</p>
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {p.coreStack.map((s) => (
                      <li key={s} className="border border-hairline px-2 py-0.5 font-mono text-[11px] text-secondary">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{t("pillars.benchmark")}</p>
                  <p className="tabular mt-1 text-sm font-medium text-ink">{p.benchmarkMetric}</p>
                </div>
                <p className="tabular font-mono text-[11px] text-secondary">{usedIn.join(" · ")}</p>
              </div>
            </GridCell>
          );
        })}
      </div>

      <DesignTokenPlayground />
    </>
  );
}
