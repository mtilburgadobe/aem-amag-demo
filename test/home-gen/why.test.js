import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildWhyContract, publishWhy } from '../../scripts/home-gen/why.js';

const resolution = {
  audience: 'car-shopper',
  rule: 'referrer-auto-amag',
  why: 'Arrived from auto.amag.ch, the vehicle marketplace',
  signals: {
    override: null, referrer: 'auto.amag.ch', clickId: null, utmMedium: null, device: 'mobile', stored: null,
  },
};
const page = {
  generated: 4,
  authoredFallback: false,
  sections: [
    { block: 'hero-carousel', kind: 'generated' },
    { block: 'quick-links', kind: 'authored' },
  ],
};
const rowsOf = (c) => Object.fromEntries(c.rows);
const listOf = (c, title) => c.lists.find((l) => l.title === title);

test('version, title and row order', () => {
  const c = buildWhyContract(resolution, page);
  assert.equal(c.version, 1);
  assert.equal(c.title, 'Why this page?');
  assert.deepEqual(c.rows.map(([label]) => label), [
    'Audience', 'Rule', 'Why', 'What the data shows', 'What this page does', 'Generation',
  ]);
  assert.equal(rowsOf(c).Audience, 'Car shopper');
  assert.equal(rowsOf(c).Rule, 'referrer-auto-amag');
});

test('generation row for generated and fallback pages', () => {
  assert.equal(rowsOf(buildWhyContract(resolution, page)).Generation, 'generated (4 text slots)');
  const fallback = buildWhyContract(resolution, { ...page, generated: 0, authoredFallback: true });
  assert.equal(rowsOf(fallback).Generation, 'authored (fallback)');
});

test('signals list omits empty signals', () => {
  const items = listOf(buildWhyContract(resolution, page), 'Signals').items.map((i) => i.text);
  assert.deepEqual(items, ['referrer: auto.amag.ch', 'device: mobile']);
});

test('evidence list ends with source and sample lines', () => {
  const items = listOf(buildWhyContract(resolution, page), 'Evidence').items.map((i) => i.text);
  assert.ok(items.includes('20% of human views, 43% mobile'));
  assert.equal(items[items.length - 2], 'Source: AEM OpTel audience analysis, www.amag.ch/de.html, 2026-09-20 to 2026-10-20');
  assert.ok(items[items.length - 1].includes('1,159'));
});

test('sections list marks generated and authored', () => {
  const items = listOf(buildWhyContract(resolution, page), 'Sections').items.map((i) => i.text);
  assert.deepEqual(items, ['hero-carousel — generated', 'quick-links — authored']);
});

test('no list item carries a cross-origin link', () => {
  const c = buildWhyContract(resolution, page);
  c.lists.flatMap((l) => l.items).forEach((i) => {
    if (i.href) assert.ok(/^\/(?![/\\])/.test(i.href), i.href);
  });
});

test('publishWhy sets window.of1Why and fires of1:why once', () => {
  const events = [];
  const win = {};
  const doc = { dispatchEvent: (e) => events.push(e) };
  global.CustomEvent = class {
    constructor(type, init) {
      this.type = type;
      this.detail = init.detail;
    }
  };
  const c = buildWhyContract(resolution, page);
  publishWhy(c, win, doc);
  assert.equal(win.of1Why, c);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'of1:why');
  assert.equal(events[0].detail, c);
});
