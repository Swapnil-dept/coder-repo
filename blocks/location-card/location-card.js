/**
 * Location Card block: two-column layout with property info (left)
 * and a location image (right).
 *
 * Model field order (one single-cell row per field):
 *   Row 0: propertyImage
 *   Row 1: propertyImageAlt
 *   Row 2: propertyName
 *   Row 3: address
 *   Row 4: phone
 *   Row 5: directionsUrl
 *   Row 6: directionsLabel
 *   Row 7: creditText
 *   Row 8: locationImage
 *   Row 9: locationImageAlt
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  const getText = (index) => rows[index]?.firstElementChild?.textContent?.trim()
    || rows[index]?.textContent?.trim()
    || '';

  // Extract field values
  const propertyPicture = rows[0]?.querySelector('picture');
  const propertyImageAlt = getText(1);
  const propertyName = getText(2);
  const address = getText(3);
  const phone = getText(4);
  const directionsUrl = getText(5);
  const directionsLabel = getText(6) || 'GET DIRECTIONS';
  const creditText = getText(7);
  const locationPicture = rows[8]?.querySelector('picture');
  const locationImageAlt = getText(9);

  /* ── Left column: Info panel ── */
  const infoCol = document.createElement('div');
  infoCol.className = 'location-card-info';

  // Property image
  if (propertyPicture) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'location-card-image';
    const pic = propertyPicture.cloneNode(true);
    const img = pic.querySelector('img');
    if (img && propertyImageAlt) img.alt = propertyImageAlt;
    imageWrap.appendChild(pic);
    infoCol.appendChild(imageWrap);
  }

  // Details section
  const detailsEl = document.createElement('div');
  detailsEl.className = 'location-card-details';

  // Property name with icon
  if (propertyName) {
    const nameRow = document.createElement('div');
    nameRow.className = 'location-card-name-row';

    const icon = document.createElement('span');
    icon.className = 'location-card-icon location-card-icon-pin';
    icon.setAttribute('aria-hidden', 'true');

    const nameEl = document.createElement('h3');
    nameEl.className = 'location-card-name';
    nameEl.textContent = propertyName;

    nameRow.appendChild(icon);
    nameRow.appendChild(nameEl);
    detailsEl.appendChild(nameRow);
  }

  // Address
  if (address) {
    const addrRow = document.createElement('div');
    addrRow.className = 'location-card-detail-row';

    const addrIcon = document.createElement('span');
    addrIcon.className = 'location-card-detail-icon';
    addrIcon.setAttribute('aria-hidden', 'true');
    addrIcon.textContent = '\u{1F4CD}';

    const addrText = document.createElement('span');
    addrText.className = 'location-card-address';
    addrText.textContent = address;

    addrRow.appendChild(addrIcon);
    addrRow.appendChild(addrText);
    detailsEl.appendChild(addrRow);
  }

  // Phone
  if (phone) {
    const phoneRow = document.createElement('div');
    phoneRow.className = 'location-card-detail-row';

    const phoneIcon = document.createElement('span');
    phoneIcon.className = 'location-card-detail-icon';
    phoneIcon.setAttribute('aria-hidden', 'true');
    phoneIcon.textContent = '\u{1F4DE}';

    const phoneLink = document.createElement('a');
    phoneLink.className = 'location-card-phone';
    phoneLink.href = `tel:${phone.replace(/\s/g, '')}`;
    phoneLink.textContent = phone;

    phoneRow.appendChild(phoneIcon);
    phoneRow.appendChild(phoneLink);
    detailsEl.appendChild(phoneRow);
  }

  // Get Directions button
  if (directionsUrl) {
    const btnWrap = document.createElement('div');
    btnWrap.className = 'location-card-cta';

    const btn = document.createElement('a');
    btn.className = 'location-card-btn';
    btn.href = directionsUrl;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', `${directionsLabel} to ${propertyName}`);

    const btnText = document.createElement('span');
    btnText.textContent = directionsLabel;

    const btnIcon = document.createElement('span');
    btnIcon.className = 'location-card-btn-icon';
    btnIcon.setAttribute('aria-hidden', 'true');
    btnIcon.innerHTML = '&#x2197;'; // ↗ external link arrow

    btn.appendChild(btnText);
    btn.appendChild(btnIcon);
    btnWrap.appendChild(btn);
    detailsEl.appendChild(btnWrap);
  }

  // Credit text
  if (creditText) {
    const creditEl = document.createElement('p');
    creditEl.className = 'location-card-credit';
    creditEl.textContent = creditText;
    detailsEl.appendChild(creditEl);
  }

  infoCol.appendChild(detailsEl);

  /* ── Right column: Location image ── */
  const imageCol = document.createElement('div');
  imageCol.className = 'location-card-location';

  if (locationPicture) {
    const pic = locationPicture.cloneNode(true);
    const img = pic.querySelector('img');
    if (img && locationImageAlt) img.alt = locationImageAlt;
    imageCol.appendChild(pic);
  }

  /* ── Assemble ── */
  block.textContent = '';
  block.appendChild(infoCol);
  block.appendChild(imageCol);
}
