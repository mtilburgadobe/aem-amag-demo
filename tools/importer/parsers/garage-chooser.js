/* eslint-disable */
/* global WebImporter */

/**
 * Parser: garage-chooser (block table "garage-chooser").
 * Source: https://www.amag.ch/de/service.html —
 * `.amag-kontaktaufnahme .amag-garageElectionOverlay .amag-garageOverlay` (the contact band's
 * "Wählen Sie Ihre AMAG Garage" modal, 100 garages linking to /de/garagenuebersicht/<slug>.html).
 * The hero's duplicate modal (links to /de/service/otv.html#<id>) is removed by amag-cleanup.
 *
 * Authoring rows (blocks/garage-chooser/garage-chooser.js) — as on /en/services:
 *   1. headline row: <h3>Wählen Sie Ihre AMAG Garage</h3>
 *   2. ONE ROW PER GARAGE, one cell: <p><a href>name</a></p><p>street,</p><p>zip place</p>
 * Iteration: `.amag-garageOverlay__garageList--garage` (document order; the whole entry is one
 * <a> on the source — the href is read from it and put on the name).
 * Placement: the chooser is a fixed overlay with no flow position; its table is MOVED to directly
 * before `.amag-direct-entry` (document section 7, "Overlays"), not left inside the contact band.
 * Dropped: close icons, the search field and the autosuggest list (re-created by the block).
 */
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');
const mk = (document, tag, ...kids) => {
  const e = document.createElement(tag);
  kids.flat().forEach((k) => { if (k != null && k !== '') e.append(k); });
  return e;
};

export default function parse(element, { document }) {
  const cells = [];

  const headline = element.querySelector('.amag-garageOverlay__headline h3, .amag-garageOverlay__headline h2, .amag-garageOverlay__headline');
  if (headline && txt(headline)) cells.push([mk(document, 'h3', txt(headline))]);

  const garages = [...element.querySelectorAll('.amag-garageOverlay__garageList--garage')];
  let count = 0;
  garages.forEach((g) => {
    const link = g.querySelector('a[href]');
    const name = txt(g.querySelector('.amag-garageOverlay__garageList--garageName'));
    const street = txt(g.querySelector('.amag-garageOverlay__garageList--garageStreet'));
    const place = txt(g.querySelector('.amag-garageOverlay__garageList--garagePlace'));
    if (!name) return;
    const cell = [];
    if (link) {
      const a = mk(document, 'a', name);
      a.setAttribute('href', link.getAttribute('href'));
      cell.push(mk(document, 'p', a));
    } else cell.push(mk(document, 'p', name));
    if (street) cell.push(mk(document, 'p', street));
    if (place) cell.push(mk(document, 'p', place));
    cells.push([cell]);
    count += 1;
  });

  if (!count) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'garage-chooser', cells });
  const target = document.querySelector('.amag-content > .amag-direct-entry') || document.querySelector('.amag-direct-entry');
  if (target && !element.contains(target)) {
    target.before(block);
    element.remove();
    return;
  }
  element.replaceWith(block);
}
