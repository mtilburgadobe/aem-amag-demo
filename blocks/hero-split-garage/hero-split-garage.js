/**
 * hero-split-garage — the garage detail page's split intro (live `.amag-introGarageWithSlider`,
 * /de/garagenuebersicht/garage-buelach.html section 1). A garage variant of `hero-split`: text
 * column (adopted breadcrumb, h1, lead, VERKAUF/SERVICE brand-logo lists, icon text links) and
 * an image slider that bleeds into the right gutter ≥ 1200 (4:3 slides, the next one peeking,
 * a translucent control strip holding the appointment CTA, the "1 / 6" counter and arrows).
 * Below 1200 the slider leads, full-bleed (270 / 384 px slides); below 768 the CTA sits under it.
 *
 * Authoring rows (read by role, never by index — one cell or several; Document Authoring may
 * unwrap a single-paragraph cell into bare inline content, which is re-wrapped in a <p>):
 *   - a cell holding only pictures: the slider images, in order (first = LCP, eager)
 *   - a cell with an <h1> (or h2/h3): the headline; its plain <p> are the lead text
 *   - a cell with a text-only <p> followed by image-only <p>: one brand list — the text is
 *     the list title ("VERKAUF", "SERVICE"), each image one brand logo
 *   - a <p> with a link wrapped in <strong> (or already turned into `a.button` by the page): the
 *     appointment CTA (the icon authored in the same
 *     paragraph is moved into the link)
 *   - any other <p> with an icon and/or a link: one icon text link ("Team kontaktieren"); with
 *     no link it renders as an inert icon label ("Als meine Garage speichern" — the live
 *     cookie favourite is host-bound)
 *   - any other plain <p>: further lead text
 * Split links (`<a><img></a><a>label</a>` with the same href, or `<a><img></a><strong>label`)
 * are merged into one link. A `breadcrumb` block immediately before this one in the same
 * section is adopted into the text column (decorated whole), as in `hero-split`.
 * EW7: the arrows are text-less <button>s (aria-label); the counter numerals are derived from
 * state (@ew-exempt derived), never authored.
 * Section shell (as `hero-split`): full-bleed wrapper (`hero-split-garage-bleed-wrapper`),
 * `band` on the section's first wrapper (hidden below 1200 on the page's first section),
 * `section-end` on its last. Unit hooks: `amag-introGarageWithSlider` on the root,
 * `cmp-carousel__item` per slide.
 */

const ARROW_PATH = {
  prev: 'M21.2646 0C21.5099 0 21.7432 0.108 21.9032 0.288C22.2112 0.644 22.1779 1.168 21.8366 '
    + '1.468L2.80788 18.667H39.1832C39.6352 18.667 39.9999 19.0317 39.9999 19.4837C39.9999 '
    + '19.9357 39.6352 20.3003 39.1832 20.3003H2.80788L21.8366 37.4997C22.0046 37.6477 22.1046 '
    + '37.8517 22.1192 38.0757C22.1326 38.2997 22.0592 38.5157 21.9112 38.6837C21.7552 38.8637 '
    + '21.5272 38.9677 21.2899 38.9677C21.0872 38.9677 20.8926 38.8943 20.7419 38.7597L1.42655 '
    + '21.5283C0.966548 21.1057 0.823215 20.4017 0.823215 19.4837C0.823215 18.5657 0.966548 '
    + '17.8617 1.42655 17.4383L20.7419 0.207C20.8926 0.0723 21.0859 0 21.2646 0Z',
  next: 'M18.7354 40C18.4901 40 18.2568 39.892 18.0968 39.712C17.7888 39.356 17.8221 38.832 '
    + '18.1634 38.532L37.1921 21.333H0.816798C0.364798 21.333 0.000131687 20.9683 0.000131687 '
    + '20.5163C0.000131687 20.0643 0.364798 19.6997 0.816798 19.6997H37.1921L18.1634 2.50034'
    + 'C17.9954 2.35234 17.8954 2.14834 17.8808 1.92434C17.8674 1.70034 17.9408 1.48434 18.0888 '
    + '1.31634C18.2448 1.13634 18.4728 1.03234 18.7101 1.03234C18.9128 1.03234 19.1074 1.10567 '
    + '19.2581 1.24034L38.5734 18.4717C39.0334 18.8943 39.1768 19.5983 39.1768 20.5163C39.1768 '
    + '21.4343 39.0334 22.1383 38.5734 22.5617L19.2581 39.793C19.1074 39.9277 18.9141 40 18.7354 '
    + '40Z',
};

