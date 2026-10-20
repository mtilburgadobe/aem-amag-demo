# image-text-card

Custom **image-text-card** block. Purpose: Image + text cards (one per row): square image covering the 45% column from 1200px, optional short violet eyebrow before the title, the title (tag kept), card copy and a "gozilla" arrow button (arrow glyph generated, aria-hidden). Full-bleed section shell with top band and section-end padding. Options: `grey` / `lavender` ground; `band-white` / `band-grey` step band colour (hidden below 768px).

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: One row per card; cells read by role: `<picture>/<img>` the card image; `<h2>/<h3>` the title (tag kept); a short `<p>` before the title the eyebrow (optional); a link-bearing `<p>` (`<strong><a>label</a></strong>`) the arrow button; any other `<p>` the card text.

## Supported variations

| Variation | Option class |
| --- | --- |
| Grey | `grey` |
| Lavender | `lavender` |
| Band White | `band-white` |
| Band Grey | `band-grey` |

## Universal Editor fields

N/A (Document Authoring project)
