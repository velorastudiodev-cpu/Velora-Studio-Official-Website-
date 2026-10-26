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
import { emit, isTyping, useVeloraEvent } from "@/lib/events";
import { LocaleEnum } from "@/lib/schemas";
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
  ["sync-demo", "terminal.help.sync"],
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
          <span key={i} className={i < 3 ? "block text-velora-lavender" : "block text-velora-pink"}>
            {row}
          </span>
        ))}
      </pre>
      <VeloraLogo variant="mark" height={44} className="hidden shrink-0 text-ink sm:block" />
      <span className="sr-only">{subtitle}</span>
    </div>
  );
}

const out = (text: string) => <span className="text-secondary">{text}</span>;
const err = (text: string) => <span className="text-velora-pink">{text}</span>;

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
      if (nextId.current === 0) print(<Banner subtitle={t("topbar.engine")} />, out(`VELORA ${t("topbar.engine")}`), out(t("terminal.welcome")));
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
        <span className="text-velora-pink">velora</span>
        <span className="text-muted">:~$ </span>
        <span className="text-ink">{raw}</span>
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
                <dt className="text-velora-lavender">{c}</dt>
                <dd className="text-secondary">{t(k)}</dd>
              </div>
            ))}
          </dl>,
        );
      case "pillars":
        return print(
          ...pillars.map((p) => (
            <span key={p.id}>
              <span style={{ color: `var(${p.accentVar})` }}>{p.indexCode}</span> <span className="text-ink">{l(p.title)}</span>
              <span className="text-muted"> — {p.benchmarkMetric}</span>
            </span>
          )),
        );
      case "ls":
        return print(
          ...projects.map((p) => (
            <span key={p.id} className="tabular">
              <span className="text-velora-lavender">{p.id}</span>{" "}
              <span className="text-online">{p.status.padEnd(14)}</span> <span className="text-ink">{l(p.title).split(" — ")[0]}</span>
            </span>
          )),
        );
      case "inspect": {
        const p = projects.find((x) => x.id.toLowerCase() === arg.toLowerCase());
        if (!p) return print(err(`${t("terminal.unknownProject")} ${arg || "∅"}`), out(`${t("terminal.usage")} inspect VEL-001`));
        return print(
          <span className="text-ink">{l(p.title)}</span>,
          out(`${p.status} · ${p.timeline} · ${p.stack.join(", ")}`),
          ...p.metrics.map((m) => (
            <span key={m.label.en}>
              <span className="tabular text-velora-lavender">{m.value.padEnd(14)}</span>
              <span className="text-secondary">{l(m.label)}</span>
              <span className="text-muted"> ({m.delta})</span>
            </span>
          )),
          <span className="text-secondary">
            {p.architecture.map((n) => `${n.label} [${n.latencyMs}ms]`).join(" → ")}
          </span>,
          ...(p.links.liveDemo ? [out(p.links.liveDemo)] : []),
        );
      }
      case "sync-demo":
        print(out(t("terminal.syncing")));
        jump("#projects");
        emit("velora:sync-demo");
        return;
      case "lang": {
        const parsed = LocaleEnum.safeParse(arg.toLowerCase());
        if (!parsed.success) return print(err(`${t("terminal.usage")} lang <id|en>`));
        setLocale(parsed.data);
        return print(out(`${t("terminal.langSet")} ${parsed.data}`));
      }
      case "inspector":
        if (arg !== "on" && arg !== "off") return print(err(`${t("terminal.usage")} inspector <on|off>`));
        inspector.setEnabled(arg === "on");
        return print(out(`${t("terminal.inspectorSet")} ${arg}`));
      case "cta":
        print(out(`${t("terminal.jump")} #cta`));
        return jump("#cta");
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
          className="fixed inset-x-0 top-0 z-[70] flex h-[min(62vh,540px)] flex-col border-b border-velora-purple bg-primary/95 font-mono text-[13px] backdrop-blur-md"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={SPRING.drawer}
        >
          <div className="mx-auto flex w-full max-w-[var(--grid-max)] items-center justify-between border-x border-b border-hairline px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-secondary">
            <span>
              {t("terminal.title")} · <span className="normal-case tracking-normal">{t("terminal.hint")}</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("terminal.close")} className="p-1 hover:text-ink">
              <X size={14} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div
            ref={scrollRef}
            className="mx-auto w-full max-w-[var(--grid-max)] flex-1 space-y-1 overflow-y-auto border-x border-hairline px-4 py-3"
            onClick={() => inputRef.current?.focus()}
            aria-live="polite"
          >
            {lines.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap break-words">
                {line.node}
              </div>
            ))}
            <label className="flex items-center gap-0">
              <span className="text-velora-pink">velora</span>
              <span className="text-muted">:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={t("terminal.input")}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-ink caret-velora-pink outline-none"
              />
            </label>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
