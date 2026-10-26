"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { InspectorProvider } from "@/context/InspectorContext";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Locale } from "@/lib/schemas";

/** Section entrances: reveal [data-reveal] once, when its top reaches 88% of the viewport. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  useReveal();
  return (
    // reducedMotion="user": transforms snap instantly under prefers-reduced-motion.
    <MotionConfig reducedMotion="user">
      <LanguageProvider initialLocale={locale}>
        <InspectorProvider>{children}</InspectorProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
