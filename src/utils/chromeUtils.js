export const getTabs = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs);
    });
  });
};

export const closeTab = (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.remove(tabId, resolve);
  });
};

export const switchToTab = (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, { active: true }, resolve);
  });
};

export const createTabGroup = (groupName, tabIds) => {
  return new Promise((resolve) => {
    chrome.tabs.group({ tabIds }, (groupId) => {
      chrome.tabGroups.update(groupId, { title: groupName }, resolve);
    });
  });
};

export const hibernateTab = (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.discard(tabId, resolve);
  });
};

export const restoreTab = (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.reload(tabId, resolve);
  });
};

export const saveSession = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const session = tabs.map(tab => ({
        url: tab.url,
        title: tab.title,
        pinned: tab.pinned
      }));
      chrome.storage.local.set({ savedSession: session }, resolve);
    });
  });
};

export const restoreSession = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['savedSession'], (result) => {
      if (result.savedSession) {
        result.savedSession.forEach(tab => {
          chrome.tabs.create({ url: tab.url, pinned: tab.pinned });
        });
      }
      resolve();
    });
  });
};