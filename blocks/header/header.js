/**
 * header — the www.amag.ch site header, template-slotted from the authored
 * `/nav` (EN) or `/de/nav` (DE) document (resolution: scripts.js getChromePath,
 * `nav` page metadata wins).
 *
 * Document contract (sections, positional):
 *   1. brand: <p><a href><img></a></p> — the logo link
 *   2. benefits: <ul> of <a><img><strong>HEADLINE</strong> text</a> (violet utility row ≥ 1200;
 *      decorated to the live shape <a><img><p><span>HEADLINE</span> text</p></a>)
 *   3. nav: nested <ul> — top level = main nav (desktop row + drawer); nested <ul>s = the
 *      drawer's sub-menus (opened in place with a Back row; never shown on desktop — the
 *      desktop mega-menu was not observed to fire on the live site)
 *   4. tools: <ul> of three links in fixed order: search, login, watchlist (icon-only)
 *   5. garage: <p>My garage</p> (desktop toggle label), <p>drawer title</p>, <p><strong><a>CTA</a>
 *   6. language: <ul> — the current language as text, the others as links
 *   7. announcement: <p>notification</p><p>message</p><p><a>link</a></p> (campaign strip;
 *      rendered in its captured "unseen" state above the viewport)
 *   8. drawer CTAs: <ul> of two <a><img>label</a> (black, dark blue)
 *   9. labels: <ul> of UI strings — menu title, back, hamburger name
 * Observed behaviours only: hide-on-scroll (top: -height past the header height, 50px
 * hysteresis), hamburger → drawer (html.overflow-hidden), home-only transparent morph while
 * scrollY < stage height - 100 (body.header-transparent from <meta name="header-style">).
 *
 * @ew-exempt <ul> labels (section 9) — UI strings copied into generated controls
 * @ew-exempt <ul> language current code — derived 2-letter copy in the desktop switch
 */
import { loadFragment } from '../fragment/fragment.js';
import { getChromePath, getLocale } from '../../scripts/scripts.js';
import {
  SEARCH, LOGIN, WATCHLIST, HAMBURGER, GARAGE, CHEVRON_DOWN, ARROW_RIGHT, ARROW_LEFT, CLOSE,
  GARAGE_CTA,
} from './icons.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');
const TOOL_ICONS = [SEARCH, LOGIN, WATCHLIST];
const FALLBACK_LABELS = {
  en: ['Choose menu', 'Back', 'Menu'],
  de: ['Menu wählen', 'Zurück', 'Menü'],
};

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

/** The pipeline wraps a list item's trigger link in <p> when the item has a sub-list (#98). */
function unwrapParagraphs(list) {
  list.querySelectorAll('li > p').forEach((p) => {
    p.replaceWith(...p.childNodes);
  });
}

