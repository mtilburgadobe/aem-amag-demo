<!-- stardust:provenance
  writtenBy:        stardust:extract
  writtenAt:        2026-10-08T15:45:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/assets/css/clientlib-amagch.css
    - stardust/current/pages/en-html.json
    - stardust/current/pages/en-services-html.json
    - stardust/current/pages/en-komponenten-car-dealers-html.json
    - stardust/current/pages/de-service-auto-services-online-termin-buchen-html.json
    - stardust/current/pages/de-service-reifen-und-raeder-winterreifen-html.json
  synthesizedInputs: []
  stardustVersion:  0.29.1
  mode:             replica / same-design migration — descriptive of the existing site
-->
---
name: AMAG
description: Switzerland's largest automotive retailer — find a vehicle, book a service, find a garage
colors:
  white: "#ffffff"
  black: "#000000"
  ink: "#222222"
  line: "#e8e8e8"
  amag-blue: "#172983"
  amag-purple: "#801977"
  stone: "#6f6d6a"
  divider: "#bdbdbd"
  lilac-surface: "#ede7fe"
  cyan: "#009ee0"
  green: "#006431"
  bootstrap-link: "#007bff"
  bootstrap-link-hover: "#0056b3"
  input-border: "#ced4da"
typography:
  display:
    fontFamily: "amag_displaybold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "54px"
    fontWeight: 500
    lineHeight: "60px"
    letterSpacing: "normal"
  headline:
    fontFamily: "amag_displaybold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "normal"
  title:
    fontFamily: "amag_displaybold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: "36px"
    letterSpacing: "normal"
  subtitle:
    fontFamily: "amag_displaybold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "28px"
    letterSpacing: "normal"
  card-title:
    fontFamily: "amag_displaybold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "30px"
    letterSpacing: "normal"
  body:
    fontFamily: "amag_textlight, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "normal"
  body-small:
    fontFamily: "amag_textlight, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "normal"
  label:
    fontFamily: "amag_textbold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "normal"
rounded:
  xs: "2px"
  sm: "4px"
  pill: "100px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  gutter-half: "15px"
  md: "20px"
  gutter: "30px"
  lg: "40px"
  xl: "80px"
  section: "100px"
  section-lg: "120px"
  header-sm: "75px"
  header-md: "120px"
  header-lg: "160px"
  container-md: "720px"
  container-lg: "960px"
  container-xl: "1140px"
components:
  button-primary:
    backgroundColor: "{colors.amag-blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0 40px"
    height: "70px"
  button-primary-lg:
    backgroundColor: "{colors.amag-blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0 40px"
    height: "100px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.amag-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0 40px"
    height: "70px"
  button-pill:
    backgroundColor: "{colors.line}"
    textColor: "{colors.black}"
    typography: "{typography.body-small}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "60px"
  button-dark:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
  nav-link:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.amag-purple}"
  breadcrumb-link:
    textColor: "{colors.stone}"
    typography: "{typography.body-small}"
  breadcrumb-link-hover:
    textColor: "{colors.black}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
    height: "38px"
  card-news:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    typography: "{typography.card-title}"
    rounded: "0px"
  footer:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    typography: "{typography.body-small}"
  wizard-step-active:
    backgroundColor: "{colors.amag-purple}"
    textColor: "{colors.white}"
---

# Design System: AMAG

## Overview

**Creative North Star: "The Showroom Floor"**

