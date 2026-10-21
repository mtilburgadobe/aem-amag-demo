# AMAG generative home and "Why this page" in the OF1 panel: design

Date: 2026-10-20. Status: draft for review.

## Intent

Build a generative, audience-adaptive home page for amag.ch at `/en/home-gen` in this repo (`aem-amag-demo`). The audiences come from real AEM OpTel data. Make the "Why this page?" explanation a general feature of the OF1 panel, so any OF1 flow can show why a page was generated the way it was, backed by OpTel evidence.

Why: more and more requests ask for the OpTel integration. BMW (`../bmw`) proved the home-gen idea with a one-off floating widget. Coca-Cola (`../coca-cola`, extension branch `origin/feat/why-this-page`) proved a general `window.of1Why` contract rendered by the OF1 widget. This project combines them for AMAG and makes OpTel evidence a first-class part of the contract.

## Three parts (Part 3 added 2026-10-21)

### Part 1: AMAG `/en/home-gen`

- A new page `/en/home-gen`, authored in DA, built from the existing AMAG blocks (hero-carousel, quick-links, vehicle-search, service-offer, dealer-search, promo-teaser, cta-band, news-cards and others).
- The page shows the sections authored for the matched audience and hides the others, as BMW did (`scripts/audience.js`: sections carry an Audience row in section-metadata, and `applyAudience(main)` hides the rest). Authored default text replaces any unresolved `{{generate: ...}}{{default: ...}}` marker.
- A resolver picks one of five audiences, first matching rule wins, as a pure function of URL, referrer, viewport, and stored last-seen intent (no network).
- Language: the page is English (`/en/`). The audience definitions come from `/de.html` data and apply to the English page by intent, not by language.
- Config (audiences as personas, brand voice, block guide, templates) lives in DA under `/of1/…`, not in the repo, per the latest `of1-skills` recommendation. The block guide is a new DA sheet (Part 3).

### Part 3: block guide as a DA sheet (worker feature)

- A new DA sheet `/of1/config/block-guide`, one row per **block only** (no audiences in it). Columns: `block` (block name, lowercase kebab-case), `guidance` (how to write content for that block), `limits` (optional, short text such as "headline max 8 words"). Authors edit it in DA like any config sheet.
- The change goes into the shared multi-tenant `of1-gen-web-service` (there is no AMAG-specific worker), so it must be optional and invisible to tenants with no `block-guide` sheet. `of1-gen-web-service` syncs it as a new config file `block-guide` (same path as `suggestions`: sheet in, normalized JSON in R2, loaded with the tenant). The slot generator (`llm-fill-block-slots` and `prompts/generate-slots/template.njk`) adds the guide row for each slot's block type to the prompt. No row means the prompt is unchanged. It is optional and not part of the tenant ready gate.
- `of1-skills` docs (`worker-config-schemas.md`) get a row for it.
- Audiences stay out of the guide. They live in the existing audiences/personas document, as in Coca-Cola: the DA sheet `/of1/config/personas` (id, name, description, keywords, priorities), which the extension's Persona panel and the edge proxy already read. The five AMAG audiences are authored there. The per-audience writing brief is carried by each `{{generate:}}` instruction on the page.

### Part 2: "Why this page?" as a general OF1 panel feature

- The contract is `window.of1Why` plus the `of1:why` event, as in Coca-Cola: `{version: 1, title, rows: [[label, value]…], lists: [{title, items: [{text, href?}]}], debug?}`. Pages publish it. The OF1 widget only renders it and knows nothing about audiences.
- Widget (`of1-preview-extension`, injected build, `src/content/mutator.ts`): start from `origin/feat/why-this-page`. Mount the "Why this page?" section from `window.of1Why` alone, with no `#of1-context` island needed. Keep `?of1-debug=1` for the debug section.
- New: an **Evidence** list convention in the contract for OpTel figures: audience share of human views, mobile share, top destinations, source report, date range, sample size. It is a normal list titled "Evidence", so older widgets render it.
- AMAG publishes the contract with: matched audience and rule, signals seen, what the page changes, which sections are generated vs authored, and evidence.
- A demo audience switcher stays (BMW had `?aud=`). It lives in the audience resolver, not in the widget.

## The five audiences (approved)

Source: AEM OpTel for `www.amag.ch`, `/de.html`, 2026-09-20 to 2026-10-20, 1,159 sampled bundles. Full analysis: `docs/superpowers/specs/2026-10-20-amag-optel-audiences.md`. Shares are of human views (synthetic traffic, 69% of raw views, removed). About 70k views, 342 bundles, roughly +/-5 points.

