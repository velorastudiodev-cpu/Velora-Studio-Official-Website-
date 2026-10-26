"use client";

import { ArrowUp, Check, Mail, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import type { z } from "zod";
import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { GridCell } from "@/components/grid/GridCell";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT, mailtoLink, whatsappLink } from "@/data/contact";
import { dictionary, type DictionaryKey } from "@/data/dictionaries";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";
import { CTAInquiryPayloadSchema, type DisciplinePillar } from "@/lib/schemas";
import { buildBlueprint, cn, SPRING, type ProjectType, type Timeline } from "@/lib/utils";

const TYPES = CTAInquiryPayloadSchema.shape.selectedProjectType.options;
const TIMELINES = CTAInquiryPayloadSchema.shape.targetTimeline.options;

// WhatsApp and email only need enough to start a conversation; the API form takes the full brief.
const QuickBriefSchema = CTAInquiryPayloadSchema.pick({
  clientName: true,
  selectedProjectType: true,
  selectedPillars: true,
  targetTimeline: true,
  projectScopeNotes: true,
});

type Field = "clientName" | "clientEmail" | "companyOrBrand" | "projectScopeNotes" | "selectedPillars";
type Status = "idle" | "sending" | "sent" | "down";

const label = "font-mono text-[11px] uppercase tracking-[0.08em] text-secondary";
const input =
  "mt-1.5 w-full border border-hairline bg-primary px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-velora-purple aria-[invalid=true]:border-velora-pink";

function errorsFrom(issues: z.core.$ZodIssue[]) {
  const out: Partial<Record<Field, DictionaryKey>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    const key = `cta.error.${String(field)}`;
    if (typeof field === "string" && key in dictionary && !(field in out)) out[field as Field] = key as DictionaryKey;
  }
  return out;
}

