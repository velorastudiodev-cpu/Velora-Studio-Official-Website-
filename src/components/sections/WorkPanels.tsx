"use client";

import { useState, type ReactNode } from "react";
import { BookingPlate, ChairPlate, TrailPlate } from "@/components/plates/Plates";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { useVeloraEvent } from "@/lib/events";
import type { ProjectId, ProjectItem } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Look = {
  ground: string;
  /** Which part of the drawing fills the screen when cropped. */
  origin: string;
  /** Index of the metric shown as the panel's one fact. */
  fact: number;
};

const LOOK: Record<ProjectId, Look> = {
  "VEL-001": { ground: "bg-ink", origin: "78% 45%", fact: 2 },
  "VEL-002": { ground: "bg-violet", origin: "62% 55%", fact: 0 },
  "VEL-003": { ground: "bg-paper", origin: "30% 45%", fact: 0 },
};

function Panel({ project, plate, extra }: { project: ProjectItem; plate: ReactNode; extra?: ReactNode }) {
  const { t, l } = useLanguage();
  const look = LOOK[project.id];
  const name = l(project.title).split(" — ")[0] ?? "";
  const fact = project.metrics[look.fact];
  const rest = project.metrics.filter((_, i) => i !== look.fact);

  return (
    <section
      id={project.slug}
      aria-labelledby={`${project.id}-name`}
      data-inspector={`${project.id} · full panel`}
      className={cn("relative overflow-hidden lg:h-svh lg:min-h-[680px]", look.ground)}
    >
      <figure className="relative m-0 aspect-[4/5] overflow-hidden sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
        <div className="absolute inset-0 scale-[1.3]" style={{ transformOrigin: look.origin }}>
          {plate}
        </div>
      </figure>

      {/* The midline row: same place on every panel, so scrolling reads like turning plates. */}
      <div className="relative bg-ink py-8 text-paper lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:py-10">
        <div className="margin-x grid items-baseline gap-x-[var(--gutter)] gap-y-3 lg:grid-cols-12">
          <h2 id={`${project.id}-name`} className="display text-head lg:col-span-7 lg:col-start-3">
            {name}
          </h2>
          <p className="text-small text-ink-muted lg:col-span-2 lg:col-start-1 lg:row-start-1">{l(project.clientOrDomain)}</p>
          {fact && (
            <p className="tabular lg:col-span-3 lg:text-right">
              <span className="font-semibold">{fact.value}</span> {l(fact.label).toLowerCase()}
            </p>
          )}
        </div>

        <div className="margin-x mt-6 grid gap-x-[var(--gutter)] gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-3">
            <p className="max-w-[48ch]">{l(project.tagline)}</p>
            <p className="text-small mt-2 max-w-[56ch] text-ink-muted">{t(`work.caption.${project.id}`)}</p>
          </div>
          <div className="flex flex-col items-start gap-2 lg:order-last lg:col-span-2 lg:items-end">
            {project.links.liveDemo && (
              <a href={project.links.liveDemo} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-lime">
                {t("work.visit")} ↗
              </a>
            )}
            {extra}
          </div>
          <dl className="flex flex-wrap content-start gap-x-8 gap-y-4 lg:col-span-3">
            {rest.map((m) => (
              <div key={m.label.en} className="flex max-w-[14ch] flex-col">
                <dt className="text-small order-2 text-ink-muted">{l(m.label)}</dt>
                <dd className="tabular order-1 font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** The dashboard panel can replay a booking arriving from the website. */
function DashboardPanel({ project }: { project: ProjectItem }) {
  const { t, l } = useLanguage();
  const [pulse, setPulse] = useState(0);
  const send = () => setPulse((p) => p + 1);
  useVeloraEvent("velora:sync-demo", send);
  const sync = project.metrics[0];

  return (
    <Panel
      project={project}
      plate={<ChairPlate label={l(project.title)} fit="cover" pulse={pulse} />}
      extra={
        <>
          <button type="button" onClick={send} className="underline underline-offset-4 hover:text-lime">
            {t("work.simulate")}
          </button>
          <span aria-live="polite" className="text-small text-ink-muted">
            {pulse > 0 && `${t("work.simulated")} ${sync?.value ?? ""}`}
          </span>
        </>
      }
    />
  );
}

export function WorkPanels() {
  const { l } = useLanguage();
  const [p1, p2, p3] = projects;
  return (
    <div id="work">
      {p1 && <Panel project={p1} plate={<BookingPlate mode="solid" label={l(p1.title)} fit="cover" />} />}
      {p2 && <DashboardPanel project={p2} />}
      {p3 && <Panel project={p3} plate={<TrailPlate label={l(p3.title)} fit="cover" />} />}
    </div>
  );
}
