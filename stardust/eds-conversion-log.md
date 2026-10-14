# EDS conversion log — amag.ch replica

## Publish decision (recorded 2026-10-08)

Decision: **publish**. Every delivered page, the redirects sheet and the chrome documents
(nav, footer and their locale variants) go live on the aem.live origin
(`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).
The decision was made before the run started; no one is asked again.

Preview origin: https://main--65541681--aemcoder.aem.page/
Scope: the 5 pages selected in `stardust/.labs/site-plan.json` (fixed for this run).

## online booking (archetype unit) — `de-service-auto-services-online-termin-buchen-html`

Page `/de/service/auto-services-online-termin-buchen` (page type form), block `booking-wizard` (new).
Decode tier: **template-slotted** — the OTV wizard is one fixed composition (step bar + first
pane); `decorate()` rebuilds the prototype's `#amag-otv` inner DOM as empty slot containers and
MOVES the authored nodes by role (rows classified by content, never by index). No repeat group
needs reconstruction: the step list and the brand options are authored `<ul>`s moved whole.
`section-schema.mjs` found 1 schema section (the prototype has no `<section>` elements); the
round-trip is mapped with `--map booking-wizard=#otv-tab--1-content` (the captured visible pane).

Decisions:
- Title tag: the live pane title is an `<h2>` and the page has no visible `<h1>`; the content
  authors `<h1>Ihr Fahrzeug</h1>` (one `<h1>` per page) styled at the captured 32/38.4 → 44/52.8.
- Hidden panes 0–4 (Leistung … Buchung, incl. 86 garages), the login modal, the off-canvas and
  the pane's `d-none` error/notification strings are NOT authored: host-bound backend states
  (dynamic-features.md row 8, host-bound 6/6), hidden on live, zero visible difference.
- Link-out (row 8 interim): "Weiter zur Leistung" → `https://www.amag.ch/de/service/otv.html`
  (the site's own booking entry), "Anmelden" → `https://www.amag.ch/de/user/login.html` (row 11:
  account links keep the source origin). Live has both as JS handlers without href.
- Model select hidden as captured (one placeholder entry = backend-fed); brand dropdown opens,
  closes on outside click, option pick floats the label (observed + native-control row 9).
- reCAPTCHA badge: captured 70×60 image as a CSS background on an aria-hidden element inside the
  block (capture state; row 10 "not loaded"). Served from `blocks/booking-wizard/`.
- Content cap: the live wizard pane caps at 1020px (DESIGN.json capRegister, `#amag-component-
  tab_tab-content`); `qa-gate` compares against the site-wide 1920 and fails — accepted, the
  build equals the source (replica cap-probe 1020 = 1020). Harness-only fails also accepted:
  31 chrome images (anonymous `content.da.live` 401 on the harness) and the fixed header bar
  measuring h=0 — both frozen foundation, both judged on the preview origin instead.
- davids-model-lint D3 🟡: the two select rows carry 3 cells (label | options | message) while the
  other rows carry 1 — a container-shaped block, kept.
- Lint: clean (`no-descending-specificity` disabled at file top, as the frozen header does).

## garage finder (archetype unit) — `en-komponenten-car-dealers-html`

Page `/en/komponenten/car-dealers` (locale en → `/nav` + `/footer`), prototype
`stardust/prototypes/en-komponenten-car-dealers-html-proposed.html`, one block `dealer-search`
(convert; reuse none). Section schema `stardust/eds-schema/en-komponenten-car-dealers-html.json`
sees one `<section>` only (the off-canvas inner container: 22 items, 2 brand lists + 3 offer items,
7 editable) — the locator itself is a `div` composition, so the tier is decided per part:
- **Template-slotted** (fixed composition): the locator frame (map captures, search title, search
  field, filter trigger), the off-canvas filter panel (head / type switch / brand lists / offers /
  footer) and the "Directly to" pill — `decorate()` holds the prototype DOM as empty wrappers and
  MOVES the authored nodes in by keyed row (`map`, `title`, `search`, `filter`, `filters-*`,
  `quick-links`).
- **Reconstructive** (repeat groups): the garage list (`garage` rows, n = 100) and the garage detail
  modals (`details` rows, n = 100, `[hidden]` at rest), classified by content (tel / mailto / maps /
  badge URL / `strong>a` CTA), paired by name with order as the fallback. Fingerprint group
  (`filter-selection-button` active vs inactive) reproduced as `.is-active` on the first switch.
- Decisions: the live page has NO `<h1>` (101 `<h3>`); the lead heading "Search garage" is authored
  as the page `<h1>` (gate: exactly one h1), the 100 modal titles stay `<h3>`, "All filters" stays
  `<h4>` as live. Keyed first cells and the 100 rating-badge URLs are declared `@ew-exempt`
  (metadata / embed source). The favourite-star tooltip (`title` attribute, 100×) is dropped —
  attribute-only text. The two "Sales / Service" switch buttons were EMPTY at capture (data-fed) and
  ship empty; the filter panel body stays `d-none` as captured (the brand filter data is an owner row
  6); the Google Maps canvas (row 5, owner: map API key) ships as the two captured images.
- Implemented behaviours (self rows 5/7 + observed motion): filter trigger → off-canvas `.is-shown`
  + `html.overflow-hidden` + reset `.visible`; garage click → detail modal (`hidden` toggle, badge
  iframe `src` from `data-src`), "Back to overview"/Escape closes; client-side search over the
  authored rows; pill `.show` at scrollY ≥ 300 (50 px hysteresis) with pop-up toggle. Page scroll
  lock uses the frozen foundation's `html.overflow-hidden` instead of live's `body.no-scroll`
  (same effect, keeps the block CSS scoped).
- Media: 21 files on DA scope `dealers` (2 map captures, 14 brand logos, trash icon, 5 pill icons;
  SVGs verified pure-vector). Links to not-yet-migrated targets (100 dealer sites, booking, test
  drive) stay on `https://www.amag.ch/…` (row 16 boundary); `localize-links --check` PASS.
- davids-model-lint 🟡 D10/D3: keyed heterogeneous rows (2–6 cells) — a container-shaped interactive
  block, kept. D4: the 6 SVGs are pure vector (checked).

## service article (archetype unit) — de-service-reifen-und-raeder-winterreifen-html (2026-10-08)

Decode tiers (schema `stardust/eds-schema/de-service-reifen-und-raeder-winterreifen-html.json`, 8 unnamed prototype sections):
- `hero-split` — template-slotted (fixed composition: breadcrumb slot, h1, OTV CTA + service time, 4:3 image); adopts the preceding `breadcrumb` wrapper.
- `breadcrumb` — template-slotted (one authored `<ul>`; mobile shows chevron + parent crumb, replica fix1).
- `promo-teaser` — reconstructive (one row per card; variants `image-left lavender band-white` on this page).
- `long-form-article` — reconstructive, content-typed rows (rich text / fact boxes / icon tiles / text image / CTA); section head reabsorbed from default content (EW8). Instances: sections 3, 4 (`grey narrow-cta`), 6 (`grey band-white`), 8.
- `image-text-card` — reconstructive (one row per maxi teaser, gozilla arrow generated).
- `pledge-row` — reconstructive (one row per pillar; head reabsorbed; `band-grey`).
- `cta-band` — template-slotted (h2 + p + single CTA; garage-election width).
- `accordion-faq` — reconstructive (head row + Q/A rows; EW7 chevron-only toggle, click on the header row).
Section shell: every block is full-bleed (`<name>-bleed-wrapper`) and paints its ground (`grey`/`lavender` variants), the 80/120 px top band (auto `band` on the section's first wrapper; `band-white`/`band-grey` left colour) and the 80/120 px bottom padding (auto `section-end`).
Deliberate drops / decisions: the 5 hidden garage-chooser modals (500 rows, `.amag-garageOverlay`, schema repeat ×100 per section) are a host-bound dynamic feature (dynamic-features-plan row 7) and are not authored; the two "Garage kontaktieren" CTAs (live `href="javascript:void(0)"` opening that modal) link to the garage finder `/de/komponenten/storelocator` (migration decision). The direct-entry pill (`.amag-direct-entry`) is site chrome owned by no block and stays a known footer-band residue. Heading levels: promo h3→h2, benefit/tile/pledge sub-headlines h5→h3, FAQ questions h2→h3 (no outline jumps; visual styling unchanged). `davids-model-lint` 🟡 D1 rows (hero-split, cta-band, breadcrumb, long-form-article prose rows) are genuine bespoke widgets (layout + CTA treatment), kept as blocks. qa-gate harness: 31 "broken images" = auth-gated content.da.live media, header h=0 = chrome not served on the harness (known limitations); the "≥100 units" rows are the dropped garage modal.
Media: 14 files on `media/article/` (ledger `stardust/deploy/media-ledger-archetype-article.json`); the hero and promo renditions are the captured webp sources (the live `<img src>` was a dam.amag-group.ch placeholder).

Delivery (archetype-booking, 2026-10-08): `/de/service/auto-services-online-termin-buchen` PUT → preview →
live (deploy-batch, 1/1). Published-origin gate on the preview URL: 1440 pixel 0.54 %, Δh 0, clipped 0,
content MISSING 0 / HIDDEN 0, units off 0 — PASS; 360 pixel 1.06 %, Δh 0, clipped 0, content 0, units off 0
— PASS. Fix rounds: 1 (step labels authored as the captured inert tab links → content-presence parity;
benefit bullets li > p; unit families `otv-wizard-step`, `otv-benefit-item`, `footer-brand-logo` gained the
delivered EDS selector as a selector-list alternative in `build` — `unitsFor` resolves eds = build).
Tooling notes: gate-all selects pages by `status: deployed` + `liveUrl`, which `state.mjs` never writes —
ran with `--state stardust/.work/rollout/archetype-booking/probes/gate-state.json`; the unit probe's origin
cache (`stardust/current/measure/<slug>-units.json`) ignores the width, so the 360 run compared against the
1440 inventory until the cache was set aside (both widths now kept as `-units-1440.json` / `-units-360.json`,
the 1440 one restored as default). Chrome bands: header 1440 2.08 % (foundation request filed), footer 1440
0.42 %, header 360 0.34 %, footer 360 0.87 %. Chrome-parity 1440: 57 deltas (header 18: DE benefits row
text offset, sr-only tool labels, rehosted icon signatures; footer 39: live footer root = the wizard's hidden
off-canvas footer, 0 live texts pairable — known for this page).
- Delivered 2026-10-08: `/en/komponenten/car-dealers` PUT → preview → live (deploy exit 0). `.plain.html`
  200, 1 h1, 0 about:error, 0 /img/, 22 img / 22 alt (no `<body>` wrapper — standard EDS plain output).
  ai-readability strict 100 / code 100. Computed-style guard: 2 sections, block decorated, map 1440×740,
  overlay 445 px at x 830 (= live). Pre-gate fix: the garage action row is an inline formatting context
  (live unit 227 px; flex gave 220). Harness qa-gate fails accepted as harness-only (anonymous
  content.da.live images 401, fixed header h=0, the 445 px overlay read as the "cap").
- Published-origin gate (gate-all, derived `--state` with the page as deployed): 1440 pixel 0.56 %
  (text 7.53 %), Δh 0, clip 0, content MISSING 0 / HIDDEN 0 → PASS; 360 pixel 1.29 % (text 5.95 %), Δh 0,
  clip 0, content MISSING 2 / HIDDEN 0. Residuals: (a) 360 MISSING 2 = the Google Maps runtime attribution
  links ("Google" → /maps, "Terms") inside the live canvas — owner row 5 (map API key), the map ships as
  the captured image; (b) the `units` row fails on both widths because `stardust/replica/units.json`
  `storelocator-garage-item` / `storelocator-brand-chip` build selectors name the prototype DOM
  (`.storelocator__garage`): 100 / 179 origin matches, 0 served matches — instrument selector, the 100
  garages render (measure: 100 `.garage`, 220→227 px); (c) chrome-parity 1440 59 deltas (header 18,
  footer 41) — inherited foundation chrome (foundation logged 69). Crop bands: header 1440 1.95 % / 360
  0.34 %, footer 1440 0.48 % / 360 1.29 % — all PASS (≤ 2 %). Fix rounds 0 / 0. EW probe: dead 0, dup 0,
  Δh 0, edit-mode drift 202 texts (not inspected — lean budget).
- chrome-parity 360: 178 deltas (header 153, footer 25) — inherited foundation chrome (foundation logged 188).

## home page (archetype unit) — en-html (2026-10-08)

Decode tiers (schema `stardust/eds-schema/en-html.json`, 7 unnamed prototype sections; module → block
mapping decided from the prototype DOM + `stardust/replica/units.json` families):
- `hero-carousel` — template-slotted slide (one row per slide: 16:9 picture | 3:4 picture | h1/h2 +
  link p | indicator label p); autoplay 5 s / 1 s opacity, arrows ≥ 1200, hidden pause/play, dots
  (replica captureState promise). Slides 4–5 are video stages: the live players are consent-gated
  embeds whose ids/placeholder copy were never captured → player frame + overlay only (recorded).
- `quick-links` — reconstructive tile row (icon | link p; EW6 card-as-link).
- `vehicle-search` — template-slotted panel; pickers = authored `<ul>` lists shown/hidden by CSS
  (first li = value; single-option list = disabled); dynamic-features row 4: ships as captured, CTA
  links out to auto.amag.ch (em → violet secondary).
- `news-cards` — reconstructive; default = the AMAG NEWS promotion tiles (`.amag-promotionTeaser`
  ×9, colour word cell = ground, first 4 shown, "Show more" row reveals the rest); `carousel`
  variant = the two `.amag-contentTeaserS` strips (3-up, arrows + derived counter). Section heads
  (eyebrow/h2/h4) are default content reabsorbed (EW8). The sidecar's `promo-teaser` /
  `image-text-card` modules were these two strips (migrate mis-labelled them: units.json shows no
  `maxi-teaser` on /en) — the article's `promo-teaser`/`image-text-card` blocks are NOT placed here.
- `icon-feature-grid` — reconstructive (band image row, 3 icon boxes, primary CTA row); head
  reabsorbed; < 768 renders box 1 + derived "1/3" counter like the live swipe carousel.
- `newsletter-band` — template-slotted image divider; used for BOTH `.amag-divider` bands
  (newsletter: em CTA; jobs: strong CTA) — same unit family (`divider-band` ×2), so one block; the
  article's `cta-band` is not placed on /en.
- `testimonial` — template-slotted quote (CSS curly quotes).
- reused as authored: `pledge-row` (h2 default content reabsorbed, 3 icon rows), `accordion-faq`
  (4 Q/A rows; the live h2 + intro p are default content above the block — the reused head row
  carries only icon + heading).
Deliberate drops: hidden promo cards 5–9 have no captured image (live lazy-loads them; 1×1
placeholder) → authored without image; the duplicate hidden dspSearch filter copy; the empty
hidden caption-item tab lists. Media: 28 files on `media/home/` (ledger
`stardust/deploy/media-ledger-archetype-home.json`); the 3 quick-link and 3 pledge icons are the
prototype's inline SVGs saved as files.
Round-trip (block-roundtrip --ew, prototype sections mapped with --map since the prototype has
unnamed `section.section`s): every block closes with 0 structural 🔴 except `vehicle-search`, whose
🔴 rows are ALL `javascript:void(0)` anchors inside the prototype's `display: none` select2
duplicate filter (`.amag-dspSearch__filter.d-flex`: every brand/model option of the host-bound
marketplace search, dynamic-features row 4) — the classifier does not test visibility and the
duplicate shares its parent with the visible panel, so no mapping selector can exclude it. The
visible panel (icon, h2, intro, 4 pickers with the captured option lists, "Find vehicles" CTA) is
authored verbatim; the hidden option anchors are not CTAs and are not authored (recorded exception).
Advisory 🟡 kept: hero mobile renditions double the img count (two pictures per slide), the derived
"1/3" counter of icon-feature-grid (< 768 only), hidden "Pause"/"Play" labels of the live carousel.
(The whole-page run's `MISSING CTA "Find vehicles"` is the hidden duplicate's second copy of the
same link — the visible one matches; `--json` inventories: proto 2 × "Find vehicles", EDS 1.)
Pre-gate geometry (measure.mjs live --against preview, unit-hook selectors, 1440 + 360, 3 rounds): the
prototype's vehicle-search paddings (icon/headline 81/29 px) do not exist on live (search panel 284 px
at 1440 / 686 px at 360, now exact); the live carousel items carry script-set `min-height` 488 / 428 px
on both strips at both widths (replicated per instance via the `no-band` / `section-end` classes); the
WELCOME section has no top band (`no-band` variant); the services band image renders 1110×400
(stretched, `object-fit: fill`), boxes carry 15 px padding ≥ 768 and all three render in the overflow row
< 768 behind a 70 px counter; quick-links bleed −15 px; the live 8 px h2 margins survive via flow-root
heads. Reused blocks (after the article unit's DONE): `pledge-row.plain-head` (single-h2 head, 97 px items
margin zeroed as on live's last child) and the accordion intro rules on `.section.accordion-faq-container
.default-content-wrapper` — both additive, inert on the article page. Result: 1440 every band dy 0 / Δh 0;
360 Δh +4 px (carousel head rounding).
Published-origin gate sidecars (`stardust/replica/gates/all-{1440,360}/`): `masks.json` en-html masks the
stage band only (60:800 @1440, 0:480 @360) — the live autoplay carousel froze on slide 4 (video teaser)
in the origin capture while the build starts on slide 1 (captureState promise; the content-presence
MISSING h2/link of that slide have the same cause); `overrides.json` en-html documents the unit-geometry
false reds (stage slides = capture state; live inline tile anchor/picture boxes vs served block boxes at
0 tile delta; foundation footer `<picture>` wrappers; reused pledge title box). Pixel/height/clip/content
stay measured and reported beside the override.
Published-origin gate (gate-all, derived `--state`, `--same-browser` so both sides render in the origin's
real-Chrome tier — the bundled-Chromium served capture wrapped text differently at 360): 1440 pixel 4.92 %
(text 10.5 %, stage band masked), Δh 6, clip 0, content MISSING 1 / HIDDEN 0 (+3 control state), units
off 34 hidden 6 missing 16 → FAIL (elements) with documented override; 360 pixel 8.8 % (text 11.78 %,
stage masked), Δh 41, clip 0, content MISSING 1 / HIDDEN 0, units off 115 hidden 6 missing 16 → same.
The MISSING 1 is the stage headline of whichever autoplay slide each side showed at probe time (h1 "The
new VW ID. Polo" on the origin, slide 2+ served) — capture state, documented in presence/masks/overrides;
the 360 Δh 41 is the first teaser strip's live script-set min-height (444 in that render vs natural 403);
units: structural rows of the instrument (inline live boxes, foundation <picture> wrappers, reused pledge
title box), every unit rect dx/dy/dw/dh 0 at 1440. Fix rounds at the origin: 2 (carousel controls moved
out of the clipping strip + tile anchor at natural height + stage slides display:none; strip min-heights
scoped to ≥ 1200). Chrome bands (gate captures): header 1440 — only the opaque benefit bar 0–60 is
judgeable (1.04 %), the nav floats over the capture-state hero; header 360 0.49 %; footer 1440 2.63 %,
360 8.96 % (per-side offsets 9515/9509, 10297/10256 verified by sweep) — live-only chat bubble + message
card + cookie pill overlays, footer structure/text identical. chrome-parity: 1440 71 deltas (header 20,
footer 51), 360 189 (header 154, footer 35) — inherited foundation chrome (foundation request filed for
the EN header benefit row / "My garage" box / language switcher).

## en-services-html (archetype unit)

Page `/en/services` ("Services overview", archetype `services`), schema `stardust/eds-schema/en-services-html.json`
(4 sections), fingerprint `stardust/.work/rollout/archetype-services/probes/style-fingerprint.json`. Decode tiers:
- Section 1 (white, first): `breadcrumb` + `hero-split` (reused, article) — template-slotted; the intro copy
  (h4 + 2 p) rides `long-form-article`'s rich-text branch (reused, article) — template-slotted.
- Section 2 (white, band white): NEW `icon-text-box` (reconstructive, one row per item ×12, head row;
  item-as-link via a link inside the h5, EW6); NEW `service-offer` (template-slotted, strip-as-link);
  `image-text-card` ×3 (reused, article) — reconstructive. The live empty rich text (two blank paragraphs,
  92 px) between the offer strip and the teasers is encoded as the strip's bottom margin (112 px = 20 + 92).
- Section 3 (grey, band white): `news-cards` ×3 (reused, home) with ADDITIVE variant `grey band-white`
  appended at the end of news-cards.css; the live "Show more" button is hidden (3 tiles < 4) — not authored.
- Section 4 (white, band grey): `pledge-row band-grey` (reused, article; head as default content) +
  `cta-band` (reused, article) whose CTA links `#garage-chooser`.
- Section 5: `newsletter-band` (reused, home) — template-slotted.
- Section 6 (zero flow height): NEW `garage-chooser` (reconstructive, one row per garage ×100 + head row;
  Bootstrap-modal shell, opened by `a[href$="#garage-chooser"]`, 300 ms dialog transform, body.modal-open)
  and NEW `direct-entry` (template-slotted pill + pop-up; `.show` at scrollY ≥ 300, 50 px hysteresis).
- Dropped on purpose (capture state, display:none and unreachable on live): the hero's cookie variant
  ("YOUR SAVED GARAGE") and its second garage overlay (otv.html#id links); the hidden "Show more" button.
- Media: 33 files under `media/services/` (ledger `stardust/deploy/media-ledger-archetype-services.json`).
- Publish decision applied: preview + live (deploy-batch without --no-publish).
- Local QA residue (harness only, not pixel-shaped): qa-gate reports the content.da.live images as broken
  (anonymous harness fetch, same as the home unit's run), `header` h=0 (harness chrome), `garage-chooser`
  and `direct-entry` h=0 (fixed chrome by design — zero flow height) and the schema units rows mapped onto
  hero-split (all four schema sections are named "section"; the first expects the hero's hidden garage
  overlay ×100, dropped on purpose). block-roundtrip --ew per block exit 0 (mapped to the prototype
  modules), whole page exit 0, ew-editability-probe exit 0 (365/365 editable). davids-model-lint 0 red
  (D1 on the template-slotted blocks, D3 head row vs item rows in icon-text-box / direct-entry).
- Published-origin gate (preview, --same-browser): 1440 pixel 1.18 % (text 1.93 %) Δh 0 clip 0 content 0;
  360 pixel 5.22 % (text 5.48 %) Δh 0 clip 0 content 0. Fix round 1: hero-split `spaced` (+100 px intro
  margin, page −100 px at both widths before), icon-text-box link box 84/108 like live. Units rows: see
  gates/all-<w>/overrides.json (false reds; 360 origin from the 1440 cache — instrument finding filed).

## Site assembly — redirects sheet and root answer (2026-10-09)
- The source root `https://www.amag.ch/` 301s to `/de.html`, a page outside this run's five-page scope, so the
  sheet carries `/` and `/index.html` → `/en` (the delivered landing page) instead of a root `index` document.
- `stardust/redirects.tsv` (7 rows: root, index.html and the five source `.html` paths → their extensionless
  delivered paths) is wired into `/redirects.json` on DA (PUT source 201, preview 200, live 200).
- Verified on aem.page and aem.live: `/` → 301 `/en` → 200; every `.html` source path → 301 → 200. Chrome
  documents (`/nav`, `/footer`, `/de/nav`, `/de/footer`) carry `robots: noindex`; the served sitemap lists
  exactly the 5 delivered pages (assemble `--verify-origin` exit 0).

## AEM autofix — structured data (2026-10-09)
- The five delivered pages lacked the `application/ld+json` graph every source page carries (Organization +
  WebSite). Restored as one site-wide block in `head.html`: source fields verbatim, `url`/`@id` on the live
  origin root (direction.md repoint decision), `logo` → the published header logo because the source's DAM logo
  URL is a 404 on the source itself, the out-of-scope `SearchAction` omitted. Owner follow-up when the final
  domain is wired: replace the origin root in the three `url`/`@id` values and the `logo` URL.
- Re-verified on aem.live: 5/5 pages render, health 100/100, 0 open findings at any severity.
