import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.45)"/>
  <polygon points="24,16 52,32 24,48" fill="#fff"/>
</svg>`;

const STARS = '★★★★★';

/** Returns true when a cell holds only media and no text */
function isMediaCell(div) {
  if (!div.querySelector('picture, img')) return false;
  const clone = div.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

/** Build one review card from a block row */
function buildCard(row) {
  const card = document.createElement('li');
  card.className = 'cr-card';
  moveInstrumentation(row, card);

  const cells = [...row.children];
  let videoUrl = '';
  let duration = '';
  let thumbnailPicture = null;
  let reviewText = '';
  let tags = [];
  let customerName = '';

  // ── Parse cells ────────────────────────────────────────────────────────
  cells.forEach((cell) => {
    const text = cell.textContent.trim();

    if (isMediaCell(cell)) {
      // Thumbnail image
      const picture = cell.querySelector('picture');
      const bareImg = !picture ? cell.querySelector('img') : null;
      const img = picture ? picture.querySelector('img') : bareImg;
      if (img && img.src) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
          { media: '(min-width: 900px)', width: '420' },
          { width: '320' },
        ]);
        moveInstrumentation(img, optimized.querySelector('img'));
        thumbnailPicture = optimized;
      }
    } else if (/^https?:\/\//.test(text) || (cell.querySelector('a') && !cell.textContent.replace(cell.querySelector('a').textContent, '').trim())) {
      // Video URL cell — plain URL or a single bare link
      const anchor = cell.querySelector('a');
      videoUrl = anchor ? anchor.href : text;
    } else if (/^\d+:\d+$/.test(text)) {
      // Duration cell e.g. "0:30"
      duration = text;
    } else {
      // Generic text cell — look at children for structured content
      [...cell.children].forEach((child) => {
        const childText = child.textContent.trim();
        if (child.tagName === 'P') {
          // Tags: comma-separated inside a <p> with no heading
          const anchors = [...child.querySelectorAll('a')];
          if (anchors.length === 0 && /^[A-Za-z0-9 ,&-]+$/.test(childText) && childText.includes(',')) {
            tags = childText.split(',').map((t) => t.trim()).filter(Boolean);
          } else if (childText.startsWith('-') || childText.startsWith('–')) {
            customerName = childText;
          } else {
            reviewText += (reviewText ? ' ' : '') + childText;
          }
        } else if (child.tagName === 'UL' || child.tagName === 'OL') {
          tags = [...child.querySelectorAll('li')].map((li) => li.textContent.trim());
        } else {
          reviewText += (reviewText ? ' ' : '') + childText;
        }
      });
    }
  });

  // ── Video / thumbnail panel ────────────────────────────────────────────
  const videoWrap = document.createElement('div');
  videoWrap.className = 'cr-video';

  if (thumbnailPicture) {
    videoWrap.append(thumbnailPicture);
  }

  if (duration) {
    const badge = document.createElement('span');
    badge.className = 'cr-duration';
    badge.textContent = duration;
    videoWrap.append(badge);
  }

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'cr-play';
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = PLAY_ICON;

  if (videoUrl) {
    playBtn.addEventListener('click', () => {
      // Replace thumbnail with an iframe
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl.includes('?')
        ? `${videoUrl}&autoplay=1`
        : `${videoUrl}?autoplay=1`;
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      iframe.className = 'cr-iframe';
      iframe.title = customerName || 'Customer review video';
      videoWrap.innerHTML = '';
      videoWrap.append(iframe);
    });
  }

  videoWrap.append(playBtn);

  // ── Info panel ─────────────────────────────────────────────────────────
  const info = document.createElement('div');
  info.className = 'cr-info';

  const stars = document.createElement('p');
  stars.className = 'cr-stars';
  stars.setAttribute('aria-label', '5 stars');
  stars.textContent = STARS;
  info.append(stars);

  if (reviewText) {
    const review = document.createElement('p');
    review.className = 'cr-review';
    review.textContent = reviewText;
    info.append(review);
  }

  if (tags.length) {
    const tagList = document.createElement('div');
    tagList.className = 'cr-tags';
    tags.forEach((tag) => {
      const pill = document.createElement('span');
      pill.className = 'cr-tag';
      pill.textContent = tag;
      tagList.append(pill);
    });
    info.append(tagList);
  }

  if (customerName) {
    const name = document.createElement('p');
    name.className = 'cr-name';
    name.textContent = customerName;
    info.append(name);
  }

  card.append(videoWrap, info);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  if (!rows.length) return;

  // ── Track ──────────────────────────────────────────────────────────────
  const track = document.createElement('ul');
  track.className = 'cr-track';
  rows.forEach((row) => track.append(buildCard(row)));

  const viewport = document.createElement('div');
  viewport.className = 'cr-viewport';
  viewport.append(track);

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'cr-btn cr-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'cr-btn cr-btn-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  const carousel = document.createElement('div');
  carousel.className = 'cr-carousel';
  carousel.append(prevBtn, viewport, nextBtn);
  block.append(carousel);

  // ── Logic ──────────────────────────────────────────────────────────────
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

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(Math.min(current, maxIndex())), 200);
  });

  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(current + (delta > 0 ? 1 : -1));
  }, { passive: true });

  updateButtons();
}
