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