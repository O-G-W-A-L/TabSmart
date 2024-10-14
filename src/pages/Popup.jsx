import React, { useState, useEffect, useRef } from 'react';
import TabList from '../components/TabList';
import SearchBar from '../components/SearchBar';
import GroupTabs from '../components/GroupTabs';
import FocusMode from '../components/FocusMode';
import SessionManager from '../components/SessionManager';
import TabRadar from '../components/TabRadar';
import PinToggle from '../components/PinToggle';
import { getTabs, closeTab, switchToTab, createTabGroup, hibernateTab, restoreTab, detectDuplicates, closeDuplicates, sortTabs } from '../utils/chromeUtils';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [isPinned, setIsPinned] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const popupRef = useRef(null);

  useEffect(() => {
    loadTabs();
    loadPinnedState();
    
    // Save popup size when it changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        chrome.runtime.sendMessage({ 
          action: 'savePopupSize', 
          width: Math.round(width), 
          height: Math.round(height) 
        });
      }
    });

    if (popupRef.current) {
      resizeObserver.observe(popupRef.current);
    }

    return () => {
      if (popupRef.current) {
        resizeObserver.unobserve(popupRef.current);
      }
    };
  }, []);

  const loadTabs = async () => {
    const allTabs = await getTabs();
    setTabs(allTabs);
    setFilteredTabs(allTabs);
    const duplicateTabs = await detectDuplicates(allTabs);
    setDuplicates(duplicateTabs);
  };

  const loadPinnedState = async () => {
    const { isPinned } = await chrome.storage.local.get('isPinned');
    setIsPinned(isPinned);
  };

  const handleSearch = (query) => {
    const filtered = tabs.filter(tab => 
      tab.title.toLowerCase().includes(query.toLowerCase()) || 
      tab.url.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTabs(filtered);
  };

  const handleClose = async (tabId) => {
    await closeTab(tabId);
    loadTabs();
  };

  const handleSwitch = async (tabId) => {
    await switchToTab(tabId);
  };

  const handleHibernate = async (tabId) => {
    await hibernateTab(tabId);
    loadTabs();
  };

  const handleRestore = async (tabId) => {
    await restoreTab(tabId);
    loadTabs();
  };

  const handleGroupCreate = async (groupName, selectedTabIds) => {
    await createTabGroup(groupName, selectedTabIds);
    loadTabs();
  };

  const handleCloseDuplicates = async (url) => {
    await closeDuplicates(url);
    loadTabs();
  };

  const handleSort = async (sortType) => {
    const sortedTabs = await sortTabs(tabs, sortType);
    setTabs(sortedTabs);
    setFilteredTabs(sortedTabs);
  };

  const togglePinned = async () => {
    console.log('Toggling pinned state');
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    await chrome.storage.local.set({ isPinned: newPinnedState });
    
    // Get the current tab ID
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        // Notify background script to update pinned state
        chrome.runtime.sendMessage({ 
          action: 'togglePin', 
          isPinned: newPinnedState, 
          tabId: tabs[0].id 
        });

        if (newPinnedState) {
          // Close the popup if it's being pinned
          window.close();
        }
      }
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'radar' : 'list');
  };

  return (
    <div ref={popupRef} className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
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
            duplicates={duplicates}
            onCloseDuplicates={handleCloseDuplicates}
          />
        ) : (
          <TabRadar 
            tabs={filteredTabs} 
            onClose={handleClose} 
            onSwitch={handleSwitch}
          />
        )}
        <GroupTabs tabs={filteredTabs} onGroupCreate={handleGroupCreate} />
      </div>
    </div>
  );
};

export default Popup;