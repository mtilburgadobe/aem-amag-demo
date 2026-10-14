/**
 * booking-wizard — the OTV online-appointment wizard of www.amag.ch, first pane
 * ("Ihr Fahrzeug") as captured. Template-slotted: the prototype's #amag-otv inner DOM is
 * rebuilt as empty slot containers and the authored nodes are MOVED into them (EW1/EW2).
 * Schema: stardust/eds-schema/de-service-auto-services-online-termin-buchen-html.json.
 *
 * Authoring rows (classified by content, never by index):
 *   steps     — <ul> of step labels (<a href="#pane"> as captured, inert) before the heading;
 *               rendered as the step bar (sidebar >= 1200, horizontal bar below), CSS counters
 *   intro     — <h1>pane title</h1><p>lede</p>
 *   field     — 3 cells: <p>label</p> | <ul>options</ul> | <p>validation message</p>; the first
 *               option is the placeholder entry. A field whose option list has one entry is the
 *               dependent select (hidden as captured — options come from the booking backend).
 *   action    — <p><strong><a>primary CTA</a></strong></p> (link-out to the source booking entry)
 *   login     — <p>divider word</p><p><a>login CTA</a></p> (outlined white button)
 *   benefits  — <h4>box title</h4><ul>bullets</ul> (grey info box)
 *
 * Behaviours (motion-observe on live, stardust/replica/motion/<slug>.json): scroll-state
 * chrome (anchor .nav-open while the header bar shows; fixed step bar below 1200 once the
 * anchor scrolled past, top .35s), brand dropdown click (.show on menu + chevron, .active on
 * the label; outside click closes), option pick (floats the label, mirrors the chosen entry
 * on the trigger). Step links, CTA hovers and the language switch were dead on live and stay
 * dead. The booking backend (model list, availability, submission) is host-bound: the
 * primary CTA links out as decided in stardust/dynamic-features.md row 8.
 *
 * Decorative: the captured reCAPTCHA badge (third-party iframe, capture state) is a CSS
 * background on a generated aria-hidden element — no authored text involved.
 */

const CHEVRON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<path d="M0.649245 24C0.506245 24 0.370245 23.939 0.275245 23.832C0.0922448 23.625 0.112245 '
  + '23.308 0.318245 23.126L12.8932 12L0.318245 0.875C0.111245 0.692 0.0922449 0.375 0.274245 '
  + '0.169C0.370245 0.062 0.506245 0 0.649245 0C0.771245 0 0.889245 0.045 0.980245 0.125L13.5562 '
  + '11.251C13.5852 11.277 13.6122 11.303 13.6372 11.331C14.0062 11.747 13.9692 12.382 13.5572 '
  + '12.747L0.980245 23.875C0.888245 23.956 0.771245 24 0.649245 24Z"/></svg>';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html) node.innerHTML = html;
  return node;
}

// Wrap an AUTHORED element in a generated wrapper that carries the layout class (EW2).
function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

// Read-only classifiers — decisions only, never displayed text (EW1).
const cells = (row) => [...row.children];
const hasLink = (node) => !!node.querySelector('a[href]');
const heading = (node) => node.querySelector('h1, h2, h3, h4, h5, h6');

function classifyRow(row, seenIntro) {
  const cs = cells(row);
  const links = row.querySelectorAll('a[href]');
  const lists = row.querySelectorAll('ul, ol');
  if (!seenIntro && lists.length === 1 && !heading(row) && !cs.some((c) => c.querySelector('p')) && !row.querySelector('li a[href]:not([href^="#"])')) return 'steps';
  if (heading(row) && !lists.length && !links.length) return 'intro';
  if (cs.length >= 2 && lists.length) return 'field';
  // the pipeline may deliver the mark inside the anchor and the runtime's decorateButtons()
  // may already have turned it into .button.primary/.secondary — accept every shape
  const marked = 'strong a[href], em a[href], a[href] strong, a[href] em, a.primary, a.secondary';
  if (links.length && row.querySelector(marked)) return 'action';
  if (links.length) return 'login';
  if (heading(row) && lists.length) return 'benefits';
  return 'other';
}

/* ---- step bar ---------------------------------------------------------------------- */

function buildSteps(row) {
  const list = row.querySelector('ul, ol');
  const steps = el('div', 'wizard-steps');
  const anchor = el('div', 'wizard-anchor nav-open');
  const bar = el('nav', 'wizard-stepbar');
  bar.setAttribute('aria-label', 'Schritte');
  // step links are locked as captured (live: tabs stay inert until a vehicle is chosen)
  list.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('tabindex', '-1');
    a.addEventListener('click', (e) => e.preventDefault());
  });
  bar.append(wrapNode(list, 'wizard-steplist'));
  anchor.append(bar);
  steps.append(anchor);
  return steps;
}

/* ---- dropdown field ---------------------------------------------------------------- */

