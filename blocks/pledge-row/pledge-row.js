/**
 * pledge-row — the AMAG pledge icon row (prototype `.amag-iconListContainer`; schema
 * section 7). The section head (eyebrow <p> "UNSER AMAG VERSPRECHEN" + <h2>) is authored as
 * DEFAULT CONTENT before the block and reabsorbed (EW8). Container shape: ONE ROW PER PILLAR;
 * cells read by role:
 *   - <picture>/<img>: the pillar icon (32 px glyph in a 70/80 px box)
 *   - <h3> (or <h4>/<strong> paragraph): the pillar title
 *   - <ul> / further <p>: the bullet lines (rendered with the "–" dash of the live page)
 * Variants: `grey` / `lavender` ground, `band-white` / `band-grey` top band colour.
 * Section shell: full-bleed wrapper, `band` on the section's first wrapper, `section-end`.
 * Unit hooks: `amagCh-section-description` (head), `amag-iconListItem` (pillar).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const el = (className) => {
  const d = document.createElement('div');
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

function buildHead(nodes) {
  const head = el('head amagCh-section-description');
  const row = el('head-row');
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  nodes.forEach((n) => {
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P') row.append(wrapNode(n, 'eyebrow'));
    else row.append(n);
  });
  head.append(row);
  return head;
}

function buildItem(row) {
  const item = el('item amag-iconListItem');
  const inner = el('item-row');
  const media = row.querySelector('picture, img');
  let title = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (!title) {
    title = [...row.querySelectorAll('p')]
      .find((p) => p.querySelector('strong') && !p.querySelector('picture, img')) || null;
  }
  const lines = [...row.querySelectorAll('p, ul, ol')]
    .filter((n) => n !== title && !n.querySelector('picture, img') && !n.closest('li'));
  if (media) {
    const box = el('icon-box');
    box.append(media);
    inner.append(wrapNode(box, 'item-icon'));
  }
  const textCol = el('item-text');
  if (title) textCol.append(wrapNode(title, 'item-title'));
  if (lines.length) {
    const list = el('item-list');
    list.append(...lines);
    textCol.append(list);
  }
  inner.append(textCol);
  item.append(inner);
  return item;
}

export default function decorate(block) {
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prev.children]));
    prev.remove();
  }
  const items = el('items amag-iconListContainer');
  const row = el('items-row');
  [...block.children].forEach((r) => row.append(buildItem(r)));
  items.append(row);
  wrap.append(items);
  block.replaceChildren(wrap);
  shell(block, 'pledge-row');
}
