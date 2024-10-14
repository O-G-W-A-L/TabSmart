import React, { useState } from 'react';

const GroupTabs = ({ tabs, onGroupCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedTabs, setSelectedTabs] = useState([]);

  const handleGroupCreate = () => {
    if (groupName && selectedTabs.length > 0) {
      onGroupCreate(groupName, selectedTabs);
      setGroupName('');
      setSelectedTabs([]);
    }
  };

  const toggleTabSelection = (tabId) => {
    setSelectedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        className="p-2 border rounded"
      />
      <div className="mt-2 max-h-40 overflow-y-auto">
        {tabs.map(tab => (
          <div key={tab.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedTabs.includes(tab.id)}
              onChange={() => toggleTabSelection(tab.id)}
              className="mr-2"
            />
            <span className="truncate">{tab.title}</span>
          </div>
        ))}
      </div>
      <button onClick={handleGroupCreate} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Create Group
      </button>
    </div>
  );
};

export default GroupTabs;