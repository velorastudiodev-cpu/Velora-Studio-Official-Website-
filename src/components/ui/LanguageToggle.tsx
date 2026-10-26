"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { LocaleEnum } from "@/lib/schemas";
import { SPRING } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div role="radiogroup" aria-label={t("topbar.language")} className="flex h-7 border border-hairline">
      {LocaleEnum.options.map((opt) => {
        const active = opt === locale;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLocale(opt)}
            className="relative w-9 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary aria-checked:text-ink"
          >
            {active && (
              <motion.span
                layoutId="locale-indicator"
                transition={SPRING.micro}
                className="absolute inset-0 border border-velora-purple bg-elevated"
              />
            )}
            <span className="relative">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
