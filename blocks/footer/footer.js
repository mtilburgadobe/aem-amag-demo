/**
 * footer — the www.amag.ch site footer, template-slotted from the authored
 * `/footer` (EN) or `/de/footer` (DE) document (resolution: scripts.js getChromePath).
 *
 * Document contract (sections, positional):
 *   1–3. link lists: <p>title</p> + <ul> of links (first list open on mobile)
 *   4.   brands: <p>title</p> + <ul> of <a><img> brand logos
 *   5.   app: <p><a>app name</a></p> + <p>subline</p> + <ul> of store badge links
 *   6.   social: <ul> of <a><img> icon links
 *   7.   legal: <p>copyright</p> + <ul> of legal links
 * Every authored node is MOVED into the template (EW1); wrappers carry the layout
 * classes (EW2). The list toggles (mobile) are generated chevron buttons whose
 * accessible name is the list title.
 *
 * @ew-exempt none — all authored text is moved
 */
import { loadFragment } from '../fragment/fragment.js';
import { getChromePath } from '../../scripts/scripts.js';
import { CHEVRON, APP_ICON } from './icons.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html) node.innerHTML = html;
  return node;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

/** Sections 1–3: title + toggled list. */
function buildList(section, index) {
  const title = section.querySelector('p');
  const list = section.querySelector('ul');
  const col = el('div', 'footer-list');
  const head = el('div', 'footer-list-title');
  const body = el('div', 'footer-list-body');
  const open = index === 0;
  body.id = `footer-list-${index + 1}`;
  if (title) head.append(title);
  const button = el('button', 'footer-list-toggle', CHEVRON);
  button.type = 'button';
  button.setAttribute('aria-controls', body.id);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', title ? title.textContent : body.id);
  head.append(button);
  if (list) body.append(list);
  col.classList.toggle('open', open);
  const toggle = () => {
    const isOpen = col.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  };
  head.addEventListener('click', toggle);
  col.append(head, body);
  return col;
}

/** Section 4: brand logo tiles. */
function buildBrands(section) {
  const title = section.querySelector('p');
  const list = section.querySelector('ul');
  const col = el('div', 'footer-brands');
  if (title) col.append(wrapNode(title, 'footer-brands-title'));
  if (list) col.append(wrapNode(list, 'footer-brands-logos'));
  return col;
}

/** Section 5: app teaser (icon + two lines, one link) and store badges. */
function buildApp(section) {
  const ps = [...section.querySelectorAll('p')];
  const list = section.querySelector('ul');
  const band = el('div', 'footer-app');
  const link = ps[0] ? ps[0].querySelector('a') : null;
  const teaser = el(link ? 'a' : 'div', 'footer-app-link', APP_ICON);
  if (link) {
    teaser.href = link.href;
    if (link.title) teaser.title = link.title;
    // card-as-link: the authored paragraph keeps its index, the inner anchor unwraps (EW6)
    link.replaceWith(...link.childNodes);
  }
  const text = el('div', 'footer-app-text');
  if (ps[0]) text.append(wrapNode(ps[0], 'footer-app-title'));
  if (ps[1]) text.append(wrapNode(ps[1], 'footer-app-sub'));
  teaser.append(text);
  band.append(teaser);
  if (list) band.append(wrapNode(list, 'footer-app-badges'));
  return band;
}

/** Section 7: copyright + legal links. */
function buildLegal(section) {
  const copy = section.querySelector('p');
  const list = section.querySelector('ul');
  const row = el('div', 'footer-legal');
  if (copy) row.append(wrapNode(copy, 'footer-copyright'));
  if (list) row.append(wrapNode(list, 'footer-legal-links'));
  return row;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(getChromePath('footer'));
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => !s.querySelector('.metadata') && s.querySelector('p, ul'));

  block.textContent = '';
  const inner = el('div', 'footer-inner');
  const container = el('div', 'footer-container');
  const content = el('div', 'footer-content');
  const lists = sections.slice(0, 3);
  lists.forEach((s, i) => content.append(buildList(s, i)));
  if (sections[3]) content.append(buildBrands(sections[3]));
  if (sections[4]) content.append(buildApp(sections[4]));
  if (sections[5]) {
    const list = sections[5].querySelector('ul');
    if (list) content.append(wrapNode(list, 'footer-social'));
  }
  if (sections[6]) content.append(buildLegal(sections[6]));
  // leftovers: anything an unexpected section carries stays visible (default styling)
  sections.slice(7).forEach((s) => content.append(wrapNode(s, 'footer-extra')));
  container.append(content);
  inner.append(container);
  block.append(inner);
}
