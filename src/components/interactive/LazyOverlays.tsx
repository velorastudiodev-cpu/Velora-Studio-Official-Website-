"use client";

import dynamic from "next/dynamic";

// Keyboard-only extras (CLI, command menu, inspector): fetched after hydration, never in the first load.
const InspectorOverlay = dynamic(() => import("@/components/grid/InspectorOverlay").then((m) => m.InspectorOverlay), { ssr: false });
const TerminalDrawer = dynamic(() => import("./TerminalDrawer").then((m) => m.TerminalDrawer), { ssr: false });
const CommandMenu = dynamic(() => import("./CommandMenu").then((m) => m.CommandMenu), { ssr: false });

export function LazyOverlays() {
  return (
    <>
      <InspectorOverlay />
      <TerminalDrawer />
      <CommandMenu />
    </>
  );
}
