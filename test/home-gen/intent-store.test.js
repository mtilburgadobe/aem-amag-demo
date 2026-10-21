import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INTENT_KEY, readIntent, recordIntent } from '../../scripts/home-gen/intent-store.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

test('records and reads a service intent', () => {
  const s = fakeStorage();
  assert.equal(recordIntent('https://www.amag.ch/de/service.html', s), 'service');
  assert.equal(readIntent(s), 'service');
  assert.equal(s.data[INTENT_KEY], 'service');
});

test('maps destinations to audiences', () => {
  const cases = [
    ['https://www.amag.ch/de/auto-finden.html', 'car-shopper'],
    ['/de/auto-finden/autos-bei-amag-haendler/neuwagen-konfigurieren.html', 'car-shopper'],
    ['/de/komponenten/storelocator.html', 'dealer'],
    ['/de/suche.html', 'dealer'],
    ['/de/service/auto-services-online-termin-buchen.html', 'service'],
    ['/de/user/login.html', 'service'],
  ];
  cases.forEach(([href, id]) => assert.equal(recordIntent(href, fakeStorage()), id, href));
});

test('an unmatched destination returns null and leaves storage unchanged', () => {
  const s = fakeStorage({ [INTENT_KEY]: 'dealer' });
  assert.equal(recordIntent('/de/jobs-amag.html', s), null);
  assert.equal(readIntent(s), 'dealer');
});

test('garbage stored value reads as null', () => {
  assert.equal(readIntent(fakeStorage({ [INTENT_KEY]: 'bogus' })), null);
});

test('a storage that throws is swallowed', () => {
  const broken = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('denied'); },
  };
  assert.equal(readIntent(broken), null);
  assert.equal(recordIntent('/de/service.html', broken), 'service');
});
