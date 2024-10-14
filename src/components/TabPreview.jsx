import React, { useState } from 'react';

const TabPreview = ({ tab }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div 
      className="absolute z-10 right-0 mt-2" 
      onMouseEnter={() => setShowPreview(true)} 
      onMouseLeave={() => setShowPreview(false)}
    >
      {showPreview && (
        <div className="p-2 bg-white border rounded shadow-lg">
          <img src={`https://api.apiflash.com/v1/urltoimage?access_key=YOUR_API_KEY&url=${encodeURIComponent(tab.url)}&width=320&height=240`} alt={tab.title} className="w-80 h-60 object-cover" />
          <p className="mt-2 text-sm">{tab.title}</p>
        </div>
      )}
    </div>
  );
};

export default TabPreview;