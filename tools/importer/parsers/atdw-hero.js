/* eslint-disable */
/* global WebImporter */

/**
 * ATDW Hero parser
 * Extracts: gallery images, property title, Best of Queensland badge
 * Source element: #atdw-hero-banner
 * Returns the generated block table (does NOT modify the source DOM).
 */
export default function parse(element, { document }) {
  const gallerySection = element.querySelector('#atdw-gallery');
  const images = gallerySection
    ? [...gallerySection.querySelectorAll('img')]
    : [...element.querySelectorAll('img')];

  // Deduplicate by src; exclude BOQE stamp images
  const seen = new Set();
  const uniqueImgs = images.filter((img) => {
    if (seen.has(img.src)) return false;
    if (img.src.includes('BOQE')) return false;
    seen.add(img.src);
    return true;
  });

  // Title — prefer h1 inside the hero wrapper (outside gallery)
  const titleEl = element.querySelector('h1') || element.querySelector('h2');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Best of Queensland badge image
  const boqeEl = element.querySelector('#atdw-boqe-logo img');
  const boqeImgSrc = boqeEl ? boqeEl.src : '';

  // Breadcrumb — extract from page breadcrumb nav if present
  const breadcrumbEl = document.querySelector('[class*="breadcrumb" i] a:last-child, nav[aria-label*="breadcrumb" i] a:last-child');
  const breadcrumb = breadcrumbEl ? breadcrumbEl.textContent.trim() : '';

  const cells = [['ATDW Hero']];

  // Row 0 → field: galleryImages — all gallery images in one cell
  const galleryCell = document.createElement('div');
  uniqueImgs.forEach((img) => {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    galleryCell.appendChild(imgEl);
  });
  cells.push([galleryCell]);

  // Row 1 → field: title
  cells.push([title]);

  // Row 2 → field: breadcrumb (empty string keeps field aligned)
  cells.push([breadcrumb]);

  // Row 3 → field: boqeImage
  if (boqeImgSrc) {
    const boqeCell = document.createElement('div');
    const boqeImg = document.createElement('img');
    boqeImg.src = boqeImgSrc;
    boqeImg.alt = boqeEl.alt || 'Best of Queensland';
    boqeCell.appendChild(boqeImg);
    cells.push([boqeCell]);
  } else {
    cells.push(['']);
  }

  return WebImporter.DOMUtils.createTable(cells, document);
}
