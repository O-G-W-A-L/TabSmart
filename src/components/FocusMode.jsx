import React, { useState, useEffect } from 'react';

const FocusMode = () => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('focusModeEnabled', (data) => {
      setFocusModeEnabled(data.focusModeEnabled || false);
    });
  }, []);

  const toggleFocusMode = () => {
    const newFocusModeState = !focusModeEnabled;
    setFocusModeEnabled(newFocusModeState);
    chrome.runtime.sendMessage({ action: 'toggleFocusMode' });
  };

  return (
    <div className="mb-4">
      <button
        onClick={toggleFocusMode}
        className={`px-4 py-2 rounded ${
          focusModeEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold`}
      >
        {focusModeEnabled ? 'Disable Focus Mode' : 'Enable Focus Mode'}
      </button>
    </div>
  );
};

export default FocusMode;
