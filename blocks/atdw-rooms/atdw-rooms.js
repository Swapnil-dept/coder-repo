/**
 * ATDW Rooms block
 * Model field order (one single-cell row per field):
 *   Row 0: heading
 *   Row 1: roomName
 *   Row 2: images
 *   Row 3: description
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const getValue = (index) => rows[index]?.firstElementChild?.textContent?.trim()
    || rows[index]?.textContent?.trim() || '';

  const heading = getValue(0);
  const roomName = getValue(1);
  const imagesCell = rows[2]?.firstElementChild || rows[2];
  const description = getValue(3);

  // ── Section heading ──────────────────────────────────────────────────────────
  const headingEl = document.createElement('h2');
  headingEl.className = 'atdw-rooms-heading';
  headingEl.textContent = heading;

  // ── Room card ────────────────────────────────────────────────────────────────
  const roomEl = document.createElement('article');
  roomEl.className = 'atdw-rooms-room';

  // Images
  const pictures = imagesCell ? [...imagesCell.querySelectorAll('picture')] : [];
  if (pictures.length) {
    const media = document.createElement('div');
    media.className = 'atdw-rooms-media';

    if (pictures.length === 1) {
      media.appendChild(pictures[0]);
    } else {
      const track = document.createElement('div');
      track.className = 'atdw-rooms-track';
      pictures.forEach((pic, i) => {
        const slide = document.createElement('div');
        slide.className = `atdw-rooms-slide${i === 0 ? ' active' : ''}`;
        slide.appendChild(pic);
        track.appendChild(slide);
      });
      media.appendChild(track);

      const counter = document.createElement('span');
      counter.className = 'atdw-rooms-counter';
      counter.textContent = `+${pictures.length - 1}`;
      media.appendChild(counter);
    }
    roomEl.appendChild(media);
  }

  // Text content
  const contentEl = document.createElement('div');
  contentEl.className = 'atdw-rooms-content';
  if (roomName) {
    const nameEl = document.createElement('h3');
    nameEl.className = 'atdw-rooms-name';
    nameEl.textContent = roomName;
    contentEl.appendChild(nameEl);
  }
  if (description) {
    const descEl = document.createElement('p');
    descEl.textContent = description;
    contentEl.appendChild(descEl);
  }
  roomEl.appendChild(contentEl);

  // Replace block content
  block.innerHTML = '';
  block.appendChild(headingEl);
  block.appendChild(roomEl);
}
