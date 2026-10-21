import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUDIENCE_IDS, AUDIENCES, EVIDENCE } from '../../scripts/home-gen/audiences.js';

test('the five audience ids, in order', () => {
  assert.deepEqual(AUDIENCE_IDS, ['car-shopper', 'service', 'dealer', 'menu-explorer', 'glancer']);
});

test('every audience has all text fields', () => {
  AUDIENCE_IDS.forEach((id) => {
    ['label', 'share', 'mobile', 'behaviour', 'pageDoes'].forEach((field) => {
      assert.ok(AUDIENCES[id][field], `${id}.${field}`);
    });
  });
});

test('shares and mobile figures match the OpTel analysis', () => {
  assert.equal(AUDIENCES['car-shopper'].share, '20%');
  assert.equal(AUDIENCES['car-shopper'].mobile, '43%');
  assert.equal(AUDIENCES.service.share, '13%');
  assert.equal(AUDIENCES.dealer.share, '7%');
  assert.equal(AUDIENCES['menu-explorer'].share, '21%');
  assert.equal(AUDIENCES.glancer.share, '37%');
  assert.equal(AUDIENCES.glancer.mobile, '54%');
});

test('evidence names its source, range and sample', () => {
  assert.equal(EVIDENCE.range, '2026-09-20 to 2026-10-20');
  assert.equal(EVIDENCE.path, '/de.html');
  assert.equal(EVIDENCE.domain, 'www.amag.ch');
  assert.ok(EVIDENCE.sample.includes('1,159'));
  AUDIENCE_IDS.forEach((id) => {
    assert.ok(Array.isArray(EVIDENCE.perAudience[id]) && EVIDENCE.perAudience[id].length > 0, id);
  });
});
