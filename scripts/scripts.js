import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Wraps images in a clickable <a> tag when a link is present.
 *
 * Handles two authoring patterns:
 *  1. Document authoring — author wraps image in a hyperlink → already <a><picture></a>
 *  2. UE authoring — the `link` field renders as a sibling <p><a href="..."> next to
 *     the <p><picture> inside the .img-wrapper div. We detect that sibling, grab its
 *     href, wrap the picture in a new <a>, and remove the now-redundant link paragraph.
 *  3. data attribute — UE may also surface the value as data-link on the wrapper div.
 *
 * @param {Element} main The main element
 */
function decorateImageLinks(main) {
  main.querySelectorAll('.img-wrapper').forEach((wrapper) => {
    const picture = wrapper.querySelector('picture') || wrapper.querySelector('img');
    if (!picture) return;

    // Already linked (document authoring)
    if (picture.closest('a')) return;

    // Pattern 1: data-link / data-image-link attribute set by UE on the wrapper div
    let href = wrapper.dataset.link || wrapper.dataset.imageLink;

    // Pattern 2: sibling <p> containing only an <a> (UE aem-content field renders this)
    if (!href) {
      const linkPara = [...wrapper.querySelectorAll('p')].find((p) => {
        const anchors = p.querySelectorAll('a');
        return anchors.length === 1
          && p.textContent.trim() === anchors[0].textContent.trim();
      });
      if (linkPara) {
        href = linkPara.querySelector('a').href;
        linkPara.remove(); // remove the redundant link paragraph from the DOM
      }
    }

    if (!href) return;

    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.setAttribute('aria-label', wrapper.querySelector('img')?.alt || 'View more');
    picture.replaceWith(anchor);
    anchor.append(picture);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateImageLinks(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
