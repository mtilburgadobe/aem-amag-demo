/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-split (block table "hero-split").
 * Source: https://www.amag.ch/de/service.html — `.amag-content > section.section .amag-introService`
 * (section 1: 4:3 image, <h1>, "Termin vereinbaren" CTA).
 *
 * Authoring rows (blocks/hero-split/hero-split.js reads rows BY ROLE, one cell or several) —
 * mirrors the migrated /en/services hero (three one-cell rows):
 *   1. <img> hero image (plain <img>, absolute src)
 *   2. <h1> page headline
 *   3. CTA: <p><a href><img icon></a><strong>label</strong></p> (icon-only link + label beside
 *      it; the block moves the label into the link)
 * Option `spaced`: the intro is followed by further modules in its container (here the video
 * and the intro rich text) — the live module keeps its bottom margin then (hero-split.css).
 *
 * The breadcrumb inside the hero is handled by the breadcrumb parser (moved before this
 * element); a leftover Breadcrumb table or raw trail found inside is moved out the same way.
 * Not authored (removed by amag-cleanup for template `service`): the cookie variant of the CTA
 * (`.amag-otvCtaWrapper--cookie`: "IHRE GEMERKTE GARAGE -- Ändern") and the hero's garage
 * picker modal (`.amag-garageOverlay`). Both are also ignored here if still present.
 */
const ORIGIN = 'https://www.amag.ch';
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const abs = (u) => {
  if (!u) return '';
  const s = u.trim();
  if (/^(data:|https?:)/i.test(s)) return s;
  if (s.startsWith('//')) return `https:${s}`;
  try { return new URL(s, `${ORIGIN}/`).href; } catch (e) { return s; }
};
function toImg(img, document, alt) {
  if (!img) return null;
  const src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
  if (!src || src.startsWith('data:')) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (alt != null ? alt : (img.getAttribute('alt') || '')).trim());
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
const outside = (n) => !n.closest('.amag-otvCtaWrapper--cookie, .amag-garageOverlay');

export default function parse(element, { document }) {
  // Breadcrumb (raw trail or an already-created table) belongs in front of the hero.
  const crumb = element.querySelector('table') || element.querySelector('.amag-introService__breadcrumbs');
  if (crumb) element.before(crumb);

  const cells = [];

  // 1. Hero image (validated: picture > img.amag-introService__img).
  const imgSrc = element.querySelector('img.amag-introService__img')
    || element.querySelector('.amag-introService__imgWrapper img');
  const image = toImg(imgSrc, document);
  if (image) cells.push([image]);

  // 2. Headline.
  const h1 = element.querySelector('h1.amag-introService__title') || element.querySelector('h1');
  if (h1 && txt(h1)) cells.push([mk(document, 'h1', txt(h1))]);

  // 3. CTA — the single visible (no-cookie) appointment button.
  const ctas = [...element.querySelectorAll('a.amag-ctaWrapper__button[href]')].filter(outside);
  const cta = ctas.find((a) => a.closest('.amag-otvCtaWrapper--noCookie')) || ctas[0];
  if (cta && txt(cta)) {
    const a = mk(document, 'a', toImg(cta.querySelector('img'), document));
    a.setAttribute('href', cta.getAttribute('href'));
    cells.push([mk(document, 'p', a, mk(document, 'strong', txt(cta)))]);
  }

  // Optional service-time note under the CTA (none on /de/service).
  element.querySelectorAll('.amag-introService__otvCta p').forEach((p) => {
    if (outside(p) && txt(p) && !p.querySelector('a')) cells.push([mk(document, 'p', txt(p))]);
  });

  if (!h1 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // `spaced`: more (non-empty) modules follow the intro in the same container.
  let next = element.nextElementSibling;
  while (next && !txt(next) && !next.querySelector('img, picture, iframe, [data-vi16_9_url]')) next = next.nextElementSibling;
  const name = next ? 'hero-split (spaced)' : 'hero-split';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
