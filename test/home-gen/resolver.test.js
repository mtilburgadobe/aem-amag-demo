import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveAudience } from '../../scripts/home-gen/resolver.js';

const base = {
  url: new URL('https://x.aem.page/en/home-gen'), referrer: '', width: 1280, stored: null,
};
const run = (over = {}) => resolveAudience({ ...base, ...over });

test('demo override picks the audience', () => {
  const r = run({ url: new URL('https://x.aem.page/en/home-gen?aud=dealer') });
  assert.equal(r.audience, 'dealer');
  assert.equal(r.rule, 'demo-override');
  assert.equal(r.signals.override, 'dealer');
});

test('override beats referrer', () => {
  const r = run({ url: new URL('https://x/p?aud=service'), referrer: 'https://auto.amag.ch/' });
  assert.equal(r.audience, 'service');
});

test('unknown or empty override falls through to the real rules', () => {
  ['zzz', ''].forEach((aud) => {
    const r = run({ url: new URL(`https://x/p?aud=${aud}`) });
    assert.notEqual(r.rule, 'demo-override');
    assert.equal(r.signals.override, null);
  });
});

test('referrer auto.amag.ch is a car shopper', () => {
  const r = run({ referrer: 'https://auto.amag.ch/de' });
  assert.deepEqual([r.audience, r.rule], ['car-shopper', 'referrer-auto-amag']);
  assert.equal(r.signals.referrer, 'auto.amag.ch');
});

test('login referrer is a service customer', () => {
  const r = run({ referrer: 'https://aspvoapn1.accounts.ondemand.com/saml2' });
  assert.deepEqual([r.audience, r.rule], ['service', 'referrer-login']);
});

test('paid clicks and search referrers are car shoppers', () => {
  const clickIds = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'];
  clickIds.forEach((id) => {
    const r = run({ url: new URL(`https://x/p?${id}=1`) });
    assert.deepEqual([r.audience, r.rule], ['car-shopper', 'paid-or-search'], id);
  });
  ['cpc', 'ppc', 'paid', 'paidsocial', 'display'].forEach((m) => {
    const r = run({ url: new URL(`https://x/p?utm_medium=${m}`) });
    assert.equal(r.rule, 'paid-or-search', m);
  });
  ['https://www.google.com/', 'https://www.bing.com/', 'https://duckduckgo.com/', 'https://www.ecosia.org/', 'https://search.yahoo.com/'].forEach((ref) => {
    assert.equal(run({ referrer: ref }).rule, 'paid-or-search', ref);
  });
});

test('stored last-seen intent is used when nothing else matches', () => {
  const r = run({ stored: 'service' });
  assert.deepEqual([r.audience, r.rule], ['service', 'last-seen-intent']);
  assert.equal(r.signals.stored, 'service');
});

test('unknown stored value is ignored', () => {
  const r = run({ stored: 'bogus' });
  assert.equal(r.rule, 'default-desktop');
  assert.equal(r.signals.stored, null);
});

test('defaults depend on the viewport width', () => {
  assert.deepEqual([run({ width: 767 }).audience, run({ width: 767 }).rule], ['glancer', 'default-mobile']);
  assert.deepEqual([run({ width: 768 }).audience, run({ width: 768 }).rule], ['menu-explorer', 'default-desktop']);
  assert.equal(run({ width: 767 }).signals.device, 'mobile');
  assert.equal(run({ width: 768 }).signals.device, 'desktop');
});

test('malformed or own-host referrers are not external', () => {
  ['not a url', '', 'https://x.aem.page/other'].forEach((ref) => {
    assert.equal(run({ referrer: ref }).signals.referrer, null, ref);
  });
});

test('every resolution carries a why sentence', () => {
  assert.ok(run().why.length > 0);
});
