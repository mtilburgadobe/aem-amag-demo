# Learnings — amag.ch replica run (2026-10-08 → 2026-10-09)

### Published-origin rows failed on text wrapping because the two sides were shot in different browsers
- failure class: capture-gap (instrument asymmetry)
- evidence: `/de/service/reifen-und-raeder/winterreifen` at 360: 22.88 % / Δh 134 after three fix rounds while 1440 sat at 1.85 %; `measure.mjs` same-browser showed gate-all shoots the origin in the `--headed` real-Chrome tier (needed to clear Akamai) and the EDS side in bundled Chromium, which wraps the AMAG text face differently — live 14875 px headed vs 14741 headless. With `gate-all.mjs --same-browser` the row read 4.17 % / Δh 0 with no block change.
- proposed change: `skills/replica/reference/source-fidelity-gate.md` § The all-pages published-origin gate — make same-browser capture the default whenever the origin needed the headed tier (and say so in `gate-all.mjs --help`); `skills/replica/scripts/gate-all.mjs` — pick the EDS side's browser from the origin's tier instead of a flag.
- status: pending

### Units probe at 360 paired the build against the 1440 origin inventory
- failure class: capture-gap (stale per-width cache)
- evidence: first 360 `gate-all` pass showed `units off` on every page (origin docH 8205, desktop-sized boxes at `--width 360`) because the probe reused the origin inventory cached by the 1440 run (same `origin.at`). Per-width caches: booking and dealers 0 off.
- proposed change: `skills/replica/scripts/gate-all.mjs` (units probe) — key the origin inventory cache by width, never by page alone; `skills/replica/reference/source-fidelity-gate.md` § Pass bar item 7 — state that the family inventory is per width.
- status: pending

### JSON-LD findings were left manual although the source carried a site-wide graph
- failure class: platform-migration gap (no head.html fixer)
- evidence: `autofix-aem.mjs --dry-run` → 5 × `eds-jsonld` manual ("place via head.html / metadata pipeline"); every source capture (`stardust/current/pages/<slug>.html`) carries one `application/ld+json` graph (Organization + WebSite, identical apart from the per-page `url`). The fix was one appended block in `head.html`, lifted from the capture with the origin repointed; health went 75 → 100.
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` — an `eds-jsonld` fixer that, when every capture's JSON-LD agrees apart from page URLs, appends the site-wide graph to `head.html` (urls on the live origin, logo on a published asset, SearchAction dropped unless its target is in scope); `skills/rollout/SKILL.md` § Phase G — name head.html as the JSON-LD placement for raw-HTML checks.
- status: pending

### Block rows stayed `pending` in coverage through delivery
- failure class: ledger-gap
- evidence: at Phase H `rollout.json.lastRun.blocks` read 17 total · 0 converted · 17 pending while all 17 blocks were deployed and the pages verified at the published origin; nothing in the C-deliver chain calls `update-coverage.mjs --block … --status`, so the report's Blocks line was wrong until the rows were flipped by hand in H.
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (cluster chain) and `skills/rollout/SKILL.md` § Phase C — after a page's PUT → preview → live, flip each of its plan blocks with `update-coverage.mjs --block <id> --status deployed` (and `verified` after E-full-site); or derive block status from page status in `inventory.mjs`.
- status: pending

### Modal stayed announced as an open dialog after Escape
- failure class: dynamic-gap (key-driven close not observed)
- evidence: D2 replay `click-dialog` on the garage chooser (`/en/services`): opened fine, but after Escape the closed modal kept `role=dialog` + `aria-modal` (Bootstrap shape; `display:none` hid it visually). `motion-observe` / `motion-compare` pokes are click/hover only, so the archetype's interaction parity never exercised the key path. Fixed in `blocks/garage-chooser/garage-chooser.js` (`hidden` after the fade, `aria-modal` dropped).
- proposed change: `skills/replica/reference/recreation-procedure.md` § Interaction parity and `skills/replica/scripts/motion-observe.mjs` — add a `--key Escape` poke after every `--click` that opens a dialog, and compare the closed state's `hidden`/`aria-modal` as a behavior line.
- status: pending

### Source root redirected to a page outside the run's scope
- failure class: scope-gap (root answer on a page-scoped run)
- evidence: `https://www.amag.ch/` 301s to `/de.html`, not in the five-page plan; the "root MUST answer" rule in Phase D had no documented path for a scoped run. Decided locally: `/` and `/index.html` → `/en` (the delivered landing page) in the redirects sheet; recorded in `stardust/eds-conversion-log.md`.
- proposed change: `skills/rollout/SKILL.md` § Phase D — for `scope.mode: pages` runs whose source root target is out of scope, redirect the root to the delivered page nearest the source root's locale (or the first plan page) and record the choice; `skills/replica/reference/handoff-contract.md` § 3 row D — one line for the same rule.
- status: pending
