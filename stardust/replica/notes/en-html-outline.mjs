// Offline DOM outline of the captured page (no live hit). Usage: node en-html-outline.mjs <html> <out.txt>
import { chromium } from 'playwright';
import fs from 'node:fs';
const [,, htmlPath, out] = process.argv;
const html = fs.readFileSync(htmlPath, 'utf8');
const b = await chromium.launch(); const p = await b.newPage({ javaScriptEnabled: false });
await p.setContent(html, { waitUntil: 'domcontentloaded' });
const txt = await p.evaluate(() => {
  const SKIP = new Set(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','LINK','META']);
  const lines = [];
  function walk(el, depth, maxDepth) {
    if (SKIP.has(el.tagName)) return;
    const cls = (el.getAttribute('class')||'').split(/\s+/).filter(Boolean).filter(c=>!/^(aem-Grid|aem-GridColumn|col-|row$|container$)/.test(c)||/^col-/.test(c)).slice(0,6).join('.');
    const id = el.id ? '#'+el.id : '';
    const kids = [...el.children].filter(k=>!SKIP.has(k.tagName));
    let text = '';
    if (kids.length === 0 || /^(H[1-6]|P|A|BUTTON|LI|SPAN|LABEL|SUMMARY)$/.test(el.tagName)) text = (el.textContent||'').replace(/\s+/g,' ').trim().slice(0,70);
    const attrs = [];
    if (el.tagName==='A' && el.getAttribute('href')) attrs.push('href='+el.getAttribute('href').slice(0,60));
    if (el.tagName==='IMG') attrs.push('src='+(el.getAttribute('src')||'').slice(-50), 'alt='+(el.getAttribute('alt')||''), 'srcset='+((el.getAttribute('srcset')||el.getAttribute('data-srcset')||'').length));
    if (el.tagName==='SOURCE') attrs.push('media='+(el.getAttribute('media')||''), 'srcset='+(el.getAttribute('srcset')||'').slice(-60));
    if (el.tagName==='svg') attrs.push('svg:'+(el.getAttribute('viewBox')||'')+' '+(el.outerHTML.length)+'ch');
    if (el.tagName==='INPUT'||el.tagName==='SELECT') attrs.push('type='+(el.getAttribute('type')||el.tagName.toLowerCase()), 'ph='+(el.getAttribute('placeholder')||''));
    const style = el.getAttribute('style'); if (style && /background|display:\s*none/.test(style)) attrs.push('style='+style.slice(0,80));
    const hidden = el.hidden || /\bd-none\b/.test(el.className) ? ' [hidden]' : '';
    lines.push(`${'  '.repeat(depth)}${el.tagName.toLowerCase()}${id}${cls?'.'+cls:''}${attrs.length?' {'+attrs.join(' | ')+'}':''}${text?' "'+text+'"':''}${hidden}`);
    if (depth < maxDepth) for (const k of kids) walk(k, depth+1, maxDepth);
    else if (kids.length) lines.push(`${'  '.repeat(depth+1)}… ${kids.length} children`);
  }
  for (const sel of ['#header', 'div.amag-content', 'footer']) { const el = document.querySelector(sel); lines.push(`===== ${sel}`); if (el) walk(el, 0, 40); else lines.push('(missing)'); }
  return lines.join('\n');
});
fs.writeFileSync(out, txt); console.log('lines', txt.split('\n').length, '->', out);
await b.close();
