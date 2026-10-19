# hero-split-garage

Custom **hero-split** block. Purpose: Garage detail page intro — text column (adopted breadcrumb, h1, lead, VERKAUF/SERVICE brand-logo lists, icon text links) beside a 4:3 image slider that bleeds into the right gutter at >= 1200px, the next slide peeking; a translucent strip at the slider foot holds the dark-blue appointment CTA, a derived "1 / 6" counter and prev/next arrows. Below 1200px the slider leads full-bleed (270/384px slides); below 768px the CTA sits under it.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: cells read by role (one cell or several): a cell holding only pictures = the slider images in order; a cell with `<h1>` = headline + lead `<p>`; a cell with a text-only `<p>` + image-only `<p>` = one brand list (title + logos, e.g. VERKAUF | SERVICE as two cells); `<p>` with icon + text (with or without a link) = icon text link; `<p><strong><a><img>label</a></strong></p>` = the appointment CTA. A breadcrumb block directly before it in the same section is adopted.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
