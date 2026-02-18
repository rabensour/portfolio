// Content Script - Orchestrates extraction from Airbnb pages
console.log('[Content Script] Loaded on:', window.location.href);

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Content Script] Message received:', message.type);

  if (message.type === 'REQUEST_EXTRACTION') {
    console.log('[Content Script] Starting extraction...');

    try {
      const data = extractAllData();
      console.log('[Content Script] Extraction complete:', data);

      sendResponse({
        success: true,
        data
      });
    } catch (error) {
      console.error('[Content Script] Extraction error:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }

    return true; // Keep channel open for async response
  }
});

/**
 * Main extraction function
 * Strategy: Try JSON first (reliable), fallback to DOM (resilient)
 */
function extractAllData() {
  const results = {
    success: {},
    errors: []
  };

  let extractedData = null;

  // Step 1: Try JSON extraction (Priority 1)
  try {
    console.log('[Content Script] Attempting JSON extraction...');
    extractedData = extractFromJSON();
    console.log('[Content Script] JSON extraction successful');
  } catch (jsonError) {
    console.warn('[Content Script] JSON extraction failed:', jsonError.message);

    // Step 2: Fallback to DOM extraction
    try {
      console.log('[Content Script] Falling back to DOM extraction...');
      extractedData = extractFromDOM();
      console.log('[Content Script] DOM extraction successful');
    } catch (domError) {
      console.error('[Content Script] DOM extraction also failed:', domError.message);
      throw new Error('Both JSON and DOM extraction failed');
    }
  }

  // Step 3: Process each section independently (resilient extraction)
  const sections = [
    'title',
    'description',
    'photos',
    'amenities',
    'pricing'
  ];

  sections.forEach(section => {
    try {
      const sectionData = extractedData[section];

      // If JSON extraction missed this section, try DOM fallback
      if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
        console.log(`[Content Script] Section '${section}' empty from JSON, trying DOM fallback...`);

        try {
          const domData = extractFromDOM();
          extractedData[section] = domData[section];
        } catch (e) {
          console.warn(`[Content Script] DOM fallback failed for ${section}:`, e.message);
        }
      }

      // Validate section data
      const validation = validateSection(section, extractedData[section]);

      if (validation.valid) {
        results.success[section] = extractedData[section];

        // Log warnings
        if (validation.warnings.length > 0) {
          console.warn(`[Content Script] Warnings for ${section}:`, validation.warnings);
        }
      } else {
        // Data invalid, but include it anyway with error note
        results.success[section] = extractedData[section];
        results.errors.push({
          section,
          message: validation.errors.join(', '),
          suggestion: 'Data may be incomplete or in unexpected format'
        });
      }
    } catch (error) {
      console.error(`[Content Script] Error extracting ${section}:`, error);
      results.errors.push({
        section,
        message: error.message,
        suggestion: 'Airbnb structure may have changed for this section'
      });
    }
  });

  // Log summary
  const successCount = Object.keys(results.success).length;
  const errorCount = results.errors.length;
  console.log(`[Content Script] Extraction complete: ${successCount} sections extracted, ${errorCount} errors`);

  return results;
}

// Signal that content script is ready
console.log('[Content Script] Ready for extraction');
