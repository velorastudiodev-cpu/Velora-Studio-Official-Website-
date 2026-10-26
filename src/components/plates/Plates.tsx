// Pictures of the real work. `Shot` shows a screenshot of a live site; `SketchPlate` is the wireframe of the
// DINASTI hero traced from that screenshot, so "sketch" and "built" are the same page. Both use the
// 1440×810 frame of the screenshots, so overlays (Redlines) share its coordinates.

import Image from "next/image";

const W = 1440;
const H = 810;

export const SHOTS = {
  dinastiHero: "/work/dinasti-hero.webp",
  dinastiPortfolio: "/work/dinasti-portfolio.webp",
  dashboardLogin: "/work/dashboard-login.webp",
  dashboardPanel: "/work/dashboard-panel.webp", // login card moved to the top third, clear of the midline band
  dashboardCard: "/work/dashboard-card.webp", // 4:5 crop of the login card, for phones
  dzikriHero: "/work/dzikri-hero.webp",
  dzikriGallery: "/work/dzikri-gallery.webp",
  dzikriCalculator: "/work/dzikri-calculator.webp",
} as const;

export function Shot({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
}

export function SketchPlate({ label }: { label: string }) {
  const line = { fill: "none", stroke: "var(--ink)", strokeWidth: 2.5 } as const;
  const bar = (x: number, y: number, w: number, h: number) => <rect x={x} y={y} width={w} height={h} fill="var(--ink)" opacity={0.16} />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-full w-full">
      <rect width={W} height={H} fill="var(--paper)" />
      {/* Navigation */}
      <rect x={120} y={12} width={72} height={52} {...line} />
      {[428, 528, 619, 705, 804, 892].map((x) => bar(x, 34, 60, 12))}
      <rect x={1163} y={17} width={177} height={42} {...line} />
      {/* Badge, name, two-line subtitle, intro */}
      <rect x={100} y={184} width={328} height={34} {...line} />
      {bar(100, 265, 385, 75)}
      {bar(100, 362, 740, 50)}
      {bar(100, 428, 700, 50)}
      {bar(100, 515, 616, 16)}
      {bar(100, 548, 560, 16)}
      {/* Two actions */}
      <rect x={100} y={608} width={302} height={48} {...line} />
      <rect x={414} y={608} width={177} height={48} {...line} />
      {/* Three figures */}
      <line x1={100} y1={720} x2={750} y2={720} {...line} strokeWidth={1.5} />
      {[100, 317, 533].map((x) => (
        <g key={x}>
          {bar(x, 750, 44, 18)}
          {bar(x, 782, 120, 12)}
        </g>
      ))}
      {/* Portrait photo slot */}
      <rect x={902} y={126} width={438} height={635} {...line} />
      <path d="M902 126 1340 761M1340 126 902 761" {...line} strokeWidth={1.5} />
    </svg>
  );
}

/** Measurements of the real DINASTI hero, drawn over its screenshot: what engineering checks. */
export function Redlines() {
  const mark = { stroke: "var(--redline)", strokeWidth: 3 };
  const tag = (x: number, y: number, text: string) => (
    <g>
      <rect x={x} y={y - 28} width={text.length * 14 + 22} height={40} fill="var(--redline)" />
      <text x={x + 11} y={y} fontSize={24} fontWeight={700} fill="#fff">
        {text}
      </text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="absolute inset-0 h-full w-full" style={{ fontFamily: "var(--font-text)" }}>
      <rect x={100} y={608} width={302} height={48} fill="none" {...mark} />
      {tag(100, 700, "302 × 48")}
      <rect x={902} y={126} width={438} height={635} fill="none" {...mark} strokeDasharray="10 8" />
      {tag(1040, 110, "438 × 635")}
      <line x1={0} y1={290} x2={100} y2={290} {...mark} />
      {tag(10, 330, "100")}
    </svg>
  );
}
