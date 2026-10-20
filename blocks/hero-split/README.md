# hero-split

Custom **hero-split** block. Purpose: Service split hero: a text column (adopted breadcrumb, headline, appointment CTA with icon, service-time note) and a 4:3 image (LCP, eager) that bleeds into the right gutter from 1200px and leads the column below. Full-bleed section shell with a top band strip and section-end padding. Options: `grey` / `lavender` ground; `band-white` / `band-grey` colour of the 80px (120px from 768px) step band left of the content column (hidden below 768px); `spaced` keeps a 100px bottom padding under the hero for when rich text follows in the same section (services overview).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Cells read by role (one cell or several): `<picture>/<img>` the hero image; `<h1>` (or h2/h3) the headline, tag kept; a link-bearing `<p>` (`<strong><a><img>label</a></strong>`) the CTA - an icon picture in the same paragraph is moved into the link, an icon-only link with a `<strong>` label beside it takes the label in; any other `<p>` the service-time note. A `breadcrumb` block immediately before this one in the same section is adopted into the text column.

## Supported variations

| Variation | Option class |
| --- | --- |
| Spaced | `spaced` |
| Grey | `grey` |
| Lavender | `lavender` |
| Band White | `band-white` |
| Band Grey | `band-grey` |

## Universal Editor fields

N/A (Document Authoring project)
