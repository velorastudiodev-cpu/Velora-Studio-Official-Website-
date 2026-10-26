import type { ReactNode } from "react";

/** The 1280px blueprint frame: two full-height hairline walls that every section sits between. */
export function BlueprintGrid({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[var(--grid-max)] border-x border-hairline">{children}</div>;
}
