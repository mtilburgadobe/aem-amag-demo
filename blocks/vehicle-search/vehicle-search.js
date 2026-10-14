/**
 * vehicle-search — the home "Our vehicles" search panel (prototype `.amag-dspSearch`; schema
 * `stardust/eds-schema/en-html.json` section 0). Dynamic-features row 4: host-bound marketplace
 * search shipped as captured — the filters are inert pickers, the CTA links to the marketplace.
 * Rows, read by role (never by index):
 *   - head row: <picture>/<img> (40px icon) + <h2> (headline) + <p> (intro)
 *   - picker rows: cell 1 a <p> label (hidden like the live <label>), cell 2 a <ul> of options;
 *     the first <li> is the shown value; a single-option list renders disabled (live "All models"
 *     waits for a brand). Opening the picker shows the authored list; choosing marks the <li>.
 *   - CTA row: `<em><a>` (violet secondary button); the search glyph is generated (aria-hidden)
 * EW7: the picker toggle is a text-less <button> labelled by the authored label paragraph.
 * Unit hook: `amag-dspSearch` on the block root.
 */

const SEARCH = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" '
  + 'xmlns="http://www.w3.org/2000/svg"><path d="M3.33268 20.6667C2.59802 20.6667 1.99935 '
  + '20.0693 1.99935 19.3333V16.6667C1.99935 15.932 2.59802 15.3333 3.33268 15.3333H4.66602'
  + 'C4.66602 15.3333 4.66602 15.3333 4.66602 15.3333L6.69202 10.1267C7.11868 9.18 8.06668 '
  + '8.66667 9.11602 8.66667H15.5527C16.6007 8.66667 17.5487 9.18 17.9753 10.1267L20.0007 15.3333'
  + 'H21.3327C22.0673 15.3333 22.666 15.932 22.666 16.6667V19.3333C22.666 20.0693 22.0673 '
  + '20.6667 21.3327 20.6667H20.666V22C20.666 22.736 20.0673 23.3333 19.3327 23.3333H17.9993'
  + 'C17.2647 23.3333 16.666 22.736 16.666 22V20.6667H7.99935V22C7.99935 22.736 7.40068 23.3333 '
  + '6.66602 23.3333H5.33268C4.59802 23.3333 3.99935 22.736 3.99935 22V20.6667H3.33268ZM7.99935 '
  + '15.3333H16.666L15.2593 11.5107C15.1727 11.288 14.9833 11.3333 14.6327 11.3333H10.0327'
  + 'C9.68202 11.3333 9.49268 11.288 9.40602 11.5107L7.99935 15.3333ZM7.33268 18.6667'
  + 'C7.33268 18.2987 7.03202 18 6.66602 18C6.29868 18 5.99935 18.2987 5.99935 18.6667'
  + 'C5.99935 19.0347 6.29868 19.3333 6.66602 19.3333C7.03202 19.3333 7.33268 19.0347 7.33268 '
  + '18.6667ZM18.666 18.6667C18.666 18.2987 18.3653 18 17.9993 18C17.632 18 17.3327 18.2987 '
  + '17.3327 18.6667C17.3327 19.0347 17.632 19.3333 17.9993 19.3333C18.3653 19.3333 18.666 '
  + '19.0347 18.666 18.6667ZM27.3327 26.6667L30.666 30" stroke="#fff" stroke-width="1.5" '
  + 'stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

const text = (n) => (n ? n.textContent.trim() : '');
const isCta = (p) => {
  const a = p.querySelector('a');
  return !!a && text(a) !== '' && text(p) === text(a);
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

function buildPicker(row, list) {
  counter += 1;
  const field = el('field');
  const label = [...row.querySelectorAll('p')].find((p) => !p.closest('li'));
  const items = [...list.querySelectorAll('li')];
  if (items.length < 2) field.classList.add('disabled');
  const box = el('field-box');
  const toggle = el('field-toggle', 'button');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-haspopup', 'listbox');
  if (field.classList.contains('disabled')) toggle.disabled = true;
  if (label) {
    label.id = `vehicle-search-label-${counter}`;
    toggle.setAttribute('aria-labelledby', label.id);
    field.append(wrapNode(label, 'field-label'));
  }
  const listWrap = wrapNode(list, 'field-list');
  list.setAttribute('role', 'listbox');
  items.forEach((li, k) => {
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', k === 0 ? 'true' : 'false');
    li.addEventListener('click', () => {
      items.forEach((o) => o.setAttribute('aria-selected', o === li ? 'true' : 'false'));
      field.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  box.append(listWrap, toggle);
  field.append(box);
  toggle.addEventListener('click', () => {
    const open = field.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  return field;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const wrap = el('wrap amag-dspSearch');
  const head = el('head');
  const filter = el('filter');
  const ctaRow = el('search');
  rows.forEach((row) => {
    const list = row.querySelector('ul, ol');
    const heading = row.querySelector('h1, h2, h3');
    const media = row.querySelector('picture, img');
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.closest('li'));
    const ctas = ps.filter(isCta);
    if (list) {
      filter.append(buildPicker(row, list));
      return;
    }
    if (ctas.length) {
      ctas.forEach((p) => {
        const a = p.querySelector('a');
        if (a && !a.querySelector('svg')) {
          const glyph = el('glyph', 'span');
          glyph.setAttribute('aria-hidden', 'true');
          glyph.innerHTML = SEARCH;
          a.prepend(glyph);
        }
        ctaRow.append(wrapNode(p, 'cta'));
      });
      return;
    }
    if (media) head.append(wrapNode(media, 'icon'));
    if (heading) head.append(wrapNode(heading, 'headline'));
    const copy = ps.filter((p) => !p.querySelector('picture, img'));
    if (copy.length) {
      const intro = el('intro');
      intro.append(...copy);
      head.append(intro);
    }
  });
  const grid = el('grid');
  if (filter.children.length) grid.append(filter);
  if (ctaRow.children.length) grid.append(ctaRow);
  wrap.append(head, grid);
  block.replaceChildren(wrap);
  shell(block, 'vehicle-search');
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.querySelectorAll('.field.open').forEach((f) => {
        f.classList.remove('open');
        f.querySelector('.field-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });
}
