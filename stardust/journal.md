# Journal — amag.ch replica

## Extract — 5 planned pages captured live, brand surface authored (2026-10-08)

- Crawl (`crawl.mjs --pages … --dynamics`, headless, consent auto-dismissed): 5/5 pages captured,
  0 failures, every record `renderedBy: playwright`, `waitMode: medium`, 2500 ms, HTTP 200.
  Slugs: en-html, en-services-html, en-komponenten-car-dealers-html,
  de-service-auto-services-online-termin-buchen-html, de-service-reifen-und-raeder-winterreifen-html.
- Vision check (subagent on `thumb.mjs` thumbnails, offset slices for the three tall pages): 5 ok,
  0 suspect. Home hero is an image carousel; car-dealers is a full-viewport map with a search
  panel; termin-buchen is a text-only booking wizard (cssBackgrounds 0 is believable).
- Style census at 1440 and 360 → `_computed-styles.json`. Heading family amag_displaybold, body
  amag_textlight, buttons amag_textbold; primary #172983, secondary/hover #801977, radius 2px/4px.
- Fonts: four self-hosted woff2 files downloaded from the site's own clientlib
  (`assets/fonts/`); theme + base stylesheets saved under `assets/css/` for Phase 3 lifting.
- Logo: header inline SVG (`amag-header__logoImage`, viewBox 0 0 67 24) → `assets/logo.svg`;
  favicon.svg captured by the crawler.
- Cap probe over the 5 archetypes: contentMaxWidth 1920 (home, services), 1020 (booking tab
  content), 445 (dealer-search panel); shell fluid. Divergences are per-template design intent and
  are kept as-is (pure replica); listed in `DESIGN.json extensions.breakpoints.capRegister`.
- Page types (one archetype each): landing (en-html), program (en-services-html), unique
  (car-dealers map), form (termin-buchen), article (winterreifen). Typed `slots` added per page.
- Capture gaps: none (no locale root in scope — `/en.html` is a file path, not a root).
- Dynamic surface (reach): 11 same-site data endpoints, 5 hydrated pages, 0 search forms,
  19 third-party script hosts — triaged in Phase 2.

## Preserve direction — verbatim promotion, empty register, dynamics triaged (2026-10-08)

- Promoted `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json` byte-for-byte to the project root
  (`cmp` clean). No `--target-breakpoints`: source breakpoints (360/768/1200/1920) kept.
- `stardust/direction.md` written (PRESERVE mode); `stardust/replica/inconsistency-register.md`
  is empty — pure replica. Cap divergences between archetypes stay as captured.
- Dynamics: detector ran on the 5 archetypes (64 findings; 6/6 first-party booking APIs host-bound
  on the target), planner drafted against the preview origin; curated to 22 rows in
  `stardust/dynamic-features.md` (every row dispositioned) + `dynamic-features-plan.md`.
  Self rows: chrome overlays, hero carousel, accordions, garage modal, native selects, store
  snapshot. Owner batch: tags/consent/chat ids, booking + captcha + identity backends, map key,
  marketplace origin and locale wave — interim tiers ship, nothing decided-out.

## Recreate — five archetypes authored as clean HTML/CSS and gated at 1440/360 (2026-10-08)

- One standalone prototype per page type under `stardust/prototypes/<slug>-proposed.html`, each importing the
  shared `css/canon.css` + `js/canon.js` (tokens, 4 self-hosted AMAG faces, Bootstrap-4 grid subset, fixed
  header with scroll morph / hide-on-scroll / mobile drawer, section shell, buttons, teaser carousel, service
  container, accordion, direct-entry pill, footer) plus a per-archetype CSS/JS file. Canon history in
  `stardust/replica/notes/canon-changes.md`; every value lifted from the source clientlibs, never eyeballed.
