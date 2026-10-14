<!-- stardust:provenance writtenBy=stardust:replica writtenAt=2026-10-08T15:10:06Z input=stardust/dynamics/dynamic-features.generated-plan.json (64 draft rows, curated to 22) -->
# Dynamic features — www.amag.ch (5-page replica)

Scope: the 5 planned pages only. Static recreation ships first; every row below degrades to a working
static page. Hands-off resolutions follow the dynamics skill table: owner decisions ship the interim
tier and are named in the decision batch — never written as decided-out.

## Listings contract
none — no listing blocks on the 5 pages (news cards are authored content, not index-fed).

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chrome-nav-overlays | header mega menu, language switch, "my garage" flyout (nav-link--hasOverlay, aria-haspopup) | M | 5/5 | rebuild-native | self | planned (Phase 3 interaction parity) | chrome-interaction | — | m-modal-trigger-nav-link-hasoverlay-*, m-modal-trigger-aria-haspopup-* |
| 2 | home-hero-carousel | home hero image carousel (AEM core carousel) | M | 1/5 | rebuild-native | self | planned (motion observed in Phase 3) | carousel | — | DESIGN.json modules.hero-carousel |
| 3 | accordions | FAQ / SEO accordions (AEM core accordion) | M | 3/5 | rebuild-native | self | planned | disclosure | — | modules.accordion-faq |
| 4 | vehicle-search | home "Our vehicles" search panel (links into the car marketplace app) | F | 1/5 | static-snapshot | needs-business-decision | interim: UI rebuilt, submit = link to the source marketplace results URL | link-out | owner: marketplace stays on source origin? | pages/en-html.json slots.vehicle-search |
| 5 | dealer-map | garage finder map (embedded map service) | V | 1/5 (+ "my garage" widget on 5/5) | embed-passthrough | needs-business-decision | interim: static map capture + searchable list from the store snapshot | map-embed | owner: map API key for the new host | v-maps-embedded-map-service |
| 6 | dealer-store-data | /bin/amagch/storelocator.stores.json + synonyms.json | D | 2/5 | data-fed | self | planned: snapshot served from the code bus (JSON) | snapshot-data | — | d-first-party-data-file-get-bin-amagch-storelocator-* (host-bound on target) |
| 7 | garage-modal | garage detail modal (call / email / route / detail / booking buttons) | M | 1/5 | rebuild-native | self | planned, reads the store snapshot | modal | — | m-modal-trigger-amag-garagenmodal-* |
| 8 | booking-wizard | online appointment wizard: brand select → garage → service → slot (otvgarages, public-holidays APIs, manualinputform 11 fields, photouploadform) | F | 1/5 | rebuild-native | needs-backend | interim: step-1 UI rebuilt; later steps + submission link to the source booking page | staged-form | owner: booking backend endpoint reachable from the new host? | f-form-manualinputform-*, f-form-photouploadform-*, a-first-party-api-get-de-service-auto-services-online-termin-* (host-bound 6/6) |
| 9 | select2-controls | client-rendered select controls in the booking form | CR | 2/5 | rebuild-native | self | planned (native select, same visual spec) | native-control | — | cr-client-rendered-slot-js-select2-* |
| 10 | captcha | reCAPTCHA / antibot on forms | F | 5/5 | embed-passthrough | needs-backend | interim: not loaded (no submission on preview) | form-protection | owner: site key for the new host | f-form-protection-captcha-antibot |
| 11 | account-gigya | SAP CDC (Gigya) login / register / profile / OTP / reset forms, SwissID; sign-in links | X | 5/5 | static-snapshot | needs-backend | interim: account links keep the source origin; modal forms not rebuilt | link-out | owner: identity provider on the new host | f-form-gigya-*, x-sign-in-account-links, cdns.eu1.gigya.com, www.swissid.ch |
| 12 | consent-onetrust | consent management (OneTrust) | T | 5/5 | embed-passthrough | needs-business-decision | interim: not loaded on preview | cmp | owner: OneTrust domain script id for the new host | t-consent-onetrust |
| 13 | tags-analytics | Google Tag Manager, GA/Ads, New Relic RUM, session replay, Marketo Munchkin, LinkedIn / Reddit / TikTok / Pinterest pixels | T | 4–5/5 | embed-passthrough | needs-business-decision | interim: not loaded; EDS RUM (rum.hlx.page) native | tag-container | owner: GTM container id (all pixels load through it) | t-tag-manager-google-tag-manager, t-analytics-*, t-marketing-*, t-unknown-third-party-host-{px-ads-linkedin,alb-reddit,analytics-ipv6-tiktokw,s-pinimg,www-redditstatic,www-linkedin}* |
| 14 | live-chat | live chat widget (LivePerson lpsnmedia) + Frontnow assistant (sdk/amag4.frontnow.app, cdn.frontnow.cloud) | T | 5/5 | embed-passthrough | needs-business-decision | interim: not loaded; the green side tab is replicated as captured | widget | owner: chat account ids for the new host | t-chat-live-chat-widget, accdn/lpcdn.lpsnmedia.net, *frontnow* |
| 15 | injected-iframes | iframes without src (runtime-injected by consent / chat / pixels) | V | 5/5 | embed-passthrough | self | follows rows 12–14 (no standalone work) | side-effect | — | v-iframe-without-src-runtime-injected-embed |
| 16 | i18n-locales | locale variants de / fr / it / en | I18N | 5/5 | static-snapshot | needs-business-decision | this run: en + de pages in scope only; switcher links to out-of-scope locales keep the source origin | locale-links | owner: locale wave beyond the 5 pages | i18n-locale-variants-de-fr-it-en |
| 17 | external-brand-assets | dam.amag-group.ch, www.volkswagen.de assets, tool.webbosaurus.de review widget | T | 1–3/5 | static-snapshot | self | assets captured and rehosted; review widget replicated as captured | asset | — | t-unknown-third-party-host-{dam-amag-group-ch,www-volkswagen-de,tool-webbosaurus-de} |
| 18 | openai-hosts | bzr/bzrcdn.openai.com (loaded by the Frontnow assistant) | A | 4/5 | embed-passthrough | needs-business-decision | follows row 14 | widget-dependency | — | a-unknown-third-party-host-bzr*-openai-com |
| 19 | aem-runtime | AEM runtime objects and files: dataLayer, Granite, CQ, /libs/granite/csrf/token.json, /libs/cq/i18n/dict.*.json | A/D | 5/5 | static-snapshot | self | not applicable on EDS (platform runtime, no page content) | drop | — | a-cms-app-settings-object-*, d-first-party-data-file-get-libs-* |
| 20 | newsletter-band | newsletter sign-up band (CTA link, no inline form captured) | F | 2/5 | static-snapshot | self | link kept as captured | link-out | — | modules.newsletter-band |
| 21 | announcement-bar | date-bound campaign strip in the header (Emotion Days) | CR | 5/5 | static-snapshot | self | replicated as captured (capture-state policy) | capture-state | — | modules.announcement-bar |
| 22 | gigya-cdc-slot | client-rendered CDC container on the booking page | CR | 1/5 | static-snapshot | needs-backend | follows row 11 | side-effect | — | cr-client-rendered-slot-js-cdc-container-* |

