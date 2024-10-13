import React, { useState, useEffect } from 'react';
import TabList from '../components/TabList';
import SearchBar from '../components/SearchBar';
import GroupTabs from '../components/GroupTabs';
import PinToggle from '../components/PinToggle';
import TabRadar from '../components/TabRadar';
import FocusMode from '../components/FocusMode';
import SessionManager from '../components/SessionManager';
import { getTabs, closeTab, switchToTab, createTabGroup, hibernateTab, restoreTab } from '../utils/chromeUtils';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'radar'

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
    console.log('Toggling pinned state');
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await chrome.storage.local.set({ isPinned: newPinnedState });
    chrome.runtime.sendMessage({ action: 'togglePin', isPinned: newPinnedState });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'radar' : 'list');
  };

  const handleHibernate = async (tabId) => {
    await hibernateTab(tabId);
    loadTabs();
  };

  const handleRestore = async (tabId) => {
    await restoreTab(tabId);
    loadTabs();
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">TabSmart</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleViewMode} className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-400">
            {viewMode === 'list' ? 'Radar View' : 'List View'}
          </button>
          <PinToggle isPinned={isPinned} onToggle={togglePinned} />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <SearchBar onSearch={handleSearch} />
        <FocusMode />
        <SessionManager />
        {viewMode === 'list' ? (
          <TabList 
            tabs={filteredTabs} 
            onClose={handleClose} 
            onSwitch={handleSwitch}
            onGroup={handleGroupCreate}
            onHibernate={handleHibernate}
            onRestore={handleRestore}
          />
        ) : (
          <TabRadar 
            tabs={filteredTabs} 
            onClose={handleClose} 
            onSwitch={handleSwitch}
          />
        )}
        <GroupTabs onGroupCreate={handleGroupCreate} />
      </div>
    </div>
  );
};

export default Popup;