| Audience | Share | Mobile | Behavior | Resolver signals |
| --- | --- | --- | --- | --- |
| Car shopper | 20% | 43% | auto-finden, neuwagen-konfigurieren, brand model pages, used cars, ID. Polo promo | referrer `auto.amag.ch`; search or paid click |
| Service and account customer | 13% | 47% service, 26% account | service appointment, login | referrer `accounts.ondemand.com`; stored last-seen intent |
| Dealer and finder | 7% | about 52% | store locator, dealer pages, on-site search | stored last-seen intent |
| Menu explorer | 21% | not measured | opens menu or carousel, no destination recorded | default for engaged direct visitors |
| Glancer | 37% | 54% | no interaction | default for direct visitors; includes accessibility-flagged (16.5% of humans, 81% mobile) |

80% of humans arrive direct, so URL and referrer rules identify only a minority. The design accepts that the first view for direct visitors is a balanced default, and the page adapts on return visits or after the first interaction.

## Goals

- `/en/home-gen` shows a clearly different home for car shopper and service customer versus the default, driven by the five audiences.
- The "Why this page?" section appears in the OF1 widget for AMAG home-gen with rule, signals, evidence, and generated-vs-authored split, with no island.
- The contract is generic: a second flow (personalization or OF1 generation) can publish it with no widget change.

## Non-goals

- Replacing `/de` or the production amag.ch home page.
- A generic, automatic audience-derivation pipeline from OpTel (this project hand-derives five audiences once).
- Changing the Chrome extension build (only the injected build mounts the section).
- A DA editing UI for audiences.
- Per-audience rows in the block guide, or a block guide that gates tenant readiness.

## Anti-goals (failure even if it works)

- Fabricated numbers in the evidence list. Every figure must come from the saved OpTel analysis, with report and date range shown.
- The widget hard-coding AMAG or any audience names.
- Committing the OpTel domain key anywhere.

## Constraints

- AMAG repo conventions (`AGENTS.md`): `scripts/aem.js` is never edited; no build step; CSS scoped to `.blockname`; a PR needs a `{branch}--aem-amag-demo--mtilburgadobe.aem.page/{path}` link.
- Extension repo: its own `AGENTS.md`. Run `biome check .`, `tsc --noEmit` and `npm test` before pushing. Its checkout has uncommitted changes in `service-worker.ts`, `page-handlers.ts`, `ecid.ts`: do not touch them, work on a separate branch or worktree.
- Changes inside a repo are committed from within that repo.
- OF1 config is authored in DA. A preview and sync reaches the worker. `/of1/config.json` and `/of1/index.json` currently return 404 on preview.
- The OpTel domain key is a secret. It was shared in chat and is not stored in any file.

## Decisions I made (my calls, change any)

- Page path `/en/home-gen` as you asked. Audience data is from `/de.html`, applied by intent.
- Audience switcher via `?aud=<id>`, in the page code.
- Evidence is a normal list, not a new contract field.
- Unmerged `origin/feat/why-this-page` is the base for the widget.

- Demo path: `?aud=<id>` is the primary way to show each audience on `aem.page`, where real referrers cannot occur. The resolver takes an injectable environment (url, referrer, width, stored intent) so every rule is unit-testable. The panel lists the signals actually seen, plus the override when used.
- Resolve once at page load, no re-hiding after interaction. The first interaction stores a last-seen intent (localStorage), which the next visit uses for the service, dealer and car-shopper audiences. `of1:why` fires once at load.
- Evidence figures live in one data module in the AMAG repo, copied from `2026-10-20-amag-optel-audiences.md`, each with report name and date range. Not authored in DA.
- Order of work: the AMAG page ships on its own and works with no widget. The widget change is a separate branch/PR in `of1-preview-extension` cut from `origin/feat/why-this-page` in a separate worktree. Merging and releasing the widget is for the repo owners.

- Generation is real: the home is generative, not authored-only. The page shows the sections for the matched audience, and the OF1 worker writes the marked text (headlines, sublines, section headings) per audience from the tenant's brand voice and knowledge. Links, prices, legal text and images stay authored. The authored `{{default: ...}}` text is the fallback when generation is unavailable, and the panel then reports "authored (fallback)". The contract's generated-vs-authored split reflects what actually happened.

- Block guide: sheet `/of1/config/block-guide` with columns `block`, `guidance`, `limits`; block-only. Audiences go in `/of1/config/personas`.
- Guide text is capped (500 characters per field, same cap as slot instructions) and block names must match the existing block-type shape, because the text is interpolated into an LLM prompt.

## Left to the builder

- Exact resolver rule order and the stored last-seen-intent mechanism.
- How much text is truly AI-generated versus authored per audience, and block choice per audience.
- DA authoring details (section-metadata keys, block guides content).
- Widget code structure and tests.

## Open items to confirm

- None blocking. Confirmed by the owner: the OF1 tenant for `www.amag.ch` exists, and its config lives in DA (the 404s on preview for `/of1/config.json` and `/of1/index.json` are expected: they are not repo files).
