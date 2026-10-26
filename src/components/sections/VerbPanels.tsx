"use client";

import type { ReactNode } from "react";
import { Redlines, SHOTS, Shot, SketchPlate } from "@/components/plates/Plates";
import { useLanguage } from "@/context/LanguageContext";
import type { DictionaryKey } from "@/data/dictionaries";
import { pillars } from "@/data/pillars";
import type { DisciplinePillar } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type T = (key: DictionaryKey) => string;
const SIZES = "(min-width: 1024px) 58vw, 100vw";

// One real page per stage: traced, measured, built, then running behind its own login.
const STAGES: Record<DisciplinePillar, { ground: string; ink: string; muted: string; plate: (t: T) => ReactNode }> = {
  UI_UX_DESIGN: {
    ground: "bg-paper-2",
    ink: "text-ink",
    muted: "text-muted",
    plate: (t) => <SketchPlate label={t("hero.reel.sketch")} />,
  },
  WEBSITE_ENGINEERING: {
    ground: "bg-ink",
    ink: "text-paper",
    muted: "text-ink-muted",
    plate: (t) => (
      <>
        <Shot src={SHOTS.dinastiHero} alt={t("hero.reel.solid")} sizes={SIZES} />
        <Redlines />
      </>
    ),
  },
  WEB_DEVELOPMENT: {
    ground: "bg-violet",
    ink: "text-violet-ink",
    muted: "text-violet-ink",
    plate: (t) => <Shot src={SHOTS.dzikriCalculator} alt={t("how.shot.calculator")} sizes={SIZES} />,
  },
  SOFTWARE_DEVELOPMENT: {
    ground: "bg-paper",
    ink: "text-ink",
    muted: "text-muted",
    plate: (t) => <Shot src={SHOTS.dashboardLogin} alt={t("hero.reel.dashboard")} sizes={SIZES} />,
  },
};

export function VerbPanels() {
  const { t, l } = useLanguage();
  return (
    <section id="how" aria-labelledby="how-heading">
      <h2 id="how-heading" className="sr-only">
        {t("how.heading")}
      </h2>
      {pillars.map((p, i) => {
        const s = STAGES[p.id];
        return (
          <article
            key={p.id}
            aria-labelledby={`verb-${p.id}`}
            data-inspector={`${l(p.title)} · verb panel`}
            className={cn("relative py-[clamp(4.5rem,9vw,8rem)]", s.ground, s.ink)}
          >
            <div className="margin-x grid items-center gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
              <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-last")}>
                <h3 id={`verb-${p.id}`} data-reveal className="display text-display">
                  {t(`how.verb.${p.id}`)}
                </h3>
                <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8 font-medium">
                  {l(p.title)}
                </p>
                <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="text-lead mt-2 max-w-[32ch]">
                  {l(p.summary)}
                </p>
                <p data-reveal style={{ "--i": 3 } as React.CSSProperties} className={cn("text-small mt-4", s.muted)}>
                  {t("how.tools")}: {p.coreStack.join(", ")}
                </p>
              </div>
              <figure data-reveal style={{ "--i": 2 } as React.CSSProperties} className="m-0 lg:col-span-7">
                <div className="relative aspect-video overflow-clip rounded-[4px]">{s.plate(t)}</div>
              </figure>
            </div>
          </article>
        );
      })}
    </section>
  );
}
