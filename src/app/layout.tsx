import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { InspectorOverlay } from "@/components/grid/InspectorOverlay";
import { CommandMenu } from "@/components/interactive/CommandMenu";
import { TerminalDrawer } from "@/components/interactive/TerminalDrawer";
import { SystemTopbar, THEME_COOKIE, type Theme } from "@/components/sections/SystemTopbar";
import { LOCALE_COOKIE } from "@/context/LanguageContext";
import { LocaleEnum, type Locale } from "@/lib/schemas";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velora Studio Dev — Solo-Founder Design & Engineering System",
  description:
    "One principal architect across UI/UX design, website engineering, web development and software development.",
  icons: { icon: "/brand/velora-logo-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
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
  const theme: Theme = (await cookies()).get(THEME_COOKIE)?.value === "light" ? "light" : "dark";

  return (
    <html lang={locale} className={`${theme} ${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers locale={locale}>
          <SystemTopbar initialTheme={theme} />
          {children}
          <InspectorOverlay />
          <TerminalDrawer />
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
