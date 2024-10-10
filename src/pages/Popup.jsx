import React, { useState, useEffect } from 'react';
import TabList from '../components/TabList';
import SearchBar from '../components/SearchBar';
import GroupTabs from '../components/GroupTabs';
import PinToggle from '../components/PinToggle';
import { getTabs, closeTab, switchToTab, createTabGroup } from '../utils/chromeUtils';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    loadTabs();
    loadPinnedState();
  }, []);

  const loadTabs = async () => {
    const allTabs = await getTabs();
    setTabs(allTabs);
    setFilteredTabs(allTabs);
  };

  const loadPinnedState = async () => {
    const { isPinned } = await chrome.storage.local.get('isPinned');
    setIsPinned(isPinned);
  };

  const handleClose = async (tabId) => {
    await closeTab(tabId);
    loadTabs();
  };

  const handleSwitch = async (tabId) => {
    await switchToTab(tabId);
  };

  const handleSearch = (searchTerm) => {
    const filtered = tabs.filter(tab => 
      tab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tab.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTabs(filtered);
  };

  const handleGroupCreate = async (groupName) => {
    await createTabGroup(groupName, filteredTabs.map(tab => tab.id));
    loadTabs();
  };

  const togglePinned = async () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await chrome.storage.local.set({ isPinned: newPinnedState });
  };

  return (
    <div className={`w-96 h-[600px] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col ${isPinned ? 'fixed top-0 right-0' : ''}`}>
      <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="text-2xl font-bold">TabSmart</h1>
        <PinToggle isPinned={isPinned} onToggle={togglePinned} />
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <SearchBar onSearch={handleSearch} />
        <TabList 
          tabs={filteredTabs} 
          onClose={handleClose} 
          onSwitch={handleSwitch}
          onGroup={handleGroupCreate}
        />
        <GroupTabs onGroupCreate={handleGroupCreate} />
      </div>
    </div>
  );
};

export default Popup;