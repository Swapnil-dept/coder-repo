/* global DOMPurify */

const SUBMIT_ENDPOINT = '/api/book-appointment'; // override via block config row

/** Fetch cities list from the block-local JSON stub */
async function loadCities(blockPath) {
  try {
    const resp = await fetch(`${blockPath}/cities.json`);
    if (!resp.ok) throw new Error('cities fetch failed');
    const json = await resp.json();
    return Array.isArray(json) ? json : (json.cities || []);
  } catch {
    return [];
  }
}

/** Build a searchable city dropdown */
function buildCityDropdown(cities) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tte-field tte-city-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tte-input tte-city-input';
  input.placeholder = 'Select or search city';
  input.setAttribute('aria-label', 'City');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-haspopup', 'listbox');

  // Hidden real value
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = 'city';

  const dropdown = document.createElement('ul');
  dropdown.className = 'tte-city-list';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;

  function renderList(filter = '') {
    dropdown.innerHTML = '';
    const filtered = filter
      ? cities.filter((c) => c.toLowerCase().includes(filter.toLowerCase()))
      : cities;
    if (!filtered.length) {
      const empty = document.createElement('li');
      empty.className = 'tte-city-empty';
      empty.textContent = 'No cities found';
      dropdown.append(empty);
    } else {
      filtered.forEach((city) => {
        const li = document.createElement('li');
        li.className = 'tte-city-option';
        li.setAttribute('role', 'option');
        li.textContent = city;
        li.addEventListener('mousedown', (e) => {
          e.preventDefault();
          input.value = city;
          hidden.value = city;
          dropdown.hidden = true;
          input.setAttribute('aria-expanded', 'false');
        });
        dropdown.append(li);
      });
    }
  }

  input.addEventListener('focus', () => {
    renderList(input.value);
    dropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  });

  input.addEventListener('input', () => {
    hidden.value = '';
    renderList(input.value);
    dropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      dropdown.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      // If typed value doesn't match, clear hidden
      if (!cities.includes(input.value)) {
        input.value = '';
        hidden.value = '';
      }
    }, 150);
  });

  wrapper.append(input, hidden, dropdown);
  return { wrapper, hidden };
}

/** Show inline success/error banner */
function showMessage(form, type, text) {
  form.querySelectorAll('.tte-message').forEach((m) => m.remove());
  const msg = document.createElement('p');
  msg.className = `tte-message tte-message--${type}`;
  msg.setAttribute('role', type === 'error' ? 'alert' : 'status');
  msg.textContent = text;
  form.append(msg);
}

/** Validate fields, returns array of error strings */
function validate(name, mobile, city, agreed) {
  const errors = [];
  if (!name.trim()) errors.push('Name is required.');
  if (!/^[6-9]\d{9}$/.test(mobile.trim())) errors.push('Enter a valid 10-digit mobile number.');
  if (!city) errors.push('Please select a city.');
  if (!agreed) errors.push('Please agree to the Terms & Conditions.');
  return errors;
}

