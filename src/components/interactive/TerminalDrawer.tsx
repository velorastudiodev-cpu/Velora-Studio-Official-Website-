"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { VeloraLogo } from "@/components/brand/VeloraLogo";
import { useInspector } from "@/context/InspectorContext";
import { useLanguage } from "@/context/LanguageContext";
import type { DictionaryKey } from "@/data/dictionaries";
import { pillars } from "@/data/pillars";
import { projects } from "@/data/projects";
import { isTyping, useVeloraEvent } from "@/lib/events";
import { LOCALES } from "@/lib/enums";
import { SPRING } from "@/lib/utils";

// ANSI Shadow "VELORA". Rendered in one system mono stack so the box glyphs line up.
const BANNER = [
  "██╗   ██╗███████╗██╗      ██████╗ ██████╗  █████╗ ",
  "██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗",
  "██║   ██║█████╗  ██║     ██║   ██║██████╔╝███████║",
  "╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔══██╗██╔══██║",
  " ╚████╔╝ ███████╗███████╗╚██████╔╝██║  ██║██║  ██║",
  "  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝",
];

const COMMANDS: [string, DictionaryKey][] = [
  ["help", "terminal.help.help"],
  ["pillars", "terminal.help.pillars"],
  ["ls projects", "terminal.help.ls"],
  ["inspect <VEL-001|VEL-002|VEL-003>", "terminal.help.inspect"],
  ["lang <id|en>", "terminal.help.lang"],
  ["inspector <on|off>", "terminal.help.inspector"],
  ["cta", "terminal.help.cta"],
  ["clear", "terminal.help.clear"],
  ["exit", "terminal.help.exit"],
];

type Line = { id: number; node: ReactNode };

function Banner({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex items-start gap-4">
      <pre
        aria-label="VELORA"
        className="overflow-hidden text-[8px] leading-none sm:text-[11px]"
        style={{ fontFamily: 'ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace' }}
      >
        {BANNER.map((row, i) => (
          <span key={i} className={i < 3 ? "block text-[#b9b1f0]" : "block text-violet-ink"}>
            {row}
          </span>
        ))}
      </pre>
      <VeloraLogo variant="mark" height={44} className="hidden shrink-0 text-paper sm:block" />
      <span className="sr-only">{subtitle}</span>
    </div>
  );
}

const out = (text: string) => <span className="text-ink-muted">{text}</span>;
const err = (text: string) => <span className="text-lime">{text}</span>;

