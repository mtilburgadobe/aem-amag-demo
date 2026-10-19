# hero-carousel

Custom **hero-carousel** block. Purpose: Home stage carousel: full-bleed slides (16:9 image from 768px, 3:4 image below), headline and link text over the image, the whole slide is the link; indicator dots labelled by hidden text, previous/next arrows from 1200px; autoplays every 5 s with 1 s fades (off with prefers-reduced-motion). Slides without images render as video stage frames. Marks its section so the transparent header morphs over it.

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: 4 cells read by role: first `<picture>` the 16:9 stage image, second `<picture>` the 3:4 mobile image (leave both empty for a video slide); `<h1>` (first slide) or `<h2>` the headline plus a link `<p>` whose link text is the slide CTA and whose href the slide links to; a lone `<p>` in its own cell the indicator label.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
