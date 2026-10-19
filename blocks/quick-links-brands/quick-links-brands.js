/**
 * quick-links-brands — the garage page's "Alle Fahrzeuge der AMAG Garagen" brand grid (live
 * `.amag-brandIntroductionWrapper`, /de/garagenuebersicht/garage-buelach.html section 8).
 * A brand variant of `quick-links`: large grey logo boxes with a bold text link centred under
 * each (7-up ≥ 1200, 4-up ≥ 768, 2-up below). The section head (eyebrow <p> + <h2>) is
 * DEFAULT CONTENT before the block and is reabsorbed (EW8), laid out eyebrow | headline.
 *
 * ONE ROW PER TILE; cells read by role, never by index (Document Authoring may unwrap a
 * single-paragraph cell into bare inline content):
 *   - <picture>/<img>: the brand logo (fitted into an 85 px square); the LAST tile's icon
 *     ("Alle Marken") keeps its natural size, capped at the square (live behaviour)
 *   - link-bearing <p>: the tile label; the authored anchor stays a text link (EW3) and is
 *     stretched over the whole tile by CSS (::after), so the logo is clickable too; split
 *     links with the same href are merged
 *   - a logo authored INSIDE the link is moved out into the logo box
 * Tiles are not CTA buttons: plain <a>, styled by this block.
 * Section shell: full-bleed wrapper (`quick-links-brands-bleed-wrapper`), `band` on the
 * section's first wrapper, `section-end` on its last.
 * Unit hook: `amag-brandIntroductionWrapper__colWrapper` on each tile.
 */

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');

function wrapNode(node, className) {
  const w = el(className);
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

function buildHead(nodes) {
  const head = el('section-head');
  const row = el('section-head-row');
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  nodes.forEach((n) => {
    if (n === heading) row.append(wrapNode(n, 'headline'));
    else if (n.tagName === 'P') row.append(wrapNode(n, 'eyebrow'));
    else row.append(n);
  });
  head.append(row);
  return head;
}

function buildTile(row) {
  const tile = el('tile amag-brandIntroductionWrapper__colWrapper');
  const logo = [...row.querySelectorAll('picture, img')]
    .find((m) => !(m.tagName === 'IMG' && m.closest('picture')));
  const links = [...row.querySelectorAll('a[href]')];
  const [first] = links;
  // merge split links (same href) into the first one
  links.slice(1).forEach((a) => {
    if (first && a.getAttribute('href') === first.getAttribute('href')) {
      first.append(...a.childNodes);
      a.remove();
    }
  });
  const box = el('tile-box');
  if (logo) {
    const holder = el('tile-logo');
    holder.append(logo);
    box.append(holder);
  }
  tile.append(box);
  if (first) {
    first.classList.remove('button', 'primary', 'secondary', 'accent');
    first.className = 'tile-link';
    if (!text(first)) first.setAttribute('aria-label', logo ? (logo.querySelector('img') || logo).alt : '');
    const label = el('tile-text', 'p');
    label.append(first);
    tile.append(label);
  } else {
    const label = [...row.querySelectorAll('p')].find((p) => text(p));
    if (label) tile.append(wrapNode(label, 'tile-text'));
  }
  return tile;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => text(r) || r.querySelector('picture, img'));
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prevWrapper = wrapper ? wrapper.previousElementSibling : null;
  if (prevWrapper && prevWrapper.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prevWrapper.children]));
    prevWrapper.remove();
  }
  const tiles = el('tiles amag-brandIntroductionWrapper');
  rows.forEach((row) => tiles.append(buildTile(row)));
  wrap.append(tiles);
  block.replaceChildren(wrap);
  shell(block, 'quick-links-brands');
}
