"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ArchitectureNode } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const W = 440;
const ROW = 72;
const NODE_H = 40;
const GAP = 16;

type Placed = ArchitectureNode & { x: number; y: number; w: number };

/** Layer = longest path from a source node, so every edge points downward. */
export function layout(nodes: readonly ArchitectureNode[]): { placed: Placed[]; height: number } {
  const layer = new Map(nodes.map((n) => [n.id, 0]));
  // Relax edges n times: enough for any DAG of n nodes, and terminates on accidental cycles.
  for (let i = 0; i < nodes.length; i++) {
    for (const n of nodes) {
      for (const c of n.connections) layer.set(c, Math.max(layer.get(c) ?? 0, (layer.get(n.id) ?? 0) + 1));
    }
  }
  const rows: ArchitectureNode[][] = [];
  for (const n of nodes) (rows[layer.get(n.id) ?? 0] ??= []).push(n);

  const placed: Placed[] = rows.flatMap((row, r) => {
    const w = row.length === 1 ? 260 : (W - GAP * (row.length + 1)) / row.length;
    const total = row.length * w + (row.length - 1) * GAP;
    return row.map((n, i) => ({ ...n, w, x: (W - total) / 2 + i * (w + GAP), y: 8 + r * ROW }));
  });
  return { placed, height: rows.length * ROW - (ROW - NODE_H) + 16 };
}

export function ArchitectureGraph({ nodes }: { nodes: readonly ArchitectureNode[] }) {
  const { t } = useLanguage();
  const { placed, height } = useMemo(() => layout(nodes), [nodes]);
  const byId = useMemo(() => new Map(placed.map((n) => [n.id, n])), [placed]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ? byId.get(activeId) : undefined;

  const edges = placed.flatMap((n) =>
    n.connections.flatMap((c) => {
      const to = byId.get(c);
      return to ? [{ from: n, to }] : [];
    }),
  );
  const linked = new Set(
    activeId ? edges.filter((e) => e.from.id === activeId || e.to.id === activeId).flatMap((e) => [e.from.id, e.to.id]) : [],
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${W} / ${height}` }}
        role="group"
        aria-label="System architecture"
      >
        {edges.map(({ from, to }) => {
          const sx = from.x + from.w / 2;
          const sy = from.y + NODE_H;
          const tx = to.x + to.w / 2;
          const ty = to.y;
          const out = activeId === from.id;
          const inc = activeId === to.id;
          return (
            <path
              key={`${from.id}-${to.id}`}
              d={`M${sx} ${sy} C${sx} ${sy + 20} ${tx} ${ty - 20} ${tx} ${ty}`}
              fill="none"
              stroke={out ? "var(--velora-pink)" : inc ? "var(--velora-purple)" : "var(--border-hairline)"}
              strokeWidth={out || inc ? 1.5 : 1}
              className={cn((out || inc) && "edge-flow")}
            />
          );
        })}
        {placed.map((n) => {
          const isActive = n.id === activeId;
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}, ${n.tech}, ${n.latencyMs} ms`}
              aria-pressed={isActive}
              onPointerEnter={() => setActiveId(n.id)}
              onFocus={() => setActiveId(n.id)}
              onClick={() => setActiveId(n.id)}
              className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--velora-pink)]"
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={NODE_H}
                fill="var(--bg-elevated)"
                stroke={isActive ? "var(--velora-lavender)" : linked.has(n.id) ? "var(--velora-purple)" : "var(--border-hairline)"}
                strokeWidth={isActive ? 1.5 : 1}
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + NODE_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-primary)"
                fontSize="11.5"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 min-h-[76px] border-t border-hairline pt-4 font-mono text-xs" aria-live="polite">
        {active ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-muted">node</dt>
            <dd className="text-ink">
              {active.label} <span className="text-secondary">· {active.type}</span>
            </dd>
            <dt className="text-muted">{t("projects.node.tech")}</dt>
            <dd className="text-ink">{active.tech}</dd>
            <dt className="text-muted">{t("projects.node.latency")}</dt>
            <dd className="tabular text-accent-text">{active.latencyMs} ms</dd>
          </dl>
        ) : (
          <p className="text-secondary">{t("projects.node.hint")}</p>
        )}
      </div>
    </div>
  );
}
