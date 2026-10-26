"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { useLanguage } from "@/context/LanguageContext";
import { whatsappLink } from "@/data/contact";
import type { DictionaryKey } from "@/data/dictionaries";
import { SPRING } from "@/lib/utils";

export const NAV_LINKS: [string, DictionaryKey][] = [
  ["#work", "nav.work"],
  ["#how", "nav.how"],
  ["#plan", "nav.plan"],
];

export function SiteNav() {
  const { t, locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const other = locale === "id" ? "en" : "id";
  const chat = whatsappLink(t("cta.msg.greeting"));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav aria-label="Velora" className="margin-x relative z-10 flex h-[var(--nav-h)] shrink-0 items-center justify-between gap-6">
      <a href="#top" aria-label={t("nav.home")} className="text-ink">
        <VeloraLogo height={26} />
      </a>

      <div className="text-small hidden items-center gap-7 lg:flex">
        {NAV_LINKS.map(([href, key]) => (
          <a key={href} href={href} className="underline-offset-4 hover:underline">
            {t(key)}
          </a>
        ))}
        <button type="button" onClick={() => setLocale(other)} aria-label={t("nav.lang")} className="uppercase underline-offset-4 hover:underline">
          {other}
        </button>
        <a
          href={chat}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4 hover:text-violet"
        >
          {t("nav.chat")}
        </a>
      </div>

      <div className="text-small flex items-center gap-4 lg:hidden">
        <button type="button" onClick={() => setLocale(other)} aria-label={t("nav.lang")} className="h-11 uppercase">
          {other}
        </button>
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="nav-sheet" className="h-11 font-medium">
          {t("nav.menu")}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            className="margin-x fixed inset-0 z-[90] flex flex-col bg-ink pb-8 text-paper"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={SPRING.drawer}
          >
            <div className="flex h-[var(--nav-h)] items-center justify-between">
              <VeloraLogo height={26} className="text-paper" />
              <button type="button" onClick={() => setOpen(false)} autoFocus className="text-small h-11 font-medium">
                {t("nav.close")}
              </button>
            </div>
            <ul className="mt-10 space-y-2">
              {NAV_LINKS.map(([href, key]) => (
                <li key={href}>
                  <a href={href} onClick={() => setOpen(false)} className="display block text-[16vw]">
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
            <a href={chat} target="_blank" rel="noreferrer" className="mt-auto flex h-14 items-center justify-center bg-lime font-medium text-lime-ink">
              {t("nav.chat")}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
