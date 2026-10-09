# en-html — lifted token table (source: clientlib-amagch.css / clientlib-base.css, computed-styles 1440|360)

| token | 360 | 768 | 1200 (1440 gate) | 1450+ | source |
|---|---|---|---|---|---|
| --header-height (#header in-flow height) | 75px | 120px | 160px | — | :root @203978 |
| navbar row height | 75px | 121px | 100px (+60px violet benefit band) | — | .amag-header__navbar |
| logo box | 75×75, svg 48×17 | 90×120, svg 60×22 | 128×160, svg 66×24 | — | .amag-header__logoWrapper |
| section gutter (.amagCh-section__container .container padding) | 15px | 40px | 165px | 315px | @400495 |
| section top band (stepswrapper-before) | 80px | 80px | 120px | — | @400709 |
| section bottom padding | 80px | 80px | 120px | — | @399950 |
| content max | 1920px (.amagCh-section .container, footer, divider) | | | | @402493 |
| stage carousel | padding-top 133.33% (3:4), margin-top -75 | 56.25%, -121 | height 56.25vw max 800, -100 | — | @429386 |
| stage h1 | 32/36 displaybold | 32/36 | 54/60 | — | @442164 |
| stage linktext | textbold 20/30, 2px underline | | | | @443002 |
| stage buttons | 16px, padding 20px 0, gap 5px | 20/30, min-h 100, gap 30 | +padding-top 30 | — | @436755 |
| h2 section | displaybold 32 | 32 | 32 (dspSearch/promo/quote 44) | — | computed headings |
| h3 cards | displaybold 24 | 24 | 32 | — | computed headings |
| body/a/p | amag_textlight 16px; module copy 20/30 | | | | @204128 |
| topline | textlight 16/24, ls .06em, uppercase, #6f6d6a | | | | .amag-topline |
| CTA button | textbold 20, min-h 70, pad 0 40 | | min-h 100 | — | @311271 |
| promo card text pad | 34 40 40 | | 55 95 60 | — | @490094 |
| teaserS text pad | 34 39 40 | 34 40 40 | 51 60 40 (active 80 top) | — | @309750 |
| threeCol item | calc(100%+30px), mr 15 | calc(33.33%+15px), pad 0 15 | same | — | @297262 |
| service box pad | 40 | pl 30 | 60 | — | @403577 |
| serviceBox overlap | mt 30 | -215 | -230 | — | @406754 |
| divider | bg 56.39%, mb 375, content bottom -170 | 56.38%, 230, -130 | 27.78%, 180, -80 | pad 315 | @319857 |
| footer | pt 80, pb 160, pad 15 | pt 117, pad 39 | pt 115, pb 120, pad 165 | pad 315 | @244517 |
| brand logo tile | 90×120 | 90×100 | 93×90, bg #222, grid max 250 | — | @374338 |
| colours | violet #801977, dark-blue #172983, light-blue #009ee0, green #006431, grey-100 #f5f5f5, grey-300 #e8e8e8, grey-400 #bdbdbd, grey-600 #6f6d6a, grey-blue #e8eaf3 | | | | |
| fonts | amag_displaybold/amag_displaylight/amag_textbold/amag_textlight, all weight 400, self-hosted woff2 | | | | @197286 |
| header morph | toggle `amag-header__navbar--transparent` + `amag-header__beforeDivWhite--transparent` while pageYOffset < stage.clientHeight-100 | | | | clientlib-amagch.min.js |
| Bootstrap grid bps | sm 360 / md 768 / lg 1200 / xl 1920; gutters 15px | | | | base |
