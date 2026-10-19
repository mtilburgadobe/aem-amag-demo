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

  // tools/importer/import-garagenuebersicht.js
  var import_garagenuebersicht_exports = {};
  __export(import_garagenuebersicht_exports, {
    default: () => import_garagenuebersicht_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document: document2 }) {
    const txt17 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
    let items = [...element.querySelectorAll("li.cmp-breadcrumb__item")];
    if (!items.length) items = [...element.querySelectorAll("ol > li, ul > li")];
    items = items.filter((li) => !li.closest(".amag-share-wrapper") && txt17(li));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const ul = document2.createElement("ul");
    items.forEach((li, i) => {
      const out = document2.createElement("li");
      const a = li.querySelector("a[href]");
      const label = txt17(a || li);
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
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-split-garage.js
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
  function svgDataUri(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    const svg = node.localName === "svg" ? node : null;
    const img = svg ? null : node.localName === "img" ? node : node.querySelector("img");
    if (svg) src = svgDataUri(svg);
    else if (img) {
      src = abs(img.getAttribute("src") || img.getAttribute("data-src"));
      if (a == null) a = img.getAttribute("alt") || "";
    } else {
      const inner = node.querySelector("svg");
      if (inner) src = svgDataUri(inner);
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var iconOf = (n) => n ? n.querySelector(":scope > img, :scope > svg, img, svg") : null;
  function parse2(element, { document: document2 }) {
    const crumb = element.querySelector(".amag-introGarageWithSlider__breadcrumbs") || element.querySelector("table");
    if (crumb) element.before(crumb);
    const cells = [];
    let slides = [...element.querySelectorAll(".cmp-carousel__item img.amag-introGarageWithSliderImage__img")];
    if (!slides.length) slides = [...element.querySelectorAll(".amag-introGarageWithSlider__carousel img, .cmp-carousel__item picture img")];
    const slideCell = slides.map((img) => toImg(img, document2)).filter(Boolean).map((i) => mk(document2, "p", i));
    if (slideCell.length) cells.push([slideCell]);
    const h1 = element.querySelector("h1, .amag-introGarageWithSlider__title");
    const lead = [...element.querySelectorAll(".amag-introGarageWithSlider__infoText")];
    const textCell = [];
    if (h1) textCell.push(mk(document2, "h1", txt(h1)));
    lead.forEach((p) => {
      if (txt(p)) textCell.push(mk(document2, "p", txt(p)));
    });
    if (textCell.length) cells.push([textCell]);
    let lists = [...element.querySelectorAll(".amag-introGarageWithSlider__brandsSale, .amag-introGarageWithSlider__brandsServices")];
    if (!lists.length) lists = [...element.querySelectorAll(".amag-introGarageWithSlider__brands > div")];
    const brandCells = lists.map((list) => {
      const title = txt(list.querySelector(".amag-introGarageWithSlider__brandListTitle"));
      const logos = [...list.querySelectorAll("img")].map((i) => toImg(i, document2)).filter(Boolean);
      if (!title && !logos.length) return null;
      const cell = [];
      if (title) cell.push(mk(document2, "p", title));
      logos.forEach((l) => cell.push(mk(document2, "p", l)));
      return cell;
    }).filter(Boolean);
    if (brandCells.length) cells.push(brandCells);
    const linkCell = [];
    const fav = element.querySelector(".amag-garage__favorite") || element.querySelector(".amag-introGarageWithSlider__favoriteGarage > span:not(.d-none)");
    if (fav && txt(fav)) linkCell.push(mk(document2, "p", toImg(iconOf(fav), document2, ""), txt(fav)));
    element.querySelectorAll(".amag-introGarageWithSlider__linkWrapper a[href]").forEach((a) => {
      const link = mk(document2, "a", toImg(iconOf(a), document2, ""), txt(a));
      link.setAttribute("href", a.getAttribute("href"));
      linkCell.push(mk(document2, "p", link));
    });
    if (linkCell.length) cells.push([linkCell]);
    const ctaSrc = element.querySelector(".cmp-carousel__actions a.amag-ctaWrapper__button") || element.querySelector("a.amag-ctaWrapper__button");
    if (ctaSrc && txt(ctaSrc)) {
      const link = mk(document2, "a", toImg(iconOf(ctaSrc), document2, ""), txt(ctaSrc));
      link.setAttribute("href", ctaSrc.getAttribute("href"));
      cells.push([mk(document2, "p", mk(document2, "strong", link))]);
    }
    if (!h1 && !slideCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Hero Split Garage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-garage.js
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
  function svgDataUri2(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg2(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri2(node);
    else {
      const img = node.localName === "img" ? node : node.querySelector("img");
      if (img) {
        src = abs2(img.getAttribute("src") || img.getAttribute("data-src"));
        if (a == null) a = img.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri2(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk2 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  var toClassName = (name) => typeof name === "string" ? name.toLowerCase().replace(/[^0-9a-z]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "";
  function parse3(element, { document: document2 }) {
    let tabs = [...element.querySelectorAll(":scope > li.amag-introTabModul__tab")];
    if (!tabs.length) tabs = [...element.querySelectorAll("li.cmp-tabs__tab, li")];
    tabs = tabs.filter((li) => txt2(li));
    if (!tabs.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const labels = tabs.map((li) => txt2(li));
    const cells = tabs.map((li, i) => {
      const icon = toImg2(li.querySelector("img, svg"), document2, labels[i]);
      return [icon ? mk2(document2, "p", icon) : "", mk2(document2, "p", labels[i])];
    });
    const root = element.closest(".cmp-tabs") || element.closest(".amag-introTabModul");
    const band = root && root.querySelector(":scope > .amagCh-section__container") || document2.querySelector(".amag-introTabModul .cmp-tabs > .amagCh-section__container");
    if (band) {
      const headSrc = band.querySelector(".h3, h2, h3, h4, .alc-wrapper > .row > div:first-child");
      const head = txt2(headSrc);
      let links = [...band.querySelectorAll(".alc-link")];
      if (!links.length) links = [...band.querySelectorAll("a")];
      const linkPs = links.map((ln, i) => {
        const label = txt2(ln.querySelector(".alc-linktext") || ln);
        if (!label) return null;
        const lower = label.toLowerCase();
        const match = labels.map((l, idx) => ({ l, idx })).filter(({ l }) => lower.includes(l.toLowerCase())).sort((x, y) => y.l.length - x.l.length)[0];
        const tab = match ? labels[match.idx] : labels[Math.min(i, labels.length - 1)];
        const a = mk2(document2, "a", label);
        a.setAttribute("href", `#${toClassName(tab)}`);
        return mk2(document2, "p", a);
      }).filter(Boolean);
      if (head || linkPs.length) {
        cells.push([head ? mk2(document2, "h3", head) : "", linkPs]);
      }
      band.remove();
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Tabs Garage", cells });
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
  function parse4(element, { document: document2 }) {
    const cells = [];
    const head = [];
    const iconSrc = element.querySelector(".amag-dspSearch__icon img");
    if (iconSrc && iconSrc.getAttribute("src")) {
      const img = document2.createElement("img");
      img.setAttribute("src", abs3(iconSrc.getAttribute("src")));
      img.setAttribute("alt", (iconSrc.getAttribute("alt") || "").trim());
      head.push(mk3(document2, "p", img));
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
  function toImg3(img, document2) {
    if (!img) return null;
    const src = abs4(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
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
  function parse5(element, { document: document2 }) {
    const head = [];
    const topline = element.querySelector(".amag-promotionTeaserBox__topline");
    const headline = element.querySelector(".amag-promotionTeaserBox__headline");
    if (topline && txt4(topline)) head.push(mk4(document2, "p", txt4(topline)));
    if (headline && txt4(headline)) head.push(mk4(document2, "h2", txt4(headline)));
    let cards = [...element.querySelectorAll(".amag-promotionTeaserBox__content > .amag-promotionTeaser")];
    if (!cards.length) cards = [...element.querySelectorAll("div.amag-promotionTeaser")];
    const cells = [];
    cards.forEach((card) => {
      const link = card.querySelector("a[href]");
      const imgCell = [];
      const image = toImg3(card.querySelector(".amag-promotionTeaser__image, .amag-promotionTeaser__imageWrapper img"), document2);
      if (image) imgCell.push(mk4(document2, "p", image));
      const badge = toImg3(card.querySelector(".amag-promotionTeaser__amagLogoImage"), document2);
      if (badge) imgCell.push(mk4(document2, "p", badge));
      const textCell = [];
      const top = txt4(card.querySelector(".amag-promotionTeaser__topline"));
      const title = txt4(card.querySelector(".amag-promotionTeaser__text, h3"));
      const copy = txt4(card.querySelector(".amag-promotionTeaser__copytext"));
      const label = txt4(card.querySelector(".amag-promotionTeaser__button"));
      if (top) textCell.push(mk4(document2, "p", top));
      if (title) textCell.push(mk4(document2, "h3", title));
      if (copy) textCell.push(mk4(document2, "p", copy));
      if (link) {
        const a = mk4(document2, "a", label || title);
        a.setAttribute("href", link.getAttribute("href"));
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

  // tools/importer/parsers/news-cards-vehicle.js
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
  function toImg4(img, document2) {
    if (!img) return null;
    const src = abs5(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
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
  function priceParagraph(container, document2) {
    if (!container) return null;
    const p = document2.createElement("p");
    const price = txt5(container.querySelector(".amag-angeboteRecoContainer__reco--price"));
    if (price) p.append(mk5(document2, "strong", price));
    const leasing = container.querySelector(".amag-angeboteRecoContainer__reco--leasingText");
    if (leasing && txt5(leasing)) {
      if (p.childNodes.length) p.append(document2.createElement("br"));
      const bold = leasing.querySelector("b, strong");
      const boldText = txt5(bold);
      const lead = txt5(leasing).replace(boldText, "").trim();
      if (lead) p.append(`${lead} `);
      if (boldText) p.append(mk5(document2, "strong", boldText));
    }
    if (!p.childNodes.length && txt5(container)) p.textContent = txt5(container);
    return p.childNodes.length ? p : null;
  }
  function parse6(element, { document: document2 }) {
    const head = [];
    const h4 = element.querySelector(".amag-angeboteRecoContainer__carousel--descriptionHeadline");
    if (h4 && txt5(h4)) head.push(mk5(document2, "h4", txt5(h4)));
    const headLink = element.querySelector(".amag-angeboteRecoContainer__carousel--descriptionLink a[href]");
    if (headLink && txt5(headLink)) {
      const a = mk5(document2, "a", txt5(headLink));
      a.setAttribute("href", headLink.getAttribute("href"));
      head.push(mk5(document2, "p", a));
    }
    let items = [...element.querySelectorAll(".cmp-carousel__items > .cmp-carousel__item")];
    if (!items.length) items = [...element.querySelectorAll(".cmp-carousel__item")];
    const cells = [];
    items.forEach((item) => {
      const card = item.querySelector(".amag-angeboteRecoContainer__reco");
      const last = item.querySelector(".amag-angeboteRecoContainer__reco--last");
      if (card) {
        const photo = toImg4(card.querySelector(".amag-angeboteRecoContainer__reco--image, img"), document2);
        const body = [];
        const status = txt5(card.querySelector(".amag-angeboteRecoContainer__reco--subtitle"));
        const title = txt5(card.querySelector(".amag-angeboteRecoContainer__reco--title"));
        if (status) body.push(mk5(document2, "p", status));
        if (title) body.push(mk5(document2, "h3", title));
        const price = priceParagraph(card.querySelector(".amag-angeboteRecoContainer__reco--priceContainer"), document2);
        if (price) body.push(price);
        const specs = [...card.querySelectorAll(".amag-angeboteRecoContainer__recoDataContainer > div")].map((d) => {
          const value = txt5(d.querySelector(".amag-angeboteRecoContainer__recoDataContainerValue"));
          const label = txt5(d.querySelector(".amag-angeboteRecoContainer__recoDataContainerText"));
          return [value, label].filter(Boolean).join(" ");
        }).filter(Boolean);
        if (specs.length) body.push(mk5(document2, "ul", specs.map((s) => mk5(document2, "li", s))));
        const detail = card.querySelector(":scope > a[href]") || card.querySelector("a[href]");
        if (detail) {
          const a = mk5(document2, "a", title || txt5(detail) || detail.getAttribute("href"));
          a.setAttribute("href", detail.getAttribute("href"));
          body.push(mk5(document2, "p", a));
        }
        if (!title && !photo) return;
        cells.push([photo ? mk5(document2, "p", photo) : "", body]);
      } else if (last) {
        const a = last.querySelector("a[href]") || last.closest("a[href]");
        const label = txt5(last);
        if (a && label) {
          const link = mk5(document2, "a", label);
          link.setAttribute("href", a.getAttribute("href"));
          cells.push([mk5(document2, "p", link)]);
        }
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "News Cards Vehicle", cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta-band-contact.js
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
  function svgDataUri3(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg5(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri3(node);
    else {
      const img = node.localName === "img" ? node : node.querySelector("img");
      if (img) {
        src = abs6(img.getAttribute("src") || img.getAttribute("data-src"));
        if (a == null) a = img.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri3(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk6 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse7(element, { document: document2 }) {
    let tabs = [...element.querySelectorAll("li.amag-tabsWrapper__tab")];
    if (!tabs.length) tabs = [...element.querySelectorAll(".cmp-tabs__tablist > li")];
    let panels = [...element.querySelectorAll(".amag-tabsWrapper__tabcontent")];
    if (!panels.length) panels = [...element.querySelectorAll(".cmp-tabs__tabpanel")];
    if (!panels.length) panels = [...element.querySelectorAll(".amag-contactPersonWrapper")];
    const cells = [];
    panels.forEach((panel, i) => {
      const person = panel.querySelector(".amag-contactPersonWrapper") || panel;
      const headline = txt6(person.querySelector(".amag-contactPersonWrapper__info--headline"));
      const team = txt6(person.querySelector(".amag-contactPersonWrapper__info--team"));
      const dept = txt6(person.querySelector(".amag-contactPersonWrapper__info--garage"));
      const ctaSrc = person.querySelector(".amag-contactPersonWrapper__info--cta a[href]");
      const tab = tabs[i];
      const logoImg = tab ? tab.querySelector("img") : null;
      const logoAlt = logoImg ? (logoImg.getAttribute("alt") || "").trim() : "";
      const logo = toImg5(logoImg, document2, logoAlt.length < 2 ? team || logoAlt : logoAlt);
      const photo = toImg5(person.querySelector(".amag-contactPersonWrapper__image img, picture img"), document2);
      const info = [];
      if (headline) info.push(mk6(document2, "h3", headline));
      if (team) info.push(mk6(document2, "p", mk6(document2, "strong", team)));
      if (dept) info.push(mk6(document2, "p", dept));
      if (ctaSrc && txt6(ctaSrc)) {
        const a = mk6(document2, "a", toImg5(ctaSrc.querySelector("img, svg"), document2, ""), txt6(ctaSrc));
        a.setAttribute("href", ctaSrc.getAttribute("href"));
        info.push(mk6(document2, "p", mk6(document2, "strong", a)));
      }
      if (!info.length && !photo) return;
      const row = [];
      if (logo) row.push(mk6(document2, "p", logo));
      if (photo) row.push(mk6(document2, "p", photo));
      row.push(info);
      cells.push(row);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "CTA Band Contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/pledge-row.js
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
  function svgDataUri4(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg6(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri4(node);
    else {
      const img = node.localName === "img" ? node : node.querySelector("img");
      if (img) {
        src = abs7(img.getAttribute("src") || img.getAttribute("data-src"));
        if (a == null) a = img.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri4(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk7 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse8(element, { document: document2 }) {
    const isPledgeList = element.classList.contains("amag-iconListContainer") || !!element.querySelector(".amag-iconListContainer__headline");
    const head = [];
    const h2 = element.querySelector(".amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3");
    if (h2 && txt7(h2)) head.push(mk7(document2, "h2", txt7(h2)));
    const items = [...element.querySelectorAll(".amag-iconListItem")];
    const cells = [];
    items.forEach((item) => {
      const iconBox = item.querySelector(".amag-iconListItem__iconBox") || item;
      const icon = toImg6(iconBox.querySelector("img, svg"), document2, "");
      const title = txt7(item.querySelector(".amag-iconListItem__title"));
      let lines = [...item.querySelectorAll(".amag-iconListItem__text li")].map(txt7).filter(Boolean);
      if (!lines.length) lines = [...item.querySelectorAll(".amag-iconListItem__text p")].map(txt7).filter(Boolean);
      if (!title && !lines.length) return;
      const text = [];
      if (title) text.push(mk7(document2, "p", mk7(document2, "strong", title)));
      if (lines.length) text.push(mk7(document2, "ul", lines.map((l) => mk7(document2, "li", l))));
      cells.push([icon ? mk7(document2, "p", icon) : "", text]);
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

  // tools/importer/parsers/quick-links-brands.js
  var ORIGIN8 = "https://www.amag.ch";
  var txt8 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk8 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse9(element, { document: document2 }) {
    let tiles = [...element.querySelectorAll(".amag-brandIntroductionWrapper__colWrapper")];
    if (!tiles.length) tiles = [...element.querySelectorAll(".amag-brandIntroductionWrapper__content")];
    const cells = [];
    tiles.forEach((tile) => {
      const logo = toImg7(tile.querySelector(".amag-brandIntroductionWrapper__box img, img"), document2);
      const textLink = tile.querySelector(".amag-brandIntroductionWrapper__text a[href]") || [...tile.querySelectorAll("a[href]")].find((a) => txt8(a));
      if (!logo && !textLink) return;
      const linkCell = [];
      if (textLink && txt8(textLink)) {
        const a = mk8(document2, "a", txt8(textLink));
        a.setAttribute("href", textLink.getAttribute("href"));
        linkCell.push(mk8(document2, "p", a));
      }
      cells.push([logo ? mk8(document2, "p", logo) : "", linkCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Quick Links Brands", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/icon-feature-grid.js
  var ORIGIN9 = "https://www.amag.ch";
  var txt9 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  function svgDataUri5(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg8(node, document2, alt) {
    if (!node) return null;
    let src = "";
    let a = alt;
    if (node.localName === "svg") src = svgDataUri5(node);
    else {
      const img = node.localName === "img" ? node : node.querySelector("img");
      if (img) {
        src = abs9(img.getAttribute("src") || img.getAttribute("data-src"));
        if (a == null) a = img.getAttribute("alt") || "";
      } else if (node.querySelector("svg")) src = svgDataUri5(node.querySelector("svg"));
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (a || "").trim());
    return out;
  }
  var mk9 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse10(element, { document: document2 }) {
    const cells = [];
    const band = toImg8(element.querySelector(".amag-serviceContainerWrapper__image img"), document2);
    if (band) cells.push([mk9(document2, "p", band)]);
    let boxes = [...element.querySelectorAll(".amag-serviceContainerWrapper__serviceBox .amag-serviceBoxWrapper")];
    if (!boxes.length) boxes = [...element.querySelectorAll(".amag-serviceBoxWrapper")];
    boxes.forEach((box) => {
      const icon = toImg8(box.querySelector(".amag-serviceBoxWrapper__content--image, img, svg"), document2);
      const title = txt9(box.querySelector(".amag-serviceBoxWrapper__content--headline"));
      const lines = [...box.querySelectorAll(".amag-serviceBoxWrapper__content--textarea p")].map(txt9).filter(Boolean);
      const linkSrc = box.querySelector(".amag-serviceBoxWrapper__content--link a[href]");
      const text = [];
      if (title) text.push(mk9(document2, "p", mk9(document2, "strong", title)));
      lines.forEach((l) => text.push(mk9(document2, "p", l)));
      if (linkSrc && txt9(linkSrc)) {
        const a = mk9(document2, "a", txt9(linkSrc));
        a.setAttribute("href", linkSrc.getAttribute("href"));
        text.push(mk9(document2, "p", a));
      }
      if (!text.length) return;
      cells.push([icon ? mk9(document2, "p", icon) : "", text]);
    });
    const ctaSrc = element.querySelector(".amag-serviceContainerWrapper__ctaButton a[href]");
    if (ctaSrc && txt9(ctaSrc)) {
      const a = mk9(document2, "a", toImg8(ctaSrc.querySelector("img, svg"), document2, ""), txt9(ctaSrc));
      a.setAttribute("href", ctaSrc.getAttribute("href"));
      cells.push([mk9(document2, "p", mk9(document2, "strong", a))]);
    }
    if (!boxes.length && !band) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Icon Feature Grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/news-cards-services.js
  var ORIGIN10 = "https://www.amag.ch";
  var txt10 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
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
  var mk10 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse11(element, { document: document2 }) {
    const head = [];
    const h4 = element.querySelector(".amagCh-carousel-description__headline");
    const sub = element.querySelector(".amagCh-carousel-description__subtext");
    if (h4 && txt10(h4)) head.push(mk10(document2, "h4", txt10(h4)));
    if (sub && txt10(sub)) head.push(mk10(document2, "p", txt10(sub)));
    let boxes = [...element.querySelectorAll(".cmp-carousel__item .amag-serviceBoxWrapper")];
    if (!boxes.length) boxes = [...element.querySelectorAll(".amag-serviceBoxWrapper")];
    const cells = [];
    boxes.forEach((box) => {
      const icon = toImg9(box.querySelector(".amag-serviceBoxWrapper__content--image, img"), document2);
      const title = txt10(box.querySelector(".amag-serviceBoxWrapper__content--headline"));
      const lines = [...box.querySelectorAll(".amag-serviceBoxWrapper__content--textarea p")].map(txt10).filter(Boolean);
      const linkSrc = box.querySelector(".amag-serviceBoxWrapper__content--link a[href]");
      const text = [];
      if (title) text.push(mk10(document2, "h3", title));
      lines.forEach((l) => text.push(mk10(document2, "p", l)));
      if (linkSrc && txt10(linkSrc)) {
        const a = mk10(document2, "a", txt10(linkSrc));
        a.setAttribute("href", linkSrc.getAttribute("href"));
        text.push(mk10(document2, "p", a));
      }
      if (!text.length) return;
      cells.push([icon ? mk10(document2, "p", icon) : "", text]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "News Cards Services", cells });
    head.forEach((n) => element.before(n));
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-teaser-app.js
  var ORIGIN11 = "https://www.amag.ch";
  var txt11 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs11 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN11}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg10(img, document2, alt) {
    if (!img) return null;
    const src = abs11(img.getAttribute("src") || img.getAttribute("data-src"));
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
  function parse12(element, { document: document2 }) {
    const image = toImg10(element.querySelector(".amag-app-download__image img, picture img"), document2);
    const heading = element.querySelector(".amag-app-download__text-headline, h2, h3");
    const copy = [...element.querySelectorAll(".amag-app-download__text-copy")].map(txt11).filter(Boolean);
    const content = [];
    if (heading && txt11(heading)) content.push(mk11(document2, "h2", txt11(heading)));
    copy.forEach((c) => content.push(mk11(document2, "p", c)));
    const badges = [...element.querySelectorAll(".amag-app-download__link-badges a[href]")].map((a) => {
      const cls = a.className || "";
      const fallbackAlt = /ios/i.test(cls) ? "App Store" : /android/i.test(cls) ? "Google Play" : "";
      const srcImg = a.querySelector("img");
      const alt = srcImg && srcImg.getAttribute("alt") || fallbackAlt;
      const img = toImg10(srcImg, document2, alt);
      if (!img) return null;
      const link = mk11(document2, "a", img);
      link.setAttribute("href", a.getAttribute("href"));
      return link;
    }).filter(Boolean);
    if (badges.length) {
      const p = document2.createElement("p");
      badges.forEach((b, i) => {
        if (i) p.append(" ");
        p.append(b);
      });
      content.push(p);
    }
    const ctaSrc = element.querySelector("a.amag-app-download__link-cta[href]") || [...element.querySelectorAll(".amag-app-download__link > a[href]")].find((a) => txt11(a));
    if (ctaSrc && txt11(ctaSrc)) {
      const a = mk11(document2, "a", txt11(ctaSrc));
      a.setAttribute("href", ctaSrc.getAttribute("href"));
      content.push(mk11(document2, "p", mk11(document2, "em", a)));
    }
    if (!content.length && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image ? mk11(document2, "p", image) : "", content]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "Promo Teaser App", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/image-text-card-text.js
  var txt12 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk12 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse13(element, { document: document2 }) {
    const eyebrow = txt12(element.querySelector(".amag-maxiTeaser__description__theme"));
    const headline = txt12(element.querySelector(".amag-maxiTeaser__description__headline, h2, h3"));
    const textBox = element.querySelector(".amag-maxiTeaser__description__text");
    let paras = textBox ? [...textBox.querySelectorAll("p")].map(txt12).filter(Boolean) : [];
    if (!paras.length && txt12(textBox)) paras = [txt12(textBox)];
    const btn = element.querySelector("a.amag-maxiTeaser__btn[href]") || [...element.querySelectorAll("a[href]")].find((a) => txt12(a));
    const label = btn ? txt12(btn.querySelector(".btn__text") || btn) : "";
    const cell = [];
    if (eyebrow) cell.push(mk12(document2, "p", eyebrow));
    if (headline) cell.push(mk12(document2, "h2", headline));
    paras.forEach((p) => cell.push(mk12(document2, "p", p)));
    if (btn && label) {
      const a = mk12(document2, "a", label);
      a.setAttribute("href", btn.getAttribute("href"));
      cell.push(mk12(document2, "p", mk12(document2, "strong", a)));
    }
    if (!headline && !paras.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "Image Text Card Text", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/testimonial.js
  var txt13 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var mk13 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse14(element, { document: document2 }) {
    const item = element.querySelector(".cmp-carousel__item--active .amag-quoteModul") || element.querySelector(".amag-quoteModul") || element;
    const quote = txt13(item.querySelector(".amag-quoteModul__qoute, .amag-quoteModul__quote, blockquote")).replace(/^[„“"«»]+|[“”"«»]+$/g, "").trim();
    const author = txt13(item.querySelector(".amag-quoteModul__author"));
    const customer = txt13(item.querySelector(".amag-quoteModul__customerBy"));
    if (!quote) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cell = [mk13(document2, "p", quote)];
    if (author) cell.push(mk13(document2, "p", author));
    if (customer) cell.push(mk13(document2, "p", customer));
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "Testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/icon-text-box.js
  var ORIGIN12 = "https://www.amag.ch";
  var txt14 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs12 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN12}/`).href;
    } catch (e) {
      return s;
    }
  };
  function svgDataUri6(svg) {
    const s = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(s)))}`;
  }
  function toImg11(node, document2) {
    if (!node) return null;
    let src = "";
    let alt = "";
    if (node.localName === "svg") src = svgDataUri6(node);
    else {
      src = abs12(node.getAttribute("src") || node.getAttribute("data-src"));
      alt = (node.getAttribute("alt") || "").trim();
      if (/^(\/|https?:)/.test(alt) || /\.(svg|png|jpe?g|gif|webp)$/i.test(alt)) alt = "";
    }
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", alt);
    return out;
  }
  var mk14 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse15(element, { document: document2 }) {
    const cells = [];
    const headline = element.querySelector(".amag-iconListContainer__headline h2, .amag-iconListContainer__headline h3");
    if (headline && txt14(headline)) cells.push([mk14(document2, "h2", txt14(headline))]);
    let items = [...element.querySelectorAll(".amag-iconLabel")];
    if (!items.length) items = [...element.querySelectorAll(".amag-iconListItem")];
    items.forEach((item) => {
      const icon = toImg11(item.querySelector("img.amag-iconLabel__icon, img, svg"), document2);
      const label = txt14(item.querySelector(".amag-iconLabel__text, .amag-iconListItem__title, p"));
      if (!label && !icon) return;
      const link = item.querySelector("a[href]");
      let title = mk14(document2, "h5", label);
      if (link && label) {
        const a = mk14(document2, "a", label);
        a.setAttribute("href", link.getAttribute("href"));
        title = mk14(document2, "h5", a);
      }
      cells.push([icon ? mk14(document2, "p", icon) : "", title]);
    });
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "Icon Text Box", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-teaser.js
  var ORIGIN13 = "https://www.amag.ch";
  var txt15 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs13 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN13}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg12(img, document2) {
    if (!img) return null;
    const src = abs13(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk15 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse16(element, { document: document2 }) {
    let cards = [...element.querySelectorAll("article.amag-image-text-v2__wrapper")];
    if (!cards.length) cards = [element];
    const cells = [];
    let imageLeft = false;
    cards.forEach((card) => {
      if (/--imageLeft/.test(card.className || "")) imageLeft = true;
      const image = toImg12(card.querySelector(".amag-image-text-v2__image-wrapper img, picture img"), document2);
      const h = card.querySelector(".amag-image-text-v2__headline, h2, h3");
      const content = [];
      if (h && txt15(h)) content.push(mk15(document2, /^h2$/i.test(h.tagName) ? "h2" : "h3", txt15(h)));
      const desc = card.querySelector(".amag-image-text-v2__description");
      if (desc) {
        const ps = [...desc.querySelectorAll("p, li")].map(txt15).filter(Boolean);
        (ps.length ? ps : [txt15(desc)].filter(Boolean)).forEach((p) => content.push(mk15(document2, "p", p)));
      }
      const link = card.querySelector("a.amag-image-text-v2__link[href]");
      if (link && txt15(link)) {
        const a = mk15(document2, "a", txt15(link));
        a.setAttribute("href", link.getAttribute("href"));
        content.push(mk15(document2, "p", a));
      }
      if (!content.length && !image) return;
      cells.push([image ? mk15(document2, "p", image) : "", content]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const variants = [imageLeft ? "image-left" : "", "band-grey"].filter(Boolean).join(", ");
    const block = WebImporter.Blocks.createBlock(document2, { name: `Promo Teaser (${variants})`, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/direct-entry.js
  var ORIGIN14 = "https://www.amag.ch";
  var txt16 = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  var abs14 = (u) => {
    if (!u) return "";
    const s = u.trim();
    if (/^(data:|https?:)/i.test(s)) return s;
    if (s.startsWith("//")) return `https:${s}`;
    try {
      return new URL(s, `${ORIGIN14}/`).href;
    } catch (e) {
      return s;
    }
  };
  function toImg13(img, document2) {
    if (!img) return null;
    const src = abs14(img.getAttribute("src") || img.getAttribute("data-src"));
    if (!src) return null;
    const out = document2.createElement("img");
    out.setAttribute("src", src);
    out.setAttribute("alt", (img.getAttribute("alt") || "").trim());
    return out;
  }
  var mk16 = (document2, tag, ...kids) => {
    const e = document2.createElement(tag);
    kids.flat().forEach((k) => {
      if (k != null && k !== "") e.append(k);
    });
    return e;
  };
  function parse17(element, { document: document2 }) {
    const cells = [];
    [".amag-direct-entry__button--open", ".amag-direct-entry__button--close"].forEach((sel) => {
      const face = element.querySelector(sel);
      if (!face) return;
      const icon = toImg13(face.querySelector("img"), document2);
      const label = txt16(face.querySelector(".amag-direct-entry__label") || face);
      if (!label) return;
      cells.push([icon ? mk16(document2, "p", icon) : "", mk16(document2, "p", label)]);
    });
    const topline = txt16(element.querySelector(".amag-direct-entry__pop-up-topline"));
    if (topline) cells.push([mk16(document2, "p", topline)]);
    let entries = [...element.querySelectorAll("a.amag-direct-entry__pop-up-element[href]")];
    if (!entries.length) entries = [...element.querySelectorAll(".amag-direct-entry__pop-up a[href]")];
    entries.forEach((entry) => {
      const label = txt16(entry.querySelector(".amag-direct-entry__link") || entry);
      if (!label) return;
      const icon = toImg13(entry.querySelector("img"), document2);
      const a = mk16(document2, "a", label);
      a.setAttribute("href", entry.getAttribute("href"));
      cells.push([icon ? mk16(document2, "p", icon) : "", mk16(document2, "p", a)]);
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
  var ORIGIN15 = "https://www.amag.ch";
  function absolutize(url) {
    if (!url) return url;
    const u = url.trim();
    if (!u || u.startsWith("data:") || u.startsWith("blob:") || /^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    if (u.startsWith("//")) return `https:${u}`;
    try {
      return new URL(u, `${ORIGIN15}/`).href;
    } catch (e) {
      return u;
    }
  }
  function transform(hookName, element, payload) {
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
      ]);
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
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        hr.setAttribute(SECTION_ATTR, section.id);
        const tab = tabLabelFor(sectionEl) || TAB_FALLBACK[section.id] || "";
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
        const tab = marker.getAttribute(TAB_ATTR);
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

  // tools/importer/import-garagenuebersicht.js
  var parsers = {
    "breadcrumb": parse,
    "hero-split-garage": parse2,
    "tabs-garage": parse3,
    "vehicle-search": parse4,
    "news-cards": parse5,
    "news-cards-vehicle": parse6,
    "cta-band-contact": parse7,
    "pledge-row": parse8,
    "quick-links-brands": parse9,
    "icon-feature-grid": parse10,
    "news-cards-services": parse11,
    "promo-teaser-app": parse12,
    "image-text-card-text": parse13,
    "testimonial": parse14,
    "icon-text-box": parse15,
    "promo-teaser": parse16,
    "direct-entry": parse17
  };
  var PAGE_TEMPLATE = {
    "name": "garagenuebersicht",
    "description": "AMAG garage detail page (German): garage intro, three-tab module (vehicle offers / services / news), direct-entry pill",
    "urls": [
      "https://www.amag.ch/de/garagenuebersicht/garage-buelach.html"
    ],
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          ".amag-introGarageWithSlider__breadcrumbs"
        ]
      },
      {
        "name": "hero-split-garage",
        "instances": [
          ".amag-introGarageWithSlider"
        ]
      },
      {
        "name": "tabs-garage",
        "instances": [
          ".amag-introTabModul__tablist"
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
          ".amag-promotionTeaserBox"
        ]
      },
      {
        "name": "news-cards-vehicle",
        "instances": [
          ".amag-angeboteRecoContainer"
        ]
      },
      {
        "name": "cta-band-contact",
        "instances": [
          ".amag-tabsWrapper.aemTabs"
        ]
      },
      {
        "name": "pledge-row",
        "instances": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer:has(.amag-iconListItem)",
          ".amag-locationFacilitiesWrapper"
        ]
      },
      {
        "name": "quick-links-brands",
        "instances": [
          ".amag-brandIntroductionWrapper"
        ]
      },
      {
        "name": "icon-feature-grid",
        "instances": [
          ".amag-serviceContainerWrapper"
        ]
      },
      {
        "name": "news-cards-services",
        "instances": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-serviceContainerWrapper) .cmp-carousel"
        ]
      },
      {
        "name": "promo-teaser-app",
        "instances": [
          ".amag-app-download"
        ]
      },
      {
        "name": "image-text-card-text",
        "instances": [
          ".amag-maxiTeaser"
        ]
      },
      {
        "name": "testimonial",
        "instances": [
          ".amag-quoteContainer"
        ]
      },
      {
        "name": "icon-text-box",
        "instances": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer",
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer) .amag-iconListContainer"
        ]
      },
      {
        "name": "promo-teaser",
        "instances": [
          ".amag-image-text-v2"
        ]
      },
      {
        "name": "direct-entry",
        "instances": [
          ".amag-direct-entry"
        ]
      }
    ],
    "sections": [
      {
        "id": "1",
        "name": "Garage intro",
        "selector": [
          ".amag-content > section.section:has(.amag-introGarageWithSlider)"
        ],
        "style": null,
        "blocks": [
          "breadcrumb",
          "hero-split-garage"
        ],
        "defaultContent": []
      },
      {
        "id": "2",
        "name": "Garage tab bar",
        "selector": [
          ".amag-introTabModul__tablist"
        ],
        "style": null,
        "blocks": [
          "tabs-garage"
        ],
        "defaultContent": []
      },
      {
        "id": "3",
        "name": "Vehicle search",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-dspSearch)"
        ],
        "style": null,
        "blocks": [
          "vehicle-search"
        ],
        "defaultContent": []
      },
      {
        "id": "4",
        "name": "News und Angebote",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-promotionTeaserBox)"
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
        "id": "5",
        "name": "Vehicle offers carousel",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-angeboteRecoContainer)"
        ],
        "style": null,
        "blocks": [
          "news-cards-vehicle"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amag-angeboteRecoContainer__carousel--descriptionHeadline",
          ".amag-angeboteRecoContainer__carousel--descriptionLink a"
        ]
      },
      {
        "id": "6",
        "name": "Sales contact",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-tabsWrapper.aemTabs)"
        ],
        "style": null,
        "blocks": [
          "cta-band-contact"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline"
        ]
      },
      {
        "id": "7",
        "name": "Unser AMAG Versprechen",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
        ],
        "style": null,
        "blocks": [
          "pledge-row"
        ],
        "defaultContent": [
          ".amag-iconListContainer:has(.amag-iconListItem) .amag-iconListContainer__headline h2"
        ]
      },
      {
        "id": "8",
        "name": "Alle Fahrzeuge der AMAG Garagen",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(1) > .responsivegrid > .aem-Grid > section.section:has(.amag-brandIntroductionWrapper)"
        ],
        "style": null,
        "blocks": [
          "quick-links-brands"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline"
        ]
      },
      {
        "id": "9",
        "name": "Auto-Serviceleistungen",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-serviceContainerWrapper)"
        ],
        "style": null,
        "blocks": [
          "icon-feature-grid",
          "news-cards-services"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amagCh-carousel-description__headline",
          ".amagCh-carousel-description__subtext"
        ]
      },
      {
        "id": "10",
        "name": "AMAG App",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-app-download)"
        ],
        "style": null,
        "blocks": [
          "promo-teaser-app"
        ],
        "defaultContent": []
      },
      {
        "id": "11",
        "name": "AMAG Fleet & Services",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-maxiTeaser)"
        ],
        "style": null,
        "blocks": [
          "image-text-card-text"
        ],
        "defaultContent": []
      },
      {
        "id": "12",
        "name": "Service contact",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-tabsWrapper.aemTabs)"
        ],
        "style": null,
        "blocks": [
          "cta-band-contact"
        ],
        "defaultContent": []
      },
      {
        "id": "13",
        "name": "Customer quote",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-quoteContainer)"
        ],
        "style": null,
        "blocks": [
          "testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "14",
        "name": "Service icon labels",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(2) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
        ],
        "style": null,
        "blocks": [
          "icon-text-box"
        ],
        "defaultContent": []
      },
      {
        "id": "15",
        "name": "Neuigkeiten und Veranstaltungen",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-newsTeaser)"
        ],
        "style": "grey",
        "blocks": [],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline",
          ".amag-newsTeaser-noEntry"
        ]
      },
      {
        "id": "16",
        "name": "Newsletter teaser",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-image-text-v2)"
        ],
        "style": null,
        "blocks": [
          "promo-teaser"
        ],
        "defaultContent": []
      },
      {
        "id": "17",
        "name": "Service icon labels (News tab)",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-iconListContainer)"
        ],
        "style": null,
        "blocks": [
          "icon-text-box"
        ],
        "defaultContent": []
      },
      {
        "id": "18",
        "name": "Jobs bei AMAG",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-maxiTeaser)"
        ],
        "style": null,
        "blocks": [
          "image-text-card-text"
        ],
        "defaultContent": []
      },
      {
        "id": "19",
        "name": "Unsere Ausstattung",
        "selector": [
          ".amag-introTabModul .cmp-tabs__tabpanel:nth-of-type(3) > .responsivegrid > .aem-Grid > section.section:has(.amag-locationFacilitiesWrapper)"
        ],
        "style": null,
        "blocks": [
          "pledge-row"
        ],
        "defaultContent": [
          ".amagCh-section-description__theme",
          ".amagCh-section-description__headline"
        ]
      },
      {
        "id": "20",
        "name": "Mehr \xFCber AMAG B\xFClach",
        "selector": [
          ".amag-introTabModul .cmp-tabs > .amagCh-section__container"
        ],
        "style": "grey",
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "21",
        "name": "Direkt zu pill",
        "selector": [
          ".amag-content > .amag-direct-entry"
        ],
        "style": null,
        "blocks": [
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
  var import_garagenuebersicht_default = {
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
      WebImporter.rules.createMetadata(main, document2);
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
  return __toCommonJS(import_garagenuebersicht_exports);
})();
