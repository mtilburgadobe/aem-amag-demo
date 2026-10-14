/**
 * direct-entry — the fixed "Directly to" pill + pop-up of the services pages (prototype
 * `.amag-direct-entry`; behaviour ported from clientlib-amagch.min.js @2355270, replica
 * motion/en-services-html.json). Rows, read by role (never by index):
 *   - a row with an <img> and a plain <p> and no link: a pill face — the first is the closed
 *     face (icon + "Services"), the second the open face (icon + "Close")
 *   - a row with only a short <p>: the pop-up topline ("Directly to")
 *   - a row with a link-bearing <p> (+ an <img>): one pop-up entry — the entry is that link
 *     (EW6: href read, inner anchor unwrapped); the chevron is generated (aria-hidden)
 * Motion: the pill gets `.show` once scrollY >= 300 (50 px hysteresis); a click toggles the
 * pop-up `.show`, the backdrop, the faces and body.no-scroll (fired on live). EW7: the pill is
 * a div[role=button]; no <button> hosts the authored labels. Renders fixed — zero flow height.
 */

const CHEVRON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<path d="M0.649245 24C0.506245 24 0.370245 23.939 0.275245 23.832C0.0922448 23.625 '
  + '0.112245 23.308 0.318245 23.126L12.8932 12L0.318245 0.875C0.111245 0.692 0.0922449 0.375 '
  + '0.274245 0.169C0.370245 0.062 0.506245 0 0.649245 0C0.771245 0 0.889245 0.045 0.980245 '
  + '0.125L13.5562 11.251C13.5852 11.277 13.6122 11.303 13.6372 11.331C14.0062 11.747 13.9692 '
  + '12.382 13.5572 12.747L0.980245 23.875C0.888245 23.956 0.771245 24 0.649245 24Z"/></svg>';

const SHOW_AT = 300;
const HYSTERESIS = 50;

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

function buildFace(row, className) {
  const face = el(className);
  const media = row.querySelector('picture, img');
  const label = [...row.querySelectorAll('p')].find((p) => !p.querySelector('picture, img'));
  if (media) face.append(wrapNode(media, 'face-icon'));
  if (label) face.append(wrapNode(label, 'face-label'));
  return face;
}

function buildEntry(row) {
  const link = row.querySelector('a[href]');
  const media = row.querySelector('picture, img');
  const par = link.closest('p') || link;
  const entry = el('entry-link amag-direct-entry__pop-up-element', 'a');
  entry.href = link.getAttribute('href');
  if (media) entry.append(wrapNode(media, 'entry-icon'));
  link.replaceWith(...link.childNodes);
  entry.append(wrapNode(par, 'entry-label'));
  const chevron = el('entry-chevron', 'span');
  chevron.innerHTML = CHEVRON;
  entry.append(chevron);
  return entry;
}

function wire(root, button, popup, backdrop, open, close) {
  let shown = false;
  const set = (on) => {
    shown = on;
    popup.classList.toggle('show', on);
    backdrop.hidden = !on;
    open.hidden = on;
    close.hidden = !on;
    document.body.classList.toggle('no-scroll', on);
    document.body.style.overflowY = on ? 'hidden' : '';
    button.setAttribute('aria-expanded', String(on));
  };
  button.addEventListener('click', () => set(!shown));
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      set(!shown);
    }
  });
  backdrop.addEventListener('click', () => set(false));
  let last = 0;
  const onScroll = () => {
    const t = window.scrollY;
    if (Math.abs(t - last) < HYSTERESIS) return;
    last = t;
    button.blur();
    button.classList.toggle('show', t >= SHOW_AT);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (window.scrollY >= SHOW_AT) button.classList.add('show');
  root.addEventListener('direct-entry:reset', () => set(false));
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const faces = [];
  let topline = null;
  const entries = [];
  rows.forEach((row) => {
    if (row.querySelector('a[href]')) entries.push(row);
    else if (row.querySelector('picture, img')) faces.push(row);
    else if (row.querySelector('p')) topline = row.querySelector('p');
  });

  const root = el('entry amag-direct-entry');
  const backdrop = el('backdrop amag-direct-entry__backdrop');
  backdrop.hidden = true;
  const popup = el('pop-up amag-direct-entry__pop-up');
  if (topline) popup.append(wrapNode(topline, 'topline amag-direct-entry__pop-up-topline'));
  const list = el('entries');
  entries.forEach((row) => list.append(buildEntry(row)));
  popup.append(list);
  const button = el('button amag-direct-entry__button');
  button.setAttribute('role', 'button');
  button.tabIndex = 0;
  button.setAttribute('aria-expanded', 'false');
  const open = buildFace(faces[0] || rows[0], 'face face-open');
  const close = faces[1] ? buildFace(faces[1], 'face face-close') : el('face face-close');
  close.hidden = true;
  button.append(open, close);
  root.append(backdrop, popup, button);
  block.replaceChildren(root);
  wire(root, button, popup, backdrop, open, close);
}
