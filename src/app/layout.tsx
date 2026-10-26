import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google"; // taste-skill-ignore: mono is for the CLI only
import { cookies, headers } from "next/headers";
import { InspectorOverlay } from "@/components/grid/InspectorOverlay";
import { CommandMenu } from "@/components/interactive/CommandMenu";
import { TerminalDrawer } from "@/components/interactive/TerminalDrawer";
import { LOCALE_COOKIE } from "@/context/LanguageContext";
import { LocaleEnum, type Locale } from "@/lib/schemas";
import { Providers } from "./providers";
import "./globals.css";

// One variable family: the wdth axis gives the condensed poster cut and the normal text cut.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Only the CLI uses a monospace face: it is a real terminal.
const geistMono = Geist_Mono({ // taste-skill-ignore: real terminal
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velora Studio Dev: website & software, dari sketsa sampai server",
  description:
    "Velora Studio Dev merancang dan membangun website, dashboard, dan aplikasi untuk bisnis. Satu orang, dari desain sampai kode.",
  icons: { icon: "/brand/velora-logo-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F0F0EF",
};

/** Saved choice first, then the browser's preferred language; Indonesian when neither says. */
async function resolveLocale(): Promise<Locale> {
  const saved = LocaleEnum.safeParse((await cookies()).get(LOCALE_COOKIE)?.value);
  if (saved.success) return saved.data;
  const accept = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  return accept === "" || accept.startsWith("id") || accept.startsWith("in") ? "id" : "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();
  const fonts = `${archivo.variable} ${geistMono.variable}`; // taste-skill-ignore: the mono variable serves the CLI only

  // suppressHydrationWarning: the inline script adds "js" before React hydrates.
  return (
    <html lang={locale} className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers locale={locale}>
          {children}
          <InspectorOverlay />
          <TerminalDrawer />
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
