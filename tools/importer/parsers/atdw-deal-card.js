/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Deal Card parser
 * Produces one single-cell row per model field, in model order:
 *   Row 0: block header
 *   Row 1: dealType      (field: dealType)
 *   Row 2: title         (field: title)
 *   Row 3: description   (field: description)
 *   Row 4: conditions    (field: conditions)
 *   Row 5: saleEndDate   (field: saleEndDate)
 *   Row 6: ctaLabel      (field: ctaLabel)
 *   Row 7: ctaUrl        (field: ctaUrl)
 * Source element: #atdw-deal-card
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  // ── Deal type badge ─────────────────────────────────────────────────────────
  const badgeEl = element.querySelector('.deal-type');
  const dealType = badgeEl ? badgeEl.textContent.trim() : '';

  // ── Deal title ──────────────────────────────────────────────────────────────
  // The section has two h2s: "Hot deals" (section heading) + actual deal title.
  // Take the last h2 that is NOT the section heading.
  const allH2 = [...element.querySelectorAll('h2')];
  const titleEl = allH2.reverse().find((h) => h.textContent.trim().toLowerCase() !== 'hot deals')
    || allH2[0];
  const title = titleEl ? titleEl.textContent.trim() : '';

  // ── Paragraphs — skip badge duplicate and "Terms & Conditions" labels ───────
  const badgeLower = dealType.toLowerCase();
  const allParas = [...element.querySelectorAll('p')].map((p) => p.textContent.trim()).filter((t) => {
    if (!t) return false;
    if (t.toLowerCase() === badgeLower) return false;       // badge duplicate
    if (t.toLowerCase() === 'terms & conditions') return false;
    if (t.toLowerCase() === 'terms and conditions') return false;
    return true;
  });

  // Sale end date — first para starting with "sale ends"
  const saleEndDate = allParas.find((t) => t.toLowerCase().startsWith('sale ends')) || '';

  // Description — first para that is not the sale date and is reasonably long
  const description = allParas.find(
    (t) => !t.toLowerCase().startsWith('sale ends') && t.length > 20,
  ) || '';

  // Conditions — remaining paras after description and sale date
  const conditions = allParas
    .filter((t) => t !== description && !t.toLowerCase().startsWith('sale ends'))
    .join('\n') || '';

  // ── CTA ─────────────────────────────────────────────────────────────────────
  const ctaLink = element.querySelector('a[href]');
  const ctaLabel = ctaLink ? (ctaLink.textContent.trim() || 'Claim Deal') : '';
  let ctaUrl = ctaLink ? ctaLink.href : '';
  try {
    const destMatch = ctaUrl.match(/dest=([^&]+)/);
    if (destMatch) ctaUrl = decodeURIComponent(destMatch[1]);
  } catch (_) { /* keep raw URL */ }

  // ── Build table — one single-cell row per model field ──────────────────────
  const cells = [
    ['ATDW Deal Card'],  // block header
    [dealType],          // field: dealType
    [title],             // field: title
    [description],       // field: description
    [conditions],        // field: conditions
    [saleEndDate],       // field: saleEndDate
    [ctaLabel],          // field: ctaLabel  ← separate row (NOT two-cell)
    [ctaUrl],            // field: ctaUrl    ← separate row
  ];

  return WebImporter.DOMUtils.createTable(cells, document);
}
