/**
 * dealer-search — AMAG garage finder (store locator): map capture, search + filter panel, the
 * garage list (n = 100), the garage detail modals (n = 100, [hidden] at rest), the off-canvas
 * filter panel and the "Directly to" pill. One self-contained interactive block; the state is the
 * DOM.
 * Prototype: stardust/prototypes/en-komponenten-car-dealers-html-proposed.html; schema
 * stardust/eds-schema/en-komponenten-car-dealers-html.json (the page has one locator section).
 *
 * Authoring rows — keyed by the first cell (container shape: own rows + one row per garage/detail):
 *   map          | <img desktop capture> | <img mobile capture>
 *   title        | <h1>Search garage</h1>
 *   search       | <p>placeholder of the search field</p>
 *   filter       | <p>label of the filter trigger</p>
 *   garage       | <p>name</p><p>street</p><p>zip town</p> | <ul><li>brand</li>…</ul> (optional)
 *                | <p><a tel><strong>+41…</strong><em>Call</em></a></p><p><a maps>Route</a></p>
 *   details      | <p>back label</p> | <h3>name</h3><p>street</p><p>zip town</p>
 *                | <p><a tel><strong>+41…</strong><em>Call</em></a></p><p><a mailto>Contact</a></p>
 *                  <p><a maps>Route</a></p><p><a site>Go to website</a></p>
 *                | <p><a rating-badge-url>rating-badge-url</a></p>
 *                | <p><strong><a booking>Arrange an appointment</a></strong></p>  (primary CTA)
 *   filters-head | <h4>All filters</h4> | <p><img trash> Delete all filters</p>
 *   filters-type | <p>Show garages by</p>
 *   filters-brands | <p>Brand selection</p> | <ul>sales (img + name)</ul> | <ul>service</ul>
 *   filters-offers | <p>Offer</p> | <ul><li>offer</li>…</ul>
 *   filters-footer | <p>counter</p><p>confirm label</p> | <p>cancel label</p>
 *   quick-links  | <p>topline</p> | <p><img><a href>label</a></p>… | <p><img>open</p><p><img>close
 * A garage row and its details row pair by name (fallback: order).
 * Every authored node is MOVED into the layout (EW1); wrappers carry the classes (EW2); CTAs move
 * as their <p> (EW3); button-like controls are div[role=button] hosts (EW7); re-entrant (EW9).
 *
 * @ew-exempt <p> row key (cell 1: map, title, search, garage, details …) — metadata, not displayed
 * @ew-exempt <p> rating badge URL (details row) — embed source, rendered as the badge iframe
 *
 * Behaviours (motion-observe on live + dynamic-features rows 5/7, self-planned): "Show filters" →
 * .off-canvas-box.is-shown + html.overflow-hidden + reset .visible (close reverts); garage click →
 * its detail modal (hidden toggle, badge iframe src from data-src), "Back to overview" closes; the
 * search field filters the list client-side; the pill shows at scrollY >= 300 (50px hysteresis)
 * and toggles its pop-up. The brand filter data is an owner row: the filter panel body stays hidden
 * as captured.
 *
 * Map: an interactive OpenStreetMap (Leaflet, vendored in /scripts/leaflet) replaces the Google
 * Maps canvas. The authored captures stay as the placeholder until the first tiles load. One AMAG
 * marker per garage, placed from garage-data.js (name + street). As on live: marker click
 * opens the garage detail, centers the garage at zoom 10 beside the overlay and turns its marker
 * blue; list clicks do the same; the search hides the markers of filtered-out garages.
 * Detail brands: "Sale" chips copy the garage row's authored brand list, "Service" chips come from
 * garage-data.js (not in the authored details row).
 */
import { loadCSS, loadScript } from '../../scripts/aem.js';
import GARAGES from './garage-data.js';

