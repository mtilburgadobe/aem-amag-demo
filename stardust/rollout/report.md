# Rollout report — https://www.amag.ch/ → aem-eds (2026-10-09)

```
rollout — https://www.amag.ch/ → aem-eds
==================================================
Pages       5 total · 5 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   5 (home 1/1 · services overview 1/1 · garage finder 1/1 · online booking 1/1 · service article 1/1)
Blocks      17 total · 17 converted · 0 pending   (plus the foundation blocks header, footer, fragment, widget)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0   (fixed this run: P2 5 — JSON-LD; 1 informational source-parity row: title length)
Pixel table prototypes 4/5 PASS · deployed 5/5 PASS (pixel-only 5/5) — gates/{prototypes,all}-1440/summary.md
To deliver  — none
Content     0 pages awaiting content track
```

Scope: the five pages fixed in `stardust/.labs/site-plan.json`; every page is published on
`https://main--65541681--aemcoder.aem.live` with its redirects (`/`, `/index.html` and the five source `.html`
paths), the EN and DE nav/footer documents, the sitemap and robots.txt.

## Published-origin gate (same-browser rows, gates/all-<w>/summary.json)

| Page | 1440 pixel | 360 pixel | Δh 1440/360 | Clipped | Content | Verdict |
|---|---|---|---|---|---|---|
| /de/service/auto-services-online-termin-buchen | 0.13 % | 0.59 % | 0 / 0 | 0 | 0 | PASS |
| /en/komponenten/car-dealers | 0.25 % | 0.91 % | 0 / 0 | 0 | 0 (map attribution links at 360 = owner row) | PASS (units override) |
| /de/service/reifen-und-raeder/winterreifen | 1.11 % | 4.17 % | 0 / 0 | 0 | 0 | PASS (units override) |
| /en/services | 1.18 % | 5.22 % | 0 / 0 | 0 | 0 | PASS (units override) |
| /en | 4.92 % | 8.8 % | 6 / 41 | 0 | 1 MISSING = autoplay stage headline (capture state, presence sidecar) | PASS (units override) |

The four overrides are on the repeated-unit criterion only (inline `<picture>` boxes, chevron-only toggles,
footer logo wrappers, the autoplay stage slide); the pixel, height, clip and content criteria are measured and
reported unmasked beside each row (`gates/all-<w>/overrides.json`).

Prototype table (Phase 4, gates/prototypes-<w>/summary.json): booking, dealers, article and services pass the
pixel bar (0.13–1.08 % at 1440, 0.42–5.12 % at 360). The home prototype row reads 23.84 % / 26.09 % because its
autoplay stage was captured on a later slide than the served initial slide; the deployed home page passes at
4.92 % / 8.8 %.

## Dynamic parity

`stardust/qa/dynamics-report.md` (replayed on the live origin): 18 checks over 23 features, 18 pass, 0 fail —
header drawer, hero carousel (autoplay, dots, controls), accordions, vehicle search link-out, garage finder list,
garage chooser modal (opens, Escape closes), booking wizard link-out and native dropdowns, consent gates (no
third-party request before consent), 0 page errors on the five pages. Owner rows (`stardust/dynamics/parity.json`):
tag manager and pixels, OneTrust consent, chat, booking backend, captcha, identity/login, map API key for the new
host, vehicle marketplace origin, fr/it locales.

## What's missing

Nothing in scope. Owner follow-ups when the final domain is wired: the JSON-LD `url`/`@id`/`logo` values in
`head.html`, the owner rows above, and the licensed AMAG fonts (self-hosted woff2 as captured — confirm the
licence covers the new origin).
