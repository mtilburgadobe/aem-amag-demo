<!-- stardust:provenance
  writtenBy:        stardust:extract
  writtenAt:        2026-10-08T15:50:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_crawl-log.json
    - stardust/current/pages/en-html.json
    - stardust/current/pages/en-services-html.json
    - stardust/current/pages/en-komponenten-car-dealers-html.json
    - stardust/current/pages/de-service-auto-services-online-termin-buchen-html.json
    - stardust/current/pages/de-service-reifen-und-raeder-winterreifen-html.json
  synthesizedInputs: []
  stardustVersion:  0.29.1
  mode:             replica / same-design migration — descriptive of the existing site, no redesign intent
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Swiss private motorists and fleet/corporate clients who want to buy or lease a car, book a workshop appointment, or find one of AMAG's garages. The site is published in four languages (en / de / fr / it; language switch in the header) and its German pages address users formally ("Sie"). Captured user moments: choosing a new or used vehicle (home stage, vehicle search), booking a service online (5-step wizard), locating a dealer (map + search), and reading service advice (winter-tyre article with FAQ).

_provenance: inferred — derived from captured nav labels (Find a vehicle / Services / Find garage / Jobs), page titles and body copy; no interview.

## Product Purpose

amag.ch is the retail front door of AMAG Automobil und Motoren AG, "the biggest car dealership in Switzerland" and official Swiss partner of the VW Group brands (Volkswagen, Audi, SEAT, Škoda, CUPRA, VW Commercial Vehicles, Bentley; plus Microlino and Ducati Volketswil in the logo strip). It routes visitors to the online marketplace (auto.amag.ch), to the online-appointment wizard, to 90 physical garages, and to adjacent AMAG services (car subscription, Clyde, leasing, Europcar, carsharing, Räderhotel tyre storage, Totalmobil insurance). Success, as the copy frames it, is a booked test drive, a booked service appointment, or a saved "My garage" relationship.

## Positioning

"No. 1 Car Dealer in Switzerland with 90 locations" (utility bar, all 5 pages) and "official Swiss dealership" for all Volkswagen-group brands — a scale-and-authorisation claim a single-brand or independent dealer cannot make. Secondary claims: 24/7 breakdown help, 12-month minimum warranty and 15-day right of exchange on used vehicles, free mobility insurance with a service, and an energy/e-mobility "360° solutions" offer from charging to photovoltaics.

## Capabilities and Constraints

- **Vehicle discovery**: home stage carousel of current models with price-led offers ("from CHF 199.–/month"), vehicle search form posting to the external marketplace auto.amag.ch, promotion teasers per brand.
- **Service booking**: German "Online-Termin buchen" wizard — Leistung → Garage → Termin → Daten → Buchung; brand select; optional login (Gigya CDC) to reuse a saved vehicle; reCAPTCHA present.
- **Dealer finder**: full-viewport Google Map (maps.googleapis.com) with "Search garage" panel, filters, and a result list offering Call (tel:) and Route (Google Maps directions) per garage.
- **Service content**: services overview (12-item icon grid, news cards, pledge row) and long-form service articles with FAQ accordions and promo cards.
- **Site-wide**: "My garage" saved-dealer widget in the header; newsletter subscription (Marketo forms hinted); jobs portal (jobs-retail.amag.ch); LivePerson chat; OneTrust consent.
- **Platform constraints**: Adobe Experience Manager Sites on a Bootstrap 4 theme (`clientlib-amagch`, `clientlib-base`); DAM renditions served from dam.amag-group.ch (Dynamic Media `is/image` URLs) and /content/dam; proprietary self-hosted webfonts; several core journeys (marketplace, leasing, jobs, group site) live on sibling domains.
- **Terminology**: "garage" (not "dealership") for a location; "Räderhotel" for tyre storage; "Online-Termin" / "online appointment"; "AMAG pledge"; "Top services".
- **Undecided / not captured**: carousel auto-advance behaviour; mega-menu content for every top item; form validation and error states; fr / it page content.

