# news-cards-articles

Custom **news-cards** block. Purpose: Dated news list on a light-grey band: a white box of article rows (date, linked title, "Mehr erfahren" text link, 165px square thumbnail on the right; image on top below 768px). The first three articles show; the trailing label row becomes a black "show more" toggle that reveals the rest (with an optional "show less" label it collapses again). The section head (eyebrow <p>, <h2>, lede <p>) is default content before the block and is reabsorbed.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: `<picture>` the 1:1 thumbnail (optional); a short `<p>` before the title the date (dd.mm.yyyy); `<h4>` (any h2–h6) the title, usually wrapping `<a>` to the article; a link-only `<p>` after the title the "Mehr erfahren" CTA; any other `<p>` an optional excerpt. A trailing row with one short `<p>` (and nothing else) is the "show more" label; a second `<p>` in that row is the optional "show less" label.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
