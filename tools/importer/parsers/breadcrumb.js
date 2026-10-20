/* eslint-disable */
/* global WebImporter */

/**
 * Parser: breadcrumb (block table "Breadcrumb").
 * Source: https://www.amag.ch/de/garagenuebersicht/garage-buelach.html
 * Instance: `.amag-introGarageWithSlider__breadcrumbs` (nav.cmp-breadcrumb > ol.cmp-breadcrumb__list).
 * Source: https://www.amag.ch/de/service.html — `.amag-introService__breadcrumbs` (same markup,
 * inside the hero `.amag-introService`; the table is moved in front of the hero).
 *
 * Authoring rows (blocks/breadcrumb/breadcrumb.js): ONE row, ONE cell holding a <ul> —
 * one <li> per crumb; every crumb is a link except the current page (plain text, last item).
 *
 * Dropped: the share button (`.amag-share-wrapper`) — page chrome, not part of the trail.
 */
export default function parse(element, { document }) {
  const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');

  // Validated: li.cmp-breadcrumb__item; fallback for plain list markup.
  let items = [...element.querySelectorAll('li.cmp-breadcrumb__item')];
  if (!items.length) items = [...element.querySelectorAll('ol > li, ul > li')];
  items = items.filter((li) => !li.closest('.amag-share-wrapper') && txt(li));

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const ul = document.createElement('ul');
  items.forEach((li, i) => {
    const out = document.createElement('li');
    const a = li.querySelector('a[href]');
    const label = txt(a || li);
    if (a && i < items.length - 1) {
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href'));
      link.textContent = label;
      out.append(link);
    } else {
      out.textContent = label;
    }
    ul.append(out);
  });

  const cells = [[ul]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Breadcrumb', cells });
  // /de/service: the trail sits INSIDE the split hero (`.amag-introService__breadcrumbs`); the
  // table goes directly before the hero so it precedes the Hero Split block (the block adopts a
  // breadcrumb authored right before it). Other templates keep the table in place.
  const hero = element.closest('.amag-introService');
  if (hero && hero !== element) {
    hero.before(block);
    element.remove();
    return;
  }
  element.replaceWith(block);
}
