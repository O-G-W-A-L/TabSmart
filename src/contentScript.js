console.log('TabSmart content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'updatePinState') {
    const isPinned = request.isPinned;
    updatePinnedUI(isPinned);
    sendResponse({ success: true });
  }
  return true; // Indicates that the response will be sent asynchronously
});

// Function to update the UI based on pin state
function updatePinnedUI(isPinned) {
  const pinnedElementId = 'tabsmart-pinned-element';
  
  let pinnedElement = document.getElementById(pinnedElementId);
  
  if (isPinned) {
    if (!pinnedElement) {
      pinnedElement = document.createElement('div');
      pinnedElement.id = pinnedElementId;
      pinnedElement.style.position = 'fixed';
      pinnedElement.style.top = '10px';
      pinnedElement.style.right = '10px';
      pinnedElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      pinnedElement.style.border = '1px solid #ccc';
      pinnedElement.style.padding = '10px';
      pinnedElement.style.zIndex = '10000';
      pinnedElement.innerText = 'TabSmart Extension - Pinned';
      document.body.appendChild(pinnedElement);
    }
  } else {
    if (pinnedElement) {
      document.body.removeChild(pinnedElement);
    }
  }
}

// Check initial pin state when content script loads
chrome.runtime.sendMessage({action: 'getPinState'}, (response) => {
  if (response && response.isPinned !== undefined) {
    updatePinnedUI(response.isPinned);
  }
});