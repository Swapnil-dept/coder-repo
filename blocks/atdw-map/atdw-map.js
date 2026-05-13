/**
 * ATDW Map block: Mapbox embed with property name and address.
 * Row 0: Property Name
 * Row 1: Address (suburb, region, state, postcode)
 * Row 2: Latitude
 * Row 3: Longitude
 * Row 4: Zoom (optional, default 14)
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const propertyName = rows[0]?.textContent?.trim();
  const address = rows[1]?.textContent?.trim();
  const lat = parseFloat(rows[2]?.textContent?.trim()) || -20.3521;
  const lng = parseFloat(rows[3]?.textContent?.trim()) || 148.9550;
  const zoom = parseInt(rows[4]?.textContent?.trim(), 10) || 14;

  // Map container
  const mapEl = document.createElement('div');
  mapEl.className = 'atdw-map-canvas';
  mapEl.id = `atdw-map-${Date.now()}`;
  mapEl.setAttribute('aria-label', `Map showing location of ${propertyName}`);

  // Info panel
  const infoEl = document.createElement('div');
  infoEl.className = 'atdw-map-info';

  if (propertyName) {
    const nameEl = document.createElement('p');
    nameEl.className = 'atdw-map-name';
    nameEl.textContent = propertyName;
    infoEl.appendChild(nameEl);
  }

  if (address) {
    const addrEl = document.createElement('p');
    addrEl.className = 'atdw-map-address';
    addrEl.textContent = address;
    infoEl.appendChild(addrEl);
  }

  block.textContent = '';
  block.appendChild(mapEl);
  block.appendChild(infoEl);

  // Lazy-load Mapbox GL JS only when block is visible
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();

    const MAPBOX_TOKEN = block.dataset.mapboxToken || '';
    if (!MAPBOX_TOKEN) {
      // Fallback: static map image via Mapbox Static API
      const img = document.createElement('img');
      // Token must be supplied via block.dataset.mapboxToken or window.MAPBOX_TOKEN (set in project config)
      const staticToken = window.MAPBOX_TOKEN || '';
      img.src = staticToken
        ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+00817d(${lng},${lat})/${lng},${lat},${zoom},0/600x320@2x?access_token=${staticToken}`
        : '';
      img.alt = `Map showing ${propertyName}`;
      img.className = 'atdw-map-static';
      mapEl.appendChild(img);
      return;
    }

    import('https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js').then(() => {
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      // eslint-disable-next-line no-new
      new window.mapboxgl.Map({
        container: mapEl.id,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom,
      }).addControl(new window.mapboxgl.NavigationControl(), 'top-right');
    });
  }, { threshold: 0.1 });

  observer.observe(block);
}
