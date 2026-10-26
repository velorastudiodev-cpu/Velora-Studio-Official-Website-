"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInspector } from "@/context/InspectorContext";
import { useLanguage } from "@/context/LanguageContext";
import { SPRING } from "@/lib/utils";

type Measure = {
  x: number;
  y: number;
  w: number;
  h: number;
  pad: { top: number; right: number; bottom: number; left: number };
};

function measure(el: HTMLElement): Measure {
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  return {
    x: r.left,
    y: r.top,
    w: r.width,
    h: r.height,
    pad: {
      top: parseFloat(s.paddingTop),
      right: parseFloat(s.paddingRight),
      bottom: parseFloat(s.paddingBottom),
      left: parseFloat(s.paddingLeft),
    },
  };
}

const band = "absolute bg-[color-mix(in_srgb,var(--inspector-redline)_16%,transparent)]";
const tag =
  "absolute whitespace-nowrap bg-redline px-1.5 text-[12px] leading-[18px] text-white tabular [font-family:var(--font-code)]";

export function InspectorOverlay() {
  const { enabled } = useInspector();
  const { t } = useLanguage();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [m, setM] = useState<Measure | null>(null);

  // Stamp W×H onto every inspectable cell; the CSS ::after label reads it.
  useEffect(() => {
    if (!enabled) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        const { width, height } = el.getBoundingClientRect();
        el.dataset.size = `${Math.round(width)}×${Math.round(height)}`;
      }
    });
    document.querySelectorAll<HTMLElement>("[data-inspector]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [enabled]);

  // Track the innermost cell under the pointer (pointerdown covers touch).
  useEffect(() => {
    if (!enabled) return;
    const pick = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-inspector]") : null;
      setTarget(el);
    };
    window.addEventListener("pointermove", pick, { passive: true });
    window.addEventListener("pointerdown", pick, { passive: true });
    return () => {
      window.removeEventListener("pointermove", pick);
      window.removeEventListener("pointerdown", pick);
      setTarget(null);
    };
  }, [enabled]);

  // Re-measure the target on scroll/resize, once per frame.
  useEffect(() => {
    if (!target) {
      setM(null);
      return;
    }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setM(measure(target)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          key="inspector"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={SPRING.drawer}
        >
          {m && (
            <div className="absolute" style={{ left: m.x, top: m.y, width: m.w, height: m.h }}>
              <div className="absolute inset-0 outline outline-1 outline-redline" />
              <div className={band} style={{ left: 0, right: 0, top: 0, height: m.pad.top }} />
              <div className={band} style={{ left: 0, right: 0, bottom: 0, height: m.pad.bottom }} />
              <div
                className={band}
                style={{ left: 0, top: m.pad.top, bottom: m.pad.bottom, width: m.pad.left }}
              />
              <div
                className={band}
                style={{ right: 0, top: m.pad.top, bottom: m.pad.bottom, width: m.pad.right }}
              />
              <span className={tag} style={{ left: 0, bottom: "100%" }}>
                x {Math.round(m.x)} · y {Math.round(m.y)} · {Math.round(m.w)}×{Math.round(m.h)}
              </span>
              <span className={tag} style={{ right: 0, top: "100%" }}>
                {t("inspector.padding")} {m.pad.top} {m.pad.right} {m.pad.bottom} {m.pad.left}
              </span>
            </div>
          )}
          <p className="absolute bottom-4 left-4 right-4 w-fit max-w-[calc(100%-2rem)] bg-redline px-3 py-2 text-[14px] text-white">
            {t("inspector.hud")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
