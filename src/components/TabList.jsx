import React from 'react';
import TabItem from './TabItem';
import TabPreview from './TabPreview';

const TabList = ({ tabs, onClose, onSwitch, onGroup, onHibernate, onRestore }) => {
  return (
    <ul className="space-y-2 max-h-96 overflow-y-auto">
      {tabs.map((tab) => (
        <li key={tab.id} className="relative">
          <TabItem 
            tab={tab} 
            onClose={onClose} 
            onSwitch={onSwitch}
            onGroup={onGroup}
            onHibernate={onHibernate}
            onRestore={onRestore}
          />
          <TabPreview tab={tab} />
        </li>
      ))}
    </ul>
  );
};

export default TabList;