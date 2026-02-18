// JSON Extractor - Extracts data from Airbnb's niobeClientData JSON
console.log('[JSON Extractor] Loaded');

/**
 * Extract all data from embedded JSON scripts
 * Airbnb embeds data in <script id="data-deferred-state-0" type="application/json">
 * Structure: { niobeClientData: [[key, { data: { presentation: { stayProductDetailPage: { sections: { sections: [] } } } } }]] }
 */
function extractFromJSON() {
  console.log('[JSON Extractor] Starting JSON extraction');

  // Find the deferred state script tag
  const script = document.querySelector('script[id="data-deferred-state-0"]');
  if (!script) {
    throw new Error('data-deferred-state-0 script not found');
  }

  let raw;
  try {
    raw = JSON.parse(script.textContent);
  } catch (e) {
    throw new Error('Failed to parse niobeClientData JSON');
  }

  // Navigate to sections list
  const niobe = raw?.niobeClientData;
  if (!Array.isArray(niobe) || niobe.length === 0) {
    throw new Error('niobeClientData not found or empty');
  }

  const sectionsData = niobe[0]?.[1]?.data?.presentation?.stayProductDetailPage?.sections?.sections;
  if (!Array.isArray(sectionsData)) {
    throw new Error('sections array not found in niobeClientData');
  }

  console.log(`[JSON Extractor] Found ${sectionsData.length} sections`);

  // Build section lookup map
  const sectionMap = {};
  for (const s of sectionsData) {
    if (s.sectionId) {
      sectionMap[s.sectionId] = s.section || {};
    }
  }

  return {
    title: extractTitle(sectionMap),
    description: extractDescription(sectionMap),
    photos: extractPhotos(sectionMap),
    amenities: extractAmenities(sectionMap),
    pricing: extractPricing(sectionMap)
  };
}

function extractTitle(map) {
  const title = map['TITLE_DEFAULT']?.title;
  if (title) return title;
  // Fallback to page <title> tag
  const pageTitle = document.title;
  if (pageTitle) return pageTitle.split(' - ')[0].trim();
  return null;
}

function extractDescription(map) {
  const sec = map['DESCRIPTION_DEFAULT'];
  if (!sec) return null;
  // Try htmlDescription first (rich text)
  const html = sec.htmlDescription?.htmlText;
  if (html) {
    // Strip HTML tags
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  // Try plain text
  const text = sec.title || sec.description;
  return text || null;
}

function extractPhotos(map) {
  const sec = map['HERO_DEFAULT'];
  if (!sec) return [];
  const images = sec.previewImages || sec.images || [];
  return images
    .map(img => img.baseUrl || img.url || null)
    .filter(Boolean);
}

function extractAmenities(map) {
  const sec = map['AMENITIES_DEFAULT'];
  if (!sec) return [];

  const amenities = [];

  // Use seeAllAmenitiesGroups for the full list (grouped)
  const groups = sec.seeAllAmenitiesGroups || sec.previewAmenitiesGroups || [];
  for (const group of groups) {
    for (const a of (group.amenities || [])) {
      if (a.available && a.title) {
        amenities.push(a.title);
      }
    }
  }

  return amenities;
}

function extractPricing(map) {
  const sec = map['BOOK_IT_SIDEBAR'] || map['BOOK_IT_FLOATING_FOOTER'] || {};

  // structuredDisplayPrice may be null without dates selected
  const sdp = sec.structuredDisplayPrice;

  let totalPrice = null;
  let perNight = null;
  let nights = null;
  let currency = '';
  let currencySymbol = '';
  let checkIn = null;
  let checkOut = null;

  // Try to get currency from the currency selector in page
  const currencyEl = document.querySelector('._1nqhho6, [data-testid="currency-selector"]');
  if (currencyEl) {
    const spans = currencyEl.querySelectorAll('span');
    if (spans.length >= 2) {
      currencySymbol = spans[0].textContent.trim();
      currency = spans[1].textContent.trim();
    }
  }

  // Get dates from URL
  const urlParams = new URLSearchParams(window.location.search);
  checkIn = urlParams.get('check_in');
  checkOut = urlParams.get('check_out');

  if (checkIn && checkOut) {
    nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  }

  // Parse total price from DOM (most reliable)
  // Airbnb renders: "₪14 393 au total"
  const allText = document.body ? document.body.innerText : '';
  const matchTotal = allText.match(/([\d\u202f\s]+)\s*(?:au total|total)/i);
  if (matchTotal) {
    const raw = matchTotal[1].replace(/[\u202f\s]/g, '');
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) totalPrice = parsed;
  }

  if (totalPrice && nights && nights > 0) {
    perNight = Math.round(totalPrice / nights);
  }

  return { totalPrice, perNight, nights, currency, currencySymbol, checkIn, checkOut };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractFromJSON };
}
