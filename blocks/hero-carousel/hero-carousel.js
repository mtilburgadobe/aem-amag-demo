/**
 * hero-carousel — the home stage carousel (prototype `.amagCh-stageCarousel`; schema
 * `stardust/eds-schema/en-html.json` section 0, repeat `.cmp-carousel__item` ×6).
 * Template-slotted slides: ONE ROW PER SLIDE, cells read by role, never by index:
 *   - first <picture>/<img>: the 16:9 stage image (≥ 768); second <picture>/<img>: the 3:4
 *     mobile rendition (< 768). A slide without images is a video stage: the live players are
 *     consent-gated embeds whose ids were not captured, so only the player frame renders.
 *   - <h1> (slide 1) / <h2>: the slide headline (stays the authored tag — one <h1> per page)
 *   - link-bearing <p>: the slide link text; the whole slide becomes that link (EW6: the inner
 *     anchor is unwrapped after its href is read)
 *   - a lone <p> without link in its own cell: the indicator label (hidden text, as on the live
 *     `li.cmp-carousel__indicator`), moved beside a text-less dot <button> it labels (EW7)
 * Behaviour (replica captureState promise): autoplay, slide 1 first, advances every 5 s with
 * 1 s opacity transitions; previous/next arrows ≥ 1200; pause/play controls present but hidden
 * (as on live); indicator dots jump to a slide. prefers-reduced-motion disables autoplay.
 * Unit hooks: `amagCh-stageCarousel` on the block root, `cmp-carousel__item` on each slide.
 * Marks its section `data-header-stage` so the frozen header runs its home-only transparent morph.
 */

const ICONS = {
  prev: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M16.9906 0.666705C17.1826 0.666705 17.3652 '
    + '0.749373 17.4906 0.893373C17.7332 1.17337 17.7066 1.60004 17.4319 1.84537L2.2066 15.467'
    + 'H30.3466C30.7079 15.467 31 15.7591 31 16.1204C31 16.4818 30.7079 16.7738 30.3466 16.7738'
    + 'H2.2066L17.4319 30.3951C17.5666 30.5151 17.6466 30.6778 17.6586 30.8578C17.6692 31.0378 '
    + '17.6106 31.2111 17.4919 31.3458C17.3666 31.4911 17.1839 31.5738 16.9932 31.5738C16.8306 '
    + '31.5738 16.6746 31.5151 16.5546 31.4071L1.14125 17.6218C0.772583 17.2831 0.658583 16.7151 '
    + '0.658583 16.1204C0.658583 15.5258 0.772583 14.9578 1.14125 14.6191L16.5546 0.833838C16.6746 '
    + '0.725838 16.8292 0.666705 16.9906 0.666705Z" fill="#fff"/></svg>',
  next: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" '
    + 'xmlns="http://www.w3.org/2000/svg"><path d="M15.0094 31.3333C14.8174 31.3333 14.6348 '
    + '31.2506 14.5094 31.1066C14.2668 30.8266 14.2934 30.4 14.5681 30.1546L29.7934 16.533H1.6534'
    + 'C1.29207 16.533 1 16.2409 1 15.8796C1 15.5182 1.29207 15.2262 1.6534 15.2262H29.7934'
    + 'L14.5681 1.60491C14.4334 1.48491 14.3534 1.32224 14.3414 1.14224C14.3308 0.962243 14.3894 '
    + '0.788909 14.5081 0.654243C14.6334 0.508909 14.8161 0.426243 15.0068 0.426243C15.1694 '
    + '0.426243 15.3254 0.484909 15.4454 0.592909L30.8588 14.3782C31.2274 14.7169 31.3414 15.2849 '
    + '31.3414 15.8796C31.3414 16.4742 31.2274 17.0422 30.8588 17.3809L15.4454 31.1662C15.3254 '
    + '31.2742 15.1708 31.3333 15.0094 31.3333Z" fill="#fff"/></svg>',
};

const INTERVAL = 5000;

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

function iconButton(className, label, svg) {
  const b = el(`action ${className}`, 'button');
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.innerHTML = svg;
  return b;
}

