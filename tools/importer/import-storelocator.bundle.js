/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-storelocator.js
  var import_storelocator_exports = {};
  __export(import_storelocator_exports, {
    default: () => import_storelocator_default
  });

  // tools/importer/parsers/dealer-search.js
  var ORIGIN = "https://www.amag.ch";
  var MAP_SITE = "https://main--aem-amag-demo--mtilburgadobe.aem.live/en/komponenten";
  var MAP_CAPTURES = [
    `${MAP_SITE}/media_1dccce4ffaf016c7c5c3f831da115174435fcc7a2.png`,
    // map-capture-1440.png
    `${MAP_SITE}/media_1b19144909cffb91e680fc2b0f05df94f4066a584.png`
    // map-capture-360.png
  ];
  var DAM = `${ORIGIN}/content/dam/amag-ch/gemeinsame-dateien/icons`;
  var CAPTURED = {
    a50a2eb7397893289f00fc84d098a6d1: `${DAM}/blau/trash-remove.svg`,
    aff8cb92fde6c6ad96e4e6443634ff9e: `${DAM}/schwarz/Probefahrt.svg`,
    "93c2b5e064839747039c33c5d85fd210": `${DAM}/schwarz/calendar-add-1.svg`,
    "6d7a9fc5f68a4ac2b28119abf5166d5d": `${DAM}/schwarz/car-4.svg`,
    e9f315e1df89d5e120195e0344cf64c3: `${DAM}/elektromobilit%C3%A4t/clean-car-cable.svg`,
    "1121474f0effd1dbf4ee9f9448e164ff": `${DAM}/schwarz/Direkteinstiege.svg`
  };
  var txt = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN}/`).href;
    } catch (e) {
      return s;
    }
  };
  var imgSrc = (img) => {
    if (!img) return "";
    const cands = [img.getAttribute("src"), img.getAttribute("data-src")].filter(Boolean);
    for (let i = 0; i < cands.length; i += 1) {
      const c = cands[i].trim();
      if (!c || /^(data|blob):/i.test(c)) continue;
      const hit = c.match(/(?:^|\/)images\/([0-9a-f]{32})\.\w+$/i);
      if (hit && CAPTURED[hit[1]]) return CAPTURED[hit[1]];
      if (hit && /^\.?\/?images\//.test(c)) continue;
      return abs(c);
    }
    return "";
  };
  function parse(element, { document: document2 }) {
    const doc = element.ownerDocument || document2;
    const mk = (tag, ...kids) => {
      const e = document2.createElement(tag);
      kids.flat().forEach((k) => {
        if (k != null && k !== "") e.append(k);
      });
      return e;
    };
    const p = (...kids) => mk("p", ...kids);
    const link = (href, ...kids) => {
      const a = mk("a", ...kids);
      a.setAttribute("href", (href || "").trim());
      return a;
    };
    const image = (src, alt = "") => {
      if (!src) return null;
      const i = document2.createElement("img");
      i.setAttribute("src", src);
      i.setAttribute("alt", alt);
      return i;
    };
    const toImg = (img) => image(imgSrc(img), img ? (img.getAttribute("alt") || "").trim() : "");
    const q = (sel, root = element) => root.querySelector(sel);
    const qa = (sel, root = element) => [...root.querySelectorAll(sel)];
    const textWithout = (node, skipSel) => {
      if (!node) return "";
      const c = node.cloneNode(true);
      c.querySelectorAll(skipSel).forEach((n) => n.remove());
      return txt(c);
    };
    const telP = (a, numSel, labelSel) => {
      if (!a) return null;
      const href = (a.getAttribute("href") || "").trim();
      if (!href) return null;
      const number = txt(q(numSel, a)) || href.replace(/^tel:/, "");
      const label = txt(q(labelSel, a));
      const out = p(mk("strong", link(href, number)));
      if (label) out.append(mk("em", link(href, label)));
      return out;
    };
    const linkP = (a) => {
      if (!a || !a.getAttribute("href")) return null;
      const label = txt(a);
      return label ? p(link(a.getAttribute("href"), label)) : null;
    };
    const cell = (...nodes) => {
      const list = nodes.flat().filter(Boolean);
      return list.length ? list : "";
    };
    const cells = [];
    const row = (key, ...rest) => cells.push([p(key), ...rest]);
    row("map", image(MAP_CAPTURES[0]), image(MAP_CAPTURES[1]));
    const title = txt(q(".storelocator__searchTitle"));
    row("title", title ? mk("h1", title) : "");
    const field = q(".storelocator__searchField, .storelocator__searchContainer input");
    const placeholder = field && (field.getAttribute("placeholder") || "").trim() || "PLZ / Name / Ort";
    row("search", p(placeholder));
    const filterLabel = textWithout(q(".storelocator__filterButton"), ".storelocator__filterCounter");
    row("filter", filterLabel ? p(filterLabel) : "");
    const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
    const garages = qa(".storelocator__garage").map((g) => {
      const name = textWithout(q(".storelocator__garageName", g), ".storelocator__distance");
      const street = txt(q(".storelocator__garageAddress", g));
      const zip = txt(q(".storelocator__garageZip", g));
      const phone = q('a.storelocator__garagePhone, a[href^="tel:"]', g);
      const route = q("a.storelocator__garageRoute", g);
      const brandBox = q(".storelocator__sellingBrands", g);
      let brands = qa(".storelocator__sellingBrands > *", g).map(txt).filter(Boolean);
      if (!brands.length && brandBox) {
        brands = brandBox.textContent.split(/\s*\n\s*/).map((b) => b.trim()).filter(Boolean);
      }
      row(
        "garage",
        cell(name && p(name), street && p(street), zip && p(zip)),
        brands.length ? mk("ul", brands.map((b) => mk("li", b))) : "",
        cell(telP(phone, ".d-lg-inline", ".d-lg-none"), linkP(route))
      );
      return { name, street, tel: phone ? phone.getAttribute("href") : "" };
    });
    const modals = qa(".amag-garagenModal").map((m) => {
      const name = txt(q(".amag-garagenModal__title", m));
      const street = txt(q(".amag-garagenModal__street", m));
      const zip = txt(q(".amag-garagenModal__zip", m));
      const call = q("a.amag-garagenModal__callButton", m) || q('a[href^="tel:"]', m);
      const frame = q(".amag-rating__container iframe", m);
      const badge = frame ? abs(frame.getAttribute("src") || frame.getAttribute("data-src") || "") : "";
      const otv = q("a.amag-garagenModal__otvButton", m);
      const otvLabel = txt(otv);
      const cellsOut = [
        cell(txt(q(".amag-garagenModal__closeButton", m)) && p(txt(q(".amag-garagenModal__closeButton", m)))),
        cell(name && mk("h3", name), street && p(street), zip && p(zip)),
        cell(
          telP(call, ".d-md-inline", ".d-md-none"),
          linkP(q("a.amag-garagenModal__emailButton", m)),
          linkP(q("a.amag-garagenModal__routeButton", m)),
          linkP(q("a.amag-garagenModal__garagenDetailLink", m))
        ),
        badge && !/^(data|about):/i.test(badge) ? p(link(badge, badge)) : "",
        otv && otvLabel && otv.getAttribute("href") ? p(mk("strong", link(otv.getAttribute("href"), otvLabel))) : ""
      ];
      return { name, street, tel: call ? call.getAttribute("href") : "", cells: cellsOut, used: false };
    });
    const take = (pred) => {
      const hit = modals.find((m) => !m.used && pred(m));
      if (hit) hit.used = true;
      return hit;
    };
    const ordered = garages.map((g) => take((m) => norm(m.name) === norm(g.name) && norm(m.street) === norm(g.street)) || take((m) => norm(m.name) === norm(g.name) && m.tel && m.tel === g.tel) || take((m) => norm(m.name) === norm(g.name)));
    garages.forEach((g, i) => {
      if (!ordered[i]) ordered[i] = take(() => true);
    });
    ordered.filter(Boolean).concat(modals.filter((m) => !m.used)).forEach((m) => {
      m.used = true;
      row("details", ...m.cells);
    });
    const headline = textWithout(q(".amag-filterModal__headline"), ".storelocator__filterCounter");
    const resetBtn = q(".amag-filterModal__resetButton");
    const resetLabel = txt(resetBtn);
    const resetImg = resetBtn ? toImg(q("img", resetBtn)) : null;
    if (headline || resetLabel) {
      row(
        "filters-head",
        headline ? mk("h4", headline) : "",
        resetLabel ? p(resetImg, resetImg ? ` ${resetLabel}` : resetLabel) : ""
      );
    }
    const typeHead = txt(q(".amag-filterModal__selectionHeadline"));
    const typeLabels = qa(".amag-filterModal__filter-selection-button").map(txt).filter(Boolean).slice(0, 2);
    if (typeHead) row("filters-type", p(typeHead), ...typeLabels.length ? [cell(...typeLabels.map((t) => p(t)))] : []);
    const brandList = (sel) => {
      const items = qa(`${sel} li`).map((li) => {
        const label = txt(li);
        if (!label) return null;
        const icon = toImg(q("img", li));
        return mk("li", icon, icon ? ` ${label}` : label);
      }).filter(Boolean);
      return items.length ? mk("ul", items) : "";
    };
    const brandsHead = txt(q(".amag-filterModal__brandsHeadline"));
    const sales = brandList(".amag-filterModal__brandsCheckboxes.sales");
    const service = brandList(".amag-filterModal__brandsCheckboxes.service");
    if (brandsHead || sales || service) row("filters-brands", brandsHead ? p(brandsHead) : "", sales, service);
    const offerHead = txt(q(".amag-filterModal__saleHeadline"));
    const offers = qa(".amag-filterModal__saleListItem").map(txt).filter(Boolean);
    if (offerHead || offers.length) {
      row("filters-offers", offerHead ? p(offerHead) : "", offers.length ? mk("ul", offers.map((o) => mk("li", o))) : "");
    }
    const confirm = q(".off-canvas__confirm-button");
    const counter = txt(q(".amag-filterModal__garagenCounter", confirm || element));
    const confirmLabel = textWithout(confirm, ".amag-filterModal__garagenCounter");
    const cancel = qa(".off-canvas__cancel-button").map(txt).find(Boolean) || "";
    if (counter || confirmLabel || cancel) {
      row("filters-footer", cell(counter && p(counter), confirmLabel && p(confirmLabel)), cancel ? p(cancel) : "");
    }
    const pill = q(".amag-direct-entry") || doc.querySelector(".amag-direct-entry");
    if (pill) {
      const topline = txt(q(".amag-direct-entry__pop-up-topline", pill));
      let entries = qa("a.amag-direct-entry__pop-up-element[href]", pill);
      if (!entries.length) entries = qa(".amag-direct-entry__pop-up a[href]", pill);
      const links = entries.map((a) => {
        const label = txt(q(".amag-direct-entry__link", a) || a);
        if (!label) return null;
        return p(toImg(q("img.amag-direct-entry__pop-up-icon", a) || q("img", a)), link(a.getAttribute("href"), label));
      }).filter(Boolean);
      const faces = [".amag-direct-entry__button--open", ".amag-direct-entry__button--close"].map((sel) => {
        const face = q(sel, pill);
        const label = txt(face && (q(".amag-direct-entry__label", face) || face));
        return label ? p(toImg(q("img", face)), label) : null;
      });
      if (topline || links.length) row("quick-links", topline ? p(topline) : "", cell(links), cell(faces));
      pill.remove();
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Dealer Search", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/amag-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  var ORIGIN2 = "https://www.amag.ch";
  function absolutize(url) {
    if (!url) return url;
    const u = url.trim();
    if (!u || u.startsWith("data:") || u.startsWith("blob:") || /^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    if (u.startsWith("//")) return `https:${u}`;
    try {
      return new URL(u, `${ORIGIN2}/`).href;
    } catch (e) {
      return u;
    }
  }
  var HOME_BEFORE = [
    // Floating "Direkt zu" pill: <div class="amag-direct-entry"> (a block on the garage template,
    // non-authorable chrome on home)
    ".amag-content > .amag-direct-entry",
    ".amag-direct-entry",
    // Stage carousel chrome no parser consumes. The slides (.cmp-carousel__item) and the quick links
    // (.amagCh-stageCarousel__buttons--noPadding) stay for the hero-carousel / quick-links parsers.
    // <div class="cmp-carousel__actions"> (prev / next / pause / play buttons)
    ".amagCh-stageCarousel .cmp-carousel__actions",
    // the indicator list (.cmp-carousel__indicator-container) stays: the hero-carousel parser reads
    // each slide's indicator label from it (cell 4); HOME_AFTER removes any leftover
    // Video slide progress bar + empty backdrops:
    // <div class="amag-stageTeaserVideo__progressbar">, <div class="amag-stageTeaserVideo__videoBackdrop">,
    // <div class="amag-stageTeaserImage__imageBackdrop">
    ".amagCh-stageCarousel .amag-stageTeaserVideo__progressbar",
    ".amagCh-stageCarousel .amag-stageTeaserVideo__videoBackdrop",
    ".amagCh-stageCarousel .amag-stageTeaserImage__imageBackdrop",
    // "Accept cookies to watch the video" banner in the stage video slides:
    // <div class="cookie-video-banner__container"> (sibling of .amag-stageTeaserVideo__player,
    // which is kept)
    ".amagCh-stageCarousel .cookie-video-banner__container",
    // AMAG Bot chat iframe wrapper: <div class="frontnow-advisor-container frontnow-hidden">
    ".frontnow-advisor-container"
  ];
  var HOME_AFTER = [
    // Global footer: <footer> (contains the hr.amag-hrBreak separators, which would otherwise
    // become section breaks)
    "footer",
    ".amag-footer",
    ".amag-direct-entry",
    // Header pop-up notification (lives in #header; leftovers only):
    // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
    ".amag-pop-up",
    ".amag-pop-up__wrapper-before",
    ".frontnow-advisor-container",
    ".frontnow__backdrop",
    // Leftover carousel controls (any carousel, after the parsers ran)
    ".cmp-carousel__actions",
    ".cmp-carousel__indicator-container",
    // Video cookie-consent overlays left after parsing: <div class="cookie-video-overlay__container">
    // (.amag-videoComp) and <div class="cookie-video-banner__container"> (stage slides)
    ".cookie-video-overlay__container",
    ".cookie-video-banner__container",
    // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
    // the template's content fragment, so the generic 'script' removal cannot reach it)
    "template"
  ];
  var STORELOCATOR_BEFORE = [
    // AMAG chat bot wrapper: <div class="frontnow-advisor-container frontnow-hidden"> (not in the
    // capture, injected at runtime; launcher/popover/backdrop are in the shared list)
    ".frontnow-advisor-container"
  ];
  var STORELOCATOR_AFTER = [
    // Global footer: <footer> as a direct body child (no id/class; contains the
    // hr.amag-hrBreak separators, which would otherwise become section breaks).
    // `.amag-footer` = <div class="container-fluid amag-footer pl-0 pr-0"> inside it (fallback).
    "body > footer",
    ".amag-footer",
    "hr.amag-hrBreak",
    // Header pop-up notification (lives in <header id="header">; leftovers only):
    // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
    ".amag-pop-up",
    ".amag-pop-up__wrapper-before",
    ".frontnow-advisor-container",
    ".frontnow__backdrop",
    // Empty select2 dropdown containers (leftovers): <div class="select2-single-container">,
    // <div class="select2-multi-container">
    ".select2-single-container",
    ".select2-multi-container",
    // Empty infrastructure info div: <div id="amag-infrastructure-info">
    "#amag-infrastructure-info",
    // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
    // the template's content fragment, so the generic 'script' removal cannot reach it)
    "template"
  ];
  var SERVICE_BEFORE = [
    // Global header (already migrated as /de/nav; contains the header pop-up
    // .amag-pop-up__wrapper--desktop|--mobile): <header id="header"> as a direct body child
    "body > header#header",
    // Global footer (already migrated as /de/footer): <footer> as a direct body child (no id/class),
    // incl. its three <hr class="amag-hrBreak w-100"> separators, which would otherwise become
    // section breaks
    "body > footer",
    // AMAG chat bot wrapper: <div class="frontnow-advisor-container frontnow-hidden"> (not in the
    // capture, injected at runtime; launcher/popover/backdrop are in the shared list)
    ".frontnow-advisor-container",
    // Hero duplicate 1 — the 100-garage picker modal inside the hero CTA (each entry links to
    // /de/service/otv.html#<id>): <div id="garageModal-…" class="amag-garageOverlay modal fade">
    // inside <div class="amag-introService__otvCta d-flex">. The contact band's copy (garage-chooser
    // block) lives in .amag-kontaktaufnahme and is NOT matched by this selector.
    ".amag-introService .amag-garageOverlay",
    // Hero duplicate 2 — cookie variant of the hero CTA ("IHRE GEMERKTE GARAGE -- Ändern" +
    // "Termin vereinbaren"): <div class="amag-otvCtaWrapper--cookie d-none">. The sibling
    // <div class="amag-otvCtaWrapper--noCookie"> (single "Termin vereinbaren") is kept.
    ".amag-introService .amag-otvCtaWrapper--cookie",
    // Video cookie-consent overlay ("Es gibt viel zu sehen! … Cookie-Richtlinien"):
    // <div class="cookie-video-overlay__container"> in .amag-videoComp__playerContainer. The
    // video-brand-film parser drops it anyway and reads only [data-vi16_9_url] / iframes; removing
    // it up front keeps its text out of the output if the parser unwraps a URL-less instance.
    ".amag-videoComp .cookie-video-overlay__container",
    ".amag-videoComp .cookie-video-banner__container",
    // Cookie variant of the contact band's button ("Garage kontaktieren", no modal):
    // <div class="amag-garageOverlay--cookie d-none"> in .amag-kontaktaufnahme .amag-garageElectionOverlay
    // (the --noCookie sibling holding the garage-chooser modal is kept)
    ".amag-kontaktaufnahme .amag-garageOverlay--cookie"
  ];
  var SERVICE_AFTER = [
    // Leftovers in case the before-hook missed them (see SERVICE_BEFORE)
    "body > header",
    "body > footer",
    ".amag-footer",
    // Header pop-up notification (lives in <header id="header">; leftovers only):
    // <div class="amag-pop-up amag-pop-up__wrapper--desktop|--mobile">, <div class="amag-pop-up__wrapper-before">
    ".amag-pop-up",
    ".amag-pop-up__wrapper-before",
    ".frontnow-advisor-container",
    ".frontnow__backdrop",
    ".cookie-video-overlay__container",
    ".cookie-video-banner__container",
    // Empty select2 dropdown containers at body level: <div class="select2-single-container">,
    // <div class="select2-multi-container">
    ".select2-single-container",
    ".select2-multi-container",
    // Empty infrastructure info div: <div id="amag-infrastructure-info">
    "#amag-infrastructure-info",
    // Clientlib loader: <template id="amagch-clientlib"><script …></template> (the <script> sits in
    // the template's content fragment, so the generic 'script' removal cannot reach it)
    "template"
  ];
  var STORELOCATOR_KEEP_BEFORE = [".amag-rating__container"];
  function transform(hookName, element, payload) {
    const isHome = !!(payload && payload.template && payload.template.name === "home");
    const isStorelocator = !!(payload && payload.template && payload.template.name === "storelocator");
    const isService = !!(payload && payload.template && payload.template.name === "service");
    if (hookName === H.before && isHome) {
      WebImporter.DOMUtils.remove(element, HOME_BEFORE);
    }
    if (hookName === H.after && isHome) {
      WebImporter.DOMUtils.remove(element, HOME_AFTER);
    }
    if (hookName === H.before && isStorelocator) {
      WebImporter.DOMUtils.remove(element, STORELOCATOR_BEFORE);
    }
    if (hookName === H.after && isStorelocator) {
      WebImporter.DOMUtils.remove(element, STORELOCATOR_AFTER);
    }
    if (hookName === H.before && isService) {
      WebImporter.DOMUtils.remove(element, SERVICE_BEFORE);
    }
    if (hookName === H.after && isService) {
      WebImporter.DOMUtils.remove(element, SERVICE_AFTER);
    }
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        // OneTrust cookie consent: <div id="onetrust-consent-sdk"> (banner, preference center, iframe)
        "#onetrust-consent-sdk",
        // AMAG chat bot (frontnow advisor): <button id="frontnow-advisor-launcher">,
        // <div class="frontnow__backdrop">, <div id="frontnow-advisor-popover">
        "#frontnow-advisor-launcher",
        ".frontnow__backdrop",
        "#frontnow-advisor-popover",
        // Share-toast: <div class="toast success-toast share-toast">
        ".share-toast",
        // Empty select2 dropdown containers at body level:
        // <div class="select2-single-container">, <div class="select2-multi-container">
        ".select2-single-container",
        ".select2-multi-container",
        // Pop-up helper: <span class="amag-pop-up__check-element"> (inside .amag-content)
        "span.amag-pop-up__check-element",
        // Share button in the intro breadcrumb row: <div class="amag-share-wrapper">
        // (incl. its .amag-share-button__dropdown-menu)
        ".amag-share-wrapper",
        // Google rating badge iframe (tool.webbosaurus.de): <div class="amag-rating__container ...">
        ".amag-rating__container",
        // Empty infrastructure info div: <div id="amag-infrastructure-info">
        "#amag-infrastructure-info"
      ].filter((sel) => !(isStorelocator && STORELOCATOR_KEEP_BEFORE.includes(sel))));
      element.querySelectorAll(".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) section.section .amag-iconListContainer").forEach((list) => {
        if (list.querySelector(".amag-iconListItem, .amag-iconLabel")) return;
        const parent = list.parentElement;
        const hasRealSibling = parent && [...parent.children].some(
          (sib) => sib !== list && sib.classList.contains("amag-iconListContainer") && sib.querySelector(".amag-iconListItem")
        );
        if (hasRealSibling) list.remove();
      });
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        // <header id="header">
        "#header",
        // <footer id="garageFooter" class="amag-garageFooter">
        "#garageFooter",
        // Leftovers in case a parser left them in place
        "#onetrust-consent-sdk",
        "#frontnow-advisor-launcher",
        "#frontnow-advisor-popover",
        ".amag-share-wrapper",
        ".amag-rating__container",
        "span.amag-pop-up__check-element",
        // Non-content elements
        "script",
        "style",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src) img.setAttribute("src", absolutize(src));
        const srcset = img.getAttribute("srcset");
        if (srcset) img.removeAttribute("srcset");
      });
      element.querySelectorAll("source").forEach((s) => s.remove());
    }
  }

  // tools/importer/transformers/amag-sections.js
  var SECTION_ATTR = "data-excat-section-id";
  var TAB_ATTR = "data-excat-tab";
  var TAB_FALLBACK = {
    3: "Fahrzeug-Angebote",
    4: "Fahrzeug-Angebote",
    5: "Fahrzeug-Angebote",
    6: "Fahrzeug-Angebote",
    7: "Fahrzeug-Angebote",
    8: "Fahrzeug-Angebote",
    9: "AMAG Dienstleistungen",
    10: "AMAG Dienstleistungen",
    11: "AMAG Dienstleistungen",
    12: "AMAG Dienstleistungen",
    13: "AMAG Dienstleistungen",
    14: "AMAG Dienstleistungen",
    15: "News & Infos",
    16: "News & Infos",
    17: "News & Infos",
    18: "News & Infos",
    19: "News & Infos"
  };
  function querySection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      let el = null;
      try {
        el = root.querySelector(sel);
      } catch (e) {
        el = null;
      }
      if (el) return el;
    }
    return null;
  }
  function tabLabelFor(sectionEl) {
    const panel = sectionEl.closest(".cmp-tabs__tabpanel");
    if (!panel || !panel.parentElement) return "";
    const tabs = panel.parentElement;
    const panels = [...tabs.children].filter((c) => c.classList.contains("cmp-tabs__tabpanel"));
    const idx = panels.indexOf(panel);
    const items = [...tabs.querySelectorAll(":scope > .amag-introTabModul__tablist > .amag-introTabModul__tab")];
    const li = items[idx];
    return li ? li.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isEmptyBetween(document2, root, start, end) {
    const range = document2.createRange();
    range.setStartAfter(start);
    if (end) range.setEndBefore(end);
    else range.setEnd(root, root.childNodes.length);
    const frag = range.cloneContents();
    if (frag.querySelector && frag.querySelector("img, picture, table, video, iframe, svg")) return false;
    return !frag.textContent.replace(/\s+/g, "").length;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    if (payload.template.name === "storelocator") return;
    const useTabs = payload.template.name === "garagenuebersicht";
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        hr.setAttribute(SECTION_ATTR, section.id);
        const tab = useTabs ? tabLabelFor(sectionEl) || TAB_FALLBACK[section.id] || "" : "";
        if (tab) hr.setAttribute(TAB_ATTR, tab);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      const markers = [...element.querySelectorAll(`hr[${SECTION_ATTR}]`)];
      for (let i = markers.length - 1; i >= 0; i -= 1) {
        if (isEmptyBetween(document, element, markers[i], markers[i + 1] || null)) {
          markers[i].remove();
          markers.splice(i, 1);
        }
      }
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const marker = element.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
        if (!marker) continue;
        const cells = {};
        if (section.style) cells.Style = section.style;
        const tab = useTabs ? marker.getAttribute(TAB_ATTR) : null;
        if (tab) cells.Tab = tab;
        if (Object.keys(cells).length) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells
          });
          marker.after(metadataBlock);
        }
        marker.removeAttribute(SECTION_ATTR);
        marker.removeAttribute(TAB_ATTR);
        if (i === 0) marker.remove();
      }
    }
  }

  // tools/importer/import-storelocator.js
  var parsers = {
    "dealer-search": parse
  };
  var PAGE_TEMPLATE = {
    "name": "storelocator",
    "description": "AMAG store locator / garage finder (dealer-search)",
    "urls": [
      "https://www.amag.ch/de/komponenten/storelocator.html"
    ],
    "blocks": [
      {
        "name": "dealer-search",
        "instances": [
          ".amag-content > .storelocator.storelocator-component"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Store locator (map + garage finder overlay)",
        "selector": [
          ".amag-content > .storelocator.storelocator-component",
          ".storelocator-component"
        ],
        "style": null,
        "blocks": [
          "dealer-search"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Direkt zu floating pill (dealer-search quick-links row)",
        "selector": [
          ".amag-content > .amag-direct-entry",
          ".amag-direct-entry"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_storelocator_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      const meta = {};
      const title = document2.querySelector("title");
      if (title) meta.Title = title.textContent.replace(/[\n\t]/gm, " ").replace(/\s+/g, " ").trim();
      const desc = document2.querySelector('meta[name="description"]');
      if (desc && desc.content) meta.Description = desc.content.trim();
      main.append(WebImporter.Blocks.getMetadataBlock(document2, meta));
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_storelocator_exports);
})();
