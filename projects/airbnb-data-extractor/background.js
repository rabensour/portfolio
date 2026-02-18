// Background Service Worker - Message Router
console.log('[Background] Service worker loaded');

// Message listener - routes messages between sidebar and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Message received:', message.type);

  if (message.type === 'REQUEST_EXTRACTION') {
    // Route extraction request from sidebar to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('[Background] Error sending to content script:', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      }
    });
    return true; // Keep channel open for async response
  }

  if (message.type === 'DATA_EXTRACTED') {
    // Route extracted data from content script to sidebar
    chrome.runtime.sendMessage(message);
    sendResponse({ received: true });
  }

  if (message.type === 'FETCH_IMAGE') {
    // Fetch image to bypass CORS restrictions
    fetch(message.url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({
            success: true,
            data: reader.result,
            size: blob.size
          });
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('[Background] Fetch image error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Async response
  }

  if (message.type === 'DOWNLOAD_PHOTOS_ZIP') {
    // Trigger download of photos ZIP
    chrome.downloads.download({
      url: message.url,
      filename: message.filename,
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });
    return true;
  }
});

// Open side panel when extension icon clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
