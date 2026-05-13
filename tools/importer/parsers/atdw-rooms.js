/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Rooms parser
 * Produces one single-cell row per model field, in model order:
 *   Row 0: block header
 *   Row 1: heading     (field: heading)
 *   Row 2: roomName    (field: roomName)
 *   Row 3: images      (field: images)
 *   Row 4: description (field: description)
 * Source element: #atdw-room-accommodation
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  // ── Section heading ─────────────────────────────────────────────────────────
  const headingEl = element.querySelector('h2');
  const heading = headingEl ? headingEl.textContent.trim() : 'Rooms';

  // ── Room card — locate via the stable aria-label on the images container ────
  // There is one "Images with modal" container per room.
  const imgContainer = element.querySelector('[aria-label="Images with modal"]');

  // Walk up from the image container to the room card wrapper that also holds text
  let roomCard = imgContainer ? imgContainer.parentElement : null;
  if (roomCard) {
    for (let i = 0; i < 6; i++) {
      if (roomCard.querySelectorAll('p').length > 0) break;
      roomCard = roomCard.parentElement;
      if (!roomCard || roomCard === element) break;
    }
  }
  roomCard = roomCard || element;

  // ── Room name — first text block that is NOT the section heading ─────────────
  const allTexts = [...roomCard.querySelectorAll('p, h3, h4, span')]
    .map((el) => el.textContent.trim())
    .filter((t) => t && t.length > 1 && t !== heading);
  // The room name is typically the first short text (≤ 80 chars) before the description
  const roomName = allTexts.find((t) => t.length <= 80 && !/^\+\d+$/.test(t)) || '';

  // ── Images ──────────────────────────────────────────────────────────────────
  const imgs = imgContainer
    ? [...imgContainer.querySelectorAll('img')]
    : [...element.querySelectorAll('img')];
  const seen = new Set();
  const uniqueImgs = imgs.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
  const imagesCell = document.createElement('div');
  uniqueImgs.forEach((img) => {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    imagesCell.appendChild(imgEl);
  });

  // ── Description — longest paragraph in the room card ────────────────────────
  const paras = [...roomCard.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  const description = paras.sort((a, b) => b.length - a.length)[0] || '';

  // ── Build table — one single-cell row per model field ───────────────────────
  const cells = [
    ['ATDW Rooms'],   // block header
    [heading],        // field: heading
    [roomName],       // field: roomName
    [imagesCell],     // field: images
    [description],    // field: description
  ];

  return WebImporter.DOMUtils.createTable(cells, document);
}
