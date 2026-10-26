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
  motion modal (not cmdk's Radix dialog). Unit tests: `npm test` (tsx + node:test, src/lib/utils.test.ts).
- *.vercel.app is blocked by this cloud environment's network policy: no live-site screenshots or
  Lighthouse runs yet.

## Owner's live projects (wire in at the project-matrix stage)
- VEL-001 client web: https://ikbar-barbershop.vercel.app
- VEL-002 CMS dashboard: https://ikbar-barbershop-5rx3.vercel.app/dashboard
- VEL-003 porter platform: https://dzikri-mount-guide.vercel.app

## Gates (every phase)
`npx tsc --noEmit` · `npm run lint` · `npm run build` — all must exit 0.
