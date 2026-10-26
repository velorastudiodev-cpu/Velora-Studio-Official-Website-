"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type InspectorValue = {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  toggle: () => void;
};

const InspectorContext = createContext<InspectorValue | null>(null);

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // e.code, not e.key: on macOS Alt+I types "ˆ".
      if (e.altKey && e.code === "KeyI") {
        e.preventDefault();
        setEnabled((on) => !on);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("inspector-on", enabled);
  }, [enabled]);

  const value = useMemo(() => ({ enabled, setEnabled, toggle: () => setEnabled((on) => !on) }), [enabled]);
  return <InspectorContext.Provider value={value}>{children}</InspectorContext.Provider>;
}

export function useInspector(): InspectorValue {
  const ctx = useContext(InspectorContext);
  if (!ctx) throw new Error("useInspector must be used inside <InspectorProvider>");
  return ctx;
}
