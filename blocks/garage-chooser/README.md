# garage-chooser

Custom **garage-chooser** block. Purpose: Full-screen garage chooser modal: headline, a search field that filters the list by text, and one link per garage (name, street, place). Opens from any `a[href$="#garage-chooser"]` on the page (e.g. the cta-band CTA), with a 300ms dialog transition; closes on the close controls, Escape and a backdrop click. Renders fixed - takes no flow height.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: One row per garage; a leading row with a heading and no link is the chooser headline. Garage rows read by role: the link-bearing `<p>` is the garage name and the whole row links to its href (inner anchor unwrapped); the remaining `<p>`s are the street and the place.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