/** Moves the bare text of an icon link into a visually hidden span (the glyph is prepended). */
function iconify(link, icon) {
  link.insertAdjacentHTML('afterbegin', icon);
  [...link.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    .forEach((n) => {
      const span = el('span', 'visually-hidden');
      n.replaceWith(span);
      span.append(n);
    });
}

function labelsFrom(section) {
  const items = section ? [...section.querySelectorAll('li')] : [];
  const fallback = FALLBACK_LABELS[getLocale()] || FALLBACK_LABELS.en;
  return fallback.map((f, i) => (items[i] ? items[i].textContent.trim() : f));
}

/** Nav list: sub-menus get a Back row and an overview copy of their trigger (drawer only). */
function decorateNavList(list, backLabel) {
  unwrapParagraphs(list);
  const closeAll = (root) => root.querySelectorAll('li.open').forEach((li) => {
    li.classList.remove('open');
    const t = li.querySelector(':scope > a');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
  list.querySelectorAll('li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    const trigger = li.querySelector(':scope > a');
    if (!sub || !trigger) return;
    li.classList.add('has-sub');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.insertAdjacentHTML('beforeend', ARROW_RIGHT);

    const back = el('li', 'header-nav-back');
    const backButton = el('button', 'header-nav-back-btn', ARROW_LEFT);
    backButton.type = 'button';
    backButton.append(document.createTextNode(backLabel));
    back.append(backButton);
    const overview = el('li', 'header-nav-overview');
    const copy = trigger.cloneNode(true);
    copy.removeAttribute('aria-haspopup');
    copy.removeAttribute('aria-expanded');
    copy.querySelectorAll('svg').forEach((s) => s.remove());
    overview.append(copy);
    sub.prepend(back, overview);

    trigger.addEventListener('click', (e) => {
      if (isDesktop.matches) return;
      e.preventDefault();
      li.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      li.closest('.header-drawer-scroll').scrollTop = 0;
    });
    backButton.addEventListener('click', () => {
      li.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });
  return closeAll;
}

/** Hide-on-scroll, lifted from the source bundle: 50px hysteresis, hide past own height. */
function initHideOnScroll(bar) {
  let last = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = bar.offsetHeight;
    if (Math.abs(y - last) < 50) return;
    if (y > last && y > h) bar.style.top = `-${h}px`;
    else if (last !== y) bar.style.top = '0px';
    last = y;
  }, { passive: true });
}

/** Home-only morph: transparent while the stage is in view (stage height - 100). */
function initTransparent(bar) {
  if (!document.body.classList.contains('header-transparent')) return;
  const stage = document.querySelector('main .header-stage, main [data-header-stage]')
    || [...document.querySelectorAll('main > .section')].find((s) => s.children.length);
  const update = () => {
    const transparent = !!stage && window.scrollY < stage.clientHeight - 100;
    bar.classList.toggle('header-bar-transparent', transparent);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(getChromePath('nav'));
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => !s.querySelector('.metadata') && s.querySelector('p, ul, picture, img'));
  const [
    brand, benefits, navSection, tools, garage, language, announcement, ctas, labelSection,
  ] = sections;
  const [menuLabel, backLabel, hamburgerLabel] = labelsFrom(labelSection);

  block.textContent = '';
  const bar = el('div', 'header-bar');
  const row = el('div', 'header-row');
  const main = el('div', 'header-main');
  const nav = el('nav', 'header-nav');
  const drawer = el('div', 'header-drawer');
  const scroll = el('div', 'header-drawer-scroll');
  const toolsBox = el('div', 'header-tools');
  drawer.id = 'header-drawer';

  // 1. brand
  if (brand) {
    const logo = brand.querySelector('p') || brand.firstElementChild;
    row.append(wrapNode(logo, 'header-logo-wrap'));
  }

  // 2. benefits (utility row)
  const benefitList = benefits ? benefits.querySelector('ul') : null;
  if (benefitList) {
    unwrapParagraphs(benefitList);
    // the pipeline pretty-prints whitespace between <picture> and the text; drop the
    // whitespace-only nodes so the icon sits flush (no displayed text is touched)
    benefitList.querySelectorAll('a').forEach((a) => {
      [...a.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE && !n.textContent.trim())
        .forEach((n) => n.remove());
      // live shape: <a><img><p><span class="headline">HEADLINE</span> text</p></a> — the
      // headline <strong> becomes a span and the copy after the icon moves into one <p>
      a.querySelectorAll('strong').forEach((s) => {
        const span = el('span', 'header-benefit-headline');
        span.append(...s.childNodes);
        s.replaceWith(span);
      });
      const text = el('p', 'header-benefit-text');
      text.append(...[...a.childNodes]
        .filter((n) => n.nodeType !== Node.ELEMENT_NODE || !n.matches('picture, img')));
      a.append(text);
    });
    main.append(wrapNode(benefitList, 'header-benefits'));
  }

  // 3. nav list → drawer (mobile) / nav row (desktop)
  scroll.append(el('div', 'header-menu-title', menuLabel));
  const navList = navSection ? navSection.querySelector('ul') : null;
  let closeSubs = () => {};
  if (navList) {
    closeSubs = decorateNavList(navList, backLabel);
    scroll.append(wrapNode(navList, 'header-nav-list'));
  }

  // 5. garage: first paragraph = desktop toggle label; the rest = drawer box
  const garagePs = garage ? [...garage.querySelectorAll('p')] : [];
  const garageDesktop = el('div', 'header-garage-desktop');
  const garageButton = el('a', 'header-garage-btn', GARAGE);
  if (garagePs[0]) garageButton.append(garagePs[0]);
  garageDesktop.append(garageButton);
  if (garagePs.length > 1) {
    const box = el('div', 'header-garage');
    garagePs.slice(1).forEach((p) => {
      const cta = p.querySelector('a');
      if (cta) {
        cta.insertAdjacentHTML('afterbegin', GARAGE_CTA);
        box.append(wrapNode(p, 'header-garage-cta white'));
      } else {
        box.append(wrapNode(p, 'header-garage-title'));
      }
    });
    scroll.append(box);
  }

  // 6. language: the drawer row keeps the authored list; the desktop switch shows the code
  const langList = language ? language.querySelector('ul') : null;
  let current = getLocale();
  if (langList) {
    unwrapParagraphs(langList);
    const active = [...langList.querySelectorAll('li')].find((li) => !li.querySelector('a'));
    if (active) current = active.textContent.trim();
    scroll.append(wrapNode(langList, 'header-drawer-lang'));
  }
  const langDesktop = el('div', 'header-lang-desktop');
  const langCurrent = el('a', 'header-lang-current');
  langCurrent.append(document.createTextNode(current));
  langCurrent.insertAdjacentHTML('beforeend', CHEVRON_DOWN);
  langDesktop.append(langCurrent);

  drawer.append(scroll);

  // 8. drawer CTAs
  const ctaList = ctas ? ctas.querySelector('ul') : null;
  if (ctaList) {
    unwrapParagraphs(ctaList);
    drawer.append(wrapNode(ctaList, 'header-drawer-ctas'));
  }

  // 4. tools (search, login, watchlist) + hamburger + garage + language
  const toolList = tools ? tools.querySelector('ul') : null;
  if (toolList) {
    unwrapParagraphs(toolList);
    [...toolList.querySelectorAll('li')].forEach((li, i) => {
      const link = li.querySelector('a');
      if (link && TOOL_ICONS[i]) iconify(link, TOOL_ICONS[i]);
    });
    toolsBox.append(wrapNode(toolList, 'header-tool-list'));
  }
  const hamburger = el('button', 'header-hamburger', HAMBURGER);
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', drawer.id);
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', hamburgerLabel);
  toolsBox.append(hamburger, garageDesktop, langDesktop);

  nav.append(drawer, toolsBox);
  main.append(nav);
  row.append(main);

  // 7. announcement strip (captured state: unseen)
  const strip = el('div', 'header-announcement header-announcement-unseen');
  if (announcement) {
    const ps = [...announcement.querySelectorAll('p')];
    const box = el('div', 'header-announcement-box');
    ps.forEach((p) => box.append(wrapNode(p, p.querySelector('a')
      ? 'header-announcement-link' : 'header-announcement-text')));
    strip.append(box, el('div', 'header-announcement-close', CLOSE));
  }

  const sideBefore = el('div', 'header-side header-side-before');
  sideBefore.append(el('div', 'header-side-violet'), el('div', 'header-side-white'));
  const sideAfter = el('div', 'header-side header-side-after');
  sideAfter.append(el('div', 'header-side-violet'), el('div', 'header-side-white'));
  bar.append(sideBefore, row, sideAfter, strip);
  block.append(bar);

  // drawer open/close (fired on live: header--overlay-open + html.overflow-hidden)
  const setOpen = (open) => {
    block.classList.toggle('header-open', open);
    document.documentElement.classList.toggle('overflow-hidden', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (open) bar.style.top = '0px';
    else closeSubs(block);
  };
  hamburger.addEventListener('click', () => setOpen(!block.classList.contains('header-open')));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && block.classList.contains('header-open')) {
      setOpen(false);
      hamburger.focus();
    }
  });
  isDesktop.addEventListener('change', () => setOpen(false));

  initHideOnScroll(bar);
  initTransparent(bar);
}