export default async function decorate(block) {
  const rows = [...block.children];

  // Read optional config rows.
  // UE authoring: single-cell rows in model field order → [heading, endpoint, tnc, ctaLink, ctaText]
  // Doc authoring: two-cell key/value rows → | key | value |
  let headingText = 'Talk to experts';
  let endpoint = SUBMIT_ENDPOINT;
  let tncHref = '#';
  let ctaLink = '';
  let ctaText = 'Book Appointment';

  /**
   * Extract a usable href from a cell: prefers the raw getAttribute('href')
   * so we get the authored path, not a fully-resolved localhost URL.
   */
  function cellHref(cell) {
    const a = cell?.querySelector('a');
    return a ? (a.getAttribute('href') || a.href) : cell?.textContent.trim() || '';
  }

  const isKeyValue = rows.some((row) => row.children.length >= 2);

  if (isKeyValue) {
    // ── Document-authored key/value rows ─────────────────────
    rows.forEach((row) => {
      const [keyCell, valCell] = row.children;
      const key = keyCell?.textContent.trim().toLowerCase();
      if (key === 'heading') headingText = valCell?.textContent.trim() || headingText;
      else if (key === 'endpoint') endpoint = cellHref(valCell) || valCell?.textContent.trim() || endpoint;
      else if (key === 'tnc') tncHref = cellHref(valCell) || tncHref;
      else if (key === 'ctalink') ctaLink = cellHref(valCell) || '';
      else if (key === 'ctatext') ctaText = valCell?.textContent.trim() || ctaText;
    });
  } else {
    // ── UE single-cell positional rows (model field order) ───
    // Order matches component model: heading, endpoint, tnc, ctaLink, ctaText
    const get = (i) => rows[i]?.querySelector(':scope > div') || rows[i];
    headingText = get(0)?.textContent.trim() || headingText;
    endpoint    = cellHref(get(1)) || endpoint;
    tncHref     = cellHref(get(2)) || tncHref;
    ctaLink     = cellHref(get(3)) || '';
    ctaText     = get(4)?.textContent.trim() || ctaText;
  }

  // Resolve block path for JSON stub
  const blockPath = new URL(import.meta.url).pathname.replace(/\/[^/]+\.js$/, '');
  const cities = await loadCities(blockPath);

  // ── Heading ──────────────────────────────────────────────
  const heading = document.createElement('p');
  heading.className = 'tte-heading';
  heading.textContent = headingText;

  // ── Form ─────────────────────────────────────────────────
  const form = document.createElement('form');
  form.className = 'tte-form';
  form.setAttribute('novalidate', '');

  // Name field
  const nameWrap = document.createElement('div');
  nameWrap.className = 'tte-field';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.className = 'tte-input tte-name';
  nameInput.placeholder = 'Name';
  nameInput.setAttribute('aria-label', 'Name');
  nameInput.setAttribute('autocomplete', 'name');
  nameInput.maxLength = 60;
  nameWrap.append(nameInput);

  // Mobile field
  const mobileWrap = document.createElement('div');
  mobileWrap.className = 'tte-field';
  const mobileInput = document.createElement('input');
  mobileInput.type = 'tel';
  mobileInput.name = 'mobile';
  mobileInput.className = 'tte-input tte-mobile';
  mobileInput.placeholder = 'Mobile';
  mobileInput.setAttribute('aria-label', 'Mobile number');
  mobileInput.setAttribute('autocomplete', 'tel');
  mobileInput.maxLength = 10;
  mobileWrap.append(mobileInput);

  // City dropdown
  const { wrapper: cityWrap, hidden: cityHidden } = buildCityDropdown(cities);

  // T&C checkbox
  const tncWrap = document.createElement('label');
  tncWrap.className = 'tte-field tte-tnc-label';
  const tncCheck = document.createElement('input');
  tncCheck.type = 'checkbox';
  tncCheck.name = 'tnc';
  tncCheck.className = 'tte-checkbox';
  const tncLink = document.createElement('a');
  tncLink.href = tncHref;
  tncLink.target = '_blank';
  tncLink.rel = 'noopener noreferrer';
  tncLink.textContent = 'T&C';
  const tncText = document.createElement('span');
  tncText.append(document.createTextNode('I agree to '), tncLink);
  tncWrap.append(tncCheck, tncText);

  // Submit button — or link button if ctaLink is authored
  let submitBtn;
  if (ctaLink) {
    submitBtn = document.createElement('a');
    submitBtn.href = ctaLink;
    submitBtn.target = '_blank';
    submitBtn.rel = 'noopener noreferrer';
    submitBtn.className = 'tte-submit tte-submit--link';
    submitBtn.textContent = ctaText;
  } else {
    submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'tte-submit';
    submitBtn.textContent = ctaText;
  }

  form.append(nameWrap, mobileWrap, cityWrap, tncWrap, submitBtn);

  // ── Form submit (only when no ctaLink) ──────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (ctaLink) return; // link-mode: form never submits

    const name = nameInput.value;
    const mobile = mobileInput.value;
    const city = cityHidden.value;
    const agreed = tncCheck.checked;

    const errors = validate(name, mobile, city, agreed);
    if (errors.length) {
      showMessage(form, 'error', errors[0]);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking…';
    form.querySelectorAll('.tte-message').forEach((m) => m.remove());

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, city }),
      });

      if (resp.ok) {
        form.reset();
        cityHidden.value = '';
        showMessage(form, 'success', 'Thank you! Your appointment has been booked. We\'ll contact you shortly.');
      } else {
        const data = await resp.json().catch(() => ({}));
        showMessage(form, 'error', data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      showMessage(form, 'error', 'Unable to connect. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = ctaText;
    }
  });

  block.replaceChildren(heading, form);
}
