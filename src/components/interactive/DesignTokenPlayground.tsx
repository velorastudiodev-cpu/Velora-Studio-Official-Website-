"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GridCell } from "@/components/grid/GridCell";
import { useLanguage } from "@/context/LanguageContext";
import type { DictionaryKey } from "@/data/dictionaries";
import { contrastRatio, simulateSpring, SPRING } from "@/lib/utils";

const MASS = SPRING.micro.mass;
const ACCENTS: { cssVar: string; key: DictionaryKey }[] = [
  { cssVar: "--velora-purple", key: "lab.accent.violet" },
  { cssVar: "--velora-lavender", key: "lab.accent.lavender" },
  { cssVar: "--velora-pink", key: "lab.accent.pink" },
];

const PLOT_W = 400;
const PLOT_H = 140;

function grade(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large / UI";
  return "FAIL";
}

/** Reads the current theme's value of a CSS custom property, re-reading when the theme class flips. */
function useCssVar(name: string) {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setValue(getComputedStyle(root).getPropertyValue(name).trim());
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [name]);
  return value;
}

const label = "font-mono text-[11px] uppercase tracking-[0.08em] text-secondary";

export function DesignTokenPlayground() {
  const { t } = useLanguage();
  const [stiffness, setStiffness] = useState<number>(SPRING.micro.stiffness);
  const [damping, setDamping] = useState<number>(SPRING.micro.damping);
  const [accent, setAccent] = useState(ACCENTS[0]!.cssVar);
  const [flipped, setFlipped] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const accentHex = useCssVar(accent);
  const bgHex = useCssVar("--bg-primary");
  const ratio = accentHex && bgHex ? contrastRatio(accentHex, bgHex) : null;

  const { points, settledMs } = useMemo(() => simulateSpring(stiffness, damping, MASS), [stiffness, damping]);
  const zeta = damping / (2 * Math.sqrt(stiffness * MASS));
  const min = Math.min(0, ...points);
  const path = points
    .map((x, i) => {
      const px = (i / (points.length - 1)) * PLOT_W;
      const py = 8 + ((1 - x) / (1 - min)) * (PLOT_H - 16);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  const restY = 8 + (1 / (1 - min)) * (PLOT_H - 16);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setTrackW(e?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <GridCell
      as="section"
      id="lab"
      crosshair
      inspector="Token Lab · 5:7 grid"
      aria-labelledby="lab-heading"
      className="grid border-t border-hairline lg:grid-cols-12"
    >
      <GridCell inspector="Lab controls · p-10" className="px-5 py-12 sm:px-10 lg:col-span-5 lg:border-r lg:border-hairline">
        <p className="text-label">{t("lab.label")}</p>
        <h2 id="lab-heading" className="text-h2 mt-4">
          {t("lab.heading")}
        </h2>
        <p className="text-body mt-4 text-secondary">{t("lab.intro")}</p>

        <div className="mt-8 space-y-6">
          {(
            [
              ["lab.stiffness", stiffness, setStiffness, 150, 600, 10],
              ["lab.damping", damping, setDamping, 12, 45, 1],
            ] as const
          ).map(([key, value, set, lo, hi, step]) => (
            <label key={key} className="block">
              <span className="flex justify-between">
                <span className={label}>{t(key)}</span>
                <span className="tabular font-mono text-sm text-ink">{value}</span>
              </span>
              <input
                type="range"
                min={lo}
                max={hi}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--velora-purple)]"
              />
            </label>
          ))}

          <fieldset>
            <legend className={label}>{t("lab.accent")}</legend>
            <div role="radiogroup" className="mt-2 flex gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.cssVar}
                  type="button"
                  role="radio"
                  aria-checked={accent === a.cssVar}
                  onClick={() => setAccent(a.cssVar)}
                  className="flex h-9 items-center gap-2 border border-hairline px-3 text-sm text-secondary aria-checked:border-strong aria-checked:text-ink"
                >
                  <span aria-hidden className="size-3" style={{ background: `var(${a.cssVar})` }} />
                  {t(a.key)}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="h-11 w-full bg-action px-5 text-sm font-medium text-[#FAFAFC] shadow-[inset_0_-2px_0_var(--velora-pink)] transition-colors hover:bg-velora-pink"
          >
            {t("lab.trigger")}
          </button>
        </div>
      </GridCell>

      <GridCell inspector="Lab output · col-span-7" className="flex flex-col lg:col-span-7">
        <div className="grid grid-cols-3 border-t border-hairline lg:border-t-0">
          {[
            ["ζ", zeta.toFixed(2)],
            [t("lab.settle"), `${settledMs}ms`],
            [t("lab.contrast"), ratio ? `${ratio.toFixed(2)}:1` : "—"],
          ].map(([k, v], i) => (
            <div key={k} className={`px-5 py-5 sm:px-6 ${i < 2 ? "border-r border-hairline" : ""}`}>
              <p className={label}>{k}</p>
              <p className="tabular mt-2 text-xl font-semibold tracking-tight text-ink">{v}</p>
              {i === 2 && ratio && <p className="mt-1 font-mono text-[11px] text-secondary">{grade(ratio)}</p>}
              {i === 0 && (
                <p className="mt-1 font-mono text-[11px] text-secondary">{zeta < 1 ? t("lab.underdamped") : t("lab.overdamped")}</p>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-hairline px-5 py-6 sm:px-6">
          <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="aspect-[400/140] w-full" role="img" aria-label="x(t)">
            <line x1="0" x2={PLOT_W} y1={restY} y2={restY} stroke="var(--border-hairline)" strokeDasharray="3 3" />
            <polyline points={path} fill="none" stroke={`var(${accent})`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <p className="tabular mt-2 flex justify-between font-mono text-[11px] text-muted">
            <span>0ms</span>
            <span>
              k {stiffness} · c {damping} · m {MASS}
            </span>
            <span>1200ms</span>
          </p>
        </div>

        <div className="mt-auto border-t border-hairline px-5 py-6 sm:px-6">
          <div ref={trackRef} className="relative h-12 border border-hairline">
            <motion.div
              aria-hidden
              className="absolute left-0 top-0 h-full w-12"
              style={{ background: `var(${accent})` }}
              animate={{ x: flipped ? Math.max(0, trackW - 48) : 0 }}
              transition={{ type: "spring", stiffness, damping, mass: MASS }}
            />
          </div>
        </div>
      </GridCell>
    </GridCell>
  );
}
