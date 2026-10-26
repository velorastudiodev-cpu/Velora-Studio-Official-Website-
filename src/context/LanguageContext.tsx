"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { translate, type DictionaryKey } from "@/data/dictionaries";
import type { Locale, LocalizedText } from "@/lib/schemas";

export const LOCALE_COOKIE = "velora-locale";

type LanguageValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** UI string from the dictionary. */
  t: (key: DictionaryKey) => string;
  /** Pick the active language from a seed-data LocalizedText. */
  l: (text: LocalizedText) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

// The cookie (not localStorage) lets the server render the chosen language on first paint: no flash, no layout shift.
export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
  }, []);

  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translate(locale, key),
      l: (text) => text[locale],
    }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
