# Velora Studio Dev — working notes

Source spec: PRD-VELORA-ANTIGRAVITY-V2 (pasted in chat). Built phase by phase; owner reviews after each phase.

## Owner mandate
The owner explicitly allows deviating from the PRD when the result is better. Improvise, but state every
deviation and why in the phase report.

## Decisions so far
- `--text-muted` and new `--accent-text` token: PRD values failed its own WCAG gate (see globals.css comments).
- `motion` pinned to v12 (PRD), zod v4 (`z.email()`, `z.url()`).
- `<VeloraLogo />` renders the vector inline (theme-aware via currentColor) instead of `<img>`; files in
  `public/brand/` are the same geometry, used for favicon/external use.
- Project seed values not given by the PRD (timelines, node latencies, design specs) are estimates to confirm.
- Phase 3: projects renamed to the owner's real sites (Ikbar Barbershop, Ikbar Barbershop Dashboard,
  Dzikri Mount Guide). Locale + theme live in cookies (server renders the right one, no flash) instead of
  localStorage; first visit follows Accept-Language. Hero telemetry is measured live (edge RTT, rAF FPS,
  PerformanceObserver CLS, no-cors HEAD reachability of the live sites); nothing hardcoded.
- Redline Inspector is the signature feature (hero button + Alt+I). CLI is demoted out of the hero.
- Extra files beyond the PRD tree: src/app/providers.tsx, src/context/PillarFilterContext.tsx,
  src/components/ui/PillarBadge.tsx.
- Crosshair marks only render at >=1300px (they would hang off-screen otherwise).
- Phase 4: contact = WA 6285179854136 / velorastudiodev@gmail.com (src/data/contact.ts). CTA dispatch: WhatsApp
  (primary) + mailto need only name + notes; the API form needs the full Zod schema and only renders when
  RESEND_API_KEY is set (route returns 503 otherwise; optional INQUIRY_FROM for a verified sender).
  Cross-island actions go through window events (src/lib/events.ts). Command palette is cmdk inside our own
  motion modal (not cmdk's Radix dialog). Unit tests: `npm test` (tsx + node:test, src/**/*.test.ts).
- *.vercel.app is blocked by this cloud environment's network policy: no live-site screenshots or
  Lighthouse runs yet.

## Phase 5: full redesign (owner asked to leave the PRD look entirely)
- Run with the design-taste-frontend skill: direction "The pinned poster" (seed 1438855402), Archivo
  (wdth 62 for display), palette mapped from the brand instead of the dealt bubblegum/lime: neutral paper
  #F0F0EF, ink #0B0B0C, logo violet #5A4CC8 as a full field (never a tint), lime #DEF915 for the action only.
- Idea: the logo's two arms (outline + solid) = "Dari sketsa sampai server"; the hero reel goes from the
  wireframe to the built screen. Live thing: the plan configurator (solid squares = first release).
- Pictures are drawn plates (src/components/plates/Plates.tsx, data-ui roots) because the open image
  collections and *.vercel.app are unreachable here; replace with real screenshots when the owner sends them.
- Removed: telemetry hero, pillar matrix, token lab, ledger, theme toggle, grid lines, mono labels.
  Kept: CLI (~), Cmd+K, Alt+I inspector, blueprint calculator, /api/inquiry.
- Gate: taste lint 0 FAIL; inspect.mjs (CHROME_PATH needs a --no-sandbox wrapper as root) 0 FAIL,
  2 WARN (no real photos / no footage).

## Phase 6: real screenshots, performance, SEO
- Owner's screenshots live in /website-screenshots (git, not deployed); WebP crops in public/work/. The live
  sites differ from the PRD: VEL-001 is "DINASTI Barbershop" (Luragung, Kuningan; WhatsApp consultation, no
  online booking), VEL-002 a Google-sign-in admin dashboard (only its login is visible), VEL-003 "Dzikri
  Mountain Guide" on Ciremai (trip cost calculator, WhatsApp booking, 30% deposit). projects.ts follows the sites;
  PRD fiction (QRIS slot lock, chair schedule sync, Rinjani, +64% etc.) is gone.
- Zod no longer ships to the browser: enums in src/lib/enums.ts, seed data validated in src/data/data.test.ts.
  CLI/Cmd+K/Inspector load lazily (LazyOverlays). First load 205 → 179 kB.
- SEO: metadataBase from NEXT_PUBLIC_SITE_URL / VERCEL_PROJECT_PRODUCTION_URL (src/lib/site.ts), OG image
  (Archivo Narrow fetched at build, falls back to default font), robots, sitemap, JSON-LD, skip link;
  htmlLimitedBots: /.*/ keeps metadata in <head>.
- Lighthouse (prod build, local): desktop 100/100/100/100, mobile 96/100/100/100.

## Owner's live projects (wire in at the project-matrix stage)
- VEL-001 client web: https://ikbar-barbershop.vercel.app
- VEL-002 CMS dashboard: https://ikbar-barbershop-5rx3.vercel.app/dashboard
- VEL-003 porter platform: https://dzikri-mount-guide.vercel.app

## Gates (every phase)
`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build` — all must exit 0.
