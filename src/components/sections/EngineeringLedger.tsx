"use client";

import { GridCell } from "@/components/grid/GridCell";
import { PillarBadge } from "@/components/ui/PillarBadge";
import { useLanguage } from "@/context/LanguageContext";
import { usePillarFilter } from "@/context/PillarFilterContext";
import { ledger } from "@/data/ledger";
import { cn, splitMetrics } from "@/lib/utils";

function highlightMetrics(text: string) {
  return splitMetrics(text).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="tabular font-medium text-accent-text">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function EngineeringLedger() {
  const { t, l } = useLanguage();
  const { active } = usePillarFilter();

  return (
    <section id="ledger" aria-labelledby="ledger-heading">
      <GridCell crosshair inspector="Ledger · header · p-10" className="border-t border-hairline px-5 py-14 sm:px-10">
        <p className="text-label">{t("ledger.label")}</p>
        <h2 id="ledger-heading" className="text-h2 mt-4">
          {t("ledger.heading")}
        </h2>
        <p className="text-body mt-4 text-secondary">{t("ledger.intro")}</p>
      </GridCell>

      <ol className="border-t border-hairline">
        {ledger.map((entry, i) => {
          const dimmed = active !== null && !entry.pillars.includes(active);
          const last = i === ledger.length - 1;
          return (
            <GridCell
              as="li"
              key={entry.tag}
              inspector={`Ledger · ${entry.tag}`}
              className={cn(
                "grid grid-cols-[28px_1fr] gap-x-4 px-5 transition-opacity sm:grid-cols-[28px_220px_1fr] sm:px-10",
                i > 0 && "border-t border-hairline",
                dimmed && "opacity-45",
              )}
            >
              {/* git-log rail: one continuous line through every commit dot. */}
              <div aria-hidden className="relative row-span-2 sm:row-span-1">
                <span className={cn("absolute left-1/2 w-px -translate-x-1/2 bg-hairline", i === 0 ? "top-10" : "top-0", last ? "h-10" : "bottom-0")} />
                <span
                  className={cn(
                    "absolute left-1/2 top-9 size-2.5 -translate-x-1/2 border",
                    entry.scope === "STUDIO" ? "border-velora-pink bg-velora-pink" : "border-velora-purple bg-primary",
                  )}
                />
              </div>

              <div className="pt-8 sm:pb-8">
                <p className="tabular font-mono text-xs text-accent-text">{entry.tag}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  {entry.scope === "STUDIO" ? t("ledger.scope.studio") : entry.scope}
                </p>
              </div>

              <div className="col-start-2 pb-8 pt-3 sm:col-start-3 sm:pt-8">
                <h3 className="text-base font-semibold tracking-tight text-ink">{l(entry.title)}</h3>
                <ul className="mt-3 space-y-1.5 font-mono text-[13px] text-secondary">
                  {entry.changes.map((c) => (
                    <li key={c.en} className="flex gap-2">
                      <span aria-hidden className="text-online">
                        +
                      </span>
                      <span>{highlightMetrics(l(c))}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.pillars.map((p) => (
                    <PillarBadge key={p} id={p} dimmed={active !== null && active !== p} />
                  ))}
                </div>
              </div>
            </GridCell>
          );
        })}
      </ol>
    </section>
  );
}
