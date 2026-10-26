import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Velora Studio Dev: dari sketsa sampai server";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Archivo Narrow as a static TTF: Satori reads neither WOFF2 nor variable fonts, so the page's own Archivo
 * (wdth 62) cannot be used. Falls back to the default face if Google Fonts is unreachable at build.
 */
async function narrow(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@700", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

// The link preview (WhatsApp, LinkedIn, X): the hero's two halves around the logo mark, in brand colours.
export default async function OpengraphImage() {
  const [mark, font] = await Promise.all([readFile(join(process.cwd(), "public/brand/velora-logo-mark.svg"), "base64"), narrow()]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b0b0c", color: "#f0f0ef" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={`data:image/svg+xml;base64,${mark}`} width={110} height={90} alt="" />
          <div style={{ fontSize: 34, letterSpacing: 2 }}>VELORA STUDIO DEV</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Narrow", fontSize: 150, fontWeight: 700, lineHeight: 0.9, letterSpacing: -2 }}>
          <div>DARI SKETSA</div>
          <div style={{ color: "#def915" }}>SAMPAI SERVER</div>
        </div>
        <div style={{ fontSize: 30, color: "#a9a9a6" }}>Website, dashboard & aplikasi untuk bisnis. Satu orang, dari desain sampai kode.</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Narrow", data: font, weight: 700 }] : [] },
  );
}
