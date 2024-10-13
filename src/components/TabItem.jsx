import React from 'react';

const TabItem = ({ tab, onClose, onSwitch, onGroup, onHibernate, onRestore }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center flex-grow">
        <img src={tab.favIconUrl} alt="" className="w-4 h-4 mr-2" />
        <span className="truncate">{tab.title}</span>
      </div>
      <div className="flex space-x-1">
        <button onClick={() => onSwitch(tab.id)} className="p-1 bg-blue-500 text-white rounded">Switch</button>
        <button onClick={() => onClose(tab.id)} className="p-1 bg-red-500 text-white rounded">Close</button>
        {tab.discarded ? (
          <button onClick={() => onRestore(tab.id)} className="p-1 bg-green-500 text-white rounded">Restore</button>
        ) : (
          <button onClick={() => onHibernate(tab.id)} className="p-1 bg-yellow-500 text-white rounded">Hibernate</button>
        )}
      </div>
    </div>
  );
};

export default TabItem;