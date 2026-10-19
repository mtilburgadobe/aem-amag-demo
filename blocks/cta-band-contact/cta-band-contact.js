/**
 * cta-band-contact — the garage page's brand contact module (live `.amag-tabsWrapper` +
 * `.amag-contactPersonWrapper`, /de/garagenuebersicht/garage-buelach.html sections 6 and 12).
 * A contact variant of `cta-band`: a strip of brand-logo tabs (one per brand, the active one
 * underlined in dark blue) above a grey panel — team photo (left half ≥ 768) beside the
 * headline, team name, department and the dark-blue icon CTA ("Audi Team").
 * The section head (eyebrow <p> + <h2>) is DEFAULT CONTENT before the block and is
 * reabsorbed (EW8), laid out like the `news-cards` carousel head (eyebrow | headline).
 *
 * ONE ROW PER BRAND; cells are read by role, never by index (Document Authoring may unwrap a
 * single-paragraph cell into bare inline content):
 *   - a cell holding only an image, BEFORE another image-only cell: the brand logo (the tab).
 *     A row with a single image uses it as the photo (no logo tab).
 *   - the (other) image-only cell: the team photo
 *   - <h2>/<h3>/<h4>: the panel headline ("Ihre Audi Ansprechpartner in Bülach")
 *   - a <p> that is entirely <strong>/<b>: the team name ("Audi")
 *   - link-bearing <p> (`<strong><a><img>label</a></strong>`): the CTA; an icon authored in the
 *     same paragraph is moved into the link; split links (same href) are merged
 *   - any other <p>: the department line ("Autoverkauf")
 * With one brand the tab strip still shows its logo (live behaviour); with none it is omitted.
 * EW7: tabs are div[role=tab] (keyboard: Enter/Space, arrow keys), labelled by the logo alt.
 * Section shell: full-bleed wrapper (`cta-band-contact-bleed-wrapper`), `band` on the
 * section's first wrapper, `section-end` on its last.
 * Unit hooks: `amag-tabsWrapper` on the root, `amag-contactPersonWrapper` per panel.
 */

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');
const media = (n) => [...n.querySelectorAll('picture, img')]
  .filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));

function wrapNode(node, className) {
  const w = el(className);
  w.append(node);
  return w;
}

/* Document Authoring may hand a cell over as bare inline content: re-wrap it in a <p>. */
function normaliseCell(cell) {
  const blockish = 'p, h1, h2, h3, h4, h5, h6, ul, ol, div, picture, blockquote';
  let loose = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === Node.ELEMENT_NODE && n.matches(blockish);
    if (isBlock) {
      loose = null;
      return;
    }
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) {
      if (loose) loose.append(n);
      return;
    }
    if (!loose) {
      loose = document.createElement('p');
      n.before(loose);
    }
    loose.append(n);
  });
}

/* `<a><img></a><a>label</a>` (same href) and `<a><img></a><strong>label</strong>` → one link */
function mergeSplitLinks(p) {
  const links = [...p.querySelectorAll('a[href]')];
  for (let i = links.length - 1; i > 0; i -= 1) {
    const a = links[i];
    const before = links[i - 1];
    if (a.getAttribute('href') === before.getAttribute('href')) {
      before.append(...a.childNodes);
      const parent = a.parentElement;
      a.remove();
      if (parent && parent !== p && !text(parent) && !media(parent).length) parent.remove();
    }
  }
  const remaining = p.querySelectorAll('a[href]');
  if (remaining.length !== 1) return;
  const [a] = remaining;
  if (!text(a) && text(p)) {
    [...p.childNodes].filter((n) => n !== a && !n.contains(a)).forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.matches('strong, em, b')) {
        a.append(...n.childNodes);
        n.remove();
      } else a.append(n);
    });
  }
  const icon = media(p).find((m) => !a.contains(m));
  if (icon) a.prepend(icon);
}

const isCta = (p) => {
  const a = p.querySelector('a[href]');
  return !!a && text(a) !== '' && text(p) === text(a);
};

