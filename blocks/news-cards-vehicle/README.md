# news-cards-vehicle

Custom **news-cards** block. Purpose: Vehicle stock carousel — "1 / N" counter and prev/next arrows above a strip of grey vehicle cards (3-up at >= 1200px with the next card peeking, 2-up at >= 768px, 1-up below); the active card is 40px taller. Each card: bottom-anchored 4:3 photo, violet uppercase status topline, bold model, price lines, 3-column spec grid (value over grey label); the whole card links to the vehicle. An optional closing light-blue tile links to all vehicles. The section head (eyebrow + `<h2>`) and the carousel head (`<h4>` + head link) are default content before the block and are reabsorbed.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: `<picture>` photo | `<p>` status topline, `<h3>` model, `<p>` price lines (`<strong>price</strong><br>`Abo ab `<strong>…</strong>`), `<ul>` specs (each `<li>` "value label", e.g. 43'807 KM), `<p><a>` detail URL`</a></p>`. Optional closing row with only a link = the "all vehicles" tile.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
