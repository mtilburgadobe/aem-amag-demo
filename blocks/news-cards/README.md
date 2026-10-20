# news-cards

Custom **news-cards** block. Purpose: Promotion teaser tiles (2-up, coloured ground, first four shown, the rest behind a "Show more" toggle); `carousel` renders 3-up grey content teaser strips with prev/next arrows and a counter. The section head (eyebrow, <h2>, optional <h4>) is default content before the block and is reabsorbed. `grey` paints the grey ground (services "AMAG NEWS" box); `band-white` (together with `grey`) adds the white 80px (120px from 1200px) step band left of the content column, hidden below 768px.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: first `<picture>` the 2:1 tile image (a second one is the AMAG badge); a short `<p>` before the heading is the topline; `<h3>` the title; other `<p>` the copy; a link-bearing `<p>` makes the whole tile that link; a cell holding only a colour word (green | dark-grey | violet | light-blue | dark-blue | black) sets the ground. A trailing row with one `<p>` and nothing else is the "Show more" label.

## Supported variations

| Variation | Option class |
| --- | --- |
| Carousel | `carousel` |
| Grey | `grey` |
| No Band | `no-band` |
| Band White | `band-white` |

## Universal Editor fields

N/A (Document Authoring project)
