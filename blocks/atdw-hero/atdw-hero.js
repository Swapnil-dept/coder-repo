/**
 * ATDW Hero block: full-width image gallery (swiper carousel), property title,
 * breadcrumb trail, and Best of Queensland badge.
 * Model field order (one single-cell row per field):
 *   Row 0: galleryImages
 *   Row 1: title
 *   Row 2: breadcrumb
 *   Row 3: boqeImage
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 2) return;

  const galleryRow = rows[0];   // field: galleryImages
  const titleRow   = rows[1];   // field: title
  const breadcrumb = rows[2]?.firstElementChild?.textContent?.trim()
    || rows[2]?.textContent?.trim() || '';
  const boqeRow    = rows[3];   // field: boqeImage

  /* ── Gallery ── */
  const pictures = [...galleryRow.querySelectorAll('picture')];
  const galleryEl = document.createElement('div');
  galleryEl.className = 'atdw-hero-gallery';

  const track = document.createElement('div');
  track.className = 'atdw-hero-gallery-track';

  pictures.forEach((pic, i) => {
    const slide = document.createElement('div');
    slide.className = 'atdw-hero-gallery-slide';
    if (i === 0) slide.classList.add('active');
    slide.appendChild(pic);
    track.appendChild(slide);
  });

  galleryEl.appendChild(track);

  // Navigation dots
  if (pictures.length > 1) {
    const dots = document.createElement('div');
    dots.className = 'atdw-hero-gallery-dots';
    pictures.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `atdw-hero-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.dataset.index = i;
      dots.appendChild(dot);
    });
    galleryEl.appendChild(dots);

    // Previous / Next buttons
    ['prev', 'next'].forEach((dir) => {
      const btn = document.createElement('button');
      btn.className = `atdw-hero-gallery-${dir}`;
      btn.setAttribute('aria-label', dir === 'prev' ? 'Previous image' : 'Next image');
      btn.textContent = dir === 'prev' ? '‹' : '›';
      galleryEl.appendChild(btn);
    });
  }

  /* ── Title ── */
  const titleEl = document.createElement('div');
  titleEl.className = 'atdw-hero-title';
  titleEl.innerHTML = titleRow.innerHTML;

  /* ── Breadcrumb ── */
  let breadcrumbEl;
  if (breadcrumb) {
    breadcrumbEl = document.createElement('p');
    breadcrumbEl.className = 'atdw-hero-breadcrumb';
    breadcrumbEl.textContent = breadcrumb;
  }

  /* ── Best of Queensland badge ── */
  let boqeEl;
  const boqePicture = boqeRow?.querySelector('picture, img');
  if (boqePicture) {
    boqeEl = document.createElement('div');
    boqeEl.className = 'atdw-hero-boqe';
    boqeEl.appendChild(boqePicture.closest('picture') || boqePicture);
  }

  /* ── Assemble ── */
  block.textContent = '';
  block.appendChild(galleryEl);
  block.appendChild(titleEl);
  if (breadcrumbEl) block.appendChild(breadcrumbEl);
  if (boqeEl) block.appendChild(boqeEl);

  /* ── Carousel interaction ── */
  let current = 0;
  const slides = [...track.querySelectorAll('.atdw-hero-gallery-slide')];
  const dotBtns = [...block.querySelectorAll('.atdw-hero-dot')];

  function goTo(index) {
    slides[current].classList.remove('active');
    dotBtns[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotBtns[current]?.classList.add('active');
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  block.querySelector('.atdw-hero-gallery-prev')?.addEventListener('click', () => goTo(current - 1));
  block.querySelector('.atdw-hero-gallery-next')?.addEventListener('click', () => goTo(current + 1));
  dotBtns.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}
