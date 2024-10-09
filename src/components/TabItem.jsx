import React from 'react';

const TabItem = ({ tab, onClose, onSwitch, onGroup }) => {
  return (
    <li className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center space-x-2">
        <img src={tab.favIconUrl} alt="" className="w-4 h-4" />
        <span className="truncate w-40">{tab.title}</span>
      </div>
      <div className="space-x-2">
        <button onClick={() => onSwitch(tab.id)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
          Switch
        </button>
        <button onClick={() => onGroup(tab.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
          Group
        </button>
        <button onClick={() => onClose(tab.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
          Close
        </button>
      </div>
    </li>
  );
};

export default TabItem;