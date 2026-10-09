# en-komponenten-car-dealers-html — lifted values (garage finder; adds to en-html-tokens.md / en-services-html-tokens.md)

Source: clientlib-amagch.css — storelocator legacy block @469242, storelocator-component block @1929428 (later → wins same-specificity ties), off-canvas @1546892. Live geometry (harvest, 2026-10-08): notes/en-komponenten-car-dealers-html-live-geometry.json.

| token | 360 | 768 | 1200+ | note |
|---|---|---|---|---|
| storelocator height | calc(100vh − 75px) = 725 @800vh | calc(100vh − 120px) | calc(100vh − 160px) = 740 @900vh | `.storelocator`, `.storelocator-inner`; component/inner overflow:auto |
| inner layout | flex column (map, overlay) | block | block | |
| map | 100vw × 100vw (360) | 100% | 100% (1440×740) | Google Maps runtime; kept as capture |
| overlay (shell cap) | relative, 100% | absolute right:40 bottom:0 w:330 h:calc(100%−40px) | right:165 w:445 h:calc(100%−100px) = 640 | #fff, flex column, z 1000 |
| search title | display-bold 32/36, margin 30px 15px | margin 40px | margin 40px | h3 weight 500 (Bootstrap) |
| search container | border-bottom 1px #000, pb 5, mb 40, w calc(100%−30px) | w calc(100%−40px) | w calc(100%−80px) = 365 | field text-light 20/30 pad 6/12 color #6f6d6a → 48px row |
| filter container | margin 0 15px 30px | 0 40px 40px | 0 40px 40px | button text-bold 20/30, svg 32 (size-xl) → 32px row |
| garage list | block, overflow-y auto (visible at 360 — later block overrides legacy display:none) | h calc(100%−150px) | h calc(100%−165px), flex-shrunk to 364 | n = 100 |
| garage item | pad 21 15 18 | 21 20 18 | 21 40 18 | 227px tall; bg alternates #f5f5f5 / #fff inline |
| garage name | text-bold 20/30 #172983, pr 60 | pr 0 | pr 55 | flex space-between; distance text-light 16/24 |
| address/zip | text-light 16/24 #222; zip mb 20 | | | |
| brand chips | #e8e8e8, r 2, text-light 16/24, pad 5 10, margin 2.5 | | | mb 20 |
| phone/route | text-bold 16/24 #000, svg 24 #222 mr 10; phone mr 36 | | | inline-flex |
| open chevron | abs right 11 | 16 | 36 | fill #172983 |
| detail modal | [hidden] ×100 | | | abs #fff z 1000 (opened by JS) |
| off-canvas (module cap) | fixed right −345 max-w 345 | right −610 max-w 610 | 610 | aside; backdrop #000 .5 z 1040 |
| off-canvas lower | pad 20 15 15, sticky | 30 50 20 | | confirm 70px r2 dark-blue |
| direct-entry pill | fixed right 15 bottom 38 | right 24 bottom 48 | | opacity 0 until scrollY ≥ 300 (canon) |
| footer | identical to en-services (text diff empty) | | | |
| header | identical except language hrefs (/de/komponenten/storelocator.html, /fr/composants/amag-garage.html, /it/componenti/ricerca-garage.html) | | | |
