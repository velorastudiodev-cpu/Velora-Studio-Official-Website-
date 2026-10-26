"use client";

import { Command, Moon, ScanLine, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useInspector } from "@/context/InspectorContext";
import { useLanguage } from "@/context/LanguageContext";
import { emit, useVeloraEvent } from "@/lib/events";
import { cn, formatWIB } from "@/lib/utils";

export const THEME_COOKIE = "velora-theme";
export type Theme = "dark" | "light";

const control =
  "flex h-7 items-center gap-1.5 border border-hairline px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary transition-colors hover:border-velora-purple hover:text-ink";

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatWIB(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  // Placeholder has the same glyph count so the bar never shifts on hydration.
  return <span className="tabular text-ink">{now ?? "--:--:--"}</span>;
}

export function SystemTopbar({ initialTheme }: { initialTheme: Theme }) {
  const { t } = useLanguage();
  const inspector = useInspector();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.replace(theme, next);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  };
  useVeloraEvent("velora:theme", toggleTheme);

  return (
    <header className="sticky top-0 z-50 h-[var(--topbar-h)] border-b border-hairline bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[var(--grid-max)] items-center justify-between gap-4 border-x border-hairline px-4">
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Velora Studio Dev">
          <VeloraLogo height={18} className="text-ink" />
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-secondary xl:inline">
            {t("topbar.engine")}
          </span>
        </a>

        <div className="hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-secondary lg:flex">
          <span>
            {t("topbar.clock")}{" // "}<Clock />
          </span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot size-1.5 rounded-full bg-online" aria-hidden />
            {t("topbar.status")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={inspector.toggle}
            aria-pressed={inspector.enabled}
            aria-keyshortcuts="Alt+I"
            className={cn(control, inspector.enabled && "border-redline text-ink")}
          >
            <ScanLine size={14} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">
              {t("topbar.inspect")}: {inspector.enabled ? t("topbar.on") : t("topbar.off")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => emit("velora:command")}
            aria-label={t("topbar.command")}
            aria-keyshortcuts="Meta+K Control+K"
            className={control}
          >
            <Command size={14} strokeWidth={1.5} aria-hidden />
            <span className="hidden md:inline">CMD + K</span>
          </button>
          <button type="button" onClick={toggleTheme} aria-label={t("topbar.theme")} className={control}>
            {theme === "dark" ? <Moon size={14} strokeWidth={1.5} aria-hidden /> : <Sun size={14} strokeWidth={1.5} aria-hidden />}
            <span className="hidden sm:inline">{theme === "dark" ? t("topbar.theme.dark") : t("topbar.theme.light")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