- Gate results (pixel 1440 / 360, Δh, structural 🔴), hard cap 3 iterations per width:
  - `en-html` (landing): 30.45 % / 28.23 %, Δh −136 / −371, 4 🔴 (runtime video placeholders) —
    **pixel bar not reached**; residuals = hero slide capture state (live froze on video slide 4),
    vehicle-search block, promo heights. Recorded `gated-with-residuals`; the C-archetype unit of the
    rollout owns the next three fix rounds and the re-prototype decision.
  - `en-services-html` (program): 1.21 % / 5.77 %, Δh 0 / +19, residuals logged.
  - `en-komponenten-car-dealers-html` (unique): 0.26 % / 2.34 %, Δh 0 / +19; Google Maps kept as captured
    (`captureState`, restore = Maps embed at delivery); 🔴 = the map's runtime accessibility DOM.
  - `de-service-auto-services-online-termin-buchen-html` (form): 0.14 % / 0.65 %, Δh 0 / 0, 1 🔴 (hidden
    login modal role swap); booking wizard replicated as captured (host-bound OTV backend, owner batch);
    German chrome authored; canon footer fix closes the +19 @360 of the English pages (re-measured by the
    prototype table in the next phase).
  - `de-service-reifen-und-raeder-winterreifen-html` (article): 0.89 % / 3.66 %, Δh 0 / 0, 0 🔴; residual
    bands = live-only third-party fixed widgets (chat launcher, cookie button).
- Cap-probe PASS at 2560 on every archetype; overflow ok and Clipped 0 at both widths everywhere.
  Interaction parity observed on live and on each prototype (`stardust/replica/motion/`): header morph,
  drawer, accordions, direct-entry pill, brand dropdown, garage filter implemented; language switcher and
  third-party overlays dead or not replicated. Repeated-unit families in `stardust/replica/units.json`.
- All five pages advanced to `approved` (hands-off). Pending for the gate phase: the prototype table
  (`gate-all --stage prototype`) at 1440 and 360 — the row of record `gate-evidence.mjs` reads.

## Source-fidelity gate — prototype table at 1440 and 360, two defects fixed off the table (2026-10-08)

