/* eslint-disable */

/**
 * Inline <svg> icons on www.amag.ch that already exist as public files of this site:
 * - published media the /en pages use (content/media-da/media/icon-quicklink-*.svg,
 *   icon-pledge-*.svg), and
 * - icons kept in the code repo under /icons/ (garage page icons /en has no copy of).
 *
 * A data: URI image does not survive the Document Authoring upload (it is published as
 * `about:error`), and the importer rewrites project-relative paths against www.amag.ch, so a
 * known inline icon is mapped to its public URL instead; the upload copies it into the
 * site's media like any other external image. Icons are recognised by the start of their first
 * <path d> (the same icon has the same path data on every page and language).
 */
const SITE = 'https://main--aem-amag-demo--mtilburgadobe.aem.live';

const ICONS = [
  // quick-links (home stage tiles); "Service" is also the garage "AMAG Dienstleistungen" tab
  ['M3.33268 20.6667C2.59802', 'media_1e5b47e4c5369729e442e7c884572328dbd4c3009.svg'], // find vehicle
  ['M12.3721 20.5704L26.5468', 'media_13075106cdb5998db5fc619d243596831d3793169.svg'], // services
  ['M0.667361 15.0935C0.480694', 'media_13f525e9f80b18b2fdcff058a038eecc9b2f160d3.svg'], // find garage
  // pledge-row ("Unser AMAG Versprechen")
  ['M18.6667 29.3343C18.2987', 'media_150a66f3aa18fabb53e311b00a83e9ae522f2ed64.svg'], // transparency
  ['M14.2,25.7c-0.7,0-1.4-0.3', 'media_1ad60877610d215f75120b90dfaa76eba297948bb.svg'], // safety
  ['M12,25.3c-0.2,0-0.3-0.1', 'media_12a664461dbcbebd2ddeea223391944b72ce7220c.svg'], // service
  // garage page: hero-split-garage actions, tabs-garage tabs
  ['M30.8779 38.7451C30.5196', 'icons/icon-garage-save.svg'], // "Als meine Garage speichern"
  ['M25.3337 16.0003C23.3123', 'icons/icon-garage-contact.svg'], // "Team kontaktieren"
  ['M5.22978 19.9776C4.49387', 'icons/icon-garage-tab-vehicles.svg'], // "Fahrzeug-Angebote"
  ['M0.60957 15.0853C0.439068', 'icons/icon-garage-tab-news.svg'], // "News & Infos"
];

/** Public URL for a known inline <svg>, or '' when the icon is not known. */
export function knownIconSrc(svg) {
  const path = svg && svg.querySelector('path[d]');
  if (!path) return '';
  const d = path.getAttribute('d').replace(/\s+/g, ' ').trim();
  const hit = ICONS.find(([sig]) => d.startsWith(sig));
  return hit ? `${SITE}/${hit[1]}` : '';
}
