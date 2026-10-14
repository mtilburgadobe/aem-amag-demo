/**
 * garage-chooser — the "Choose your AMAG garage" full-screen chooser of the services pages
 * (prototype `.amag-garageOverlay.modal`, Bootstrap 4 modal shell @1619636; schema
 * stardust/eds-schema/en-services-html.json, section 4, repeat
 * `.amag-garageOverlay__garageList--garage` ×100). Reconstructive, ONE ROW PER GARAGE; a
 * leading row with a heading and no link is the chooser headline (the live <h3>). Garage cells
 * are read by role: the link-bearing <p> is the garage name and the row is that link (EW6:
 * href read, inner anchor unwrapped); the remaining <p>s are the street and the place.
 * Opens from any `a[href$="#garage-chooser"]` on the page (the cta-band's "Contact garage"
 * button authors that hash); observed live motion: body.modal-open, `.modal.show`, the dialog's
 * 300 ms transform. Closes on the two close controls, the Escape key and a backdrop click.
 * The search field filters the list by text. @ew-exempt none — every authored text moves.
 * Unit hook: `amag-garageOverlay__garageList--garage` per row. Renders fixed — no flow height.
 */

const ICONS = {
  close: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M21.2384 0.833322C21.4784 0.833322 21.7068 '
    + '0.936659 21.8634 1.11499C22.1668 1.45999 22.1334 1.98832 21.7884 2.29166L2.62011 '
    + '19.1667L38.7384 19.1667C39.1984 19.1667 39.5718 19.54 39.5718 20C39.5718 20.46 39.1984 '
    + '20.8333 38.7384 20.8333L2.62344 20.8333L21.7901 37.7083C21.9568 37.855 22.0568 38.0583 '
    + '22.0718 38.28C22.0851 38.5017 22.0118 38.7167 21.8651 38.8833C21.7068 39.0633 21.4784 '
    + '39.1667 21.2401 39.1667C21.0368 39.1667 20.8418 39.0933 20.6901 38.9583L1.28345 '
    + '21.8733C1.20511 21.8033 1.13011 21.73 1.06011 21.65C0.696776 21.2383 0.486777 20.725 '
    + '0.451777 20.1617C0.440111 20.1183 0.430109 20.065 0.430109 20C0.430109 19.9567 0.43511 '
    + '19.92 0.441775 19.8917C0.441775 19.8767 0.441775 19.8617 0.441775 19.845C0.483442 19.175 '
    + '0.783445 18.565 1.28345 18.1233L20.6884 1.03999C20.8401 0.906656 21.0368 0.833322 '
    + '21.2384 0.833322Z" fill="#222"/></svg>',
  search: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M31.3333 32C31.1547 32 30.988 31.9307 '
    + '30.8613 31.8053L23.4093 24.3533C20.8227 26.708 17.4947 28 14 28C6.28 28 0 21.72 0 14C0 '
    + '6.28 6.28 0 14 0C21.72 0 28 6.28 28 14C28 17.4947 26.708 20.8227 24.352 23.4093L31.804 '
    + '30.8613C31.9307 30.988 32 31.1547 32 31.3333C32 31.512 31.9307 31.6787 31.8053 '
    + '31.8053C31.68 31.932 31.512 32 31.3333 32ZM14 1.33333C7.016 1.33333 1.33333 7.016 '
    + '1.33333 14C1.33333 20.984 7.016 26.6667 14 26.6667C20.984 26.6667 26.6667 20.984 26.6667 '
    + '14C26.6667 7.016 20.984 1.33333 14 1.33333Z" fill="#801977"/></svg>',
};

const TRANSITION_MS = 300;

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

function isHeadRow(row) {
  return !!row.querySelector('h1, h2, h3, h4') && !row.querySelector('a[href]');
}

function buildGarage(row) {
  const link = row.querySelector('a[href]');
  const ps = [...row.querySelectorAll('p')];
  const namePar = link ? (link.closest('p') || link) : ps[0];
  const rest = ps.filter((p) => p !== namePar);
  const item = el('garage amag-garageOverlay__garageList--garage');
  const host = link ? el('garage-link', 'a') : el('garage-link');
  if (link) {
    host.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes);
  }
  // whitespace text nodes between the moved paragraphs keep the link's textContent equal to
  // the source's ("name street, place"); block layout ignores them, the editor never sees them
  const info = el('garage-info');
  if (namePar) info.append(wrapNode(namePar, 'garage-name'));
  if (rest.length) {
    const addr = el('garage-address');
    rest.forEach((p, i) => {
      if (i) addr.append(document.createTextNode(' '));
      addr.append(p);
    });
    info.append(document.createTextNode(' '), addr);
  }
  host.append(info);
  item.append(host);
  return item;
}

function closeButton() {
  const b = el('close', 'button');
  b.type = 'button';
  b.setAttribute('aria-label', 'Close');
  b.innerHTML = ICONS.close;
  return b;
}

function wire(modal, dialog, closers, input, garages) {
  let timer = null;
  const open = () => {
    clearTimeout(timer);
    modal.hidden = false;
    modal.setAttribute('aria-modal', 'true');
    modal.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    requestAnimationFrame(() => modal.classList.add('show'));
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    timer = setTimeout(() => {
      modal.style.display = '';
      modal.hidden = true;
    }, TRANSITION_MS);
  };
  closers.forEach((c) => c.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!href.endsWith('#garage-chooser')) return;
    e.preventDefault();
    open();
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    garages.forEach((g) => {
      g.hidden = q !== '' && !g.textContent.toLowerCase().includes(q);
    });
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  block.id = 'garage-chooser';
  const modal = el('modal amag-garageOverlay');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-hidden', 'true');
  modal.hidden = true;
  const dialog = el('dialog modal-dialog');
  const content = el('content modal-content');
  const header = el('header modal-header');
  const closers = [closeButton(), closeButton()];
  header.append(closers[0], el('header-spacer'), closers[1]);
  const body = el('body modal-body');
  const panel = el('panel amag-garageOverlay__content');
  const list = el('list amag-garageOverlay__garageList');
  const garages = [];
  rows.forEach((row) => {
    if (isHeadRow(row)) {
      const heading = row.querySelector('h1, h2, h3, h4');
      panel.append(wrapNode(heading, 'headline amag-garageOverlay__headline'));
      return;
    }
    const g = buildGarage(row);
    garages.push(g);
    list.append(g);
  });
  const search = el('search amag-garageOverlay__search');
  const field = el('search-field');
  const icon = el('search-icon', 'span');
  icon.innerHTML = ICONS.search;
  const input = el('search-input', 'input');
  input.type = 'text';
  input.setAttribute('aria-label', 'Search garage');
  input.autocomplete = 'off';
  field.append(icon, input);
  search.append(field);
  panel.append(search, list);
  body.append(panel);
  content.append(header, body);
  dialog.append(content);
  modal.append(dialog);
  block.replaceChildren(modal);
  wire(modal, dialog, closers, input, garages);
}