The existing amag.ch is a white, wide, retail surface: large photographic stages of cars, a tall fixed header (160px on desktop) that behaves like a dealership reception, and content laid out as rows of flat tiles and cards on a Bootstrap 4 grid. Type does almost all the branding work — the proprietary `amag_display` / `amag_text` families at generous sizes (20px body, 32px section titles, 44–54px stage headlines) — while color is used sparingly: black text on white, a single dark blue (#172983) for primary actions and icon line-art, and purple (#801977) reserved for hover and active states. Depth is nearly absent; surfaces are flat, radii are 2–4px, and the only shadow the census found belongs to the third-party consent button.

Density is low and vertical rhythm is long: sections are separated by 100–120px margins, bands (newsletter, jobs) are full-width 1440×400 photographs with one white CTA, and benefit rows repeat the same three-pillar "pledge" on home, services and detail pages. The result reads as corporate-retail: confident, catalogue-like, offer-led (prices in CHF appear in headlines), and tidy rather than expressive.

This document is descriptive of the current site for a same-design migration. It does not propose changes.

**Key Characteristics:**
- White ground, black text, one working blue, purple for interaction states
- Oversized proprietary type: 20px body, 32px titles, 44–54px headlines, all line-heights tight (1.09–1.5)
- Flat surfaces, 2px/4px radii, no brand shadows
- Full-bleed photographic stages and 1440×400 divider bands
- Bootstrap 4 skeleton (containers 540/720/960/1140, 30px gutters, `.form-control`, `.btn` defaults leaking through)
- Repeated three-pillar pledge row and black mega footer as site-wide chrome

## Colors

A near-monochrome retail palette with a single corporate blue, a purple reserved for interaction, and framework blue leaking into content links.

### Primary
- **AMAG Blue** (#172983): Primary button fill (`.amag-ctaWrapper__button--bgColor-amagDark-blue`, `.process-container__button--next`, store-locator "show garages"), 2px outline/border on secondary buttons, text on outline buttons and dealer-detail copy, line icons in the services grid. Census weight 334 across all 5 pages, bgArea 2.85M px².

### Secondary
- **AMAG Purple** (#801977): Hover color on main-nav links (`nav > ul > li > a`, black → purple on 3 pages), active step in the booking progression bar, highlighted dropdown rows. Weight 45; never a resting fill on content.

### Tertiary
- **Lilac Surface** (#ede7fe): Background-only tint, 6 occurrences but 1.48M px² — a light purple section ground.
- **Cyan** (#009ee0) and **Green** (#006431): Background-only accents (4 and 2 occurrences) on single tiles; not system colors.
- **Bootstrap Link** (#007bff → hover #0056b3): 541 link occurrences. The Bootstrap 4 default anchor color is unthemed and shows in content links and `.btn-primary`. `--primary` ships as `#007bff` while the brand's actual primary is #172983.

### Neutral
- **White** (#ffffff): Page and header background (193M px²), button text, footer text.
- **Black** (#000000): Body and nav text (1502 text hits), footer background (`.amag-footer`), dark "show more" button.
- **Ink** (#222222): Secondary text (1010 hits) and dark tile/legal-bar backgrounds.
- **Stone** (#6f6d6a): Breadcrumb and muted text (hover → black).
- **Line** (#e8e8e8): Borders (544) and pill-button fill; the most common divider.
- **Divider** (#bdbdbd): Accordion item borders (`.cmp-accordion__item`).
- **Input Border** (#ced4da): Bootstrap `.form-control` default.

### Named Rules
**The One Blue Rule.** #172983 is the only color allowed to fill a button or draw an icon; purple appears only in response to hover/active/focus, never at rest.

**The Black Footer Rule.** The footer is the single black surface on every page; content sections stay white (or lilac) so the footer reads as the floor.

## Typography

**Display Font:** amag_displaybold (with -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)
**Body Font:** amag_textlight (same system fallback)
**Label Font:** amag_textbold (buttons, nav, card titles); amag_displaylight appears twice (2 text hits) and is effectively unused

**Character:** A proprietary corporate grotesque pair — a bold display cut for every heading level and a light text cut for copy — set large and tight. Weight contrast comes from switching family (bold vs light), not from `font-weight`; all four `@font-face` rules declare 400, and the theme sets 500 on headings.

### Hierarchy
- **Display** (amag_displaybold 500, 54px, 60px): `.amag-headline--h1`, stage/hero headline — observed once (home carousel).
- **Headline** (amag_displaybold 500, 44px, 48px): H1 on interior pages (census h1 representative, 8 hits), `.amag-headline--h2`.
- **Title** (amag_displaybold 500, 32px, 36px): H2 and H3 section titles — the workhorse (55 heading hits).
- **Subtitle** (amag_displaybold 500, 24px, 28px): H4 eyebrow-style section intros ("Your dream car from AMAG", 28 hits).
- **Card title** (amag_displaybold 500, 20px, 30px): H5 tile titles and accordion toggles (63 heading hits at 20px).
- **Body** (amag_textlight 400, 20px, 30px): `.amag-copy--bigLight` — paragraphs, list items (88 text hits). Hero copy variant 24px/30px.
- **Body small** (amag_textlight 400, 16px, 24px): `.amag-copy--smallLight` — footer, breadcrumb, meta (24 hits).
- **Label** (amag_textbold 400, 20px / 16px): `.amag-ctaWrapper__button`, nav items, 45 button hits.

Scale audit: ad-hoc (44→32→24→20 = 1.375 / 1.333 / 1.2; theme ramp 54→44→32→24→20→16 also uneven). No letter-spacing is set anywhere; headings are sentence case (0% uppercase); uppercase appears only on small eyebrow labels (WELCOME TO AMAG, SERVICES, OUR AMAG PLEDGE).

### Named Rules
**The Family-Not-Weight Rule.** Emphasis is expressed by switching to `amag_textbold` / `amag_displaybold`; never synthesize bold with `font-weight: 700`.

## Layout

Bootstrap 4 grid: `.container` max-width 540px at ≥360, 720px at ≥768, 960px at ≥1200 and 1140px at ≥1920 — a custom tier that keeps content narrower than default on 1200–1919px viewports. Rows use 30px gutters (`.row` margins −15px). Breakpoints in use: 360 / 768 / 1200 / 1920.

The header is `position: fixed` with `--header-height` 75px (mobile), 120px (≥768) and 160px (≥1200); page content starts below it. Full-bleed stages (1920×1080 renditions), 1440×400 divider bands and the full-viewport dealer map break out of the container; everything else sits inside it.

Vertical rhythm is long: `.amag-marginBottom` 100px / 120px between modules, 80px between brand presentations, 40px between carousel sub-rows, footer padding-bottom 120px (≥1200). Cards and tiles align to 2-, 3- and 4-up rows (news 3-up, promo teasers 4-up, pledge 3 pillars, service icon grid 12 items in 4 columns at desktop). The booking wizard uses a left 5-step rail with the form on the right; the dealer page splits map (full viewport) and a search panel.

## Elevation & Depth

Flat. The only box-shadow found by the census (rgba(0,0,0,.2) 0 4px 8px, 20 hits) belongs to the OneTrust floating consent button; the two remaining shadow values (6 and 2 hits) have no resolved brand source. Depth is conveyed by photography, by the black footer against white content, by 1px #e8e8e8 / #bdbdbd rules, and by fixed-header overlap. One gradient exists: a 90° white fade (`rgba(255,255,255,0) → #fff 92.14%`) at the edge of a horizontal scroller.

### Named Rules
**The No-Shadow Rule.** Brand surfaces carry no box-shadow at rest or on hover; separation is by whitespace and hairlines.

## Shapes

Near-square. 2px (385 hits — carousel buttons, search buttons, process buttons) is the theme's own radius; 4px (152 hits, Bootstrap `.25rem` on `.btn` / `.form-control`) wins by area. 3.2px (18) is a Bootstrap `.2rem` leftover. Pills exist only on the `.amag-direct-entry__button` (100px, 60px tall, #e8e8e8 fill) and circular icon chips (50%). Cards and images are unrounded; the news card is a 2:1 image with text below and no frame. Accordion items are hairline-separated rows (1px #bdbdbd top, last item bottom), not boxes.

## Components

### Buttons
- **Shape:** near-square (2px radius); min-height 70px, 100px at ≥1200px; horizontal padding 40px; amag_textbold 20px.
- **Primary:** AMAG Blue fill (#172983) with white text — `.amag-ctaWrapper__button--bgColor-amagDark-blue`, `.process-container__button--next` (padding 20px; 35px 80px and min-width 220px at ≥1200).
- **Hover / Focus:** No color shift on `.amag-ctaWrapper__button:hover` (stays white on blue); stage-carousel buttons fill #172983 on hover; Bootstrap `.btn-primary` (unthemed, #007bff → #0069d9) survives in some form areas.
- **Secondary / Outline:** transparent with 1px (displayAsLink) or 2px #172983 border and blue text; `.process-container__button--back` is a text link with a 2px blue underline border.
- **Pill (ghost):** `.amag-direct-entry__button` — #e8e8e8 fill, 100px radius, 60px tall, 0 18px padding, `transition: all .3s ease`.
- **Dark:** `.amag-promotionTeaserBox__showMoreBtn` — black fill, white text ("Show more").

### Cards / Containers
- **Corner Style:** 0 (news, promo, maxi-teaser) — 4px only where Bootstrap `.card` is used (accordion shell).
- **Background:** white; promo tiles and one legal block use #222222; occasional lilac #ede7fe ground.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none on cards; 1px #bdbdbd between accordion items.
- **Internal Padding:** not captured per card; module spacing 100–120px.

### Inputs / Fields
- **Style:** Bootstrap `.form-control` — 1px #ced4da border, 4px radius, 6px 12px padding, 38px tall (calc(1.5em + .75rem + 2px)), 16px text.
- **Focus:** border #80bdff + `0 0 0 .2rem rgba(0,123,255,.25)` ring (framework default, not brand blue).
- **Error / Disabled:** not observed.

### Navigation
- **Style:** fixed white header, 160px tall at desktop, composed top-down of a black-icon utility bar (Electromobility / AMAG Group / No. 1 with 90 locations), the "AMAG Emotion Days" campaign strip, then logo (white-fill SVG 67×24) + four main items (Find a vehicle, Services, Find garage, Jobs) + "My garage" saved-dealer widget + language switch (en / de / fr / it).
- **Typography:** amag_textbold 20px, black at rest, purple #801977 on hover; mega-menu panels list topic columns with brand logos (VW, Audi, SEAT, Škoda, CUPRA, VW Nutzfahrzeuge, Bentley, Microlino).
- **Mobile:** 75px header, "Choose menu" drawer with Back navigation per level (captured in header text).
- **Breadcrumb:** `nav > ol`, #6f6d6a links → black on hover, 16px.

### Pledge Row (signature)
Three pillars under a 32px title ("Our AMAG pledge" / "More than just a service"): each pillar is a 20px bold label (Full transparency · Greater safety · Best service) followed by 4–5 light-weight bullet lines (Largest selection of vehicles, Free test drive, 15 day right of exchange, Breakdown assistance 24h …). Repeats on 3 of 5 pages.

### Divider Band (signature)
Full-width 1440×400 photograph with a 32px white headline and one white-outline CTA ("Subscribe to newsletter", "About the jobs"). Used for newsletter (home, services) and jobs (home).

### Dealer Search (signature)
Full-viewport Google Map behind a "Search garage" panel (input, "Show filters", result list of garages with address, "Call" tel: link and "Route" Google-Maps link — 43 instances).

### Booking Wizard (signature)
Five tab steps (Leistung / Garage / Termin / Daten / Buchung) in a left rail; active step purple (`.progression-bar.step.active` #801977). Form area "Ihr Fahrzeug" with brand select, primary "Weiter zur Leistung" and text-link "Anmelden"; a benefits list for the customer account sits beside it.

## Do's and Don'ts

### Do:
- **Do** set all headings in amag_displaybold at the theme ramp (54/60, 44/48, 32/36, 24/28, 20/30, 16/24) and body in amag_textlight 20px/30px.
- **Do** keep #172983 as the only button fill and icon color; use #801977 only for hover/active states.
- **Do** keep radii at 2px for themed buttons and 4px only where Bootstrap controls remain.
- **Do** keep the footer black (#000) with white text and the header white and fixed at 160px/120px/75px.
- **Do** separate modules with 100–120px vertical space and keep containers at 960px (≥1200) / 1140px (≥1920).

### Don't:
- **Don't** add box-shadows to cards, buttons or the header — none exist on brand surfaces.
- **Don't** synthesize bold with `font-weight: 700`; switch family instead (all faces are declared 400).
- **Don't** round images, cards or tiles; only the direct-entry pill (100px) and icon circles are round.
- **Don't** introduce letter-spacing or uppercase headings; uppercase is reserved for small eyebrow labels.
- **Don't** treat #007bff / #0056b3 as brand colors — they are Bootstrap defaults leaking through unthemed links.