## Brand Commitments

- **Name and mark**: AMAG; inline white-fill SVG wordmark 67×24 (`stardust/current/assets/logo.svg`); favicon `assets/favicon.svg`.
- **Register**: brand (marketing site; no authentication required to browse; hero + offers + CTAs above the fold; booking wizard is the one product-like surface).
- **Observed personality**: professional-warm (tone guess, not ground truth) — second-person, reassuring, offer-led, sentence-case headings, uppercase only on small eyebrows (WELCOME TO AMAG, SERVICES, OUR AMAG PLEDGE), formal "Sie" in German.
- **Typeface**: proprietary amag_displaybold / amag_displaylight / amag_textbold / amag_textlight, self-hosted woff2 (licence to be verified before redeploying).
- **Colour**: white ground, black text, AMAG Blue #172983 for actions, AMAG Purple #801977 for interaction states, black footer.
- **Observed anti-references** (what the current site does not do): no shadows or elevated cards, no large radii except one pill button, no uppercase or letter-spaced headlines, no dark-mode or coloured section grounds beyond a light lilac, no video or motion hero (still-image carousel), no illustration — photography only.

_provenance: inferred — personality and anti-references read from captured styles and copy, not confirmed by AMAG.

## Evidence on Hand

- Rendered pages (HTML + JSON + full-page screenshots) under `stardust/current/pages/` and `stardust/current/assets/screenshots/` for: `en-html` (home), `en-services-html`, `en-komponenten-car-dealers-html`, `de-service-auto-services-online-termin-buchen-html`, `de-service-reifen-und-raeder-winterreifen-html`.
- Computed-style census at 1440 and 360: `stardust/current/_computed-styles.json`.
- Brand surface: `stardust/current/_brand-extraction.json`; crawl log: `stardust/current/_crawl-log.json` (5 pages, headless, 0 failures, auto-consent).
- Assets: `stardust/current/assets/logo.svg`, `assets/favicon.svg`, `assets/fonts/amag_{display,text}-{bold,light}.woff2`, `assets/css/clientlib-amagch.css`, `assets/css/clientlib-base.css`.
- Real copy: hero headline "The new VW ID. Polo"; one customer testimonial ("Regula S., Customer of AMAG"); pledge bullets; 8 winter-tyre FAQ questions; dealer list with addresses and phone numbers.
- Real imagery: Dynamic Media renditions (1920×1080 stage, 629×314 news, 380×380 maxi-teaser, 1440×400 divider bands), brand logos, blue/white line-icon sets.
- **Absences not to be fabricated**: no og:* metadata on any page; no French/Italian content captured; no video assets; no press/case-study pages; hero subcopy not captured; no form success/error states; cookie banner content not captured.

## Product Principles

1. **Route, don't dwell** — every page funnels to one of three actions: find a vehicle, book an appointment, find a garage.
2. **Offer-led clarity** — prices and concrete benefits (CHF, months, days of warranty) sit in headlines, not footnotes.
3. **Local presence as proof** — 90 garages, map-first dealer finder and the saved "My garage" widget anchor the national brand locally.
4. **One family, many brands** — AMAG frames itself above its VW-group brands; brand logos recur in nav and footer but never override AMAG blue/black chrome.
5. **Multilingual by default** — all chrome and journeys exist in en / de / fr / it; copy length varies, layout must absorb it.

_provenance: inferred — derived from captured IA, CTAs and copy.

## Accessibility & Inclusion

Observed in the capture, to be preserved or improved but not invented around: 46 images carry the generic alt text "icon"; 193 of 419 images have empty alt (dominated by the dealer-map page, 138 of 172); FAQ/accordion toggles are rendered as h2 elements without hrefs; focus rings on inputs are the Bootstrap default blue, not brand blue; the site serves four languages with a visible switcher. No published accessibility standard was found in the captured pages.

_provenance: inferred — mechanical counts from `pages/*.json#media.imgs` and `ctas`; no stated standard.
