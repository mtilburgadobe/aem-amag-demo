<!-- stardust:provenance writtenBy=stardust:replica writtenAt=2026-10-08T15:10:06Z input=stardust/dynamic-features.md -->
# Dynamic features plan — www.amag.ch (5-page replica)

Static first, then wire. Phases map onto the replica pipeline.

## Phase A — interaction parity (replica Phase 3/4, per archetype) — self
Deliverables: header overlays + language switch + my-garage flyout (row 1), hero carousel (row 2), accordions (row 3),
garage modal (row 7), native selects (row 9). Authoring contract: motion OBSERVED with motion-observe.mjs, only fired
behaviours implemented; block JS only, no external data. Verification: motion-compare.mjs parity lines; pixel number
returns to the gated value. Effort: S–M per archetype.

## Phase B — data snapshot (rollout B2) — self
Deliverables: storelocator stores + synonyms JSON snapshot in the code bus (row 6); garage finder list + static map
(row 5 interim). Verification: list count equals the snapshot; links resolve. Effort: S.

## Phase C — interim tiers (rollout B2 / C-deliver) — owner decision named
Deliverables: booking wizard step-1 UI with link-out (row 8), vehicle-search UI with link-out (row 4), account links
to source (row 11), out-of-scope locale links to source (row 16), newsletter + announcement bar as captured (rows 20–21).
Verification: content-presence 0 MISSING; no dead links. Effort: S.

## Phase D — owner-gated wiring (after the decision batch) — needs-backend / needs-business-decision
Deliverables: OneTrust + GTM + chat (rows 12–14, 18) via head/scripts delayed.js; reCAPTCHA (row 10); booking APIs
(row 8) through same-origin endpoint indirection; map API key (row 5); identity provider (row 11, 22).
Verification: dynamics-check.mjs replay; parity report. Effort: M, blocked on the owner's answers.

## Dropped as noise
Row 19 (AEM runtime objects and files) — platform runtime with no page content; nothing to migrate.
