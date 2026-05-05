#!/usr/bin/env node

/**
 * Local Import Runner
 * Generates EDS plain.html content directly from cleaned HTML analysis.
 * Bypasses CSP issues by not needing to inject scripts into the live page.
 */

const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve, join, dirname } = require('path');

const outputDir = resolve(process.cwd(), 'content');
mkdirSync(outputDir, { recursive: true });

// Read metadata for image paths
const metadata = JSON.parse(readFileSync(resolve(process.cwd(), 'migration-work/metadata.json'), 'utf-8'));
const imageMapping = metadata.images.mapping;

// Get the first (active) banner image
const bannerImages = Object.entries(imageMapping);
const heroImage = bannerImages.length > 0 ? bannerImages[0][0] : '';

// Build the plain HTML content following EDS structure
const plainHtml = `<body>
<header></header>
<main>
  <div>
    <div class="hero">
      <div>
        <div>
          <picture>
            <img src="${heroImage}" alt="Highway road construction project - Nanasa Pidgaon Road">
          </picture>
        </div>
      </div>
      <div>
        <div>
          <h1>Nanasa Pidgaon Road Private Limited</h1>
          <p><a href="/project-gallery-photos">Project Progress Photos</a></p>
        </div>
      </div>
    </div>
    <hr>
    <div>
      <h3>Project Name</h3>
      <p>Four laning of Nanasa to Pidgaon from (Design Ch.95+000/Existing Ch.95+000) to (Design Ch.142+445/Existing Ch.141+530) Section of NH-47(Old NH-59A) (Design Length -47.445km) under Bharatmala Pariyojna Phase-I (Economic-Corridor) in the State Madhya-Pradesh on HAM Mode-Package-III (Indore-Harda).</p>
      <h3>Scope of Work</h3>
      <p>Rehabilitation, up gradation and widening of the existing carriageway from 2 lane (7m Carriageway) to 4 Lane standards with construction of new pavement. Construction and/ or rehabilitation of major and minor bridges, culverts, road intersections, interchanges, drains, etc. Operation and maintenance of the Project.</p>
      <div class="columns">
        <div>
          <div>
            <h3>Client</h3>
            <p>National Highways Authority of India (NHAI)</p>
          </div>
          <div>
            <h3>Construction Period</h3>
            <p>2 years (730 days)</p>
          </div>
        </div>
        <div>
          <div>
            <h3>Length in KM</h3>
            <p>47.445 kms</p>
          </div>
          <div>
            <h3>O&amp;M Period</h3>
            <p>15 years</p>
          </div>
        </div>
        <div>
          <div>
            <h3>Concession Agreement Date</h3>
            <p>13.7.2020</p>
          </div>
          <div>
            <h3>Pavement Classification</h3>
            <p>Flexible Pavement for Main Carriageway and Service/Slip Road Rigid Pavement for Toll Plaza</p>
          </div>
        </div>
        <div>
          <div>
            <h3>Appointed Date</h3>
            <p></p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="metadata">
    <div>
      <div>title</div>
      <div>NPRPL - Nanasa Pidgaon Road Private Limited</div>
    </div>
    <div>
      <div>description</div>
      <div>Four laning of Nanasa to Pidgaon Section of NH-47 under Bharatmala Pariyojna Phase-I in Madhya Pradesh</div>
    </div>
  </div>
</main>
<footer></footer>
</body>`;

const outputPath = join(outputDir, 'index.plain.html');
writeFileSync(outputPath, plainHtml, 'utf-8');
console.log('✅ Content written to: ' + outputPath);
