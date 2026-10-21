# www.amag.ch home page (/de.html): OpTel audiences

Source: AEM OpTel bundles, last 30 days (2026-09-20 to 2026-10-20), 1,159 sampled bundles, about 227k estimated views.
Raw data: `out/raw.jsonl`. Classifier: `out/seg2.cjs`.

## Step 0: remove synthetic traffic

69% of the raw views are not people.
- 56.5%: desktop Linux, English browser, direct, no interaction, spread evenly over 24 hours. This looks like monitoring or a crawler and is not flagged as a bot by OpTel.
- 12.4%: flagged bots.

Human base: about 70k views, 342 bundles. Shares below are of human views. The sample is small, so treat percentages as roughly +/-5 points.

Human profile: 80% direct, 9% search, 7% internal, 2% paid. 48% desktop, 46% mobile. 63% interact, 37% do nothing. 79% have a German browser.

## Audiences

| # | Audience | Share | Mobile | What they do on /de.html | Signals |
| --- | --- | --- | --- | --- | --- |
| 1 | Car shopper | 20% | 43% | Click to `/de/auto-finden.html`, `neuwagen-konfigurieren`, `nach-marken/*`, `occasionen`, `vorfuehrwagen`, the VW ID. Polo promo | Referrer `auto.amag.ch` (7% of humans, 83% of them interact), organic or paid search, internal referral |
| 2 | Service and account customer | 13% | service 47%, account 26% | Click to `/de/service.html`, online appointment booking, `/de/user/login`; arrive from login flows | Almost all direct; referrer `accounts.ondemand.com` |
| 3 | Dealer and finder | 7% | about 52% | Click to `storelocator`, dealer pages, on-site search (`/de/suche.html`) | Mostly direct; search click-through |
| 4 | Menu explorer | 21% | n/a | Open the menu or the hero carousel but no destination is recorded; hero carousel users are 63% mobile | Direct |
| 5 | Glancer | 37% | 54% (20% mobile and 17% desktop of all humans) | No click, no scroll | Direct; 16.5% of humans have an accessibility signal (81% mobile) |

Not an audience (too small): job seekers (2%), consent-only (0.6%). English or French browsers are 14% of humans and are a language variant, not an audience.

## Implications for the generated home page

- 80% of humans arrive direct, so URL and referrer signals (what the BMW resolver relied on) identify only a minority.
- Resolver, first match wins: referrer `auto.amag.ch` or search or paid click -> car shopper; login referrer -> service and account; otherwise a mixed default.
- The rest needs a stored last-seen intent from a previous visit, then on-page behavior after the first interaction.
- Mobile skews to the carousel, glancers and accessibility. Keep the first screen short and one action per audience.
- Page-level proof: the same bundles show that 3 of the top 4 navigation destinations are `auto-finden`, `service` and `storelocator`.

## Caveats

- Intent comes from the first click target only, so audience 4 is "no destination recorded", not "no intent".
- The synthetic-traffic rule is my heuristic. Confirm it with AMAG.
- Data is sampled, 30 days, one page.
