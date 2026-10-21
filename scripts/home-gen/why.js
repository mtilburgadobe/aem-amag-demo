import { AUDIENCES, EVIDENCE } from './audiences.js';

const SIGNAL_LABELS = [
  ['override', 'override'],
  ['referrer', 'referrer'],
  ['clickId', 'ad click id'],
  ['utmMedium', 'utm_medium'],
  ['device', 'device'],
  ['stored', 'last-seen intent'],
];

function signalItems(signals) {
  return SIGNAL_LABELS
    .filter(([key]) => signals[key])
    .map(([key, label]) => ({ text: `${label}: ${signals[key]}` }));
}

/**
 * Builds the window.of1Why contract the OF1 widget renders.
 * @param {{audience: string, rule: string, why: string, signals: object}} resolution
 * @param {{generated: number, authoredFallback: boolean,
 *   sections: Array<{block: string, kind: 'generated'|'authored'}>}} page
 */
export function buildWhyContract(resolution, page) {
  const meta = AUDIENCES[resolution.audience];
  const generation = page.authoredFallback
    ? 'authored (fallback)'
    : `generated (${page.generated} text slots)`;
  const source = `Source: ${EVIDENCE.report}, ${EVIDENCE.domain}${EVIDENCE.path}, ${EVIDENCE.range}`;
  return {
    version: 1,
    title: 'Why this page?',
    rows: [
      ['Audience', meta.label],
      ['Rule', resolution.rule],
      ['Why', resolution.why],
      ['What the data shows', meta.behaviour],
      ['What this page does', meta.pageDoes],
      ['Generation', generation],
    ],
    lists: [
      { title: 'Signals', items: signalItems(resolution.signals) },
      {
        title: 'Evidence',
        items: [...EVIDENCE.perAudience[resolution.audience], source, EVIDENCE.sample]
          .map((text) => ({ text })),
      },
      {
        title: 'Sections',
        items: page.sections.map((s) => ({ text: `${s.block} — ${s.kind}` })),
      },
    ],
  };
}

/** Publishes the contract for the OF1 widget: window.of1Why plus one of1:why event. */
export function publishWhy(contract, win = window, doc = document) {
  win.of1Why = contract;
  doc.dispatchEvent(new CustomEvent('of1:why', { detail: contract }));
}
