# Dynamics parity check — https://main--65541681--aemcoder.aem.live — 2026-10-09T00:35:39.577Z

Replayed 18 checks over 23 features · pass 18 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header navigation: drawer with in-place sub-menus, language switch, my-garage toggle | M | done | dom-count | PASS | 124 × header nav a[href] (min 10) |  |
| header navigation: drawer with in-place sub-menus, language switch, my-garage toggle | M | done | dom-count | PASS | 123 × header nav a[href] (min 10) |  |
| home hero stage carousel (autoplay, 5 s, prev/next, dots, pause) | M | done | dom-count | PASS | 6 × .hero-carousel .indicators .dot (min 2) |  |
| home hero stage carousel (autoplay, 5 s, prev/next, dots, pause) | M | done | dom-count | PASS | 10 × .hero-carousel button (min 3) |  |
| FAQ / SEO accordions | M | done | dom-count | PASS | 4 × .accordion-faq button[aria-expanded] (min 2) |  |
| FAQ / SEO accordions | M | done | dom-count | PASS | 8 × .accordion-faq button[aria-expanded] (min 2) |  |
| home vehicle search panel | F | interim | dom-count | PASS | 1 × .vehicle-search a[href*='amag.ch'] (min 1) |  |
| garage finder map + list | V | interim | dom-count | PASS | 200 × .dealer-search a[href^='tel:'] (min 50) |  |
| store locator data (stores + synonyms) | D | done | dom-count | PASS | 100 × .garage-chooser a[href] (min 5) |  |
| garage chooser modal (contact garage) | M | done | click-dialog | PASS | dialog 1440px · heading "Choose your AMAG garage" · 1 fields · Escape closes: true |  |
| online appointment wizard | F | interim | dom-count | PASS | 1 × .booking-wizard a[href^='https://www.amag.ch/de/service/otv'] (min 1) |  |
| client-rendered select controls (booking form) | CR | done | dom-count | PASS | 2 × .booking-wizard .wizard-select (min 1) |  |
| consent management (OneTrust) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| tag manager, analytics and marketing pixels | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 10 gated host pattern(s) before consent |  |
| live chat (LivePerson) + Frontnow assistant | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| account (SAP CDC / SwissID) login, register, profile | X | interim | dom-count | PASS | 1 × a[href*='amag.ch/en/user/login'] (min 1) |  |
| locale switch de / fr / it / en | I18N | interim | dom-count | PASS | 2 × header a[href*='amag.ch/fr/'], header a[href*='amag.ch/it/'] (min 2) |  |
| no uncaught exceptions on any delivered page | A | done | no-page-errors | PASS | none on 5 page(s) |  |

## Features without checks

- reCAPTCHA / antibot on forms (F) — scaffolded-awaiting-owner · owner: reCAPTCHA site key for the new host (no submission on the preview; badge replicated as captured)
- runtime-injected iframes (consent / chat / pixels) (V) — scaffolded-awaiting-owner · owner: follows consent-onetrust, tags-analytics, live-chat
- DAM / brand / review-widget assets (T) — done
- assistant dependency hosts (A) — scaffolded-awaiting-owner · owner: follows live-chat
- AEM runtime objects and files (A/D) — decided-out
- newsletter sign-up band (F) — done
- date-bound campaign strip (CR) — done
- client-rendered CDC container (booking page) (CR) — scaffolded-awaiting-owner · owner: follows account-gigya