const SVG = {
  search: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M31.3333 32C31.1547 32 30.988 31.9307 30.8613 31.8053L23.4093 24'
    + '.3533C20.8227 26.708 17.4947 28 14 28C6.28 28 0 21.72 0 14C0 6.28 6.28 0 14 0C21.72 '
    + '0 28 6.28 28 14C28 17.4947 26.708 20.8227 24.352 23.4093L31.804 30.8613C31.9307 30.9'
    + '88 32 31.1547 32 31.3333C32 31.512 31.9307 31.6787 31.8053 31.8053C31.68 31.932 31.5'
    + '12 32 31.3333 32ZM14 1.33333C7.016 1.33333 1.33333 7.016 1.33333 14C1.33333 20.984 7'
    + '.016 26.6667 14 26.6667C20.984 26.6667 26.6667 20.984 26.6667 14C26.6667 7.016 20.98'
    + '4 1.33333 14 1.33333Z" fill="#801977"></path></svg>',
  clear: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M23.4999 23.9988C23.3659 23.9988 23.2409 23.9468 23.1459 23.8528'
    + 'L11.9999 12.7058L0.853945 23.8528C0.759945 23.9468 0.633945 23.9988 0.499945 23.9988'
    + 'C0.365945 23.9988 0.240945 23.9468 0.145945 23.8528C-0.0490552 23.6578 -0.0490552 23'
    + '.3408 0.145945 23.1458L11.2919 11.9998L0.146945 0.852779C-0.0480552 0.657779 -0.0480'
    + '552 0.340779 0.146945 0.145779C0.240945 0.0507793 0.366945 -0.0012207 0.499945 -0.00'
    + '12207C0.632945 -0.0012207 0.758945 0.0507793 0.853945 0.144779L11.9999 11.2918L23.14'
    + '69 0.145779C23.2409 0.0517793 23.3669 -0.000220703 23.5009 -0.000220703C23.6349 -0.0'
    + '00220703 23.7599 0.0517793 23.8549 0.145779C24.0499 0.340779 24.0499 0.657779 23.854'
    + '9 0.852779L12.7069 11.9988L23.8529 23.1448C24.0479 23.3398 24.0479 23.6568 23.8529 2'
    + '3.8518C23.7589 23.9468 23.6339 23.9988 23.4999 23.9988Z"></path></svg>',
  filter: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M14.6507 32C13.548 32 12.6507 31.1027 12.6507 30V17.0093L2.37199'
    + ' 3.19867C2.11466 2.856 1.97333 2.43067 1.97333 2C1.97333 0.897333 2.87066 0 3.97333 '
    + '0H27.9987C28.4293 0 28.8547 0.141333 29.1987 0.4C30.08 1.06133 30.26 2.31733 29.6 3.'
    + '19867L19.3173 17.0067V28C19.3173 28.6253 19.0187 29.224 18.5173 29.6L15.8507 31.6C15'
    + '.5067 31.8587 15.08 32 14.6507 32ZM3.97333 1.33333C3.60533 1.33333 3.30666 1.632 3.3'
    + '0666 2C3.30666 2.144 3.35466 2.28533 3.43999 2.4L13.852 16.3907C13.9373 16.504 13.98'
    + '4 16.6453 13.984 16.788V30C13.984 30.368 14.2827 30.6667 14.6507 30.6667C14.7947 30.'
    + '6667 14.936 30.62 15.0507 30.5333L17.7173 28.5333C17.884 28.408 17.984 28.208 17.984'
    + ' 28V16.7867C17.984 16.644 18.0307 16.5027 18.116 16.388L28.532 2.4C28.752 2.10667 28'
    + '.692 1.68667 28.3987 1.46667C28.284 1.38133 28.1427 1.33333 27.9987 1.33333H3.97333Z'
    + '"></path></svg>',
  phone: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M25.0101 32C23.9086 32 22.8439 31.6819 21.931 31.0775C13.5553 25'
    + '.5124 6.48737 18.4444 0.923817 10.0703C-0.535815 7.86411 -0.240052 4.90328 1.62885 3'
    + '.02958L3.48817 1.16866C4.24276 0.414069 5.24676 0 6.3147 0C7.38265 0 8.38665 0.41566'
    + '7 9.14124 1.16866L12.5337 4.55955C14.0909 6.1183 14.0909 8.65228 12.5337 10.211L11.9'
    + '15 10.8249C14.7208 14.1679 17.8319 17.279 21.1748 20.0831L21.7903 19.4692C22.5433 18'
    + '.7162 23.5473 18.3006 24.6153 18.3006C25.6832 18.3006 26.6872 18.7162 27.4418 19.469'
    + '2L30.8327 22.8569C32.3898 24.4157 32.3898 26.9512 30.8327 28.5084L28.9718 30.3693C27'
    + '.9166 31.4213 26.5097 32 25.0101 32ZM6.3147 1.59712C5.67362 1.59712 5.0725 1.84652 4'
    + '.62006 2.29896L2.75915 4.15987C1.42422 5.4964 1.21319 7.60991 2.25555 9.18625C7.7008'
    + ' 17.3813 14.6185 24.299 22.8151 29.7442C23.4642 30.1743 24.2252 30.4013 25.0117 30.4'
    + '013C26.0845 30.4013 27.0885 29.9872 27.8415 29.2374L29.7024 27.3781C30.636 26.4428 3'
    + '0.636 24.9225 29.7024 23.9872L26.3115 20.5995C25.8591 20.1487 25.2579 19.8993 24.615'
    + '3 19.8993C23.9742 19.8993 23.3715 20.1487 22.9206 20.5995L21.7903 21.7298C21.64 21.8'
    + '801 21.4386 21.9632 21.2244 21.9632C21.0405 21.9632 20.8599 21.8977 20.716 21.781C16'
    + '.895 18.6379 13.3619 15.1047 10.2156 11.2806C9.95179 10.9592 9.97578 10.4972 10.2699'
    + ' 10.2046L11.4066 9.07914C12.3387 8.14548 12.3387 6.6251 11.405 5.68985L8.01095 2.298'
    + '96C7.55691 1.84652 6.95579 1.59712 6.3147 1.59712V1.19744V1.59712Z"></path></svg>',
  route: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M1.10809 23.6331C0.557093 23.6331 0.108093 23.1851 0.108093 22.6'
    + '331V4.63314C0.108093 4.08214 0.557093 3.63314 1.10809 3.63314H16.1081V1.13314C16.108'
    + '1 0.638141 16.4211 0.463141 16.5171 0.421141C16.5711 0.398141 16.6591 0.369141 16.77'
    + '01 0.369141C16.9031 0.369141 17.1051 0.410141 17.3161 0.607141L23.5821 6.42614C23.60'
    + '11 6.44314 23.6251 6.46714 23.6481 6.49314C23.8191 6.68314 23.9051 6.92914 23.8911 7'
    + '.18414C23.8771 7.43914 23.7651 7.67414 23.5751 7.84514L17.3151 13.6591C17.1041 13.85'
    + '51 16.9021 13.8961 16.7701 13.8961C16.6601 13.8961 16.5721 13.8681 16.5181 13.8451C1'
    + '6.4211 13.8031 16.1091 13.6281 16.1091 13.1331V10.6331H7.10909V22.6331C7.10909 23.18'
    + '51 6.66009 23.6331 6.10909 23.6331H1.10809ZM1.10809 22.6331H6.10809V10.6331C6.10809 '
    + '10.0821 6.55709 9.63314 7.10809 9.63314H16.6081C16.8841 9.63314 17.1081 9.85714 17.1'
    + '081 10.1331V12.4871L22.8721 7.13414L17.1081 1.78014V4.13314C17.1081 4.40914 16.8841 '
    + '4.63314 16.6081 4.63314H1.10809V22.6331Z" fill="#222222"></path></svg>',
  open: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M18.867 11.9603C18.867 12.2463 18.744 12.5193 18.531 12.7093L5.9'
    + '5698 23.8333C5.75098 24.0163 5.43398 23.9973 5.25198 23.7903C5.17098 23.6983 5.12598'
    + ' 23.5813 5.12598 23.4593C5.12598 23.3163 5.18798 23.1793 5.29498 23.0843L17.868 11.9'
    + '593L5.29498 0.833311C5.18798 0.738312 5.12598 0.60231 5.12598 0.458311C5.12598 0.336'
    + '311 5.17098 0.218311 5.25098 0.127312C5.43398 -0.079689 5.75098 -0.0986901 5.95698 0'
    + '.0843105L18.531 11.2103C18.561 11.2363 18.588 11.2643 18.614 11.2933C18.778 11.4793 '
    + '18.867 11.7153 18.867 11.9603Z" fill="#172983"></path></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M18.867 11.9603C18.867 12.2463 18.744 12.5193 18.531 12.7093L5.9'
    + '5698 23.8333C5.75098 24.0163 5.43398 23.9973 5.25198 23.7903C5.17098 23.6983 5.12598'
    + ' 23.5813 5.12598 23.4593C5.12598 23.3163 5.18798 23.1793 5.29498 23.0843L17.868 11.9'
    + '593L5.29498 0.833311C5.18798 0.738312 5.12598 0.60231 5.12598 0.458311C5.12598 0.336'
    + '311 5.17098 0.218311 5.25098 0.127312C5.43398 -0.079689 5.75098 -0.0986901 5.95698 0'
    + '.0843105L18.531 11.2103C18.561 11.2363 18.588 11.2643 18.614 11.2933C18.778 11.4793 '
    + '18.867 11.7153 18.867 11.9603Z" fill="#172983"></path></svg>',
  unfavorite: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M24.7028 30.9961C24.4161 30.9961 24.1441 30.9068 23.9135 30.7388'
    + 'L16.0015 24.9334L8.08547 30.7388C7.85213 30.9054 7.58413 30.9934 7.30413 30.9934C7.2'
    + '3213 30.9934 7.1588 30.9868 7.08547 30.9748C6.7348 30.9174 6.4268 30.7254 6.2188 30.'
    + '4361C5.97213 30.0921 5.9028 29.6481 6.0348 29.2454L9.22547 19.6614L1.6108 13.3494C1.'
    + '3348 13.1134 1.16947 12.7894 1.14147 12.4348C1.11347 12.0801 1.22413 11.7334 1.45613'
    + ' 11.4628C1.70947 11.1668 2.0788 10.9961 2.46947 10.9961H11.5295L14.7495 1.87209C14.9'
    + '481 1.34276 15.4508 0.996094 16.0028 0.996094C16.1628 0.996094 16.3201 1.02409 16.47'
    + '08 1.08143C16.8308 1.21743 17.1135 1.50009 17.2495 1.86009L20.4721 10.9961H29.5308C3'
    + '0.2668 10.9961 30.8641 11.5948 30.8641 12.3294C30.8641 12.7201 30.6935 13.0894 30.39'
    + '75 13.3428L22.7775 19.6614L25.9668 29.2428C26.1975 29.9401 25.8188 30.6961 25.1215 3'
    + '0.9294C24.9855 30.9734 24.8455 30.9961 24.7028 30.9961ZM10.4268 18.9254C10.6375 19.0'
    + '988 10.7201 19.3908 10.6335 19.6494L7.30013 29.6628L15.6068 23.5681C15.7215 23.4841 '
    + '15.8575 23.4388 16.0015 23.4388C16.1455 23.4388 16.2801 23.4828 16.3961 23.5681L24.7'
    + '028 29.6628L21.3695 19.6494C21.2841 19.3908 21.3668 19.1001 21.5775 18.9254L29.5415 '
    + '12.3228L20.0028 12.3294C19.7215 12.3294 19.4681 12.1508 19.3748 11.8854L16.0001 2.31'
    + '743L12.6295 11.8854C12.5361 12.1508 12.2828 12.3294 12.0015 12.3294H2.46947L10.4268 '
    + '18.9254Z" fill="#801977"></path><path d="M12 11.5L15.5 2H16.5L20 11.5H30V12.5L22 19.'
    + '5L25.5 30L24.5 30.5L16 24L7 30.5L6.5 30L10 19.5L2 13V11.5H12Z" fill="#801977"></path'
    + '></svg>',
  favorite: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30'
    + '.8779 38.7451C30.5196 38.7451 30.1796 38.6335 29.8912 38.4235L20.0012 31.1668L10.106'
    + '2 38.4235C9.81456 38.6318 9.47956 38.7418 9.12956 38.7418C9.03956 38.7418 8.94789 38'
    + '.7335 8.85622 38.7185C8.41789 38.6468 8.03289 38.4068 7.77289 38.0451C7.46455 37.615'
    + '1 7.37789 37.0601 7.54289 36.5568L11.5312 24.5768L2.01289 16.6868C1.66789 16.3918 1.'
    + '46122 15.9868 1.42622 15.5435C1.39122 15.1001 1.52955 14.6668 1.81955 14.3285C2.1362'
    + '2 13.9585 2.59789 13.7451 3.08622 13.7451H14.4112L18.4362 2.34012C18.6846 1.67845 19'
    + '.3129 1.24512 20.0029 1.24512C20.2029 1.24512 20.3996 1.28012 20.5879 1.35178C21.037'
    + '9 1.52178 21.3912 1.87512 21.5612 2.32512L25.5896 13.7451H36.9129C37.8329 13.7451 38'
    + '.5796 14.4935 38.5796 15.4118C38.5796 15.9001 38.3662 16.3618 37.9962 16.6785L28.471'
    + '2 24.5768L32.4579 36.5534C32.7462 37.4251 32.2729 38.3701 31.4012 38.6618C31.2312 38'
    + '.7168 31.0562 38.7451 30.8779 38.7451ZM13.0329 23.6568C13.2962 23.8735 13.3996 24.23'
    + '85 13.2912 24.5618L9.12455 37.0784L19.5079 29.4601C19.6512 29.3551 19.8212 29.2985 2'
    + '0.0012 29.2985C20.1812 29.2985 20.3496 29.3535 20.4946 29.4601L30.8779 37.0784L26.71'
    + '12 24.5618C26.6046 24.2385 26.7079 23.8751 26.9712 23.6568L36.9262 15.4035L25.0029 1'
    + '5.4118C24.6512 15.4118 24.3346 15.1884 24.2179 14.8568L19.9996 2.89678L15.7862 14.85'
    + '68C15.6696 15.1884 15.3529 15.4118 15.0012 15.4118H3.08622L13.0329 23.6568Z" fill="#'
    + '801977"></path></svg>',
  call: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M25.0101 32C23.9086 32 22.8439 31.6819 21.931 31.0775C13.5553 25'
    + '.5124 6.48737 18.4444 0.923817 10.0703C-0.535815 7.86411 -0.240052 4.90328 1.62885 3'
    + '.02958L3.48817 1.16866C4.24276 0.414069 5.24676 0 6.3147 0C7.38265 0 8.38665 0.41566'
    + '7 9.14124 1.16866L12.5337 4.55955C14.0909 6.1183 14.0909 8.65228 12.5337 10.211L11.9'
    + '15 10.8249C14.7208 14.1679 17.8319 17.279 21.1748 20.0831L21.7903 19.4692C22.5433 18'
    + '.7162 23.5473 18.3006 24.6153 18.3006C25.6832 18.3006 26.6872 18.7162 27.4418 19.469'
    + '2L30.8327 22.8569C32.3898 24.4157 32.3898 26.9512 30.8327 28.5084L28.9718 30.3693C27'
    + '.9166 31.4213 26.5097 32 25.0101 32ZM6.3147 1.59712C5.67362 1.59712 5.0725 1.84652 4'
    + '.62006 2.29896L2.75915 4.15987C1.42422 5.4964 1.21319 7.60991 2.25555 9.18625C7.7008'
    + ' 17.3813 14.6185 24.299 22.8151 29.7442C23.4642 30.1743 24.2252 30.4013 25.0117 30.4'
    + '013C26.0845 30.4013 27.0885 29.9872 27.8415 29.2374L29.7024 27.3781C30.636 26.4428 3'
    + '0.636 24.9225 29.7024 23.9872L26.3115 20.5995C25.8591 20.1487 25.2579 19.8993 24.615'
    + '3 19.8993C23.9742 19.8993 23.3715 20.1487 22.9206 20.5995L21.7903 21.7298C21.64 21.8'
    + '801 21.4386 21.9632 21.2244 21.9632C21.0405 21.9632 20.8599 21.8977 20.716 21.781C16'
    + '.895 18.6379 13.3619 15.1047 10.2156 11.2806C9.95179 10.9592 9.97578 10.4972 10.2699'
    + ' 10.2046L11.4066 9.07914C12.3387 8.14548 12.3387 6.6251 11.405 5.68985L8.01095 2.298'
    + '96C7.55691 1.84652 6.95579 1.59712 6.3147 1.59712V1.19744V1.59712Z"></path></svg>',
  mail: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M3.33333 27.2719C1.49467 27.2719 0 25.7759 0 23.9386V7.93856C0 7'
    + '.07456 0.330667 6.25589 0.932 5.63189C0.933333 5.62922 0.934667 5.62789 0.936 5.6265'
    + '6C0.949333 5.61056 0.966667 5.59322 0.984 5.57856C1.62533 4.94522 2.45333 4.60522 3.'
    + '33333 4.60522H28.6667C29.5573 4.60522 30.3933 4.95322 31.0253 5.58522C31.0373 5.5958'
    + '9 31.048 5.60656 31.0573 5.61722C31.0613 5.62122 31.0653 5.62656 31.0693 5.63189C31.'
    + '6653 6.24656 32 7.06922 32 7.93856V23.9386C32 25.7759 30.504 27.2719 28.6667 27.2719'
    + 'H3.33333ZM1.568 7.00389C1.41333 7.29056 1.33333 7.60789 1.33333 7.93856V23.9386C1.33'
    + '333 25.0412 2.23067 25.9386 3.33333 25.9386H28.6667C29.7693 25.9386 30.6667 25.0412 '
    + '30.6667 23.9386V7.93856C30.6667 7.60789 30.5867 7.29056 30.432 7.00389L16.4213 18.45'
    + '59C16.3027 18.5532 16.1533 18.6066 16 18.6066C15.8467 18.6066 15.6973 18.5532 15.578'
    + '7 18.4559L1.568 7.00389ZM16 17.0772L29.4373 6.09456C29.1947 5.99189 28.9333 5.93856 '
    + '28.6667 5.93856H3.33333C3.06667 5.93856 2.80533 5.99189 2.56267 6.09456L16 17.0772Z"'
    + ' fill="#222222"></path></svg>',
  modalRoute: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M1.10809 23.6331C0.557093 23.6331 0.108093 23.1851 0.108093 22.6'
    + '331V4.63314C0.108093 4.08214 0.557093 3.63314 1.10809 3.63314H16.1081V1.13314C16.108'
    + '1 0.638141 16.4211 0.463141 16.5171 0.421141C16.5711 0.398141 16.6591 0.369141 16.77'
    + '01 0.369141C16.9031 0.369141 17.1051 0.410141 17.3161 0.607141L23.5821 6.42614C23.60'
    + '11 6.44314 23.6251 6.46714 23.6481 6.49314C23.8191 6.68314 23.9051 6.92914 23.8911 7'
    + '.18414C23.8771 7.43914 23.7651 7.67414 23.5751 7.84514L17.3151 13.6591C17.1041 13.85'
    + '51 16.9021 13.8961 16.7701 13.8961C16.6601 13.8961 16.5721 13.8681 16.5181 13.8451C1'
    + '6.4211 13.8031 16.1091 13.6281 16.1091 13.1331V10.6331H7.10909V22.6331C7.10909 23.18'
    + '51 6.66009 23.6331 6.10909 23.6331H1.10809ZM1.10809 22.6331H6.10809V10.6331C6.10809 '
    + '10.0821 6.55709 9.63314 7.10809 9.63314H16.6081C16.8841 9.63314 17.1081 9.85714 17.1'
    + '081 10.1331V12.4871L22.8721 7.13414L17.1081 1.78014V4.13314C17.1081 4.40914 16.8841 '
    + '4.63314 16.6081 4.63314H1.10809V22.6331Z" fill="#222222"></path></svg>',
  booking: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M2 25.332C0.897333 25.332 0 24.4347 0 23.332V4.66533C0 3.56267 0'
    + '.897333 2.66533 2 2.66533H6.66667V0.666667C6.66667 0.298667 6.96533 0 7.33333 0C7.70'
    + '133 0 8 0.298667 8 0.666667V2.66533H20V0.666667C20 0.298667 20.2987 0 20.6667 0C21.0'
    + '347 0 21.3333 0.298667 21.3333 0.666667V2.66533H26C27.1027 2.66533 28 3.56267 28 4.6'
    + '6533V13.332C28 13.7 27.7013 13.9987 27.3333 13.9987C26.9653 13.9987 26.6667 13.7 26.'
    + '6667 13.332V10.6667H1.33333V23.332C1.33333 23.7 1.632 23.9987 2 23.9987H12.6667C13.0'
    + '347 23.9987 13.3333 24.2973 13.3333 24.6653C13.3333 25.0333 13.0347 25.332 12.6667 2'
    + '5.332H2ZM26.6667 9.33333V4.66533C26.6667 4.29733 26.368 3.99867 26 3.99867H21.3333V7'
    + '.33333C21.3333 7.70133 21.0347 8 20.6667 8C20.2987 8 20 7.70133 20 7.33333V3.99867H8'
    + 'V7.33333C8 7.70133 7.70133 8 7.33333 8C6.96533 8 6.66667 7.70133 6.66667 7.33333V3.9'
    + '9867H2C1.632 3.99867 1.33333 4.29733 1.33333 4.66533V9.33333H26.6667Z" fill="white">'
    + '</path><path d="M23.3332 32.0013C18.5545 32.0013 14.6665 28.1133 14.6665 23.3346C14.'
    + '6665 18.556 18.5545 14.668 23.3332 14.668C28.1118 14.668 31.9998 18.556 31.9998 23.3'
    + '346C31.9998 28.1133 28.1118 32.0013 23.3332 32.0013ZM23.3332 16.0013C19.2892 16.0013'
    + ' 15.9998 19.2906 15.9998 23.3346C15.9998 27.3786 19.2892 30.668 23.3332 30.668C27.37'
    + '72 30.668 30.6665 27.3786 30.6665 23.3346C30.6665 19.2906 27.3772 16.0013 23.3332 16'
    + '.0013Z" fill="white"></path><path d="M23.3332 28.0013C22.9652 28.0013 22.6665 27.702'
    + '6 22.6665 27.3346V24.0013H19.3332C18.9652 24.0013 18.6665 23.7026 18.6665 23.3346C18'
    + '.6665 22.9666 18.9652 22.668 19.3332 22.668H22.6665V19.3346C22.6665 18.9666 22.9652 '
    + '18.668 23.3332 18.668C23.7012 18.668 23.9998 18.9666 23.9998 19.3346V22.668H27.3332C'
    + '27.7012 22.668 27.9998 22.9666 27.9998 23.3346C27.9998 23.7026 27.7012 24.0013 27.33'
    + '32 24.0013H23.9998V27.3346C23.9998 27.7026 23.7012 28.0013 23.3332 28.0013Z" fill="w'
    + 'hite"></path></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org'
    + '/2000/svg"><path d="M23.4999 23.9988C23.3659 23.9988 23.2409 23.9468 23.1459 23.8528'
    + 'L11.9999 12.7058L0.853945 23.8528C0.759945 23.9468 0.633945 23.9988 0.499945 23.9988'
    + 'C0.365945 23.9988 0.240945 23.9468 0.145945 23.8528C-0.0490552 23.6578 -0.0490552 23'
    + '.3408 0.145945 23.1458L11.2919 11.9998L0.146945 0.852779C-0.0480552 0.657779 -0.0480'
    + '552 0.340779 0.146945 0.145779C0.240945 0.0507793 0.366945 -0.0012207 0.499945 -0.00'
    + '12207C0.632945 -0.0012207 0.758945 0.0507793 0.853945 0.144779L11.9999 11.2918L23.14'
    + '69 0.145779C23.2409 0.0517793 23.3669 -0.000220703 23.5009 -0.000220703C23.6349 -0.0'
    + '00220703 23.7599 0.0517793 23.8549 0.145779C24.0499 0.340779 24.0499 0.657779 23.854'
    + '9 0.852779L12.7069 11.9988L23.8529 23.1448C24.0479 23.3398 24.0479 23.6568 23.8529 2'
    + '3.8518C23.7589 23.9468 23.6339 23.9988 23.4999 23.9988Z"></path></svg>',
  chevron: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0.649245 24C0.'
    + '506245 24 0.370245 23.939 0.275245 23.832C0.0922448 23.625 0.112245 23.308 0.318245 '
    + '23.126L12.8932 12L0.318245 0.875C0.111245 0.692 0.0922449 0.375 0.274245 0.169C0.370'
    + '245 0.062 0.506245 0 0.649245 0C0.771245 0 0.889245 0.045 0.980245 0.125L13.5562 11.'
    + '251C13.5852 11.277 13.6122 11.303 13.6372 11.331C14.0062 11.747 13.9692 12.382 13.55'
    + '72 12.747L0.980245 23.875C0.888245 23.956 0.771245 24 0.649245 24Z"></path></svg>',
};

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function icon(name, where, position = 'afterbegin') {
  where.insertAdjacentHTML(position, SVG[name]);
  return where;
}

