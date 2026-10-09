---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-08T15:07:31Z
  againstInput: https://www.amag.ch/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.amag.ch/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-08T15:07:31Z). Provenance: verbatim `--prep` promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: the 5 pages of stardust/.labs/site-plan.json, one archetype per page type
(landing, program, unique, form, article). Source breakpoints kept (no --target-breakpoints).
Cap divergences between archetypes (DESIGN.json extensions.breakpoints.capRegister) are
per-template design intent and stay as captured.

## Link targets outside the five-page scope (rollout E2, 2026-10-09)
Decision: **scope extension → repoint.** The plan fixes the roster at five pages; every other target the
delivered pages and chrome link to (dealer pages, locale roots, account, marketplace, events, further
services — the full list with per-target counts is in `stardust/rollout/link-audit.md`) is outside the
declared scope, so those hrefs keep the source origin `https://www.amag.ch/…` and are not scope debt
of this run. No capture gap: `state.json` records none, and no source-origin link points at an
in-scope page (`localize-links.mjs --check`: PASS, 0 still localizable). The five internal targets,
`/nav`, `/footer` and their `/de` variants are published and answer 200.
