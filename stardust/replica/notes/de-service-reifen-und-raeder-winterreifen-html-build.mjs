// Assembles stardust/prototypes/de-service-reifen-und-raeder-winterreifen-html-proposed.html.
// Backend markup of #header, div.amag-content (the winter-tyres service article as captured) and the site footer is serialized from the
// captured HTML with the booking build whitelist; every src/srcset/url() is rewritten to the harvested local copy. Hidden widgets
// (garage overlays, otvCta cookie variant) stay hidden as captured. Chrome = the German chrome of the booking archetype (same
// structure; only the language-switch hrefs differ, taken from THIS page).
import { chromium } from 'playwright';
import fs from 'node:fs';
const SLUG = 'de-service-reifen-und-raeder-winterreifen-html'; const N = 'stardust/replica/notes/';
const HTML = `stardust/current/pages/${SLUG}.html`; const OUT = `stardust/prototypes/${SLUG}-proposed.html`;
const meta = JSON.parse(fs.readFileSync(`stardust/current/pages/${SLUG}.json`, 'utf8'));
const map = {}; for (const f of ['en-html', 'en-services-html', 'en-komponenten-car-dealers-html', 'de-service-auto-services-online-termin-buchen-html', SLUG]) { const p = N + f + '-media-map.json'; if (fs.existsSync(p)) Object.assign(map, JSON.parse(fs.readFileSync(p, 'utf8'))); }
const MEDIA = 'stardust/current/assets/media';
const missing = new Set();
function local(src) {
  if (!src || src.startsWith('data:')) return src;
  const abs = src.startsWith('http') ? src : src.startsWith('//') ? 'https:' + src : 'https://www.amag.ch' + src;
  if (map[abs]) return map[abs];
  const jcr = abs.replace(/\/_jcr_content\//g, "/jcr:content/"); if (map[jcr]) return map[jcr];
  const alt = Object.keys(map).find(k => k.replace(/^https:\/\/www\.amag\.ch/, '') === abs.replace(/^https:\/\/www\.amag\.ch/, ''));
  if (alt) return map[alt];
  try { const u = new URL(abs); if (u.hostname === 'www.amag.ch') { const rel = 'amag' + decodeURIComponent(u.pathname); if (fs.existsSync(`${MEDIA}/${rel}`)) return `assets/media/${rel}`; } } catch {}
  if (/amag\.ch|amag-group\.ch/.test(abs)) missing.add(abs);
  return null;
}
const b = await chromium.launch(); const p = await b.newPage({ javaScriptEnabled: false });
await p.setContent(fs.readFileSync(HTML, 'utf8'), { waitUntil: 'domcontentloaded' });
const tree = await p.evaluate(() => {
  const SKIP = new Set(['SCRIPT', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'IFRAME', 'STYLE']);
  const KEEP_ATTR = new Set(['id', 'class', 'href', 'alt', 'src', 'srcset', 'sizes', 'media', 'type', 'for', 'name', 'value', 'selected', 'checked', 'placeholder', 'role', 'title', 'target', 'rel', 'rows', 'cols', 'disabled', 'multiple', 'colspan', 'rowspan', 'lang', 'dir', 'style', 'hidden', 'tabindex', 'autocomplete', 'maxlength', 'readonly']);
  const ser = (el, main) => {
    if (el.nodeType === 3) return { t: el.nodeValue };
    if (el.nodeType !== 1) return null;
    if (SKIP.has(el.tagName)) return null;
    if (el.namespaceURI === 'http://www.w3.org/2000/svg') return { svg: el.outerHTML };
    const a = {};
    for (const at of el.attributes) {
      const n = at.name;
      if (KEEP_ATTR.has(n) || n.startsWith('aria-') || (main && n.startsWith('data-')) || n === 'data-quotecharopen' || n === 'data-quotecharclose') a[n] = at.value;
    }
    if (a.class) { a.class = a.class.split(/\s+/).filter(c => c && !/^(aem-|cq-|select2-hidden)/.test(c) && !/^#/.test(c)).join(' '); if (!a.class) delete a.class; }
    if (a.style && !/background-color|display:\s*none|flex-wrap|--section-bgcolor/.test(a.style)) delete a.style;
    if (a.id && /^\d+$/.test(a.id)) delete a.id;
    return { tag: el.tagName.toLowerCase(), a, k: [...el.childNodes].map(c => ser(c, main)).filter(Boolean) };
  };
  return [ser(document.querySelector('#header'), false), ser(document.querySelector('div.amag-content'), true), ser([...document.querySelectorAll('footer')].filter(f => !f.closest('div.amag-content')).pop(), false)];
});
await b.close();
const VOID = new Set(['img', 'source', 'input', 'br', 'hr', 'meta', 'link']);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escA = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
function rewriteSrcset(v) { const out = []; for (const cand of v.split(/\s*,\s*(?=https?:\/\/|\/)/)) { const [u, d] = cand.trim().split(/\s+/); if (!u) continue; const l = local(u); if (l) out.push(d ? `${l} ${d}` : l); } return out.join(', '); }
function render(n) {
  if (n.t != null) { const t = n.t.replace(/[ \t\r\n\f]+/g, ' '); return t.replace(/[ \t\r\n\f]/g, '') ? esc(t).replace(/\u00a0/g, '&nbsp;') : (t ? ' ' : ''); }  // U+00A0 is content (empty <p>&nbsp;</p> = one 30px line), never collapsed
  if (n.svg) return n.svg.replace(/\s(xlink:href|href)="(https?:\/\/(www\.)?amag[^"]*)"/g, (m, k, u) => ` ${k}="${local(u) || ''}"`);
  const a = { ...n.a };
  if (a.src) { const l = local(a.src); if (l) a.src = l; else if (/^https?:|^\//.test(a.src)) { a['data-missing'] = a.src; a.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; } }
  if (a.srcset) { const s = rewriteSrcset(a.srcset); if (s) a.srcset = s; else delete a.srcset; }
  if (n.tag === 'source' && !a.srcset) return '';
  if (a.style) a.style = a.style.replace(/url\(("|')?(https?:[^)"']+)("|')?\)/g, (m, q1, u) => `url(${local(u) || ''})`);
  const attrs = Object.entries(a).map(([k, v]) => v === '' ? ` ${k}` : ` ${k}="${escA(v)}"`).join('');
  if (VOID.has(n.tag)) return `<${n.tag}${attrs}>`;
  return `<${n.tag}${attrs}>${n.k.map(render).join('')}</${n.tag}>`;
}
const [header, main, footer] = tree;
const H = render(header), M = render(main), F = render(footer);
fs.writeFileSync(N + `${SLUG}-chrome-header.html`, H + '\n'); fs.writeFileSync(N + `${SLUG}-chrome-footer.html`, F + '\n'); fs.writeFileSync(N + `${SLUG}-content.html`, M + '\n');
const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${escA(meta.description)}">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/${SLUG}.css">
</head>
<body>
${H}
${M}
${F}
<script src="js/canon.js"></script>
<script src="js/${SLUG}.js"></script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
const remote = (html.match(/(src|srcset)="[^"]*(amag\.ch|amag-group\.ch)[^"]*"/g) || []).concat(html.match(/url\([^)]*(amag\.ch|amag-group\.ch)[^)]*\)/g) || []);
console.log('wrote', OUT, (html.length / 1024).toFixed(0) + 'KB', '| header', (H.length / 1024).toFixed(0) + 'KB', 'main', (M.length / 1024).toFixed(0) + 'KB', 'footer', (F.length / 1024).toFixed(0) + 'KB', '| missing assets:', missing.size, [...missing].slice(0, 8), '| remote refs:', remote.length, remote.slice(0, 5));
