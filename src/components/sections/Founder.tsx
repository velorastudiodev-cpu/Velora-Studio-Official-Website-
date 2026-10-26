"use client";

import Image from "next/image";
import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER } from "@/data/studio";

/** Who builds Velora: one person, named, on the logo's violet. */
export function Founder() {
  const { t } = useLanguage();
  return (
    <section id="founder" aria-labelledby="founder-heading" data-inspector="Founder · violet field" className="bg-violet py-[clamp(5rem,10vw,9rem)] text-violet-ink">
      <div className="margin-x grid items-end gap-x-[var(--gutter)] gap-y-12 lg:grid-cols-12">
        <figure data-reveal="clip" className="relative m-0 aspect-[4/5] overflow-clip bg-ink lg:col-span-4">
          {FOUNDER.photo ? (
            <Image src={FOUNDER.photo} alt={FOUNDER.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          ) : (
            <div role="img" aria-label={t("founder.photo")} className="drift-mark absolute inset-0 grid place-items-center">
              <VeloraLogo variant="mark" height={200} className="h-auto w-1/2 text-paper" />
            </div>
          )}
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <p data-reveal className="text-lead">
            {t("founder.heading")}
          </p>
          <h2 id="founder-heading" className="display mt-4 text-display">
            <span className="rise-mask">
              <span className="rise-in" data-reveal>
                {FOUNDER.short}
              </span>
            </span>
          </h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="text-lead mt-6 font-semibold">
            {FOUNDER.name}
          </p>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-1">
            {t("founder.role")}
          </p>
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="text-lead mt-8 max-w-[44ch]">
            {t("founder.bio")}
          </p>
          <a
            data-reveal
            style={{ "--i": 3 } as React.CSSProperties}
            href={FOUNDER.portfolio}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex h-12 items-center gap-3 bg-paper px-6 font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t("founder.portfolio")} ↗
          </a>
        </div>
      </div>
    </section>
  );
}