## Decision batch
One message to the site owner, grouped by need (none blocks the static migration):
- **Tags and consent (rows 12, 13, 14, 18):** OneTrust script id, GTM container id, LivePerson / Frontnow account ids for the new host. Until then the preview loads no third-party tags.
- **Backends (rows 8, 10, 11, 22):** booking APIs (otvgarages, public holidays, slot booking) are host-bound (6/6 dead on the target); reCAPTCHA site key; identity provider (SAP CDC / SwissID). Interim: step-1 booking UI + link to the source booking page; account links keep the source origin.
- **Map (row 5):** map API key for the new host; interim static map + list from the store snapshot (row 6).
- **Marketplace and locales (rows 4, 16):** confirm the vehicle marketplace stays on the source origin and the locale wave beyond these 5 pages.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement in a hands-off run; every non-self row ships its interim tier | — |

## Verification (rollout B2, 2026-10-08)
`dynamics-plan.mjs --target-origin https://main--65541681--aemcoder.aem.live --migrated stardust/migrated` re-run before import:
64 draft rows → self 17 · owner batch 36 · already delivered 10 · host-bound 6/6 (the booking APIs of row 8), unchanged from the
Phase 2 curation; every curated row above keeps its disposition. The migrated tree carries the interim tiers (static UI, links to the
source origin for host-bound backends); the owner batch is unchanged. Pre-import gate: passed.
