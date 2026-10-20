# AMAG Generative Home and "Why this page?" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/en/home-gen` on the AMAG EDS site, an audience-adaptive, generative home page, and make the OF1 widget render a general "Why this page?" section (with OpTel evidence) from `window.of1Why` alone.

**Architecture:** In `aem-amag-demo`, pure ES modules under `scripts/home-gen/` resolve one of five audiences, show only the page sections authored for it, and publish a `window.of1Why` contract. The page is authored in DA with `{{generate: ...}}{{default: ...}}` markers that the OF1 worker fills. In `of1-preview-extension`, the injected widget mounts its Why section from `window.of1Why` with no `#of1-context` island.

**Tech Stack:** EDS vanilla JS (ES modules, no build step), `node --test` (+ `jsdom` devDependency) for AMAG; TypeScript, Vitest, Biome, React in the extension.

**Spec:** `aem-amag-demo/docs/superpowers/specs/2026-10-20-amag-home-gen-why-this-page-design.md`. Audience data: `aem-amag-demo/docs/superpowers/specs/2026-10-20-amag-optel-audiences.md`.

## Global Constraints

- AMAG repo: `scripts/aem.js` is never edited; no build step (devDependencies only); CSS scoped to `.blockname`; a PR needs a `{branch}--aem-amag-demo--mtilburgadobe.aem.page/{path}` link.
- Extension repo: run `npx biome check .`, `npx tsc --noEmit` and `npm test` before pushing. Its main checkout has uncommitted changes in `src/background/service-worker.ts`, `src/core/page-handlers.ts`, `src/shared/ecid.ts`: never touch them. Work only in a new worktree.
- OF1 config is in DA (`/of1/...`), never in the repo. `/of1/config.json` 404 on preview is expected.
- The OpTel domain key is a secret: never write it to any file or commit.
- Evidence figures come only from `2026-10-20-amag-optel-audiences.md`, each with report name and date range. No invented numbers.
- The widget never hard-codes AMAG or audience names.
- Audience ids: `car-shopper`, `service`, `dealer`, `menu-explorer`, `glancer`.
- Contract: `{version: 1, title, rows: [[label, value]...], lists: [{title, items: [{text, href?}]}], debug?: {rows, blocks}}`; event `of1:why` on `document`; links only for same-site paths (`/x`).
- Demo override: `?aud=<id>`.

## Review Focus

- Unknown or empty `?aud=` value: falls through to real rules, no crash, no "override" shown.
- Referrer is malformed, empty, or the page's own host: treated as no external referrer.
- localStorage unavailable or holds garbage: resolver ignores it and still returns a valid audience.
- A page with no `data-audience` sections (normal pages): nothing hidden, no contract published, no change in behavior.
- Generation unavailable: unresolved `{{generate:}}` markers become authored `{{default:}}` text and the contract says "authored (fallback)".
- `window.of1Why` with `version` other than 1, missing `rows`/`lists`, or non-string values: widget renders nothing for the bad parts and does not throw.
- `of1:why` fired before the widget mounts, and `window.of1Why` set after mount: the section still shows the latest contract.

---

## Part 1: AMAG repo (`/Users/quentinvecchio/workspace/labs/aem-amag-demo`)

Work on a branch `feat/home-gen` cut from `main`. Commit from within this repo.

### Task 1: Test runner and audience data

**Files:**
- Modify: `package.json` (add script `"test": "node --test test/"`, devDependency `jsdom`)
- Create: `scripts/home-gen/audiences.js`
- Test: `test/home-gen/audiences.test.js`

**Interfaces:**
- Produces: `export const AUDIENCE_IDS: string[]` (the five ids, in the order car-shopper, service, dealer, menu-explorer, glancer); `export const AUDIENCES: Record<id, {label: string, share: string, mobile: string, behaviour: string, pageDoes: string}>`; `export const EVIDENCE: {report: string, domain: string, path: string, range: string, sample: string, perAudience: Record<id, string[]>}`.

