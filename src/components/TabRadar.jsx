import React from 'react';

const TabRadar = ({ tabs, onClose, onSwitch }) => {
  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  return (
    <svg width="400" height="400" className="tab-radar">
      {tabs.map((tab, index) => {
        const angle = (index / tabs.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return (
          <g key={tab.id} transform={`translate(${x}, ${y})`}>
            <circle r="20" fill="#4299e1" />
            <text 
              textAnchor="middle" 
              dy=".3em" 
              fill="white" 
              fontSize="12"
              onClick={() => onSwitch(tab.id)}
            >
              {tab.title.slice(0, 1)}
            </text>
            <title>{tab.title}</title>
          </g>
        );
      })}
    </svg>
  );
};

export default TabRadar;