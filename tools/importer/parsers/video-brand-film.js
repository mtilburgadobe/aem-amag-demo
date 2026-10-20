/* eslint-disable */
/* global WebImporter */

/**
 * Parser: video-brand-film (block table "Video Brand Film").
 * Source: https://www.amag.ch/de.html — `.amag-videoComp` (section 8, full-width Vimeo brand film).
 *
 * The statement <h4> (`.amag-videoComp__headline`, "Wir bewegen und begeistern Menschen. …")
 * sits INSIDE the instance; it is moved in front of the block as default content (the block
 * reabsorbs a heading authored directly before it).
 *
 * Authoring row (blocks/video-brand-film/video-brand-film.js) — ONE row, one cell:
 *   <p><a href="https://vimeo.com/<id>">https://vimeo.com/<id></a></p><p>video title</p>
 * Video URL: the player's `data-vi16_9_url` (fallback: an embedded iframe src).
 * Title (iframe `title`): read from a rendered player iframe when present; the consent-gated
 * player is not rendered without cookie consent, so the known Vimeo title of the clip is used
 * (VIDEO_TITLES); no title paragraph is written for an unknown clip.
 * Dropped: the cookie-consent overlay ("Es gibt viel zu sehen! …"), which the block replaces with
 * its own lazy player.
 */
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};
// Vimeo titles of the clips used on the source page (player.vimeo.com oEmbed `title`).
// /de/service: https://vimeo.com/684680549 (player `data-vi16_9_url` in the live DOM; the
// statement <h4> is absent there, so no heading is moved).
const VIDEO_TITLES = {
  896519713: 'Startseiten Imagevideo DE',
  684680549: 'Online_Buchung_DE',
};

function videoUrl(element) {
  const player = element.querySelector('[data-vi16_9_url]');
  if (player && player.getAttribute('data-vi16_9_url')) return player.getAttribute('data-vi16_9_url').trim();
  const frame = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtu"], iframe[data-src]');
  const src = frame ? (frame.getAttribute('src') || frame.getAttribute('data-src') || '') : '';
  const m = src.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (m) return `https://vimeo.com/${m[1]}`;
  return src.trim();
}

export default function parse(element, { document }) {
  const url = videoUrl(element);
  if (!url) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const head = [];
  const h = element.querySelector('.amag-videoComp__headline');
  if (h && txt(h)) head.push(mk(document, h.localName && /^h[2-6]$/.test(h.localName) ? h.localName : 'h4', txt(h)));

  const id = (url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
  const frame = element.querySelector('iframe[title]');
  const title = (frame && frame.getAttribute('title').trim()) || (id && VIDEO_TITLES[id]) || '';

  const a = mk(document, 'a', url);
  a.setAttribute('href', url);
  const cell = [mk(document, 'p', a)];
  if (title) cell.push(mk(document, 'p', title));

  const block = WebImporter.Blocks.createBlock(document, { name: 'Video Brand Film', cells: [[cell]] });
  head.forEach((n) => element.before(n));
  element.replaceWith(block);
}
