import { groupSimilarTabs, suspendInactiveTabs, detectDuplicateTabs } from './utils/tabUtils.js';

console.log('TabSmart background script loaded');

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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        console.log('Sending togglePinned message to tab:', tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePinned', isPinned: request.isPinned});
      }
    });
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

function toggleFocusMode() {
  chrome.storage.local.get('focusModeEnabled', (data) => {
    const newFocusModeState = !data.focusModeEnabled;
    chrome.storage.local.set({ focusModeEnabled: newFocusModeState });
    if (newFocusModeState) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Focus Mode Enabled',
        message: 'Stay focused! Distracting websites are now blocked.'
      });
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Focus Mode Disabled',
        message: 'Focus Mode has been turned off.'
      });
    }
  });
}

// Set up periodic tasks
chrome.alarms.create('periodicTasks', { periodInMinutes: 15 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicTasks') {
    groupSimilarTabs();
    suspendInactiveTabs();
    detectDuplicateTabs();
  }
});