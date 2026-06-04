import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** Returns true when a cell holds only media (picture/img) and no visible text */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  // ── Collect items (each authored row = one card) ──────────────────────
  const track = document.createElement('ul');
  track.className = 'mc-track';
  track.setAttribute('role', 'list');

  rows.forEach((row) => {
    const slide = document.createElement('li');
    slide.className = 'mc-item';
    moveInstrumentation(row, slide);

    [...row.children].forEach((cell) => {
      if (isMediaCell(cell)) {
        const imageWrap = document.createElement('div');
        imageWrap.className = 'mc-item-image';

        const picture = cell.querySelector('picture');
        const bareImg = !picture ? cell.querySelector('img') : null;
        const img = picture ? picture.querySelector('img') : bareImg;

        if (img && img.src) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { media: '(min-width: 900px)', width: '500' },
            { width: '400' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          imageWrap.append(optimized);
        }
        slide.append(imageWrap);
      } else {
        // ── Caption / text cell ────────────────────────────────────────
        const caption = document.createElement('div');
        caption.className = 'mc-item-caption';
        [...cell.children].forEach((child) => caption.append(child));
        slide.append(caption);
      }
    });

    track.append(slide);
  });

  // ── Build carousel shell ───────────────────────────────────────────────
  const viewport = document.createElement('div');
  viewport.className = 'mc-viewport';
  viewport.append(track);

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'mc-btn mc-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'mc-btn mc-btn-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  const carousel = document.createElement('div');
  carousel.className = 'mc-carousel';
  carousel.append(prevBtn, viewport, nextBtn);
  block.append(carousel);

  // ── Carousel logic ─────────────────────────────────────────────────────
  const totalItems = rows.length;
  let current = 0;

  function getPerView() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function maxIndex() {
    return Math.max(0, totalItems - getPerView());
  }

  function updateButtons() {
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= maxIndex();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const pct = (100 / getPerView()) * current;
    track.style.transform = `translateX(-${pct}%)`;
    updateButtons();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Revalidate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(Math.min(current, maxIndex())), 200);
  });

  // Touch / swipe support
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(current + (delta > 0 ? 1 : -1));
  }, { passive: true });

  updateButtons();
}
