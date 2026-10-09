/**
 * quick-links — the three stage shortcut tiles under the home carousel (prototype
 * `.amag-stageCarousel__buttons`; schema `stardust/eds-schema/en-html.json` section 0, repeat
 * `.amag-stageCarousel__button` ×3). Reconstructive: ONE ROW PER TILE, cells read by role:
 *   - <picture>/<img>: the 32px tile icon (an authored svg)
 *   - link-bearing <p>: the tile label; the authored anchor stays a text link (EW3) and is
 *     stretched over the whole tile by CSS (::after), so the icon never sits inside the link
 * Tiles are not CTA buttons (anti-pattern 12): plain <a>, styled by this block.
 * Unit hook: `amag-stageCarousel__button` on each tile (replica units.json).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

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

function buildTile(row) {
  const tile = document.createElement('div');
  tile.className = 'tile amag-stageCarousel__button';
  const media = row.querySelector('picture, img');
  if (media) tile.append(wrapNode(media, 'tile-icon'));
  [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img'))
    .forEach((p) => tile.append(wrapNode(p, 'tile-text')));
  return tile;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const tiles = document.createElement('div');
  tiles.className = 'tiles';
  rows.forEach((row) => tiles.append(buildTile(row)));
  wrap.append(tiles);
  block.replaceChildren(wrap);
  shell(block, 'quick-links');
}