- `gate-all --stage prototype` over the five served prototypes, both widths → `stardust/replica/gates/prototypes-<w>/summary.md`
  (the row of record `gate-evidence.mjs` reads). Final tables, each width: booking PASS; services, garage finder and
  winter-tyres article PASS with a documented override (`overrides.json`); home FAIL on the pixel bar (23.84 % / 26.09 %,
  Δh −136 / −390 — the recorded recreate residual, owned by the rollout's C-archetype unit).
  Pixel / Δh per page: services 1.08 % / 5.12 %, Δh 0 / 0 · garage finder 0.23 % / 0.86 %, Δh 0 / 0 · booking 0.13 % / 0.42 %,
  Δh 0 / 0 · article 0.89 % / 3.66 %, Δh 0 / 0. Clipped 0 everywhere.
- Defects the table surfaced and the fix each got (both off the instruments, confirmed by `--full` rounds):
  1. Promo-teaser cards (services ×3, home ×9): the prototype gave the card anchor an invented flex-column layout; Bootstrap's
     `.col-sm-12{flex:0 0 100%}` then stretched the image column to the card height and pushed the text panel one card-height
     down, hidden behind the next row or white-on-white — the pixel gate under-counted it (thin text). Rules removed in
     `css/en-services-html.css` and `css/en-html.css`; services 1.21→1.08 % (1440), 5.77→5.12 % and Δh +19→0 (360, canon footer fix
     from the booking archetype); home 30.45→23.84 % / 28.23→26.09 %.
  2. Mobile breadcrumb (article, services): an invented `:first-of-type` rule showed the root crumb below 1200 px where live shows the
     parent crumb → `:nth-last-of-type(2)`; the unit-geometry MISSING link cleared, 3.66 % unchanged.
- Measurement policy recorded: (a) unit-geometry caches the live inventory per page without a width key — the first tables compared a
  360 inventory against a 1440 build (and vice-versa); caches are cleared before each width run (`progress.json.prototypeTable.unitCacheNote`).
  (b) Eight declared unit families are hidden at capture (dropdowns, modals, collapsed panels, off-canvas lists): the probe reports
  "no visible unit" and gate-all counts it as a FAIL even when advisory → removed from `units.json`, kept in
  `notes/units-hidden-families.json`; counts stay reconciled by content-diff. (c) Overrides, each with evidence: `<picture>` rows
  (live inline line box vs block in the build, `<img>` rows within, no paint consequence) on services and article; garage-finder rows
  inside the scrollable side panel read as hidden on the build only with identical rects, plus runtime store-locator data drift.

## Migrate plan — five archetypes on Path A, no siblings (2026-10-08)

- Scope is the five planned pages, each the gated archetype of its own template, so every page renders on Path A
  (approved prototype → `stardust/migrated/`); there are no sibling pages and therefore no render clusters to run
  after the rollout's archetype units. Page map: 5 entries, 0 collisions; outputs keep the URL-literal `.html` paths.
- Canon CSS: `stardust/prototypes/css/canon.css`. The dynamic surface was triaged in Phase 2 (`stardust/dynamic-features.md`),
  so the plan's precondition holds. Unit ledger: `stardust/migrate/progress.json` (plan done, `archetypes` render unit, report).

## Migrate render — five archetypes placed under stardust/migrated/ (2026-10-08)

- `migrate.mjs render` over the five approved slugs on Path A with `--canon-css stardust/prototypes/css/canon.css`: 5 rendered,
  0 refused. The first run refused all five on strict 2 (no `<main>`): the prototypes carried `header`, `div.amag-content`,
  `footer` as body children. Fix: a bare `<main>` wrapper around `div.amag-content` (the gate's content root), no CSS references
  it, so the rendering is unchanged; two prototypes (booking, garage finder) have an inner `<footer>` so the wrapper closes at
  the last top-level footer.
- Sidecars: `modules[]` set per page from DESIGN.json's module inventory (body modules only — header, footer, announcement bar
  and brand strip are foundation); `content-fidelity` declared from the Phase 4 content-diff; `gate-evidence.mjs` filled the
  measured gates. Internal links to pages outside the five-page scope are listed as `brokenInternalLinks` (not-in-inventory)
  and are repointed to the source site at the rollout's link audit. Unit `archetypes` done in `stardust/migrate/progress.json`;
  the `report` unit (state advance to migrated) runs after the published-origin gate.

## A-inventory — five pages, five templates, all pending (2026-10-08)

- `inventory.mjs --site-url https://www.amag.ch/ --state stardust/state.json` → `stardust/rollout/coverage/pages.json` (5 rows,
  all `pending`), `coverage/templates.json` (5 templates, one page each, the archetype is its own representative) and
  `rollout.json`. Site config filled: DA org `aemcoder`, site `65541681`, ref `main`, live host
  `main--65541681--aemcoder.aem.live` (preview host `.aem.page`).

## B-block — 17 distinct blocks, representative-first plan (2026-10-08)

- `blocks.mjs`: 17 distinct module blocks from the sidecars' `modules[]` (31 instances → 17 conversions; most reused: cta-band,
  image-text-card, pledge-row, promo-teaser ×3). Header, footer, announcement bar and brand strip are foundation, not blocks.
- `plan.mjs` → `stardust/rollout/plan.json`: each block converts on exactly one page. Booking (booking-wizard), garage finder
  (dealer-search) and the winter-tyres article (hero-split, breadcrumb, long-form-article, promo-teaser, image-text-card,
  pledge-row, cta-band, accordion-faq) are independent; the home page converts its seven own blocks and reuses five from the
  article; the services page reuses everything. That is the delivery order for the archetype units: article, booking and
  garage finder first, then home, then services.

## B2-dynamic — inventory re-verified against the preview origin before import (2026-10-08)

- `dynamics-plan.mjs` re-run with `--target-origin https://main--65541681--aemcoder.aem.live --migrated stardust/migrated`: 64 draft
  rows, self 17 / owner batch 36 / delivered 10 / host-bound 6/6 — identical to the Phase 2 curation, so the 22 curated rows and their
  dispositions stand. Verification note appended to `stardust/dynamic-features.md`. The pre-import gate for C-deliver is open.

## C-deliver unit foundation — chrome authored, deployed and published; frozen (2026-10-08)

- One foundation subagent authored `styles/`, self-hosted fonts, `scripts/scripts.js` locale resolution, the header and footer
  blocks (template-slotted, EW1–EW10) and the four chrome documents (`/nav`, `/footer`, `/de/nav`, `/de/footer`, each
  `Robots | noindex`), plus two in-scope shell stubs for the chrome gate; 6/6 documents live and published, lint clean.
