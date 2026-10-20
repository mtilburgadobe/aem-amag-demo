/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AMAG (www.amag.ch) site-wide cleanup.
 *
 * Every selector below was verified in migration-work/cleaned.html
 * (source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html; template-specific lists
 * for `home` and `storelocator` were verified against those templates' captures).
 *
 * IMPORTANT: inactive tab panels of the tab module (`.amag-introTabModul .cmp-tabs__tabpanel`
 * without `--active`) are hidden on the source page but their content IS imported — nothing in
 * here removes hidden elements generically.
 *
 * Images: plain <img> elements are kept (no Dynamic Media carrier anchors). Relative image URLs
 * are made absolute against https://www.amag.ch so they are ingested as regular media.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };
const ORIGIN = 'https://www.amag.ch';

function absolutize(url) {
  if (!url) return url;
  const u = url.trim();
  if (!u || u.startsWith('data:') || u.startsWith('blob:') || /^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
  if (u.startsWith('//')) return `https:${u}`;
  try {
    return new URL(u, `${ORIGIN}/`).href;
  } catch (e) {
    return u;
  }
}

// Template `home` (https://www.amag.ch/de.html) — selectors verified in migration-work/cleaned.html.
// Kept separate from the shared lists so the `garagenuebersicht` output stays byte-identical.
const HOME_BEFORE = [
  // Floating "Direkt zu" pill: <div class="amag-direct-entry"> (a block on the garage template,
  // non-authorable chrome on home)
  '.amag-content > .amag-direct-entry',
  '.amag-direct-entry',
  // Stage carousel chrome no parser consumes. The slides (.cmp-carousel__item) and the quick links
  // (.amagCh-stageCarousel__buttons--noPadding) stay for the hero-carousel / quick-links parsers.
  // <div class="cmp-carousel__actions"> (prev / next / pause / play buttons)
  '.amagCh-stageCarousel .cmp-carousel__actions',
  // the indicator list (.cmp-carousel__indicator-container) stays: the hero-carousel parser reads
  // each slide's indicator label from it (cell 4); HOME_AFTER removes any leftover
  // Video slide progress bar + empty backdrops:
  // <div class="amag-stageTeaserVideo__progressbar">, <div class="amag-stageTeaserVideo__videoBackdrop">,
  // <div class="amag-stageTeaserImage__imageBackdrop">
  '.amagCh-stageCarousel .amag-stageTeaserVideo__progressbar',
  '.amagCh-stageCarousel .amag-stageTeaserVideo__videoBackdrop',
  '.amagCh-stageCarousel .amag-stageTeaserImage__imageBackdrop',
  // "Accept cookies to watch the video" banner in the stage video slides:
  // <div class="cookie-video-banner__container"> (sibling of .amag-stageTeaserVideo__player,
  // which is kept)
  '.amagCh-stageCarousel .cookie-video-banner__container',
  // AMAG Bot chat iframe wrapper: <div class="frontnow-advisor-container frontnow-hidden">
  '.frontnow-advisor-container',
];

const HOME_AFTER = [
  // Global footer: <footer> (contains the hr.amag-hrBreak separators, which would otherwise
  // become section breaks)
  'footer',
  '.amag-footer',
  '.amag-direct-entry',
  // Header pop-up notification (lives in #header; leftovers only):
  // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
  '.amag-pop-up',
  '.amag-pop-up__wrapper-before',
  '.frontnow-advisor-container',
  '.frontnow__backdrop',
  // Leftover carousel controls (any carousel, after the parsers ran)
  '.cmp-carousel__actions',
  '.cmp-carousel__indicator-container',
  // Video cookie-consent overlays left after parsing: <div class="cookie-video-overlay__container">
  // (.amag-videoComp) and <div class="cookie-video-banner__container"> (stage slides)
  '.cookie-video-overlay__container',
  '.cookie-video-banner__container',
  // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
  // the template's content fragment, so the generic 'script' removal cannot reach it)
  'template',
];

// Template `storelocator` (https://www.amag.ch/de/komponenten/storelocator.html) — selectors
// verified in migration-work/cleaned.html. Kept separate so `garagenuebersicht` / `home` stay
// byte-identical. NOT removed here (the dealer-search parser needs them; hidden at rest on the
// source): `.amag-direct-entry` ("Direkt zu" pill, read + removed by the parser), the garage
// detail modals `.amag-garagenModal` incl. their `.amag-rating__container` badge iframe, the
// off-canvas filter panel `aside.off-canvas__wrapper` (has its own <header>/<footer>, hence no
// bare `header` / `footer` selectors below), and any hidden elements inside the component.
const STORELOCATOR_BEFORE = [
  // AMAG chat bot wrapper: <div class="frontnow-advisor-container frontnow-hidden"> (not in the
  // capture, injected at runtime; launcher/popover/backdrop are in the shared list)
  '.frontnow-advisor-container',
];

const STORELOCATOR_AFTER = [
  // Global footer: <footer> as a direct body child (no id/class; contains the
  // hr.amag-hrBreak separators, which would otherwise become section breaks).
  // `.amag-footer` = <div class="container-fluid amag-footer pl-0 pr-0"> inside it (fallback).
  'body > footer',
  '.amag-footer',
  'hr.amag-hrBreak',
  // Header pop-up notification (lives in <header id="header">; leftovers only):
  // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
  '.amag-pop-up',
  '.amag-pop-up__wrapper-before',
  '.frontnow-advisor-container',
  '.frontnow__backdrop',
  // Empty select2 dropdown containers (leftovers): <div class="select2-single-container">,
  // <div class="select2-multi-container">
  '.select2-single-container',
  '.select2-multi-container',
  // Empty infrastructure info div: <div id="amag-infrastructure-info">
  '#amag-infrastructure-info',
  // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
  // the template's content fragment, so the generic 'script' removal cannot reach it)
  'template',
];

// Template `service` (https://www.amag.ch/de/service.html) — selectors verified in
// migration-work/cleaned.html. Kept separate so `garagenuebersicht` / `home` / `storelocator` stay
// byte-identical. NOT removed here (parsers consume them): `.amag-content > .amag-direct-entry`
// (direct-entry parser, section 7), `.amag-promotionTeaserBox` incl. its "Mehr anzeigen" control
// (news-cards parser), and the contact band's garage chooser
// `.amag-kontaktaufnahme .amag-garageElectionOverlay .amag-garageOverlay--noCookie .amag-garageOverlay`
// (garage-chooser parser) with its "Garage kontaktieren" button. Header/footer are matched as body
// children only, so a <header>/<footer> inside a block would survive.
const SERVICE_BEFORE = [
  // Global header (already migrated as /de/nav; contains the header pop-up
  // .amag-pop-up__wrapper--desktop|--mobile): <header id="header"> as a direct body child
  'body > header#header',
  // Global footer (already migrated as /de/footer): <footer> as a direct body child (no id/class),
  // incl. its three <hr class="amag-hrBreak w-100"> separators, which would otherwise become
  // section breaks
  'body > footer',
  // AMAG chat bot wrapper: <div class="frontnow-advisor-container frontnow-hidden"> (not in the
  // capture, injected at runtime; launcher/popover/backdrop are in the shared list)
  '.frontnow-advisor-container',
  // Hero duplicate 1 — the 100-garage picker modal inside the hero CTA (each entry links to
  // /de/service/otv.html#<id>): <div id="garageModal-…" class="amag-garageOverlay modal fade">
  // inside <div class="amag-introService__otvCta d-flex">. The contact band's copy (garage-chooser
  // block) lives in .amag-kontaktaufnahme and is NOT matched by this selector.
  '.amag-introService .amag-garageOverlay',
  // Hero duplicate 2 — cookie variant of the hero CTA ("IHRE GEMERKTE GARAGE -- Ändern" +
  // "Termin vereinbaren"): <div class="amag-otvCtaWrapper--cookie d-none">. The sibling
  // <div class="amag-otvCtaWrapper--noCookie"> (single "Termin vereinbaren") is kept.
  '.amag-introService .amag-otvCtaWrapper--cookie',
  // Video cookie-consent overlay ("Es gibt viel zu sehen! … Cookie-Richtlinien"):
  // <div class="cookie-video-overlay__container"> in .amag-videoComp__playerContainer. The
  // video-brand-film parser drops it anyway and reads only [data-vi16_9_url] / iframes; removing
  // it up front keeps its text out of the output if the parser unwraps a URL-less instance.
  '.amag-videoComp .cookie-video-overlay__container',
  '.amag-videoComp .cookie-video-banner__container',
  // Cookie variant of the contact band's button ("Garage kontaktieren", no modal):
  // <div class="amag-garageOverlay--cookie d-none"> in .amag-kontaktaufnahme .amag-garageElectionOverlay
  // (the --noCookie sibling holding the garage-chooser modal is kept)
  '.amag-kontaktaufnahme .amag-garageOverlay--cookie',
];

const SERVICE_AFTER = [
  // Leftovers in case the before-hook missed them (see SERVICE_BEFORE)
  'body > header',
  'body > footer',
  '.amag-footer',
  // Header pop-up notification (lives in <header id="header">; leftovers only):
  // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
  '.amag-pop-up',
  '.amag-pop-up__wrapper-before',
  '.frontnow-advisor-container',
  '.frontnow__backdrop',
  '.cookie-video-overlay__container',
  '.cookie-video-banner__container',
  // Empty select2 dropdown containers at body level: <div class="select2-single-container">,
  // <div class="select2-multi-container">
  '.select2-single-container',
  '.select2-multi-container',
  // Empty infrastructure info div: <div id="amag-infrastructure-info">
  '#amag-infrastructure-info',
  // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
  // the template's content fragment, so the generic 'script' removal cannot reach it)
  'template',
];

// Shared before-hook selectors that must survive on `storelocator` until its parser has run.
// <div class="amag-rating__container amag-rating__container--storeLocator"><iframe src="https://tool.webbosaurus.de/badge/…">
// inside each .amag-garagenModal: the dealer-search details row authors the badge URL.
const STORELOCATOR_KEEP_BEFORE = ['.amag-rating__container'];

export default function transform(hookName, element, payload) {
  const isHome = !!(payload && payload.template && payload.template.name === 'home');
  const isStorelocator = !!(payload && payload.template && payload.template.name === 'storelocator');
  const isService = !!(payload && payload.template && payload.template.name === 'service');

  if (hookName === H.before && isHome) {
    WebImporter.DOMUtils.remove(element, HOME_BEFORE);
  }

  if (hookName === H.after && isHome) {
    WebImporter.DOMUtils.remove(element, HOME_AFTER);
  }

  if (hookName === H.before && isStorelocator) {
    WebImporter.DOMUtils.remove(element, STORELOCATOR_BEFORE);
  }

  if (hookName === H.after && isStorelocator) {
    WebImporter.DOMUtils.remove(element, STORELOCATOR_AFTER);
  }

  if (hookName === H.before && isService) {
    WebImporter.DOMUtils.remove(element, SERVICE_BEFORE);
  }

  if (hookName === H.after && isService) {
    WebImporter.DOMUtils.remove(element, SERVICE_AFTER);
  }

  if (hookName === H.before) {
    // Overlays / widgets that could interfere with block matching.
    WebImporter.DOMUtils.remove(element, [
      // OneTrust cookie consent: <div id="onetrust-consent-sdk"> (banner, preference center, iframe)
      '#onetrust-consent-sdk',
      // AMAG chat bot (frontnow advisor): <button id="frontnow-advisor-launcher">,
      // <div class="frontnow__backdrop">, <div id="frontnow-advisor-popover">
      '#frontnow-advisor-launcher',
      '.frontnow__backdrop',
      '#frontnow-advisor-popover',
      // Share-toast: <div class="toast success-toast share-toast">
      '.share-toast',
      // Empty select2 dropdown containers at body level:
      // <div class="select2-single-container">, <div class="select2-multi-container">
      '.select2-single-container',
      '.select2-multi-container',
      // Pop-up helper: <span class="amag-pop-up__check-element"> (inside .amag-content)
      'span.amag-pop-up__check-element',
      // Share button in the intro breadcrumb row: <div class="amag-share-wrapper">
      // (incl. its .amag-share-button__dropdown-menu)
      '.amag-share-wrapper',
      // Google rating badge iframe (tool.webbosaurus.de): <div class="amag-rating__container ...">
      '.amag-rating__container',
      // Empty infrastructure info div: <div id="amag-infrastructure-info">
      '#amag-infrastructure-info',
    ].filter((sel) => !(isStorelocator && STORELOCATOR_KEEP_BEFORE.includes(sel))));

    // Section 7 (panel 1, "Unser AMAG Versprechen"): the source renders an empty headline-only
    // duplicate .amag-iconListContainer (no .amag-iconListItem) before the real one.
    // Only a container WITHOUT items whose sibling container HAS items is removed — the
    // .amag-iconListContainer--spaceIconLabel lists in panels 2/3 use .amag-iconLabel and stay.
    element
      .querySelectorAll('.amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) section.section .amag-iconListContainer')
      .forEach((list) => {
        if (list.querySelector('.amag-iconListItem, .amag-iconLabel')) return;
        const parent = list.parentElement;
        const hasRealSibling = parent && [...parent.children].some(
          (sib) => sib !== list && sib.classList.contains('amag-iconListContainer')
            && sib.querySelector('.amag-iconListItem'),
        );
        if (hasRealSibling) list.remove();
      });
  }

  if (hookName === H.after) {
    // Global chrome, already migrated as /de/nav and /de/footer.
    WebImporter.DOMUtils.remove(element, [
      // <header id="header">
      '#header',
      // <footer id="garageFooter" class="amag-garageFooter">
      '#garageFooter',
      // Leftovers in case a parser left them in place
      '#onetrust-consent-sdk',
      '#frontnow-advisor-launcher',
      '#frontnow-advisor-popover',
      '.amag-share-wrapper',
      '.amag-rating__container',
      'span.amag-pop-up__check-element',
      // Non-content elements
      'script',
      'style',
      'noscript',
      'link',
      'iframe',
    ]);

    // Plain images with absolute URLs (no DM/Scene7 carrier anchors).
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) img.setAttribute('src', absolutize(src));
      const srcset = img.getAttribute('srcset');
      if (srcset) img.removeAttribute('srcset');
    });
    element.querySelectorAll('source').forEach((s) => s.remove());
  }
}