function buildField(row, index) {
  const cs = cells(row);
  const label = cs[0] ? cs[0].querySelector('p') : null;
  const options = row.querySelector('ul, ol');
  const error = cs[2] ? cs[2].querySelector('p') : null;
  const col = el('div', 'wizard-col wizard-col-half');
  const field = el('div', 'wizard-field');
  const id = `booking-wizard-field-${index}`;

  const labelWrap = el('div', 'wizard-label');
  labelWrap.id = `${id}-label`;
  if (label) labelWrap.append(label);

  const custom = el('div', 'wizard-select');
  const button = el('button', 'wizard-select-button');
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-labelledby', labelWrap.id);
  const value = el('span', 'wizard-select-value');
  button.append(value);
  const menu = el('div', 'wizard-menu');
  if (options) {
    options.setAttribute('role', 'listbox');
    menu.append(options);
  }
  const chevron = el('span', 'wizard-chevron', CHEVRON);
  custom.append(button, menu, chevron);

  field.append(labelWrap, custom);
  if (error) field.append(wrapNode(error, 'wizard-error'));
  col.append(field);

  // dependent select (one placeholder entry) stays hidden as captured — backend-fed; the
  // column itself stays in the flow (as on live) so the CTA column wraps to its own line
  if (options && options.children.length <= 1) field.hidden = true;

  const setOpen = (open) => {
    menu.classList.toggle('show', open);
    chevron.classList.toggle('show', open);
    button.setAttribute('aria-expanded', String(open));
    labelWrap.classList.toggle('active', open || !!value.textContent);
  };
  button.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!menu.classList.contains('show'));
  });
  document.addEventListener('click', (e) => {
    if (!field.isConnected) return;
    if (!field.contains(e.target)) setOpen(false);
  });
  if (options) {
    [...options.children].forEach((item, i) => {
      item.setAttribute('role', 'option');
      item.addEventListener('click', () => {
        const picked = i > 0;
        value.textContent = picked ? item.textContent : '';
        [...options.children].forEach((o) => o.setAttribute('aria-selected', String(o === item)));
        field.classList.remove('invalid');
        setOpen(false);
      });
    });
  }
  return col;
}

/* ---- scroll-state chrome (ported from the site bundle's tabs scroll handler) -------- */

function initScrollState(block) {
  const anchor = block.querySelector('.wizard-anchor');
  const nav = block.querySelector('.wizard-stepbar');
  if (!anchor || !nav) return;
  const onScroll = () => {
    if (!block.isConnected) return;
    const header = document.querySelector('header .header-bar');
    const t = nav.offsetHeight;
    const r = anchor.classList.contains('nav-open');
    let i = 0;
    if (header) {
      anchor.classList.toggle('nav-open', header.style.top === '0px');
      if (r) i += header.offsetHeight;
    }
    const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    if (anchorTop + window.scrollY > i) {
      if (window.innerWidth <= 1200) anchor.style.paddingBottom = `${t}px`;
      nav.style.position = window.innerWidth > 1200 ? 'relative' : 'fixed';
      nav.style.top = '';
      nav.style.width = '100%';
      nav.style.transition = 'top 350ms ease';
    } else {
      anchor.style.paddingBottom = '0px';
      nav.style.position = 'relative';
      nav.style.top = '0px';
      nav.style.transition = '';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/* ---- decorate ---------------------------------------------------------------------- */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const layout = el('div', 'wizard-layout');
  const pane = el('div', 'wizard-pane');
  const paneInner = el('div', 'wizard-pane-inner');
  pane.append(paneInner);
  let steps = null;
  let seenIntro = false;
  let fieldIndex = 0;

  rows.forEach((row) => {
    const kind = classifyRow(row, seenIntro);
    if (kind === 'steps') {
      steps = buildSteps(row);
    } else if (kind === 'intro') {
      seenIntro = true;
      const col = el('div', 'wizard-col wizard-intro');
      const h = heading(row);
      const lede = [...row.querySelectorAll('p')].filter((p) => !hasLink(p));
      if (h) col.append(wrapNode(h, 'wizard-title'));
      lede.forEach((p) => col.append(wrapNode(p, 'wizard-lede')));
      paneInner.append(col);
    } else if (kind === 'field') {
      fieldIndex += 1;
      paneInner.append(buildField(row, fieldIndex));
    } else if (kind === 'action') {
      const col = el('div', 'wizard-col wizard-col-half wizard-actions');
      row.querySelectorAll('p').forEach((p) => col.append(p));
      paneInner.append(col, el('div', 'wizard-col wizard-break'));
    } else if (kind === 'login') {
      const col = el('div', 'wizard-col wizard-col-half wizard-login');
      [...row.querySelectorAll('p')].forEach((p) => {
        col.append(wrapNode(p, hasLink(p) ? 'wizard-login-cta' : 'wizard-login-or'));
      });
      paneInner.append(col);
    } else if (kind === 'benefits') {
      const col = el('div', 'wizard-col wizard-benefits');
      const box = el('div', 'wizard-benefits-box');
      const h = heading(row);
      const list = row.querySelector('ul, ol');
      if (h) box.append(wrapNode(h, 'wizard-benefits-title'));
      if (list) {
        // live renders each bullet as li > p; bare-text items get the same inner shape (nodes move)
        [...list.children].forEach((li) => {
          if (!li.firstElementChild) {
            const par = document.createElement('p');
            par.append(...li.childNodes);
            li.append(par);
          }
        });
        box.append(wrapNode(list, 'wizard-benefits-list'));
      }
      col.append(box);
      paneInner.append(col);
    } else {
      // leftovers pass: unknown rows keep their authored nodes visible in the pane
      const col = el('div', 'wizard-col');
      cells(row).forEach((c) => col.append(...c.childNodes));
      paneInner.append(col);
    }
  });

  if (steps) layout.append(steps);
  layout.append(pane);

  const badge = el('div', 'wizard-recaptcha-badge');
  badge.setAttribute('aria-hidden', 'true');

  block.replaceChildren(layout, badge);
  initScrollState(block);
}
