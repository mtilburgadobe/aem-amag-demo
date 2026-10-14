# en-services-html — lifted values (extends en-html-tokens.md; source clientlib-amagch.css @offset, computed-styles 1440|360)

Chrome: identical to en-html except the header is never transparent (no stage carousel: `amag-header__navbar--transparent` / `beforeDivWhite--transparent` / `afterDivWhite--transparent` absent in the captured DOM) and the language switcher links point to /de/service.html, /fr/services.html, /it/servizi.html. Footer identical.

| token | 360 | 768 | 1200 (1440 gate) | source |
|---|---|---|---|---|
| h1 introService__title | displaybold 32 / 38.4 (lh 1.2), mb 20 | 44 | 44 / 52.8 | @367641 |
| breadcrumb list | mt 20 mb 36; items hidden, chevron svg 32 (ml -7) only | mt 38 mb 74 | mt 0 mb 69, lh 1, items inline, "\|" separators, link #000 / last #6f6d6a | @283960 |
| introService row | image first (order-sm-0), text after; ratioWrapper -15/-15 100vw; imgWrapper pt 75% | pt 50%, -40/-40 | text col-lg-6, image offset-lg-1 max-w calc(41.667%+165px) mr -165, pt 75% | @367914 |
| introService marginBottom | 100 | 100 | 100 | @367184 |
| otvCta | mt 48; button wrapper mt 41 (-15/-15 100vw <768) | | mt 48 / 41 | @368857, @1907828 |
| rich text (.cmp-text) | h4 displaybold 24/28; p 20/30; b displaybold | | same | @508808 |
| iconTextBox | bg #fff, mx 15, pad 40 40 29; h2 24/28; items mt 31, icon 40, h5 displaybold 20/24 mt 20 | pad 40 40 26, items mt 29, h5 mt 25; col-md-4 | pad 57 95 52; h2 32/36; items mt 33; h5 mt 20 | @348440 |
| serviceOffer | content pt 26 pb 31; text col-sm-9 offset-md-1; p 20/30; icon 32 col-sm-3 | | pt 54 pb 50; p 24; headline textbold, price #6f6d6a; bg #e8e8e8 | @411546 |
| maxiTeaserBild | mb 45; content column, bg #f5f5f5; description pad 80 0 0 40; headline displaybold 32; text 20 mb 37; btn 100 tall full width row-reverse | description pad 80 40 0; btn 290 wide, column icon/text | content row; image flex 0 0 45% object-fit cover; description row pad 110 15 110 65; btnWrapper flex 0 0 300; btn absolute right 0 width 260 (hover 300) | @377243, @383983 |
| gozilla button | textbold 20 #fff, icon 31 svg | column | | @375927 |
| promotionTeaserBox | mb 105; intro mb 46; h2 32; topline 16 #6f6d6a; teaser mb 20; textWrapper pad 34 40 40; h3 24 | mb 75; teaser mb 40; col-md-6 | mb 107; intro mb 42; h2 44; h3 32/38.4; pad 55 95 60; logo wrapper left 110 | en-html.css (shared module) |
| section --grey | container bg #f5f5f5; stepswrapper :after/.right #f5f5f5, :before/.left transparent; `.background-color-grey` band + :before #f5f5f5 | | | @398659, @400873 |
| section-description | theme topline col-md-3, headline col-md-9 displaybold 32 | | 32/38.4 | canon |
| iconList | 3 × col-md-4; icon box sky-blue rounded-sm (3.2px) | | | canon @ iconListItem |
| kontaktaufnahme | h2 displaybold 32/36; intro pt 20, p 20/30; garageElection pt 36, -15/-15 100vw; button col-md-6 col-lg-4 width 100%; mb 120 | button pl-md-0, pad 15 | h2 44/48; intro pt 17 | @371999, @1619178 |
| direct-entry (fixed) | button bg #e8e8e8 r100 h60 max-w 150 pad 0 18 right 15 bottom 38, opacity 0 until `.show`; pop-up 300 wide r4 bottom 118 | right 24 bottom 48 / 128 | same | @1594829 |
| garage chooser modals (2) | `.modal.fade` → display none (captured hidden) | | | Bootstrap |
| images | intro: Scene7 4_3_Medium 690×518 webp (sizes 610px); maxi: w380_h380 / mobile_1by1 jpg; promo: Scene7 2_1_Medium 768×384 webp (sizes 630px); divider: w1440_h400 / w360_h203 png | | | harvest currentSrc |
