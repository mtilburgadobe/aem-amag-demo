/**
 * tabs-garage — the garage detail page's icon tab bar (live `.amag-introTabModul`,
 * /de/garagenuebersicht/garage-buelach.html) and its closing "Mehr über …" anchor band
 * (live `#anchor-link-container`). The tab PANELS are ordinary page sections: every following
 * section whose section metadata carries `Tab: <tab label>` (rendered by the pipeline as
 * `data-tab`) belongs to that tab; only the active tab's sections are shown. A section with no
 * `Tab` value ends the grouping. Authors keep editing blocks in plain sections.
 *
 * Authoring rows (read by role, never by index — Document Authoring may unwrap a single
 * paragraph cell into bare inline content):
 *   - tab rows: an icon <picture>/<img> + a plain label <p> ("Fahrzeug-Angebote") — no link,
 *     no heading. The tab id is the label as a class name (`fahrzeug-angebote`).
 *   - band row (optional, trailing): an <h2>/<h3> (or <strong> paragraph) headline + link
 *     <p>s whose href is `#<tab id>` ("Weiter zu unseren …"). It renders after the LAST tab
 *     panel section; the link to the active tab is hidden; clicking a link switches the tab
 *     and scrolls the tab bar into view. The arrow glyph is generated (aria-hidden).
 * A tabs-garage block holding ONLY a band row renders the band in place and drives the tab
 * bar of the page (fallback for pages that author the band in its own section).
 * Deep links: `#<tab id>` in the URL opens that tab. A leftover `section-metadata` block in a
 * panel section (client-side rendering) is read for `Tab` and removed.
 * EW7: tabs are div[role=tab] (keyboard: Enter/Space, arrow keys) — no <button> hosts the
 * authored labels. Section shell: full-bleed wrapper (`tabs-garage-bleed-wrapper`), the
 * tablist line spans the viewport, tabs sit in the responsive gutter.
 * Unit hooks: `amag-introTabModul__tab` per tab, `alc-link` per band link.
 */

import { readBlockConfig, toClassName } from '../../scripts/aem.js';

const ARROW = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M16 1v30M16 1 2 15M16 1l14 14" '
  + 'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
  + 'stroke-linejoin="round"/></svg>';

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');

const ACTIVATE = 'tabs-garage:activate';
const CHANGED = 'tabs-garage:changed';

function tabIdFromHref(href) {
  if (!href) return '';
  const i = href.indexOf('#');
  return i < 0 ? '' : toClassName(decodeURIComponent(href.slice(i + 1)));
}

function sectionTab(section) {
  if (section.dataset.tab) return toClassName(section.dataset.tab);
  const meta = section.querySelector(':scope > div > .section-metadata, :scope > .section-metadata');
  if (!meta) return '';
  const cfg = readBlockConfig(meta);
  const wrap = meta.parentElement;
  meta.remove();
  if (wrap && wrap !== section && !wrap.children.length) wrap.remove();
  if (cfg.style) {
    cfg.style.split(',').map((s) => toClassName(s.trim())).filter(Boolean)
      .forEach((c) => section.classList.add(c));
  }
  if (!cfg.tab) return '';
  section.dataset.tab = cfg.tab;
  return toClassName(cfg.tab);
}

function buildBand(row, tabIndex) {
  const band = el('band-row');
  const inner = el('band-inner alc-wrapper');
  const head = el('band-head');
  const links = el('band-links');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('band-title');
    head.append(heading);
  }
  [...row.querySelectorAll('p')].forEach((p) => {
    const a = p.querySelector('a[href]');
    if (!a) {
      if (!heading && !head.children.length && text(p)) {
        p.classList.add('band-title');
        head.append(p);
      }
      return;
    }
    const target = tabIdFromHref(a.getAttribute('href'));
    const link = el('band-link alc-link', 'a');
    link.href = a.getAttribute('href');
    link.dataset.target = target;
    const idx = tabIndex(target);
    if (idx >= 0) link.dataset.tabIndex = String(idx);
    const icon = el('band-icon', 'span');
    icon.innerHTML = ARROW;
    const label = el('band-label alc-linktext', 'span');
    label.textContent = text(a);
    link.append(icon, label);
    links.append(link);
  });
  if (head.children.length) inner.append(head);
  inner.append(links);
  band.append(inner);
  return band;
}

function wireBandLinks(band, activate) {
  band.querySelectorAll('.band-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!link.dataset.target) return;
      e.preventDefault();
      activate(link.dataset.target, true);
    });
  });
}

function shell(block, name) {
  const wrapper = block.parentElement;
  if (wrapper && wrapper.classList.contains(`${name}-wrapper`)) {
    wrapper.classList.add(`${name}-bleed-wrapper`);
  }
}

