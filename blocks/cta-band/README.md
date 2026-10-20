# cta-band

Custom **cta-band** block. Purpose: Contact band: headline (tag kept), intro text and a single CTA (an icon picture in the same paragraph is moved into the link); an image outside the CTA is the band image. A CTA linking to `#garage-chooser` opens the garage-chooser block. Full-bleed section shell with top band and section-end padding. Options: `grey` / `lavender` ground; `band-white` / `band-grey` step band colour (hidden below 768px).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Cells read by role (one row or several): `<h2>/<h3>` the headline; `<picture>/<img>` outside the CTA the band image; a link-bearing `<p>` (`<strong><a><img>label</a></strong>`) the single CTA; any other `<p>` the intro text.

## Supported variations

| Variation | Option class |
| --- | --- |
| Grey | `grey` |
| Lavender | `lavender` |
| Band White | `band-white` |
| Band Grey | `band-grey` |

## Universal Editor fields

N/A (Document Authoring project)
