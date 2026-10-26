"use client";

import { useEffect, useRef } from "react";

// Cross-island actions (CLI, command menu, topbar) without a global store.
export type VeloraEvent = "velora:sync-demo" | "velora:terminal" | "velora:command" | "velora:theme";

export function emit(name: VeloraEvent) {
  window.dispatchEvent(new Event(name));
}

export function useVeloraEvent(name: VeloraEvent, handler: () => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const fn = () => ref.current();
    window.addEventListener(name, fn);
    return () => window.removeEventListener(name, fn);
  }, [name]);
}

/** True when the keystroke belongs to a text field, so global shortcuts stay out of the way. */
export function isTyping(e: KeyboardEvent) {
  const el = e.target;
  return el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}
