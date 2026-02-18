// DOM Extractor - Fallback extraction using CSS selectors
console.log('[DOM Extractor] Loaded');

/**
 * Extract data from DOM when JSON extraction fails
 * Uses multiple selectors per field for resilience
 * Each section is wrapped in try/catch so one failure doesn't stop others
 */
function extractFromDOM() {
  console.log('[DOM Extractor] Starting DOM extraction');

  const safeExtract = (fn, name) => {
    try { return fn(); }
    catch (e) { console.warn(`[DOM Extractor] ${name} failed:`, e.message); return null; }
  };

  const result = {
    title: safeExtract(extractTitleDOM, 'title'),
    description: safeExtract(extractDescriptionDOM, 'description'),
    photos: safeExtract(extractPhotosDOM, 'photos') || [],
    amenities: safeExtract(extractAmenitiesDOM, 'amenities') || [],
    pricing: safeExtract(extractPricingDOM, 'pricing') || {}
  };

  // Require at least title to consider DOM extraction successful
  if (!result.title) {
    throw new Error('DOM extraction failed: title not found');
  }

  return result;
}

/**
 * Extract title from DOM
 */
function extractTitleDOM() {
  const selectors = [
    'h1[data-testid="listing-title"]',
    'h1.hpipapi',
    'h1._fecoyn4',
    'div[data-section-id="TITLE_DEFAULT"] h1',
    'div[role="heading"] h1',
    'h1'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 3) {
      return element.textContent.trim();
    }
  }

  // Final fallback: page title
  if (document.title) {
    return document.title.split(' - ')[0].trim();
  }

  throw new Error('Title not found in DOM');
}

/**
 * Extract description from DOM
 * Handles "Show more" buttons
 */
function extractDescriptionDOM() {
  // Try to click "Show more" button if present (valid CSS selectors only)
  const showMoreCandidates = document.querySelectorAll(
    'button[data-testid="listing-description-expand-btn"], button[aria-expanded="false"], button._1d079j1e'
  );
  for (const button of showMoreCandidates) {
    if (button.textContent.toLowerCase().includes('more') || button.textContent.toLowerCase().includes('plus')) {
      try { button.click(); } catch (e) { /* ignore */ }
      break;
    }
  }

  // Extract description
  const selectors = [
    'div[data-section-id="DESCRIPTION_DEFAULT"]',
    'div[data-testid="listing-description"]',
    'div._1eijrel',
    'div[class*="description"]',
    'div._tqjvd4',
    'div._1ie4jtbf'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 20) {
      return element.textContent.trim();
    }
  }

  return null;
}

/**
 * Extract location from DOM
 */
function extractLocationDOM() {
  const selectors = [
    'button[data-testid="listing-location"]',
    'div[data-testid="location-info"]',
    'span._9xiloll',
    'div._1c2u55u',
    'h2._14i3ji6'
  ];

  let locationString = null;

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      locationString = element.textContent.trim();
      break;
    }
  }

  // Try to find lat/lng in data attributes or map elements
  let latitude = null;
  let longitude = null;

  const mapElement = document.querySelector('[data-lat][data-lng]');
  if (mapElement) {
    latitude = parseFloat(mapElement.getAttribute('data-lat'));
    longitude = parseFloat(mapElement.getAttribute('data-lng'));
  }

  return {
    string: locationString,
    latitude,
    longitude
  };
}

/**
 * Extract photos from DOM
 */
function extractPhotosDOM() {
  const photoURLs = new Set();

  // Try multiple selectors for photo containers
  const selectors = [
    'img[data-testid="listing-photo"]',
    'div[data-testid="photo-viewer"] img',
    'picture img',
    'img[class*="photo"]',
    'img._1wtxk1ze'
  ];

  for (const selector of selectors) {
    const images = document.querySelectorAll(selector);

    images.forEach(img => {
      // Get highest resolution available
      const src = img.src || img.getAttribute('data-src') || img.getAttribute('srcset')?.split(' ')[0];

      if (src && (src.includes('airbnb') || src.includes('muscache'))) {
        // Remove size parameters to get full resolution
        const cleanURL = src.split('?')[0];
        photoURLs.add(cleanURL);
      }
    });

    if (photoURLs.size > 0) break;
  }

  return Array.from(photoURLs);
}

/**
 * Extract amenities from DOM
 */
function extractAmenitiesDOM() {
  const amenities = [];

  const selectors = [
    'div[data-section-id="AMENITIES_DEFAULT"] [class*="amenity"]',
    'div[data-testid="amenity-item"]',
    'div[data-section-id="AMENITIES_DEFAULT"] button',
    'div._19xnuo97',
    'div._1crk6cd li',
    'button[data-testid="amenity-row"]'
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);

    if (elements.length > 0) {
      elements.forEach(el => {
        const text = el.textContent.trim();
        if (text && !amenities.includes(text)) {
          amenities.push(text);
        }
      });
      break;
    }
  }

  // Note: "Show all amenities" button not clicked (requires modal handling)

  return amenities;
}

/**
 * Extract pricing from DOM
 * Captures total price + per-night breakdown
 */
function extractPricingDOM() {
  let totalPrice = null;
  let perNight = null;
  let nights = null;
  let currency = '';
  let currencySymbol = '';

  // Detect currency symbol from page
  const currencyEl = document.querySelector('._1nqhho6');
  if (currencyEl) {
    const sym = currencyEl.querySelector('span:first-child');
    const code = currencyEl.querySelector('span:last-child');
    if (sym) currencySymbol = sym.textContent.trim();
    if (code) currency = code.textContent.trim();
  }

  // Total price — pattern: "₪14 393 au total" or "$X total"
  const totalSelectors = [
    '[class*="pricing-guest-primary-line-unit-price"]',
    'span[data-testid="price-summary-total"]',
    'div._1k4xcdh',
    'div.p1qe1igw'
  ];

  for (const selector of totalSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.textContent.replace(/\s/g, '').replace(/\u202f/g, '');
      const match = text.match(/([\d\s,]+)/);
      if (match) {
        totalPrice = parseFloat(match[1].replace(/[\s,]/g, ''));
        break;
      }
    }
  }

  // Fallback: search all text for "X au total" / "X total"
  if (!totalPrice) {
    const allText = document.body.innerText;
    const matchTotal = allText.match(/([\d\u202f\s,]+)\s*(?:au total|total)/i);
    if (matchTotal) {
      totalPrice = parseFloat(matchTotal[1].replace(/[\u202f\s,]/g, ''));
    }
  }

  // Number of nights from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const checkIn = urlParams.get('check_in');
  const checkOut = urlParams.get('check_out');
  if (checkIn && checkOut) {
    const msPerDay = 86400000;
    nights = Math.round((new Date(checkOut) - new Date(checkIn)) / msPerDay);
  }

  // Per-night calculation
  if (totalPrice && nights && nights > 0) {
    perNight = Math.round(totalPrice / nights);
  }

  // Detect currency from symbol if not found
  if (!currency) {
    if (currencySymbol === '₪') currency = 'ILS';
    else if (currencySymbol === '$') currency = 'USD';
    else if (currencySymbol === '€') currency = 'EUR';
    else if (currencySymbol === '£') currency = 'GBP';
  }

  return {
    totalPrice,
    perNight,
    nights,
    currency,
    currencySymbol,
    checkIn,
    checkOut
  };
}

/**
 * Wait for element to appear (utility)
 * Not used in current implementation but useful for future enhancements
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractFromDOM };
}
