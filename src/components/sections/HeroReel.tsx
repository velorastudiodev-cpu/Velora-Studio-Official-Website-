"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { BookingPlate, ChairPlate, TrailPlate } from "@/components/plates/Plates";
import { SiteNav } from "@/components/sections/SiteNav";
import { useLanguage } from "@/context/LanguageContext";
import { whatsappLink } from "@/data/contact";
import type { DictionaryKey } from "@/data/dictionaries";

const CAPTIONS: DictionaryKey[] = ["hero.reel.sketch", "hero.reel.solid", "hero.reel.chairs", "hero.reel.trail"];

/** Words of a half on their own lines from lg up, inline (one line per half) on phones. */
function Half({ text, align }: { text: string; align: "left" | "right" }) {
  return (
    <span className={align === "right" ? "block text-right" : "block"}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="lg:block">
          {i > 0 && <span className="lg:hidden"> </span>}
          {w}
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
    <BookingPlate key="sketch" mode="sketch" label={t("hero.reel.sketch")} />,
    <BookingPlate key="solid" mode="solid" label={t("hero.reel.solid")} />,
    <ChairPlate key="chairs" label={t("hero.reel.chairs")} />,
    <TrailPlate key="trail" label={t("hero.reel.trail")} />,
  ];

  return (
    <section ref={stage} id="top" data-inspector="Hero · sticky stage" aria-labelledby="hero-title" className="relative lg:h-[220svh]">
      <div className="relative flex min-h-svh flex-col lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        <SiteNav />

        {/* Desktop: the frame column runs the full height between the two halves. */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[40vw] -translate-x-1/2 [--fgap:calc((100svh-var(--fh))/2-56px)] [--fh:calc(40vw*9/16)] lg:block">
          <motion.div style={reduce ? {} : { y }} className="flex flex-col gap-[var(--fgap)] pt-[calc((100svh-var(--fh))/2)]">
            {frames.map((f, i) => (
              <div key={i} className="aspect-video w-full overflow-hidden rounded-[4px] bg-paper-2">
                {f}
              </div>
            ))}
          </motion.div>
        </div>

        <h1
          id="hero-title"
          className="display margin-x relative mt-8 text-[15vw] sm:text-[11vw] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-1/2 lg:mt-0 lg:flex lg:-translate-y-1/2 lg:items-center lg:justify-between lg:text-display"
        >
          <Half text={t("hero.left")} align="left" />
          {/* Phone: the frame sits between the halves, crossfading from sketch to solid. */}
          <span aria-hidden className="relative my-5 block aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-paper-2 sm:aspect-video lg:hidden">
            <span className="absolute inset-0 animate-[sketch-fade_7s_ease-in-out_infinite_alternate]">
              <BookingPlate mode="sketch" label={t("hero.reel.sketch")} fit="cover" />
            </span>
            <span className="absolute inset-0 animate-[solid-fade_7s_ease-in-out_infinite_alternate]">
              <BookingPlate mode="solid" label={t("hero.reel.solid")} fit="cover" />
            </span>
          </span>
          <Half text={t("hero.right")} align="right" />
        </h1>

        <div className="margin-x mt-8 flex flex-col items-start gap-6 pb-12 lg:absolute lg:bottom-10 lg:left-0 lg:mt-0 lg:w-[30vw] lg:pb-0">
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