- [ ] **Step 1: Write failing test** `audiences.test.js`: `AUDIENCE_IDS` deep-equals the five ids; every id has non-empty `label`, `share`, `mobile`, `behaviour`, `pageDoes`; `AUDIENCES['car-shopper'].share` equals `'20%'` and `.mobile` equals `'43%'`; `AUDIENCES.service.share` equals `'13%'`; `AUDIENCES.dealer.share` equals `'7%'`; `AUDIENCES['menu-explorer'].share` equals `'21%'`; `AUDIENCES.glancer.share` equals `'37%'`; `EVIDENCE.range` equals `'2026-09-20 to 2026-10-20'`; `EVIDENCE.path` equals `'/de.html'`; each `EVIDENCE.perAudience[id]` is a non-empty string array.
- [ ] **Step 2: Run** `npm install && npm test` → FAIL (module missing).
- [ ] **Step 3: Implement** `audiences.js` with values copied from the "five audiences" table of the audiences doc (shares, mobile, behaviour). `sample` is `'1,159 sampled bundles, about 70k human views, +/-5 points'`. `perAudience` strings are the evidence bullets from the doc (e.g. car shopper: `'20% of human views, 43% mobile'`, `'Referrer auto.amag.ch is 7% of humans; 83% of them interact'`).
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(home-gen): audience data and OpTel evidence`.

### Task 2: Audience resolver

**Files:**
- Create: `scripts/home-gen/resolver.js`
- Test: `test/home-gen/resolver.test.js`

**Interfaces:**
- Consumes: `AUDIENCE_IDS` from Task 1.
- Produces: `export function resolveAudience(env?: {url?: URL, referrer?: string, width?: number, stored?: string|null}): {audience: id, rule: string, why: string, signals: {override: string|null, referrer: string|null, clickId: string|null, utmMedium: string|null, device: 'mobile'|'desktop', stored: string|null}}`.

Rule order, first match wins; `rule` values in brackets:
1. `?aud=<id>` is a known id [`demo-override`].
2. Referrer host is `auto.amag.ch` [`referrer-auto-amag`] → `car-shopper`.
3. Referrer host contains `accounts.ondemand.com` [`referrer-login`] → `service`.
4. Paid click (`gclid`, `gbraid`, `wbraid`, `msclkid`, `fbclid` param, or `utm_medium` in cpc/ppc/paid/paidsocial/display) or search-engine referrer (google, bing, duckduckgo, ecosia, search.yahoo) [`paid-or-search`] → `car-shopper`.
5. `stored` is a known id [`last-seen-intent`] → that audience.
6. mobile (`width` < 768) [`default-mobile`] → `glancer`; otherwise [`default-desktop`] → `menu-explorer`.

- [ ] **Step 1: Write failing tests** with an injected env (no globals): one test per rule asserting `audience` and `rule`; override beats referrer; unknown `?aud=zzz` and empty `?aud=` fall through (rule not `demo-override`, `signals.override` is `null`); malformed referrer (`'not a url'`) and own-host referrer give `signals.referrer === null`; unknown `stored` (`'bogus'`) ignored; `width` 767 → `glancer`, 768 → `menu-explorer`.
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement** `resolveAudience`; defaults read `window.location`, `document.referrer`, `window.innerWidth` only when `env` fields are undefined.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat(home-gen): audience resolver`.

### Task 3: Last-seen intent store

**Files:**
- Create: `scripts/home-gen/intent-store.js`
- Test: `test/home-gen/intent-store.test.js`

**Interfaces:**
- Consumes: `AUDIENCE_IDS`.
- Produces: `export const INTENT_KEY = 'amag-home-gen-intent'`; `export function readIntent(storage?: Storage): id|null`; `export function recordIntent(href: string, storage?: Storage): id|null` (maps a clicked destination to an audience and stores it; returns the id or `null` when nothing matched).

Mapping by substring of the path: `/service`, `termin`, `/user/login` → `service`; `storelocator`, `haendler`, `/suche` → `dealer`; `auto-finden`, `neuwagen`, `occasion`, `vorfuehr`, `nach-marken` → `car-shopper`.