const arrow = (dir) => '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" '
  + `aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="${ARROW_PATH[dir]}" `
  + 'fill="currentColor"/></svg>';

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.trim() : '');
const hasMedia = (n) => !!n.querySelector('picture, img');
const isMediaOnly = (n) => hasMedia(n) && !text(n) && !n.querySelector('a[href]');
const isTextOnly = (n) => !!text(n) && !hasMedia(n) && !n.querySelector('a[href]');

/* Document Authoring may hand a cell over as bare inline content: re-wrap it in a <p>. */
function paragraphs(cell) {
  const blockish = 'p, h1, h2, h3, h4, h5, h6, ul, ol, div, picture, blockquote';
  const out = [];
  let loose = null;
  [...cell.childNodes].forEach((n) => {
    const isBlock = n.nodeType === Node.ELEMENT_NODE && n.matches(blockish);
    if (isBlock) {
      loose = null;
      if (n.tagName === 'PICTURE') {
        const p = document.createElement('p');
        n.replaceWith(p);
        p.append(n);
        out.push(p);
      } else out.push(n);
      return;
    }
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) {
      if (loose) loose.append(n);
      return;
    }
    if (!loose) {
      loose = document.createElement('p');
      n.before(loose);
      out.push(loose);
    }
    loose.append(n);
  });
  return out;
}

/* `<a><img></a><a>label</a>` (same href) and `<a><img></a><strong>label</strong>` → one link */
function mergeSplitLinks(p) {
  const links = [...p.querySelectorAll('a[href]')];
  for (let i = links.length - 1; i > 0; i -= 1) {
    const a = links[i];
    const before = links[i - 1];
    if (a.getAttribute('href') === before.getAttribute('href')) {
      const range = document.createRange();
      range.setStartAfter(before);
      range.setEndBefore(a);
      const gap = range.toString().trim();
      if (!gap) {
        // keep the wrapping <strong>/<em> of the later fragment by moving its content only
        before.append(...a.childNodes);
        const parent = a.parentElement;
        a.remove();
        if (parent && parent !== p && !text(parent) && !hasMedia(parent)) parent.remove();
      }
    }
  }
  const remaining = p.querySelectorAll('a[href]');
  if (remaining.length !== 1) return;
  const [a] = remaining;
  // an icon-only link with its label beside it takes the label in
  if (!text(a) && text(p)) {
    [...p.childNodes].filter((n) => n !== a && !n.contains(a)).forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.matches('strong, em')) {
        a.append(...n.childNodes);
        n.remove();
      } else a.append(n);
    });
  }
  // an icon authored beside the link moves into it
  const icon = [...p.querySelectorAll('picture, img')]
    .find((m) => !a.contains(m) && !(m.tagName === 'IMG' && m.closest('picture')));
  if (icon) a.prepend(icon);
}

const isCta = (p) => {
  const a = p.querySelector('a[href]');
  // the page's button decoration replaces an icon-less `<strong><a>` with `<a class="button">`
  return !!a && (!!a.closest('strong, b') || a.classList.contains('button'))
    && text(p) === text(a);
};

function iconLink(p) {
  const a = p.querySelector('a[href]');
  const item = el('link-item');
  if (a) {
    a.className = 'link-label';
    item.append(a);
  } else {
    const label = el('link-label', 'span');
    label.append(...p.childNodes);
    item.append(label);
  }
  const host = item.firstElementChild;
  const icon = host.querySelector('picture, img');
  if (icon) {
    const holder = el('link-icon', 'span');
    holder.setAttribute('aria-hidden', 'true');
    icon.replaceWith(holder);
    holder.append(icon);
    host.prepend(holder);
  }
  return item;
}

function brandGroup(ps) {
  const group = el('brand-group');
  const title = el('brand-title', 'p');
  const list = el('brand-list', 'ul');
  ps.forEach((p) => {
    if (isTextOnly(p)) {
      if (title.textContent) title.append(' ');
      title.append(...p.childNodes);
    } else {
      p.querySelectorAll('picture, img').forEach((m) => {
        if (m.tagName === 'IMG' && m.closest('picture')) return;
        const li = el('brand-item', 'li');
        li.append(m);
        list.append(li);
      });
    }
  });
  if (title.textContent.trim()) group.append(title);
  if (list.children.length) group.append(list);
  return group;
}

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

