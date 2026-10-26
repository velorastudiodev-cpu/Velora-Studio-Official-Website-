"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { SHOTS, Shot, SketchPlate } from "@/components/plates/Plates";
import { SiteNav } from "@/components/sections/SiteNav";
import { useLanguage } from "@/context/LanguageContext";
import { whatsappLink } from "@/data/contact";
import type { DictionaryKey } from "@/data/dictionaries";

const CAPTIONS: DictionaryKey[] = ["hero.reel.sketch", "hero.reel.solid", "hero.reel.dashboard", "hero.reel.trail"];

/** Words of a half on their own lines from lg up, inline (one line per half) on phones. */
function Half({ text, align, at }: { text: string; align: "left" | "right"; at: number }) {
  return (
    <span className={align === "right" ? "block text-right" : "block"}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="lg:block">
          {i > 0 && <span className="lg:hidden"> </span>}
          {/* Each word rises out of its own line on first paint. */}
          <span className="rise-mask">
            <span className="rise" style={{ "--i": at + i } as React.CSSProperties}>
              {w}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * "Sentence split by a frame": the two halves of the h1 hold their place while a reel of frames
 * passes between them, from the sketch of a screen to the running system.
 */
export function HeroReel() {
  const { t } = useLanguage();
  const stage = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  const steps = CAPTIONS.length - 1;
  // One frame step = frame height + gap, both CSS custom properties on the column.
  const y = useTransform(scrollYProgress, (p) => `calc(${-p * steps} * (var(--fh) + var(--fgap)))`);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(steps, Math.round(p * steps))));

  const frames = [
    <SketchPlate key="sketch" label={t("hero.reel.sketch")} />,
    <Shot key="solid" src={SHOTS.dinastiHero} alt={t("hero.reel.solid")} sizes="40vw" priority />,
    <Shot key="dashboard" src={SHOTS.dashboardLogin} alt={t("hero.reel.dashboard")} sizes="40vw" />,
    <Shot key="trail" src={SHOTS.dzikriHero} alt={t("hero.reel.trail")} sizes="40vw" />,
  ];

  return (
    <section ref={stage} id="top" data-inspector="Hero · sticky stage" aria-labelledby="hero-title" className="relative lg:h-[220svh]">
      <div className="relative flex min-h-svh flex-col lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        <SiteNav />

        {/* Desktop: the frame column runs the full height between the two halves. */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[40vw] -translate-x-1/2 [--fgap:calc((100svh-var(--fh))/2-56px)] [--fh:calc(40vw*9/16)] lg:block">
          <motion.div style={reduce ? {} : { y }} className="flex flex-col gap-[var(--fgap)] pt-[calc((100svh-var(--fh))/2)]">
            {frames.map((f, i) => (
              <div key={i} className="relative aspect-video w-full overflow-hidden rounded-[4px] bg-paper-2">
                {f}
              </div>
            ))}
          </motion.div>
        </div>

        <h1
          id="hero-title"
          className="display margin-x relative mt-8 text-[15vw] sm:text-[11vw] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-1/2 lg:mt-0 lg:flex lg:-translate-y-1/2 lg:items-center lg:justify-between lg:text-display"
        >
          <Half text={t("hero.left")} align="left" at={0} />
          {/* Phone: the frame sits between the halves, crossfading from sketch to solid. */}
          <span aria-hidden className="relative my-5 block aspect-video w-full overflow-hidden rounded-[4px] bg-paper-2 lg:hidden">
            <span className="absolute inset-0 animate-[sketch-fade_7s_ease-in-out_infinite_alternate]">
              <SketchPlate label={t("hero.reel.sketch")} />
            </span>
            <span className="absolute inset-0 animate-[solid-fade_7s_ease-in-out_infinite_alternate]">
              <Shot src={SHOTS.dinastiHero} alt="" sizes="100vw" />
            </span>
          </span>
          <Half text={t("hero.right")} align="right" at={2} />
        </h1>

        <div className="fade-up margin-x mt-8 flex flex-col items-start gap-6 pb-12 lg:absolute lg:bottom-10 lg:left-0 lg:mt-0 lg:w-[30vw] lg:pb-0">
          <p className="text-lead max-w-[30ch]">{t("hero.support")}</p>
          <a
            href={whatsappLink(t("cta.msg.greeting"))}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center bg-lime px-6 font-medium text-lime-ink transition-[background-color,color,translate] duration-200 hover:bg-ink hover:text-lime active:translate-y-px"
          >
            {t("nav.chat")}
          </a>
        </div>

        {/* What the frame shows right now: changes with every step of the reel. */}
        <p aria-live="polite" className="margin-x hidden text-right lg:absolute lg:bottom-10 lg:right-0 lg:block lg:w-[30vw]">
          <span className="text-lead">{t(CAPTIONS[step] ?? "hero.reel.sketch")}</span>
        </p>
      </div>
    </section>
  );
}
