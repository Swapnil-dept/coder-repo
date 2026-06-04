import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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

  const leftPanel = document.createElement('div');
  leftPanel.className = 'virtual-adviser-image-panel';

  const rightPanel = document.createElement('div');
  rightPanel.className = 'virtual-adviser-content';

  // Iterate ALL rows and cells — works for both document-authored (2-column row)
  // and UE-authored (one field per row) DOM structures.
  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (isMediaCell(cell)) {
        // ── Image cell → left panel ──────────────────────────
        const picture = cell.querySelector('picture');
        const bareImg = !picture ? cell.querySelector('img') : null;
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
      } else {
        // ── Text cell → right panel ──────────────────────────
        [...cell.children].forEach((child) => {
          if (child.tagName === 'P') {
            const anchors = [...child.querySelectorAll('a')];
            const nonLinkText = child.textContent
              .replace(anchors.map((a) => a.textContent).join(''), '')
              .trim();
            if (anchors.length && !nonLinkText) {
              anchors.forEach((a) => a.classList.add('virtual-adviser-cta'));
              child.classList.add('virtual-adviser-cta-wrapper');
            }
          }
          rightPanel.append(child);
        });
      }
    });
  });

  block.replaceChildren(leftPanel, rightPanel);
}
