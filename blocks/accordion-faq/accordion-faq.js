/**
 * accordion-faq — FAQ / SEO accordion (prototype `.cmp-accordion`; schema section 7).
 * Authoring rows: an optional HEAD row (one cell: <img> intro icon + <h2> headline), then
 * ONE ROW PER QUESTION with two cells: question heading (<h3>) | answer (<p>/<ul>/<a>).
 * Rendering follows the live behaviour: rows collapsed at rest, a click on the header row
 * expands the panel and turns the chevron (0.5 s). EW7: the authored question heading moves
 * into `div.item-title`; the whole header row takes the click, the generated <button> is a
 * chevron-only toggle labelled by the heading (aria-labelledby, no copied text).
 * Variants: `grey` / `lavender` ground, `band-white` / `band-grey` top band colour.
 * Section shell: full-bleed wrapper, `band` on the section's first wrapper, `section-end`.
 * Unit hook: `cmp-accordion__item` on each generated row (replica units.json).
 */

const CHEVRON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M-2.18483e-08 7.69978C-1.55976e-08 7.55678 '
  + '0.0609989 7.42078 0.167999 7.32578C0.375 7.14278 0.692001 7.16278 0.874001 7.36878L12 '
  + '19.9438L23.125 7.36878C23.308 7.16178 23.625 7.14278 23.831 7.32478C23.938 7.42078 24 '
  + '7.55678 24 7.69978C24 7.82178 23.955 7.93978 23.875 8.03078L12.749 20.6068C12.723 20.6358 '
  + '12.697 20.6628 12.669 20.6878C12.253 21.0568 11.618 21.0198 11.253 20.6078L0.125 '
  + '8.03078C0.0440006 7.93878 -2.71811e-08 7.82178 -2.18483e-08 7.69978Z" fill="#801977" '
  + 'stroke="#801977" stroke-width="0.5"/></svg>';

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

let counter = 0;

function buildItem(row) {
  const cells = [...row.children];
  const titleCell = cells[0];
  const panelCell = cells[1];
  const item = el('item cmp-accordion__item');
  const head = el('item-head');
  const heading = titleCell.querySelector('h1, h2, h3, h4, h5, h6')
    || titleCell.querySelector('p') || titleCell.firstElementChild;
  counter += 1;
  if (heading && !heading.id) heading.id = `accordion-faq-title-${counter}`;
  if (heading) head.append(wrapNode(heading, 'item-title'));
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'item-toggle';
  button.setAttribute('aria-expanded', 'false');
  if (heading) button.setAttribute('aria-labelledby', heading.id);
  button.innerHTML = CHEVRON;
  head.append(button);
  const panel = el('panel');
  panel.id = `accordion-faq-panel-${counter}`;
  panel.hidden = true;
  button.setAttribute('aria-controls', panel.id);
  const inner = el('panel-inner');
  if (panelCell) inner.append(...panelCell.childNodes);
  panel.append(inner);
  item.append(head, panel);
  head.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    item.classList.toggle('expanded', !open);
    panel.hidden = open;
  });
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap');
  const faq = el('faq cmp-accordion');
  const first = rows[0];
  const isHead = first.children.length === 1 && !!first.querySelector('h1, h2, h3, h4');
  if (isHead) {
    const intro = el('intro');
    const icon = first.querySelector('picture, img');
    const heading = first.querySelector('h1, h2, h3, h4');
    if (icon) intro.append(wrapNode(icon, 'intro-icon'));
    if (heading) intro.append(wrapNode(heading, 'headline'));
    faq.append(intro);
  }
  rows.slice(isHead ? 1 : 0).forEach((row) => faq.append(buildItem(row)));
  wrap.append(faq);
  block.replaceChildren(wrap);
  shell(block, 'accordion-faq');
}
