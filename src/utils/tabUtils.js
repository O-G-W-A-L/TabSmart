export async function groupSimilarTabs() {
  const tabs = await chrome.tabs.query({});
  const groups = {};

  tabs.forEach(tab => {
    const domain = new URL(tab.url).hostname;
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(tab.id);
  });

  for (const [domain, tabIds] of Object.entries(groups)) {
    if (tabIds.length > 1) {
      await chrome.tabs.group({ tabIds });
      const group = await chrome.tabGroups.update(tabIds[0], { title: domain });
      console.log(`Created group for ${domain} with ${tabIds.length} tabs`);
    }
  }
}

export async function suspendInactiveTabs() {
  const tabs = await chrome.tabs.query({ active: false });
  const currentTime = Date.now();
  const inactivityThreshold = 30 * 60 * 1000; // 30 minutes

  tabs.forEach(async (tab) => {
    if (currentTime - tab.lastAccessed > inactivityThreshold) {
      await chrome.tabs.discard(tab.id);
      console.log(`Suspended inactive tab: ${tab.title}`);
    }
  });
}

export async function detectDuplicateTabs() {
  const tabs = await chrome.tabs.query({});
  const urlMap = new Map();

  tabs.forEach(tab => {
    if (urlMap.has(tab.url)) {
      chrome.tabs.remove(tab.id);
      console.log(`Closed duplicate tab: ${tab.title}`);
    } else {
      urlMap.set(tab.url, tab.id);
    }
  });
}