export function StudioCTAConsole({ apiEnabled }: { apiEnabled: boolean }) {
  const { t, l } = useLanguage();
  const [type, setType] = useState<ProjectType>("FULL_ECOSYSTEM_WEB_AND_CMS");
  const [selected, setSelected] = useState<DisciplinePillar[]>(["UI_UX_DESIGN", "WEB_DEVELOPMENT", "SOFTWARE_DEVELOPMENT"]);
  const [timeline, setTimeline] = useState<Timeline>("STANDARD_1_2_MONTHS");
  const [form, setForm] = useState({ clientName: "", clientEmail: "", companyOrBrand: "", projectScopeNotes: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, DictionaryKey>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const bp = buildBlueprint(type, selected, timeline);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const togglePillar = (id: DisciplinePillar) =>
    setSelected((s) => (s.includes(id) ? s.filter((p) => p !== id) : pillars.map((p) => p.id).filter((p) => p === id || s.includes(p))));

  const brief = {
    ...form,
    selectedProjectType: type,
    selectedPillars: selected,
    targetTimeline: timeline,
  };

  const message = () =>
    [
      t("cta.msg.greeting"),
      "",
      `${t("cta.msg.name")}: ${form.clientName}${form.companyOrBrand ? ` (${form.companyOrBrand})` : ""}`,
      ...(form.clientEmail ? [`Email: ${form.clientEmail}`] : []),
      `${t("cta.archetype")}: ${t(`cta.archetype.${type}`)}`,
      `${t("cta.pillars")}: ${pillars.filter((p) => selected.includes(p.id)).map((p) => l(p.title)).join(", ")}`,
      `${t("cta.timeline")}: ${t(`cta.timeline.${timeline}`)}`,
      `${t("cta.msg.blueprint")}: ${bp.nodes} ${t("cta.msg.nodes")} · ${bp.stack.join(", ")}`,
      "",
      form.projectScopeNotes,
    ].join("\n");

  const quickSend = (channel: "whatsapp" | "email") => {
    const res = QuickBriefSchema.safeParse(brief);
    if (!res.success) return setErrors(errorsFrom(res.error.issues));
    setErrors({});
    const subject = `${t("cta.msg.subject")} — ${form.companyOrBrand || form.clientName}`;
    window.open(channel === "whatsapp" ? whatsappLink(message()) : mailtoLink(subject, message()), "_blank", "noopener");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = CTAInquiryPayloadSchema.safeParse(brief);
    if (!res.success) return setErrors(errorsFrom(res.error.issues));
    setErrors({});
    setStatus("sending");
    try {
      const r = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...res.data, website: form.website }),
      });
      setStatus(r.ok ? "sent" : "down");
    } catch {
      setStatus("down");
    }
  };

  const fieldProps = (k: Field) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });
  const fieldError = (k: Field) =>
    errors[k] && (
      <p id={`${k}-error`} className="mt-1 text-xs text-velora-pink">
        {t(errors[k])}
      </p>
    );

  return (
    <section id="cta" aria-labelledby="cta-heading">
      <GridCell crosshair inspector="CTA · header · p-10" className="border-t border-hairline px-5 py-16 sm:px-10">
        <p className="text-label">{t("cta.badge")}</p>
        <h2 id="cta-heading" className="text-h1 mt-6 max-w-[22ch]">
          {t("cta.headline")}
        </h2>
        <p className="text-body mt-6 text-secondary">{t("cta.sub")}</p>
      </GridCell>

      <div className="grid border-t border-hairline lg:grid-cols-12">
        {/* Configurator + live blueprint */}
        <GridCell inspector="CTA · configurator · col-span-7" className="lg:col-span-7 lg:border-r lg:border-hairline">
          <fieldset className="px-5 py-8 sm:px-10">
            <legend className={`${label} float-left mb-3 w-full`}>{t("cta.archetype")}</legend>
            <div role="radiogroup" aria-label={t("cta.archetype")} className="grid clear-both gap-2 sm:grid-cols-2">
              {TYPES.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={type === id}
                  onClick={() => setType(id)}
                  className="relative border border-hairline p-4 text-left transition-colors hover:border-strong aria-checked:border-velora-purple aria-checked:bg-elevated"
                >
                  {type === id && (
                    <motion.span layoutId="archetype" transition={SPRING.micro} className="absolute inset-x-0 top-0 h-0.5 bg-velora-pink" />
                  )}
                  <span className="block text-sm font-medium text-ink">{t(`cta.archetype.${id}`)}</span>
                  <span className="mt-1 block text-xs text-secondary">{t(`cta.archetype.${id}.ref`)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-t border-hairline px-5 py-8 sm:px-10">
            <legend className={`${label} float-left mb-3 w-full`}>{t("cta.pillars")}</legend>
            <div className="clear-both flex flex-wrap gap-2">
              {pillars.map((p) => {
                const on = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => togglePillar(p.id)}
                    className="flex h-9 items-center gap-2 border px-3 text-sm text-secondary transition-colors aria-pressed:text-ink"
                    style={{ borderColor: on ? `var(${p.accentVar})` : "var(--border-hairline)" }}
                  >
                    <span aria-hidden className="flex size-3.5 items-center justify-center border" style={{ borderColor: `var(${p.accentVar})`, background: on ? `var(${p.accentVar})` : "transparent" }}>
                      {on && <Check size={10} strokeWidth={2.5} className="text-[#09090B]" />}
                    </span>
                    {l(p.title)}
                  </button>
                );
              })}
            </div>
            {fieldError("selectedPillars")}
          </fieldset>

          <fieldset className="border-t border-hairline px-5 py-8 sm:px-10">
            <legend className={`${label} float-left mb-3 w-full`}>{t("cta.timeline")}</legend>
            <div role="radiogroup" aria-label={t("cta.timeline")} className="clear-both grid border border-hairline sm:grid-cols-3">
              {TIMELINES.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={timeline === id}
                  onClick={() => setTimeline(id)}
                  className={cn(
                    "relative px-3 py-3 text-left text-sm text-secondary aria-checked:text-ink",
                    i > 0 && "border-t border-hairline sm:border-l sm:border-t-0",
                  )}
                >
                  {timeline === id && (
                    <motion.span layoutId="timeline" transition={SPRING.micro} className="absolute inset-0 border border-velora-purple bg-elevated" />
                  )}
                  <span className="relative">{t(`cta.timeline.${id}`)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="border-t border-hairline bg-surface px-5 py-8 sm:px-10" aria-live="polite">
            <p className="text-label">{t("cta.preview")}</p>
            <dl className="mt-5 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3">
              {[
                [t("cta.preview.nodes"), String(bp.nodes)],
                [t("cta.preview.perf"), bp.lighthouse],
                [t("cta.preview.phases"), bp.phases === 1 ? t("cta.preview.single") : `${bp.phases} ${t("cta.preview.multi")}`],
              ].map(([k, v], i) => (
                <div key={k} className={cn("flex flex-col bg-surface p-4", i === 2 && "col-span-2 sm:col-span-1")}>
                  <dt className="order-2 mt-1 text-xs text-secondary">{k}</dt>
                  <motion.dd
                    key={v}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING.micro}
                    className="tabular order-1 text-lg font-semibold tracking-tight text-ink"
                  >
                    {v}
                  </motion.dd>
                </div>
              ))}
            </dl>

            <p className={`${label} mt-6`}>{t("cta.preview.stack")}</p>
            <ul className="mt-2 flex flex-wrap gap-1">
              {bp.stack.map((s) => (
                <li key={s} className="border border-hairline bg-primary px-2 py-0.5 font-mono text-[11px] text-secondary">
                  {s}
                </li>
              ))}
            </ul>

            <p className={`${label} mt-6`}>{t("cta.preview.deliverables")}</p>
            <ul className="mt-2 grid gap-1.5 text-sm text-ink sm:grid-cols-2">
              {bp.deliverables.map((d) => (
                <li key={d.en} className="flex gap-2">
                  <Check size={14} strokeWidth={1.5} aria-hidden className="mt-1 shrink-0 text-online" />
                  {l(d)}
                </li>
              ))}
            </ul>

            {bp.reference.length > 0 && (
              <p className="mt-6 text-sm text-secondary">
                {t("cta.preview.reference")}:{" "}
                {bp.reference.map((id, i) => {
                  const p = projects.find((x) => x.id === id);
                  return (
                    <span key={id}>
                      {i > 0 && " + "}
                      <a href={`#${p?.slug}`} className="font-mono text-xs text-accent-text underline-offset-2 hover:underline">
                        {id}
                      </a>
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        </GridCell>

        {/* Direct dispatch */}
        <GridCell inspector="CTA · dispatch · col-span-5" className="border-t border-hairline px-5 py-8 sm:px-10 lg:sticky lg:top-[var(--topbar-h)] lg:col-span-5 lg:self-start lg:border-t-0">
          <p className="text-label">{t("cta.direct")}</p>
          <p className="text-body mt-3 text-secondary">{t("cta.direct.intro")}</p>

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {(
              [
                ["clientName", "cta.form.name", "text", "name"],
                ["clientEmail", "cta.form.email", "email", "email"],
                ["companyOrBrand", "cta.form.company", "text", "organization"],
              ] as const
            ).map(([k, key, typeAttr, auto]) => (
              <div key={k}>
                <label htmlFor={k} className={label}>
                  {t(key)}
                </label>
                <input id={k} type={typeAttr} autoComplete={auto} value={form[k]} onChange={set(k)} className={input} {...fieldProps(k)} />
                {fieldError(k)}
              </div>
            ))}
            <div>
              <div className="flex justify-between">
                <label htmlFor="projectScopeNotes" className={label}>
                  {t("cta.form.notes")}
                </label>
                <span aria-hidden className="tabular font-mono text-[11px] text-muted">
                  {form.projectScopeNotes.length}/1500
                </span>
              </div>
              <textarea
                id="projectScopeNotes"
                rows={5}
                maxLength={1500}
                value={form.projectScopeNotes}
                onChange={set("projectScopeNotes")}
                className={cn(input, "resize-y")}
                {...fieldProps("projectScopeNotes")}
                aria-describedby={errors.projectScopeNotes ? "projectScopeNotes-error" : "notes-hint"}
              />
              <p id="notes-hint" className="mt-1 text-xs text-muted">
                {t("cta.form.notesHint")}
              </p>
              {fieldError("projectScopeNotes")}
            </div>
            {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={form.website}
              onChange={set("website")}
              className="absolute -left-[9999px] h-px w-px opacity-0"
              placeholder={t("cta.form.website")}
            />

            <div className="grid gap-2 pt-2">
              <button
                type="button"
                onClick={() => quickSend("whatsapp")}
                className="flex h-12 items-center justify-center gap-2 bg-action px-5 text-sm font-medium text-[#FAFAFC] shadow-[inset_0_-2px_0_var(--velora-pink)] transition-colors hover:bg-velora-pink"
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                {t("cta.dispatch.whatsapp")}
              </button>
              <button
                type="button"
                onClick={() => quickSend("email")}
                className="flex h-12 items-center justify-center gap-2 border border-strong px-5 text-sm font-medium text-ink transition-colors hover:border-velora-pink"
              >
                <Mail size={16} strokeWidth={1.5} aria-hidden />
                {t("cta.dispatch.email")}
              </button>
              {apiEnabled && (
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className="flex h-12 items-center justify-center gap-2 border border-hairline px-5 text-sm font-medium text-ink transition-colors hover:border-velora-purple disabled:opacity-60"
                >
                  <Send size={16} strokeWidth={1.5} aria-hidden />
                  {status === "sending" ? t("cta.form.sending") : t("cta.form.submit")}
                </button>
              )}
            </div>
            <p aria-live="polite" className="min-h-5 text-sm">
              {Object.keys(errors).length > 0 && <span className="text-velora-pink">{t("cta.form.error")}</span>}
              {status === "sent" && <span className="text-online">{t("cta.form.success")}</span>}
              {status === "down" && <span className="text-velora-pink">{t("cta.form.apiDown")}</span>}
            </p>
          </form>

          <dl className="mt-6 grid gap-3 border-t border-hairline pt-6 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">WHATSAPP</dt>
              <dd>
                <a href={whatsappLink(t("cta.msg.greeting"))} target="_blank" rel="noreferrer" className="tabular text-ink hover:text-velora-pink">
                  {CONTACT.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">EMAIL</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`} className="text-ink hover:text-velora-pink">
                  {CONTACT.email}
                </a>
              </dd>
            </div>
          </dl>
        </GridCell>
      </div>

      <footer className="border-t border-hairline px-5 pb-10 pt-14 sm:px-10">
        <VeloraLogo height={88} className="h-auto w-full max-w-[640px] text-ink" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm text-ink">{t("footer.tagline")}</p>
            <p className="mt-1 text-xs text-secondary">{t("footer.built")}</p>
            <p className="tabular mt-4 font-mono text-[11px] text-muted">
              © {new Date().getFullYear()} Velora Studio Dev
            </p>
          </div>
          <a href="#top" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary hover:text-ink">
            <ArrowUp size={14} strokeWidth={1.5} aria-hidden />
            {t("footer.top")}
          </a>
        </div>
      </footer>
    </section>
  );
}
