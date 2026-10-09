# Addendum — de-service-reifen-und-raeder-winterreifen-html (page type: article)

Read `stardust/replica/briefs/archetype-brief.md` in full first; this file only adds what is specific to this archetype.

- SLUG=`de-service-reifen-und-raeder-winterreifen-html`
- LIVE=`https://www.amag.ch/de/service/reifen-und-raeder/winterreifen.html`
- PROTO=`http://localhost:8791/de-service-reifen-und-raeder-winterreifen-html-proposed.html`
  (the coordinator's node static server on :8791 is running, serving `stardust/prototypes/`; never stop it, never start a second server on that port)
- Captured content: `stardust/current/pages/de-service-reifen-und-raeder-winterreifen-html.{json,html}`; screenshot thumbs under `stardust/current/assets/screenshots/`.

## What the earlier archetypes already give you (cumulative — import, do not re-author)
- `stardust/prototypes/css/canon.css` + `stardust/prototypes/js/canon.js`: tokens, @font-face (4 AMAG faces), Bootstrap-4 grid subset, `#header` fixed bar + scroll morph + hide-on-scroll + mobile-nav open state, section shell (stepswrapper, container gutters), buttons/links, teaser carousel, service container, divider band, quote, icon list, accordion, direct-entry pill, footer (incl. app-download block). Read `stardust/replica/notes/canon-changes.md` for the history. The `promotionTeaser` module is duplicated in `css/en-html.css` and `css/en-services-html.css` — if this page uses it, move that block into canon.css (identical bytes) and note it in canon-changes.md. Modules that exist in `css/de-service-auto-services-online-termin-buchen-html.css` and are reused here are moved to canon the same way (identical bytes, logged).
- GERMAN CHROME, already authored and gated on the booking archetype: `stardust/replica/notes/de-service-auto-services-online-termin-buchen-html-chrome-header.html` and `-chrome-footer.html`. Reuse them; adapt only what differs on THIS page (compare with `html-slice.mjs <this html> '#header' --text` / `'footer' --text` against the booking page's captured HTML — typically only the language-switch hrefs and the active nav item). Note the deltas in your log.
- Known inherited canon deltas, already recorded on the earlier archetypes — do NOT spend iterations on them: ~7 header chrome-parity deltas @1440 (language switcher padding/chevron, desktop pop-up offset), ~160 deltas @360 all inside the hidden mobile-nav overlay. Everything else in the chrome must be quiet before a content pixel round. Note: on the booking page chrome-parity's footer root resolved to a hidden off-canvas `<footer>`; check the footer root resolves to the real footer here, otherwise verify the footer block-by-block with measure.mjs.
- Build scripts of the earlier archetypes are reusable patterns: `stardust/replica/notes/de-service-auto-services-online-termin-buchen-html-build.mjs`, `harvest-de-service-auto-services-online-termin-buchen-html.mjs`, `en-services-html-build.mjs` (copy and adapt to this slug; never edit the earlier ones).

## This archetype
- A service detail article (winter tyres: change, store or buy). Expect text sections, image/text teasers, accordions (FAQ), teaser carousel, CTAs into the booking flow, possibly a product/price module or dealer finder entry. Reconcile section and repeated-unit counts before authoring from the captured HTML with `html-slice.mjs … --all`. Content verbatim, German strings as captured.
- Dynamic rows for this page: `grep -n "winterreifen" stardust/dynamic-features.md`. Hydration placeholders / third-party embeds are replicated as captured and logged in `captureState[]`.
- Declare this page's repeated-unit families in `stardust/replica/units.json` (merge).
- Motion: after the static gate, `motion-observe.mjs` on live with pokes for the hamburger, accordion rows, carousel arrows and the language switcher as they exist on THIS page; implement only what fired; observe the prototype with the same pokes; `motion-compare.mjs`; one confirm pixel round per width.

## Browser budget (hard)
At most 3 Chromiums on this machine at once. Run the 1440 and 360 gate rounds as two `run-bg.mjs` jobs; never start `anchor.mjs`, `measure.mjs`, `chrome-parity.mjs`, `cap-probe.mjs`, `motion-observe.mjs` or your harvest script while a run-bg job is still running (`run-bg.mjs status` first). Finish with `run-bg.mjs wait` until nothing runs.

## Do not touch
`stardust/state.json`, `stardust/status.jsonl`, `stardust/journal.md`, `tools/**`, `stardust/.labs/**`, `DESIGN.*`, `PRODUCT.md`, project-root `scripts/`, `stardust/scripts/**`, the project-root `crop-diff.png`. The coordinator does the state/ledger/commit bookkeeping from your report and from `stardust/replica/progress.json`.
