# long-form-article

Custom **long-form-article** block. Purpose: Service article body: a container whose rows are typed by content - section head (eyebrow + h2, also reabsorbed from default content authored before the block), rich text, light-blue quote / dark-blue benefits fact boxes, icon tiles with an optional tile-box headline, full-width text image, and CTA with optional service-time note. Full-bleed section shell with top band and section-end padding. Options: `grey` / `lavender` ground; `band-white` / `band-grey` step band colour (hidden below 768px); `narrow-cta` renders the CTA box at the 50% garage-election width with equal-width actions from 768px; `cta-gap` adds the 30px + 16px gap under the rich text before the CTA.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Rows typed by content, never by position: a cell holding only a `<picture>/<img>` = full-width text image; one cell whose only text is a CTA paragraph (`<strong><a><img>label</a></strong>` + optional service-time `<p>`) = CTA; two cells where one holds a `<blockquote>` = fact boxes (quote box + benefits box with `<h2>`, `<h3>` benefit titles and `<p>` copies); 2+ cells where every cell but the first has an image = icon tiles (first cell without image = tile-box headline; each tile `<img>` + `<h3>` + `<p>`); a cell with only eyebrow `<p>` + `<h2>` = section head; anything else = rich text (p / ul / strong / a).

## Supported variations

| Variation | Option class |
| --- | --- |
| Grey | `grey` |
| Lavender | `lavender` |
| Band White | `band-white` |
| Band Grey | `band-grey` |
| Narrow CTA | `narrow-cta` |
| CTA Gap | `cta-gap` |

## Universal Editor fields

N/A (Document Authoring project)
