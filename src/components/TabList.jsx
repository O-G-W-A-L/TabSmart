import React from 'react';
import TabItem from './TabItem';

const TabList = ({ tabs, onClose, onSwitch, onGroup }) => {
  return (
    <ul className="space-y-2 max-h-96 overflow-y-auto">
      {tabs.map((tab) => (
        <TabItem 
          key={tab.id} 
          tab={tab} 
          onClose={onClose} 
          onSwitch={onSwitch}
          onGroup={onGroup}
        />
      ))}
    </ul>
  );
};

export default TabList;