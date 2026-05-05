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

  // tools/importer/import-ageupl-homepage.js
  var import_ageupl_homepage_exports = {};
  __export(import_ageupl_homepage_exports, {
    default: () => import_ageupl_homepage_default
  });

  // tools/importer/parsers/hero-ageupl.js
  function parse(element, { document }) {
    const activeItem = element.querySelector(".slick-current .item, .slick-current, .slick-slide.slick-active");
    const item = activeItem || element.querySelector(".item");
    if (!item) return;
    const img = item.querySelector("img");
    const heading = item.querySelector("h5") || item.querySelector("h1, h2, h3, h4");
    const subtitle = item.querySelector(".border-l, .left--border-banner p, p");
    const cells = [["Hero"]];
    const contentCell = document.createElement("div");
    if (img) {
      const picture = document.createElement("picture");
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt || "Hero banner";
      picture.appendChild(imgEl);
      contentCell.appendChild(picture);
    }
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.appendChild(h1);
    }
    if (subtitle && subtitle.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = subtitle.textContent.trim();
      contentCell.appendChild(p);
    }
    cells.push([contentCell]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-leadership.js
  function parse2(element, { document }) {
    const leaders = element.querySelectorAll(".left--image-leader1");
    if (leaders.length === 0) return;
    const cells = [["Cards"]];
    leaders.forEach((imgDiv) => {
      const img = imgDiv.querySelector("img");
      const dataDiv = imgDiv.nextElementSibling;
      if (!dataDiv) return;
      const name = dataDiv.querySelector(".NameOfTheLeader h2, .name--blue--leader");
      const designation = dataDiv.querySelector(".DesignationOfTheLeader p");
      const description = dataDiv.querySelector(".DesignationOfDescription p");
      const imageCell = document.createElement("div");
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        picture.appendChild(imgEl);
        imageCell.appendChild(picture);
      }
      const textCell = document.createElement("div");
      if (name) {
        const h3 = document.createElement("h3");
        h3.textContent = name.textContent.trim();
        textCell.appendChild(h3);
      }
      if (designation) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = designation.textContent.trim();
        p.appendChild(em);
        textCell.appendChild(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns-investor.js
  function parse3(element, { document }) {
    const imgEl = element.querySelector(".image--investor img");
    const linksDiv = element.querySelector(".investor--links");
    if (!imgEl && !linksDiv) return;
    const cells = [["Columns"]];
    const leftCell = document.createElement("div");
    if (imgEl) {
      const picture = document.createElement("picture");
      const img = document.createElement("img");
      img.src = imgEl.src;
      img.alt = imgEl.alt || "Investor Corner";
      picture.appendChild(img);
      leftCell.appendChild(picture);
    }
    const rightCell = document.createElement("div");
    if (linksDiv) {
      const links = linksDiv.querySelectorAll("a");
      links.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.appendChild(a);
        rightCell.appendChild(p);
      });
    }
    cells.push([leftCell, rightCell]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-group-websites.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".item.zoomin.slick-slide:not(.slick-cloned)");
    if (items.length === 0) return;
    const cells = [["Cards"]];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const link = item.querySelector("a");
      const name = item.querySelector("p a") || item.querySelector("p");
      const imageCell = document.createElement("div");
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        picture.appendChild(imgEl);
        imageCell.appendChild(picture);
      }
      const textCell = document.createElement("div");
      if (link && name) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = name.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/cleanup-ageupl.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      const removeSelectors = [
        "header",
        "footer",
        "nav",
        ".overlay-top",
        ".slick-dots",
        ".slick-arrow",
        ".OGWPrevBtn",
        ".OGWNextBtn",
        ".slick-cloned",
        ".cookie-banner",
        "#cookie-consent",
        ".recaptcha-badge",
        "noscript",
        "iframe"
      ];
      removeSelectors.forEach((selector) => {
        element.querySelectorAll(selector).forEach((el) => el.remove());
      });
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("div:empty").forEach((el) => {
        if (!el.closest("table")) {
          el.remove();
        }
      });
    }
  }

  // tools/importer/import-ageupl-homepage.js
  var parsers = {
    "hero-ageupl": parse,
    "cards-leadership": parse2,
    "columns-investor": parse3,
    "cards-group-websites": parse4
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "ageupl-homepage",
    description: "Adani Green Energy UP homepage with hero, leadership cards, investor corner, and group websites",
    urls: [
      "https://www.ageupl.com/"
    ],
    blocks: [
      {
        name: "hero-ageupl",
        instances: ["section.banner-home-page"]
      },
      {
        name: "cards-leadership",
        instances: [".owl-carousel.leader--row-data"]
      },
      {
        name: "columns-investor",
        instances: [".row.d-flex.align-items-center.justify-content-center"]
      },
      {
        name: "cards-group-websites",
        instances: ["#otherVentures"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
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
  var import_ageupl_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_ageupl_homepage_exports);
})();
