"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DisciplinePillar } from "@/lib/schemas";

type PillarFilterValue = {
  /** null = all pillars. */
  active: DisciplinePillar | null;
  setActive: (pillar: DisciplinePillar | null) => void;
};

const PillarFilterContext = createContext<PillarFilterValue | null>(null);

// Shared by the pillar matrix, the project cards and the command menu.
export function PillarFilterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<DisciplinePillar | null>(null);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <PillarFilterContext.Provider value={value}>{children}</PillarFilterContext.Provider>;
}

export function usePillarFilter(): PillarFilterValue {
  const ctx = useContext(PillarFilterContext);
  if (!ctx) throw new Error("usePillarFilter must be used inside <PillarFilterProvider>");
  return ctx;
}
