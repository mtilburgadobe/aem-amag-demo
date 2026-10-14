## en-html — landing/home recreated; 3 iterations per width, pixel bar not reached (hero capture state + vehicle-search/promo geometry), chrome at 1440 quiet to 7 deltas (2026-10-08)

| round | 1440 pixel | Δh | 🔴 | chrome | 360 pixel | Δh | 🔴 | chrome |
|---|---|---|---|---|---|---|---|---|
| iter1 | 33.39% | -500 | 23 | 261 | 30.45% | -733 | 33 | 272 |
| iter2 | 28.36% | -136 | 4 | 66 | 28.53% | -371 | 4 | 186 |
| iter3 | 30.45% | -136 | 4 | 44 (header 7) | 28.23% | -371 | 4 | 186 (all in hidden mobile nav) |
| confirm (after motion JS) | 30.45% | -136 | 4 | 44 | 28.23% | -371 | 4 | 186 |

Fixes per round: iter2 — asset paths mirrored to source basenames (−19 🔴/width), `.amagCh-section__container>.container>div:last-child .amag-marginBottom{margin-bottom:0}` (−424 px), navbarRight/garage/language geometry, `.amagCh-carousel` full-bleed margins, mobile nav overlay off-canvas; iter3 — desktop notification pop-up taken out of flow (was eating 753 px of the header row → nav wrap), after-filler basis 0.
Remaining: hero slide capture state (live froze on video slide 4), vehicle-search block +81 px @1440, contentTeaserS row-1 −62 px, 360 dspSearch/promo heights (−371 px), 2 runtime-injected video placeholders (4 🔴, permanent).
Cap-probe: PASS at 2560. Overflow: ok both widths. Clipped: 0 both widths. Motion: 9 parity / 11 missing (6 third-party or transition-only).
Infrastructure: coordinator server :8791 was dead (python getfqdn crash in stardust/.work/replica/http.log); gates ran against a node static server on :8792 (stardust/replica/notes/en-html-serve.mjs), stopped by PID at the end.

## en-html — promo-teaser fix off the prototype table (2026-10-08 18:40)

- gate-all `--stage prototype` + unit-geometry + measure.mjs: `.amag-promotionTeaser__wrapper>a` was authored as `display:flex;flex-direction:column;height:100%` (live: inline, source has no such rule) → Bootstrap `.col-sm-12{flex:0 0 100%}` stretched the image column to the card height (270→686 px) and pushed the text panel one card-height down, hidden behind the next row / white-on-white (pixel gate under-counted it; Clipped 0). Rules removed from `css/en-html.css`; re-gated below.

| fix1 (--full, promo-teaser anchor fix) | 23.84% | -136 | 4 | 44 | 26.09% | -390 | 4 | 167 |

Promo text now painted inside the cards (−6.6 points @1440). Remaining: hero slide capture state, vehicle-search block, contentTeaserS/serviceBox geometry (units off 50 @1440) — C-archetype rounds.