function buildSlider(media, slides, cta) {
  const viewport = el('slider');
  const track = el('track');
  slides.forEach((pic, i) => {
    const slide = el('slide cmp-carousel__item');
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      if (i === 0) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else img.loading = 'lazy';
    }
    slide.append(pic);
    if (i > 0) slide.setAttribute('aria-hidden', 'true');
    track.append(slide);
  });
  viewport.append(track);
  media.append(viewport);

  const controls = el('controls');
  if (cta) controls.append(cta);
  if (slides.length > 1) {
    const nav = el('slider-nav');
    const counter = el('counter');
    const current = el('current', 'span');
    const total = el('total', 'span');
    total.textContent = ` / ${slides.length}`;
    counter.append(current, total);
    const arrows = el('arrows');
    const prev = el('action action-previous', 'button');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous');
    prev.innerHTML = arrow('prev');
    const next = el('action action-next', 'button');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next');
    next.innerHTML = arrow('next');
    arrows.append(prev, next);
    nav.append(counter, arrows);
    controls.append(nav);

    const items = [...track.children];
    let index = 0;
    const place = () => {
      const target = items[index];
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const x = Math.min(target.offsetLeft, max);
      track.style.transform = x ? `translateX(${-x}px)` : '';
    };
    const show = (i) => {
      index = Math.max(0, Math.min(items.length - 1, i));
      items.forEach((s, k) => {
        s.classList.toggle('cmp-carousel__item--active', k === index);
        if (k === index) s.removeAttribute('aria-hidden');
        else s.setAttribute('aria-hidden', 'true');
      });
      current.textContent = String(index + 1);
      prev.disabled = index === 0;
      next.disabled = index === items.length - 1;
      place();
    };
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    let startX = null;
    viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });
    window.addEventListener('resize', place);
    show(0);
  } else {
    track.firstElementChild?.classList.add('cmp-carousel__item--active');
  }
  if (controls.children.length) media.append(controls);
}

export default function decorate(block) {
  block.classList.add('amag-introGarageWithSlider');
  const wrapper = block.parentElement;
  const prevWrapper = wrapper ? wrapper.previousElementSibling : null;
  const crumbs = prevWrapper && prevWrapper.classList.contains('breadcrumb-wrapper')
    ? prevWrapper : null;

  let heading = null;
  const lead = [];
  const brands = [];
  const links = [];
  const slides = [];
  let cta = null;

  const cells = [...block.children].flatMap((row) => {
    const cols = [...row.children];
    return cols.length ? cols : [row];
  });

  cells.forEach((cell) => {
    const ps = paragraphs(cell);
    ps.forEach((p) => { if (p.tagName === 'P') mergeSplitLinks(p); });
    const contentPs = ps.filter((p) => text(p) || hasMedia(p));
    if (!contentPs.length) return;

    // slider images: a cell holding only pictures
    if (contentPs.every((p) => p.tagName === 'P' && isMediaOnly(p))) {
      contentPs.forEach((p) => p.querySelectorAll('picture, img').forEach((m) => {
        if (m.tagName === 'IMG' && m.closest('picture')) return;
        slides.push(m);
      }));
      return;
    }

    // brand list: a text-only title + image-only logos, no links, no heading
    const ptags = contentPs.filter((p) => p.tagName === 'P');
    if (ptags.length === contentPs.length
      && ptags.some(isTextOnly) && ptags.some(isMediaOnly)
      && ptags.every((p) => isTextOnly(p) || isMediaOnly(p))) {
      brands.push(brandGroup(ptags));
      return;
    }

    contentPs.forEach((n) => {
      if (n.matches('h1, h2, h3, h4, h5, h6')) {
        if (!heading && n.matches('h1, h2, h3')) heading = n;
        else lead.push(n);
      } else if (n.tagName !== 'P') {
        lead.push(n);
      } else if (isCta(n)) {
        if (!cta) {
          cta = el('cta');
          cta.append(n);
        } else links.push(iconLink(n));
      } else if (n.querySelector('a[href]') || hasMedia(n)) {
        if (isMediaOnly(n) && !n.querySelector('a[href]')) {
          n.querySelectorAll('picture, img').forEach((m) => {
            if (m.tagName === 'IMG' && m.closest('picture')) return;
            slides.push(m);
          });
        } else links.push(iconLink(n));
      } else {
        lead.push(n);
      }
    });
  });

  const wrap = el('wrap');
  const grid = el('grid');
  const col = el('text');
  const body = el('body');
  if (crumbs) body.append(crumbs);
  if (heading) {
    const h = el('headline');
    h.append(heading);
    body.append(h);
  }
  if (lead.length) {
    const l = el('lead');
    l.append(...lead);
    body.append(l);
  }
  if (brands.length) {
    const b = el('brands');
    b.append(...brands);
    body.append(b);
  }
  if (links.length) {
    const l = el('links');
    l.append(...links);
    body.append(l);
  }
  col.append(body);
  grid.append(col);

  if (slides.length) {
    const media = el('media');
    buildSlider(media, slides, cta);
    grid.append(media);
    if (cta) block.classList.add('has-cta');
  } else if (cta) {
    body.append(cta);
  }

  wrap.append(grid);
  block.replaceChildren(wrap);
  shell(block, 'hero-split-garage');
}
