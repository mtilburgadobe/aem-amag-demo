## en-komponenten-car-dealers-html — garage finder recreated; 1440 passes (0.26%, Δh 0, cap PASS), 360 passes pixel (2.34%) with Δh +19 (canon footer); 225/223 🔴 = Google-Maps runtime DOM + 1 live-drift heading (2026-10-08)

| round | 1440 pixel | Δh | 🔴 | chrome | 360 pixel | Δh | 🔴 | chrome |
|---|---|---|---|---|---|---|---|---|
| iter1 (--full) | 0.27% | 0 | 225 | 9 | 7.41% (0–500: 31.3%) | +19 | 223 | 163 |
| iter2 (--full) | 0.26% | 0 | 225 | 7 | 2.34% | +19 | 223 | 161 |
| confirm (after motion JS, --full) | 0.26% | 0 | 225 | 7 | 2.34% | +19 | 223 | 161 |

Fixes per round: iter2 — off-canvas footer texts ("All" / "Show garage" / "Close") were empty in the build (the `<span data-all-label>` attribute broke the lift regex) → chrome footer MISSING ×2 cleared; the 360 map capture was re-harvested with a fresh load at 360 (a resize from 1440 keeps Google's desktop center/zoom → 0–500 band 31.3% → 0.6%).
Map: runtime Google Maps kept AS CAPTURED (one element screenshot per breakpoint, overlay/pill hidden while shooting) — captureState, restoreAtDelivery = Maps JS embed. Content-diff reds are the map's accessibility DOM (100 marker aria-labels, transparent.png markers, zoom icons, Google links/buttons) + 1 live drift (live "AMAG Carrosserie Center Gumefens" vs captured "Centre Carrosserie"); visual flags = tiles vs capture image, intentional cover crop, canon GooglePlay badge.
Chrome: services header/footer reused (text identical; 3 language hrefs adapted). Inherited canon deltas: 7 @1440 header, 161 @360 mobile nav, Δh +19 @360 footer — same as the en-services round, not touched. Canon change: direct-entry pill CSS/JS moved from en-services files into canon (identical block on both pages; services numbers unaffected by construction).
Cap-probe PASS at 2560 (shell 445 fixed = live; module 610 off-canvas = live). Overflow ok, Clipped 0 at both widths.
Motion: live pokes garage row / Back to overview / Show filters. Only the filter button produced class mutations (.is-shown on the canvas box, body.no-scroll, reset .visible) → implemented in js/en-komponenten-car-dealers-html.js; header top .35s + pill .show come from canon.js. motion-compare 8 parity / 2 missing (OneTrust classes, dead) / 0 extra; confirm rounds returned to the gated numbers.
Instrument notes: unit-geometry at 360 confirm compared the 1440 live origin (830,536) against the 360 build (iter2 of the same build read within 1075 / off 4) and reports 3 selector errors on plain descendant selectors — logged for review. cap-probe reads the build root as `body` (live: div.amag-content) — advisory only, rows PASS.
Units: storelocator-garage-item ×100, storelocator-garage-modal ×100 [hidden], storelocator-brand-chip, filter-brand-checkbox ×7+7, filter-offer-switch ×3 (units.json).
