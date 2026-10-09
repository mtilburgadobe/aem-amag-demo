# Addendum — de-service-auto-services-online-termin-buchen-html (page type: form)

Read `stardust/replica/briefs/archetype-brief.md` in full first; this file only adds what is specific to this archetype.

- SLUG=`de-service-auto-services-online-termin-buchen-html`
- LIVE=`https://www.amag.ch/de/service/auto-services-online-termin-buchen.html`
- PROTO=`http://localhost:8791/de-service-auto-services-online-termin-buchen-html-proposed.html`
  (the coordinator's node static server on :8791 is running, serving `stardust/prototypes/`; never stop it, never start a second server on that port)
- Captured content: `stardust/current/pages/de-service-auto-services-online-termin-buchen-html.{json,html}`; screenshot thumbs under `stardust/current/assets/screenshots/`.

## What the earlier archetypes already give you (cumulative — import, do not re-author)
- `stardust/prototypes/css/canon.css` + `stardust/prototypes/js/canon.js`: tokens, @font-face (4 AMAG faces), Bootstrap-4 grid subset, `#header` fixed bar + scroll morph + hide-on-scroll, section shell (stepswrapper, container gutters), buttons/links, teaser carousel, service container, divider band, quote, icon list, accordion, direct-entry pill, footer. Read `stardust/replica/notes/canon-changes.md` (6 lines) for the history. The `promotionTeaser` module is duplicated in `css/en-html.css` and `css/en-services-html.css` — if this page uses it, move that block into canon.css (identical bytes) and note it in canon-changes.md.
- Chrome markup templates: `stardust/replica/notes/en-services-html-chrome-header.html` and `-chrome-footer.html` (English). THIS PAGE IS GERMAN: its `#header` and `<footer>` carry German strings and locale hrefs. Author the chrome markup for this page from ITS captured HTML (`html-slice.mjs <html> '#header' --text`, `'footer'`), keeping the same structure/classes the English chrome uses so canon.css styles it unchanged. Save your German chrome as `stardust/replica/notes/<slug>-chrome-header.html` / `-chrome-footer.html` for the article archetype that follows (also German).
- Known inherited canon deltas, already recorded on the earlier archetypes — do NOT spend iterations on them: ~7 header chrome-parity deltas @1440 (language switcher padding/chevron, desktop pop-up offset), ~161 deltas @360 all inside the hidden mobile-nav overlay, footer Δh +19 @360. Everything else in the chrome must be quiet before a content pixel round.
- Build scripts of the earlier archetypes are reusable patterns: `stardust/replica/notes/en-services-html-build.mjs`, `harvest-en-services-html.mjs` (copy and adapt to this slug; never edit the earlier ones).

## This archetype
- A service page with an online booking entry (form). The booking backends are host-bound and dispositioned to the owner batch in `stardust/dynamic-features.md` (read only the rows matching this page: `grep -n "auto-services-online-termin" stardust/dynamic-features.md`). Recreate the form statically AS CAPTURED: same fields, labels, placeholders, native selects, buttons and hrefs; no submission wiring. Hydration placeholders / iframes are replicated as captured and logged in `captureState[]`.
- Reconcile section counts before authoring (accordion rows, teaser cards, steps) from the captured HTML with `html-slice.mjs … --all`.
- Declare this page's repeated-unit families in `stardust/replica/units.json` (merge).
- Motion: after the static gate, `motion-observe.mjs` on live with pokes for the hamburger, accordion rows, carousel arrows and the language switcher as they exist on THIS page; implement only what fired; observe the prototype with the same pokes; `motion-compare.mjs`; one confirm pixel round per width.

## Browser budget (hard)
At most 3 Chromiums on this machine at once. Run the 1440 and 360 gate rounds as two `run-bg.mjs` jobs; never start `anchor.mjs`, `measure.mjs`, `chrome-parity.mjs`, `cap-probe.mjs`, `motion-observe.mjs` or your harvest script while a run-bg job is still running (`run-bg.mjs status` first). Finish with `run-bg.mjs wait` until nothing runs.

## Do not touch
`stardust/state.json`, `stardust/status.jsonl`, `stardust/journal.md`, `tools/**`, `stardust/.labs/**`, `DESIGN.*`, `PRODUCT.md`, project-root `scripts/`, `stardust/scripts/**`. The coordinator does the state/ledger/commit bookkeeping from your report and from `stardust/replica/progress.json`.
