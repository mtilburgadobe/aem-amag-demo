/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AMAG (www.amag.ch) site-wide cleanup.
 *
 * Every selector below was verified in migration-work/cleaned.html
 * (source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html).
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

export default function transform(hookName, element, payload) {
  const isHome = !!(payload && payload.template && payload.template.name === 'home');

  if (hookName === H.before && isHome) {
    WebImporter.DOMUtils.remove(element, HOME_BEFORE);
  }

  if (hookName === H.after && isHome) {
    WebImporter.DOMUtils.remove(element, HOME_AFTER);
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
    ]);

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
