# tabs-garage

Custom **tabs** block. Purpose: Garage page tab bar — three equal icon tiles (grey, active tile white with a coloured 5px top border: violet / dark blue / light blue) above a 1px viewport-wide line. The panels are the following page sections tagged with section metadata `Tab`; only the active tab's sections show. An optional trailing row renders the grey "Mehr über …" anchor band after the last panel, linking to the other tabs.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: one row per tab: icon `<img>` | label `<p>` (the tab id is the label as a class name, e.g. fahrzeug-angebote). Optional trailing band row: `<h3>` headline | link `<p>`s with href="#`<tab id>`". Panel content lives in the following sections, each with section metadata Tab = `<tab label>`.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