function buildSlide(row, index) {
  const slide = el('slide cmp-carousel__item');
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  const pictures = [...row.querySelectorAll('picture, img')]
    .filter((m) => !m.closest('picture img'));
  const heading = row.querySelector('h1, h2, h3');
  const link = row.querySelector('a[href]');
  const linkPar = link ? link.closest('p') : null;
  const cells = [...row.children];
  const labelCell = cells.find((c) => !c.querySelector('h1, h2, h3, a, picture, img')
    && c.querySelector('p') && text(c));
  const label = labelCell ? labelCell.querySelector('p') : null;

  const host = link ? el('slide-link text-decoration-none', 'a') : el('slide-link');
  if (link) host.href = link.getAttribute('href');
  const media = el('slide-media');
  if (pictures.length) {
    media.append(wrapNode(pictures[0], 'media-desktop'));
    if (pictures[1]) media.append(wrapNode(pictures[1], 'media-mobile'));
    else media.classList.add('media-single');
    media.querySelectorAll('img').forEach((img) => {
      img.loading = index === 0 ? 'eager' : 'lazy';
      if (index === 0) img.setAttribute('fetchpriority', 'high');
    });
  } else {
    slide.classList.add('slide-video');
    media.append(el('video-frame'));
  }
  host.append(media, el('backdrop'));
  const overlay = el('overlay');
  const inner = el('overlay-inner');
  const textBox = el('slide-text');
  if (heading) textBox.append(wrapNode(heading, 'headline'));
  if (linkPar) {
    link.replaceWith(...link.childNodes);
    textBox.append(' ', wrapNode(linkPar, 'linktext'));
  }
  inner.append(textBox);
  overlay.append(inner);
  host.append(overlay);
  slide.append(host);
  return { slide, label };
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const stage = el('stage amagCh-stageCarousel');
  const carousel = el('carousel cmp-carousel');
  carousel.setAttribute('aria-roledescription', 'carousel');
  const content = el('slides cmp-carousel__content');
  const indicators = el('indicators', 'ol');
  const slides = [];
  const dots = [];
  rows.forEach((row, i) => {
    const { slide, label } = buildSlide(row, i);
    content.append(slide);
    slides.push(slide);
    const li = el('indicator cmp-carousel__indicator', 'li');
    const dot = el('dot', 'button');
    dot.type = 'button';
    if (label) {
      const id = `hero-carousel-label-${Date.now().toString(36)}-${i}`;
      label.id = id;
      dot.setAttribute('aria-labelledby', id);
      li.append(dot, wrapNode(label, 'indicator-label'));
    } else {
      dot.setAttribute('aria-label', `${i + 1}`);
      li.append(dot);
    }
    indicators.append(li);
    dots.push(li);
  });
  const actions = el('actions cmp-carousel__actions');
  const prev = iconButton('action-previous', 'Previous', ICONS.prev);
  const next = iconButton('action-next', 'Next', ICONS.next);
  const pause = iconButton('action-pause', 'Pause', '');
  const play = iconButton('action-play', 'Play', '');
  actions.append(prev, next, pause, play);
  carousel.append(content, actions, wrapNode(indicators, 'indicator-container'));
  stage.append(carousel);
  block.replaceChildren(stage);
  shell(block, 'hero-carousel');
  // the foundation header morphs to transparent while `main [data-header-stage]` is in view
  // (header.js); on live the stage wrapper includes the quick-link tiles, i.e. this section.
  (block.closest('.section') || block).setAttribute('data-header-stage', '');

  let current = 0;
  let timer = null;
  let leaveTimer = null;
  const show = (n) => {
    const previous = current;
    current = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle('active', k === current);
      s.classList.toggle('cmp-carousel__item--active', k === current);
      s.classList.toggle('leaving', k === previous && previous !== current);
      s.setAttribute('aria-hidden', String(k !== current));
    });
    // the live item is display: none once inactive; keep the leaving slide in flow for the
    // 1 s cross-fade, then drop it like the origin does
    if (leaveTimer) window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      slides.forEach((s) => s.classList.remove('leaving'));
    }, 1000);
    dots.forEach((d, k) => {
      d.classList.toggle('active', k === current);
      d.querySelector('button').setAttribute('aria-current', k === current ? 'true' : 'false');
    });
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    block.classList.remove('playing');
  };
  const start = () => {
    stop();
    if (reduced || slides.length < 2) return;
    timer = window.setInterval(() => show(current + 1), INTERVAL);
    block.classList.add('playing');
  };
  prev.addEventListener('click', () => {
    show(current - 1);
    start();
  });
  next.addEventListener('click', () => {
    show(current + 1);
    start();
  });
  pause.addEventListener('click', stop);
  play.addEventListener('click', start);
  dots.forEach((d, k) => d.querySelector('button').addEventListener('click', () => {
    show(k);
    start();
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  show(0);
  start();
}