function wrapNode(node, className) {
  const w = el('div', className);
  if (node) w.append(node);
  return w;
}

// Experience Workspace: a control that hosts authored text is a div[role=button] (EW7)
function control(className) {
  return el('div', className, { role: 'button', tabindex: '0' });
}

function onActivate(node, fn) {
  node.addEventListener('click', fn);
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn(e);
    }
  });
}

const AUTHORED = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'picture', 'img',
  'blockquote', 'table'].map((t) => `:scope > ${t}`).join(', ');
const paragraphs = (cell) => (cell ? [...cell.querySelectorAll(AUTHORED)] : []);
const linkOf = (p) => (p.matches('a') ? p : p.querySelector('a[href]'));
const hrefOf = (p) => {
  const a = linkOf(p);
  return a ? a.getAttribute('href') || '' : '';
};
const isTel = (p) => hrefOf(p).startsWith('tel:');
const isMail = (p) => hrefOf(p).startsWith('mailto:');
const isMaps = (p) => /google\.[a-z.]+\/maps|maps\.app\.goo\.gl/.test(hrefOf(p));
const isBadge = (p) => {
  const a = linkOf(p);
  if (!a) return false;
  return norm(a.textContent) === norm(a.getAttribute('href')) || /webbosaurus/.test(hrefOf(p));
};
const isCta = (p) => !!p.querySelector('strong > a, em > a, a.button');

