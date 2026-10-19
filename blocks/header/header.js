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
 *      drawer's sub-menus (opened in place with a Back row) and, ≥ 1200, the hover mega-menu
 *      built from a pristine copy: leading plain links = overview row, the first three groups
 *      = grey columns (a group's first entry is dropped when it links to the group itself —
 *      the overview copy / description), later groups and trailing links = white aside
 *      (a group whose entries carry images renders as logo tiles, e.g. "Nach Marken")
 *   4. tools: <ul> of three links in fixed order: search, login, watchlist (icon-only)
 *   5. garage: <p>My garage</p> (desktop toggle label), <p>drawer title</p>, <p><strong><a>CTA</a>
 *   6. language: <ul> — the current language as text, the others as links
 *   7. announcement: <p>notification</p><p>message</p><p><a>link</a></p> (campaign strip;
 *      rendered in its captured "unseen" state above the viewport)
 *   8. drawer CTAs: <ul> of two <a><img>label</a> (black, dark blue)
 *   9. labels: <ul> of UI strings — menu title, back, hamburger name
 * Observed behaviours only: hide-on-scroll (top: -height past the header height, 50px
 * hysteresis), hamburger → drawer (html.overflow-hidden), home-only transparent morph while
 * scrollY < stage height - 100 (body.header-transparent from <meta name="header-style">),
 * ≥ 1200 mega-menu: opens on hover / keyboard focus of a top item with a sub-menu (trigger
 * turns violet), stays open over the panel, closes on leave, Escape or scroll; on touch the
 * first tap opens it, the second follows the link.
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

/** A mega-menu link: a copy of the authored anchor without its drawer icon. */
function megaLink(a, keepMedia) {
  const link = a.cloneNode(true);
  link.removeAttribute('aria-haspopup');
  link.removeAttribute('aria-expanded');
  if (!keepMedia) link.querySelectorAll('picture, img, svg').forEach((n) => n.remove());
  return link;
}

/** A group heading: the authored link, or its bare text when the group has no page. */
function megaTitle(li) {
  const title = el('p', 'header-mega-title');
  const a = li.querySelector(':scope > a');
  if (a) {
    title.append(megaLink(a));
  } else {
    title.textContent = [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent).join('').trim();
  }
  return title;
}

function megaGroup(li) {
  const titleLink = li.querySelector(':scope > a');
  const titleHref = titleLink ? titleLink.getAttribute('href') : null;
  const entries = [...li.querySelector(':scope > ul').children].filter((item) => {
    const a = item.querySelector(':scope > a');
    // drop description / overview copies (they link to the group itself)
    return a && a.getAttribute('href') !== titleHref;
  });
  const brands = entries.length > 0 && entries.every((item) => item.querySelector(':scope > a img'));
  const group = el('div', `header-mega-group${brands ? ' header-mega-brands' : ''}`);
  const list = el('ul');
  entries.forEach((item) => {
    const entry = el('li');
    entry.append(megaLink(item.querySelector(':scope > a'), brands));
    list.append(entry);
  });
  group.append(megaTitle(li), list);
  return group;
}

/** The ≥ 1200 panel of one top-level item, built from its pristine sub-list. */
function buildMegaPanel(sub) {
  const panel = el('div', 'header-mega');
  const row = el('div', 'header-mega-row');
  const overview = el('div', 'header-mega-overview');
  const columns = el('div', 'header-mega-columns');
  const aside = el('div', 'header-mega-aside');
  let groups = 0;
  [...sub.children].forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (li.querySelector(':scope > ul')) {
      (groups < 3 ? columns : aside).append(megaGroup(li));
      groups += 1;
    } else if (a) {
      const p = el('p', groups ? 'header-mega-title' : 'header-mega-link');
      p.append(megaLink(a));
      (groups ? aside : overview).append(p);
    }
  });
  [overview, columns, aside].filter((n) => n.childElementCount).forEach((n) => row.append(n));
  panel.append(row);
  return panel;
}

/** Desktop mega-menu: one panel per top item with a sub-menu (hover, focus, touch, Esc). */
function initMegaMenu(navList, source) {
  const items = [...navList.querySelectorAll(':scope > li')];
  const sourceItems = [...source.querySelectorAll(':scope > li')];
  let pointer = 'mouse';
  let refocusing = false;
  const entries = [];
  // resolved on use: initMegaMenu runs before the list is moved into the header block
  const setHeaderOpen = (on) => {
    const header = navList.closest('.header');
    if (header) header.classList.toggle('header-mega-open', on);
  };
  const close = (li) => {
    if (!li || !li.classList.contains('mega-open')) return;
    li.classList.remove('mega-open');
    li.querySelector(':scope > a').setAttribute('aria-expanded', 'false');
    setHeaderOpen(false);
  };
  const closeAll = () => entries.forEach(({ li }) => close(li));
  const open = (li) => {
    if (!isDesktop.matches) return;
    entries.forEach((e) => { if (e.li !== li) close(e.li); });
    li.classList.add('mega-open');
    li.querySelector(':scope > a').setAttribute('aria-expanded', 'true');
    // the bar turns solid while a panel is open (the home page's transparent morph pauses)
    setHeaderOpen(true);
  };
  items.forEach((li, i) => {
    const sub = sourceItems[i] && sourceItems[i].querySelector(':scope > ul');
    const trigger = li.querySelector(':scope > a');
    if (!sub || !trigger) return;
    const panel = buildMegaPanel(sub);
    panel.id = `header-mega-${i + 1}`;
    trigger.setAttribute('aria-controls', panel.id);
    li.append(panel);
    entries.push({ li, trigger });
    li.addEventListener('mouseenter', () => { if (pointer !== 'touch') open(li); });
    li.addEventListener('mouseleave', () => { if (pointer !== 'touch') close(li); });
    li.addEventListener('focusin', () => { if (!refocusing) open(li); });
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) close(li); });
    trigger.addEventListener('pointerdown', (e) => { pointer = e.pointerType; });
    // touch at desktop width: first tap opens the panel, a second tap follows the link
    trigger.addEventListener('click', (e) => {
      if (!isDesktop.matches || pointer !== 'touch' || li.classList.contains('mega-open')) return;
      e.preventDefault();
      open(li);
    });
  });
  if (!entries.length) return closeAll;
  document.addEventListener('pointerdown', (e) => {
    pointer = e.pointerType;
    if (!navList.contains(e.target)) closeAll();
  });
  window.addEventListener('keydown', (e) => {
    const current = entries.find(({ li }) => li.classList.contains('mega-open'));
    if (e.code !== 'Escape' || !current) return;
    close(current.li);
    // return focus to the trigger without reopening the panel through focusin
    refocusing = true;
    current.trigger.focus();
    refocusing = false;
  });
  window.addEventListener('scroll', closeAll, { passive: true });
  isDesktop.addEventListener('change', closeAll);
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
  // the stage is usually still collapsed when the header decorates (sections and the hero image
  // load later), so re-check whenever it changes size, not only on scroll
  if (stage && window.ResizeObserver) new ResizeObserver(update).observe(stage);
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
    // the mega-menu reads a pristine copy: the drawer decoration adds Back/overview rows
    const megaSource = navList.cloneNode(true);
    unwrapParagraphs(megaSource);
    closeSubs = decorateNavList(navList, backLabel);
    initMegaMenu(navList, megaSource);
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
