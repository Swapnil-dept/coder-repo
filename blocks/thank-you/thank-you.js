import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // UE positional order: heading, message, ctaLink, ctaText
  // Doc authoring: key | value rows
  let heading = 'Thank you';
  let message = 'We have received your booking information.\nOne of our executives will get in touch with you for more details.';
  let ctaLink = '/';
  let ctaText = '< Back to home';

  function cellHref(cell) {
    const a = cell?.querySelector('a');
    return a ? (a.getAttribute('href') || a.href) : cell?.textContent.trim() || '';
  }

  const isKeyValue = rows.some((row) => row.children.length >= 2);

  if (isKeyValue) {
    rows.forEach((row) => {
      const [keyCell, valCell] = row.children;
      const key = keyCell?.textContent.trim().toLowerCase();
      if (key === 'heading') heading = valCell?.textContent.trim() || heading;
      else if (key === 'message') message = valCell?.textContent.trim() || message;
      else if (key === 'ctalink') ctaLink = cellHref(valCell) || ctaLink;
      else if (key === 'ctatext') ctaText = valCell?.textContent.trim() || ctaText;
    });
  } else {
    const get = (i) => rows[i]?.querySelector(':scope > div') || rows[i];
    heading = get(0)?.textContent.trim() || heading;
    message = get(1)?.textContent.trim() || message;
    ctaLink = cellHref(get(2)) || ctaLink;
    ctaText = get(3)?.textContent.trim() || ctaText;
  }

  // ── Build DOM ─────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = 'ty-wrapper';
  moveInstrumentation(rows[0] || block, wrapper);

  const h1 = document.createElement('h1');
  h1.className = 'ty-heading';
  h1.textContent = heading;

  const p = document.createElement('p');
  p.className = 'ty-message';
  p.textContent = message;

  const btn = document.createElement('a');
  btn.className = 'ty-cta';
  btn.href = ctaLink;
  btn.textContent = ctaText;

  wrapper.append(h1, p, btn);
  block.replaceChildren(wrapper);
}
