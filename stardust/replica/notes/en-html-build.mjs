// Builds stardust/prototypes/en-html-proposed.html from the captured DOM (offline): content/structure verbatim,
// AEM/author noise dropped, every src/srcset/url rewritten to the harvested local asset.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
const HTML = 'stardust/current/pages/en-html.html', OUT = 'stardust/prototypes/en-html-proposed.html';
const MEDIA = 'stardust/current/assets/media';
const map = JSON.parse(fs.readFileSync('stardust/replica/notes/en-html-media-map.json', 'utf8'));
const page_json = JSON.parse(fs.readFileSync('stardust/current/pages/en-html.json', 'utf8'));
const extOf = (u) => (u.match(/\.(svg|png|jpe?g|webp|gif)(\?|$)/i)||[])[1]?.toLowerCase().replace('jpeg','jpg') || (u.includes('dam.amag-group.ch') ? 'jpg' : 'bin');
function stableName(u) {
  const url = new URL(u); const ext = extOf(u);
  if (url.hostname.startsWith('dam.amag-group.ch')) { const m = url.pathname.match(/\/is\/image\/amagproduction\/([^:]+)(?::([^/]+))?/); const wid = url.searchParams.get('wid')||'o', hei = url.searchParams.get('hei')||'o'; return `s7-${(m?.[1]||'img').replace(/[^\w.-]+/g,'_')}-${(m?.[2]||'orig').replace(/[^\w.-]+/g,'_')}-w${wid}h${hei}.${ext}`; }
  const p = decodeURIComponent(url.pathname); const segs = p.split('/').filter(Boolean);
  const dam = p.match(/\/content\/dam\/(.+?)(?:\/_?jcr[:_]content\/renditions\/original\.transform\/([^/]+)\/img\.\w+)?$/);
  if (dam) { const base = dam[1].split('/').slice(-2).join('_').replace(/\.\w+$/,''); return `dam-${base}${dam[2]?'-'+dam[2]:''}.${ext}`.replace(/[^\w.-]+/g,'_'); }
  return `lib-${segs.slice(-3).join('_').replace(/\.\w+$/,'')}.${ext}`.replace(/[^\w.-]+/g,'_');
}
const missing = new Set();
function local(u) {
  if (!u || u.startsWith('data:')) return u;
  const abs = new URL(u, 'https://www.amag.ch/').href;
  if (map[abs]) return map[abs];
  const alt = Object.keys(map).find(k => k.replace(/^https:\/\/www\.amag\.ch/,'') === abs.replace(/^https:\/\/www\.amag\.ch/,''));
  if (alt) return map[alt];
  try { const n = stableName(abs); if (fs.existsSync(path.join(MEDIA, n))) return `assets/media/${n}`; } catch {}
  // try any file whose name matches the stable name sans extension (content-type ext may differ)
  try { const n = stableName(abs).replace(/\.\w+$/, ''); const f = fs.readdirSync(MEDIA).find(x => x.startsWith(n + '.')); if (f) return `assets/media/${f}`; } catch {}
  missing.add(abs); return null;
}
const b = await chromium.launch(); const p = await b.newPage({ javaScriptEnabled: false });
await p.setContent(fs.readFileSync(HTML, 'utf8'), { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  const wrap = document.querySelector('.amag-pop-up__wrapper-before'); const pop = document.querySelector('.amag-pop-up.amag-pop-up__wrapper--mobile');
  /* mobile pop-up stays d-none; the desktop pop-up (.amag-pop-up__wrapper--desktop) is the one live renders off-screen */
});
const tree = await p.evaluate(() => {
  const SKIP = new Set(['SCRIPT','NOSCRIPT','TEMPLATE','LINK','META','IFRAME']);
  const KEEP_ATTR = new Set(['id','class','href','alt','src','srcset','sizes','media','type','for','name','value','selected','checked','placeholder','role','title','target','rel','rows','cols','disabled','multiple','colspan','rowspan','lang','dir','style']);
  const ser = (el) => {
    if (el.nodeType === 3) return { t: el.nodeValue };
    if (el.nodeType !== 1) return null;
    if (SKIP.has(el.tagName)) return null;
    if (el.namespaceURI === 'http://www.w3.org/2000/svg') return { svg: el.outerHTML };
    const a = {};
    for (const at of el.attributes) {
      const n = at.name;
      if (KEEP_ATTR.has(n) || n.startsWith('aria-') || n === 'data-quotecharopen' || n === 'data-quotecharclose' || n === 'data-quoteCharOpen' || n === 'data-quoteCharClose') a[n] = at.value;
    }
    if (a.class) { a.class = a.class.split(/\s+/).filter(c => c && !/^(aem-|cq-|js-|select2-hidden)/.test(c) && !/^#/.test(c)).join(' '); if (!a.class) delete a.class; }
    if (a.style && !/background-color|display:\s*none/.test(a.style)) delete a.style;
    if (a.id && /^(carousel|accordion|stageCarousel)-[0-9a-f]{10}/.test(a.id) === false && /^\d+$/.test(a.id)) delete a.id;
    return { tag: el.tagName.toLowerCase(), a, k: [...el.childNodes].map(ser).filter(Boolean) };
  };
  return ['#header', 'div.amag-content', 'footer'].map(s => ser(document.querySelector(s)));
});
await b.close();
const VOID = new Set(['img','source','input','br','hr','meta','link']);
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escA = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function rewriteSrcset(v) { const out = []; for (const cand of v.split(/\s*,\s*(?=https?:\/\/|\/)/)) { const [u, d] = cand.trim().split(/\s+/); if (!u) continue; const l = local(u); if (l) out.push(d ? `${l} ${d}` : l); } return out.join(', '); }
function render(n, depth = 0) {
  if (n.t != null) { const t = n.t.replace(/\s+/g, ' '); return t.trim() ? esc(t) : (t ? ' ' : ''); }
  if (n.svg) return n.svg.replace(/\s(xlink:href|href)="(https?:\/\/(www\.)?amag[^"]*)"/g, (m, k, u) => ` ${k}="${local(u)||''}"`);
  const a = { ...n.a };
  if (a.src) { const l = local(a.src); if (l) a.src = l; else { a['data-missing'] = a.src; a.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; } }
  if (a.srcset) { const s = rewriteSrcset(a.srcset); if (s) a.srcset = s; else delete a.srcset; }
  if (n.tag === 'source' && !a.srcset) return '';
  if (a.style) a.style = a.style.replace(/url\(("|')?(https?:[^)"']+)("|')?\)/g, (m, q1, u) => `url(${local(u)||''})`);
  const attrs = Object.entries(a).map(([k, v]) => v === '' ? ` ${k}` : ` ${k}="${escA(v)}"`).join('');
  if (VOID.has(n.tag)) return `<${n.tag}${attrs}>`;
  const inner = n.k.map(c => render(c, depth + 1)).join('');
  return `<${n.tag}${attrs}>${inner}</${n.tag}>`;
}
const [header, main, footer] = tree;
const title = page_json.title, desc = page_json.description;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escA(desc)}">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/en-html.css">
</head>
<body>
${render(header)}
${render(main)}
${render(footer)}
<script src="js/canon.js"></script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log('wrote', OUT, (html.length/1024).toFixed(0)+'KB', 'missing assets:', missing.size); for (const m of missing) console.log('  MISSING', m);
