// Minimal static server for stardust/prototypes (fallback: the coordinator's :8791 python server crashed). Port from argv.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('stardust/prototypes'); const port = Number(process.argv[2] || 8792);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain' };
http.createServer((req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p); if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    const real = fs.realpathSync(file); const st = fs.statSync(real); if (!st.isFile()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': mime[path.extname(real).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
    if (req.method === 'HEAD') return res.end(); fs.createReadStream(real).pipe(res);
  } catch { res.writeHead(404); res.end(); }
}).listen(port, '127.0.0.1', () => console.log('serving', root, 'on', port));
