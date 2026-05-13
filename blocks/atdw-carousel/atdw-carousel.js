/**
 * ATDW Carousel block: horizontal scrollable cards ("You May Also Like").
 * Model field order (one single-cell row per field):
 *   Row 0: heading
 *   Row 1: image
 *   Row 2: category
 *   Row 3: title
 *   Row 4: description
 *   Row 5: link
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getValue = (index) => rows[index]?.firstElementChild?.textContent?.trim()
    || rows[index]?.textContent?.trim() || '';

  const heading    = getValue(0);
  const imgPicture = rows[1]?.querySelector('picture');
  const category   = getValue(2);
  const title      = getValue(3);
  const desc       = getValue(4);
  const link       = getValue(5);

  // ── Heading ─────────────────────────────────────────────────────────────────
  const headingEl = document.createElement('h2');
  headingEl.className = 'atdw-carousel-heading';
  headingEl.textContent = heading;

  // ── Card track ───────────────────────────────────────────────────────────────
  const track = document.createElement('div');
  track.className = 'atdw-carousel-track';

  if (title) {
    const card = document.createElement('article');
    card.className = 'atdw-carousel-card';

    if (imgPicture) {
      const media = document.createElement('div');
      media.className = 'atdw-carousel-card-media';
      media.appendChild(imgPicture);
      card.appendChild(media);
    }

    const content = document.createElement('div');
    content.className = 'atdw-carousel-card-content';

    if (category) {
      const cat = document.createElement('span');
      cat.className = 'atdw-carousel-card-category';
      cat.textContent = category;
      content.appendChild(cat);
    }

    const titleEl = document.createElement('h3');
    titleEl.className = 'atdw-carousel-card-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);

    if (desc) {
      const descEl = document.createElement('p');
      descEl.className = 'atdw-carousel-card-desc';
      descEl.textContent = desc;
      content.appendChild(descEl);
    }

    if (link) {
      const linkEl = document.createElement('a');
      linkEl.className = 'atdw-carousel-card-link';
      linkEl.href = link;
      linkEl.textContent = 'Read More';
      content.appendChild(linkEl);
    }

    card.appendChild(content);
    track.appendChild(card);
  }

  // ── Nav buttons ──────────────────────────────────────────────────────────────
  const prevBtn = document.createElement('button');
  prevBtn.className = 'atdw-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'atdw-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '›';

  prevBtn.addEventListener('click', () => { track.scrollBy({ left: -300, behavior: 'smooth' }); });
  nextBtn.addEventListener('click', () => { track.scrollBy({ left: 300, behavior: 'smooth' }); });

  const nav = document.createElement('div');
  nav.className = 'atdw-carousel-nav';
  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);

  block.textContent = '';
  block.appendChild(headingEl);
  block.appendChild(nav);
  block.appendChild(track);
}
