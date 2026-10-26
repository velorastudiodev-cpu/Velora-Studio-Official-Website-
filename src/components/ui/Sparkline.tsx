const W = 120;
const H = 28;

/** Fixed-size SVG polyline; scales to the max of the given values. */
export function Sparkline({ values, className }: { values: readonly number[]; className?: string }) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? W / (values.length - 1) : 0;
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(H - 2 - (v / max) * (H - 4)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden className={className}>
      <polyline points={points} fill="none" stroke="var(--velora-lavender)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
