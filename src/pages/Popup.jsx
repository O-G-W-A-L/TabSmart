import React, { useState, useEffect } from 'react';
import TabList from '../components/TabList';
import SearchBar from '../components/SearchBar';
import GroupTabs from '../components/GroupTabs';
import { getTabs, closeTab, switchToTab, createTabGroup } from '../utils/chromeUtils';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    const allTabs = await getTabs();
    setTabs(allTabs);
    setFilteredTabs(allTabs);
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

  return (
    <div className="p-4 w-96">
      <h1 className="text-2xl font-bold mb-4">TabSmart</h1>
      <SearchBar onSearch={handleSearch} />
      <TabList 
        tabs={filteredTabs} 
        onClose={handleClose} 
        onSwitch={handleSwitch}
        onGroup={handleGroupCreate}
      />
      <GroupTabs onGroupCreate={handleGroupCreate} />
    </div>
  );
};

export default Popup;
