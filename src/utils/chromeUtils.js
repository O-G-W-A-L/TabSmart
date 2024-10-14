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

export const detectDuplicates = (tabs) => {
  const urlCounts = {};
  tabs.forEach(tab => {
    urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1;
  });
  return Object.fromEntries(Object.entries(urlCounts).filter(([, count]) => count > 1));
};

export const closeDuplicates = (url) => {
  return new Promise((resolve) => {
    chrome.tabs.query({ url }, (tabs) => {
      const tabIds = tabs.slice(1).map(tab => tab.id);
      chrome.tabs.remove(tabIds, resolve);
    });
  });
};

export const sortTabs = (tabs, sortType) => {
  switch (sortType) {
    case 'title':
      return tabs.sort((a, b) => a.title.localeCompare(b.title));
    case 'domain':
      return tabs.sort((a, b) => new URL(a.url).hostname.localeCompare(new URL(b.url).hostname));
    case 'recent':
      return tabs.sort((a, b) => b.lastAccessed - a.lastAccessed);
    case 'opened':
      return tabs.sort((a, b) => a.id - b.id);
    default:
      return tabs;
  }
};

export const saveSession = async (sessionName) => {
  const tabs = await getTabs();
  const session = {
    name: sessionName,
    tabs: tabs.map(tab => ({ url: tab.url, title: tab.title })),
    timestamp: Date.now()
  };
  return new Promise((resolve) => {
    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      sessions.push(session);
      chrome.storage.local.set({ sessions }, () => {
        resolve(session);
      });
    });
  });
};

export const restoreSession = async (sessionName) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['sessions'], (result) => {
      const sessions = result.sessions || [];
      const session = sessions.find(s => s.name === sessionName);
      if (session) {
        session.tabs.forEach(tab => {
          chrome.tabs.create({ url: tab.url });
        });
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

// Add new togglePinned functionality
export const togglePinned = (tabId) => {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, { pinned: true }, (tab) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError });
      } else {
        resolve({ success: true, tab });
      }
    });
  });
};
