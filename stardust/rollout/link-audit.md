# Link audit — rollout E2 (2026-10-09)

Inventory: 1002 hrefs on the 5 delivered pages + 4 chrome documents (nav, footer, de/nav, de/footer) on the aem.live origin → 817 unique: 5 internal (the delivered pages, all 200), 187 hash/mailto/tel, 402 on the source origin (www.amag.ch — out-of-scope targets, repointed), 223 other external (google maps, webbosaurus, amag-group, auto.amag.ch, social, app stores). No source-origin link targets an in-scope page.

```
localize-links: 9 pages, 11 map entries (2 from redirects), hosts amag.ch
would localize 0 source-host link(s) + normalized 0 internal href(s) across 0 file(s) [no writes]

absolute source-host links KEPT (target not in the migration set — the honest boundary; re-run after the wave that ships them):
   107  /en/services/otv
     8  /de/komponenten/storelocator
     5  /de/service
     5  /de/service/otv
     4  /en/find-vehicle
     4  /en/newsletter/subscribe
     4  /en/find-vehicle/cars-amag/e-mobility
     4  /en/find-vehicle/cars-amag/abo
     4  /en/services/top-services
     4  /en/services/help-in-case-of-damage
     4  /en/services/tyre-service
     4  /en/car-dealers/autowelt-zuerich
     4  /en/car-dealers/car-dealer-basel
     4  /en/car-dealers/car-dealer-chatelaine
     4  /en/car-dealers/car-dealer-chur
     4  /en/car-dealers/car-dealer-crissier
     4  /en/car-dealers/car-dealer-fribourg
     4  /en/car-dealers/car-dealer-mendrisio
     4  /en/car-dealers/car-dealer-oftringen
     4  /en/car-dealers/car-dealer-winterthur
  … 282 more target(s)

CHECK PASS — 0 link(s) still localizable
```
