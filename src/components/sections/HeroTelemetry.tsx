"use client";

import { ArrowDownRight, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GridCell } from "@/components/grid/GridCell";
import { Kbd } from "@/components/ui/Kbd";
import { Sparkline } from "@/components/ui/Sparkline";
import { useInspector } from "@/context/InspectorContext";
import { useLanguage } from "@/context/LanguageContext";
import { dictionary } from "@/data/dictionaries";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";
import type { DictionaryKey } from "@/data/dictionaries";

const SAMPLES = 24;

/** Roundtrip to /api/telemetry every 2s while the tab is visible. */
function useEdgeLatency() {
  const [samples, setSamples] = useState<number[]>([]);
  useEffect(() => {
    let alive = true;
    const ping = async () => {
      if (document.hidden) return;
      const t0 = performance.now();
      try {
        await fetch("/api/telemetry", { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (alive) setSamples((s) => [...s.slice(-(SAMPLES - 1)), ms]);
      } catch {
        // Offline: keep the last reading rather than inventing one.
      }
    };
    void ping();
    const id = setInterval(ping, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return samples;
}

/** Frames per second, counted over 500ms windows, only while `el` is on screen. */
function useFps(el: React.RefObject<HTMLElement | null>) {
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let raf = 0;
    let frames = 0;
    let start = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - start >= 500) {
        setFps(Math.round((frames * 1000) / (now - start)));
        frames = 0;
        start = now;
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry?.isIntersecting) {
        frames = 0;
        start = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [el]);
  return fps;
}

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };

/** Cumulative Layout Shift of this page view, as the browser reports it. */
function useCls() {
  const [cls, setCls] = useState(0);
  useEffect(() => {
    if (!PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) return;
    const po = new PerformanceObserver((list) => {
      let add = 0;
      for (const e of list.getEntries() as LayoutShift[]) if (!e.hadRecentInput) add += e.value;
      if (add) setCls((c) => c + add);
    });
    po.observe({ type: "layout-shift", buffered: true });
    return () => po.disconnect();
  }, []);
  return cls;
}

type Reach = { state: "pending" } | { state: "up"; ms: number } | { state: "down" };

/** Opaque no-cors ping from the visitor's browser: proves the live site answers, nothing more. */
function useReachability(urls: readonly (string | undefined)[]) {
  const [reach, setReach] = useState<Reach[]>(() => urls.map(() => ({ state: "pending" })));
  useEffect(() => {
    let alive = true;
    urls.forEach(async (url, i) => {
      if (!url) return;
      const t0 = performance.now();
      let next: Reach;
      try {
        await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
        next = { state: "up", ms: Math.round(performance.now() - t0) };
      } catch {
        next = { state: "down" };
      }
      if (alive) setReach((r) => r.map((v, j) => (j === i ? next : v)));
    });
    return () => {
      alive = false;
    };
    // urls come from static seed data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return reach;
}

const SYNC_ROWS: { id: string; key: DictionaryKey }[] = [
  { id: "VEL-001", key: "hero.telemetry.storefront" },
  { id: "VEL-002", key: "hero.telemetry.cms" },
  { id: "VEL-003", key: "hero.telemetry.geo" },
];

const cellLabel = "font-mono text-[11px] uppercase tracking-[0.08em] text-secondary";
const bigValue = "tabular text-2xl font-semibold tracking-tight text-ink";

export function HeroTelemetry() {
  const { t } = useLanguage();
  const inspector = useInspector();
  const panelRef = useRef<HTMLDivElement>(null);
  const latency = useEdgeLatency();
  const fps = useFps(panelRef);
  const cls = useCls();
  const reach = useReachability(projects.map((p) => p.links.liveDemo));
  const lastLatency = latency.at(-1);
  const headline = t("hero.headline").split(". ");

  return (
    <GridCell as="section" id="top" inspector="Hero · 8:4 grid" className="grid lg:grid-cols-12">
      <GridCell
        inspector="Value proposition · col-span-8 · p-10"
        className="flex flex-col justify-between gap-10 px-5 py-12 sm:px-10 lg:col-span-8 lg:min-h-[560px] lg:border-r lg:border-hairline"
      >
        <div>
          <p className="text-label">{t("hero.badge")}</p>
          <h1 className="text-h1 mt-6">
            {headline.map((line, i) => (
              <span key={line} className={i === headline.length - 1 ? "block" : "block text-secondary"}>
                {line.endsWith(".") ? line : `${line}.`}
              </span>
            ))}
          </h1>
          <p className="text-body mt-8 text-secondary">{t("hero.sub")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="flex h-11 items-center gap-2 bg-action px-5 text-sm font-medium text-[#FAFAFC] shadow-[inset_0_-2px_0_var(--velora-pink)] transition-colors hover:bg-velora-pink"
          >
            {t("hero.cta.primary")}
            <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden />
          </a>
          <a
            href="#cta"
            className="flex h-11 items-center border border-strong px-5 text-sm font-medium text-ink transition-colors hover:border-velora-pink"
          >
            {t("hero.cta.secondary")}
          </a>
          <button
            type="button"
            onClick={inspector.toggle}
            aria-pressed={inspector.enabled}
            className="flex h-11 items-center gap-2 px-3 text-sm text-secondary transition-colors hover:text-ink"
          >
            <ScanLine size={16} strokeWidth={1.5} aria-hidden />
            {t("hero.cta.inspect")}
            <Kbd>Alt</Kbd>
            <Kbd>I</Kbd>
          </button>
        </div>
      </GridCell>

      <div ref={panelRef} className="grid border-t border-hairline lg:col-span-4 lg:border-t-0" aria-live="off">
        <GridCell inspector="Telemetry · latency" className="border-b border-hairline px-5 py-5 sm:px-6">
          <p className="text-label">{t("hero.telemetry.title")}</p>
          <p className={`${cellLabel} mt-4`}>{t("hero.telemetry.latency")}</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className={bigValue}>
              {/* Fixed-width value box so the "ms" suffix never moves (zero CLS). */}
              <span className="inline-block w-[3ch]">{lastLatency === undefined ? "—" : lastLatency}</span>
              <span className="ml-1 text-sm font-normal text-secondary">ms</span>
            </p>
            <Sparkline values={latency} />
          </div>
        </GridCell>

        <GridCell inspector="Telemetry · render" className="grid grid-cols-2 border-b border-hairline">
          <div className="border-r border-hairline px-5 py-5 sm:px-6">
            <p className={cellLabel}>FPS</p>
            <p className={`${bigValue} mt-2`}>{fps ?? "—"}</p>
          </div>
          <div className="px-5 py-5 sm:px-6">
            <p className={cellLabel}>CLS</p>
            <p className={`${bigValue} mt-2`}>{cls.toFixed(3)}</p>
          </div>
          <p className={`${cellLabel} col-span-2 border-t border-hairline px-5 py-3 sm:px-6`}>
            {t("hero.telemetry.frame")}
          </p>
        </GridCell>

        <GridCell inspector="Telemetry · zod" className="border-b border-hairline px-5 py-5 sm:px-6">
          <p className={cellLabel}>{t("hero.telemetry.typesafe")}</p>
          <p className="tabular mt-2 text-sm text-ink">
            {projects.length}/3 VEL · {pillars.length}/4 pillars · {Object.keys(dictionary).length}×2 strings
          </p>
          <p className="mt-1 text-xs text-muted">{t("hero.telemetry.validated")}</p>
        </GridCell>

        <GridCell inspector="Telemetry · ecosystem" className="px-5 py-5 sm:px-6">
          <p className={cellLabel}>{t("hero.telemetry.sync")}</p>
          <ul className="mt-3 space-y-2">
            {SYNC_ROWS.map((row, i) => {
              const r = reach[i] ?? { state: "pending" };
              return (
                <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${
                        r.state === "up" ? "pulse-dot bg-online" : r.state === "down" ? "bg-velora-pink" : "bg-muted"
                      }`}
                    />
                    <span className="tabular font-mono text-xs text-secondary">{row.id}</span>
                    <span className="text-ink">{t(row.key)}</span>
                  </span>
                  <span className="tabular w-[15ch] shrink-0 font-mono text-[11px] text-secondary">
                    {r.state === "up"
                      ? `${r.ms}ms`
                      : r.state === "down"
                        ? t("hero.telemetry.unreachable")
                        : t("hero.telemetry.measuring")}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-[11px] text-muted">VEL-001 ⇄ VEL-002 · {t("hero.telemetry.sharedBus")}</p>
        </GridCell>
      </div>
    </GridCell>
  );
}
