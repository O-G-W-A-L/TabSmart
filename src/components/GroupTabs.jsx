import React, { useState } from 'react';

const GroupTabs = ({ onGroupCreate }) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      onGroupCreate(groupName);
      setGroupName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="New group name"
        className="p-2 border rounded mr-2"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Create Group
      </button>
    </form>
  );
};

export default GroupTabs;
