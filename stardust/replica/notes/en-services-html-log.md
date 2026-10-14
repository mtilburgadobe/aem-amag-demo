## en-services-html — services overview recreated; 1440 passes the pixel bar (1.21%, Δh 0), 360 passes pixel (5.77%) with Δh +19 (canon footer), 2 🔴 = live content drift (2026-10-08)

| round | 1440 pixel | Δh | 🔴 | chrome | 360 pixel | Δh | 🔴 | chrome |
|---|---|---|---|---|---|---|---|---|
| iter1 (--full) | 31.53% | -654 | 200 | 44 | 43.48% | -868 | 200 | 186 |
| iter2 | 11.32% | 0 | — | — | 10.39% | +19 | — | — |
| iter3 (--full) | 1.21% | 0 | 200 | 9 | 5.77% | +19 | 200 | 172 |
| confirm (after motion JS) | 1.21% | 0 | 2 | 9 | 5.77% | +19 | 2 | 172 |

Fixes per round: iter2 — `<source width/height>` presentational hints were sizing the intro and promo images (`height:auto`, −504/−313 px), last direct-child module drops `amag-marginBottom` (−120), first section step band hidden <1200 (−80 @360), grey section tints lifted exactly, verbatim third maxi-teaser copy restored, garage chooser lists generated from the capture (200 🔴 → 0), canon: footer legal links + desktop pop-up <1200. iter3 — header hide-on-scroll ported (the fixed header had repeated in every stitched chunk: 11% → 1.2%), footer brand logos re-fetched (all nine were the Ducati bytes), direct-entry pill scroll logic. confirm — garage chooser modal implemented (motion: 5 parity / 1 third-party missing), garage CTA text verbatim (200 🔴 → 2).
Remaining: 2 🔴 live drift ("Carrosserie Center" vs captured "Centre Carrosserie" Gumefens), 360 Δh +19 from the canon footer, unit-geometry promo-teaser readings contradicting measure/pixel (logged for instrument review), chrome 9/172 inherited canon deltas.
Cap-probe PASS at 2560. Overflow ok, Clipped 0 at both widths.

## en-services-html — promo-teaser fix off the prototype table (2026-10-08 18:40)

- gate-all `--stage prototype` + unit-geometry + measure.mjs: `.amag-promotionTeaser__wrapper>a` was authored as `display:flex;flex-direction:column;height:100%` (live: inline, source has no such rule) → Bootstrap `.col-sm-12{flex:0 0 100%}` stretched the image column to the card height (270→686 px) and pushed the text panel one card-height down, hidden behind the next row / white-on-white (pixel gate under-counted it; Clipped 0). Rules removed from `css/en-services-html.css`; re-gated below.

| fix1 (--full, promo-teaser anchor fix) | 1.08% | 0 | 2 | 8 | 5.12% | 0 | 2 | 147 |

unit-geometry after fix1: off 6 at both widths = the six `picture` inline-box rows (false red, img rows within; recorded in gates/prototypes-<w>/overrides.json). Breadcrumb <1200 rule corrected to `:nth-last-of-type(2)` (same result on this 2-crumb page).
