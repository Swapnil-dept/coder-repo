import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Returns true when a block cell contains only media (picture or img) and no visible text.
 * Handles both document-authored (<picture>) and UE-authored (<img>) content,
 * as well as cells with trailing empty <p> tags.
 */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (isMediaCell(div)) {
        div.className = 'news-cards-image';
      } else {
        div.className = 'news-cards-body';
        const links = div.querySelectorAll('a');
        if (links.length) {
          const lastLink = links[links.length - 1];
          lastLink.classList.add('news-cards-cta');
          const btnContainer = lastLink.closest('p') || lastLink.parentElement;
          if (btnContainer) btnContainer.classList.add('news-cards-cta-wrapper');
        }
      }
    });
    ul.append(li);
  });

  // Optimize images — works for both <picture><img> and bare <img>
  ul.querySelectorAll('img').forEach((img) => {
    if (!img.src) return;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    const existingPicture = img.closest('picture');
    if (existingPicture) {
      existingPicture.replaceWith(optimized);
    } else {
      img.replaceWith(optimized);
    }
  });

  block.replaceChildren(ul);
}
