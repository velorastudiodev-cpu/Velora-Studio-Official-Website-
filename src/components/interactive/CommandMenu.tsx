"use client";

import { Command } from "cmdk";
import {
  ArrowUpRight,
  Check,
  Globe,
  Hash,
  Languages,
  Mail,
  MessageCircle,
  ScanLine,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/components/sections/SiteNav";
import { useInspector } from "@/context/InspectorContext";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT, whatsappLink } from "@/data/contact";
import type { DictionaryKey } from "@/data/dictionaries";
import { projects } from "@/data/projects";
import { emit, useVeloraEvent } from "@/lib/events";
import { LOCALES } from "@/lib/enums";
import { SPRING } from "@/lib/utils";

const NAV: [string, DictionaryKey][] = [["#top", "nav.home"], ...NAV_LINKS];

const item =
  "flex min-h-11 cursor-pointer items-center gap-3 px-4 text-[15px] text-ink data-[selected=true]:bg-ink data-[selected=true]:text-paper";
const group =
  "[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted";

function Item({ icon: Icon, onSelect, children }: { icon: LucideIcon; onSelect: () => void; children: React.ReactNode }) {
  return (
    <Command.Item onSelect={onSelect} className={item}>
      <Icon size={16} strokeWidth={1.5} aria-hidden className="shrink-0" />
      {children}
    </Command.Item>
  );
}

export function CommandMenu() {
  const { t, l, setLocale } = useLanguage();
  const inspector = useInspector();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  useVeloraEvent("velora:command", () => setOpen((o) => !o));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    else returnFocus.current?.focus();
  }, [open]);

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  const jump = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 900);
    } catch {
      // Clipboard blocked (insecure context, permissions): fall back to the mail client.
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/50 px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={SPRING.drawer}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("cmdk.title")}
            className="w-full max-w-[560px] bg-paper shadow-[0_24px_64px_rgb(0_0_0/0.35)]" // taste-skill-ignore: a dialog floats
            initial={{ y: -16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -16, scale: 0.98 }}
            transition={SPRING.drawer}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Tab") e.preventDefault(); // focus stays in the search field
            }}
          >
            <Command label={t("cmdk.title")} loop>
              <Command.Input
                autoFocus
                placeholder={t("cmdk.placeholder")}
                className="h-14 w-full bg-paper-2 px-4 text-[16px] text-ink outline-none placeholder:text-muted"
              />
              <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto pb-2">
                <Command.Empty className="px-4 py-6 text-[15px] text-muted">{t("cmdk.empty")}</Command.Empty>

                <Command.Group heading={t("cmdk.group.navigate")} className={group}>
                  {NAV.map(([hash, key]) => (
                    <Item key={hash} icon={Hash} onSelect={run(() => jump(hash))}>
                      {t(key)}
                    </Item>
                  ))}
                  {projects.map((p) => (
                    <Item key={p.id} icon={Hash} onSelect={run(() => jump(`#${p.slug}`))}>
                      {l(p.title).split(" — ")[0]}
                    </Item>
                  ))}
                </Command.Group>

                <Command.Group heading={t("cmdk.group.actions")} className={group}>
                  <Item icon={MessageCircle} onSelect={run(() => window.open(whatsappLink(t("cta.msg.greeting")), "_blank", "noopener"))}>
                    {t("cmdk.action.whatsapp")}, {CONTACT.whatsappDisplay}
                  </Item>
                  <Item icon={copied ? Check : Mail} onSelect={copyEmail}>
                    {copied ? t("cmdk.copied") : `${t("cmdk.action.email")}, ${CONTACT.email}`}
                  </Item>
                  <Item icon={ScanLine} onSelect={run(inspector.toggle)}>
                    {t("cmdk.action.inspector")}
                  </Item>
                  <Item icon={SquareTerminal} onSelect={run(() => emit("velora:terminal"))}>
                    {t("cmdk.action.terminal")}
                  </Item>
                  {projects.map(
                    (p) =>
                      p.links.liveDemo && (
                        <Item key={p.id} icon={ArrowUpRight} onSelect={run(() => window.open(p.links.liveDemo, "_blank", "noopener"))}>
                          {t("cmdk.action.live")}: {l(p.title).split(" — ")[0]}
                        </Item>
                      ),
                  )}
                </Command.Group>

                <Command.Group heading={t("cmdk.group.language")} className={group}>
                  {LOCALES.map((loc) => (
                    <Item key={loc} icon={loc === "id" ? Languages : Globe} onSelect={run(() => setLocale(loc))}>
                      {loc === "id" ? "Bahasa Indonesia" : "English"}
                    </Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
