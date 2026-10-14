<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-08T19:04:03.760Z · input stardust/current/_dynamics.json (5 pages, 64 findings) · target probe https://main--65541681--aemcoder.aem.live · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-cdns-eu1-gigya-com | A | unknown third-party host cdns.eu1.gigya.com | 5/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-unknown-third-party-host-bzrcdn-openai-com | A | unknown third-party host bzrcdn.openai.com | 4/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 4/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-accdn-lpsnmedia-net | A | unknown third-party host accdn.lpsnmedia.net | 4/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-alb-reddit-com | A | unknown third-party host alb.reddit.com | 4/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-bzr-openai-com | A | unknown third-party host bzr.openai.com | 4/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-sdk-frontnow-app | A | unknown third-party host sdk.frontnow.app | 2/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-unknown-third-party-host-amag4-frontnow-app | A | unknown third-party host amag4.frontnow.app | 2/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 12 | a-first-party-api-get-de-service-auto-services-online-termin | A | first-party API GET /de/service/auto-services-online-termin-buchen.otvgarages.html | 1/5 (reach 1/5) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 13 | a-first-party-api-get-de-service-auto-services-online-termin | A | first-party API GET /de/service/auto-services-online-termin-buchen.amagch-get-public-holidays.html | 1/5 (reach 1/5) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 14 | cr-client-rendered-slot-js-select2-select2-hidden-accessible | CR | client-rendered slot js-select2 select2-hidden-accessible | 2/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-js-cdc-container-cdc-content-gigya-s | CR | client-rendered slot js-cdc-container cdc-content gigya-style-modern | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 5/5 (reach 5/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 17 | d-first-party-data-file-get-libs-cq-i18n-dict-en-json | D | first-party data file GET /libs/cq/i18n/dict.en.json | 3/5 (reach 3/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 18 | d-first-party-data-file-get-bin-amagch-storelocator-stores-j | D | first-party data file GET /bin/amagch/storelocator.stores.json | 2/5 (reach 1/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 19 | d-first-party-data-file-get-bin-amagch-storelocator-synonyms | D | first-party data file GET /bin/amagch/storelocator.synonyms.json | 2/5 (reach 2/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 20 | d-first-party-data-file-get-libs-cq-i18n-dict-de-json | D | first-party data file GET /libs/cq/i18n/dict.de.json | 2/5 (reach 1/5) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 21 | f-form-protection-captcha-antibot | F | form protection: captcha / antibot | 5/5 | rebuild-native | needs-backend | delivered-by-capture | forms | production backend (vendor form id + field mapping) | output already carries "www.google.com" |
| 22 | f-form-gigya-profile-form-no-action-js-wired-6-fields | F | form "gigya-profile-form" → no action (JS-wired) (6 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 23 | f-form-gigya-otp-update-form-no-action-js-wired-1-fields | F | form "gigya-otp-update-form" → no action (JS-wired) (1 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 24 | f-form-gigya-register-form-no-action-js-wired-7-fields | F | form "gigya-register-form" → no action (JS-wired) (7 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 25 | f-form-gigya-reset-password-form-no-action-js-wired-1-fields | F | form "gigya-reset-password-form" → no action (JS-wired) (1 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 26 | f-form-gigya-profile-form-no-action-js-wired-2-fields | F | form "gigya-profile-form" → no action (JS-wired) (2 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 27 | f-form-gigya-passwordless-login-form-no-action-js-wired-1-fi | F | form "gigya-passwordless-login-form" → no action (JS-wired) (1 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 28 | f-form-gigya-login-form-no-action-js-wired-3-fields | F | form "gigya-login-form" → no action (JS-wired) (3 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 29 | f-form-gigya-register-form-no-action-js-wired-9-fields | F | form "gigya-register-form" → no action (JS-wired) (9 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 30 | f-form-manualinputform-no-action-js-wired-11-fields | F | form "manualinputform" → no action (JS-wired) (11 fields) | 1/5 | rebuild-native | needs-backend | delivered-by-capture | forms | production endpoint; interim capture ships now | output already carries "_charset_" |
| 31 | f-form-photouploadform-no-action-js-wired-2-fields | F | form "photouploadform" → no action (JS-wired) (2 fields) | 1/5 | rebuild-native | needs-backend | delivered-by-capture | forms | production endpoint; interim capture ships now | output already carries "_charset_" |
| 32 | i18n-locale-variants-de-fr-it-en | I18N | locale variants de,fr,it,en | 5/5 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.amag-group.ch/de/energy-und-" |
| 33 | m-modal-trigger-nav-link-hasoverlay-chrome-only-target-outsi | M | modal trigger nav-link--hasOverlay (chrome only) → target outside DOM at capture | 4/5 | rebuild-native | self | delivered-by-capture | chrome-interaction | none (motion-observe evidence) | output already carries "https://www.amag.ch/en/services.html" |
| 34 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 4/5 (reach 5/5) | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 35 | m-modal-trigger-aria-haspopup-chrome-only-target-outside-dom | M | modal trigger aria-haspopup (chrome only) → target outside DOM at capture | 1/5 (reach 5/5) | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 36 | m-modal-trigger-amag-garagenmodal-callbutton-target-outside- | M | modal trigger amag-garagenModal__callButton → target outside DOM at capture | 1/5 (reach 8/5) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "tel:+41714667010" |
| 37 | m-modal-trigger-amag-garagenmodal-emailbutton-target-outside | M | modal trigger amag-garagenModal__emailButton → target outside DOM at capture | 1/5 (reach 8/5) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "mailto:acc-lengwil@amag.ch" |
| 38 | m-modal-trigger-amag-garagenmodal-routebutton-target-outside | M | modal trigger amag-garagenModal__routeButton → target outside DOM at capture | 1/5 (reach 8/5) | rebuild-native | self | pending | modal-loader | none |  |
| 39 | m-modal-trigger-amag-garagenmodal-garagendetaillink-target-o | M | modal trigger amag-garagenModal__garagenDetailLink → target outside DOM at capture | 1/5 (reach 8/5) | rebuild-native | self | pending | modal-loader | none |  |
| 40 | m-modal-trigger-amag-garagenmodal-otvbutton-chrome-only-targ | M | modal trigger amag-garagenModal__otvButton (chrome only) → target outside DOM at capture | 1/5 (reach 7/5) | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 41 | m-modal-trigger-nav-link-hasoverlay-chrome-only-div-content | M | modal trigger nav-link--hasOverlay (chrome only) → div:content | 1/5 | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 42 | t-unknown-third-party-host-rum-hlx-page | T | unknown third-party host rum.hlx.page | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-consent-onetrust | T | consent: OneTrust | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 44 | t-chat-live-chat-widget | T | chat: live chat widget | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-rum-new-relic | T | RUM: New Relic | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-marketing-marketo-munchkin | T | marketing: Marketo Munchkin | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-unknown-third-party-host-s-pinimg-com | T | unknown third-party host s.pinimg.com | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-analytics-session-replay | T | analytics: session replay | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-lpcdn-lpsnmedia-net | T | unknown third-party host lpcdn.lpsnmedia.net | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-www-redditstatic-com | T | unknown third-party host www.redditstatic.com | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 4/5 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 54 | t-unknown-third-party-host-analytics-ipv6-tiktokw-us | T | unknown third-party host analytics-ipv6.tiktokw.us | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-dam-amag-group-ch | T | unknown third-party host dam.amag-group.ch | 3/5 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "dam.amag-group.ch" |
| 57 | t-unknown-third-party-host-cdn-frontnow-cloud | T | unknown third-party host cdn.frontnow.cloud | 2/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 58 | t-unknown-third-party-host-sdk-frontnow-app | T | unknown third-party host sdk.frontnow.app | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-unknown-third-party-host-tool-webbosaurus-de | T | unknown third-party host tool.webbosaurus.de | 1/5 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "tool.webbosaurus.de" |
| 60 | t-unknown-third-party-host-www-volkswagen-de | T | unknown third-party host www.volkswagen.de | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 61 | t-unknown-third-party-host-www-swissid-ch | T | unknown third-party host www.swissid.ch | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 62 | v-maps-embedded-map-service | V | maps: embedded map service | 5/5 | embed-passthrough | self | pending | media-as-url | none (player ids are public) |  |
| 63 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 5/5 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 64 | x-sign-in-account-links | X | sign-in / account links | 5/5 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 17 row(s) — read-settings, settled-dom-snapshot, sheet-sync, chrome-interaction, modal-loader, media-as-url.
- **One owner decision batch:** 36 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 10 row(s) — no work.
- **Host-bound on the target:** 7 of 6 probed API paths — the off-origin data work.

## Phases

- **tags** — 20
- **detect** — 11
- **forms** — 11
- **interactive** — 9
- **data** — 5
- **off-origin data** — 2
- **capture** — 2
- **locale wave** — 1
- **media** — 1
- **embeds** — 1
- **register** — 1