// tel links: one anchor, <strong>number</strong><em>short label</em> — CSS shows one per breakpoint
function phoneGroup(tels, className, iconName) {
  if (!tels.length) return null;
  const g = el('div', className);
  icon(iconName, g);
  g.append(...tels);
  return g;
}

function buildMap(cells) {
  const map = el('div', 'locator-map');
  const media = cells
    .map((c) => (c.matches('picture, img') ? c : c.querySelector('picture, img')))
    .filter(Boolean);
  const desktopFirst = window.matchMedia('(min-width: 768px)').matches;
  media.forEach((m, i) => {
    const w = wrapNode(m, i === 0 ? 'map-desktop' : 'map-mobile');
    const img = m.matches('img') ? m : m.querySelector('img');
    if (img) {
      const eager = (i === 0) === desktopFirst;
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      if (eager) img.setAttribute('fetchpriority', 'high');
    }
    map.append(w);
  });
  return map;
}

const MARKER = {
  default: { file: 'amag-marker-black.png', size: [41, 49] },
  active: { file: 'amag-marker-blue.png', size: [51, 61] },
};

const BRAND_LABELS = { sale: 'Sale', service: 'Service' };

function lookupGarages() {
  const byKey = new Map();
  GARAGES.forEach(([name, street, lat, lng, service]) => {
    const key = `${norm(name)}|${norm(street)}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push({ at: [lat, lng], service: service || [] });
  });
  // repeated name + street pairs resolve in list order
  return (garage) => {
    const street = garage.querySelector('.garage-address > p');
    const hits = byKey.get(`${garage.dataset.name}|${norm(street && street.textContent)}`);
    return hits && hits.length ? hits.shift() : null;
  };
}

// map area left free by the overlay (≥ 768 it floats over the map's right edge)
function overlayPadding(map, overlay) {
  const m = map.getBoundingClientRect();
  const o = overlay.getBoundingClientRect();
  const covered = o.top < m.bottom && o.bottom > m.top && o.left > m.left ? m.right - o.left : 0;
  return Math.max(0, covered);
}

async function initMap(mapEl, overlay, garages, records) {
  const base = `${window.hlx.codeBasePath}/scripts/leaflet`;
  await Promise.all([loadCSS(`${base}/leaflet.css`), loadScript(`${base}/leaflet.js`)]);
  const { L } = window;
  if (!L || !mapEl.isConnected) return null;

  const canvas = el('div', 'map-canvas');
  mapEl.append(canvas);
  const map = L.map(canvas, { zoomControl: false, attributionControl: true });
  L.control.zoom({ position: 'bottomleft' }).addTo(map);
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  tiles.once('load', () => mapEl.classList.add('is-live'));
  tiles.addTo(map);

  const icons = Object.fromEntries(Object.entries(MARKER).map(([k, { file, size }]) => [k, L.icon({
    iconUrl: `${window.hlx.codeBasePath}/icons/${file}`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
  })]));
  const markers = garages.map((g, i) => {
    const at = records[i] && records[i].at;
    if (!at) return null;
    const name = g.querySelector('.garage-name p');
    const marker = L.marker(at, {
      icon: icons.default,
      title: name ? name.textContent.trim() : '',
      alt: name ? name.textContent.trim() : '',
    });
    // replay on the list entry: detail 1 for a pointer click, 0 for keyboard (focuses the modal)
    const open = (detail) => g.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }));
    marker.on('click', () => open(1));
    marker.on('keydown', ({ originalEvent: e }) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      open(0);
    });
    return marker.addTo(map);
  });

  const placed = markers.filter(Boolean);
  const fitAll = () => {
    if (!placed.length) return;
    const right = overlayPadding(canvas, overlay);
    map.fitBounds(L.featureGroup(placed).getBounds(), {
      paddingTopLeft: [40, 60],
      paddingBottomRight: [right + 40, 40],
    });
  };
  fitAll();

  let active = null;
  const select = (index) => {
    if (active) active.setIcon(icons.default).setZIndexOffset(0);
    active = markers[index] || null;
    if (!active) return;
    active.setIcon(icons.active).setZIndexOffset(1000);
    // center the garage in the part of the map the overlay leaves free
    const zoom = Math.max(map.getZoom(), 10);
    const shift = [overlayPadding(canvas, overlay) / 2, 0];
    const point = map.project(active.getLatLng(), zoom).add(shift);
    map.setView(map.unproject(point, zoom), zoom);
  };
  const sync = () => markers.forEach((m, i) => {
    if (!m) return;
    if (garages[i].hidden) m.remove();
    else m.addTo(map);
  });
  new ResizeObserver(() => map.invalidateSize()).observe(canvas);
  return { select, sync };
}

function buildGarage(cells, index) {
  const garage = el('div', 'garage');
  garage.dataset.index = String(index);
  const [info, brands, actions] = cells;
  const infoNodes = paragraphs(info);
  const name = infoNodes.shift();
  if (name) {
    garage.dataset.name = norm(name.textContent);
    const nameWrap = wrapNode(name, 'garage-name');
    nameWrap.append(el('span', 'garage-distance'));
    garage.append(nameWrap);
  }
  if (infoNodes.length) {
    const address = el('div', 'garage-address');
    address.append(...infoNodes);
    garage.append(address);
  }
  const list = brands && brands.querySelector('ul, ol');
  if (list) garage.append(wrapNode(list, 'garage-brands'));
  const actionNodes = paragraphs(actions).filter(linkOf);
  if (actionNodes.length) {
    const box = el('div', 'garage-actions');
    const phone = phoneGroup(actionNodes.filter(isTel), 'garage-phone', 'phone');
    if (phone) box.append(phone);
    actionNodes.filter((p) => !isTel(p)).forEach((p) => {
      const w = el('div', 'garage-route');
      icon('route', w);
      w.append(p);
      box.append(w);
    });
    garage.append(box);
  }
  garage.append(icon('open', el('span', 'garage-open')));
  garage.dataset.search = norm(garage.textContent);
  return garage;
}

function buildModal(cells) {
  const modal = el('div', 'garage-modal', { hidden: '' });
  const infoCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6'));
  const infoIdx = cells.indexOf(infoCell);
  const header = el('div', 'modal-header');
  const close = control('modal-close');
  icon('back', close);
  cells.forEach((c, i) => {
    if (i < infoIdx && !c.querySelector('a')) close.append(...paragraphs(c));
  });
  header.append(close);
  modal.append(header);

  const content = el('div', 'modal-content');
  if (infoCell) {
    const nodes = paragraphs(infoCell);
    const title = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
    const titleWrap = el('div', 'modal-title');
    if (title) {
      modal.dataset.name = norm(title.textContent);
      titleWrap.append(title);
    }
    titleWrap.append(icon('unfavorite', el('span', 'modal-unfavorite', { hidden: '' })));
    titleWrap.append(icon('favorite', el('span', 'modal-favorite')));
    content.append(titleWrap);
    const rest = nodes.filter((n) => n !== title);
    if (rest.length) {
      const address = el('div', 'modal-address');
      address.append(...rest);
      content.append(address);
    }
  }
  const linkCells = cells.filter((c, i) => i > infoIdx);
  const links = linkCells.flatMap(paragraphs).filter(linkOf);
  const ctas = links.filter(isCta);
  const badges = links.filter((p) => !isCta(p) && isBadge(p));
  const plain = links.filter((p) => !isCta(p) && !isBadge(p));
  const actions = el('div', 'modal-actions');
  const call = phoneGroup(plain.filter(isTel), 'modal-call', 'call');
  if (call) actions.append(call);
  plain.filter(isMail).forEach((p) => actions.append(icon('mail', wrapNode(p, 'modal-mail'))));
  plain.filter(isMaps).forEach((p) => {
    actions.append(icon('modalRoute', wrapNode(p, 'modal-route')));
  });
  if (actions.childElementCount) content.append(actions);
  plain.filter((p) => !isTel(p) && !isMail(p) && !isMaps(p)).forEach((p) => {
    content.append(wrapNode(p, 'modal-link'));
  });
  badges.forEach((p) => {
    const rating = el('div', 'modal-rating');
    const frame = el('iframe', '', { title: 'Rating badge', loading: 'lazy' });
    frame.dataset.src = hrefOf(p);
    rating.append(frame, wrapNode(p, 'rating-source'));
    content.append(rating);
  });
  modal.append(content);
  if (ctas.length) {
    const footer = el('div', 'modal-footer');
    ctas.forEach((p) => icon('booking', p.querySelector('a')));
    footer.append(...ctas);
    modal.append(footer);
  }
  // leftovers: anything the slots did not consume stays visible (never dropped)
  linkCells.forEach((c) => {
    if (c.childElementCount) content.append(...c.children);
  });
  return modal;
}

function buildPanel(rows) {
  const aside = el('aside', 'off-canvas', { role: 'dialog', 'aria-modal': 'true' });
  aside.append(el('div', 'off-canvas-backdrop', { hidden: '' }));
  const box = el('div', 'off-canvas-box');
  const head = el('div', 'off-canvas-head');
  const closeBtn = control('off-canvas-close');
  icon('close', closeBtn);
  head.append(closeBtn);
  box.append(head);
  const content = el('div', 'off-canvas-content');
  const panel = el('div', 'filter-panel', { hidden: '' });
  const foot = el('div', 'off-canvas-foot');

  const headRow = rows.find((r) => r.key === 'filters-head');
  const filterHead = el('div', 'filter-head');
  const headline = el('div', 'filter-headline');
  const reset = control('filter-reset');
  if (headRow) {
    const [h, r] = headRow.cells;
    headline.append(...paragraphs(h));
    headline.append(el('span', 'filter-counter'));
    reset.append(...paragraphs(r));
  }
  filterHead.append(headline, reset);
  panel.append(filterHead);
  const active = el('div', 'active-filters');
  active.append(el('div', 'active-filters-scroll'));
  panel.append(active);

  const typeRow = rows.find((r) => r.key === 'filters-type');
  const type = el('div', 'filter-type');
  const typeHead = el('div', 'filter-type-headline');
  if (typeRow) typeHead.append(...typeRow.cells.flatMap(paragraphs));
  const sw = el('div', 'filter-type-switch');
  // the two selection buttons were empty at capture (filled by the store data on live)
  sw.append(el('span', 'filter-type-button is-active'), el('span', 'filter-type-button'));
  type.append(typeHead, sw);
  panel.append(type);

  const brandRow = rows.find((r) => r.key === 'filters-brands');
  if (brandRow) {
    const [h, sales, service] = brandRow.cells;
    panel.append(wrapNode(null, 'filter-brands-headline'));
    panel.lastElementChild.append(...paragraphs(h));
    const salesList = sales && sales.querySelector('ul, ol');
    if (salesList) panel.append(wrapNode(salesList, 'filter-brands sales'));
    const serviceList = service && service.querySelector('ul, ol');
    if (serviceList) {
      const w = wrapNode(serviceList, 'filter-brands service');
      w.hidden = true;
      panel.append(w);
    }
  }
  const offerRow = rows.find((r) => r.key === 'filters-offers');
  if (offerRow) {
    const [h, list] = offerRow.cells;
    const offers = el('div', 'filter-offers');
    const oh = el('div', 'filter-offers-headline');
    oh.append(...paragraphs(h));
    offers.append(oh);
    const ul = list && list.querySelector('ul, ol');
    if (ul) offers.append(ul);
    panel.append(offers);
  }
  content.append(panel);
  box.append(content);

  const footRow = rows.find((r) => r.key === 'filters-footer');
  const confirm = control('filter-confirm');
  const cancelWrap = el('div', 'filter-cancel-wrap', { hidden: '' });
  const cancel = control('filter-cancel');
  if (footRow) {
    const [c, x] = footRow.cells;
    const ps = paragraphs(c);
    if (ps.length > 1) confirm.append(wrapNode(ps.shift(), 'filter-count'));
    confirm.append(...ps);
    cancel.append(...paragraphs(x));
  }
  cancelWrap.append(cancel);
  foot.append(confirm, cancelWrap);
  box.append(foot);
  aside.append(box);

  const setOpen = (on) => {
    box.classList.toggle('is-shown', on);
    document.documentElement.classList.toggle('overflow-hidden', on);
    if (on) reset.classList.add('visible');
  };
  onActivate(closeBtn, () => setOpen(false));
  onActivate(confirm, () => setOpen(false));
  onActivate(cancel, () => setOpen(false));
  aside.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  return { aside, setOpen };
}

function buildDirectEntry(row) {
  const root = el('div', 'direct-entry');
  const backdrop = el('div', 'direct-entry-backdrop', { hidden: '' });
  const popup = el('div', 'direct-entry-popup');
  const [topline, links, labels] = row.cells;
  const tl = el('div', 'direct-entry-topline');
  tl.append(...paragraphs(topline));
  popup.append(tl);
  const list = el('div', 'direct-entry-links');
  let pendingMedia = null;
  paragraphs(links).forEach((p) => {
    const a = linkOf(p);
    if (!a) {
      if (p.querySelector('picture, img') || p.matches('picture, img')) pendingMedia = p;
      return;
    }
    const link = el('a', 'direct-entry-element', { href: a.getAttribute('href') });
    if (a.target) link.target = a.target;
    a.replaceWith(...a.childNodes); // EW6: card-as-link, the paragraph keeps its index
    if (pendingMedia) link.append(pendingMedia);
    pendingMedia = null;
    link.append(p);
    icon('chevron', link, 'beforeend');
    list.append(link);
  });
  popup.append(list);
  const button = el('div', 'direct-entry-button');
  const open = control('direct-entry-open');
  const close = control('direct-entry-close');
  close.hidden = true;
  const labelNodes = paragraphs(labels);
  if (labelNodes[0]) open.append(labelNodes[0]);
  if (labelNodes[1]) close.append(labelNodes[1]);
  button.append(open, close);
  root.append(backdrop, popup, button);

  const set = (on) => {
    popup.classList.toggle('show', on);
    backdrop.hidden = !on;
    open.hidden = on;
    close.hidden = !on;
    document.documentElement.classList.toggle('overflow-hidden', on);
  };
  onActivate(button, () => set(!popup.classList.contains('show')));
  backdrop.addEventListener('click', () => set(false));
  let last = 0;
  const onScroll = () => {
    if (!root.isConnected) return;
    const t = window.scrollY;
    if (t - last < 50 && last - t < 50) return;
    last = t;
    button.classList.toggle('show', t >= 300);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return root;
}

function pairModals(garages, modals) {
  const byName = new Map(modals.map((m) => [m.dataset.name, m]));
  return garages.map((g, i) => byName.get(g.dataset.name) || modals[i] || null);
}

function brandGroup(kind, names) {
  if (!names.length) return null;
  const group = el('div', `modal-brands ${kind}`);
  const ul = el('ul');
  names.forEach((n) => {
    const li = el('li');
    li.textContent = n;
    ul.append(li);
  });
  const title = el('p', 'modal-brands-title');
  title.textContent = BRAND_LABELS[kind];
  group.append(title, ul);
  return group;
}

// sale (authored garage row) + service (garage-data.js) chips, placed before the rating badge
function addModalBrands(modal, garage, record) {
  const sale = [...garage.querySelectorAll('.garage-brands li')].map((li) => li.textContent.trim());
  const groups = [brandGroup('sale', sale), brandGroup('service', record ? record.service : [])]
    .filter(Boolean);
  if (!groups.length) return;
  const content = modal.querySelector('.modal-content');
  const rating = content.querySelector('.modal-rating');
  if (rating) rating.before(...groups);
  else content.append(...groups);
}

function wireGarages(list, garages, modals, pairs, onSelect) {
  // focus moves to "Back to overview" on keyboard activation only (no focus ring on mouse clicks)
  const openModal = (modal, keyboard) => {
    modals.forEach((m) => {
      m.hidden = m !== modal;
    });
    const frame = modal.querySelector('iframe[data-src]');
    if (frame && !frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
    const close = modal.querySelector('.modal-close');
    if (close && keyboard) close.focus();
  };
  garages.forEach((g, i) => {
    const modal = pairs[i];
    if (!modal) return;
    g.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openModal(modal, e.detail === 0);
      onSelect(i);
    });
  });
  modals.forEach((m) => {
    const close = m.querySelector('.modal-close');
    if (close) {
      onActivate(close, () => {
        m.hidden = true;
        onSelect(-1);
      });
    }
  });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach((m) => {
        m.hidden = true;
      });
      onSelect(-1);
    }
  });
}

function wireSearch(input, clear, garages, onChange) {
  const apply = () => {
    const q = norm(input.value);
    clear.hidden = !q;
    garages.forEach((g) => {
      g.hidden = !!q && !(g.dataset.search || '').includes(q);
    });
    onChange();
  };
  input.addEventListener('input', apply);
  clear.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    const key = norm(cells[0] ? cells[0].textContent : '');
    return { key, cells: cells.slice(1), row };
  });
  const by = (k) => rows.filter((r) => r.key === k);
  const id = `dealer-search-${Math.random().toString(36).slice(2, 8)}`;

  const locator = el('div', 'locator');
  const inner = el('div', 'locator-inner');
  const mapRow = by('map')[0];
  if (mapRow) inner.append(buildMap(mapRow.cells));

  const overlay = el('div', 'locator-overlay');
  const search = el('div', 'locator-search');
  const titleRow = by('title')[0];
  const title = el('div', 'search-title');
  if (titleRow) title.append(...titleRow.cells.flatMap(paragraphs));
  search.append(title);

  const field = el('div', 'search-field');
  const label = el('label', 'search-icon', { for: id });
  icon('search', label);
  const input = el('input', 'search-input', { id, type: 'text', autocomplete: 'off' });
  const clear = el('span', 'search-clear', { hidden: '' });
  icon('clear', clear);
  field.append(label, input, clear);
  const searchRow = by('search')[0];
  if (searchRow) {
    const ph = el('div', 'search-placeholder');
    ph.append(...searchRow.cells.flatMap(paragraphs));
    field.append(ph);
    input.setAttribute('placeholder', ph.textContent.trim());
  }
  search.append(field);

  const filterRow = el('div', 'filter-row');
  const filterBtn = control('filter-button');
  icon('filter', filterBtn);
  const filterLabel = by('filter')[0];
  if (filterLabel) filterBtn.append(...filterLabel.cells.flatMap(paragraphs));
  filterBtn.append(el('span', 'filter-counter'));
  filterRow.append(filterBtn);
  search.append(filterRow);
  overlay.append(search);

  const list = el('div', 'garage-list');
  const garages = by('garage').map((r, i) => buildGarage(r.cells, i));
  const modals = by('details').map((r) => buildModal(r.cells));
  list.append(...garages, ...modals);
  overlay.append(list);
  inner.append(overlay);

  const { aside, setOpen } = buildPanel(rows);
  inner.append(aside);
  locator.append(inner);
  onActivate(filterBtn, () => setOpen(true));
  const locate = lookupGarages();
  const records = garages.map(locate);
  const pairs = pairModals(garages, modals);
  pairs.forEach((m, i) => m && addModalBrands(m, garages[i], records[i]));
  let mapApi = null;
  wireGarages(list, garages, modals, pairs, (i) => mapApi && mapApi.select(i));
  wireSearch(input, clear, garages, () => mapApi && mapApi.sync());
  const mapEl = inner.querySelector('.locator-map');
  if (mapEl) {
    initMap(mapEl, overlay, garages, records).then((api) => {
      mapApi = api;
    });
  }

  const out = [locator];
  const quick = by('quick-links')[0];
  if (quick) out.push(buildDirectEntry(quick));

  // leftovers pass: unknown rows degrade to visible default content, never vanish
  const known = new Set(['map', 'title', 'search', 'filter', 'garage', 'details', 'filters-head',
    'filters-type', 'filters-brands', 'filters-offers', 'filters-footer', 'quick-links']);
  const leftovers = el('div', 'leftovers');
  rows.filter((r) => !known.has(r.key)).forEach((r) => leftovers.append(...r.row.children));
  if (leftovers.childElementCount) out.push(leftovers);
  block.replaceChildren(...out);
}
