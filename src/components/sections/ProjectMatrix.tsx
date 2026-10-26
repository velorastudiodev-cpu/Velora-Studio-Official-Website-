"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GridCell } from "@/components/grid/GridCell";
import { ArchitectureGraph } from "@/components/interactive/ArchitectureGraph";
import { PillarBadge } from "@/components/ui/PillarBadge";
import { useLanguage } from "@/context/LanguageContext";
import { usePillarFilter } from "@/context/PillarFilterContext";
import { projects } from "@/data/projects";
import type { ProjectItem } from "@/lib/schemas";
import { useVeloraEvent } from "@/lib/events";
import { cn, SPRING } from "@/lib/utils";

const mono = "font-mono text-[11px] uppercase tracking-[0.08em]";

/** Sync latency is VEL-002's own published metric, so the simulation reuses it rather than inventing one. */
const SYNC_MS = projects.find((p) => p.id === "VEL-002")?.metrics[0]?.value ?? "32ms";

type Booking = { n: number; chair: number; time: string };

function booking(n: number): Booking {
  const minutes = 10 * 60 + (n - 1) * 30;
  const time = `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return { n, chair: ((n - 1) % 4) + 1, time };
}

function EcosystemSync() {
  const { t } = useLanguage();
  const [inFlight, setInFlight] = useState<number | null>(null);
  const [log, setLog] = useState<Booking[]>([]);
  const next = (log[0]?.n ?? 0) + 1;
  const send = () => {
    if (inFlight === null) setInFlight(next);
  };
  useVeloraEvent("velora:sync-demo", send);

  return (
    <GridCell inspector="Ecosystem link · VEL-001 ⇄ VEL-002" className="grid border-t border-hairline lg:grid-cols-12">
      <div className="px-5 py-8 sm:px-10 lg:col-span-7 lg:border-r lg:border-hairline">
        <p className="text-sm text-ink">{t("projects.ecosystem")}</p>
        <div className="mt-6 flex items-center gap-3">
          <span className="shrink-0 border border-hairline bg-elevated px-3 py-2 font-mono text-xs text-ink">VEL-001</span>
          <div className="relative h-px flex-1 overflow-hidden bg-hairline">
            {inFlight !== null && (
              <motion.div
                key={inFlight}
                className="absolute inset-0"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={SPRING.node}
                onAnimationComplete={() => {
                  setLog((l) => [booking(inFlight), ...l].slice(0, 3));
                  setInFlight(null);
                }}
              >
                <span className="absolute right-0 top-1/2 h-[3px] w-10 -translate-y-1/2 bg-velora-pink" />
              </motion.div>
            )}
          </div>
          <span
            className={cn(
              "shrink-0 border bg-elevated px-3 py-2 font-mono text-xs text-ink transition-colors",
              log.length && inFlight === null ? "border-velora-pink" : "border-hairline",
            )}
          >
            VEL-002
          </span>
        </div>
        <button
          type="button"
          disabled={inFlight !== null}
          onClick={send}
          className={`${mono} mt-6 h-10 border border-velora-purple px-4 text-ink transition-colors hover:bg-velora-purple hover:text-[#FAFAFC] disabled:opacity-60`}
        >
          {inFlight !== null ? t("projects.simulating") : t("projects.simulate")}
        </button>
      </div>

      <div className="border-t border-hairline px-5 py-8 sm:px-10 lg:col-span-5 lg:border-t-0" aria-live="polite">
        <p className={`${mono} flex justify-between text-secondary`}>
          <span>VEL-002 · CMS</span>
          <span className="text-velora-pink">{t("projects.sim.tag")}</span>
        </p>
        <ul className="mt-4 h-[96px] space-y-2 font-mono text-xs">
          {log.length === 0 && <li className="text-secondary">{t("projects.sim.empty")}</li>}
          <AnimatePresence initial={false}>
            {log.map((b) => (
              <motion.li
                key={b.n}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={SPRING.micro}
                className="tabular flex justify-between gap-3 text-ink"
              >
                <span>
                  #BK-{String(b.n).padStart(4, "0")} · {t("projects.sim.chair")} {String(b.chair).padStart(2, "0")} ·{" "}
                  {b.time} WIB
                </span>
                <span className="text-online">
                  {t("projects.synced")} · {SYNC_MS}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </GridCell>
  );
}

function SpecPanel({ project }: { project: ProjectItem }) {
  const { t, l } = useLanguage();
  const s = project.designSpec;
  const rows = [
    [t("projects.spec.wcag"), s.wcagLevel],
    [t("projects.spec.contrast"), s.contrastRatio],
    [t("projects.spec.tokens"), String(s.tokenCount)],
    [t("projects.spec.frame"), `${s.interactionFrameBudgetMs}ms`],
    [t("projects.spec.grid"), s.gridSystem],
  ] as const;
  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className={`${mono} text-muted`}>{k}</dt>
            <dd className="tabular mt-0.5 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className={`${mono} text-muted`}>{t("projects.spec.palette")}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {s.colorSignature.map((c) => (
            <li key={c} className="flex items-center gap-2 border border-hairline py-1 pl-1 pr-2 font-mono text-[11px] text-secondary">
              <span aria-hidden className="size-4 border border-hairline" style={{ background: c }} />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className={`${mono} text-muted`}>{t("projects.spec.flows")}</p>
        <ol className="mt-2 space-y-2 text-sm text-ink">
          {s.keyUXFlows.map((f, i) => (
            <li key={f.en} className="flex gap-3">
              <span className="tabular font-mono text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              {l(f)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const { t, l } = useLanguage();
  const { active } = usePillarFilter();
  const [tab, setTab] = useState<"architecture" | "design">("architecture");
  const dimmed = active !== null && !project.pillars.includes(active);
  const [name, subtitle] = l(project.title).split(" — ");
  const tabs = [
    ["architecture", t("projects.tab.architecture")],
    ["design", t("projects.tab.design")],
  ] as const;

  return (
    <GridCell
      as="article"
      id={project.slug}
      crosshair
      inspector={`${project.id} · card · 7:5 grid`}
      aria-labelledby={`${project.id}-title`}
      className={cn("grid border-t border-hairline transition-opacity lg:grid-cols-12", dimmed && "opacity-45")}
    >
      <div className="px-5 py-10 sm:px-10 lg:col-span-7 lg:border-r lg:border-hairline">
        <p className={`${mono} flex flex-wrap items-center gap-x-3 gap-y-1 text-secondary`}>
          <span className="text-accent-text">{project.id}</span>
          <span>{l(project.categoryBadge)}</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-1.5 rounded-full bg-online" />
            {t(`projects.status.${project.status}`)}
          </span>
          <span className="tabular">{project.timeline}</span>
        </p>
        <h3 id={`${project.id}-title`} className="text-h2 mt-4">
          {name}
        </h3>
        {subtitle && <p className="mt-1 text-sm text-secondary">{subtitle}</p>}
        <p className="text-body mt-4 text-ink">{l(project.tagline)}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.pillars.map((p) => (
            <PillarBadge key={p} id={p} dimmed={active !== null && active !== p} />
          ))}
        </div>

        <dl className="mt-8 grid grid-cols-2 border-l border-t border-hairline sm:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.label.en} className="flex flex-col border-b border-r border-hairline p-4">
              <dt className="order-2 mt-1 text-xs text-secondary">{l(m.label)}</dt>
              <dd className="tabular order-1 text-lg font-semibold tracking-tight text-ink">{m.value}</dd>
              <dd className="tabular order-3 mt-2 font-mono text-[10px] uppercase text-accent-text">{m.delta}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className={`${mono} text-muted`}>{t("projects.problem")}</p>
            <p className="mt-2 text-sm leading-relaxed text-secondary">{l(project.problemStatement)}</p>
          </div>
          <div>
            <p className={`${mono} text-muted`}>{t("projects.solution")}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{l(project.engineeringSolution)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`${mono} text-muted`}>{t("projects.stack")}</p>
            <ul className="mt-2 flex flex-wrap gap-1">
              {project.stack.map((s) => (
                <li key={s} className="border border-hairline px-2 py-0.5 font-mono text-[11px] text-secondary">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {project.links.liveDemo && (
            <a
              href={project.links.liveDemo}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 shrink-0 items-center gap-2 border border-strong px-4 text-sm font-medium text-ink transition-colors hover:border-velora-pink"
            >
              {t("projects.liveDemo")}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
            </a>
          )}
        </div>
        <p className="mt-4 font-mono text-[11px] text-muted">
          {t("projects.role")}: {project.soloFounderRole}
          {project.linkedProjectId && (
            <>
              {" · "}
              {t("projects.linkedTo")} <a href={`#${projects.find((p) => p.id === project.linkedProjectId)?.slug}`} className="text-accent-text underline-offset-2 hover:underline">{project.linkedProjectId}</a>
            </>
          )}
        </p>
      </div>

      <div className="border-t border-hairline lg:sticky lg:top-[var(--topbar-h)] lg:col-span-5 lg:self-start lg:border-t-0">
        <div role="tablist" aria-label={project.id} className="grid grid-cols-2 border-b border-hairline">
          {tabs.map(([id, label], i) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`${project.id}-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`${project.id}-panel`}
              onClick={() => setTab(id)}
              className={cn(
                `${mono} relative min-h-12 px-4 py-3 text-left text-[10px] text-secondary aria-selected:text-ink`,
                i === 0 && "border-r border-hairline",
              )}
            >
              {label}
              {tab === id && (
                <motion.span
                  layoutId={`${project.id}-tab`}
                  transition={SPRING.micro}
                  className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-velora-pink"
                />
              )}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${project.id}-panel`}
          aria-labelledby={`${project.id}-tab-${tab}`}
          className="min-h-[480px] px-5 py-6 sm:px-6"
        >
          {tab === "architecture" ? <ArchitectureGraph nodes={project.architecture} /> : <SpecPanel project={project} />}
        </div>
      </div>
    </GridCell>
  );
}

export function ProjectMatrix() {
  const { t } = useLanguage();
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <GridCell crosshair inspector="Projects · header · p-10" className="border-t border-hairline px-5 py-14 sm:px-10">
        <p className="text-label">{t("projects.label")}</p>
        <h2 id="projects-heading" className="text-h2 mt-4">
          {t("projects.heading")}
        </h2>
        <p className="text-body mt-4 text-secondary">{t("projects.intro")}</p>
      </GridCell>
      <EcosystemSync />
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </section>
  );
}
