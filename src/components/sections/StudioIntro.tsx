"use client";

import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { useLanguage } from "@/context/LanguageContext";
import type { DictionaryKey } from "@/data/dictionaries";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";

const STATS: [number, DictionaryKey][] = [
  [projects.length, "studio.stat.live"],
  [pillars.length, "studio.stat.skills"],
  [2, "studio.stat.years"],
  [100, "studio.stat.lighthouse"],
];
const PRINCIPLES = ["p1", "p2", "p3"] as const;

/** What Velora is: a statement that lights up word by word as it is read, then the numbers behind it. */
export function StudioIntro() {
  const { t } = useLanguage();
  return (
    <section id="studio" aria-labelledby="studio-heading" data-inspector="Studio · scroll-lit statement" className="bg-paper py-[clamp(5rem,12vw,11rem)]">
      <div className="margin-x grid gap-x-[var(--gutter)] gap-y-6 lg:grid-cols-12">
        <h2 id="studio-heading" data-reveal className="flex items-center gap-3 font-medium lg:col-span-3 lg:self-start lg:pt-3">
          <span aria-hidden>
            <VeloraLogo variant="mark" height={20} />
          </span>
          {t("studio.heading")}
        </h2>
        <p className="text-statement max-w-[34ch] font-medium lg:col-span-9">
          {/* Lit phrase by phrase: one scroll timeline per word cost a 200 ms layout on phones. */}
          {t("studio.statement")
            .split(/(?<=[.,:])\s/)
            .map((w, i) => (
              <span key={i} className="lit">
                {w}{" "}
              </span>
            ))}
        </p>
      </div>

      <dl className="margin-x mt-[clamp(4rem,8vw,7rem)] grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-4">
        {STATS.map(([n, key], i) => (
          <div key={key} className="flex flex-col">
            <dt className="text-small order-2 mt-2 max-w-[18ch] text-muted">{t(key)}</dt>
            <dd className="order-1">
              {/* Counts up when it scrolls in; the real number is what assistive tech reads. */}
              <span aria-hidden data-reveal className="count display tabular block text-display" style={{ "--to": n, "--i": i } as React.CSSProperties} />
              <span className="sr-only">{n}</span>
            </dd>
          </div>
        ))}
      </dl>

      <ul className="margin-x mt-[clamp(4rem,8vw,7rem)] grid gap-x-[var(--gutter)] gap-y-12 md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <li key={p} data-reveal style={{ "--i": i } as React.CSSProperties}>
            {/* The logo's two arms: the first point is the outline, the rest are solid. */}
            <span aria-hidden className={i === 0 ? "block size-5 border-[3px] border-violet" : "block size-5 bg-violet"} />
            <h3 className="text-lead mt-5 font-semibold">{t(`studio.${p}.title`)}</h3>
            <p className="mt-3 max-w-[38ch] text-muted">{t(`studio.${p}.body`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The four disciplines running past on an ink band, separated by the mark. Decorative: they are listed in "How I work". */
export function Ticker() {
  const { l } = useLanguage();
  const row = (
    <span className="flex shrink-0 items-center">
      {pillars.map((p) => (
        <span key={p.id} className="flex items-center">
          <span className="display px-[0.35em] text-[clamp(3rem,8vw,7rem)]">{l(p.title)}</span>
          <VeloraLogo variant="mark" height={56} className="h-[0.5em] w-auto text-paper [font-size:clamp(3rem,8vw,7rem)]" />
        </span>
      ))}
    </span>
  );
  return (
    <div aria-hidden className="overflow-clip bg-ink py-6 text-paper">
      <div className="ticker flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
