"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { whatsappLink } from "@/data/contact";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";
import { PROJECT_TYPES as TYPES, TIMELINES } from "@/lib/enums";
import type { DisciplinePillar } from "@/lib/schemas";
import { buildBlueprint, cn, SPRING, type ProjectType, type Timeline } from "@/lib/utils";


const legend = "text-small font-medium";
const field =
  "mt-2 w-full bg-paper px-4 py-3 text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-violet";

export function PlanConfigurator() {
  const { t, l } = useLanguage();
  const [type, setType] = useState<ProjectType>("FULL_ECOSYSTEM_WEB_AND_CMS");
  const [selected, setSelected] = useState<DisciplinePillar[]>(["UI_UX_DESIGN", "WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"]);
  const [timeline, setTimeline] = useState<Timeline>("STANDARD_1_2_MONTHS");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const bp = buildBlueprint(type, selected, timeline);
  const firstRelease = Math.ceil(bp.nodes / bp.phases);

  // The last skill cannot be switched off: a plan always needs someone to do something.
  const toggle = (id: DisciplinePillar) =>
    setSelected((s) =>
      s.includes(id) ? (s.length > 1 ? s.filter((p) => p !== id) : s) : pillars.map((p) => p.id).filter((p) => p === id || s.includes(p)),
    );

  const message = [
    t("cta.msg.greeting"),
    "",
    ...(name.trim() ? [`${t("cta.msg.name")}: ${name.trim()}`] : []),
    `${t("cta.archetype")}: ${t(`cta.archetype.${type}`)}`,
    `${t("cta.pillars")}: ${pillars.filter((p) => selected.includes(p.id)).map((p) => l(p.title)).join(", ")}`,
    `${t("cta.timeline")}: ${t(`cta.timeline.${timeline}`)}`,
    `${t("cta.msg.blueprint")}: ${bp.nodes} ${t("cta.msg.nodes")}, ${bp.phases} ${t("plan.releases")}`,
    ...(notes.trim() ? ["", notes.trim()] : []),
  ].join("\n");

  return (
    <>
      <section id="plan" aria-labelledby="plan-heading" data-inspector="Plan · 5:7 rows" className="bg-paper-2 py-[clamp(5rem,10vw,9rem)]">
        <div className="margin-x grid gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-12">
          {/* Choices */}
          <div className="lg:col-span-5">
            <h2 id="plan-heading" data-reveal className="display text-head">
              {t("plan.heading")}
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="text-lead mt-6 max-w-[36ch]">
              {t("plan.intro")}
            </p>

            <fieldset data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-12">
              <legend className={legend}>{t("plan.type")}</legend>
              <div role="radiogroup" aria-label={t("plan.type")} className="mt-3 grid gap-1">
                {TYPES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={type === id}
                    onClick={() => setType(id)}
                    className="relative px-5 py-4 text-left transition-colors hover:bg-paper aria-checked:bg-paper"
                  >
                    {type === id && (
                      <motion.span layoutId="plan-type" transition={SPRING.micro} className="absolute inset-y-0 left-0 w-1.5 bg-violet" />
                    )}
                    <span className="block font-medium">{t(`cta.archetype.${id}`)}</span>
                    <span className="text-small block text-muted">{t(`cta.archetype.${id}.ref`)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-10">
              <legend className={legend}>{t("plan.pillars")}</legend>
              <div className="mt-3 grid grid-cols-2 gap-1">
                {pillars.map((p) => {
                  const on = selected.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(p.id)}
                      className="flex min-h-12 items-center gap-3 bg-paper px-4 py-3 text-left transition-colors hover:bg-paper/60"
                    >
                      <span
                        aria-hidden
                        className={cn("size-4 shrink-0 transition-colors", on ? "bg-violet" : "bg-paper-2")}
                      />
                      {l(p.title)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset data-reveal style={{ "--i": 4 } as React.CSSProperties} className="mt-10">
              <legend className={legend}>{t("plan.timeline")}</legend>
              <div role="radiogroup" aria-label={t("plan.timeline")} className="mt-3 grid grid-cols-3 gap-1">
                {TIMELINES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={timeline === id}
                    onClick={() => setTimeline(id)}
                    className="min-h-12 bg-paper px-3 py-3 text-center transition-colors aria-checked:bg-ink aria-checked:text-paper"
                  >
                    {t(`cta.timeline.${id}`)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div data-reveal style={{ "--i": 5 } as React.CSSProperties} className="mt-10 grid gap-5">
              <label className="block">
                <span className={legend}>{t("plan.name")}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
              </label>
              <label className="block">
                <span className={legend}>{t("plan.notes")}</span>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={1500} className={cn(field, "resize-y")} />
              </label>
            </div>
          </div>

          {/* The plan, worked out live */}
          <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
            <div className="lg:sticky lg:top-12">
              <p className="flex items-baseline gap-4">
                <motion.span
                  key={bp.nodes}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={SPRING.micro}
                  className="display tabular text-display"
                >
                  {bp.nodes}
                </motion.span>
                <span className="text-lead">{t("plan.nodes")}</span>
              </p>

              {/* Solid = first release, outline = later: the two arms of the mark. */}
              <div className="mt-6 flex flex-wrap gap-2" role="img" aria-label={`${firstRelease} / ${bp.nodes}`}>
                {Array.from({ length: bp.nodes }, (_, i) => (
                  <motion.span
                    key={i}
                    layout
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...SPRING.node, delay: i * 0.02 }}
                    className={cn("size-10 sm:size-12", i < firstRelease ? "bg-violet" : "border-[3px] border-violet")}
                  />
                ))}
              </div>
              <p className="text-small mt-4 flex flex-wrap gap-x-6 gap-y-1">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-3 bg-violet" /> {t("plan.first")}
                </span>
                {bp.phases > 1 && (
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-3 border-2 border-violet" /> {t("plan.later")}
                  </span>
                )}
              </p>
              <p className="mt-6 max-w-[48ch]">
                <span className="font-semibold">
                  {bp.phases} {t("plan.releases")}.
                </span>{" "}
                {bp.phases === 1 ? t("plan.oneRelease") : t("plan.manyReleases")}
              </p>

              <dl className="mt-10 grid content-start gap-8 sm:grid-cols-2">
                <div className="sm:row-span-3">
                  <dt className={legend}>{t("plan.deliverables")}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5">
                      {bp.deliverables.map((d) => (
                        <li key={d.en}>{l(d)}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className={legend}>{t("plan.stack")}</dt>
                  <dd className="mt-2">{bp.stack.join(", ")}</dd>
                </div>
                <div>
                  <dt className={legend}>{t("plan.lighthouse")}</dt>
                  <dd className="tabular mt-2">{bp.lighthouse}</dd>
                </div>
                {bp.reference.length > 0 && (
                  <div>
                    <dt className={legend}>{t("plan.reference")}</dt>
                    <dd className="mt-2 flex flex-wrap gap-x-4">
                      {bp.reference.map((id) => {
                        const p = projects.find((x) => x.id === id);
                        return (
                          p && (
                            <a key={id} href={`#${p.slug}`} className="underline underline-offset-4 hover:text-violet">
                              {l(p.title).split(" — ")[0]}
                            </a>
                          )
                        );
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* One word is the button: the whole band sends the plan on WhatsApp. */}
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        data-inspector="CTA band · one word"
        className="group relative flex min-h-[46svh] flex-col justify-between gap-10 overflow-hidden bg-lime text-lime-ink transition-colors duration-150 hover:bg-ink hover:text-lime focus-visible:bg-ink focus-visible:text-lime focus-visible:outline-none lg:min-h-[60svh]"
      >
        <span className="margin-x flex items-start justify-between gap-6 pt-6 lg:pt-8">
          <span className="max-w-[34ch]">{t("band.sentence")}</span>
          <svg aria-hidden viewBox="0 0 48 48" className="size-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 lg:size-12">
            <path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </span>
        <span className="display margin-x block pb-6 text-[clamp(8rem,36vw,40rem)] leading-[0.78]">{t("band.word")}</span>
      </a>
    </>
  );
}
