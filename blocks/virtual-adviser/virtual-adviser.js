import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** Decorative green curved arrow SVG shown between columns */
const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" fill="none" aria-hidden="true">
  <path d="M4 4 C 20 4, 60 4, 72 36" stroke="#33804D" stroke-width="3" stroke-linecap="round" fill="none"/>
  <polyline points="60,32 72,36 68,48" stroke="#33804D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

/**
 * Returns true when a cell contains only media (picture/img) and no visible text.
 */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Single-row block: first cell = image, second cell = text content
  const row = rows[0];
  const cells = [...row.children];

  // ── Left column: image panel ─────────────────────────────
  const leftPanel = document.createElement('div');
  leftPanel.className = 'virtual-adviser-image-panel';

  const imageCell = cells[0];
  if (imageCell) {
    // Support both <picture><img> (document) and bare <img> (UE)
    const picture = imageCell.querySelector('picture');
    const bareImg = !picture ? imageCell.querySelector('img') : null;
    const img = picture ? picture.querySelector('img') : bareImg;

    if (img && img.src) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
        { media: '(min-width: 900px)', width: '800' },
        { width: '600' },
      ]);
      moveInstrumentation(img, optimized.querySelector('img'));
      if (picture) picture.replaceWith(optimized);
      else bareImg.replaceWith(optimized);
      leftPanel.append(optimized);
    }
  }

  // ── Decorative arrow (absolutely positioned between columns) ─
  const arrowEl = document.createElement('div');
  arrowEl.className = 'virtual-adviser-arrow';
  arrowEl.innerHTML = ARROW_SVG;

  // ── Right column: text content ───────────────────────────
  const rightPanel = document.createElement('div');
  rightPanel.className = 'virtual-adviser-content';

  const contentCell = cells[1];
  if (contentCell) {
    moveInstrumentation(contentCell, rightPanel);

    // Move all children into the right panel, classifying links as CTAs
    [...contentCell.children].forEach((child) => {
      // Paragraphs containing only an <a> → CTA link
      if (child.tagName === 'P') {
        const anchors = [...child.querySelectorAll('a')];
        const nonLinkText = child.textContent.replace(
          anchors.map((a) => a.textContent).join(''),
          '',
        ).trim();
        if (anchors.length && !nonLinkText) {
          anchors.forEach((a) => a.classList.add('virtual-adviser-cta'));
          child.classList.add('virtual-adviser-cta-wrapper');
        }
      }
      rightPanel.append(child);
    });
  }

  // ── Rebuild block DOM ────────────────────────────────────
  block.replaceChildren(leftPanel, arrowEl, rightPanel);
}
