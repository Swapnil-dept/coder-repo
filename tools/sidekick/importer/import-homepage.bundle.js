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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const activeItem = element.querySelector(".bootstrape-item.active .item") || element.querySelector(".bootstrape-item .item") || element.querySelector(".item");
    if (!activeItem) return;
    const img = activeItem.querySelector("img");
    const heading = activeItem.querySelector("h1");
    const link = activeItem.querySelector("a");
    const cells = [["Hero"]];
    const contentCell = document.createElement("div");
    if (img) {
      const picture = document.createElement("picture");
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt || "";
      picture.appendChild(imgEl);
      contentCell.appendChild(picture);
    }
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.appendChild(h1);
    }
    if (link) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      contentCell.appendChild(p);
    }
    cells.push([contentCell]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const rows = [];
    const cols = [...element.children].filter((el) => el.classList.contains("col-lg-7") || el.classList.contains("col-lg-5"));
    for (let i = 0; i < cols.length; i += 2) {
      const left = cols[i];
      const right = cols[i + 1];
      const leftContent = document.createElement("div");
      const rightContent = document.createElement("div");
      if (left) {
        const h3 = left.querySelector("h3");
        const p = left.querySelector("p");
        if (h3) {
          const heading = document.createElement("h3");
          heading.textContent = h3.textContent.trim();
          leftContent.appendChild(heading);
        }
        if (p && p.textContent.trim()) {
          const para = document.createElement("p");
          para.textContent = p.textContent.trim();
          leftContent.appendChild(para);
        }
      }
      if (right) {
        const h3 = right.querySelector("h3");
        const p = right.querySelector("p");
        if (h3) {
          const heading = document.createElement("h3");
          heading.textContent = h3.textContent.trim();
          rightContent.appendChild(heading);
        }
        if (p && p.textContent.trim()) {
          const para = document.createElement("p");
          para.textContent = p.textContent.trim();
          rightContent.appendChild(para);
        }
      }
      if (leftContent.children.length > 0 || rightContent.children.length > 0) {
        rows.push([leftContent, rightContent]);
      }
    }
    if (rows.length === 0) return;
    const cells = [["Columns"], ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      const removeSelectors = [
        "nav",
        ".bootstrape-nav",
        ".bootstrape-dots",
        ".bootstrape-item.cloned",
        "footer",
        ".cookie-banner",
        "#cookie-consent"
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "columns": parse2
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "NPRPL homepage with hero banner and project details",
    urls: [
      "https://www.nprpl.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.main-banner"]
      },
      {
        name: "columns",
        instances: ["section.main_content .row"]
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
  var import_homepage_default = {
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
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