export function TerminalDrawer() {
  const { t, l, setLocale } = useLanguage();
  const inspector = useInspector();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const print = (...nodes: ReactNode[]) =>
    setLines((ls) => [...ls, ...nodes.map((node) => ({ id: nextId.current++, node }))]);

  const toggle = () => setOpen((o) => !o);
  useVeloraEvent("velora:terminal", toggle);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inTerminal = e.target === inputRef.current;
      if ((e.key === "`" || e.key === "~") && (inTerminal || !isTyping(e))) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (nextId.current === 0) print(<Banner subtitle={t("terminal.engine")} />, out(`VELORA ${t("terminal.engine")}`), out(t("terminal.welcome")));
      inputRef.current?.focus();
    } else {
      returnFocus.current?.focus();
    }
    // print/t are stable enough for a one-shot banner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const jump = (hash: string) => {
    setOpen(false);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  const run = (raw: string) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ");
    print(
      <span>
        <span className="text-lime">velora</span>
        <span className="text-ink-muted">:~$ </span>
        <span className="text-paper">{raw}</span>
      </span>,
    );
    switch (cmd.toLowerCase()) {
      case "":
        return;
      case "help":
        return print(
          <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-6 gap-y-0.5">
            {COMMANDS.map(([c, k]) => (
              <div key={c} className="contents">
                <dt className="text-[#b9b1f0]">{c}</dt>
                <dd className="text-ink-muted">{t(k)}</dd>
              </div>
            ))}
          </dl>,
        );
      case "pillars":
        return print(
          ...pillars.map((p) => (
            <span key={p.id}>
              <span style={{ color: `var(${p.accentVar})` }}>{p.indexCode}</span> <span className="text-paper">{l(p.title)}</span>
              <span className="text-ink-muted"> — {p.benchmarkMetric}</span>
            </span>
          )),
        );
      case "ls":
        return print(
          ...projects.map((p) => (
            <span key={p.id} className="tabular">
              <span className="text-[#b9b1f0]">{p.id}</span>{" "}
              <span className="text-lime">{p.status.padEnd(14)}</span> <span className="text-paper">{l(p.title).split(" — ")[0]}</span>
            </span>
          )),
        );
      case "inspect": {
        const p = projects.find((x) => x.id.toLowerCase() === arg.toLowerCase());
        if (!p) return print(err(`${t("terminal.unknownProject")} ${arg || "∅"}`), out(`${t("terminal.usage")} inspect VEL-001`));
        return print(
          <span className="text-paper">{l(p.title)}</span>,
          out(`${p.status} · ${p.stack.join(", ")}`),
          ...p.metrics.map((m) => (
            <span key={m.label.en}>
              <span className="tabular text-[#b9b1f0]">{m.value.padEnd(14)}</span>
              <span className="text-ink-muted">{l(m.label)}</span>
            </span>
          )),
          ...(p.links.liveDemo ? [out(p.links.liveDemo)] : []),
        );
      }
      case "lang": {
        const loc = LOCALES.find((l) => l === arg.toLowerCase());
        if (!loc) return print(err(`${t("terminal.usage")} lang <id|en>`));
        setLocale(loc);
        return print(out(`${t("terminal.langSet")} ${loc}`));
      }
      case "inspector":
        if (arg !== "on" && arg !== "off") return print(err(`${t("terminal.usage")} inspector <on|off>`));
        inspector.setEnabled(arg === "on");
        return print(out(`${t("terminal.inspectorSet")} ${arg}`));
      case "cta":
        print(out(`${t("terminal.jump")} #plan`));
        return jump("#plan");
      case "clear":
        return setLines([]);
      case "exit":
        return setOpen(false);
      default:
        return print(err(`${t("terminal.notFound")} ${cmd}`), out(t("terminal.welcome")));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Commands like `cta` close the drawer and hand focus back; without this the same Enter
      // would then activate whatever button regains focus.
      e.preventDefault();
      run(input);
      if (input.trim()) setHistory((h) => [...h, input]);
      setInput("");
      setCursor(null);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const up = e.key === "ArrowUp";
      const next = cursor === null ? (up ? history.length - 1 : null) : cursor + (up ? -1 : 1);
      if (next === null || next >= history.length) {
        setCursor(null);
        setInput("");
      } else {
        const clamped = Math.max(0, next);
        setCursor(clamped);
        setInput(history[clamped] ?? "");
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label={t("terminal.title")}
          className="fixed inset-x-0 top-0 z-[70] flex h-[min(62vh,540px)] flex-col border-b-4 border-violet bg-ink text-[14px] text-paper [font-family:var(--font-code)]"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={SPRING.drawer}
        >
          <div className="margin-x flex items-center justify-between bg-white/5 py-2 text-[13px] text-ink-muted">
            <span>
              {t("terminal.title")} · {t("terminal.hint")}
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("terminal.close")} className="p-1 hover:text-paper">
              <X size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div
            ref={scrollRef}
            className="margin-x flex-1 space-y-1 overflow-y-auto py-3"
            onClick={() => inputRef.current?.focus()}
            aria-live="polite"
          >
            {lines.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap break-words">
                {line.node}
              </div>
            ))}
            <label className="flex items-center gap-0">
              <span className="text-lime">velora</span>
              <span className="text-ink-muted">:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={t("terminal.input")}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-paper caret-lime outline-none"
              />
            </label>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
