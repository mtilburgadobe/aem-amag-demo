# dealer-search

Custom **dealer-search** block. Purpose: AMAG garage finder (store locator): an interactive OpenStreetMap (Leaflet) with one AMAG marker per garage (authored map captures stay as placeholder until tiles load), a search field that filters the garage list and markers client-side, a filter trigger opening the off-canvas filter panel (type, brands, offers, counter/confirm/cancel), the garage list (name, address, brands, call and route links) where a garage or marker click opens its detail modal (address, call/contact/route/website links, rating badge iframe, sale/service brand chips, primary appointment CTA) and centers the map on it, and a "Directly to" quick-links pill shown from scrollY 300. One self-contained interactive block; the state is the DOM.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Rows keyed by the first cell (a `<p>` holding the row key, not displayed): own setup rows (`map`, `title`, `search`, `filter`, `filters-head`, `filters-type`, `filters-brands`, `filters-offers`, `filters-footer`, `quick-links`) once each, plus one `garage` row and one `details` row per garage. A garage row and its details row pair by name, repeated names in order (fallback: order). Garage coordinates and service brands come from garage-data.js, not from the authored content.

Rows (first cell = row key):

| Row key | Cells |
| --- | --- |
| `map` | `<img>` desktop map capture \| `<img>` mobile map capture (placeholder until the OpenStreetMap tiles load) |
| `title` | `<h1>Search garage</h1>` |
| `search` | `<p>` placeholder of the search field |
| `filter` | `<p>` label of the filter trigger |
| `garage` (one per garage) | `<p>name</p><p>street</p><p>zip town</p>` \| `<ul><li>brand</li>…</ul>` (optional) \| `<p><a href="tel:…"><strong>+41…</strong><em>Call</em></a></p><p><a href="…maps…">Route</a></p>` |
| `details` (one per garage) | `<p>` back label \| `<h3>name</h3><p>street</p><p>zip town</p>` \| `<p>` links: tel (`<strong>` number + `<em>Call</em>`), mailto Contact, maps Route, Go to website \| `<p><a>rating-badge-url</a></p>` (rendered as the badge iframe) \| `<p><strong><a>Arrange an appointment</a></strong></p>` (primary CTA) |
| `filters-head` | `<h4>All filters</h4>` \| `<p><img trash> Delete all filters</p>` |
| `filters-type` | `<p>Show garages by</p>` \| `<p>sales</p><p>service</p>` (optional switch labels) |
| `filters-brands` | `<p>Brand selection</p>` \| `<ul>` sales brands (img + name) \| `<ul>` service brands |
| `filters-offers` | `<p>Offer</p>` \| `<ul><li>offer</li>…</ul>` |
| `filters-footer` | `<p>counter</p><p>confirm label</p>` \| `<p>cancel label</p>` |
| `quick-links` | `<p>` topline \| `<p><img><a href>label</a></p>…` \| `<p><img>open</p><p><img>close</p>` ("Directly to" pill, shown from scrollY 300) |

Reference content: `content/en/komponenten/car-dealers.plain.html` (100 `garage` + 100 `details` rows).

Used on: `/en/komponenten/car-dealers`, `/de/komponenten/storelocator`.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
