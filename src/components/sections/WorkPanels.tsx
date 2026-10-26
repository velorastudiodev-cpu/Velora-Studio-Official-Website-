"use client";

import { SHOTS, Shot } from "@/components/plates/Plates";
import { useLanguage } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import type { ProjectId, ProjectItem } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Look = {
  ground: string;
  /** Screenshot that fills the panel. */
  shot: string;
  /** Index of the metric shown as the panel's one fact. */
  fact: number;
};

const LOOK: Record<ProjectId, Look> = {
  "VEL-001": { ground: "bg-ink", shot: SHOTS.dinastiPortfolio, fact: 1 },
  "VEL-002": { ground: "bg-ink", shot: SHOTS.dashboardPanel, fact: 0 },
  "VEL-003": { ground: "bg-ink", shot: SHOTS.dzikriGallery, fact: 0 },
};

function Panel({ project }: { project: ProjectItem }) {
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
      className={cn("relative overflow-clip lg:h-svh lg:min-h-[680px]", look.ground)}
    >
      <figure className="relative m-0 aspect-[4/5] overflow-clip sm:aspect-video lg:absolute lg:inset-0 lg:aspect-auto">
        {/* Slightly oversized so the scroll drift never shows an edge. */}
        <div className="drift absolute inset-0 scale-[1.08]">
          <Shot src={look.shot} alt={t(`work.caption.${project.id}`)} sizes="100vw" />
        </div>
      </figure>

      {/* The midline row: same place on every panel, so scrolling reads like turning plates. */}
      <div className="relative bg-ink py-8 text-paper lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:py-10">
        <div className="margin-x grid items-baseline gap-x-[var(--gutter)] gap-y-3 lg:grid-cols-12">
          <h2 id={`${project.id}-name`} data-reveal className="display text-head lg:col-span-7 lg:col-start-3">
            {name}
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="text-small text-ink-muted lg:col-span-2 lg:col-start-1 lg:row-start-1">{l(project.clientOrDomain)}</p>
          {fact && (
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="tabular lg:col-span-3 lg:text-right">
              <span className="font-semibold">{fact.value}</span> {l(fact.label).toLowerCase()}
            </p>
          )}
        </div>

        <div className="margin-x mt-6 grid gap-x-[var(--gutter)] gap-y-6 lg:grid-cols-12">
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-5 lg:col-start-3">
            <p className="max-w-[48ch]">{l(project.tagline)}</p>
            <p className="text-small mt-2 max-w-[56ch] text-ink-muted">{t(`work.caption.${project.id}`)}</p>
          </div>
          <div data-reveal style={{ "--i": 4 } as React.CSSProperties} className="flex flex-col items-start gap-2 lg:order-last lg:col-span-2 lg:items-end">
            {project.links.liveDemo && (
              <a href={project.links.liveDemo} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-lime">
                {t("work.visit")} ↗
              </a>
            )}
          </div>
          <dl data-reveal style={{ "--i": 3 } as React.CSSProperties} className="flex flex-wrap content-start gap-x-8 gap-y-4 lg:col-span-3">
            {rest.map((m) => (
              <div key={m.label.en} className="flex max-w-[16ch] flex-col">
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

export function WorkPanels() {
  return (
    <div id="work">
      {projects.map((p) => (
        <Panel key={p.id} project={p} />
      ))}
    </div>
  );
}