const isBoldLine = (p) => {
  const b = p.querySelector('strong, b');
  return !!b && !p.querySelector('a') && text(b) === text(p);
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

function buildPanel(row) {
  const cells = [...row.children];
  cells.forEach(normaliseCell);
  const imageOnly = cells.filter((c) => media(c).length && !text(c) && !c.querySelector('a[href]'));
  const logoCell = imageOnly.length > 1 ? imageOnly[0] : null;
  const photoCell = imageOnly.length > 1 ? imageOnly[1] : imageOnly[0];
  const logo = logoCell ? media(logoCell)[0] : null;
  const photo = photoCell ? media(photoCell)[0] : null;

  const textCells = cells.filter((c) => c !== logoCell && c !== photoCell);
  const nodes = textCells.flatMap((c) => [...c.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]);
  nodes.filter((n) => n.tagName === 'P').forEach(mergeSplitLinks);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ps = nodes.filter((n) => n.tagName === 'P' && (text(n) || media(n).length));
  const ctas = ps.filter(isCta);
  const team = ps.find((p) => !isCta(p) && isBoldLine(p));
  const lines = ps.filter((p) => !isCta(p) && p !== team && text(p));

  const panel = el('panel amag-contactPersonWrapper');
  panel.setAttribute('role', 'tabpanel');
  if (photo) {
    const img = photo.tagName === 'IMG' ? photo : photo.querySelector('img');
    if (img) img.loading = 'lazy';
    panel.append(wrapNode(photo, 'photo'));
  }
  const info = el('info');
  if (heading) info.append(wrapNode(heading, 'headline'));
  if (team) info.append(wrapNode(team, 'team'));
  if (lines.length) {
    const d = el('department');
    d.append(...lines);
    info.append(d);
  }
  if (ctas.length) {
    const cta = el('cta');
    ctas.forEach((p) => {
      const a = p.querySelector('a[href]');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      cta.append(p);
    });
    info.append(cta);
  }
  panel.append(info);
  return { panel, logo, label: logo ? (logo.querySelector('img') || logo).alt : text(heading) };
}

export default function decorate(block) {
  block.classList.add('amag-tabsWrapper');
  const rows = [...block.children].filter((r) => text(r) || r.querySelector('picture, img'));
  const wrap = el('wrap');
  const wrapper = block.parentElement;
  const prevWrapper = wrapper ? wrapper.previousElementSibling : null;
  if (prevWrapper && prevWrapper.classList.contains('default-content-wrapper')) {
    wrap.append(buildHead([...prevWrapper.children]));
    prevWrapper.remove();
  }

  const items = rows.map(buildPanel);
  const uid = Math.random().toString(36).slice(2, 8);
  const list = el('tablist');
  list.setAttribute('role', 'tablist');
  const panels = el('panels');
  items.forEach((item, i) => {
    item.panel.id = `cta-band-contact-${uid}-panel-${i}`;
    panels.append(item.panel);
    if (!item.logo) return;
    const tab = el('tab');
    tab.setAttribute('role', 'tab');
    tab.id = `cta-band-contact-${uid}-tab-${i}`;
    tab.setAttribute('aria-controls', item.panel.id);
    if (item.label) tab.setAttribute('aria-label', item.label);
    tab.append(wrapNode(item.logo, 'logo'));
    item.tab = tab;
    item.panel.setAttribute('aria-labelledby', tab.id);
    list.append(tab);
  });

  const tabbed = items.filter((x) => x.tab);
  const show = (i) => {
    items.forEach((x, k) => {
      const on = k === i;
      x.panel.hidden = !on;
      if (x.tab) {
        x.tab.classList.toggle('active', on);
        x.tab.setAttribute('aria-selected', String(on));
        x.tab.tabIndex = on ? 0 : -1;
      }
    });
  };
  items.forEach((x, i) => {
    if (!x.tab) return;
    x.tab.addEventListener('click', () => show(i));
    x.tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const pos = tabbed.indexOf(x);
        const n = tabbed[(pos + (e.key === 'ArrowRight' ? 1 : tabbed.length - 1)) % tabbed.length];
        const k = items.indexOf(n);
        show(k);
        n.tab.focus();
      }
    });
  });

  if (list.children.length) wrap.append(list);
  wrap.append(panels);
  block.replaceChildren(wrap);
  if (items.length) show(0);
  shell(block, 'cta-band-contact');
}
