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
      <header className="margin-x grid items-end gap-x-[var(--gutter)] gap-y-6 bg-paper pb-[clamp(3rem,6vw,5rem)] pt-[clamp(5rem,10vw,9rem)] lg:grid-cols-12">
        <h2 id="how-heading" className="display text-display lg:col-span-7">
          <span className="rise-mask">
            <span className="rise-in" data-reveal>
              {t("how.heading")}
            </span>
          </span>
        </h2>
        <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="text-lead max-w-[36ch] lg:col-span-4 lg:col-start-9">
          {t("how.intro")}
        </p>
      </header>
      {pillars.map((p, i) => {
        const s = STAGES[p.id];
        return (
          <article
            key={p.id}
            aria-labelledby={`verb-${p.id}`}
            data-inspector={`${l(p.title)} · verb panel`}
            // From lg up each stage pins and the next slides over it, like sheets laid on a desk.
            className={cn(
              "relative py-[clamp(4.5rem,9vw,8rem)] lg:sticky lg:top-0 lg:flex lg:min-h-svh lg:items-center lg:shadow-[0_-24px_48px_rgb(0_0_0/0.14)]",
              s.ground,
              s.ink,
            )}
          >
            <div className="margin-x grid w-full items-center gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
              <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-last")}>
                <p data-reveal className={cn("tabular text-small", s.muted)}>
                  {String(i + 1).padStart(2, "0")} / {String(pillars.length).padStart(2, "0")}
                </p>
                <h3 id={`verb-${p.id}`} className="display mt-3 text-display">
                  <span className="rise-mask">
                    <span className="rise-in" data-reveal>
                      {t(`how.verb.${p.id}`)}
                    </span>
                  </span>
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
              <figure data-reveal="clip" className="m-0 lg:col-span-7">
                <div className="relative aspect-video overflow-clip rounded-[4px]">{s.plate(t)}</div>
              </figure>
            </div>
          </article>
        );
      })}
    </section>
  );
}