- Main-agent gate on the published shell (`/en/services`) against the cached live captures: header band 1440 0.87 % PASS,
  360 0.38 % PASS (68 px band); footer bands 3.22 % / 11.67 % with the whole residue in live-only overlays (chat bubble, green
  side tab, "Services" direct-entry pill) — the footer chrome itself matches, Δh 0 at both widths. Chrome-parity 69 / 188
  deltas, each explained (shell page offset, at-rest hidden drawer menus, media signatures, p→a pairing).
- `foundation-freeze.mjs freeze`: 18 files. `@babel/core` recorded as a devDependency (lint needs it).

## C-deliver unit archetype-article — winter tyres article delivered, mobile row cleared by symmetric capture (2026-10-08)

- Resumed at fix round 1 of 3 (1440 8.52 % PASS, 360 24.28 % FAIL, Δh 129). Rounds 2–3 off `measure.mjs` at 360:
  promo-teaser image-left card width, breadcrumb list min-height, headline flow-root on long-form-article and
  pledge-row, tile media box, and a `cta-gap` section variant standing in for the empty paragraph the pipeline drops.
  1440 confirmation fell to 1.85 % / Δh 0, but 360 stayed at 22.88 % / Δh 134.
- Diagnosis (same-browser measure): gate-all shoots the origin in real Chrome (the `--headed` tier that clears
  Akamai) and the EDS side in bundled Chromium; the two binaries wrap the amag text face differently at 360, so
  nearly every paragraph gains a line on both pages — live 14875 px headed vs 14741 headless, preview the same.
  Fix in the instrument, not the blocks: `gate-all.mjs --same-browser` (project copy) shoots the EDS side in the
  origin's tier. Symmetric rows: **1440 1.11 % Δh 0 PASS, 360 4.17 % Δh 0 PASS**, clipped 0, content 0/0.
- Residual: the repeated-unit families (off 123 / missing 10 at 360) sit outside the four delivery criteria —
  chevron-only toggles without button text, narrower flex-item text boxes, frozen footer logos. One foundation
  request line filed (the capture asymmetry; affects every text-heavy template). C-final's `gate-all` runs with
  `--same-browser --recapture-eds` so every row is measured the same way.

## C-deliver cluster units article, booking, garage finder — empty by scope (2026-10-08)

- The run's fixed scope is five pages on five templates, so every template's cluster has zero sibling pages; the
  three clusters whose archetype units are done are recorded `done` with nothing to render, deploy or gate.

## C-deliver unit archetype-home — home page delivered with its autoplay stage (2026-10-08)

- One subagent authored seven blocks (hero-carousel, quick-links, vehicle-search, news-cards with a carousel variant,
  icon-feature-grid, newsletter-band, testimonial), reused pledge-row and accordion-faq with additive variants, and
  carried the prototype's residuals in from the first authoring (vehicle-search geometry, news-card heights, 360
  select rows) with `measure.mjs --against` before the first gate: 1440 every band Δy/Δh 0, 360 within 4 px.
- `/en` PUT → preview → live; 33 images with alt, ai-readability 100. Same-browser gate rows: **1440 4.92 % Δh 6,
  360 8.8 % Δh 41**, clipped 0. Content MISSING 1 at both widths is the autoplay stage headline (origin on slide 1,
  served carousel advanced at probe time): capture state, masked (60:800 / 0:480) and overridden in the sidecars.
- Residuals: unit families off 34/115 (instrument structure rows, rects 0 Δ); 360 Δh 41 from a live script-set
  strip min-height race; consent-gated stage videos (slides 4–5) ship as frame + overlay, their player ids were
  never captured. One foundation request (EN header benefit row / My garage toggle / language switcher).

## C-deliver unit archetype-services — services overview delivered on the reused encoder plus four new blocks (2026-10-08)

- One subagent delivered `/en/services` from the gated prototype: nine reused blocks used as authored (two
  additive variants appended — hero-split `spaced` for the +100 px intro margin, news-cards `grey band-white`)
  and four new blocks for the modules no block carried: icon-text-box (×12 items), service-offer, garage-chooser
  (Bootstrap-modal shell, 100 garages) and direct-entry (pill + pop-up). Motion implemented from the observed
  evidence: pill `.show` at scrollY ≥ 300, modal open/close with the 300 ms transform; three dead classes stay dead.
