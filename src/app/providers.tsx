"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { InspectorProvider } from "@/context/InspectorContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { PillarFilterProvider } from "@/context/PillarFilterContext";
import type { Locale } from "@/lib/schemas";

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // reducedMotion="user": transforms snap instantly under prefers-reduced-motion (PRD §2.3).
    <MotionConfig reducedMotion="user">
      <LanguageProvider initialLocale={locale}>
        <InspectorProvider>
          <PillarFilterProvider>{children}</PillarFilterProvider>
        </InspectorProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
