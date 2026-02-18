// Sidebar UI Logic
console.log('[Sidebar] Loaded');

let extractedData = null;

// DOM elements
const extractBtn = document.getElementById('extractBtn');
const copyAllJsonBtn = document.getElementById('copyAllJsonBtn');
const loading = document.getElementById('loading');
const errorBanner = document.getElementById('errorBanner');
const errorList = document.getElementById('errorList');
const dismissError = document.getElementById('dismissError');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Sidebar] DOM loaded');

  // Set up event listeners
  extractBtn.addEventListener('click', handleExtract);
  copyAllJsonBtn.addEventListener('click', copyAllJson);
  dismissError.addEventListener('click', hideError);

  // Set up accordion
  initAccordion();

  // Set up copy buttons
  initCopyButtons();
});

// Handle extraction
async function handleExtract() {
  console.log('[Sidebar] Extract button clicked');
  showLoading();
  hideError();

  try {
    // Send extraction request to background -> content script
    const response = await chrome.runtime.sendMessage({
      type: 'REQUEST_EXTRACTION'
    });

    console.log('[Sidebar] Received response:', response);

    if (response.success) {
      extractedData = response.data;
      displayData(response.data);
    } else {
      showError([{ section: 'General', message: response.error }]);
    }
  } catch (error) {
    console.error('[Sidebar] Extraction error:', error);
    showError([{ section: 'General', message: error.message }]);
  } finally {
    hideLoading();
  }
}

// Display extracted data
function displayData(data) {
  console.log('[Sidebar] Displaying data:', data);

  // Display successful sections
  if (data.success) {
    displaySection('title', data.success.title);
    displaySection('description', data.success.description);
    displaySection('photos', data.success.photos);
    displaySection('amenities', data.success.amenities);
    displaySection('pricing', data.success.pricing);
  }

  // Show errors if any
  if (data.errors && data.errors.length > 0) {
    showError(data.errors);
  }
}

// Display individual section
function displaySection(sectionName, data) {
  const contentId = sectionName + 'Content';
  const element = document.getElementById(contentId);

  if (!element) return;

  if (!data) {
    element.innerHTML = '<em>No data available</em>';
    return;
  }

  // Format data based on type
  let html = '';

  if (typeof data === 'string') {
    html = data;
  } else if (Array.isArray(data)) {
    if (sectionName === 'photos') {
      html = `<p><strong>${data.length} photos</strong></p><div class="photos-grid">`;
      data.slice(0, 9).forEach(url => {
        html += `<img src="${url}" class="photo-thumb" alt="Photo">`;
      });
      html += `</div>`;
    } else if (sectionName === 'amenities') {
      html = '<ul>';
      data.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += '</ul>';
    } else {
      html = data.join(', ');
    }
  } else if (typeof data === 'object') {
    if (sectionName === 'pricing') {
      const sym = data.currencySymbol || '';
      const cur = data.currency || '';
      const total = data.totalPrice ? `${sym}${data.totalPrice.toLocaleString()} ${cur}` : 'N/A';
      const perNight = data.perNight ? `${sym}${data.perNight.toLocaleString()} ${cur}` : 'N/A';
      const nights = data.nights ? `${data.nights} nuits` : '';
      const dates = (data.checkIn && data.checkOut) ? `${data.checkIn} → ${data.checkOut}` : '';
      html = `
        <p><strong>Prix total :</strong> ${total}${nights ? ` (${nights})` : ''}</p>
        <p><strong>Prix / nuit :</strong> ${perNight}</p>
        ${dates ? `<p><strong>Dates :</strong> ${dates}</p>` : ''}
      `;
    } else {
      html = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    }
  }

  element.innerHTML = html;
}

// Copy all data as JSON
async function copyAllJson() {
  if (!extractedData) {
    alert('No data to copy. Please extract first.');
    return;
  }

  const json = JSON.stringify(extractedData, null, 2);
  await copyToClipboard(json, copyAllJsonBtn);
}

// Initialize accordion
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('open');
    });
  });
}

// Initialize copy buttons
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const section = button.dataset.section;

      if (section === 'photos') {
        const photos = extractedData?.success?.photos;
        if (photos && Array.isArray(photos)) {
          await copyToClipboard(photos.join('\n'), button);
        }
      } else if (section === 'amenities') {
        const amenities = extractedData?.success?.amenities;
        if (amenities && Array.isArray(amenities)) {
          await copyToClipboard(amenities.join('\n'), button);
        }
      } else if (section === 'pricing') {
        const p = extractedData?.success?.pricing;
        if (p) {
          const sym = p.currencySymbol || '';
          const cur = p.currency || '';
          const lines = [
            `Prix total : ${sym}${p.totalPrice?.toLocaleString() || 'N/A'} ${cur}${p.nights ? ` (${p.nights} nuits)` : ''}`,
            `Prix / nuit : ${sym}${p.perNight?.toLocaleString() || 'N/A'} ${cur}`,
          ];
          if (p.checkIn && p.checkOut) lines.push(`Dates : ${p.checkIn} → ${p.checkOut}`);
          await copyToClipboard(lines.join('\n'), button);
        }
      } else {
        const data = extractedData?.success?.[section];
        if (data) {
          const text = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
          await copyToClipboard(text, button);
        }
      }
    });
  });
}

// Copy to clipboard with visual feedback
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);

    // Visual feedback
    const originalText = button.textContent;
    button.classList.add('success');
    button.textContent = '✓ Copied';

    setTimeout(() => {
      button.classList.remove('success');
      button.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('[Sidebar] Copy error:', error);
    alert('Failed to copy to clipboard');
  }
}

// Show/hide loading
function showLoading() {
  loading.classList.remove('hidden');
  extractBtn.disabled = true;
}

function hideLoading() {
  loading.classList.add('hidden');
  extractBtn.disabled = false;
}

// Show/hide error
function showError(errors) {
  errorList.innerHTML = '';
  errors.forEach(error => {
    const li = document.createElement('li');
    li.textContent = `${error.section}: ${error.message}`;
    errorList.appendChild(li);
  });
  errorBanner.classList.remove('hidden');
}

function hideError() {
  errorBanner.classList.add('hidden');
}