- PUT → preview → live; 33 media files, ai-readability 100, EW probe 365/365, block round-trips exit 0.
  Same-browser gate rows on the preview origin: **1440 1.18 % Δh 0, 360 5.22 % Δh 0** (confirmation round after
  the last CSS commit), clipped 0, content 0/0. One fix round (intro margin, icon-text-box link box 84/108).
- Residuals: unit-geometry false reds documented in `gates/all-<w>/overrides.json` (live inline `<picture>`
  boxes, badge offset, svg size, pledge title rows); at 360 the units probe pairs against the 1440 origin cache
  (instrument finding, one foundation-requests line); hidden pop-up 283 vs 259 px. Header chrome deltas are the
  EN foundation findings the home unit already filed.

## C-deliver cluster units home, services — empty by scope (2026-10-08)

- With the home and services archetype units done, their clusters are recorded `done` with zero sibling pages:
  the fixed five-page scope puts one page on each template. All five archetype and five cluster units are now
  done; what remains in C-deliver is the roster gate (`gate-all`) and the final unit.

## C-deliver unit gate-all — queued header requests applied, five pages gated on the published origin at both widths (2026-10-09)

- C-final opened with the freeze check (clean) and the queued foundation requests applied once by a foundation
  subagent: the EN and DE header utility rows now carry the live DOM shape (benefit links as `a > img + p`, the
  garage toggle and language tag as links); header band 1440 EN 0.75 % / DE 0.35 % (was 2.08 % DE), the named
  PAIR deltas 0, 360 header unchanged. Foundation re-frozen (commit 41cbd8f). The two instrument requests were
  closed by method: every row runs `--same-browser`, and the units probe's origin cache is kept per width.
- Roster gate (`gate-all --skip-existing --recapture-eds --same-browser`), 1440: booking 0.13 %, dealers 0.25 %,
  article 1.11 %, home 4.92 % (Δh 6), services 1.18 %; 360: 0.59 / 0.91 / 4.17 / 8.8 (Δh 41) / 5.22 %. Clipped 0
  everywhere; content 0 except the home stage headline (capture state, presence sidecar) and the dealers map
  attribution links at 360 (owner row). **5/5 delivered at both widths**: one clean PASS (booking) and four rows
  passing with documented overrides on the units criterion only.
- The first 360 pass showed units off on every page because the probe pairs the 360 build against the origin
  inventory cached from the 1440 run (same `origin.at`, desktop docH). Re-probed with per-width caches: booking
  and dealers 0 off; article/home/services keep inner structure rows (inline `<picture>` boxes, chevron-only
  toggles, byPosition footer logos) that the archetype units had already recorded — now in `overrides.json`
  beside the measured numbers. Coverage: 5/5 rows matched per width, gate.pass true, no status flips.

## C-deliver unit final — delivery closed: freeze clean, requests applied, five pages gated and published (2026-10-09)

- C-final's remaining bookkeeping: `foundation-freeze.mjs check` reports the foundation unchanged (18 files)
  after the header re-freeze; the four queued foundation requests are all closed (two header edits applied
  once in commit 41cbd8f and re-gated, two instrument findings closed by method: same-browser capture and
  per-width unit caches). Coverage reads 5/5 pages deployed and published with `gate.pass` true at 1440
  and 360 (booking 0.13/0.59 %, dealers 0.25/0.91 %, article 1.11/4.17 %, home 4.92/8.8 %, services
  1.18/5.22 %). Unit `final` recorded done; `C-deliver` ends with one start/end pair covering thirteen units
  (foundation, five archetypes, five empty clusters, gate-all, final). Next: rollout D-site (sitemap, robots,
  redirects sheet, root answer) through I-dashboard, then the handoff end after the runner's done-check.

## D-site — sitemap verified on the live origin, redirects sheet published, root answers (2026-10-09)

- `assemble.mjs` staged `site/{sitemap.xml,robots.txt,manifest.json}` (5 urls, 0 fragments in the canon dir);
  `--verify-origin` against the aem.live origin: served 5 = assembled 5, extra 0, missing 0 — the four chrome
  documents already carried `robots: noindex`, so none needed re-publishing.
