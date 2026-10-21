# /en/home-gen verification (2026-10-21)

Preview: https://feat-home-gen--aem-amag-demo--mtilburgadobe.aem.page/en/home-gen (code from branch `feat-home-gen`, a preview-only copy of `feat/home-gen`: EDS maps a branch to `feat-home-gen`, so a slash branch never code-syncs).

DA documents written and previewed: `/of1/config/block-guide` (8 rows), `/of1/config/personas` (5 existing personas kept, 5 AMAG audiences appended; the original sheet is saved as `.of1/state/personas-before-home-gen.json`), `/en/home-gen` (11 sections; the Audience row becomes `data-audience` in the delivered HTML).

Checked in a browser with `?aud=<id>`:

| aud | rule | blocks shown |
| --- | --- | --- |
| car-shopper | demo-override | vehicle-search, news-cards, newsletter-band, pledge-row |
| service | demo-override | icon-feature-grid (+ shared) |
| dealer | demo-override | accordion-faq, newsletter-band, pledge-row |
| menu-explorer | demo-override | hero-carousel, quick-links, news-cards, newsletter-band, pledge-row |
| glancer | demo-override | quick-links, newsletter-band, pledge-row |
| none (desktop) | default-desktop | same as menu-explorer |

No raw `{{generate}}` text appeared in any case. `window.of1Why` was published each time. Generation reads "authored (fallback)" because the aem.page host has no OF1 proxy in front of it; real generation is not yet verified.

With the built injected widget (`of1-tracker.js`, plus a consent stub), the widget showed its "Why this page?" section from the contract alone (no `#of1-context` island): Audience, Rule, Why, What the data shows, What this page does, Generation, then Signals, Evidence (with the OpTel source line, date range and sample size) and Sections.

Not verified: generation through the OF1 proxy and shared worker (the block-guide worker change is not deployed), and the widget on the Chrome extension build (unchanged).

Note: the injected build starts the display only after consent (fail closed), so the section appears once the visitor consents or a `#of1-context` island is present.
