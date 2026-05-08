import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-gallery-image';
      else div.className = 'cards-gallery-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'cards-gallery-overlay';
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Image preview');
  overlay.innerHTML = '<button class="cards-gallery-overlay-close" aria-label="Close">&times;</button><div class="cards-gallery-overlay-img"></div>';
  block.append(overlay);

  ul.querySelectorAll('.cards-gallery-image picture').forEach((picture) => {
    picture.style.cursor = 'zoom-in';
    picture.addEventListener('click', () => {
      const clone = picture.cloneNode(true);
      overlay.querySelector('.cards-gallery-overlay-img').replaceChildren(clone);
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.querySelector('.cards-gallery-overlay-close').addEventListener('click', () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  block.replaceChildren(ul, overlay);
}