- The source root 301s to `/de.html` (out of scope), so the sheet carries `/` and `/index.html` → `/en`, plus
  the five source `.html` paths → their extensionless delivered paths (`stardust/redirects.tsv`, 7 rows). A
  one-shot helper under `stardust/.work/rollout/probes/` PUT the sheet to DA (201) and previewed + published it
  (200/200). Verified on both origins: `/` → 301 `/en` → 200, every `.html` path → 301 → 200.

## D2-dynamic — parity report written and replayed green on the live origin (2026-10-09)

- `stardust/dynamics/parity.json`: 22 rows from the curated inventory — 15 with replayable checks (19 checks:
  dom-count on the header nav, hero carousel dots/controls, accordions, vehicle search, garage finder list
  (200 tel links), garage chooser (100 links), booking link-out + native dropdowns, account and fr/it links;
  click-dialog on the garage chooser; consent-gate on OneTrust, tag/pixel and chat hosts; no-page-errors over
  the five pages) and 7 without (captcha, injected iframes, brand assets, assistant hosts, newsletter,
  announcement bar, CDC slot — owner rows named, AEM runtime decided-out).
- First replay: 17/19. The garage chooser opened (dialog 1440 px, heading "Choose your AMAG garage") but read
  as still open after Escape: the block kept `role=dialog` + `aria-modal` on the closed modal (Bootstrap shape).
  Fixed in `blocks/garage-chooser/garage-chooser.js`: the closed modal carries `hidden` after its 300 ms fade
  and drops `aria-modal`; no visible change (`.modal { display: none }` already governed the closed state), so
  no re-gate. The dropdown row had a wrong selector (`.wizard-select` is the native control). Second replay
  after the code bus picked up the push: 19/19 PASS, 0 page errors, no third-party request before consent.

## E-full-site — five pages verified on the live origin, home carousel advances unpoked (2026-10-09)

- Gate tables re-applied to coverage (`update-coverage.mjs --gate` at 1440 and 360: 5/5 rows matched, 0 flips),
  then `verify.mjs --base https://main--65541681--aemcoder.aem.live --all`: checked 5 · 5 verified · 0 failed
  (200, no `about:error`, internal hrefs resolve, `delivery.gate.pass` true everywhere).
- Render check of the one `restoreAtDelivery` motion promise (home stage carousel) on the live origin at 1440,
  through a one-shot probe under `stardust/.work/rollout/probes/`: 6 slides, 6 dots, active slide 0 → 1 → 2 at
  t0 / 6.5 s / 11.7 s — slide 1 first, advancing every ~5 s without a poke. The other two capture-state
  entries are content promises (consent-gated video players, promo renditions) carried by the owner rows.

## E2-link-audit — 817 unique hrefs classified, 0 left to localize, out-of-scope targets repointed by decision (2026-10-09)

- Inventory over the five pages + four chrome documents on aem.live: 5 internal (the delivered pages, GET 200),
  187 hash/mailto/tel, 402 on the source origin, 223 other external (Google Maps, Webbosaurus reviews,
  amag-group, auto.amag.ch, social, app stores); none to localhost or the preview host.
- `localize-links.mjs --check` with the redirects sheet: PASS, 0 links still localizable; no www.amag.ch link
  targets an in-scope page. The source-host targets it lists are scope extension (dealer pages, locales,
  account, marketplace) and stay repointed — recorded as a named decision in `direction.md`, list in
  `stardust/rollout/link-audit.md`. No capture gaps in `state.json`.

## F-optimize — gate green: 0 P1, 5 P2 (JSON-LD), 1 informational parity row (2026-10-09)

- `optimize.mjs --base https://main--65541681--aemcoder.aem.live --all`: 5 pages + site checks, health 75/100
  (seo 100, ai-search 50; a11y and cross-page not assessed by the deterministic layers). Open P1 0 · P2 5 · P3 0.
  The five P2s are one check, `ai-search/jsonld`: no JSON-LD on any delivered page, while every source capture
  carries one `application/ld+json` block (`@type` Organization) — a platform-migration fix handed to G-aem.
- Source parity (informational, not scored): the winter-tyres `<title>` is 72 chars on the source too.
  GATE: no open P1 findings (exit 0).

## G-aem — JSON-LD restored in head.html; health 100/100, 0 open findings (2026-10-09)

