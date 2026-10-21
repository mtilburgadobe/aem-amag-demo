import { AUDIENCE_IDS } from './audiences.js';

export const INTENT_KEY = 'amag-home-gen-intent';

// First match wins, so service and dealer destinations are tested before the broad car ones.
const RULES = [
  ['service', /\/service|termin|\/user\/login/i],
  ['dealer', /storelocator|haendler-finden|\/suche/i],
  ['car-shopper', /auto-finden|neuwagen|occasion|vorfuehr|nach-marken/i],
];

function defaultStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readIntent(storage = defaultStorage()) {
  try {
    const value = storage && storage.getItem(INTENT_KEY);
    return AUDIENCE_IDS.includes(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Maps a clicked destination to an audience and remembers it for the next visit.
 * @param {string} href
 * @param {Storage} [storage]
 * @returns {string|null} the audience id, or null when the destination matched nothing
 */
export function recordIntent(href, storage = defaultStorage()) {
  const hit = RULES.find(([, re]) => re.test(href || ''));
  if (!hit) return null;
  try {
    if (storage) storage.setItem(INTENT_KEY, hit[0]);
  } catch {
    // storage unavailable: the intent still resolves for this view
  }
  return hit[0];
}
