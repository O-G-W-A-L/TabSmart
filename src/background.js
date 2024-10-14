import { groupSimilarTabs, suspendInactiveTabs, detectDuplicateTabs } from './utils/tabUtils.js';

console.log('TabSmart background script loaded');

let pinnedWindowId = null;
let lastPopupSize = { width: 300, height: 600 };
let pinnedTabId = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log('TabSmart installed');
  chrome.storage.local.set({ 
    isPinned: false,
    focusModeEnabled: false,
    suspendedTabs: [],
    tabNotes: {}
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  if (request.action === 'togglePin') {
    togglePinPopup(request.isPinned, request.tabId);
    sendResponse({ success: true });
  } else if (request.action === 'savePopupSize') {
    lastPopupSize = { width: request.width, height: request.height };
    sendResponse({ success: true });
  } else if (request.action === 'groupSimilarTabs') {
    groupSimilarTabs();
    sendResponse({ success: true });
  } else if (request.action === 'suspendInactiveTabs') {
    suspendInactiveTabs();
    sendResponse({ success: true });
  } else if (request.action === 'detectDuplicateTabs') {
    detectDuplicateTabs();
    sendResponse({ success: true });
  } else if (request.action === 'toggleFocusMode') {
    toggleFocusMode();
    sendResponse({ success: true });
  }
  return true; // Indicates that the response will be sent asynchronously
});

function togglePinPopup(isPinned, tabId) {
  if (isPinned) {
    chrome.windows.getCurrent((window) => {
      const width = lastPopupSize.width;
      const height = lastPopupSize.height;
      const left = window.left + window.width - width - 20;
      const top = window.top + 20;

      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top,
        focused: true
      }, (createdWindow) => {
        pinnedWindowId = createdWindow.id;
        pinnedTabId = tabId;
        // Update the window state without the unsupported 'titlebar' property
        chrome.windows.update(createdWindow.id, { 
          state: 'normal',
          focused: true
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error updating window:', chrome.runtime.lastError);
          }
        });
        // Close the popup in the original tab
        chrome.action.setPopup({ tabId: tabId, popup: '' }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error setting popup:', chrome.runtime.lastError);
          }
        });
      });
    });
  } else if (pinnedWindowId) {
    chrome.windows.remove(pinnedWindowId, () => {
      if (chrome.runtime.lastError) {
        console.error('Error removing window:', chrome.runtime.lastError);
      } else {
        pinnedWindowId = null;
        // Restore the popup for the original tab
        chrome.action.setPopup({ tabId: pinnedTabId, popup: 'index.html' }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error restoring popup:', chrome.runtime.lastError);
          }
          pinnedTabId = null;
        });
      }
    });
  }
  chrome.storage.local.set({ isPinned: isPinned }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting isPinned:', chrome.runtime.lastError);
    }
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (pinnedWindowId && pinnedTabId && activeInfo.tabId === pinnedTabId) {
    chrome.windows.update(pinnedWindowId, { focused: true }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error focusing pinned window:', chrome.runtime.lastError);
      }
    });
  }
});

function toggleFocusMode() {
  chrome.storage.local.get('focusModeEnabled', (data) => {
    if (chrome.runtime.lastError) {
      console.error('Error getting focusModeEnabled:', chrome.runtime.lastError);
      return;
    }
    const newFocusModeState = !data.focusModeEnabled;
    chrome.storage.local.set({ focusModeEnabled: newFocusModeState }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting focusModeEnabled:', chrome.runtime.lastError);
        return;
      }
      const notificationOptions = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: newFocusModeState ? 'Focus Mode Enabled' : 'Focus Mode Disabled',
        message: newFocusModeState ? 'Stay focused! Distracting websites are now blocked.' : 'Focus Mode has been turned off.'
      };
      chrome.notifications.create(notificationOptions, (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error('Error creating notification:', chrome.runtime.lastError);
        }
      });
    });
  });
}

// Set up periodic tasks
chrome.alarms.create('periodicTasks', { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicTasks') {
    groupSimilarTabs().catch(error => console.error('Error grouping similar tabs:', error));
    suspendInactiveTabs().catch(error => console.error('Error suspending inactive tabs:', error));
    detectDuplicateTabs().catch(error => console.error('Error detecting duplicate tabs:', error));
  }
});