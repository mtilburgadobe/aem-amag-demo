/**
 * video-brand-film — the full-width 16:9 brand film of the German home page (live
 * `.amag-videoComp`: an <h4> statement above a Vimeo player, video 896519713 "Startseiten
 * Imagevideo DE"). Based on the Block Collection video block, rebuilt for lazy, accessible
 * loading: the third-party player is never requested before it is needed, and never autoplays
 * with sound.
 *
 * Authoring: one row (cells read by role, never by index):
 *   - a link (or a bare URL) to the video: Vimeo, YouTube or an .mp4/.webm file
 *   - <picture>/<img> (optional): the poster
 *   - a <p> without link (optional): the accessible video title (iframe `title`); falls back
 *     to the link text when that is not a URL, then to a generic label
 * Loading: with a poster, the poster and a play button render and the player loads (and starts)
 * on click only. Without a poster, a 16:9 placeholder with a play button renders and the player
 * loads paused once the block scrolls near the viewport (or earlier on click, then it starts).
 * The section statement (<h2>–<h6>) authored as DEFAULT CONTENT directly before the block is
 * reabsorbed into the block head so it takes the film's headline styling.
 */

const LABELS = {
  de: { play: 'Video abspielen', fallback: 'Video' },
  fr: { play: 'Lire la vidéo', fallback: 'Vidéo' },
  it: { play: 'Riproduci il video', fallback: 'Video' },
  en: { play: 'Play video', fallback: 'Video' },
};

const PLAY = '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" '
  + 'focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M9 5.5v21l18-10.5z" '
  + 'fill="currentColor"/></svg>';

const el = (className, tag = 'div') => {
  const d = document.createElement(tag);
  if (className) d.className = className;
  return d;
};

const text = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');

const labels = () => {
  const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  return LABELS[lang] || LABELS.en;
};

const isUrl = (value) => /^https?:\/\/\S+$/i.test(value);

function parseSource(href) {
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);
  if (host.endsWith('vimeo.com')) {
    const idx = parts.findIndex((p) => /^\d+$/.test(p));
    if (idx === -1) return null;
    const hash = url.searchParams.get('h') || (parts[idx + 1] && /^[0-9a-f]+$/i.test(parts[idx + 1])
      ? parts[idx + 1] : '');
    return { type: 'vimeo', id: parts[idx], hash };
  }
  if (host === 'youtu.be' || host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    let id = url.searchParams.get('v');
    if (!id && host === 'youtu.be') [id] = parts;
    if (!id && ['embed', 'shorts', 'live'].includes(parts[0])) [, id] = parts;
    return id ? { type: 'youtube', id } : null;
  }
  if (/\.(mp4|webm|m4v|mov)$/i.test(url.pathname)) return { type: 'file', src: url.href };
  return null;
}

function findSource(block) {
  const links = [...block.querySelectorAll('a[href]')];
  for (let i = 0; i < links.length; i += 1) {
    const source = parseSource(links[i].getAttribute('href'));
    if (source) return { source, link: links[i] };
  }
  // DA may leave a pasted URL as plain text
  const match = block.textContent.match(/https?:\/\/\S+/);
  const source = match ? parseSource(match[0]) : null;
  return source ? { source, link: null } : null;
}

function embedUrl(source, autoplay) {
  if (source.type === 'vimeo') {
    const params = new URLSearchParams({ dnt: '1' });
    if (source.hash) params.set('h', source.hash);
    if (autoplay) params.set('autoplay', '1');
    return `https://player.vimeo.com/video/${encodeURIComponent(source.id)}?${params}`;
  }
  const params = new URLSearchParams({ rel: '0' });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(source.id)}?${params}`;
}

function buildPlayer(source, title, poster, autoplay) {
  if (source.type === 'file') {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = autoplay ? 'auto' : 'metadata';
    video.playsInline = true;
    video.setAttribute('aria-label', title);
    if (poster) video.poster = poster;
    const src = document.createElement('source');
    src.src = source.src;
    const ext = source.src.split('?')[0].split('.').pop().toLowerCase();
    src.type = `video/${ext === 'mov' ? 'quicktime' : ext.replace('m4v', 'mp4')}`;
    video.append(src);
    if (autoplay) {
      video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
    }
    return video;
  }
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl(source, autoplay);
  iframe.title = title;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  return iframe;
}

function absorbHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const nodes = [...prev.children];
  const onlyText = nodes.length && nodes.every((n) => /^(H[1-6]|P)$/.test(n.tagName)
    && !n.querySelector('picture, img'));
  if (!onlyText || !nodes.some((n) => /^H[1-6]$/.test(n.tagName))) return null;
  const head = el('head');
  head.append(...nodes);
  prev.remove();
  return head;
}

function shell(block, name) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains(`${name}-wrapper`)) return;
  if (!wrapper.previousElementSibling) block.classList.add('band');
  if (!wrapper.nextElementSibling) block.classList.add('section-end');
}

export default function decorate(block) {
  const found = findSource(block);
  if (!found) {
    block.classList.add('no-source');
    return;
  }
  const { source, link } = found;
  const l = labels();
  const linkText = link ? text(link) : '';
  const titlePar = [...block.querySelectorAll('p')]
    .find((p) => text(p) !== '' && !p.querySelector('a, picture, img') && !isUrl(text(p)));
  const title = text(titlePar) || (linkText && !isUrl(linkText) ? linkText : '') || l.fallback;
  const img = block.querySelector('picture img, img');
  const posterSrc = img ? (img.currentSrc || img.src) : '';
  const posterMedia = img ? (img.closest('picture') || img) : null;

  const head = absorbHead(block);
  const frame = el('frame');
  frame.dataset.embedLoaded = 'false';

  const placeholder = el(posterMedia ? 'placeholder has-poster' : 'placeholder');
  if (posterMedia) {
    if (img) img.alt = '';
    placeholder.append(posterMedia);
  }
  const play = el('play', 'button');
  play.type = 'button';
  play.setAttribute('aria-label', `${l.play}: ${title}`);
  play.innerHTML = PLAY;
  placeholder.append(play);
  frame.append(placeholder);

  let observer = null;
  const load = (autoplay) => {
    if (frame.dataset.embedLoaded !== 'false') return;
    frame.dataset.embedLoaded = 'loading';
    if (observer) observer.disconnect();
    const player = buildPlayer(source, title, posterSrc, autoplay);
    const done = () => {
      frame.dataset.embedLoaded = 'true';
      placeholder.remove();
    };
    if (player.tagName === 'IFRAME') player.addEventListener('load', done, { once: true });
    frame.append(player);
    if (player.tagName === 'VIDEO') done();
    if (autoplay) player.focus();
  };
  play.addEventListener('click', () => load(true));

  if (!posterMedia && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) load(false);
    }, { rootMargin: '200px 0px' });
    observer.observe(frame);
  } else if (!posterMedia) {
    load(false);
  }

  const wrap = el('wrap');
  if (head) wrap.append(head);
  wrap.append(frame);
  block.replaceChildren(wrap);
  shell(block, 'video-brand-film');
}
