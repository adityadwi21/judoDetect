// Background service worker for Judol Detector
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Judol Detector installed');
    
    // Set default settings
    chrome.storage.sync.set({
      'judol_detector_enabled': true,
      'sensitivity_level': 'medium',
      'auto_hide': true,
      'show_confidence': true
    });
  } else if (details.reason === 'update') {
    console.log('Judol Detector updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get([
      'judol_detector_enabled',
      'sensitivity_level', 
      'auto_hide',
      'show_confidence'
    ], (result) => {
      sendResponse({
        enabled: result.judol_detector_enabled !== false,
        sensitivity: result.sensitivity_level || 'medium',
        autoHide: result.auto_hide !== false,
        showConfidence: result.show_confidence !== false
      });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'updateStats') {
    // Update badge with spam count
    if (request.spamCount > 0) {
      chrome.action.setBadgeText({
        text: request.spamCount.toString(),
        tabId: sender.tab.id
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#ef4444'
      });
    } else {
      chrome.action.setBadgeText({
        text: '',
        tabId: sender.tab.id
      });
    }
  }
});

// Clear badge when tab is closed or navigated away
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({
    text: '',
    tabId: tabId
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.includes('youtube.com')) {
    chrome.action.setBadgeText({
      text: '',
      tabId: tabId
    });
  }
});