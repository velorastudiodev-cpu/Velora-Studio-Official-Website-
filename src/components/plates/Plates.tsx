// Drawings of each project's own screens and data, on one 1600×900 canvas so they scale from the hero
// frame up to a full-screen panel. They illustrate the flows in projects.ts; real screenshots replace
// them once supplied. Each root carries data-ui: it is an interface fragment, not page chrome.

import type { ReactNode } from "react";

export type PlateMode = "sketch" | "solid";
type Fit = "contain" | "cover";

const W = 1600;
const H = 900;

function Plate({ label, fit = "contain", children }: { label: string; fit?: Fit | undefined; children: ReactNode }) {
  return (
    <div data-ui className="h-full w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
        className="block h-full w-full"
        style={{ fontFamily: "var(--font-text)" }}
      >
        {children}
      </svg>
    </div>
  );
}

/* ---------- Ikbar Barbershop: booking screen (VEL-001) ---------- */

const BARBERS = [
  ["A", "Kapster A", "Fade & taper"],
  ["B", "Kapster B", "Potong klasik"],
  ["C", "Kapster C", "Jenggot & cukur"],
] as const;
const SERVICES = [
  ["Potong rambut", "45 mnt"],
  ["Potong + cuci", "60 mnt"],
  ["Cukur jenggot", "30 mnt"],
] as const;
// Slots 10.00–19.30; "x" booked, "lock" held during QRIS payment.
const SLOTS = Array.from({ length: 20 }, (_, i) => {
  const m = 600 + i * 30;
  const time = `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;
  const state = time === "14.30" ? "lock" : [1, 2, 5, 9, 10, 15, 16].includes(i) ? "x" : "free";
  return { time, state };
});

/** In sketch mode text becomes a wireframe bar and every fill becomes an outline. */
function Txt({
  mode,
  x,
  y,
  size,
  children,
  fill = "var(--paper)",
  weight = 400,
  anchor = "start",
  display = false,
}: {
  mode: PlateMode;
  x: number;
  y: number;
  size: number;
  children: string;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  display?: boolean;
}) {
  if (mode === "sketch") {
    const w = children.length * size * (display ? 0.42 : 0.5);
    const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
    return <rect x={x0} y={y - size * 0.72} width={w} height={size * 0.62} fill="var(--ink)" opacity={0.18} />;
  }
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      style={display ? { fontStretch: "62%", textTransform: "uppercase" } : undefined}
    >
      {children}
    </text>
  );
}

function Box({
  mode,
  x,
  y,
  w,
  h,
  fill,
  r = 0,
}: {
  mode: PlateMode;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  r?: number;
}) {
  return mode === "sketch" ? (
    <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
  ) : (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
  );
}

export function BookingPlate({ mode, label, fit }: { mode: PlateMode; label: string; fit?: Fit }) {
  const solid = mode === "solid";
  const panel = "#1c1b1e";
  return (
    <Plate label={label} fit={fit}>
      <rect width={W} height={H} fill={solid ? "var(--ink)" : "var(--paper)"} />

      {/* Header */}
      <Txt mode={mode} x={80} y={120} size={64} weight={800} display>
        Ikbar Barbershop
      </Txt>
      {(["1 Kapster", "2 Layanan", "3 Jam"] as const).map((s, i) => (
        <g key={s}>
          <Box mode={mode} x={880 + i * 220} y={78} w={200} h={56} r={28} fill={i === 2 ? "var(--paper)" : panel} />
          <Txt mode={mode} x={980 + i * 220} y={115} size={24} weight={600} anchor="middle" fill={i === 2 ? "var(--ink)" : "var(--paper)"}>
            {s}
          </Txt>
        </g>
      ))}

      {/* Barbers */}
      {BARBERS.map(([initial, name, skill], i) => {
        const y = 200 + i * 150;
        const on = i === 1;
        return (
          <g key={name}>
            <Box mode={mode} x={80} y={y} w={440} h={128} r={8} fill={on ? "var(--paper)" : panel} />
            {solid ? (
              <circle cx={146} cy={y + 64} r={38} fill={on ? "var(--violet)" : "#2c2b30"} />
            ) : (
              <circle cx={146} cy={y + 64} r={38} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
            )}
            <Txt mode={mode} x={146} y={y + 76} size={32} weight={700} anchor="middle" fill="var(--paper)">
              {initial}
            </Txt>
            <Txt mode={mode} x={208} y={y + 56} size={30} weight={600} fill={on ? "var(--ink)" : "var(--paper)"}>
              {name}
            </Txt>
            <Txt mode={mode} x={208} y={y + 96} size={24} fill={on ? "#555553" : "#a9a9a6"}>
              {skill}
            </Txt>
          </g>
        );
      })}

      {/* Services */}
      {SERVICES.map(([name, dur], i) => {
        const y = 200 + i * 150;
        const on = i === 0;
        return (
          <g key={name}>
            <Box mode={mode} x={560} y={y} w={420} h={128} r={8} fill={on ? "var(--paper)" : panel} />
            <Txt mode={mode} x={600} y={y + 58} size={30} weight={600} fill={on ? "var(--ink)" : "var(--paper)"}>
              {name}
            </Txt>
            <Txt mode={mode} x={600} y={y + 98} size={24} fill={on ? "#555553" : "#a9a9a6"}>
              {dur}
            </Txt>
          </g>
        );
      })}

      {/* Time slots */}
      <Txt mode={mode} x={1020} y={190} size={26} weight={600} fill="#a9a9a6">
        Sabtu, 14 Juni
      </Txt>
      {SLOTS.map((s, i) => {
        const x = 1020 + (i % 4) * 128;
        const y = 220 + Math.floor(i / 4) * 92;
        const lock = s.state === "lock";
        const taken = s.state === "x";
        return (
          <g key={s.time}>
            {solid ? (
              <rect
                x={x}
                y={y}
                width={116}
                height={76}
                rx={6}
                className={lock ? "slot-hold" : undefined}
                fill={lock ? "var(--lime)" : taken ? "#1c1b1e" : "none"}
                stroke={lock || taken ? "none" : "#555553"}
                strokeWidth={2}
              />
            ) : (
              <rect x={x} y={y} width={116} height={76} rx={6} fill="none" stroke="var(--ink)" strokeWidth={2.5} strokeDasharray={taken ? "6 6" : undefined} />
            )}
            <Txt mode={mode} x={x + 58} y={y + 48} size={26} weight={lock ? 700 : 500} anchor="middle" fill={lock ? "var(--ink)" : taken ? "#555553" : "var(--paper)"}>
              {s.time}
            </Txt>
          </g>
        );
      })}

      {/* Payment */}
      <Box mode={mode} x={80} y={700} w={900} h={120} r={8} fill={panel} />
      <Txt mode={mode} x={120} y={752} size={28} weight={600}>
        Kapster B, potong rambut, 14.30
      </Txt>
      <Txt mode={mode} x={120} y={794} size={24} fill="#a9a9a6">
        Slot dikunci 04:59 selama pembayaran
      </Txt>
      <Box mode={mode} x={1020} y={700} w={500} h={120} r={8} fill="var(--lime)" />
      <Txt mode={mode} x={1270} y={772} size={32} weight={700} anchor="middle" fill="var(--ink)">
        Bayar dengan QRIS
      </Txt>
    </Plate>
  );
}

/* ---------- Ikbar Barbershop dashboard: chair schedule (VEL-002) ---------- */

const NAV = ["Jadwal", "Layanan & harga", "Kasir", "Komisi", "Laporan"];
const HOURS = ["10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00"];
// [chair, start hour index (fractional), length in hours, label]
const BLOCKS: [number, number, number, string][] = [
  [0, 0, 0.75, "Potong rambut"],
  [0, 1.5, 1, "Potong + cuci"],
  [0, 4, 0.75, "Potong rambut"],
  [1, 0.5, 0.5, "Cukur jenggot"],
  [1, 2, 1, "Potong + cuci"],
  [2, 0, 1, "Potong + cuci"],
  [2, 3, 0.75, "Potong rambut"],
  [2, 5.5, 0.5, "Cukur jenggot"],
  [3, 1, 0.75, "Potong rambut"],
  [3, 3.5, 1, "Potong + cuci"],
  [3, 6, 0.75, "Potong rambut"],
];

/** `pulse` replays the website booking dropping into chair 2 (each change remounts the block). */
export function ChairPlate({ label, pulse = 0, fit }: { label: string; pulse?: number; fit?: Fit }) {
  const gx = 520;
  const gy = 230;
  const colW = 250;
  const rowH = 76;
  const block = (chair: number, start: number, len: number) => ({
    x: gx + chair * colW + 10,
    y: gy + start * rowH + 4,
    w: colW - 20,
    h: len * rowH - 8,
  });
  const fb = block(1, 4.5, 0.75);
  return (
    <Plate label={label} fit={fit}>
      <rect width={W} height={H} fill="var(--violet)" />
      <rect x={60} y={60} width={W - 120} height={H - 120} rx={10} fill="var(--paper)" />

      {/* Sidebar */}
      <rect x={60} y={60} width={360} height={H - 120} rx={10} fill="var(--paper-2)" />
      <text x={100} y={130} fontSize={30} fontWeight={800} fill="var(--ink)" style={{ fontStretch: "62%", textTransform: "uppercase" }}>
        Ikbar Dashboard
      </text>
      {NAV.map((n, i) => (
        <g key={n}>
          {i === 0 && <rect x={84} y={168 + i * 64} width={312} height={52} rx={6} fill="var(--ink)" />}
          <text x={108} y={202 + i * 64} fontSize={24} fontWeight={i === 0 ? 600 : 400} fill={i === 0 ? "var(--paper)" : "var(--ink)"}>
            {n}
          </text>
        </g>
      ))}

      {/* Header */}
      <text x={gx} y={130} fontSize={36} fontWeight={700} fill="var(--ink)">
        Jadwal hari ini
      </text>
      <text x={gx} y={170} fontSize={22} fill="#555553">
        Sabtu, 14 Juni. 12 booking, 4 kursi aktif
      </text>
      {[0, 1, 2, 3].map((c) => (
        <text key={c} x={gx + c * colW + 10} y={216} fontSize={22} fontWeight={600} fill="var(--ink)">
          Kursi {c + 1}
        </text>
      ))}

      {/* Grid rows: tone steps, not lines */}
      {HOURS.map((h, i) => (
        <g key={h}>
          {i % 2 === 0 && <rect x={gx} y={gy + i * rowH} width={colW * 4} height={rowH} fill="#e8e8e6" />}
          <text x={gx - 20} y={gy + i * rowH + 28} fontSize={20} fill="#555553" textAnchor="end" style={{ fontVariantNumeric: "tabular-nums" }}>
            {h}
          </text>
        </g>
      ))}
      {BLOCKS.map(([c, s, l, t], i) => {
        const b = block(c, s, l);
        return (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill="var(--ink)" />
            <text x={b.x + 16} y={b.y + 32} fontSize={20} fontWeight={500} fill="var(--paper)">
              {t}
            </text>
          </g>
        );
      })}

      {/* The booking locked on the website at 14.30 lands on chair 2. */}
      <g key={pulse} className={pulse > 0 ? "plate-drop" : undefined}>
        <rect x={fb.x} y={fb.y} width={fb.w} height={fb.h} rx={6} fill="var(--lime)" />
        <text x={fb.x + 16} y={fb.y + 30} fontSize={20} fontWeight={700} fill="var(--ink)">
          Baru dari web
        </text>
        <text x={fb.x + 16} y={fb.y + 52} fontSize={18} fill="var(--ink)">
          Kapster B, 14.30
        </text>
      </g>
    </Plate>
  );
}

/* ---------- Dzikri Mount Guide: Sembalun route profile (VEL-003) ---------- */

// Commonly published elevations (mdpl) of the Sembalun route to the Rinjani summit.
const POSTS: [string, number][] = [
  ["Sembalun", 1156],
  ["Pos 1", 1300],
  ["Pos 2", 1500],
  ["Pos 3", 1800],
  ["Plawangan Sembalun", 2639],
  ["Puncak Rinjani", 3726],
];
const LOAD_KG = 64;
const MAX_PER_PORTER = 20;

const mdpl = (n: number) => n.toLocaleString("id-ID");

/** `drawIn` draws the route as it scrolls into view (only outside the hero, whose frame cannot scroll). */
export function TrailPlate({ label, fit, drawIn = false }: { label: string; fit?: Fit; drawIn?: boolean }) {
  const x0 = 120;
  const x1 = 1080;
  const yTop = 150;
  const yBase = 760;
  const lo = 1000;
  const hi = 3900;
  const pts = POSTS.map(([name, m], i) => ({
    name,
    m,
    x: x0 + (i / (POSTS.length - 1)) * (x1 - x0),
    y: yBase - ((m - lo) / (hi - lo)) * (yBase - yTop),
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const porters = Math.ceil(LOAD_KG / MAX_PER_PORTER);
  return (
    <Plate label={label} fit={fit}>
      <rect width={W} height={H} fill="var(--paper)" />
      <text x={x0} y={100} fontSize={30} fontWeight={800} fill="var(--ink)" style={{ fontStretch: "62%", textTransform: "uppercase" }}>
        Jalur Sembalun ke Puncak Rinjani
      </text>
      <polygon points={`${x0},${yBase} ${line} ${x1},${yBase}`} fill="var(--violet)" />
      <polyline points={line} fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" pathLength={1} className={drawIn ? "draw-in" : undefined} />
      {pts.map((p, i) => {
        const right = i === pts.length - 1;
        return (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
            <text x={right ? p.x - 18 : p.x + 18} y={p.y - 34} fontSize={24} fontWeight={600} fill="var(--ink)" textAnchor={right ? "end" : "start"}>
              {p.name}
            </text>
            <text x={right ? p.x - 18 : p.x + 18} y={p.y - 8} fontSize={22} fill="#555553" textAnchor={right ? "end" : "start"} style={{ fontVariantNumeric: "tabular-nums" }}>
              {mdpl(p.m)} mdpl
            </text>
          </g>
        );
      })}

      {/* Porter calculator */}
      <rect x={1160} y={150} width={360} height={610} rx={10} fill="var(--ink)" />
      <text x={1196} y={214} fontSize={26} fontWeight={600} fill="var(--paper)">
        Kalkulator porter
      </text>
      <text x={1196} y={290} fontSize={22} fill="#a9a9a6">
        Total beban
      </text>
      <text x={1196} y={350} fontSize={60} fontWeight={800} fill="var(--paper)" style={{ fontVariantNumeric: "tabular-nums" }}>
        {LOAD_KG} kg
      </text>
      <text x={1196} y={420} fontSize={22} fill="#a9a9a6">
        Maksimal per porter
      </text>
      <text x={1196} y={470} fontSize={40} fontWeight={700} fill="var(--paper)">
        {MAX_PER_PORTER} kg
      </text>
      <rect x={1196} y={530} width={288} height={110} rx={8} fill="var(--lime)" />
      <text x={1220} y={578} fontSize={22} fill="var(--ink)">
        Butuh
      </text>
      <text x={1220} y={622} fontSize={40} fontWeight={800} fill="var(--ink)">
        {porters} porter
      </text>
      <text x={1196} y={712} fontSize={20} fill="#a9a9a6">
        Manifest tersimpan offline
      </text>
    </Plate>
  );
}