export default function decorate(block) {
  const tabRows = [];
  let bandRow = null;
  [...block.children].forEach((row) => {
    const hasLink = row.querySelector('a[href]');
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (hasLink || hasHeading) {
      if (!bandRow) bandRow = row;
    } else if (text(row)) tabRows.push(row);
  });

  shell(block, 'tabs-garage');

  // band-only instance: render in place, drive the page's tab bar through events
  if (!tabRows.length) {
    const tabIndex = () => -1;
    const band = bandRow ? buildBand(bandRow, tabIndex) : null;
    block.replaceChildren(...(band ? [band] : []));
    block.classList.add('band-only');
    if (band) {
      wireBandLinks(band, (id) => document.dispatchEvent(
        new CustomEvent(ACTIVATE, { detail: { id, scroll: true } }),
      ));
      const sync = (state) => {
        if (!state) return;
        band.querySelectorAll('.band-link').forEach((l) => {
          l.hidden = l.dataset.target === state.id;
          if (state.indexOf && l.dataset.target in state.indexOf) {
            l.dataset.tabIndex = String(state.indexOf[l.dataset.target]);
          }
        });
      };
      document.addEventListener(CHANGED, (e) => sync(e.detail));
      sync(window.tabsGarageState);
    }
    return;
  }

  // tab tiles
  const tabItems = tabRows.map((row, i) => {
    const icon = row.querySelector('picture, img');
    const labelText = [...row.querySelectorAll('p, div')]
      .filter((n) => !n.querySelector('p, div') && text(n))
      .map(text).join(' ') || text(row);
    const id = toClassName(labelText);
    const tab = el('tab amag-introTabModul__tab');
    tab.setAttribute('role', 'tab');
    tab.id = `tabs-garage-tab-${id}`;
    tab.dataset.tab = id;
    tab.dataset.tabIndex = String(i);
    if (icon) {
      const holder = el('tab-icon', 'span');
      holder.setAttribute('aria-hidden', 'true');
      holder.append(icon);
      tab.append(holder);
    }
    const label = el('tab-label', 'span');
    label.textContent = labelText;
    tab.append(label);
    return { id, tab, panels: [] };
  });
  const byId = Object.fromEntries(tabItems.map((t) => [t.id, t]));
  const indexOf = Object.fromEntries(tabItems.map((t, i) => [t.id, i]));

  const list = el('tablist');
  list.setAttribute('role', 'tablist');
  list.append(...tabItems.map((t) => t.tab));
  const wrap = el('wrap');
  wrap.append(list);

  // panels: the sections after this one, grouped by their Tab value
  const ownSection = block.closest('.section');
  let lastPanel = null;
  if (ownSection) {
    let s = ownSection.nextElementSibling;
    while (s && s.classList.contains('section')) {
      const id = sectionTab(s);
      if (!id || !byId[id]) break;
      byId[id].panels.push(s);
      s.classList.add('tabs-garage-panel');
      s.setAttribute('role', 'tabpanel');
      s.setAttribute('aria-labelledby', byId[id].tab.id);
      lastPanel = s;
      s = s.nextElementSibling;
    }
  }

  let band = null;
  if (bandRow) {
    band = buildBand(bandRow, (id) => (id in indexOf ? indexOf[id] : -1));
    if (lastPanel) {
      // the band closes the tab area: its own section after the last panel
      const section = el('section tabs-garage-band-section');
      section.dataset.sectionStatus = 'loaded';
      const bandWrapper = el('tabs-garage-wrapper tabs-garage-bleed-wrapper');
      const bandBlock = el('tabs-garage band-only block');
      bandBlock.dataset.blockName = 'tabs-garage';
      bandBlock.dataset.blockStatus = 'loaded';
      bandBlock.append(band);
      bandWrapper.append(bandBlock);
      section.append(bandWrapper);
      lastPanel.after(section);
    } else {
      wrap.append(band);
    }
  }

  block.replaceChildren(wrap);

  let active = -1;
  const activate = (id, scroll) => {
    const t = byId[id];
    if (!t) return;
    const i = indexOf[id];
    if (i !== active) {
      active = i;
      tabItems.forEach((x, k) => {
        const on = k === i;
        x.tab.classList.toggle('cmp-tabs__tab--active', on);
        x.tab.classList.toggle('active', on);
        x.tab.setAttribute('aria-selected', String(on));
        x.tab.tabIndex = on ? 0 : -1;
        x.panels.forEach((p) => { p.hidden = !on; });
      });
      if (band) {
        band.querySelectorAll('.band-link').forEach((l) => { l.hidden = l.dataset.target === id; });
      }
      window.tabsGarageState = { id, indexOf };
      document.dispatchEvent(new CustomEvent(CHANGED, { detail: window.tabsGarageState }));
    }
    if (scroll) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  tabItems.forEach((t, i) => {
    t.tab.addEventListener('click', () => activate(t.id));
    t.tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(t.id);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = tabItems[(i + (e.key === 'ArrowRight' ? 1 : tabItems.length - 1)) % tabItems.length];
        activate(n.id);
        n.tab.focus();
      }
    });
  });
  if (band) wireBandLinks(band, activate);
  document.addEventListener(ACTIVATE, (e) => activate(e.detail.id, e.detail.scroll));

  // in-page links to a tab id anywhere on the page switch the tab as well
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.closest('.tabs-garage')) return;
    const url = new URL(a.href, window.location.href);
    if (url.pathname !== window.location.pathname) return;
    const id = tabIdFromHref(url.hash);
    if (!byId[id]) return;
    e.preventDefault();
    activate(id, true);
  });

  const fromHash = tabIdFromHref(window.location.hash);
  activate(byId[fromHash] ? fromHash : tabItems[0].id, !!byId[fromHash]);
  window.addEventListener('hashchange', () => {
    const id = tabIdFromHref(window.location.hash);
    if (byId[id]) activate(id, true);
  });
}