- `autofix-aem.mjs --dry-run`: 5 candidates, all `eds-jsonld`, all marked manual (JSON-LD is placed through
  head.html, never through a content fixer). Every source capture carries one `application/ld+json` graph
  (Organization + WebSite, identical fields on all five pages apart from the per-page `url`/`@id`), so the
  fix is one site-wide block in `head.html` — the only place visible in raw EDS HTML, where the check reads.
- Payload: the source's Organization (name, alternateName, sameAs, description, founder, founding date and
  place, address, contact point) and WebSite (name, inLanguage) verbatim; `url`/`@id` on the live origin root
  per the direction.md repoint decision; `logo` → the published header logo (`/media_1cb6…b40b.svg`) because
  the source's DAM logo URL answers 404 on the source itself; the WebSite `SearchAction` (target `/en/suche.html`,
  an out-of-scope page and an owner-bound feature) is omitted rather than pointed at a 404.
- Code shipped with the push to `main` (cd9ef22); all five pages serve the block on aem.page and aem.live
  within one poll. `verify.mjs` on aem.live: 5 verified, 0 failed. `optimize.mjs --all` run-2: health 100/100
  (seo 100, ai-search 100), open P1 0 · P2 0 · P3 0, the five jsonld findings flipped to `fixed`; the title-length
  row stays informational (source parity). GATE pass.
- `head.html` is part of the frozen foundation; the freeze window closed at C-final, so the manifest was
  re-frozen after the edit (`foundation-freeze.mjs freeze`, 18 files, check clean) and the change is logged
  under foundation-requests.md § Applied after C-final.

## H-report — summary block written, six learnings filed (2026-10-09)

- `stardust/rollout/report.md`: pages 5 total · 5 verified · 0 pending/stale/failed; templates 5 (one page each,
  5/5 delivered); blocks 17/17 converted — the block rows had stayed `pending` through C-deliver because no step
  in the chain flips them, so they were flipped with `update-coverage.mjs --block … --status verified` first
  (filed as a learning); quality health 100/100, 0 open at any severity; pixel table prototypes 4/5 (the home
  prototype row is the autoplay-stage capture state; deployed home 4.92 / 8.8 %), deployed 5/5 (pixel-only 5/5,
  one clean row + four on the units override); to deliver: none; content-pending: 0.
- Dynamic parity table referenced from `stardust/qa/dynamics-report.md` (18/18 checks on the live origin) with the
  nine owner rows named; owner follow-ups listed (JSON-LD origin values, fonts licence, owner rows).
- `stardust/learnings.md`: six entries, all `pending` — same-browser capture default, per-width units cache,
  head.html JSON-LD fixer, block-row flips in the cluster chain, Escape poke in interaction parity, root redirect
  rule for page-scoped runs.

## I-dashboard — delivery dashboard built, five pages optimised (2026-10-09)

- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}` (self-contained, brand tokens from a
  migrated page). First build read optimised 4/5: the winter-tyres page carried the open P3 `seo/title-length`
  row, a source-parity finding (the source serves the same 72-character title). Resolved `accepted` through
  `findings.mjs` with the replica reason (captured content stays verbatim), health unchanged at 100/100.
- Second build: identified 5 · prototyped 5 · deployed 5 · optimised 5; blocks 17/17; severity 0/0/0.

## Handoff — run complete: five pages live, rollout A–I closed, done-check clean (2026-10-09)

- Rollout phases G-aem, H-report and I-dashboard closed in this session (JSON-LD restored in head.html, health
  100/100 with 0 open findings, report.md + six learnings, dashboard 5/5 optimised). The runner's done-check
  answered `complete: true, gaps: []`.
- Delivered: 5/5 pages published on `main--65541681--aemcoder.aem.live` and gated on the published origin at
  1440 and 360 (booking 0.13/0.59 %, dealers 0.25/0.91 %, article 1.11/4.17 %, home 4.92/8.8 %, services
  1.18/5.22 %; clipped 0; content 0 apart from the home stage capture-state row), redirects (7 rows), EN/DE nav
  and footer, sitemap, robots; dynamic parity 18/18 on the live origin; 9 owner rows and the domain-switch
  follow-ups listed in `stardust/rollout/report.md`.
