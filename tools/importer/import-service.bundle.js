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

  // tools/importer/import-service.js
  var import_service_exports = {};
  __export(import_service_exports, {
    default: () => import_service_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document: document2 }) {
    const txt14 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
    let items = [...element.querySelectorAll("li.cmp-breadcrumb__item")];
    if (!items.length) items = [...element.querySelectorAll("ol > li, ul > li")];
    items = items.filter((li) => !li.closest(".amag-share-wrapper") && txt14(li));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const ul = document2.createElement("ul");
    items.forEach((li, i) => {
      const out = document2.createElement("li");
      const a = li.querySelector("a[href]");
      const label = txt14(a || li);
      if (a && i < items.length - 1) {
        const link = document2.createElement("a");
        link.setAttribute("href", a.getAttribute("href"));
        link.textContent = label;
        out.append(link);
      } else {
        out.textContent = label;
      }
      ul.append(out);
    });
    const cells = [[ul]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "Breadcrumb", cells });
    const hero = element.closest(".amag-introService");
    if (hero && hero !== element) {
      hero.before(block);
      element.remove();
      return;
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-split.js
  var ORIGIN = "https://www.amag.ch";
  var txt = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function toImg(img, document2, alt) {
    if (!img) return null;
    const src = abs(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src || src.startsWith("data:")) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (alt != null ? alt : img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var outside = (n) => !n.closest(".amag-otvCtaWrapper--cookie, .amag-garageOverlay");
  function parse2(element, { document: document2 }) {
    const crumb = element.querySelector("table") || element.querySelector(".amag-introService__breadcrumbs");
    if (crumb) element.before(crumb);
    const cells = [];
    const imgSrc = element.querySelector("img.amag-introService__img") || element.querySelector(".amag-introService__imgWrapper img");
    const image = toImg(imgSrc, document2);
    if (image) cells.push([image]);
    const h1 = element.querySelector("h1.amag-introService__title") || element.querySelector("h1");
    if (h1 && txt(h1)) cells.push([mk(document2, "h1", txt(h1))]);
    const ctas = [...element.querySelectorAll("a.amag-ctaWrapper__button[href]")].filter(outside);
    const cta = ctas.find((a) => a.closest(".amag-otvCtaWrapper--noCookie")) || ctas[0];
    if (cta && txt(cta)) {
      const a = mk(document2, "a", toImg(cta.querySelector("img"), document2));
      a.setAttribute("href", cta.getAttribute("href"));
      cells.push([mk(document2, "p", a, mk(document2, "strong", txt(cta)))]);
    }
    element.querySelectorAll(".amag-introService__otvCta p").forEach((p) => {
      if (outside(p) && txt(p) && !p.querySelector("a")) cells.push([mk(document2, "p", txt(p))]);
    });
    if (!h1 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    let next = element.nextElementSibling;
    while (next && !txt(next) && !next.querySelector("img, picture, iframe, [data-vi16_9_url]")) next = next.nextElementSibling;
    const name = next ? "hero-split (spaced)" : "hero-split";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-brand-film.js
  var txt2 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk2 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var VIDEO_TITLES = {
    896519713: "Startseiten Imagevideo DE",
    684680549: "Online_Buchung_DE"
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
  function parse3(element, { document: document2 }) {
    const url = videoUrl(element);
    if (!url) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const head = [];
    const h = element.querySelector(".amag-videoComp__headline");
    if (h && txt2(h)) head.push(mk2(document2, h.localName && /^h[2-6]$/.test(h.localName) ? h.localName : "h4", txt2(h)));
    const id = (url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
    const frame = element.querySelector("iframe[title]");
    const title = frame && frame.getAttribute("title").trim() || id && VIDEO_TITLES[id] || "";
    const a = mk2(document2, "a", url);
    a.setAttribute("href", url);
    const cell = [mk2(document2, "p", a)];
    if (title) cell.push(mk2(document2, "p", title));
    const block = WebImporter.Blocks.createBlock(document2, { name: "Video Brand Film", cells: [[cell]] });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/long-form-article.js
  var txt3 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var BLOCK_TAGS = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol"]);
  var KEEP = /* @__PURE__ */ new Set([
    "a",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "br",
    "sup",
    "sub",
    "li",
    "ul",
    "ol",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6"
  ]);
  function clean(node, document2) {
    if (node.nodeType === 3) return document2.createTextNode(node.textContent);
    if (node.nodeType !== 1) return null;
    const tag = node.localName;
    const kids = [...node.childNodes].map((c) => clean(c, document2)).flat().filter(Boolean);
    if (!KEEP.has(tag)) return kids.length ? kids : null;
    const out = document2.createElement(tag === "b" ? "strong" : tag === "i" ? "em" : tag);
    if (tag === "a" && node.getAttribute("href")) out.setAttribute("href", node.getAttribute("href"));
    kids.forEach((k) => out.append(k));
    return out;
  }
  function parse4(element, { document: document2 }) {
    const source = element.querySelector(".cmp-text") || element;
    const blocks = [...source.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol")].filter((n) => {
      const outer = n.parentElement && n.parentElement.closest("h1, h2, h3, h4, h5, h6, p, ul, ol");
      return !outer || !source.contains(outer);
    });
    const cell = [];
    blocks.forEach((n) => {
      if (!txt3(n) || !BLOCK_TAGS.has(n.localName)) return;
      const c = clean(n, document2);
      if (c) cell.push(c);
    });
    if (!cell.length && txt3(source)) {
      const p = document2.createElement("p");
      p.textContent = txt3(source);
      cell.push(p);
    }
    if (!cell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "long-form-article", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/icon-text-box.js
  var ORIGIN2 = "https://www.amag.ch";
  var txt4 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg2(node, document2) {
    if (!node) return null;
    let src = "";
    let alt = "";
    if (node.localName === "svg") src = svgDataUri(node);
    else {
      src = abs2(node.getAttribute("src") || node.getAttribute("data-src"));
      alt = (node.getAttribute("alt") || "").trim();
      if (/^(\/|https?:)/.test(alt) || /\.(svg|png|jpe?g|gif|webp)$/i.test(alt)) alt = "";
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", alt);
    return out;
  }
  var mk3 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parseIconTextBox(element, document2) {
    const box = element.matches(".amag-iconTextBox") ? element : element.querySelector(".amag-iconTextBox");
    const cells = [];
    const headline = box.querySelector(".amag-iconTextBox__headline, h2, h3");
    if (headline && txt4(headline)) cells.push([mk3(document2, "h2", txt4(headline))]);
    const items = [...box.querySelectorAll(".amag-iconTextBox__item")];
    items.forEach((item) => {
      const icon = toImg2(item.querySelector("img"), document2);
      const label = txt4(item.querySelector("h5, h4, h3, .amag-iconTextBox__text"));
      if (!label && !icon) return;
      const link = item.querySelector("a[href]");
      let title = mk3(document2, "h5", label);
      if (link && label) {
        const a = mk3(document2, "a", label);
        a.setAttribute("href", link.getAttribute("href"));
        title = mk3(document2, "h5", a);
      }
      cells.push([icon ? mk3(document2, "p", icon) : "", title]);
    });
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const section = element.closest(".amagCh-section");
    const ground = section && (section.classList.contains("amagCh-section--grey") && "grey" || section.classList.contains("amagCh-section--white") && "white");
    const name = ground ? `Icon Text Box (band-${ground})` : "Icon Text Box";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    element.replaceWith(block);
  }
  function parse5(element, { document: document2 }) {
    if (!element.querySelector(".amag-iconLabel, .amag-iconListItem") && (element.matches(".amag-iconTextBox") || element.querySelector(".amag-iconTextBox"))) {
      parseIconTextBox(element, document2);
      return;
    }
    const cells = [];
    const headline = element.querySelector(".amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3");
    if (headline && txt4(headline)) cells.push([mk3(document2, "h2", txt4(headline))]);
    let items = [...element.querySelectorAll(".amag-iconLabel")];
    if (!items.length) items = [...element.querySelectorAll(".amag-iconListItem")];
    items.forEach((item) => {
      const icon = toImg2(item.querySelector("img.amag-iconLabel__icon, img, svg"), document2);
      const label = txt4(item.querySelector(".amag-iconLabel__text, .amag-iconListItem__title, p"));
      if (!label && !icon) return;
      const link = item.querySelector("a[href]");
      let title = mk3(document2, "h5", label);
      if (link && label) {
        const a = mk3(document2, "a", label);
        a.setAttribute("href", link.getAttribute("href"));
        title = mk3(document2, "h5", a);
      }
      cells.push([icon ? mk3(document2, "p", icon) : "", title]);
    });
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Icon Text Box", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/service-offer.js
  var ORIGIN3 = "https://www.amag.ch";
  var txt5 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function toImg3(img, document2) {
    if (!img) return null;
    const src = abs3(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src || src.startsWith("data:")) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk4 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse6(element, { document: document2 }) {
    const link = element.querySelector("a.amag-serviceOffer__content[href]") || element.querySelector("a[href]");
    const headline = txt5(element.querySelector(".amag-serviceOffer__text_headline"));
    const sub = txt5(element.querySelector(".amag-serviceOffer__text_price"));
    const icon = toImg3(element.querySelector(".amag-serviceOffer__icon img") || element.querySelector("img"), document2);
    if (!headline && !sub) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell = [];
    if (headline) {
      if (link) {
        const a = mk4(document2, "a", headline);
        a.setAttribute("href", link.getAttribute("href"));
        cell.push(mk4(document2, "p", a));
      } else cell.push(mk4(document2, "p", headline));
    }
    if (sub) cell.push(mk4(document2, "p", sub));
    if (icon) cell.push(icon);
    const block = WebImporter.Blocks.createBlock(document2, { name: "service-offer", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/image-text-card.js
  var ORIGIN4 = "https://www.amag.ch";
  var txt6 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function toImg4(img, document2) {
    if (!img) return null;
    const src = abs4(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src || src.startsWith("data:")) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk5 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse7(element, { document: document2 }) {
    const cards = element.matches(".amag-maxiTeaserBild") ? [element] : [...element.querySelectorAll(".amag-maxiTeaserBild")].filter((c) => !c.parentElement.closest(".amag-maxiTeaserBild"));
    const cells = [];
    cards.forEach((card) => {
      const image = toImg4(card.querySelector("img.amag-maxiTeaserBild__img") || card.querySelector("picture img, img"), document2);
      const topline = txt6(card.querySelector(".amag-maxiTeaserBild__topline"));
      const title = txt6(card.querySelector(".amag-maxiTeaserBild__headline, h2, h3"));
      const copy = [...card.querySelectorAll(".amag-maxiTeaserBild__text")].map(txt6).filter(Boolean);
      const btn = card.querySelector("a.amag-maxiTeaserBild__btn[href]") || card.querySelector("a[href]");
      const label = btn ? txt6(btn.querySelector(".btn__text") || btn) : "";
      if (!title && !image) return;
      const text = [];
      if (topline) text.push(mk5(document2, "p", topline));
      if (title) text.push(mk5(document2, "h3", title));
      copy.forEach((c) => text.push(mk5(document2, "p", c)));
      let cta = "";
      if (btn && label) {
        const a = mk5(document2, "a", label);
        a.setAttribute("href", btn.getAttribute("href"));
        cta = mk5(document2, "p", mk5(document2, "strong", a));
      }
      cells.push([image || "", text, cta]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "image-text-card", cells });
    if (!element.matches(".amag-maxiTeaserBild")) {
      cards.forEach((c) => c.remove());
      const rest = [...element.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol")].filter((n) => txt6(n) && !n.parentElement.closest("h1, h2, h3, h4, h5, h6, p, ul, ol"));
      rest.forEach((n) => element.before(n));
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  var txt7 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk6 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var KEEP2 = /* @__PURE__ */ new Set(["a", "strong", "b", "em", "i", "u", "br", "sup", "sub", "li", "ul", "ol", "p"]);
  function clean2(node, document2) {
    if (node.nodeType === 3) return document2.createTextNode(node.textContent);
    if (node.nodeType !== 1) return null;
    const tag = node.localName;
    const kids = [...node.childNodes].map((c) => clean2(c, document2)).filter(Boolean);
    if (!KEEP2.has(tag)) return kids.length ? kids : null;
    const out = document2.createElement(tag === "b" ? "strong" : tag === "i" ? "em" : tag);
    if (tag === "a" && node.getAttribute("href")) out.setAttribute("href", node.getAttribute("href"));
    kids.flat().forEach((k) => out.append(k));
    return out;
  }
  var ORIGIN5 = "https://www.amag.ch";
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
  function parse8(element, { document: document2 }) {
    const head = [];
    const cells = [];
    const h2 = element.querySelector(".cmp-accordion__intro .cmp-accordion__headline, .cmp-accordion__headline");
    const icon = element.querySelector(".cmp-accordion__intro img.cmp-accordion__introIcon");
    const iconSrc = icon ? abs5(icon.getAttribute("src") || icon.getAttribute("data-src")) : "";
    if (iconSrc && h2 && txt7(h2)) {
      const img = document2.createElement("img");
      img.setAttribute("src", iconSrc);
      img.setAttribute("alt", (icon.getAttribute("alt") || "").trim());
      cells.push([[mk6(document2, "p", img), mk6(document2, "h2", txt7(h2))]]);
    } else if (h2 && txt7(h2)) head.push(mk6(document2, "h2", txt7(h2)));
    element.querySelectorAll(".cmp-accordion__intro .cmp-accordion__introText, :scope > .cmp-accordion__introText").forEach((p) => {
      if (txt7(p)) head.push(mk6(document2, "p", txt7(p)));
    });
    const headRows = cells.length;
    element.querySelectorAll(".cmp-accordion__item").forEach((item) => {
      const q = txt7(item.querySelector(".cmp-accordion__title") || item.querySelector(".cmp-accordion__button"));
      const panel = item.querySelector(".cmp-accordion__panel");
      if (!q || !panel) return;
      const source = panel.querySelector(".cmp-teaser__description") || panel;
      const blocks = [...source.querySelectorAll("p, ul, ol")].filter((n) => !n.parentElement.closest("p, ul, ol") || !source.contains(n.parentElement.closest("p, ul, ol")));
      const answer = [];
      blocks.forEach((n) => {
        if (!txt7(n)) return;
        const c = clean2(n, document2);
        if (c) answer.push(c);
      });
      if (!answer.length && txt7(source)) answer.push(mk6(document2, "p", txt7(source)));
      cells.push([mk6(document2, "h3", q), answer.length ? answer : ""]);
    });
    if (cells.length === headRows) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Accordion Faq", cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/news-cards.js
  var ORIGIN6 = "https://www.amag.ch";
  var txt8 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function toImg5(img, document2) {
    if (!img) return null;
    const src = abs6(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk7 = (document2, tag, ...kids) => {
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
    if (h4 && txt8(h4)) head.push(mk7(document2, "h4", txt8(h4)));
    let items = [...carousel.querySelectorAll(".cmp-carousel__items > .cmp-carousel__item")];
    if (!items.length) items = [...carousel.querySelectorAll(".cmp-carousel__item")];
    const cells = [];
    items.forEach((item) => {
      const card = item.querySelector(".amag-contentTeaserS") || item;
      const title = txt8(card.querySelector(".amag-contentTeaserS__headline, h3"));
      const copy = txt8(card.querySelector(".amag-contentTeaserS__text"));
      const link = card.querySelector(".amag-contentTeaserS__link a[href]") || card.querySelector("a[href]");
      const cell = [];
      if (title) cell.push(mk7(document2, "h3", title));
      if (copy) cell.push(mk7(document2, "p", copy));
      if (link && txt8(link)) {
        const a = mk7(document2, "a", txt8(link));
        a.setAttribute("href", link.getAttribute("href"));
        cell.push(mk7(document2, "p", a));
      }
      if (!title && !copy) return;
      cells.push([cell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const isEarlierCarousel = (s) => s.classList.contains("amagCh-carousel") || s.matches(".cmp-carousel") && !!s.querySelector(".amag-contentTeaserS") || s.localName === "table" && /^News Cards \(carousel/i.test(txt8(s.querySelector("tr")));
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
  function parse9(element, { document: document2 }) {
    if (isTeaserCarousel(element)) {
      parseCarousel(element, document2);
      return;
    }
    const head = [];
    const topline = element.querySelector(".amag-promotionTeaserBox__topline");
    const headline = element.querySelector(".amag-promotionTeaserBox__headline");
    if (topline && txt8(topline)) head.push(mk7(document2, "p", txt8(topline)));
    if (headline && txt8(headline)) head.push(mk7(document2, "h2", txt8(headline)));
    let cards = [...element.querySelectorAll(".amag-promotionTeaserBox__content > .amag-promotionTeaser")];
    if (!cards.length) cards = [...element.querySelectorAll("div.amag-promotionTeaser")];
    const cells = [];
    cards.forEach((card) => {
      const link = card.querySelector("a[href]");
      const imgCell = [];
      const image = toImg5(card.querySelector(".amag-promotionTeaser__image, .amag-promotionTeaser__imageWrapper img"), document2);
      if (image) imgCell.push(mk7(document2, "p", image));
      const badge = toImg5(card.querySelector(".amag-promotionTeaser__amagLogoImage"), document2);
      if (badge) imgCell.push(mk7(document2, "p", badge));
      const textCell = [];
      const top = txt8(card.querySelector(".amag-promotionTeaser__topline"));
      const title = txt8(card.querySelector(".amag-promotionTeaser__text, h3"));
      const copy = txt8(card.querySelector(".amag-promotionTeaser__copytext"));
      const label = txt8(card.querySelector(".amag-promotionTeaser__button"));
      if (top) textCell.push(mk7(document2, "p", top));
      if (title) textCell.push(mk7(document2, "h3", title));
      if (copy) textCell.push(mk7(document2, "p", copy));
      if (link) {
        const a = mk7(document2, "a", label || title);
        a.setAttribute("href", link.getAttribute("href"));
        textCell.push(mk7(document2, "p", a));
      }
      if (!title && !image) return;
      const colour = colourOf(card);
      cells.push([imgCell.length ? imgCell : "", textCell, colour ? mk7(document2, "p", colour) : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const more = txt8(element.querySelector(".amag-promotionTeaserBox__showMoreBtn"));
    if (more && cards.length > 4) cells.push([mk7(document2, "p", more)]);
    let name = "News Cards";
    const section = element.closest(".amagCh-section");
    if (section && section.classList.contains("amagCh-section--grey")) {
      const steps = section.querySelector(":scope > .amagCh-section__stepswrapper-before");
      let band = steps && (steps.classList.contains("background-color-white") && "white" || steps.classList.contains("background-color-grey") && "grey");
      if (!band) {
        const outer = section.closest("section.section");
        const prev = outer && outer.previousElementSibling;
        const prevGround = prev && prev.querySelector(".amagCh-section");
        if (prevGround) {
          band = prevGround.classList.contains("amagCh-section--white") && "white" || prevGround.classList.contains("amagCh-section--grey") && "grey";
        }
      }
      name = band ? `News Cards (grey, band-${band})` : "News Cards (grey)";
    }
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    head.forEach((n) => element.before(n));
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
    // pledge-row on /de/service ("Unser AMAG Versprechen", same <svg>s as /en/services; files taken
    // from the published /en/services page). Its third icon ("Höchste Servicequalität") has the
    // same path data as the home "service" icon above and resolves to that published file.
    ["M13.9,24.8c-0.5,0-1-0.2", "en/media_150c4f2ebf0ad85d4dd4284f9669419fcd4561abf.svg"],
    // greater safety
    ["M14,32c-2.4,0-3.3-0.5", "en/media_1560160d03496a7d69da6926d1384837c1f773d0c.svg"],
    // top offers
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

  // tools/importer/parsers/pledge-row.js
  var ORIGIN7 = "https://www.amag.ch";
  var txt9 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function svgDataUri2(svg) {
    const known = knownIconSrc(svg);
    if (known) return known;
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg6(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri2(node);
    else {
      const img = node.localName === "img" ? node : node.querySelector("img");
      if (img) {
        src = abs7(img.getAttribute("src") || img.getAttribute("data-src"));
        if (a == null) a = img.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri2(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk8 = (document2, tag, ...kids) => {
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
    if (h2 && txt9(h2)) head.push(mk8(document2, "h2", txt9(h2)));
    const items = [...element.querySelectorAll(".amag-iconListItem")];
    const cells = [];
    items.forEach((item) => {
      const iconBox = item.querySelector(".amag-iconListItem__iconBox") || item;
      const icon = toImg6(iconBox.querySelector("img, svg"), document2, "");
      const title = txt9(item.querySelector(".amag-iconListItem__title"));
      let lines = [...item.querySelectorAll(".amag-iconListItem__text li")].map(txt9).filter(Boolean);
      if (!lines.length) lines = [...item.querySelectorAll(".amag-iconListItem__text p")].map(txt9).filter(Boolean);
      if (!title && !lines.length) return;
      const text = [];
      if (title) text.push(mk8(document2, "p", mk8(document2, "strong", title)));
      if (lines.length) text.push(mk8(document2, "ul", lines.map((l) => mk8(document2, "li", l))));
      cells.push([icon ? mk8(document2, "p", icon) : "", text]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    let name = isPledgeList ? "Pledge Row (plain-head)" : "Pledge Row";
    const outsideHead = element.previousElementSibling && element.previousElementSibling.matches(".amagCh-section-description");
    if (isPledgeList && !h2 && outsideHead) {
      const section = element.closest(".amagCh-section");
      const steps = section && section.querySelector(":scope > .amagCh-section__stepswrapper-before");
      let band = steps && (steps.classList.contains("background-color-grey") && "grey" || steps.classList.contains("background-color-white") && "white");
      if (!band && section) {
        const outer = section.closest("section.section");
        const prev = outer && outer.previousElementSibling;
        const prevGround = prev && prev.querySelector(".amagCh-section");
        if (prevGround) {
          band = prevGround.classList.contains("amagCh-section--grey") && "grey" || prevGround.classList.contains("amagCh-section--white") && "white";
        }
      }
      name = band ? `Pledge Row (band-${band})` : "Pledge Row";
    }
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/garage-chooser.js
  var txt10 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk9 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse11(element, { document: document2 }) {
    const cells = [];
    const headline = element.querySelector(".amag-garageOverlay__headline h3, .amag-garageOverlay__headline h2, .amag-garageOverlay__headline");
    if (headline && txt10(headline)) cells.push([mk9(document2, "h3", txt10(headline))]);
    const garages = [...element.querySelectorAll(".amag-garageOverlay__garageList--garage")];
    let count = 0;
    garages.forEach((g) => {
      const link = g.querySelector("a[href]");
      const name = txt10(g.querySelector(".amag-garageOverlay__garageList--garageName"));
      const street = txt10(g.querySelector(".amag-garageOverlay__garageList--garageStreet"));
      const place = txt10(g.querySelector(".amag-garageOverlay__garageList--garagePlace"));
      if (!name) return;
      const cell = [];
      if (link) {
        const a = mk9(document2, "a", name);
        a.setAttribute("href", link.getAttribute("href"));
        cell.push(mk9(document2, "p", a));
      } else cell.push(mk9(document2, "p", name));
      if (street) cell.push(mk9(document2, "p", street));
      if (place) cell.push(mk9(document2, "p", place));
      cells.push([cell]);
      count += 1;
    });
    if (!count) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "garage-chooser", cells });
    const target = document2.querySelector(".amag-content > .amag-direct-entry") || document2.querySelector(".amag-direct-entry");
    if (target && !element.contains(target)) {
      target.before(block);
      element.remove();
      return;
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta-band.js
  var ORIGIN8 = "https://www.amag.ch";
  var txt11 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function toImg7(img, document2) {
    if (!img) return null;
    const src = abs8(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src || src.startsWith("data:")) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk10 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var outside2 = (n) => !n.closest(".amag-garageOverlay, .amag-garageOverlay--cookie, table");
  function chooserHref(params) {
    try {
      const path = new URL(params.originalURL).pathname.replace(/\.html?$/, "");
      return `${path}#garage-chooser`;
    } catch (e) {
      return "#garage-chooser";
    }
  }
  function parse12(element, { document: document2, params = {} }) {
    const cell = [];
    const h = element.querySelector(".amag-kontaktaufnahme__headline h2, .amag-kontaktaufnahme__headline h3") || [...element.querySelectorAll("h2, h3")].find(outside2);
    if (h && txt11(h)) cell.push(mk10(document2, /^h[23]$/.test(h.localName) ? h.localName : "h2", txt11(h)));
    element.querySelectorAll(".amag-kontaktaufnahme__introText p").forEach((p) => {
      if (txt11(p)) cell.push(mk10(document2, "p", txt11(p)));
    });
    if (!element.querySelector(".amag-kontaktaufnahme__introText p")) {
      const intro = txt11(element.querySelector(".amag-kontaktaufnahme__introText"));
      if (intro) cell.push(mk10(document2, "p", intro));
    }
    const buttons = [...element.querySelectorAll(".amag-garageElectionOverlay a.amag-ctaWrapper__button, a.amag-ctaWrapper__button")].filter(outside2);
    const btn = buttons.find((b) => b.closest(".amag-garageOverlay--noCookie")) || buttons[0];
    if (btn && txt11(btn)) {
      const a = mk10(document2, "a", toImg7(btn.querySelector("img"), document2));
      a.setAttribute("href", chooserHref(params));
      cell.push(mk10(document2, "p", a, mk10(document2, "strong", txt11(btn))));
    }
    if (!h && !btn) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cta-band", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/newsletter-band.js
  var ORIGIN9 = "https://www.amag.ch";
  var txt12 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs9 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN9}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg8(img, document2, alt) {
    if (!img) return null;
    const src = abs9(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (alt != null ? alt : img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk11 = (document2, tag, ...kids) => {
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
  function parse13(element, { document: document2 }) {
    const cells = [];
    const band = toImg8(element.querySelector(".amag-divider__background img"), document2);
    if (band) cells.push([mk11(document2, "p", band)]);
    const box = element.querySelector(".amag-divider__contentBox") || element;
    const content = [];
    const topline = txt12(box.querySelector(".amag-divider__topline"));
    const headline = txt12(box.querySelector(".amag-divider__headline"));
    if (topline) content.push(mk11(document2, "p", topline));
    if (headline) content.push(mk11(document2, "h3", headline));
    box.querySelectorAll(".amag-divider__copytext").forEach((p) => {
      if (txt12(p)) content.push(mk11(document2, "p", txt12(p)));
    });
    const btn = box.querySelector(".amag-divider__ctaButton a[href]");
    if (btn && txt12(btn)) {
      const mark = isSecondary(btn) ? "em" : "strong";
      const icon = toImg8(btn.querySelector("img"), document2, "");
      const servicePage = !!document2.querySelector(".amag-introService") || [...document2.querySelectorAll("table")].some((t) => /^hero[\s-]split(\s*\(|\s*$)/i.test(txt12(t.querySelector("tr"))));
      if (servicePage) {
        const a = mk11(document2, "a", txt12(btn));
        a.setAttribute("href", btn.getAttribute("href"));
        content.push(mk11(document2, "p", icon, mk11(document2, mark, a)));
      } else {
        const a = mk11(document2, "a", icon, txt12(btn));
        a.setAttribute("href", btn.getAttribute("href"));
        content.push(mk11(document2, "p", mk11(document2, mark, a)));
      }
    }
    if (!headline && !content.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "Newsletter Band", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/direct-entry.js
  var ORIGIN10 = "https://www.amag.ch";
  var txt13 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs10 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN10}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg9(img, document2) {
    if (!img) return null;
    const src = abs10(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk12 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse14(element, { document: document2 }) {
    const cells = [];
    [".amag-direct-entry__button--open", ".amag-direct-entry__button--close"].forEach((sel) => {
      const face = element.querySelector(sel);
      if (!face) return;
      const icon = toImg9(face.querySelector("img"), document2);
      const label = txt13(face.querySelector(".amag-direct-entry__label") || face);
      if (!label) return;
      cells.push([icon ? mk12(document2, "p", icon) : "", mk12(document2, "p", label)]);
    });
    const topline = txt13(element.querySelector(".amag-direct-entry__pop-up-topline"));
    if (topline) cells.push([mk12(document2, "p", topline)]);
    let entries = [...element.querySelectorAll("a.amag-direct-entry__pop-up-element[href]")];
    if (!entries.length) entries = [...element.querySelectorAll(".amag-direct-entry__pop-up a[href]")];
    entries.forEach((entry) => {
      const label = txt13(entry.querySelector(".amag-direct-entry__link") || entry);
      if (!label) return;
      const icon = toImg9(entry.querySelector("img"), document2);
      const a = mk12(document2, "a", label);
      a.setAttribute("href", entry.getAttribute("href"));
      cells.push([icon ? mk12(document2, "p", icon) : "", mk12(document2, "p", a)]);
    });
    if (!entries.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Direct Entry", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/amag-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  var ORIGIN11 = "https://www.amag.ch";
  function absolutize(url) {
    if (!url) return url;
    const u = url.trim();
    if (!u || u.startsWith("data:") || u.startsWith("blob:") || /^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    if (u.startsWith("//")) return `https:${u}`;
    try {
      return new URL(u, `${ORIGIN11}/`).href;
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

  // tools/importer/import-service.js
  var parsers = {
    "breadcrumb": parse,
    "hero-split": parse2,
    "video-brand-film": parse3,
    "long-form-article": parse4,
    "icon-text-box": parse5,
    "service-offer": parse6,
    "image-text-card": parse7,
    "accordion-faq": parse8,
    "news-cards": parse9,
    "pledge-row": parse10,
    "garage-chooser": parse11,
    "cta-band": parse12,
    "newsletter-band": parse13,
    "direct-entry": parse14
  };
  var PAGE_TEMPLATE = {
    "name": "service",
    "description": "AMAG service overview (Service landing page)",
    "urls": [
      "https://www.amag.ch/de/service.html"
    ],
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          ".amag-introService__breadcrumbs"
        ]
      },
      {
        "name": "hero-split",
        "instances": [
          ".amag-content > section.section .amag-introService"
        ]
      },
      {
        "name": "video-brand-film",
        "instances": [
          ".amag-videoComp"
        ]
      },
      {
        "name": "long-form-article",
        "instances": [
          ".amag-content > section.section:has(.amag-introService) .rich-text"
        ]
      },
      {
        "name": "icon-text-box",
        "instances": [
          ".amag-iconTextBox"
        ]
      },
      {
        "name": "service-offer",
        "instances": [
          ".amag-serviceOffer"
        ]
      },
      {
        "name": "image-text-card",
        "instances": [
          ".amag-content > section.section:has(.amag-maxiTeaserBild)"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".cmp-accordion"
        ]
      },
      {
        "name": "news-cards",
        "instances": [
          ".amag-promotionTeaserBox"
        ]
      },
      {
        "name": "pledge-row",
        "instances": [
          ".amag-iconListContainer:has(.amag-iconListItem)"
        ]
      },
      {
        "name": "garage-chooser",
        "instances": [
          ".amag-kontaktaufnahme .amag-garageElectionOverlay .amag-garageOverlay"
        ]
      },
      {
        "name": "cta-band",
        "instances": [
          ".amag-kontaktaufnahme"
        ]
      },
      {
        "name": "newsletter-band",
        "instances": [
          ".amag-content > .amag-divider"
        ]
      },
      {
        "name": "direct-entry",
        "instances": [
          ".amag-content > .amag-direct-entry"
        ]
      }
    ],
    "sections": [
      {
        "id": "section-1",
        "name": "Intro: breadcrumb, split hero, brand video, intro text",
        "selector": [
          ".amag-content > section.section:has(.amag-introService)"
        ],
        "style": null,
        "blocks": [
          "breadcrumb",
          "hero-split",
          "video-brand-film",
          "long-form-article"
        ],
        "defaultContent": []
      },
      {
        "id": "section-2",
        "name": "Services at a glance + appointment strip + image teasers",
        "selector": [
          ".amag-content > section.section .amag-iconTextBox"
        ],
        "style": null,
        "blocks": [
          "icon-text-box",
          "service-offer",
          "image-text-card"
        ],
        "defaultContent": []
      },
      {
        "id": "section-3",
        "name": "FAQ accordions (4 groups; not on /en/services)",
        "selector": [
          ".amag-content > section.section:has(.cmp-accordion)"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": []
      },
      {
        "id": "section-4",
        "name": "News and offers",
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
        "id": "section-5",
        "name": "Pledge + contact band",
        "selector": [
          ".amag-content > section.section:has(.amag-iconListContainer)"
        ],
        "style": null,
        "blocks": [
          "pledge-row",
          "cta-band"
        ],
        "defaultContent": [
          ".amag-content > section.section:has(.amag-iconListContainer) .amagCh-section-description__theme",
          ".amag-content > section.section:has(.amag-iconListContainer) .amagCh-section-description__headline"
        ]
      },
      {
        "id": "section-6",
        "name": "Newsletter band",
        "selector": [
          ".amag-content > .amag-divider"
        ],
        "style": null,
        "blocks": [
          "newsletter-band"
        ],
        "defaultContent": []
      },
      {
        "id": "section-7",
        "name": "Overlays: garage chooser + direct entry",
        "selector": [
          ".amag-content > .amag-direct-entry"
        ],
        "style": null,
        "blocks": [
          "garage-chooser",
          "direct-entry"
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
  var import_service_default = {
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
  return __toCommonJS(import_service_exports);
})();
