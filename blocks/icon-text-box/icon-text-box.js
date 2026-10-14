/**
 * icon-text-box — the services overview's white "services at a glance" box (prototype
 * `.amag-iconTextBox`; schema stardust/eds-schema/en-services-html.json, section 2, repeat
 * `.amag-iconTextBox__item` ×12). Reconstructive, ONE ROW PER ITEM; a leading row with a
 * heading and no image is the box headline. Item cells are read by role, never by index:
 *   - <picture>/<img>: the 40 px icon
 *   - <h5> (or h3/h4): the item title — a link authored INSIDE the title makes the whole item
 *     that link (EW6: href read, inner anchor unwrapped)
 *   - any other <p>: the item text (the live items carry an empty one — nothing to author)
 * Variants: `band-white` / `band-grey` top band colour (the box is the section's first module
 * on the services page). Section shell: full-bleed wrapper, `band` on the section's first
 * wrapper, `section-end` on its last. Unit hook: `amag-iconTextBox__item` per item.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  d.className = className;
  return d;
};

function shell(block, name) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains(`${name}-wrapper`)) return;
  wrapper.classList.add(`${name}-bleed-wrapper`);
  const section = block.closest('.section');
  if (!section) return;
  const sections = [...section.parentElement.children]
    .filter((s) => s.classList.contains('section') && s.children.length);
  if (sections[0] === section) block.classList.add('first-section');
  if (!wrapper.previousElementSibling) block.classList.add('band');
  if (!wrapper.nextElementSibling) block.classList.add('section-end');
}

function isHeadRow(row) {
  return !!row.querySelector('h1, h2, h3') && !row.querySelector('picture, img, a');
}

function buildItem(row) {
  const media = row.querySelector('picture, img');
  const title = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = title ? title.querySelector('a[href]') : row.querySelector('a[href]');
  const ps = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && !(link && p.contains(link)));
  const item = el('item amag-iconTextBox__item');
  const host = link ? el('item-link', 'a') : el('item-link');
  if (link) {
    host.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  if (media) host.append(wrapNode(media, 'item-icon'));
  if (title) host.append(wrapNode(title, 'item-title'));
  if (ps.length) {
    const t = el('item-text');
    t.append(...ps);
    host.append(t);
  }
  item.append(host);
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap');
  const box = el('box amag-iconTextBox');
  const items = el('items');
  rows.forEach((row) => {
    if (isHeadRow(row)) {
      const heading = row.querySelector('h1, h2, h3');
      box.append(wrapNode(heading, 'headline'));
      return;
    }
    items.append(buildItem(row));
  });
  box.append(items);
  wrap.append(box);
  block.replaceChildren(wrap);
  shell(block, 'icon-text-box');
}