- [ ] **Step 1: Write failing tests** with an in-memory fake storage: `recordIntent('https://www.amag.ch/de/service.html', fake)` returns `'service'` and `readIntent(fake)` returns it; `/de/auto-finden.html` → `car-shopper`; `/de/komponenten/storelocator.html` → `dealer`; unmatched href returns `null` and leaves storage unchanged; garbage stored value makes `readIntent` return `null`; a storage that throws on `getItem`/`setItem` is swallowed (returns `null`, no throw).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(home-gen): last-seen intent store`.

### Task 4: Why contract builder

**Files:**
- Create: `scripts/home-gen/why.js`
- Test: `test/home-gen/why.test.js`

**Interfaces:**
- Consumes: `AUDIENCES`, `EVIDENCE` (Task 1); the resolution shape from Task 2.
- Produces: `export function buildWhyContract(resolution, page: {generated: number, authoredFallback: boolean, sections: Array<{block: string, kind: 'generated'|'authored'}>}): Contract`; `export function publishWhy(contract): void` (sets `window.of1Why` and dispatches `new CustomEvent('of1:why', {detail: contract})` on `document`).

Contract content: title `'Why this page?'`; rows in this order: `['Audience', label]`, `['Rule', resolution.rule]`, `['Why', resolution.why]`, `['What the data shows', behaviour]`, `['What this page does', pageDoes]`, `['Generation', authoredFallback ? 'authored (fallback)' : \`generated (${generated} text slots)\`]`; lists: `Signals` (only signals with a value, as `key: value`), `Evidence` (the audience's `perAudience` items, then `Source: ${report}, ${domain}${path}, ${range}`, then `EVIDENCE.sample`), `Sections` (one item per section: `block — generated|authored`).

- [ ] **Step 1: Write failing tests**: `version === 1` and title; row order/labels above; `Generation` row both branches (fallback and generated with count 4); `Signals` list omits null signals; `Evidence` list ends with source line and sample line containing `2026-09-20 to 2026-10-20`; `Sections` items formatted `hero-carousel — generated`; no item has an `href` containing `//` (only same-site paths allowed); `publishWhy` with a fake `window`/`document` sets `window.of1Why` and dispatches one `of1:why` event whose `detail` equals the contract.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(home-gen): window.of1Why contract builder`.

### Task 5: Section selection and page wiring

**Files:**
- Create: `scripts/home-gen/index.js`
- Modify: `scripts/scripts.js` (`loadEager`: after `decorateMain(main)` add the call below; `loadLazy`: nothing)
- Test: `test/home-gen/index.test.js` (jsdom)

**Interfaces:**
- Consumes: `resolveAudience`, `readIntent`, `recordIntent`, `buildWhyContract`, `publishWhy`.
- Produces: `export function resolveMarkerDefaults(root: Element): number` (replaces `{{generate: ...}}{{default: ...}}` with the trimmed default, returns the number replaced, and strips `id^="generate-"` attributes); `export function applyAudience(main: Element, env?): {resolution, shown: Element[]}|null` (null when no `.section[data-audience]`; otherwise hides every section whose `data-audience` differs, sets `document.body.dataset.audience`, wires a one-time click listener that calls `recordIntent` for link clicks, resolves markers only when generation did not run, and publishes the contract).

Sections opt in via a `Audience` row in section-metadata (EDS turns it into `data-audience` on the section). A section with no `data-audience` is shown for every audience.

- [ ] **Step 1: Write failing tests** (jsdom): `resolveMarkerDefaults` replaces `{{generate: write a hero}}{{default: Find your car}}` with `Find your car`, leaves text without markers alone, handles multiple markers; `applyAudience` on a main with three sections (`car-shopper`, `service`, none) and `env.url` `?aud=service` hides the car-shopper section only and sets `body.dataset.audience === 'service'`; returns `null` and hides nothing on a main with no `data-audience` section; publishes `window.of1Why` once with `Generation` row `authored (fallback)` when markers were still present (unresolved) and `generated (N text slots)` when none remain; a click on `<a href="/de/service.html">` stores `service`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `index.js` with plain DOM calls. In `scripts.js` add `import { applyAudience } from './home-gen/index.js';` and call `applyAudience(main);` right after `decorateMain(main);` in `loadEager`.
- [ ] **Step 4: Run** `npm test` and `npm run lint` → PASS.
- [ ] **Step 5: Commit** `feat(home-gen): show audience sections and publish why contract`.

### Task 6: Author `/en/home-gen` and generation instructions in DA, verify end to end

**Files:**
- DA documents (not in repo): `/en/home-gen`, plus the `{{generate: ...}}` instructions inside it. Per the DA-first design, the old block-guide JSON is no longer read by the worker, so the guides are the per-slot instructions in the page and the brand voice already in DA at `/of1/brand-voice`.

- [ ] **Step 1: Read** `of1-skills/skills/of1-integration/knowledge/worker-config-schemas.md` and one existing generative page in DA (for example the `/of1` page and a template under `/templates/`) to copy the exact marker and section-metadata syntax and the DA write call. Needs `ADOBE_IMS_TOKEN` (see `of1-check-dependencies`); if it is missing, stop and ask.
- [ ] **Step 2: Author** `/en/home-gen` with one group of sections per audience, built from existing blocks (hero-carousel, quick-links, vehicle-search, service-offer, dealer-search, promo-teaser, cta-band, news-cards). Every audience section has an `Audience` row in its section-metadata. Per audience: car shopper leads with vehicle-search and new/used/e-mobility quick links; service leads with service-offer and booking; dealer leads with dealer-search; menu explorer gets a balanced quick-links hero; glancer gets a short hero with one call to action. Headline, subline and section-heading text in each section uses `{{generate: <instruction using the audience's behaviour line>}}{{default: <authored English text>}}`. Links, prices, legal text and images stay authored.
- [ ] **Step 3: Preview** the page (DA preview call). Run `curl -s https://main--aem-amag-demo--mtilburgadobe.aem.page/en/home-gen.plain.html | grep -c 'Audience'` → expect at least 5.
- [ ] **Step 4: Run the OF1 sync** for the tenant (Sync OF1 DA app, or `of1-publish`) so the worker sees the page and instructions.
- [ ] **Step 5: Verify in a browser** on the branch preview URL: for each id, open `/en/home-gen?aud=<id>` and confirm only that audience's sections are visible, `window.of1Why.rows[0][1]` is that audience's label (check with the browser console), and unresolved `{{` text never appears. Save a short note of results in `docs/superpowers/specs/2026-10-20-home-gen-verification.md` and commit it `docs: home-gen verification notes`.

### Task 7: AMAG PR

- [ ] **Step 1:** `npm test && npm run lint` pass. **Step 2:** push `feat/home-gen`; open a PR to `main` with the link `https://feat-home-gen--aem-amag-demo--mtilburgadobe.aem.page/en/home-gen`. Stop and report; do not merge.

---

## Part 2: Extension repo (`/Users/quentinvecchio/workspace/labs/of1-preview-extension`)

Do not use the main checkout. Create a worktree first:
`git -C /Users/quentinvecchio/workspace/labs/of1-preview-extension worktree add ../of1-preview-extension-why-contract -b feat/why-from-window-contract origin/feat/why-this-page`. All paths below are relative to that worktree. Read its `AGENTS.md` first.

### Task 8: Mount the Why section from `window.of1Why` without an island

**Files:**
- Modify: `src/content/mutator.ts` (`mountWhyContext`, `renderWhyContext`, `renderWhySection`, `renderInjectedDebug`)
- Modify: `src/injected/main.tsx` (the `mountWhyContext(readContextIsland())` call)
- Test: `tests/content/mutator.test.ts`, `tests/injected/main-why.test.ts`

**Interfaces:**
- Changes: `mountWhyContext(island: ContextIsland | null): boolean` now returns `true` and mounts when either `island?.homeVariant` is an object **or** `window.of1Why` is a valid contract (`version === 1`). With no island it uses an empty island `{ v: 1 }` internally. When neither exists it returns `false` and does nothing, as today.
- New behavior: it also mounts later. If it returned `false` and an `of1:why` event arrives with a valid contract, it mounts then (register the document listener at module level once in `startOf1Display`, via a new exported `armWhyContext(readIsland: () => ContextIsland | null): void`).
- `renderWhySection` falls back to island rows only when there is an island `homeVariant`; with no island and no model it renders nothing.

- [ ] **Step 1: Write failing tests** in `mutator.test.ts`: (a) `window.of1Why` valid + island `null` → `mountWhyContext(null)` returns `true`, the `#of1-why` section is visible and contains a row from the contract; (b) no island and no `window.of1Why` → returns `false`, no section; (c) `of1Why.version === 2` or a non-object → returns `false`; (d) mounted widget, then an `of1:why` event with different rows → the section re-renders with the new rows; (e) rows with non-string values and a list item with `href: '//evil.com'` render without throwing and without a link; (f) an `of1:why` event dispatched **before** `armWhyContext` is a no-op; dispatched after arming, with no prior mount, it mounts. In `main-why.test.ts`: `startOf1Display` with no island and a pre-set `window.of1Why` shows the section.
- [ ] **Step 2: Run** `npx vitest run tests/content/mutator.test.ts tests/injected/main-why.test.ts` → FAIL.
- [ ] **Step 3: Implement** the changes above; keep every existing test passing (island path unchanged).
- [ ] **Step 4: Run** `npx biome check . && npx tsc --noEmit && npm test` → all PASS.
- [ ] **Step 5: Commit** `feat(widget): mount why-this-page from window.of1Why without an island`.

### Task 9: Evidence list is rendered like any list, documented in the contract

**Files:**
- Modify: `src/shared/types.ts` (add `export interface WhyContract` with the contract shape above, and use it for `WhyModel` in `mutator.ts`)
- Create/Modify: `docs/why-this-page-contract.md` (one page: the contract, the `of1:why` event, the `Evidence` list convention with an AMAG example, `?of1-debug=1`)
- Test: `tests/content/mutator.test.ts`

- [ ] **Step 1: Write failing test**: a contract with a list titled `Evidence` and three items renders a titled list with three `li` in order, one of them a same-site link with an `a[href="/de/service.html"]`.
- [ ] **Step 2: Run** → FAIL only if rendering needs changes; if it already passes, keep the test as a pin and go on.
- [ ] **Step 3: Implement** the type extraction and the doc.
- [ ] **Step 4: Run** `npx biome check . && npx tsc --noEmit && npm test` → PASS.
- [ ] **Step 5: Commit** `docs(widget): why-this-page contract and Evidence list`.

### Task 10: End-to-end check and extension PR

- [ ] **Step 1: Build** the injected script: `npm run build:injected`.
- [ ] **Step 2: Verify** on the AMAG branch preview `/en/home-gen?aud=car-shopper` with the injected `dist-injected/of1-tracker.js` loaded (see `docs/injected-embedding.md`): the widget shows "Why this page?" with the audience, rule, signals, an Evidence list ending in the source line with `2026-09-20 to 2026-10-20`, and the Sections list; switching to `?aud=service` changes it. Record the result in the PR description.
- [ ] **Step 3:** push `feat/why-from-window-contract`; open a PR to `main`. Stop and report; do not merge or release.

---

## Self-review notes

- Spec coverage: five audiences and evidence (T1), resolver incl. demo override and stored intent (T2, T3), contract with generated/authored split and fallback (T4, T5), `/en/home-gen` in DA with markers (T6), widget mount without island and evidence list (T8, T9), AMAG-first PR order (T7 before Part 2), no changes to `main` checkout or the Chrome extension build (worktree; only the injected path).
- Not covered on purpose (non-goals): replacing `/de`, automatic audience derivation, DA editing UI.
