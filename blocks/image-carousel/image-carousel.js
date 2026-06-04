import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const AUTOPLAY_INTERVAL = 5000;

/** Returns true when a cell has only media and no visible text */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

/** Build a single slide element from a block row */
function buildSlide(row) {
  const cells = [...row.children];
  const slide = document.createElement('li');
  slide.className = 'image-carousel-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const imageWrap = document.createElement('div');
  imageWrap.className = 'image-carousel-slide-image';

  const contentWrap = document.createElement('div');
  contentWrap.className = 'image-carousel-slide-content';

  cells.forEach((cell) => {
    if (isMediaCell(cell)) {
      // ── Image cell ─────────────────────────────────────────
      const picture = cell.querySelector('picture');
      const bareImg = !picture ? cell.querySelector('img') : null;
      const img = picture ? picture.querySelector('img') : bareImg;

      if (img && img.src) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
          { media: '(min-width: 900px)', width: '1200' },
          { width: '800' },
        ]);
        moveInstrumentation(img, optimized.querySelector('img'));
        if (picture) picture.replaceWith(optimized);
        else bareImg.replaceWith(optimized);
        imageWrap.append(optimized);
      }
    } else {
      // ── Text cell: move children, style CTA ───────────────
      [...cell.children].forEach((child) => {
        if (child.tagName === 'P') {
          const anchors = [...child.querySelectorAll('a')];
          const nonLinkText = child.textContent
            .replace(anchors.map((a) => a.textContent).join(''), '')
            .trim();
          if (anchors.length && !nonLinkText) {
            anchors.forEach((a) => a.classList.add('image-carousel-cta'));
            child.classList.add('image-carousel-cta-wrapper');
          }
        }
        contentWrap.append(child);
      });
    }
  });

  // Read optional background color from a data attribute set in JSON / UE
  const bgColor = row.dataset.backgroundColor || '';
  if (bgColor) slide.style.setProperty('--slide-bg', bgColor);

  slide.append(imageWrap, contentWrap);
  return slide;
}

/** Move to slide index; update aria and active class */
function goTo(state, index) {
  const { slides, track, dots, totalSlides } = state;
  const next = (index + totalSlides) % totalSlides;

  slides[state.current].classList.remove('active');
  slides[state.current].setAttribute('aria-hidden', 'true');
  if (dots) {
    dots[state.current].classList.remove('active');
    dots[state.current].setAttribute('aria-selected', 'false');
  }

  state.current = next;
  slides[next].classList.add('active');
  slides[next].removeAttribute('aria-hidden');
  track.style.transform = `translateX(-${next * 100}%)`;
  if (dots) {
    dots[next].classList.add('active');
    dots[next].setAttribute('aria-selected', 'true');
  }
}

/** Start auto-play */
function startAutoplay(state) {
  state.timer = setInterval(() => goTo(state, state.current + 1), AUTOPLAY_INTERVAL);
}

/** Stop auto-play */
function stopAutoplay(state) {
  clearInterval(state.timer);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // ── Build track + slides ──────────────────────────────────
  const track = document.createElement('ul');
  track.className = 'image-carousel-track';
  track.setAttribute('role', 'list');

  const slideEls = rows.map((row) => {
    const slide = buildSlide(row);
    track.append(slide);
    return slide;
  });

  const totalSlides = slideEls.length;

  // ── Prev / Next buttons ───────────────────────────────────
  const prevBtn = document.createElement('button');
  prevBtn.className = 'image-carousel-btn image-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'image-carousel-btn image-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#10095;';

  // ── Dots ──────────────────────────────────────────────────
  let dotsEls = null;
  let dotsNav = null;
  if (totalSlides > 1) {
    dotsNav = document.createElement('div');
    dotsNav.className = 'image-carousel-dots';
    dotsNav.setAttribute('role', 'tablist');
    dotsEls = slideEls.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'image-carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dotsNav.append(dot);
      return dot;
    });
  }

  // ── State ─────────────────────────────────────────────────
  const state = {
    current: 0,
    totalSlides,
    slides: slideEls,
    track,
    dots: dotsEls,
    timer: null,
  };

  // Activate first slide
  slideEls[0].classList.add('active');
  slideEls.forEach((s, i) => { if (i !== 0) s.setAttribute('aria-hidden', 'true'); });

  // ── Events ────────────────────────────────────────────────
  prevBtn.addEventListener('click', () => {
    stopAutoplay(state);
    goTo(state, state.current - 1);
    startAutoplay(state);
  });

  nextBtn.addEventListener('click', () => {
    stopAutoplay(state);
    goTo(state, state.current + 1);
    startAutoplay(state);
  });

  if (dotsEls) {
    dotsEls.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoplay(state);
        goTo(state, i);
        startAutoplay(state);
      });
    });
  }

  // Swipe / touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay(state);
      goTo(state, state.current + (diff > 0 ? 1 : -1));
      startAutoplay(state);
    }
  }, { passive: true });

  // Pause autoplay on hover
  block.addEventListener('mouseenter', () => stopAutoplay(state));
  block.addEventListener('mouseleave', () => startAutoplay(state));

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { stopAutoplay(state); goTo(state, state.current - 1); startAutoplay(state); }
    if (e.key === 'ArrowRight') { stopAutoplay(state); goTo(state, state.current + 1); startAutoplay(state); }
  });

  // ── Assemble ──────────────────────────────────────────────
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.replaceChildren(prevBtn, track, nextBtn);
  if (dotsNav) block.append(dotsNav);

  if (totalSlides > 1) startAutoplay(state);
}
