"use client";

import type { ReactNode } from "react";
import { BookingPlate, ChairPlate, TrailPlate } from "@/components/plates/Plates";
import { useLanguage } from "@/context/LanguageContext";
import { pillars } from "@/data/pillars";
import type { DisciplinePillar } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** Redline measurements over the finished booking screen: what engineering checks. */
function Redlines() {
  const mark = { stroke: "var(--redline)", strokeWidth: 3 };
  const tag = (x: number, y: number, text: string) => (
    <g>
      <rect x={x} y={y - 30} width={text.length * 15 + 24} height={42} fill="var(--redline)" />
      <text x={x + 12} y={y} fontSize={26} fontWeight={700} fill="#fff">
        {text}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 1600 900" aria-hidden className="absolute inset-0 h-full w-full" style={{ fontFamily: "var(--font-text)" }}>
      {/* QRIS button width */}
      <line x1={1020} y1={850} x2={1520} y2={850} {...mark} />
      <line x1={1020} y1={836} x2={1020} y2={864} {...mark} />
      <line x1={1520} y1={836} x2={1520} y2={864} {...mark} />
      {tag(1200, 890, "500 × 120")}
      {/* Slot rhythm */}
      <rect x={1020} y={220} width={116} height={76} fill="none" {...mark} strokeDasharray="8 6" />
      {tag(1020, 205, "116 × 76")}
      {/* Interaction budget */}
      {tag(80, 660, "INP 18 ms")}
      {tag(300, 660, "CLS 0.000")}
    </svg>
  );
}

const STAGES: Record<DisciplinePillar, { ground: string; ink: string; muted: string; plate: (label: string) => ReactNode }> = {
  UI_UX_DESIGN: {
    ground: "bg-paper-2",
    ink: "text-ink",
    muted: "text-muted",
    plate: (label) => <BookingPlate mode="sketch" label={label} />,
  },
  WEBSITE_ENGINEERING: {
    ground: "bg-ink",
    ink: "text-paper",
    muted: "text-ink-muted",
    plate: (label) => (
      <>
        <BookingPlate mode="solid" label={label} />
        <Redlines />
      </>
    ),
  },
  WEB_DEVELOPMENT: {
    ground: "bg-violet",
    ink: "text-violet-ink",
    muted: "text-violet-ink",
    plate: (label) => <ChairPlate label={label} />,
  },
  SOFTWARE_DEVELOPMENT: {
    ground: "bg-paper",
    ink: "text-ink",
    muted: "text-muted",
    plate: (label) => <TrailPlate label={label} />,
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
                <div className="relative aspect-video overflow-hidden rounded-[4px]">{s.plate(l(p.title))}</div>
              </figure>
            </div>
          </article>
        );
      })}
    </section>
  );
}
