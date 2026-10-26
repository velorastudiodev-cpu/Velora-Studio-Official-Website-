import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GridCellProps<T extends ElementType> = {
  as?: T;
  /** Label shown by the redline inspector, e.g. "Hero · bg-primary · p-10". */
  inspector: string;
  /** Draw "+" marks on the top corners (section junctions). */
  crosshair?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function GridCell<T extends ElementType = "div">({
  as,
  inspector,
  crosshair = false,
  className,
  children,
  ...rest
}: GridCellProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag data-inspector={inspector} className={cn("relative", className)} {...rest}>
      {crosshair && (
        <>
          <span aria-hidden className="crosshair-mark left-0 top-0" />
          <span aria-hidden className="crosshair-mark left-full top-0" />
        </>
      )}
      {children}
    </Tag>
  );
}
