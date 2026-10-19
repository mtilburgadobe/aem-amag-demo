/* eslint-disable */
/* global WebImporter */
import { knownIconSrc } from '../known-icons.js';

/**
 * Parser: quick-links (block table "Quick Links").
 * Source: https://www.amag.ch/de.html —
 * `.amag-content > .amagCh-stageCarousel .amagCh-stageCarousel__buttons--noPadding`
 * (section 1, the three stage shortcut tiles "Auto finden" / "Service" / "Garage suchen").
 *
 * Authoring rows (blocks/quick-links/quick-links.js) — ONE ROW PER TILE, two cells:
 *   <p><img icon></p> | <p><a href>label</a></p>
 * The block stretches the text link over the tile, so the icon stays OUTSIDE the link.
 * Icons: inline <svg> on the live page -> the site's published media file (../known-icons.js), else
 *   <img src="data:image/svg+xml;base64,…">; an <img> is
 * used as-is. Iteration: `a.amag-stageCarousel__button` tiles (document order).
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
function svgDataUri(svg) {
  // known icons point at the published media file: a data: URI is lost on the DA upload
  const known = knownIconSrc(svg);
  if (known) return known;
  const s = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
}
function toImg(node, document) {
  if (!node) return null;
  let src = '';
  let alt = '';
  if (node.localName === 'svg') src = svgDataUri(node);
  else {
    const img = node.localName === 'img' ? node : node.querySelector('img');
    if (img) {
      src = abs(img.getAttribute('src') || img.getAttribute('data-src'));
      alt = img.getAttribute('alt') || '';
    } else if (node.querySelector('svg')) src = svgDataUri(node.querySelector('svg'));
  }
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', alt.trim());
  return out;
}
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};

export default function parse(element, { document }) {
  let tiles = [...element.querySelectorAll('.amag-stageCarousel__buttons > a.amag-stageCarousel__button')];
  if (!tiles.length) tiles = [...element.querySelectorAll('.amag-stageCarousel__button')];

  const cells = [];
  tiles.forEach((tile) => {
    const label = txt(tile.querySelector('.amag-stageCarousel__buttonText')) || txt(tile);
    const href = tile.getAttribute('href') || (tile.querySelector('a[href]') || { getAttribute: () => '' }).getAttribute('href');
    if (!label) return;
    const iconBox = tile.querySelector('.amag-stageCarousel__button_icon') || tile;
    const icon = toImg(iconBox.querySelector('svg, img'), document);
    let labelNode = label;
    if (href) {
      labelNode = mk(document, 'a', label);
      labelNode.setAttribute('href', href);
    }
    cells.push([icon ? mk(document, 'p', icon) : '', mk(document, 'p', labelNode)]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Quick Links', cells });
  element.replaceWith(block);
}
