"use client";

import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT, whatsappLink } from "@/data/contact";

/** Invitation over the cropped name: the close and the footer in one ink field. */
export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer data-inspector="Footer · invitation over cropped name" className="relative overflow-hidden bg-ink pt-[clamp(4rem,8vw,7rem)] text-paper">
      <div className="margin-x grid gap-x-[var(--gutter)] gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 data-reveal className="display text-head">
            {t("footer.invite1")}
            <br />
            {t("footer.invite2")}
          </h2>
          <a
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            href={whatsappLink(t("cta.msg.greeting"))}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex h-14 w-full items-center justify-center bg-lime px-6 font-medium text-lime-ink transition-colors hover:bg-paper sm:w-fit"
          >
            {t("nav.chat")}
          </a>
        </div>
        <ul className="space-y-3 lg:col-span-3 lg:col-start-10">
          <li>
            <a href={whatsappLink(t("cta.msg.greeting"))} target="_blank" rel="noreferrer" className="tabular hover:text-lime">
              WhatsApp {CONTACT.whatsappDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-lime [overflow-wrap:anywhere]">
              {CONTACT.email}
            </a>
          </li>
          <li className="text-ink-muted">{t("footer.place")}</li>
          <li>
            <a href="#top" className="hover:text-lime">
              {t("footer.top")}
            </a>
          </li>
        </ul>
      </div>

      <div className="margin-x text-small mt-20 flex flex-col gap-2 text-ink-muted lg:flex-row lg:justify-between">
        <p>© {new Date().getFullYear()} Velora Studio Dev</p>
        <p className="max-w-[70ch] lg:text-right">{t("footer.dev")}</p>
      </div>

      {/* The name returns at full width, cut by the bottom edge (height is width ÷ 3.45, so -8vw hides ~28%). */}
      <div aria-hidden className="margin-x mt-6 -mb-[8vw]">
        <VeloraLogo height={420} className="h-auto w-full text-paper" />
      </div>
    </footer>
  );
}
