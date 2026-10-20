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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-carousel.js
  var txt = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var ORIGIN = "https://www.amag.ch";
  var abs = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN}/`).href;
    } catch (e) {
      return s;
    }
  };
  var mk = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function img(document2, src, alt) {
    if (!src) return null;
    const i = document2.createElement("img");
    i.setAttribute("src", abs(src));
    i.setAttribute("alt", (alt || "").trim());
    return i;
  }
  function srcsetUrls(srcset) {
    const out = [];
    const re = /(\S+)\s+\d+(?:\.\d+)?[wx]/g;
    let m;
    while (m = re.exec(srcset || "")) out.push(m[1].replace(/^,/, ""));
    if (!out.length && srcset && srcset.trim()) out.push(srcset.trim().split(/\s+/)[0]);
    return out;
  }
  function mobileSrc(picture) {
    if (!picture) return "";
    const sources = [...picture.querySelectorAll("source")];
    for (const s of sources) {
      const urls = srcsetUrls(s.getAttribute("srcset"));
      const portrait = urls.filter((u) => /:3_4/.test(u));
      if (portrait.length) return portrait.find((u) => /:3_4_Large/.test(u)) || portrait[0];
    }
    return "";
  }
  function parse(element, { document: document2 }) {
    const carousel = element.matches(".cmp-carousel") ? element : element.querySelector(".cmp-carousel") || element;
    let slides = [...carousel.querySelectorAll(":scope > .cmp-carousel__content > .cmp-carousel__item")];
    if (!slides.length) slides = [...carousel.querySelectorAll(".cmp-carousel__item")];
    const labels = [...carousel.querySelectorAll(".cmp-carousel__indicators > .cmp-carousel__indicator, li.cmp-carousel__indicator")].map(txt);
    const cells = [];
    slides.forEach((slide, i) => {
      const link2 = slide.querySelector("a[href]");
      const headline = txt(slide.querySelector(".amag-stageTeaserImage__headline, .amag-stageTeaserVideo__headline") || slide.querySelector("h1, h2, h3"));
      const linkText = txt(slide.querySelector(".amag-stageTeaserImage__linktext, .amag-stageTeaserVideo__linktext"));
      if (!headline && !linkText) return;
      const isVideo = !!slide.querySelector(".amag-stageTeaserVideo");
      let desktop = null;
      let mobile = null;
      if (!isVideo) {
        const picture = slide.querySelector("picture");
        const main = slide.querySelector("picture img, img.template-dynamic-image, img");
        if (main) desktop = img(document2, main.getAttribute("src") || main.getAttribute("data-src"), main.getAttribute("alt"));
        const m = mobileSrc(picture);
        if (m) mobile = img(document2, m, main ? main.getAttribute("alt") : "");
      }
      const text = [];
      if (headline) text.push(mk(document2, cells.length === 0 ? "h1" : "h2", headline));
      if (link2 && (linkText || headline)) {
        const a = mk(document2, "a", linkText || headline);
        a.setAttribute("href", link2.getAttribute("href"));
        text.push(mk(document2, "p", a));
      }
      const label = labels[i] || "";
      cells.push([
        desktop ? mk(document2, "p", desktop) : "",
        mobile ? mk(document2, "p", mobile) : "",
        text,
        label ? mk(document2, "p", label) : ""
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Hero Carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/known-icons.js
  var SITE = "https://main--aem-amag-demo--mtilburgadobe.aem.live";
  var ICONS = [
    // quick-links (home stage tiles); "Service" is also the garage "AMAG Dienstleistungen" tab
    ["M3.33268 20.6667C2.59802", "media_1e5b47e4c5369729e442e7c884572328dbd4c3009.svg"],
    // find vehicle
    ["M12.3721 20.5704L26.5468", "media_13075106cdb5998db5fc619d243596831d3793169.svg"],
    // services
    ["M0.667361 15.0935C0.480694", "media_13f525e9f80b18b2fdcff058a038eecc9b2f160d3.svg"],
    // find garage
    // pledge-row ("Unser AMAG Versprechen")
    ["M18.6667 29.3343C18.2987", "media_150a66f3aa18fabb53e311b00a83e9ae522f2ed64.svg"],
    // transparency
    ["M14.2,25.7c-0.7,0-1.4-0.3", "media_1ad60877610d215f75120b90dfaa76eba297948bb.svg"],
    // safety
    ["M12,25.3c-0.2,0-0.3-0.1", "media_12a664461dbcbebd2ddeea223391944b72ce7220c.svg"],
    // service
    // garage page: hero-split-garage actions, tabs-garage tabs
    ["M30.8779 38.7451C30.5196", "icons/icon-garage-save.svg"],
    // "Als meine Garage speichern"
    ["M25.3337 16.0003C23.3123", "icons/icon-garage-contact.svg"],
    // "Team kontaktieren"
    ["M5.22978 19.9776C4.49387", "icons/icon-garage-tab-vehicles.svg"],
    // "Fahrzeug-Angebote"
    ["M0.60957 15.0853C0.439068", "icons/icon-garage-tab-news.svg"]
    // "News & Infos"
  ];
  function knownIconSrc(svg) {
    const path = svg && svg.querySelector("path[d]");
    if (!path) return "";
    const d = path.getAttribute("d").replace(/\s+/g, " ").trim();
    const hit = ICONS.find(([sig]) => d.startsWith(sig));
    return hit ? `${SITE}/${hit[1]}` : "";
  }

  // tools/importer/parsers/quick-links.js
  var ORIGIN2 = "https://www.amag.ch";
  var txt2 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs2 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN2}/`).href;
    } catch (e) {
      return s;
    }
  };
  function svgDataUri(svg) {
    const known = knownIconSrc(svg);
    if (known) return known;
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg(node, document2) {
    if (!node) return null;
    let src = "";
    let alt = "";
    if (node.localName === "svg") src = svgDataUri(node);
    else {
      const img2 = node.localName === "img" ? node : node.querySelector("img");
      if (img2) {
        src = abs2(img2.getAttribute("src") || img2.getAttribute("data-src"));
        alt = img2.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", alt.trim());
    return out;
  }
  var mk2 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse2(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(".amag-stageCarousel__buttons > a.amag-stageCarousel__button")];
    if (!tiles.length) tiles = [...element.querySelectorAll(".amag-stageCarousel__button")];
    const cells = [];
    tiles.forEach((tile) => {
      const label = txt2(tile.querySelector(".amag-stageCarousel__buttonText")) || txt2(tile);
      const href = tile.getAttribute("href") || (tile.querySelector("a[href]") || { getAttribute: () => "" }).getAttribute("href");
      if (!label) return;
      const iconBox = tile.querySelector(".amag-stageCarousel__button_icon") || tile;
      const icon = toImg(iconBox.querySelector("svg, img"), document2);
      let labelNode = label;
      if (href) {
        labelNode = mk2(document2, "a", label);
        labelNode.setAttribute("href", href);
      }
      cells.push([icon ? mk2(document2, "p", icon) : "", mk2(document2, "p", labelNode)]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Quick Links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/vehicle-search.js
  var ORIGIN3 = "https://www.amag.ch";
  var txt3 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs3 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN3}/`).href;
    } catch (e) {
      return s;
    }
  };
  var mk3 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse3(element, { document: document2 }) {
    const cells = [];
    const head = [];
    const iconSrc = element.querySelector(".amag-dspSearch__icon img");
    if (iconSrc && iconSrc.getAttribute("src")) {
      const img2 = document2.createElement("img");
      img2.setAttribute("src", abs3(iconSrc.getAttribute("src")));
      img2.setAttribute("alt", (iconSrc.getAttribute("alt") || "").trim());
      head.push(mk3(document2, "p", img2));
    }
    const h = element.querySelector(".amag-dspSearch__headline h2, .amag-dspSearch__headline h1, .amag-dspSearch__headline h3, h2");
    if (h) head.push(mk3(document2, "h2", txt3(h)));
    element.querySelectorAll(".amag-dspSearch__introText p").forEach((p) => {
      if (txt3(p)) head.push(mk3(document2, "p", txt3(p)));
    });
    if (head.length) cells.push([head]);
    let wrappers = [...element.querySelectorAll(".amag-dspSearch__filter .select2-wrapper")];
    if (!wrappers.length) wrappers = [...element.querySelectorAll("select")].map((s) => s.parentElement);
    wrappers.forEach((w) => {
      const select = w.querySelector("select");
      const label = txt3(w.querySelector("label"));
      if (!select) return;
      const options = [...select.querySelectorAll("option")].map((o) => txt3(o)).filter(Boolean);
      if (!options.length) return;
      const ul = mk3(document2, "ul", options.map((o) => mk3(document2, "li", o)));
      cells.push([mk3(document2, "p", label), ul]);
    });
    const cta = element.querySelector(".amag-dspSearch__searchButton a[href]");
    if (cta && txt3(cta)) {
      const a = mk3(document2, "a", txt3(cta));
      a.setAttribute("href", cta.getAttribute("href"));
      cells.push([mk3(document2, "p", mk3(document2, "em", a))]);
    }
    if (!h && cells.length < 2) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Vehicle Search", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/news-cards.js
  var ORIGIN4 = "https://www.amag.ch";
  var txt4 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs4 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN4}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg2(img2, document2) {
    if (!img2) return null;
    const src = abs4(img2.getAttribute("src") || img2.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img2.getAttribute("alt") || "").trim());
    return out;
  }
  var mk4 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var COLOURS = {
    "#006431": "green",
    "#222222": "dark-grey",
    "#801977": "violet",
    "#009ee0": "light-blue",
    "#172983": "dark-blue",
    "#000000": "black"
  };
  function toHex(value) {
    if (!value) return "";
    const v = value.trim().toLowerCase();
    let m = v.match(/^#([0-9a-f]{3})$/);
    if (m) return `#${m[1].split("").map((c) => c + c).join("")}`;
    m = v.match(/^#([0-9a-f]{6})$/);
    if (m) return v;
    m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) return `#${[m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, "0")).join("")}`;
    return "";
  }
  function colourOf(card) {
    const ground = card.querySelector(".amag-promotionTeaser__wrapper") || card;
    const raw = ground.style && ground.style.backgroundColor || "";
    const fromAttr = ((ground.getAttribute("style") || "").match(/background(?:-color)?\s*:\s*([^;]+)/i) || [])[1];
    return COLOURS[toHex(raw)] || COLOURS[toHex(fromAttr)] || "";
  }
  function isTeaserCarousel(element) {
    return !element.querySelector(".amag-promotionTeaser") && (element.matches(".cmp-carousel") || !!element.querySelector(".cmp-carousel")) && !!element.querySelector(".amag-contentTeaserS");
  }
  function parseCarousel(element, document2) {
    const carousel = element.matches(".cmp-carousel") ? element : element.querySelector(".cmp-carousel");
    const head = [];
    const h4 = carousel.querySelector(".amagCh-carousel-description__headline");
    if (h4 && txt4(h4)) head.push(mk4(document2, "h4", txt4(h4)));
    let items = [...carousel.querySelectorAll(".cmp-carousel__items > .cmp-carousel__item")];
    if (!items.length) items = [...carousel.querySelectorAll(".cmp-carousel__item")];
    const cells = [];
    items.forEach((item) => {
      const card = item.querySelector(".amag-contentTeaserS") || item;
      const title = txt4(card.querySelector(".amag-contentTeaserS__headline, h3"));
      const copy = txt4(card.querySelector(".amag-contentTeaserS__text"));
      const link2 = card.querySelector(".amag-contentTeaserS__link a[href]") || card.querySelector("a[href]");
      const cell = [];
      if (title) cell.push(mk4(document2, "h3", title));
      if (copy) cell.push(mk4(document2, "p", copy));
      if (link2 && txt4(link2)) {
        const a = mk4(document2, "a", txt4(link2));
        a.setAttribute("href", link2.getAttribute("href"));
        cell.push(mk4(document2, "p", a));
      }
      if (!title && !copy) return;
      cells.push([cell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const isEarlierCarousel = (s) => s.classList.contains("amagCh-carousel") || s.matches(".cmp-carousel") && !!s.querySelector(".amag-contentTeaserS") || s.localName === "table" && /^News Cards \(carousel/i.test(txt4(s.querySelector("tr")));
    const anchor = element.closest(".amagCh-carousel") || element;
    let first = true;
    for (let s = anchor.previousElementSibling; s; s = s.previousElementSibling) {
      if (isEarlierCarousel(s)) {
        first = false;
        break;
      }
    }
    const name = first ? "News Cards (carousel, no-band)" : "News Cards (carousel)";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }
  function parse4(element, { document: document2 }) {
    if (isTeaserCarousel(element)) {
      parseCarousel(element, document2);
      return;
    }
    const head = [];
    const topline = element.querySelector(".amag-promotionTeaserBox__topline");
    const headline = element.querySelector(".amag-promotionTeaserBox__headline");
    if (topline && txt4(topline)) head.push(mk4(document2, "p", txt4(topline)));
    if (headline && txt4(headline)) head.push(mk4(document2, "h2", txt4(headline)));
    let cards = [...element.querySelectorAll(".amag-promotionTeaserBox__content > .amag-promotionTeaser")];
    if (!cards.length) cards = [...element.querySelectorAll("div.amag-promotionTeaser")];
    const cells = [];
    cards.forEach((card) => {
      const link2 = card.querySelector("a[href]");
      const imgCell = [];
      const image = toImg2(card.querySelector(".amag-promotionTeaser__image, .amag-promotionTeaser__imageWrapper img"), document2);
      if (image) imgCell.push(mk4(document2, "p", image));
      const badge = toImg2(card.querySelector(".amag-promotionTeaser__amagLogoImage"), document2);
      if (badge) imgCell.push(mk4(document2, "p", badge));
      const textCell = [];
      const top = txt4(card.querySelector(".amag-promotionTeaser__topline"));
      const title = txt4(card.querySelector(".amag-promotionTeaser__text, h3"));
      const copy = txt4(card.querySelector(".amag-promotionTeaser__copytext"));
      const label = txt4(card.querySelector(".amag-promotionTeaser__button"));
      if (top) textCell.push(mk4(document2, "p", top));
      if (title) textCell.push(mk4(document2, "h3", title));
      if (copy) textCell.push(mk4(document2, "p", copy));
      if (link2) {
        const a = mk4(document2, "a", label || title);
        a.setAttribute("href", link2.getAttribute("href"));
        textCell.push(mk4(document2, "p", a));
      }
      if (!title && !image) return;
      const colour = colourOf(card);
      cells.push([imgCell.length ? imgCell : "", textCell, colour ? mk4(document2, "p", colour) : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const more = txt4(element.querySelector(".amag-promotionTeaserBox__showMoreBtn"));
    if (more) cells.push([mk4(document2, "p", more)]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "News Cards", cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/icon-feature-grid.js
  var ORIGIN5 = "https://www.amag.ch";
  var txt5 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs5 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN5}/`).href;
    } catch (e) {
      return s;
    }
  };
  function svgDataUri2(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg3(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri2(node);
    else {
      const img2 = node.localName === "img" ? node : node.querySelector("img");
      if (img2) {
        src = abs5(img2.getAttribute("src") || img2.getAttribute("data-src"));
        if (a == null) a = img2.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri2(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk5 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse5(element, { document: document2 }) {
    const cells = [];
    const band = toImg3(element.querySelector(".amag-serviceContainerWrapper__image img"), document2);
    if (band) cells.push([mk5(document2, "p", band)]);
    let boxes = [...element.querySelectorAll(".amag-serviceContainerWrapper__serviceBox .amag-serviceBoxWrapper")];
    if (!boxes.length) boxes = [...element.querySelectorAll(".amag-serviceBoxWrapper")];
    boxes.forEach((box) => {
      const icon = toImg3(box.querySelector(".amag-serviceBoxWrapper__content--image, img, svg"), document2);
      const title = txt5(box.querySelector(".amag-serviceBoxWrapper__content--headline"));
      const lines = [...box.querySelectorAll(".amag-serviceBoxWrapper__content--textarea p")].map(txt5).filter(Boolean);
      const linkSrc = box.querySelector(".amag-serviceBoxWrapper__content--link a[href]");
      const text = [];
      if (title) text.push(mk5(document2, "p", mk5(document2, "strong", title)));
      lines.forEach((l) => text.push(mk5(document2, "p", l)));
      if (linkSrc && txt5(linkSrc)) {
        const a = mk5(document2, "a", txt5(linkSrc));
        a.setAttribute("href", linkSrc.getAttribute("href"));
        text.push(mk5(document2, "p", a));
      }
      if (!text.length) return;
      cells.push([icon ? mk5(document2, "p", icon) : "", text]);
    });
    const ctaSrc = element.querySelector(".amag-serviceContainerWrapper__ctaButton a[href]");
    if (ctaSrc && txt5(ctaSrc)) {
      const a = mk5(document2, "a", toImg3(ctaSrc.querySelector("img, svg"), document2, ""), txt5(ctaSrc));
      a.setAttribute("href", ctaSrc.getAttribute("href"));
      cells.push([mk5(document2, "p", mk5(document2, "strong", a))]);
    }
    if (!boxes.length && !band) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Icon Feature Grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/news-cards-articles.js
  var ORIGIN6 = "https://www.amag.ch";
  var txt6 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs6 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN6}/`).href;
    } catch (e) {
      return s;
    }
  };
  var mk6 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var link = (document2, href, label) => {
    const a = mk6(document2, "a", label);
    a.setAttribute("href", href);
    return a;
  };
  function parse6(element, { document: document2 }) {
    const articles = [...element.querySelectorAll("article.amag-newsTeaser-element")];
    const cells = [];
    articles.forEach((art) => {
      const date = txt6(art.querySelector(".amag-newsTeaser-element__info-date"));
      const headline = art.querySelector(".amag-newsTeaser-element__info-headline");
      const title = txt6(headline);
      const titleHref = headline && headline.querySelector("a[href]") ? headline.querySelector("a[href]").getAttribute("href") : "";
      const more = art.querySelector(".amag-newsTeaser-element__info-link[href], .amag-newsTeaser-element__info-link-wrapper a[href]");
      if (!title) return;
      const imgSrc = art.querySelector(".amag-newsTeaser-element__image img");
      let image = "";
      if (imgSrc && (imgSrc.getAttribute("src") || imgSrc.getAttribute("data-src"))) {
        const i = document2.createElement("img");
        i.setAttribute("src", abs6(imgSrc.getAttribute("src") || imgSrc.getAttribute("data-src")));
        i.setAttribute("alt", (imgSrc.getAttribute("alt") || "").trim());
        image = mk6(document2, "p", i);
      }
      const text = [];
      if (date) text.push(mk6(document2, "p", date));
      const href = titleHref || (more ? more.getAttribute("href") : "");
      text.push(mk6(document2, "h4", href ? link(document2, href, title) : title));
      if (more && txt6(more)) text.push(mk6(document2, "p", link(document2, more.getAttribute("href"), txt6(more))));
      cells.push([image, text]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const showMore = txt6(element.querySelector(".amag-newsTeaser__showMore-button--showNews"));
    if (showMore) cells.push([mk6(document2, "p", showMore)]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "News Cards Articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/newsletter-band.js
  var ORIGIN7 = "https://www.amag.ch";
  var txt7 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs7 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN7}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg4(img2, document2, alt) {
    if (!img2) return null;
    const src = abs7(img2.getAttribute("src") || img2.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (alt != null ? alt : img2.getAttribute("alt") || "").trim());
    return out;
  }
  var mk7 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function isSecondary(btn) {
    const cls = btn.getAttribute("class") || "";
    const colour = `${btn.getAttribute("data-btn-color") || ""} ${btn.getAttribute("style") || ""}`.toLowerCase();
    return /bgColor-amagViolet/i.test(cls) || colour.includes("#801977") || colour.includes("128, 25, 119");
  }
  function parse7(element, { document: document2 }) {
    const cells = [];
    const band = toImg4(element.querySelector(".amag-divider__background img"), document2);
    if (band) cells.push([mk7(document2, "p", band)]);
    const box = element.querySelector(".amag-divider__contentBox") || element;
    const content = [];
    const topline = txt7(box.querySelector(".amag-divider__topline"));
    const headline = txt7(box.querySelector(".amag-divider__headline"));
    if (topline) content.push(mk7(document2, "p", topline));
    if (headline) content.push(mk7(document2, "h3", headline));
    box.querySelectorAll(".amag-divider__copytext").forEach((p) => {
      if (txt7(p)) content.push(mk7(document2, "p", txt7(p)));
    });
    const btn = box.querySelector(".amag-divider__ctaButton a[href]");
    if (btn && txt7(btn)) {
      const a = mk7(document2, "a", toImg4(btn.querySelector("img"), document2, ""), txt7(btn));
      a.setAttribute("href", btn.getAttribute("href"));
      content.push(mk7(document2, "p", mk7(document2, isSecondary(btn) ? "em" : "strong", a)));
    }
    if (!headline && !content.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "Newsletter Band", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-brand-film.js
  var txt8 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk8 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var VIDEO_TITLES = {
    896519713: "Startseiten Imagevideo DE"
  };
  function videoUrl(element) {
    const player = element.querySelector("[data-vi16_9_url]");
    if (player && player.getAttribute("data-vi16_9_url")) return player.getAttribute("data-vi16_9_url").trim();
    const frame = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtu"], iframe[data-src]');
    const src = frame ? frame.getAttribute("src") || frame.getAttribute("data-src") || "" : "";
    const m = src.match(/player\.vimeo\.com\/video\/(\d+)/);
    if (m) return `https://vimeo.com/${m[1]}`;
    return src.trim();
  }
  function parse8(element, { document: document2 }) {
    const url = videoUrl(element);
    if (!url) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const head = [];
    const h = element.querySelector(".amag-videoComp__headline");
    if (h && txt8(h)) head.push(mk8(document2, h.localName && /^h[2-6]$/.test(h.localName) ? h.localName : "h4", txt8(h)));
    const id = (url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
    const frame = element.querySelector("iframe[title]");
    const title = frame && frame.getAttribute("title").trim() || id && VIDEO_TITLES[id] || "";
    const a = mk8(document2, "a", url);
    a.setAttribute("href", url);
    const cell = [mk8(document2, "p", a)];
    if (title) cell.push(mk8(document2, "p", title));
    const block = WebImporter.Blocks.createBlock(document2, { name: "Video Brand Film", cells: [[cell]] });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/testimonial.js
  var txt9 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk9 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse9(element, { document: document2 }) {
    const item = element.querySelector(".cmp-carousel__item--active .amag-quoteModul") || element.querySelector(".amag-quoteModul") || element;
    const quote = txt9(item.querySelector(".amag-quoteModul__qoute, .amag-quoteModul__quote, blockquote")).replace(/^[„“"«»]+|[“”"«»]+$/g, "").trim();
    const author = txt9(item.querySelector(".amag-quoteModul__author"));
    const customer = txt9(item.querySelector(".amag-quoteModul__customerBy"));
    if (!quote) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell = [mk9(document2, "p", quote)];
    if (author) cell.push(mk9(document2, "p", author));
    if (customer) cell.push(mk9(document2, "p", customer));
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "Testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/pledge-row.js
  var ORIGIN8 = "https://www.amag.ch";
  var txt10 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs8 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN8}/`).href;
    } catch (e) {
      return s;
    }
  };
  function svgDataUri3(svg) {
    const known = knownIconSrc(svg);
    if (known) return known;
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg5(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri3(node);
    else {
      const img2 = node.localName === "img" ? node : node.querySelector("img");
      if (img2) {
        src = abs8(img2.getAttribute("src") || img2.getAttribute("data-src"));
        if (a == null) a = img2.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri3(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk10 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse10(element, { document: document2 }) {
    const isPledgeList = element.classList.contains("amag-iconListContainer") || !!element.querySelector(".amag-iconListContainer__headline");
    const head = [];
    const h2 = element.querySelector(".amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3");
    if (h2 && txt10(h2)) head.push(mk10(document2, "h2", txt10(h2)));
    const items = [...element.querySelectorAll(".amag-iconListItem")];
    const cells = [];
    items.forEach((item) => {
      const iconBox = item.querySelector(".amag-iconListItem__iconBox") || item;
      const icon = toImg5(iconBox.querySelector("img, svg"), document2, "");
      const title = txt10(item.querySelector(".amag-iconListItem__title"));
      let lines = [...item.querySelectorAll(".amag-iconListItem__text li")].map(txt10).filter(Boolean);
      if (!lines.length) lines = [...item.querySelectorAll(".amag-iconListItem__text p")].map(txt10).filter(Boolean);
      if (!title && !lines.length) return;
      const text = [];
      if (title) text.push(mk10(document2, "p", mk10(document2, "strong", title)));
      if (lines.length) text.push(mk10(document2, "ul", lines.map((l) => mk10(document2, "li", l))));
      cells.push([icon ? mk10(document2, "p", icon) : "", text]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const name = isPledgeList ? "Pledge Row (plain-head)" : "Pledge Row";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  var txt11 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk11 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var KEEP = /* @__PURE__ */ new Set(["a", "strong", "b", "em", "i", "u", "br", "sup", "sub", "li", "ul", "ol", "p"]);
  function clean(node, document2) {
    if (node.nodeType === 3) return document2.createTextNode(node.textContent);
    if (node.nodeType !== 1) return null;
    const tag = node.localName;
    const kids = [...node.childNodes].map((c) => clean(c, document2)).filter(Boolean);
    if (!KEEP.has(tag)) return kids.length ? kids : null;
    const out = document2.createElement(tag === "b" ? "strong" : tag === "i" ? "em" : tag);
    if (tag === "a" && node.getAttribute("href")) out.setAttribute("href", node.getAttribute("href"));
    kids.flat().forEach((k) => out.append(k));
    return out;
  }
  function parse11(element, { document: document2 }) {
    const head = [];
    const h2 = element.querySelector(".cmp-accordion__intro .cmp-accordion__headline, .cmp-accordion__headline");
    if (h2 && txt11(h2)) head.push(mk11(document2, "h2", txt11(h2)));
    element.querySelectorAll(".cmp-accordion__intro .cmp-accordion__introText, :scope > .cmp-accordion__introText").forEach((p) => {
      if (txt11(p)) head.push(mk11(document2, "p", txt11(p)));
    });
    const cells = [];
    element.querySelectorAll(".cmp-accordion__item").forEach((item) => {
      const q = txt11(item.querySelector(".cmp-accordion__title") || item.querySelector(".cmp-accordion__button"));
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!q || !panel) return;
      const source = panel.querySelector(".cmp-teaser__description") || panel;
      const blocks = [...source.querySelectorAll("p, ul, ol")].filter((n) => !n.parentElement.closest("p, ul, ol") || !source.contains(n.parentElement.closest("p, ul, ol")));
      const answer = [];
      blocks.forEach((n) => {
        if (!txt11(n)) return;
        const c = clean(n, document2);
        if (c) answer.push(c);
      });
      if (!answer.length && txt11(source)) answer.push(mk11(document2, "p", txt11(source)));
      cells.push([mk11(document2, "h3", q), answer.length ? answer : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Accordion Faq", cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/transformers/amag-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  var ORIGIN9 = "https://www.amag.ch";
  function absolutize(url) {
    if (!url) return url;
    const u = url.trim();
    if (!u || u.startsWith("data:") || u.startsWith("blob:") || /^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    if (u.startsWith("//")) return `https:${u}`;
    try {
      return new URL(u, `${ORIGIN9}/`).href;
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
  var STORELOCATOR_KEEP_BEFORE = [".amag-rating__container"];
  function transform(hookName, element, payload) {
    const isHome = !!(payload && payload.template && payload.template.name === "home");
    const isStorelocator = !!(payload && payload.template && payload.template.name === "storelocator");
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
      element.querySelectorAll("img").forEach((img2) => {
        const src = img2.getAttribute("src");
        if (src) img2.setAttribute("src", absolutize(src));
        const srcset = img2.getAttribute("srcset");
        if (srcset) img2.removeAttribute("srcset");
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

  // tools/importer/import-home.js
  var parsers = {
    "hero-carousel": parse,
    "quick-links": parse2,
    "vehicle-search": parse3,
    "news-cards": parse4,
    "icon-feature-grid": parse5,
    "news-cards-articles": parse6,
    "newsletter-band": parse7,
    "video-brand-film": parse8,
    "testimonial": parse9,
    "pledge-row": parse10,
    "accordion-faq": parse11
  };
  var PAGE_TEMPLATE = {
    "name": "home",
    "description": "AMAG home page: stage carousel + quick links, vehicle search, promo tiles, services grid, teaser carousels, news list, newsletter/jobs bands, brand film, testimonial, pledge row, SEO accordion",
    "urls": [
      "https://www.amag.ch/de.html"
    ],
    "blocks": [
      {
        "name": "hero-carousel",
        "instances": [
          ".amag-content > .amagCh-stageCarousel .cmp-carousel"
        ]
      },
      {
        "name": "quick-links",
        "instances": [
          ".amag-content > .amagCh-stageCarousel .amagCh-stageCarousel__buttons--noPadding"
        ]
      },
      {
        "name": "vehicle-search",
        "instances": [
          ".amag-dspSearch"
        ]
      },
      {
        "name": "news-cards",
        "instances": [
          ".amag-promotionTeaserBox",
          ".amag-content > section.section:has(.amag-contentTeaserS) .amagCh-carousel .cmp-carousel"
        ]
      },
      {
        "name": "icon-feature-grid",
        "instances": [
          ".amag-serviceContainerWrapper"
        ]
      },
      {
        "name": "news-cards-articles",
        "instances": [
          ".amag-newsTeaser"
        ]
      },
      {
        "name": "newsletter-band",
        "instances": [
          ".amag-content > .amag-divider"
        ]
      },
      {
        "name": "video-brand-film",
        "instances": [
          ".amag-videoComp"
        ]
      },
      {
        "name": "testimonial",
        "instances": [
          ".amag-quoteModul"
        ]
      },
      {
        "name": "pledge-row",
        "instances": [
          ".amag-iconListContainer:has(.amag-iconListItem)"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".cmp-accordion"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Stage carousel + quick links",
        "selector": [
          ".amag-content > .amagCh-stageCarousel"
        ],
        "style": null,
        "blocks": [
          "hero-carousel",
          "quick-links"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Vehicle search",
        "selector": [
          ".amag-content > section.section:has(.amag-dspSearch)"
        ],
        "style": null,
        "blocks": [
          "vehicle-search"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "AMAG NEWS \u2013 News und Angebote",
        "selector": [
          ".amag-content > section.section:has(.amag-promotionTeaserBox)"
        ],
        "style": null,
        "blocks": [
          "news-cards"
        ],
        "defaultContent": [
          ".amag-promotionTeaserBox__topline",
          ".amag-promotionTeaserBox__headline"
        ]
      },
      {
        "id": "section-4",
        "name": "Die gefragtesten AMAG Serviceleistungen",
        "selector": [
          ".amag-content > section.section:has(.amag-serviceContainerWrapper)"
        ],
        "style": null,
        "blocks": [
          "icon-feature-grid"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amagCh-section-description__subtext"
        ]
      },
      {
        "id": "section-5",
        "name": "Willkommen bei der AMAG \u2013 content teaser carousels",
        "selector": [
          ".amag-content > section.section:has(.amag-contentTeaserS)"
        ],
        "style": null,
        "blocks": [
          "news-cards"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amagCh-carousel-description__headline"
        ]
      },
      {
        "id": "section-6",
        "name": "Mobil in die Zukunft: News & Aktuelles",
        "selector": [
          ".amag-content > section.section:has(.amag-newsTeaser)"
        ],
        "style": null,
        "blocks": [
          "news-cards-articles"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amagCh-section-description__subtext"
        ]
      },
      {
        "id": "section-7",
        "name": "AMAG Newsletter band",
        "selector": [
          ".amag-content > section.section:has(.amag-newsTeaser) + .amag-divider"
        ],
        "style": null,
        "blocks": [
          "newsletter-band"
        ],
        "defaultContent": []
      },
      {
        "id": "section-8",
        "name": "Image video",
        "selector": [
          ".amag-content > section.section:has(.amag-videoComp)"
        ],
        "style": null,
        "blocks": [
          "video-brand-film"
        ],
        "defaultContent": [
          ".amag-videoComp__headline"
        ]
      },
      {
        "id": "section-9",
        "name": "Customer testimonial",
        "selector": [
          ".amag-content > section.section:has(.amag-quoteModul)"
        ],
        "style": null,
        "blocks": [
          "testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "section-10",
        "name": "Unser AMAG Versprechen",
        "selector": [
          ".amag-content > section.section:has(.amag-iconListContainer)"
        ],
        "style": null,
        "blocks": [
          "pledge-row"
        ],
        "defaultContent": [
          ".amag-iconListContainer__headline h2"
        ]
      },
      {
        "id": "section-11",
        "name": "AMAG \u2013 Ihr Autoh\xE4ndler an 90 Standorten",
        "selector": [
          ".amag-content > section.section:has(.cmp-accordion)"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          ".cmp-accordion__headline",
          ".cmp-accordion__introText"
        ]
      },
      {
        "id": "section-12",
        "name": "Jobs band",
        "selector": [
          ".amag-content > section.section:has(.cmp-accordion) + .amag-divider"
        ],
        "style": null,
        "blocks": [
          "newsletter-band"
        ],
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
  var import_home_default = {
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
      meta["header-style"] = "transparent";
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
  return __toCommonJS(import_home_exports);
})();
