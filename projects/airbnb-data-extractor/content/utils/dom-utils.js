// DOM Utilities - Helper functions for DOM manipulation
console.log('[DOM Utils] Loaded');

/**
 * Safe querySelector that doesn't throw
 */
function safeQuerySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.warn(`[DOM Utils] Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Safe querySelectorAll that doesn't throw
 */
function safeQuerySelectorAll(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (error) {
    console.warn(`[DOM Utils] Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Wait for element to appear in DOM
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

/**
 * Wait for element to be removed from DOM
 */
function waitForElementRemoval(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (!element) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (!element) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} still present after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Try multiple selectors until one works
 */
function querySelectorMultiple(selectors, context = document) {
  for (const selector of selectors) {
    const element = safeQuerySelector(selector, context);
    if (element) {
      return element;
    }
  }
  return null;
}

/**
 * Get text content safely
 */
function getTextContent(element) {
  if (!element) return '';
  return (element.textContent || element.innerText || '').trim();
}

/**
 * Get attribute safely
 */
function getAttribute(element, attributeName, defaultValue = null) {
  if (!element) return defaultValue;
  return element.getAttribute(attributeName) || defaultValue;
}

/**
 * Click element safely (doesn't throw)
 */
function safeClick(element) {
  if (!element) return false;

  try {
    element.click();
    return true;
  } catch (error) {
    console.warn('[DOM Utils] Click failed:', error);
    return false;
  }
}

/**
 * Scroll element into view safely
 */
function scrollIntoView(element, options = { behavior: 'smooth', block: 'center' }) {
  if (!element) return false;

  try {
    element.scrollIntoView(options);
    return true;
  } catch (error) {
    console.warn('[DOM Utils] Scroll failed:', error);
    return false;
  }
}

/**
 * Check if element is visible
 */
function isVisible(element) {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return style.display !== 'none' &&
         style.visibility !== 'hidden' &&
         style.opacity !== '0' &&
         element.offsetParent !== null;
}

/**
 * Debounce function execution
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Wait for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get all images from page
 */
function getAllImages(minWidth = 0, minHeight = 0) {
  const images = Array.from(document.querySelectorAll('img'));

  return images.filter(img => {
    return img.naturalWidth >= minWidth &&
           img.naturalHeight >= minHeight &&
           img.src &&
           img.src.startsWith('http');
  });
}

/**
 * Extract number from text
 */
function extractNumber(text) {
  if (!text) return null;

  const match = String(text).match(/([\d,]+\.?\d*)/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }

  return null;
}

/**
 * Extract currency from text
 */
function extractCurrency(text) {
  if (!text) return 'USD';

  const currencies = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₪': 'ILS'
  };

  for (const [symbol, code] of Object.entries(currencies)) {
    if (text.includes(symbol)) {
      return code;
    }
  }

  return 'USD';
}

/**
 * Remove duplicates from array
 */
function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    safeQuerySelector,
    safeQuerySelectorAll,
    waitForElement,
    waitForElementRemoval,
    querySelectorMultiple,
    getTextContent,
    getAttribute,
    safeClick,
    scrollIntoView,
    isVisible,
    debounce,
    sleep,
    getAllImages,
    extractNumber,
    extractCurrency,
    removeDuplicates,
    deepClone
  };
}
