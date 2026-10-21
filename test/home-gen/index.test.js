import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { applyAudience, resolveMarkerDefaults } from '../../scripts/home-gen/index.js';
import { INTENT_KEY } from '../../scripts/home-gen/intent-store.js';

function setup(html) {
  const dom = new JSDOM(`<body><main>${html}</main></body>`, { url: 'https://x.aem.page/en/home-gen' });
  global.window = dom.window;
  global.document = dom.window.document;
  global.CustomEvent = dom.window.CustomEvent;
  global.NodeFilter = dom.window.NodeFilter;
  const storage = {};
  const store = {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
  };
  return {
    dom, main: dom.window.document.querySelector('main'), store, storage,
  };
}

const sections = `
  <div class="section" data-audience="car-shopper"><div class="hero-carousel block"><p>cars</p></div></div>
  <div class="section" data-audience="service"><div class="service-offer block"><p>service</p></div></div>
  <div class="section"><div class="quick-links block"><p>always</p></div></div>`;
const env = (q) => ({
  url: new URL(`https://x.aem.page/en/home-gen${q}`), referrer: '', width: 1280, stored: null,
});

test('resolveMarkerDefaults swaps markers for authored defaults', () => {
  const { main } = setup('<h1 id="generate-1">{{generate: write a hero}}{{default: Find your car}}</h1><p>plain</p>'
    + '<p>{{generate: a}}{{default: One}} and {{generate: b}}{{default: Two}}</p>');
  assert.equal(resolveMarkerDefaults(main), 3);
  assert.equal(main.querySelector('h1').textContent, 'Find your car');
  assert.equal(main.querySelector('h1').hasAttribute('id'), false);
  assert.equal(main.querySelectorAll('p')[1].textContent, 'One and Two');
  assert.equal(main.querySelectorAll('p')[0].textContent, 'plain');
});

test('applyAudience hides the other audiences and keeps unmarked sections', () => {
  const { main } = setup(sections);
  const r = applyAudience(main, env('?aud=service'));
  assert.equal(r.resolution.audience, 'service');
  const [cars, service, always] = main.querySelectorAll('.section');
  assert.equal(cars.hidden, true);
  assert.equal(service.hidden, false);
  assert.equal(always.hidden, false);
  assert.equal(document.body.dataset.audience, 'service');
});

test('applyAudience does nothing on a page without audience sections', () => {
  const { main } = setup('<div class="section"><p>plain page</p></div>');
  assert.equal(applyAudience(main, env('')), null);
  assert.equal(main.querySelector('.section').hidden, false);
  assert.equal(window.of1Why, undefined);
});

test('publishes once, as authored fallback while markers are unresolved', () => {
  const { main } = setup(`${sections}<p>{{generate: x}}{{default: Hi}}</p>`);
  let events = 0;
  document.addEventListener('of1:why', () => { events += 1; });
  applyAudience(main, { ...env('?aud=car-shopper'), generationRan: false });
  const generation = Object.fromEntries(window.of1Why.rows).Generation;
  assert.equal(generation, 'authored (fallback)');
  assert.equal(events, 1);
});

test('reports generated slots when generation ran', () => {
  const { main } = setup(`${sections}<h2>Written by OF1</h2>`);
  applyAudience(main, { ...env('?aud=car-shopper'), generationRan: true, generatedSlots: 4 });
  assert.equal(Object.fromEntries(window.of1Why.rows).Generation, 'generated (4 text slots)');
});

test('sections with generated slots are marked generated, others authored', () => {
  const { main } = setup(`
    <div class="section" data-audience="car-shopper"><div class="hero-carousel block"><h2 id="generate-1">Hi</h2></div></div>
    <div class="section"><div class="quick-links block"><p>fixed</p></div></div>`);
  applyAudience(main, { ...env('?aud=car-shopper'), generationRan: true, generatedSlots: 1 });
  const items = window.of1Why.lists.find((l) => l.title === 'Sections').items.map((i) => i.text);
  assert.deepEqual(items, ['hero-carousel — generated', 'quick-links — authored']);
});

test('a click on a service link stores the intent', () => {
  const { main, store, storage } = setup(`${sections}<a href="/de/service.html">service</a>`);
  applyAudience(main, { ...env('?aud=glancer'), storage: store });
  main.querySelector('a').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(storage[INTENT_KEY], 'service');
});
