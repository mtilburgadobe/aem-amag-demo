import { AUDIENCE_IDS } from './audiences.js';

const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'];
const PAID_MEDIUM = /^(cpc|ppc|paid|paidsocial|display)$/i;
const SEARCH_HOST = /(^|\.)(google|bing|duckduckgo|ecosia)\.[a-z.]+$|(^|\.)search\.yahoo\.com$/i;
const AUTO_AMAG_HOST = 'auto.amag.ch';
const LOGIN_HOST = /accounts\.ondemand\.com$/i;

function hostOf(value) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function known(id) {
  return AUDIENCE_IDS.includes(id) ? id : null;
}

/**
 * Picks one audience from first-view signals. Pure: everything comes in through `env`.
 * Rules, first match wins: demo override, auto.amag.ch referrer, login referrer,
 * paid click or search referrer, stored last-seen intent, then a viewport default.
 * @param {object} [env]
 * @param {URL} [env.url]
 * @param {string} [env.referrer]
 * @param {number} [env.width]
 * @param {string|null} [env.stored] last-seen intent from a previous visit
 * @returns {{audience: string, rule: string, why: string, signals: object}}
 */
// eslint-disable-next-line import/prefer-default-export
export function resolveAudience({
  url = new URL(window.location.href),
  referrer = document.referrer,
  width = window.innerWidth,
  stored = null,
} = {}) {
  const q = url.searchParams;
  const refHost = hostOf(referrer);
  const external = !!refHost && refHost !== url.hostname.toLowerCase();
  const clickId = CLICK_IDS.find((k) => q.has(k)) || null;
  const signals = {
    override: known(q.get('aud')),
    referrer: external ? refHost : null,
    clickId,
    utmMedium: q.get('utm_medium') || null,
    device: width < 768 ? 'mobile' : 'desktop',
    stored: known(stored),
  };
  const result = (audience, rule, why) => ({
    audience, rule, why, signals,
  });

  if (signals.override) {
    return result(signals.override, 'demo-override', `?aud=${signals.override} in the URL`);
  }
  if (signals.referrer === AUTO_AMAG_HOST) {
    return result('car-shopper', 'referrer-auto-amag', 'Arrived from auto.amag.ch, the vehicle marketplace');
  }
  if (signals.referrer && LOGIN_HOST.test(signals.referrer)) {
    return result('service', 'referrer-login', `Arrived from the login flow (${signals.referrer})`);
  }
  const paid = !!clickId || PAID_MEDIUM.test(signals.utmMedium || '');
  if (paid || (signals.referrer && SEARCH_HOST.test(signals.referrer))) {
    const how = paid ? 'Paid click' : `Search referrer ${signals.referrer}`;
    return result('car-shopper', 'paid-or-search', `${how}: mostly vehicle searches`);
  }
  if (signals.stored) {
    return result(signals.stored, 'last-seen-intent', `Last visit ended on a ${signals.stored} page`);
  }
  if (signals.device === 'mobile') {
    return result('glancer', 'default-mobile', 'Direct visit on a narrow screen with no earlier signal');
  }
  return result('menu-explorer', 'default-desktop', 'Direct visit on a wide screen with no earlier signal');
}
