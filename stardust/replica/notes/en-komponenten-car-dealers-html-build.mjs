// Assembles stardust/prototypes/en-komponenten-car-dealers-html-proposed.html: head + chrome (services header with this page's
// language-switch hrefs, services footer verbatim — live text identical) + hand-authored storelocator markup. The 100 garage list
// items, their 100 hidden detail modals and the off-canvas brand/offer filter lists are DATA lifted from the captured HTML; markup ours.
// Live SVG icons (harvested outerHTML, never redrawn) are inlined by key.
import fs from 'node:fs';
const N = 'stardust/replica/notes/'; const SLUG = 'en-komponenten-car-dealers-html';
const cap = fs.readFileSync(`stardust/current/pages/${SLUG}.html`, 'utf8');
const meta = JSON.parse(fs.readFileSync(`stardust/current/pages/${SLUG}.json`, 'utf8'));
const media = JSON.parse(fs.readFileSync(N + `${SLUG}-media-map.json`, 'utf8'));
const svgsAll = JSON.parse(fs.readFileSync(N + `${SLUG}-live-svgs.json`, 'utf8'));
const svgByKey = {}; for (const s of svgsAll) { const k = (s.ptag + '|' + (s.parent || '').replace(/\s+/g, ' ').trim() + '|' + (s.cls || '')); if (!svgByKey[k]) svgByKey[k] = s.html; }
const key = (ptag, parent, cls = '') => { const k = ptag + '|' + parent + '|' + cls; if (!svgByKey[k]) throw new Error('no svg for ' + k); return svgByKey[k]; };
const SVG = {
  search: key('LABEL', 'storelocator__searchIcon'), del: key('DIV', 'storelocator__searchContainer', 'storelocator__searchDelete d-none'),
  filter: key('BUTTON', 'storelocator__filterButton', 'size-xl'),
  phone: key('A', 'storelocator__garagePhone d-inline-flex align-items-center text-decoration-none'),
  route: key('A', 'storelocator__garageRoute d-inline-flex align-items-center text-decoration-none'),
  open: key('DIV', 'storelocator__garage', 'storelocator__openGarageIcon'),
  mClose: key('BUTTON', 'amag-garagenModal__closeButton amag-garageModal__closeButton'),
  mUnfav: key('SPAN', 'amag-garagenModal__unfavoriteGarage amag-garageModal__unfavoriteGarage amag-cookieGarage--unfavorite d-none'),
  mFav: key('SPAN', 'amag-garagenModal__favoriteGarage amag-garageModal__favoriteGarage amag-cookieGarage--favorite amag-cookie'),
  mCall: key('A', 'd-flex align-items-center text-decoration-none amag-garagenModal__callButton amag-garageModal__callButton'),
  mMail: key('A', 'amag-garagenModal__emailButton amag-garageModal__emailButton'), mRoute: key('A', 'amag-garagenModal__routeButton amag-garageModal__routeButton'),
  mOtv: key('A', 'd-flex align-items-center justify-content-center text-decoration-none amag-garagenModal__otvButton amag-garageModal__otvButton'),
  ocClose: key('BUTTON', 'off-canvas__close-btn', 'off-canvas__close-btn-icon'), ocBack: key('BUTTON', 'off-canvas__close-btn', 'off-canvas__back-btn-icon d-none'),
  chevron: key('A', 'amag-direct-entry__pop-up-element', 'amag-direct-entry__pop-up-chevron size-m'),
};
const local = (src) => { const u = src.startsWith('http') ? src : 'https://www.amag.ch' + src; if (!media[u]) throw new Error('unharvested asset ' + u); return media[u]; };
const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;');
const txt = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// ---- garages (100) + modals (100)
const gParts = cap.split('<div class="storelocator__garage" ').slice(1);
const garages = gParts.map((p) => {
  const head = p.slice(0, p.indexOf('>'));
  const g = (re) => (p.match(re) || [, ''])[1];
  return {
    target: g.call(null, /data-target="([^"]*)"/.bind ? /data-target="([^"]*)"/ : 0) || (head.match(/data-target="([^"]*)"/) || [])[1],
    id: (head.match(/data-garage-id="([^"]*)"/) || [])[1], brandsAttr: (head.match(/data-brands="([^"]*)"/) || [])[1], kw: (head.match(/data-keywords="([^"]*)"/) || [])[1],
    lat: (head.match(/data-lat="([^"]*)"/) || [])[1], lng: (head.match(/data-lng="([^"]*)"/) || [])[1], bg: (head.match(/background-color: ([^;"]*)/) || [])[1],
    name: txt(g(/<p class="storelocator__garageName">([\s\S]*?)<span/)), address: txt(g(/<p class="storelocator__garageAddress">([\s\S]*?)<\/p>/)),
    zip: txt(g(/<p class="storelocator__garageZip">([\s\S]*?)<span/)), city: txt(g(/<span class="storelocator__garageCity">([\s\S]*?)<\/span>/)),
    brands: [...(g(/<div class="storelocator__sellingBrands">([\s\S]*?)<\/div>/)).matchAll(/<span>([^<]*)<\/span>/g)].map(m => m[1].trim()),
    tel: g(/storelocator__garagePhone[^"]*" href="([^"]*)"/), telText: txt(g(/<span class="d-none d-lg-inline">([^<]*)<\/span>/)), callText: txt(g(/<span class="d-lg-none">([^<]*)<\/span>/)),
    routeHref: g(/storelocator__garageRoute[^"]*" href="([^"]*)"/),
  };
});
const mParts = cap.split('<div id="id').slice(1).filter(p => p.startsWith(p.slice(0, p.indexOf('"'))) && /class="amag-garagenModal amag-garageModal"/.test(p.slice(0, 200)));
const modals = mParts.map((p) => {
  const g = (re) => (p.match(re) || [, ''])[1];
  return { id: p.slice(0, p.indexOf('"')), name: g(/data-garagename="([^"]*)"/), tel: g(/data-garagenumber="([^"]*)"/), link: g(/data-garagelink="([^"]*)"/), mail: g(/data-garagemail="([^"]*)"/),
    closeText: txt(g(/amag-garageModal__closeButton">[\s\S]*?<\/svg>([\s\S]*?)<\/button>/)), title: txt(g(/amag-garageModal__title">([\s\S]*?)<\/h3>/)),
    favTitle: g(/amag-cookie" data-toggle="tooltip" data-placement="bottom" title="([^"]*)"/), street: txt(g(/amag-garageModal__street">([\s\S]*?)<\/p>/)),
    zip: txt(g(/amag-garageModal__zip">([\s\S]*?)<span/)), city: txt(g(/amag-garageModal__city">([\s\S]*?)<\/span>/)),
    telText: txt(g(/<span class="d-none d-md-inline">([^<]*)<\/span>/)), callText: txt(g(/<span class="d-md-none">([^<]*)<\/span>/)),
    mailText: txt(g(/amag-garageModal__emailButton">[\s\S]*?<\/svg>([\s\S]*?)<\/a>/)), routeHref: g(/<a href="([^"]*)" class="amag-garagenModal__routeButton/), routeText: txt(g(/amag-garageModal__routeButton">[\s\S]*?<\/svg>([\s\S]*?)<\/a>/)),
    detailText: txt(g(/amag-garageModal__garagenDetailLink">([\s\S]*?)<\/a>/)), rating: g(/<iframe src="([^"]*)"/), otv: g(/<a href="([^"]*)" class="d-flex align-items-center justify-content-center text-decoration-none amag-garagenModal__otvButton/),
    otvText: txt(g(/amag-garageModal__otvButton"[^>]*>[\s\S]*?<\/svg>([\s\S]*?)<\/a>/)) };
});
const garageHtml = garages.map((g) => `<div class="storelocator__garage" data-target="${g.target}" data-garage-id="${g.id}" data-brands="${g.brandsAttr}" data-lat="${g.lat}" data-lng="${g.lng}" data-keywords="${g.kw}" style="background-color: ${g.bg};">
 <p class="storelocator__garageName">${esc(g.name)} <span class="storelocator__distance"></span></p>
 <p class="storelocator__garageAddress">${esc(g.address)}</p>
 <p class="storelocator__garageZip">${g.zip} <span class="storelocator__garageCity">${esc(g.city)}</span></p>
 <div class="storelocator__sellingBrands">${g.brands.map(b => `<span>${esc(b)}</span>`).join(' ')}</div>
 <a class="storelocator__garagePhone d-inline-flex align-items-center text-decoration-none" href="${g.tel}" role="button">${SVG.phone}<span class="d-none d-lg-inline">${g.telText}</span><span class="d-lg-none">${g.callText}</span></a>
 <a class="storelocator__garageRoute d-inline-flex align-items-center text-decoration-none" href="${esc(g.routeHref)}" role="button">${SVG.route} Route</a>
 ${SVG.open}
</div>`).join('\n');
const modalHtml = modals.map((m) => `<div id="id${m.id}" class="amag-garagenModal amag-garageModal" data-modalid="${m.id}" data-garagename="${esc(m.name)}" hidden>
 <div class="amag-garagenModal__container amag-garageModal__container">
  <div class="amag-garagenModal__header amag-garageModal__header"><button class="amag-garagenModal__closeButton amag-garageModal__closeButton">${SVG.mClose} ${m.closeText}</button></div>
  <div class="amag-garagenModal__content amag-garageModal__content">
   <div class="d-flex justify-content-between align-items-center amag-garagenModal__titleWrapper amag-garageModal__titleWrapper">
    <h3 class="amag-garagenModal__title amag-garageModal__title">${esc(m.title)}</h3>
    <span class="amag-garagenModal__unfavoriteGarage amag-garageModal__unfavoriteGarage amag-cookieGarage--unfavorite d-none">${SVG.mUnfav}</span>
    <span class="amag-garagenModal__favoriteGarage amag-garageModal__favoriteGarage amag-cookieGarage--favorite amag-cookie" title="${esc(m.favTitle)}">${SVG.mFav}</span>
   </div>
   <div class="amag-garagenModal__infoWrapper amag-garageModal__infoWrapper"><p class="amag-garagenModal__street amag-garageModal__street">${esc(m.street)}</p><p class="amag-garagenModal__zip amag-garageModal__zip">${m.zip} <span class="amag-garagenModal__city amag-garageModal__city">${esc(m.city)}</span></p></div>
   <div class="d-flex flex-wrap amag-garagenModal__ctaWrapper amag-garageModal__ctaWrapper">
    <a class="d-flex align-items-center text-decoration-none amag-garagenModal__callButton amag-garageModal__callButton" href="tel:${m.tel}" role="button">${SVG.mCall}<span class="d-none d-md-inline">${m.telText}</span><span class="d-md-none">${m.callText}</span></a>
    <a class="amag-garagenModal__emailButton amag-garageModal__emailButton" href="mailto:${m.mail}">${SVG.mMail} ${m.mailText}</a>
    <a class="amag-garagenModal__routeButton amag-garageModal__routeButton" href="${esc(m.routeHref)}">${SVG.mRoute} ${m.routeText}</a>
   </div>
   <a class="amag-garagenModal__garagenDetailLink amag-garageModal__garagenDetailLink" href="${m.link}">${m.detailText}</a>
   <div class="amag-rating__container amag-rating__container--storeLocator"><iframe title="Rating badge" data-src="${esc(m.rating)}"></iframe></div>
  </div>
  <div class="amag-garagenModal__footer amag-garageModal__footer"><a class="d-flex align-items-center justify-content-center text-decoration-none amag-garagenModal__otvButton amag-garageModal__otvButton" href="${m.otv}">${SVG.mOtv} ${m.otvText}</a></div>
 </div>
</div>`).join('\n');
// ---- off-canvas filter lists (data from capture)
const panel = cap.slice(cap.indexOf('<div class="storelocator__brand-filter-off-canvas'), cap.indexOf('<footer class="off-canvas__canvas-box-lower'));
const listBlock = (cls) => { const i = panel.indexOf(`<div class="amag-filterModal__brandsCheckboxes ${cls}`); const j = panel.indexOf('</ul>', i); return panel.slice(i, j); };
const cbItems = (block) => [...block.matchAll(/<li class="amag-filterModal__checkboxListItem">([\s\S]*?)<\/li>/g)].map(m => { const li = m[1]; return { id: (li.match(/for="([^"]+)"/) || [])[1], src: (li.match(/amag-filterModal__image"[^>]*?src="([^"]+)"/) || li.match(/src="([^"]+)"/) || [])[1], alt: (li.match(/alt="([^"]*)"/) || [, ''])[1], label: txt(li) }; });
const cbList = (items) => `<div class="amag-filterModal__checkboxesContainer"><ul class="amag-filterModal__checkboxList">\n${items.map(it => `<li class="amag-filterModal__checkboxListItem"><label for="${it.id}"><input id="${it.id}" type="checkbox"><div class="amag-filterModal__checkboxListItem-front"><div class="amag-filterModal__imgWrapper"><img class="amag-filterModal__image" src="${local(it.src)}" alt="${it.alt}"></div>${esc(it.label)}</div></label></li>`).join('\n')}\n</ul></div>`;
const sales = cbItems(listBlock('sales')), service = cbItems(listBlock('service'));
const offers = [...panel.matchAll(/<label class="switch" for="([^"]+)">[\s\S]*?<span class="slider">\s*<\/span>\s*([^<]*?)\s*<\/label>/g)].map(m => ({ id: m[1], label: m[2].trim() }));
const trash = local((panel.match(/resetButton-icon" src="([^"]+)"/) || [])[1]);
const pt = (re) => txt((panel.match(re) || [, ''])[1]);
const foot = cap.slice(cap.indexOf('<footer class="off-canvas__canvas-box-lower'), cap.indexOf('</aside>')); const ft = (re) => txt((foot.match(re) || [, ''])[1]);
const offCanvas = `<aside class="off-canvas__wrapper" role="dialog" aria-modal="true">
 <div class="off-canvas__backdrop d-none"></div>
 <div class="off-canvas__canvas-box">
  <header class="off-canvas__canvas-box-upper"><button class="off-canvas__close-btn" aria-label="Close">${SVG.ocClose}${SVG.ocBack}</button></header>
  <div class="off-canvas__content"><section class="off-canvas__inner-container side-padding">
   <div class="storelocator__brand-filter-off-canvas d-none" id="storelocator__brand-filter-off-canvas">
    <div class="amag-filterModal__container">
     <div class="amag-filterModal__header"><h4 class="amag-filterModal__headline">${pt(/amag-filterModal__headline">([\s\S]*?)<span/)} <span class="storelocator__filterCounter"></span></h4><button class="amag-filterModal__resetButton"><img class="storelocator__brand-filter-off-canvas__resetButton-icon" src="${trash}" alt=""><span>${pt(/resetButton-icon"[^>]*>\s*<span>([^<]*)<\/span>/)}</span></button></div>
     <div class="storelocator__activeFilters"><div class="storelocator__overflowWrapper"></div></div>
     <div class="amag-filterModal__brandsFilter">
      <p class="amag-filterModal__selectionHeadline">${pt(/amag-filterModal__selectionHeadline">([^<]*)</)}</p>
      <div class="amag-filterModal__filter-selection"><button class="amag-filterModal__filter-selection-button is-active" id="brand-type-sale">${pt(/id="brand-type-sale">([^<]*)</)}</button><button class="amag-filterModal__filter-selection-button" id="brand-type-service">${pt(/id="brand-type-service">([^<]*)</)}</button></div>
      <p class="amag-filterModal__brandsHeadline">${pt(/amag-filterModal__brandsHeadline">([^<]*)</)}</p>
      <div class="amag-filterModal__brandsCheckboxes sales">${cbList(sales)}</div>
      <div class="amag-filterModal__brandsCheckboxes service d-none">${cbList(service)}</div>
      <div class="amag-filterModal__saleWrapper"><p class="amag-filterModal__saleHeadline">${pt(/amag-filterModal__saleHeadline">([^<]*)</)}</p><div class="amag-filterModal__saleCheckboxes"><ul class="amag-filterModal__saleList">
${offers.map(o => `<li class="amag-filterModal__saleListItem"><label class="switch" for="${o.id}"><input type="checkbox" id="${o.id}"><span class="slider"></span> ${esc(o.label)}</label></li>`).join('\n')}
      </ul></div></div>
     </div>
    </div>
   </div>
  </section></div>
  <footer class="off-canvas__canvas-box-lower"><div class="off-canvas__footer"><div class="row">
   <div class="col-12"><button class="amag-ctaWrapper__button off-canvas__confirm-button amag-ctaWrapper__button--bgColor-amagDark-blue"><span class="amag-filterModal__garagenCounter" data-all-label="${ft(/data-all-label="([^"]*)"/)}">${ft(/garagenCounter"[^>]*>([^<]*)<\/span>/)}</span>${ft(/garagenCounter"[^>]*>[^<]*<\/span>([^<]*)<\/button>/)}</button></div>
   <div class="col-12"><div class="off-canvas__cancel-button-wrapper d-none"><button class="off-canvas__cancel-button">${ft(/<button class="off-canvas__cancel-button">([^<]*)<\/button>\s*<\/div>/)}</button></div></div>
  </div></div></footer>
 </div>
</aside>`;
const directEntry = fs.readFileSync(N + `${SLUG}-direct-entry.html`, 'utf8').replace(/<!--SVG:\d+-->/g, SVG.chevron);
const saf = cap.slice(cap.indexOf('<div class="storelocator__searchAndFilterContainer">'), cap.indexOf('<div class="storelocator__garagenContainer'));
const st = (re) => txt((saf.match(re) || [, ''])[1]);
const content = `<div class="amag-content">
<div class="storelocator storelocator-component">
<div class="storelocator storelocator-inner" id="storelocatorId">
 <div class="storelocator__map" id="storelocator__map">
  <picture><source media="(max-width:767.98px)" srcset="assets/media/amag/storelocator/map-capture-360.png"><img src="assets/media/amag/storelocator/map-capture-1440.png" alt="" width="1440" height="740"></picture>
 </div>
 <div class="storelocator__garagenOverlay storelocator__garageOverlay">
  <div class="storelocator__searchAndFilterContainer">
   <h3 class="storelocator__searchTitle">${st(/storelocator__searchTitle">([^<]*)</)}</h3>
   <div class="storelocator__searchContainer">
    <label class="storelocator__searchIcon" for="storelocator__searchField">${SVG.search}</label>
    <input class="storelocator__searchField" id="storelocator__searchField" type="text" placeholder="${(saf.match(/placeholder="([^"]*)"/) || [])[1]}" autocomplete="off">
    ${SVG.del}
    <div class="storelocator__autosuggestContainer d-none"></div>
   </div>
   <div class="storelocator__filterContainer"><button class="storelocator__filterButton">${SVG.filter} ${st(/<\/svg>\s*([^<]*?)\s*<span class="storelocator__filterCounter"/)} <span class="storelocator__filterCounter"></span></button></div>
  </div>
  <div class="storelocator__garagenContainer storelocator__garageContainer">
   <div class="storelocator__alternativeGarages d-none"><p class="storelocator__alternativeGaragesText"></p></div>
${garageHtml}
${modalHtml}
  </div>
 </div>
${offCanvas}
 <div id="selected-keywords" data-selected=""></div>
</div>
</div>
<span class="amag-pop-up__check-element"></span>
${directEntry}
</div>
`;
const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/${SLUG}.css">
</head>
<body>
`;
const header = fs.readFileSync(N + 'en-services-html-chrome-header.html', 'utf8')
  .replace(/href="\/de\/service\.html"/g, 'href="/de/komponenten/storelocator.html"').replace(/href="\/fr\/services\.html"/g, 'href="/fr/composants/amag-garage.html"').replace(/href="\/it\/servizi\.html"/g, 'href="/it/componenti/ricerca-garage.html"');
const footer = fs.readFileSync(N + 'en-services-html-chrome-footer.html', 'utf8');
const tail = `<script src="js/canon.js"></script>
<script src="js/${SLUG}.js"></script>
</body>
</html>
`;
const out = head + header + content + footer + tail;
fs.writeFileSync(`stardust/prototypes/${SLUG}-proposed.html`, out);
const bad = (out.match(/(src|srcset|url\()=?["'(]?[^"')]*(amag\.ch|amag-group\.ch)[^"')]*/g) || []);
console.log('written', out.length, 'chars; garages', garages.length, 'modals', modals.length, 'sales', sales.length, 'service', service.length, 'offers', offers.length, '; remote asset refs:', bad.length, bad.slice(0, 3));
console.log('sample garage', JSON.stringify(garages[0]).slice(0, 400)); console.log('sample modal', JSON.stringify(modals[0]).slice(0, 500));
