#!/usr/bin/env node
// Grades OF1 generations: language, grounding, images, retrieval, structure. 0-100 per run.
// Usage: node grade.mjs [--host H] [--runs 3] [--min 75] [--json out.json]
import { readFileSync, writeFileSync } from "node:fs";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const HOST = arg("host", "prev--main--aem-amag-demo--mtilburgadobe.of1.live");
const RUNS = Number(arg("runs", 3));
const MIN = Number(arg("min", 75));
const TENANT = "mtilburgadobe/aem-amag-demo";
const SRC = "https://main--aem-amag-demo--mtilburgadobe.aem.live";
const queries = JSON.parse(readFileSync(new URL("./queries.json", import.meta.url)));

const WORDS = {
  en: "the and for your you with from to of a an on at or also we our new now all find electric discover which".split(" "),
  de: "der die das und für ist nicht sie ihre mit von zu den dem ein eine auf bei oder auch wir ihr entdecken jetzt unsere finden".split(" "),
  fr: "le la les et pour est pas vous votre avec de du des un une sur ou aussi nous notre découvrez trouvez".split(" "),
};
const BAD = JSON.parse(readFileSync(new URL("./bad-images.json", import.meta.url)));
const strip = (h) => h.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
const nums = (t) => [...t.matchAll(/CHF\s?([\d'’.,]+)/g)].map((m) => m[1].replace(/[’'.,]+$/g, "").replace(/['’,]/g, ""));

async function generate(q) {
  const res = await fetch(`https://${HOST}/api/generate`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: TENANT, index: "preview", query: q, followUp: false, debug: true, context: { browsing: [], conversationHistory: [] } }),
    signal: AbortSignal.timeout(120000),
  });
  let html = "", debug = {};
  for (const l of (await res.text()).split("\n")) {
    try { const d = JSON.parse(l); if (d.type === "section") html += d.html; if (d.type === "debug") debug = d.debug; } catch {}
  }
  return { html, debug };
}

const cache = new Map();
async function source(path) {
  if (!cache.has(path)) cache.set(path, await fetch(`${SRC}${path}.plain.html`).then((r) => (r.ok ? r.text() : "")).catch(() => ""));
  return cache.get(path);
}

function langScore(text, lang) {
  const w = text.toLowerCase().match(/[a-zäöüéèàçâêîôû']+/g) || [];
  const hits = Object.fromEntries(Object.entries(WORDS).map(([k, set]) => [k, w.filter((x) => set.includes(x)).length]));
  const own = hits[lang], other = Math.max(...Object.entries(hits).filter(([k]) => k !== lang).map(([, v]) => v));
  if (own === 0 && other === 0) return { s: 15, note: "no signal" };
  return { s: other === 0 ? 30 : Math.max(0, Math.round(30 * (1 - other / (own + other)) * 1.2)), note: `${lang}:${own} other:${other}` };
}

async function grade(item, run) {
  const { html, debug } = await generate(item.q);
  const text = strip(html);
  const paths = (debug.rag?.content || []).map((c) => c.path);
  const notes = [];

  const l = langScore(text, item.lang); notes.push(`lang ${l.note}`);

  const srcText = strip((await Promise.all([...new Set(paths)].map(source))).join(" ") + " " + (await fetch(`${SRC}/templates/${debug.template}.plain.html`).then((r) => r.text()).catch(() => "")));
  const srcNums = new Set(nums(srcText));
  const out = [...new Set(nums(text))];
  const bad = out.filter((n) => !srcNums.has(n));
  const g = out.length ? Math.round(25 * (1 - bad.length / out.length)) : 25;
  if (bad.length) notes.push(`unsourced CHF ${bad.slice(0, 3).join(",")}`);

  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  const photos = imgs.filter((x) => !/\.svg|width="32"/.test(x));
  const graphics = photos.filter((x) => BAD.some((h) => x.includes(h))).length;
  const blind = photos.filter((x) => !/alt="[^"]+"/.test(x)).length;
  const i = Math.max(0, 20 - graphics * 20); if (graphics) notes.push(`${graphics} known-bad image(s)`);
  if (blind) notes.push(`${blind} photo(s) with empty alt`);

  const r = item.expectPath ? (paths.some((p) => p.includes(item.expectPath)) ? 15 : 0) : 15;
  if (!r) notes.push(`retrieval missed *${item.expectPath}*`);

  const sec = (html.match(/<div class="/g) || []).length;
  const dropped = debug.slotResolution?.rowsDropped || 0;
  const st = (sec >= 3 ? 10 : 0) - Math.min(dropped * 2, 5) + (sec >= 3 ? 0 : 0);
  if (dropped) notes.push(`${dropped} rows dropped`);

  const score = l.s + g + i + r + Math.max(0, st);
  return { q: item.q, run, template: debug.template, score, parts: { lang: l.s, grounding: g, images: i, retrieval: r, structure: Math.max(0, st) }, notes };
}

const jobs = queries.flatMap((it) => Array.from({ length: RUNS }, (_, k) => grade(it, k + 1).catch((e) => ({ q: it.q, run: k + 1, score: 0, parts: {}, notes: [`error ${e.message}`] }))));
const res = await Promise.all(jobs);
for (const r of res) console.log(`${String(r.score).padStart(3)}  ${r.q.slice(0, 44).padEnd(44)} #${r.run} ${String(r.template).padEnd(24)} ${JSON.stringify(r.parts)} ${r.notes.join(" | ")}`);
const avg = Math.round(res.reduce((a, r) => a + r.score, 0) / res.length);
console.log(`\nmean ${avg}/100 over ${res.length} runs (min required ${MIN})`);
if (arg("json")) writeFileSync(arg("json"), JSON.stringify(res, null, 2));
process.exit(avg >= MIN ? 0 : 1);
