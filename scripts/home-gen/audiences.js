/*
 * The five AMAG home-page audiences and the OpTel evidence behind them.
 * Source: docs/superpowers/specs/2026-10-20-amag-optel-audiences.md
 * Every figure here comes from that analysis; do not add numbers that are not in it.
 */

export const AUDIENCE_IDS = ['car-shopper', 'service', 'dealer', 'menu-explorer', 'glancer'];

export const AUDIENCES = {
  'car-shopper': {
    label: 'Car shopper',
    share: '20%',
    mobile: '43%',
    behaviour: 'Goes to find a vehicle: new cars, used cars, brand model pages, e-mobility and the VW ID. Polo promotion.',
    pageDoes: 'Leads with vehicle search and the new, used and electric entry points.',
  },
  service: {
    label: 'Service and account customer',
    share: '13%',
    mobile: '47% (service), 26% (account)',
    behaviour: 'Books a service appointment or logs in to their account. Almost all arrive direct.',
    pageDoes: 'Leads with service booking and the account entry.',
  },
  dealer: {
    label: 'Dealer and finder',
    share: '7%',
    mobile: '52%',
    behaviour: 'Looks for a garage or dealer through the store locator, dealer pages or on-site search.',
    pageDoes: 'Leads with dealer search and the store locator.',
  },
  'menu-explorer': {
    label: 'Menu explorer',
    share: '21%',
    mobile: 'not measured',
    behaviour: 'Opens the menu or the hero carousel but no destination is recorded: still deciding where to go.',
    pageDoes: 'Shows a balanced mix of the main entry points.',
  },
  glancer: {
    label: 'Glancer',
    share: '37%',
    mobile: '54%',
    behaviour: 'Looks and leaves without a click or a scroll. 16.5% of humans carry an accessibility signal.',
    pageDoes: 'Shows a short hero with one clear call to action.',
  },
};

export const EVIDENCE = {
  report: 'AEM OpTel audience analysis',
  domain: 'www.amag.ch',
  path: '/de.html',
  range: '2026-09-20 to 2026-10-20',
  sample: '1,159 sampled bundles, about 70k human views, +/-5 points',
  perAudience: {
    'car-shopper': [
      '20% of human views, 43% mobile',
      'Referrer auto.amag.ch is 7% of humans; 83% of them interact',
    ],
    service: [
      '13% of human views; mobile 47% for service, 26% for account',
      'Almost all arrive direct; some come from login flows',
    ],
    dealer: [
      '7% of human views, about 52% mobile',
      'Store locator, dealer pages and on-site search',
    ],
    'menu-explorer': [
      '21% of human views: open the menu or hero carousel, no destination recorded',
      'Hero carousel users are 63% mobile',
    ],
    glancer: [
      '37% of human views: no click, no scroll, 54% mobile',
      '16.5% of humans have an accessibility signal; 81% of those are on mobile',
    ],
  },
};
