// Depth-limited tag/class outline of a serialized HTML fragment (no browser). Usage: node outline.mjs <file> [maxDepth] [skipClassRegex]
import fs from 'node:fs';
const [file, md = '7', skip = 'amag-garageOverlay__garageList--garage$|cmp-breadcrumb__item$|svg'] = process.argv.slice(2);
const s = fs.readFileSync(file, 'utf8'); const VOID = new Set(['img', 'source', 'input', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use']);
const re = /<(\/?)([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g; let depth = 0, m; const stack = []; const skipRe = new RegExp(skip); let skipDepth = -1, skipCount = 0, lastKey = '';
const out = [];
while ((m = re.exec(s))) {
  if (m[4] !== undefined) { const t = m[4].replace(/\s+/g, ' ').trim(); if (t && depth <= +md && skipDepth < 0) out.push('  '.repeat(depth) + '"' + t.slice(0, 50) + (t.length > 50 ? '…' : '') + '"'); continue; }
  const close = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '';
  if (close) { if (VOID.has(tag) && stack[stack.length-1] !== tag) continue; if (stack.length) stack.pop(); depth = stack.length; if (skipDepth === depth) { skipDepth = -1; } continue; }
  const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || ''; const id = (attrs.match(/ id="([^"]*)"/) || [])[1];
  const selfClose = VOID.has(tag) || /\/\s*$/.test(attrs);
  if (skipDepth >= 0) { if (!selfClose) { stack.push(tag); depth = stack.length; } continue; }
  const key = tag + (id ? '#' + id : '') + (cls ? '.' + cls.split(/\s+/).join('.') : '');
  if (depth <= +md) {
    const extra = tag === 'img' ? ' src=' + ((attrs.match(/src="([^"]*)"/) || [])[1] || '').split('/').pop().slice(0, 40) + ' alt="' + ((attrs.match(/alt="([^"]*)"/) || [])[1] || '').slice(0, 30) + '"' : tag === 'a' ? ' href=' + ((attrs.match(/href="([^"]*)"/) || [])[1] || '').slice(0, 60) : (attrs.match(/ hidden| style="[^"]*"/) || [''])[0];
    if (skipRe.test(key) && key === lastKey) { skipCount++; if (skipCount > 1) { if (!selfClose) { skipDepth = depth; stack.push(tag); depth = stack.length; } continue; } }
    else skipCount = 0;
    out.push('  '.repeat(depth) + key + extra); lastKey = key;
  }
  if (!selfClose) { stack.push(tag); depth = stack.length; }
}
console.log(out.join('\n'));
